// file định nghĩa entity order-item và ánh xạ dữ liệu của entity này với bảng trong database.
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @Column({ name: 'product_id', type: 'bigint', nullable: true })
  productId: number | null;

  @Column({ name: 'product_name', length: 200 })
  productName: string;

  @Column({ name: 'product_image', type: 'varchar', length: 500, nullable: true })
  productImage: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 0 })
  price: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 0 })
  subtotal: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;
}
