import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { hashText, normalizeText } from './chat-matching';

const PRODUCT_TYPE = /\b(may hut bui|may xay sinh to|noi com dien|noi chien khong dau|may loc khong khi|may loc nuoc|may giat|may say|ban ui|ban la|ban an|ban hoc|ban lam viec|tu lanh|bep tu|bep dien|lo vi song|am sieu toc|dieu hoa|ghe|sofa|giuong|nem|quat|chen|bat|dia|coc)\b/;
const PRODUCT_INTENT = /\b(san pham|ton kho|con hang|het hang|gia bao nhieu|gia duoi|gia tren|tu van|nen chon|nen mua|tim mua|trieu|nghin|ngan|vnd)\b/;
const MONEY = '(\\d+(?:[.,]\\d+)*)\\s*(trieu|tr|nghin|ngan|k|vnd|dong|d)?';

function amount(value: string, unit = '') {
  const number = Number(/^(\d{1,3})([.,]\d{3})+$/.test(value) ? value.replace(/[.,]/g, '') : value.replace(',', '.'));
  return number * (/^(trieu|tr)$/.test(unit) ? 1_000_000 : /^(nghin|ngan|k)$/.test(unit) ? 1000 : 1);
}

export function productQuery(message: string) {
  const normalized = normalizeText(message);
  const accentedType = message.toLowerCase().match(/(?:^|\s)(bàn|tủ|kệ|đèn|chảo|nồi)(?=\s|[?!.,]|$)/)?.[1];
  const type = normalized.match(PRODUCT_TYPE)?.[0] ?? (accentedType ? normalizeText(accentedType) : undefined);
  const text = message.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
  const range = text.match(new RegExp(`\\btu\\s+${MONEY}\\s*(?:den|toi|-)\\s*${MONEY}\\b`));
  const upper = text.match(new RegExp(`\\b(duoi|toi da|khong qua|khong vuot qua)\\s+${MONEY}\\b`));
  const lower = text.match(new RegExp(`\\b(tren|it nhat|tu)\\s+${MONEY}\\b`));
  const stop = /\b(san pham|phu hop|tu van|bao nhieu|toi da|it nhat|khong qua|khong vuot qua|ton kho|het hang|co|khong|con|hang|toi|minh|muon|can|tim|mua|ban|cho|giup|nao|nen|chon|phong|gia|duoi|tren|tu|den|trieu|tr|nghin|ngan|dong|vnd|k|voi|va|la|cua|mot|loai|tot|re|nhat)\b/g;
  const remaining = normalized.replace(type ?? /^$/, ' ').replace(stop, ' ').split(/\s+/).filter(word => word.length > 1 && !/^\d/.test(word));
  // ponytail: keyword intent/filters; unsupported phrasing falls back to a cautious answer, not an invented query.
  const terms = [...(type ? [type] : []), ...remaining].slice(0, 6);
  return {
    related: !!type || PRODUCT_INTENT.test(normalized) || !!upper || !!range,
    terms,
    minPrice: range ? amount(range[1], range[2] || range[4]) : lower ? amount(lower[2], lower[3]) : undefined,
    maxPrice: range ? amount(range[3], range[4]) : upper ? amount(upper[2], upper[3]) : undefined,
    minExclusive: !range && lower?.[1] === 'tren',
    maxExclusive: !range && upper?.[1] === 'duoi',
    includeOutOfStock: /\b(het hang|ton kho)\b/.test(normalized),
  };
}

export interface ProductContext {
  products: Array<{ id: number; name: string; price: string; stock: number; category: string | null; brand: string | null; description: string | null; specifications: string | null; origin: string | null }>;
  hash: string;
}

@Injectable()
export class ChatProductsService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  async context(message: string): Promise<ProductContext | null> {
    const query = productQuery(message);
    // Policy FAQs and greetings need no product lookup.
    if (!query.related && (/\b(giao hang|ship|van chuyen|doi tra|thanh toan|bao hanh|xin chao|cam on)\b/.test(normalizeText(message)) || !query.terms.length)) return null;

    const qb = this.products.createQueryBuilder('p').select([
      'p.id AS id', 'p.name AS name', 'p.price AS price', 'p.stock AS stock',
      'p.category AS category', 'p.brand AS brand', 'p.origin AS origin',
      'LEFT(p.description, 350) AS description', 'LEFT(p.specifications, 500) AS specifications',
    ]);
    query.terms.forEach((term, index) => {
      // Parameters + normalized alphanumeric terms; user text never becomes SQL.
      qb.andWhere(`REPLACE(LOWER(CONCAT_WS(' ', p.name, p.category, p.brand, p.description)), 'đ', 'd') COLLATE utf8mb4_unicode_ci LIKE :term${index}`, { [`term${index}`]: `%${term}%` });
    });
    if (!query.includeOutOfStock) qb.andWhere('p.stock > 0');
    if (query.minPrice !== undefined) qb.andWhere(`p.price ${query.minExclusive ? '>' : '>='} :minPrice`, { minPrice: query.minPrice });
    if (query.maxPrice !== undefined) qb.andWhere(`p.price ${query.maxExclusive ? '<' : '<='} :maxPrice`, { maxPrice: query.maxPrice });
    const products = await qb.orderBy('p.price', 'ASC').addOrderBy('p.id', 'ASC').limit(5).getRawMany<ProductContext['products'][number]>();
    if (!query.related && !products.length) return null;
    return { products, hash: hashText(JSON.stringify(products)) };
  }
}
