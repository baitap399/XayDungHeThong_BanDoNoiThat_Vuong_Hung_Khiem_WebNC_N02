// file khai báo các endpoint thanh toán PayOS cho frontend và webhook.
import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { type Webhook } from '@payos/node';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { PaymentService } from './payment.service';

@Controller('payment/payos')
export class PaymentController {
  constructor(private readonly payment: PaymentService) {}

  @Post('create-link/:orderId')
  @UseGuards(JwtAuthGuard)
  createPayOSLink(@CurrentUser() user: AuthUser, @Param('orderId', ParseIntPipe) orderId: number) {
    return this.payment.createPayOSLink(user.id, orderId);
  }

  @Post('webhook')
  handlePayOSWebhook(@Body() body: Webhook) {
    return this.payment.handlePayOSWebhook(body);
  }
}
