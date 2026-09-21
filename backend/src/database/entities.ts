// file gom và export các entity của database để sử dụng tập trung.
import {
  Cart,
  CartItem,
  ContactMessage,
  Order,
  OrderItem,
  Payment,
  Product,
  User,
} from './entities/index';

export const entities = [User, Product, Cart, CartItem, Order, OrderItem, Payment, ContactMessage];
