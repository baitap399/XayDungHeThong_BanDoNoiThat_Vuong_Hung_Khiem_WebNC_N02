// file xử lý PayOS, tạo link thanh toán và cập nhật webhook đã xác thực.
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PayOS, type Webhook, type WebhookData } from '@payos/node';
import { DataSource, Repository } from 'typeorm';
import { PaymentMethod, PaymentRecordStatus, PaymentStatus } from '../database/entities/enums';
import { Order } from '../database/entities/order.entity';
import { Payment } from '../database/entities/payment.entity';

@Injectable()
export class PaymentService {
  private payos: PayOS | null = null;

  constructor(
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
  ) {}

  async createPayOSLink(userId: number, orderId: number) {
    const order = await this.orders.findOne({ where: { id: orderId }, relations: ['payment'] });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.userId !== userId) throw new ForbiddenException('Bạn không có quyền thanh toán đơn hàng này');
    if (order.paymentMethod !== PaymentMethod.PAYOS) throw new BadRequestException('Đơn hàng không dùng PayOS');
    if (order.paymentStatus === PaymentStatus.PAID) throw new BadRequestException('Đơn hàng đã thanh toán');

    const payment = order.payment ?? (await this.payments.findOne({ where: { orderId: order.id } }));
    if (!payment || payment.method !== PaymentMethod.PAYOS || payment.status !== PaymentRecordStatus.PENDING) {
      throw new BadRequestException('Trạng thái thanh toán không hợp lệ');
    }

    const paymentLink = await this.getPayOS().paymentRequests.create({
      orderCode: Number(order.id),
      amount: Number(order.totalAmount),
      description: `DH${order.id}`,
      returnUrl: this.buildReturnUrl(order.id),
      cancelUrl: this.config.getOrThrow<string>('PAYOS_CANCEL_URL'),
      buyerName: order.fullName,
      buyerEmail: order.email,
      buyerPhone: order.phone,
      buyerAddress: order.address,
    });

    return { checkoutUrl: paymentLink.checkoutUrl };
  }

  async handlePayOSWebhook(body: Webhook) {
    let data: WebhookData;
    try {
      data = await this.getPayOS().webhooks.verify(body);
    } catch {
      throw new BadRequestException('Webhook PayOS không hợp lệ');
    }

    if (!body.success || data.code !== '00') {
      return { ok: true };
    }

    return this.dataSource.transaction(async (manager) => {
      const order = await manager.getRepository(Order).findOne({
        where: { id: Number(data.orderCode) },
        relations: ['payment'],
      });
      if (!order) return { ok: true };

      const payment = order.payment ?? (await manager.getRepository(Payment).findOne({ where: { orderId: order.id } }));
      if (!payment || order.paymentMethod !== PaymentMethod.PAYOS || payment.method !== PaymentMethod.PAYOS) {
        return { ok: true };
      }

      if (order.paymentStatus === PaymentStatus.PAID && payment.status === PaymentRecordStatus.SUCCESS) {
        return { ok: true };
      }

      payment.status = PaymentRecordStatus.SUCCESS;
      payment.transactionId = data.reference;
      payment.paidAt = this.parsePayOSDate(data.transactionDateTime);
      order.paymentStatus = PaymentStatus.PAID;

      await manager.save(Payment, payment);
      await manager.save(Order, order);

      return { ok: true };
    });
  }

  private getPayOS() {
    if (!this.payos) {
      this.payos = new PayOS({
        clientId: this.config.getOrThrow<string>('PAYOS_CLIENT_ID'),
        apiKey: this.config.getOrThrow<string>('PAYOS_API_KEY'),
        checksumKey: this.config.getOrThrow<string>('PAYOS_CHECKSUM_KEY'),
      });
    }

    return this.payos;
  }

  private buildReturnUrl(orderId: number) {
    const rawUrl = this.config.get<string>('PAYOS_RETURN_URL', 'http://localhost:5173/checkout/success');
    const resolved = rawUrl.replace(':orderId', String(orderId)).replace('{orderId}', String(orderId));
    if (resolved !== rawUrl) return resolved;

    const [base, query] = rawUrl.split('?');
    const url = `${base.replace(/\/+$/, '')}/${orderId}`;
    return query ? `${url}?${query}` : url;
  }

  private parsePayOSDate(value: string) {
    const parsed = new Date(value.replace(' ', 'T'));
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }
}
