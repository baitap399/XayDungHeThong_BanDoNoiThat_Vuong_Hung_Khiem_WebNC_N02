// file định nghĩa entity cart-item và ánh xạ dữ liệu của entity này với bảng trong database.
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'cart_id', type: 'bigint' })
  cartId: number;

  @Column({ name: 'product_id', type: 'bigint' })
  productId: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
