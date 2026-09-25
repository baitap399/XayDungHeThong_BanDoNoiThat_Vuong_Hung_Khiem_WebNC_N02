// file chứa logic xử lý nghiệp vụ của chức năng cart và làm việc với database khi cần.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../database/entities/cart.entity';
import { CartItem } from '../database/entities/cart-item.entity';
import { Product } from '../database/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly carts: Repository<Cart>,
    @InjectRepository(CartItem) private readonly items: Repository<CartItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  async get(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    const items = await this.items.find({ where: { cartId: cart.id }, relations: ['product'], order: { id: 'ASC' } });
    return this.serialize(cart, items);
  }

  async add(userId: number, productId: number, quantity = 1) {
    if (quantity < 1) throw new BadRequestException('Số lượng không hợp lệ');
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    if (product.stock <= 0) throw new BadRequestException('Sản phẩm đã hết hàng');

    const cart = await this.getOrCreateCart(userId);
    let item = await this.items.findOne({ where: { cartId: cart.id, productId } });
    const nextQuantity = (item?.quantity ?? 0) + quantity;
    if (nextQuantity > product.stock) throw new BadRequestException(`Chỉ còn ${product.stock} sản phẩm trong kho`);

    if (item) item.quantity = nextQuantity;
    else item = this.items.create({ cartId: cart.id, productId, quantity });
    await this.items.save(item);
    return this.get(userId);
  }

  async update(userId: number, productId: number, quantity: number) {
    if (quantity < 1) return this.remove(userId, productId);
    const cart = await this.carts.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng');
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    if (quantity > product.stock) throw new BadRequestException(`Chỉ còn ${product.stock} sản phẩm trong kho`);
    const item = await this.items.findOne({ where: { cartId: cart.id, productId } });
    if (!item) throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    item.quantity = quantity;
    await this.items.save(item);
    return this.get(userId);
  }

  async remove(userId: number, productId: number) {
    const cart = await this.carts.findOne({ where: { userId } });
    if (cart) await this.items.delete({ cartId: cart.id, productId });
    return this.get(userId);
  }

  async clear(userId: number) {
    const cart = await this.carts.findOne({ where: { userId } });
    if (cart) await this.items.delete({ cartId: cart.id });
    return this.get(userId);
  }

  async getOrCreateCart(userId: number) {
    let cart = await this.carts.findOne({ where: { userId } });
    if (!cart) cart = await this.carts.save(this.carts.create({ userId }));
    return cart;
  }

  private serialize(cart: Cart, items: CartItem[]) {
    const serializedItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        stock: item.product.stock,
        imageUrl: item.product.imageUrl,
        category: item.product.category,
        brand: item.product.brand,
      },
      subtotal: Number(item.product.price) * item.quantity,
    }));
    return {
      id: cart.id,
      items: serializedItems,
      itemCount: serializedItems.reduce((sum, item) => sum + item.quantity, 0),
      total: serializedItems.reduce((sum, item) => sum + item.subtotal, 0),
    };
  }
}
