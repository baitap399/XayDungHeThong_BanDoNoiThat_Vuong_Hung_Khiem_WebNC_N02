import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../database/entities/cart.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { OrderStatus, PaymentMethod, PaymentRecordStatus, PaymentStatus } from '../database/entities/enums';
import { Order } from '../database/entities/order.entity';
import { OrderItem } from '../database/entities/order-item.entity';
import { Payment } from '../database/entities/payment.entity';
import { Product } from '../database/entities/product.entity';
import { User } from '../database/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
 
@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Cart) private readonly carts: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItems: Repository<CartItem>,
    @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}
 
  async create(userId: number, dto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await manager.getRepository(Cart).findOne({ where: { userId } });
      if (!cart) throw new BadRequestException('Giỏ hàng đang trống');
      const cartItems = await manager.getRepository(CartItem).find({ where: { cartId: cart.id }, relations: ['product'] });
      if (!cartItems.length) throw new BadRequestException('Giỏ hàng đang trống');
 
      let total = 0;
      for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(`Sản phẩm ${item.product.name} không đủ tồn kho`);
        }
        total += Number(item.product.price) * item.quantity;
      }
 
      const isCash = dto.paymentMethod === PaymentMethod.CASH;
      const order = manager.create(Order, {
        userId,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        totalAmount: String(total),
        status: OrderStatus.PENDING,
        paymentMethod: dto.paymentMethod,
        paymentStatus: isCash ? PaymentStatus.UNPAID : PaymentStatus.PAID,
        note: dto.note ?? null,
      });
      const savedOrder = await manager.save(Order, order);
 
      const orderRows = cartItems.map((item) => manager.create(OrderItem, {
        orderId: savedOrder.id,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: String(Number(item.product.price) * item.quantity),
      }));
      await manager.save(OrderItem, orderRows);
 
      const payment = manager.create(Payment, {
        orderId: savedOrder.id,
        method: dto.paymentMethod,
        amount: String(total),
        status: isCash ? PaymentRecordStatus.PENDING : PaymentRecordStatus.SUCCESS,
        transactionId: isCash ? null : `OFFLINE-${savedOrder.id}`,
        paidAt: isCash ? null : new Date(),
      });
      await manager.save(Payment, payment);
      await manager.getRepository(CartItem).delete({ cartId: cart.id });
 
      return this.getOneForUser(userId, savedOrder.id, manager.getRepository(Order));
    });
  }
 
  async listForUser(userId: number) {
    const orders = await this.orders.find({ where: { userId }, relations: ['items'], order: { createdAt: 'DESC' } });
    return orders.map((order) => this.serialize(order));
  }
 
  async getOneForUser(userId: number, id: number, repo = this.orders) {
    const order = await repo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.userId !== userId) throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    return this.serialize(order);
  }
 
  async adminList() {
    const orders = await this.orders.find({ relations: ['items', 'user'], order: { createdAt: 'DESC' } });
    return orders.map((order) => ({ ...this.serialize(order), user: order.user ? { id: order.user.id, username: order.user.username } : null }));
  }
 
  async adminUpdateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    order.status = dto.status;
    if (dto.status === OrderStatus.DELIVERED && order.paymentMethod === PaymentMethod.CASH) {
      order.paymentStatus = PaymentStatus.PAID;
      const payment = await this.payments.findOne({ where: { orderId: order.id } });
      if (payment) {
        payment.status = PaymentRecordStatus.SUCCESS;
        payment.paidAt = new Date();
        await this.payments.save(payment);
      }
    }
    return this.serialize(await this.orders.save(order));
  }
 
  async dashboardSummary() {
    const paidRevenue = await this.orders
      .createQueryBuilder('o')
      .select('COALESCE(SUM(o.total_amount), 0)', 'revenue')
      .where('o.payment_status = :status', { status: PaymentStatus.PAID })
      .getRawOne<{ revenue: string }>();
 
    const [orders, users, products, pendingOrders, revenueByDay, ordersByDay] = await Promise.all([
      this.orders.count(),
      this.users.count(),
      this.products.count(),
      this.orders.count({ where: { status: OrderStatus.PENDING } }),
      this.orders
        .createQueryBuilder('o')
        .select("DATE_FORMAT(o.created_at, '%Y-%m-%d')", 'day')
        .addSelect('COALESCE(SUM(o.total_amount), 0)', 'value')
        .where('o.payment_status = :paid', { paid: PaymentStatus.PAID })
        .andWhere('o.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)')
        .groupBy("DATE_FORMAT(o.created_at, '%Y-%m-%d')")
        .orderBy("DATE_FORMAT(o.created_at, '%Y-%m-%d')", 'ASC')
        .getRawMany<{ day: string; value: string }>(),
      this.orders
        .createQueryBuilder('o')
        .select("DATE_FORMAT(o.created_at, '%Y-%m-%d')", 'day')
        .addSelect('COUNT(o.id)', 'value')
        .where('o.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)')
        .groupBy("DATE_FORMAT(o.created_at, '%Y-%m-%d')")
        .orderBy("DATE_FORMAT(o.created_at, '%Y-%m-%d')", 'ASC')
        .getRawMany<{ day: string; value: string }>(),
    ]);
    const recent = await this.orders.find({ relations: ['items'], order: { createdAt: 'DESC' }, take: 8 });
    return {
      revenue: Number(paidRevenue?.revenue ?? 0),
      orders,
      pendingOrders,
      users,
      products,
      chartRevenueByDay: revenueByDay.map((row) => ({ day: String(row.day), value: Number(row.value) })),
      chartOrdersByDay: ordersByDay.map((row) => ({ day: String(row.day), value: Number(row.value) })),
      recentOrders: recent.map((order) => this.serialize(order)),
    };
  }
 
  async revenueSummary() {
    const rows = await this.orders
      .createQueryBuilder('o')
      .select("DATE_FORMAT(o.created_at, '%Y-%m')", 'period')
      .addSelect('COUNT(o.id)', 'orders')
      .addSelect('COALESCE(SUM(CASE WHEN o.payment_status = :paid THEN o.total_amount ELSE 0 END), 0)', 'revenue')
      .setParameter('paid', PaymentStatus.PAID)
      .groupBy("DATE_FORMAT(o.created_at, '%Y-%m')")
      .orderBy('period', 'DESC')
      .getRawMany();
    return rows.map((row) => ({ period: row.period, orders: Number(row.orders), revenue: Number(row.revenue) }));
  }
 
  private serialize(order: Order) {
    return {
      id: order.id,
      userId: order.userId,
      fullName: order.fullName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      note: order.note,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: Number(item.price),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
      })),
    };
  }
}
 