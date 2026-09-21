// file là trang home của giao diện người dùng.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/services';
import type { Product } from '../api/types';
import { ProductCard } from '../components/ProductCard';

const slides = [
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1500&q=85',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1500&q=85',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1500&q=85',
  'https://images.unsplash.com/photo-1584990347449-ae44f78d0f8b?auto=format&fit=crop&w=1500&q=85',
];

const categories = [
  ['Nồi cơm điện','Gia đình & tiện nghi','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=75'],
  ['Robot hút bụi','Build & Assembled','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=75'],
  ['Máy xay sinh tố','144Hz – 4K HDR','https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&q=75'],
  ['Đồ dùng nhà bếp','Cơ & Membrane','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=400&q=75'],
  ['Quạt điện','Wireless & Wired','https://images.unsplash.com/photo-1565031491910-e57fac031c41?auto=format&fit=crop&w=400&q=75'],
  ['Máy hút bụi','Tiện nghi gia đình','https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=75'],
];

export function HomePage() {
  const [current, setCurrent] = useState(0);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    productApi.featured().then(r => setFeatured(r.data)).catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent(v => (v + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return <>
    <section className="home-hero">
      <div className="hero-showcase reveal-left" id="heroShowcase">
        <div className="hs-slides">
          {slides.map((src, i) => (
            <div className={`hs-slide ${i === current ? 'active' : ''}`} key={src}>
              <img src={src} alt={i === 0 ? 'Nhà bếp hiện đại' : 'Không gian gia dụng'} />
            </div>
          ))}
        </div>
        <div className="hs-progress"><div className="hs-progress-bar" style={{ width: `${((current + 1) / slides.length) * 100}%`, transition: 'width 5000ms linear' }} /></div>
        <div className="hs-dots" id="hsDots">
          {slides.map((_, i) => <button key={i} className={`hs-dot ${i === current ? 'active' : ''}`} aria-label={`Slide ${i + 1}`} onClick={() => setCurrent(i)} />)}
        </div>
        <div className="hero-overlay" />
        <div className="hero-copy">
          <span className="eyebrow">Household Store</span>
          <h1>Thiết bị gia dụng tiện nghi cho ngôi nhà hiện đại</h1>
          <p>Nồi cơm điện, máy xay, nồi chiên, máy hút bụi và thiết bị gia dụng chính hãng với trải nghiệm mua sắm mượt mà.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary"><i className="fa-solid fa-bag-shopping" /> Mua ngay</Link>
            <Link to="/products?category=Nồi cơm điện" className="btn btn-light"><i className="fa-solid fa-bowl-food" /> Xem nồi cơm điện</Link>
          </div>
        </div>
        <div className="hero-stat"><strong>98%</strong><span>khách hàng hài lòng</span></div>
      </div>

      <aside className="hero-side reveal-right">
        <MiniCategory name="Nồi cơm điện" image="https://dienmaytienphong.com/wp-content/uploads/2025/06/SR-MVN18LRAX.png" />
        <MiniCategory name="Đồ dùng nhà bếp" image="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80" />
        <MiniCategory name="Máy xay sinh tố" image="https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80" />
        <MiniCategory name="Máy hút bụi" image="https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80" />
      </aside>
    </section>

    <section className="trust-bar reveal">
      <Trust icon="fa-truck-fast" bg="#eff6ff" color="#2563eb" title="Giao trong ngày" sub="Nội thành HCM & HN" />
      <div className="trust-divider" />
      <Trust icon="fa-shield-halved" bg="#f0fdf4" color="#16a34a" title="Bảo hành chính hãng" sub="12 – 24 tháng" />
      <div className="trust-divider" />
      <Trust icon="fa-rotate-left" bg="#fff7ed" color="#ea580c" title="Đổi trả miễn phí" sub="Trong vòng 7 ngày" />
      <div className="trust-divider" />
      <Trust icon="fa-headset" bg="#fdf4ff" color="#9333ea" title="Hỗ trợ 24/7" sub="Chat & Gọi trực tiếp" />
      <div className="trust-divider" />
      <Trust icon="fa-credit-card" bg="#fefce8" color="#ca8a04" title="Thanh toán an toàn" sub="Thẻ, chuyển khoản, COD" />
    </section>

    <section className="section">
      <div className="section-heading reveal">
        <div><span className="eyebrow dark">Danh mục</span><h2>Khám phá theo loại sản phẩm</h2></div>
        <Link to="/products" className="text-link">Tất cả <i className="fa-solid fa-arrow-right" /></Link>
      </div>
      <div className="category-grid">
        {categories.map(([name, sub, image], i) => (
          <Link key={name} to={`/products?category=${encodeURIComponent(name === 'Robot hút bụi' ? 'Thiết bị gia dụng thông minh' : name)}`} className="cat-card reveal" style={{ '--delay': `${i * 60}ms` } as React.CSSProperties}>
            <img src={image} alt={name} />
            <div className="cat-label"><strong>{name}</strong><span>{sub}</span><div className="cat-pill"><i className="fa-solid fa-arrow-right" /> Xem ngay</div></div>
          </Link>
        ))}
      </div>
    </section>

    <section className="section">
      <div className="section-heading reveal">
        <div><span className="eyebrow dark">Bestselling Products</span><h2>Sản phẩm nổi bật</h2></div>
        <Link to="/products" className="text-link">Xem thêm <i className="fa-solid fa-arrow-right" /></Link>
      </div>
      <div className="product-grid">
        {featured.length ? featured.map((p, i) => <ProductCard key={p.id} product={p} home index={i} />) : null}
      </div>
    </section>

    <section className="promo-banner reveal">
      <img className="promo-bg" src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80" alt="Không gian bếp hiện đại" />
      <div className="promo-overlay" /><div className="promo-glow" />
      <div className="promo-body">
        <span className="promo-kicker"><i className="fa-solid fa-bolt" /> Flash Sale</span>
        <h2>Ưu đãi cuối tuần —<br />Giảm đến <em>30%</em> Nồi cơm điện & Robot hút bụi</h2>
        <p>Số lượng có hạn. Miễn phí vận chuyển toàn quốc cho đơn từ 3 triệu.</p>
        <div className="promo-actions">
          <Link to="/products" className="btn btn-primary"><i className="fa-solid fa-fire" /> Xem ưu đãi ngay</Link>
          <Link to="/products?category=Nồi cơm điện" className="btn-ghost-white"><i className="fa-solid fa-bowl-food" /> Xem Nồi cơm điện</Link>
        </div>
      </div>
      <div className="promo-stats"><div className="promo-stat-card"><strong>30%</strong><span>Giảm tối đa</span></div><div className="promo-stat-card"><strong>500+</strong><span>Sản phẩm sale</span></div><div className="promo-stat-card"><strong>48h</strong><span>Còn lại</span></div></div>
    </section>

    <section className="feature-split section">
      <div className="split-text reveal-left">
        <span className="eyebrow dark">New Arrival</span>
        <h2>Không gian gia đình gọn gàng, tiện nghi và hiện đại</h2>
        <p>Chọn nhanh combo nồi cơm điện, máy xay, nồi chiên và thiết bị vệ sinh phù hợp nhu cầu gia đình.</p>
        <Link to="/products?category=Thiết bị gia dụng thông minh" className="btn btn-primary">Khám phá thiết bị</Link>
      </div>
      <img className="split-image reveal-right" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85" alt="Không gian gia đình hiện đại" />
    </section>

    <section className="brands-section section">
      <p className="brands-label reveal">Thương hiệu chính hãng phân phối</p>
      <div className="brands-track-wrap reveal"><div className="brands-track">
        {['Panasonic','Sharp','Philips','Toshiba','LocknLock','Xiaomi','Deerma','Electrolux','Tefal','Kangaroo','Sunhouse','Bluestone',
          'Panasonic','Sharp','Philips','Toshiba','LocknLock','Xiaomi','Deerma','Electrolux','Tefal','Kangaroo','Sunhouse','Bluestone'].map((b,i)=><div className="brand-item" key={`${b}-${i}`}>{b}</div>)}
      </div></div>
    </section>

    <section className="section review-band reveal">
      <div><strong>4.9/5</strong><span>Đánh giá trung bình từ khách hàng</span></div>
      <blockquote>"Giao diện dễ mua, sản phẩm rõ thông tin, tư vấn nhanh và đóng gói rất chắc chắn."</blockquote>
      <blockquote>"Máy gia dụng dễ sử dụng, đóng gói chắc chắn và bảo hành minh bạch."</blockquote>
      <blockquote>"Nồi cơm điện chính hãng, giao trong ngày tại TP.HCM."</blockquote>
    </section>

    <section className="newsletter-section reveal">
      <div className="newsletter-inner">
        <div className="newsletter-text">
          <div className="newsletter-icon-wrap"><i className="fa-solid fa-envelope-open-text" /></div>
          <h3>Nhận ưu đãi độc quyền qua email</h3>
          <p>Đăng ký để không bỏ lỡ flash sale, sản phẩm mới và mã giảm giá riêng cho thành viên.</p>
        </div>
        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
          <div className="newsletter-input-wrap"><i className="fa-solid fa-envelope" /><input type="email" placeholder="Email của bạn..." required /></div>
          <button type="submit" className="btn btn-indigo"><i className="fa-solid fa-paper-plane" /> Đăng ký</button>
        </form>
      </div>
    </section>
  </>;
}

function MiniCategory({name,image}:{name:string,image:string}) {
  return <Link to={`/products?category=${encodeURIComponent(name)}`} className="mini-category"><img src={image} alt={name} /><span>{name}</span></Link>;
}
function Trust({icon,bg,color,title,sub}:{icon:string,bg:string,color:string,title:string,sub:string}) {
  return <div className="trust-item"><div className="trust-icon" style={{background:bg}}><i className={`fa-solid ${icon}`} style={{color}} /></div><div><strong>{title}</strong><span>{sub}</span></div></div>;
}
