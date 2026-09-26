// file là trang productlist của giao diện người dùng.
import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RotateCw, SlidersHorizontal } from 'lucide-react';
import { productApi } from '../api/services';
import type { Product } from '../api/types';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';

export function ProductListPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = params.get('category');
  useEffect(() => { productApi.categories().then(r => setCategories(r.data)).catch(() => setCategories([])); }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    productApi.list({ keyword: params.get('keyword') || undefined, category: category || undefined })
      .then(r => { if (active) setProducts(r.data); })
      .catch(() => { if (active) { setProducts([]); setFailed(true); } })
      .finally(() => { if (active) setLoading(false); });
    setKeyword(params.get('keyword') || '');
    return () => { active = false; };
  }, [params, category, retry]);

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
      <nav className="breadcrumb" aria-label="Đường dẫn"><Link to="/">Trang chủ</Link><span aria-hidden="true">/</span><span>Sản phẩm</span></nav>
      <h1>{params.get('keyword') ? <>Kết quả cho “{params.get('keyword')}”</> : category || 'Tất cả sản phẩm'}</h1>
      <p>Lọc nhanh nồi cơm điện, máy xay, máy hút bụi và thiết bị gia dụng chính hãng.</p>
    </section>
    <section className="shop-layout section">
      <button className="btn btn-outline filter-toggle" aria-expanded={filtersOpen} aria-controls="catalogFilters" onClick={() => setFiltersOpen(v => !v)}><SlidersHorizontal size={18} /> Bộ lọc{category ? `: ${category}` : ''}</button>
      <aside className={`filter-panel reveal-left ${filtersOpen ? 'filters-open' : ''}`} id="catalogFilters">
        <h2>Bộ lọc</h2>
        <form onSubmit={submit} className="filter-search">
          <input value={keyword} onChange={e => setKeyword(e.target.value)} aria-label="Tìm sản phẩm" placeholder="Tìm sản phẩm..." />
          <button type="submit" aria-label="Tìm kiếm"><i className="fa-solid fa-search" /></button>
        </form>
        <button className={`filter-link ${!category && !params.get('keyword') ? 'active' : ''}`} aria-pressed={!category && !params.get('keyword')} onClick={() => choose()}>
          <i className="fa-solid fa-layer-group" /> Tất cả
        </button>
        {categories.map(c => <button key={c} className={`filter-link ${category === c ? 'active' : ''}`} aria-pressed={category === c} onClick={() => choose(c)}>
          <i className="fa-solid fa-tag" /> <span>{c}</span>
        </button>)}
        {(category || params.get('keyword')) && <button className="filter-link clear" onClick={() => setParams({})}><i className="fa-solid fa-xmark" /> Xóa bộ lọc</button>}
      </aside>
      <div className="shop-content">
        <div className="shop-toolbar reveal">
          <span role="status">{loading ? 'Đang tải sản phẩm...' : failed ? 'Chưa thể tải sản phẩm' : <>Tìm thấy <strong>{products.length}</strong> sản phẩm</>}</span>
          <select id="sortSelect" aria-label="Sắp xếp sản phẩm" disabled={loading || failed} defaultValue="" onChange={e => {
            const v = e.target.value; const copy = [...products];
            if (v === 'price-asc') copy.sort((a,b)=>a.price-b.price);
            if (v === 'price-desc') copy.sort((a,b)=>b.price-a.price);
            if (v === 'name') copy.sort((a,b)=>a.name.localeCompare(b.name,'vi'));
            setProducts(copy);
          }}>
            <option value="">Sắp xếp mặc định</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="name">Tên A-Z</option>
          </select>
        </div>
        {loading ? <div className="product-grid" role="status" aria-label="Đang tải sản phẩm" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)}</div> :
          failed ? <div className="empty-state" role="alert"><RotateCw size={32} /><h2>Chưa thể tải sản phẩm</h2><p>Vui lòng kiểm tra kết nối và thử lại.</p><button className="btn btn-primary" onClick={() => setRetry(v => v + 1)}><RotateCw size={16} /> Thử lại</button></div> :
          products.length ? <div className="product-grid" id="productsGrid">{products.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div> :
          <div className="empty-state reveal"><i className="fa-solid fa-magnifying-glass" /><h2>Không tìm thấy sản phẩm</h2><p>Thử từ khóa khác hoặc quay về toàn bộ sản phẩm.</p><Link to="/products" className="btn btn-primary">Xem tất cả</Link></div>}
      </div>
    </section>
  </>;
}
