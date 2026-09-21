// file là trang productlist của giao diện người dùng.
import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productApi } from '../api/services';
import type { Product } from '../api/types';
import { ProductCard } from '../components/ProductCard';

export function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const category = params.get('category');
  useEffect(() => { productApi.categories().then(r => setCategories(r.data)).catch(() => setCategories([])); }, []);
  useEffect(() => {
    productApi.list({ keyword: params.get('keyword') || undefined, category: category || undefined })
      .then(r => setProducts(r.data)).catch(() => setProducts([]));
    setKeyword(params.get('keyword') || '');
  }, [params, category]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    keyword.trim() ? next.set('keyword', keyword.trim()) : next.delete('keyword');
    setParams(next);
  };
  const choose = (c?: string) => {
    const next = new URLSearchParams();
    if (c) next.set('category', c);
    if (keyword.trim()) next.set('keyword', keyword.trim());
    setParams(next);
  };

  return <>
    <section className="page-hero compact">
      <span className="eyebrow dark">Shop gia dụng</span>
      <h1>{params.get('keyword') ? <>Kết quả cho “{params.get('keyword')}”</> : category || 'Tất cả sản phẩm'}</h1>
      <p>Lọc nhanh nồi cơm điện, máy xay, máy hút bụi và thiết bị gia dụng chính hãng.</p>
    </section>
    <section className="shop-layout section">
      <aside className="filter-panel reveal-left">
        <h2>Bộ lọc</h2>
        <form onSubmit={submit} className="filter-search">
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm sản phẩm..." />
          <button type="submit" aria-label="Tìm kiếm"><i className="fa-solid fa-search" /></button>
        </form>
        <button className={`filter-link ${!category && !params.get('keyword') ? 'active' : ''}`} onClick={() => choose()}>
          <i className="fa-solid fa-layer-group" /> Tất cả
        </button>
        {categories.map(c => <button key={c} className={`filter-link ${category === c ? 'active' : ''}`} onClick={() => choose(c)}>
          <i className="fa-solid fa-tag" /> <span>{c}</span>
        </button>)}
        {(category || params.get('keyword')) && <button className="filter-link clear" onClick={() => setParams({})}><i className="fa-solid fa-xmark" /> Xóa bộ lọc</button>}
      </aside>
      <div className="shop-content">
        <div className="shop-toolbar reveal">
          <span>Tìm thấy <strong>{products.length}</strong> sản phẩm</span>
          <select id="sortSelect" defaultValue="" onChange={e => {
            const v = e.target.value; const copy = [...products];
            if (v === 'price-asc') copy.sort((a,b)=>a.price-b.price);
            if (v === 'price-desc') copy.sort((a,b)=>b.price-a.price);
            if (v === 'name') copy.sort((a,b)=>a.name.localeCompare(b.name,'vi'));
            setProducts(copy);
          }}>
            <option value="">Sắp xếp mặc định</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="name">Tên A-Z</option>
          </select>
        </div>
        {products.length ? <div className="product-grid" id="productsGrid">{products.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div> :
          <div className="empty-state reveal"><i className="fa-solid fa-magnifying-glass" /><h2>Không tìm thấy sản phẩm</h2><p>Thử từ khóa khác hoặc quay về toàn bộ sản phẩm.</p><Link to="/products" className="btn btn-primary">Xem tất cả</Link></div>}
      </div>
    </section>
  </>;
}
