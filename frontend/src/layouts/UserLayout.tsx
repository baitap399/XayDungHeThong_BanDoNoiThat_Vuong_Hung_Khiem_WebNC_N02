// file định nghĩa layout user dùng để tạo khung giao diện chung cho các trang.
import { FormEvent, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useReveal } from '../hooks/useReveal';

export function UserLayout() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Watches for .reveal / .reveal-left / .reveal-right elements — on this
  // page and any later route or async data — and fades/slides them into
  // view, instead of leaving them stuck at opacity: 0.
  useReveal();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const header = document.querySelector('.site-header');
    const sync = () => header?.classList.toggle('scrolled', window.scrollY > 12);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, []);

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(`/products${q ? `?keyword=${encodeURIComponent(q)}` : ''}`);
  };

  return (
    <div className="site-shell">
      <div className="alert-stack"><div id="react-alert-root" /></div>

      <header className="site-header">
        <div className="top-strip">
          <span>Miễn phí giao hàng từ 500K</span>
          <span>Bảo hành chính hãng</span>
          <span>Hotline: 1800 6868</span>
        </div>

        <nav className="navbar" id="mainNav">
          <Link className="brand" to="/" aria-label="Hung Gia dụng Shop">
            <span className="brand-mark"><i className="fa-solid fa-bolt" /></span>
            <span className="brand-copy">Hung<span>Gia dụng</span></span>
          </Link>

          <form className="nav-search" onSubmit={search}>
            <i className="fa-solid fa-magnifying-glass" />
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              type="text" placeholder="Tìm nồi cơm điện, máy xay, máy hút bụi..." autoComplete="off" />
          </form>

          <div className="nav-links">
            <NavLink end to="/">Trang chủ</NavLink>
            <NavLink to="/products">Sản phẩm</NavLink>
            <NavLink to="/about">Giới thiệu</NavLink>
            <NavLink to="/contact">Liên hệ</NavLink>
            <NavLink to="/orders">Đơn hàng</NavLink>
          </div>

          <div className="nav-actions">
            <Link to="/cart" className="icon-btn" aria-label="Giỏ hàng">
              <i className="fa-solid fa-bag-shopping" />
              {!!cart?.itemCount && <span className="cart-badge">{cart.itemCount}</span>}
            </Link>

            {!user ? (
              <Link to="/login" className="icon-btn" aria-label="Đăng nhập">
                <i className="fa-solid fa-user" />
              </Link>
            ) : (
              <div className="account-menu">
                <button type="button" className="icon-btn" aria-label="Tài khoản">
                  <i className="fa-solid fa-circle-user" />
                </button>
                <div className="account-dropdown">
                  <strong>{user.username || user.email || user.fullName}</strong>
                  <Link to="/orders"><i className="fa-solid fa-box" /> Đơn hàng</Link>
                  {user.role === 'ADMIN' && <Link to="/admin"><i className="fa-solid fa-gauge" /> Quản trị</Link>}
                  <button type="button" onClick={logout}><i className="fa-solid fa-right-from-bracket" /> Đăng xuất</button>
                </div>
              </div>
            )}

            <button className="menu-toggle" type="button" aria-label="Mở menu"
              aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
              <i className={menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
            </button>
          </div>
        </nav>

        <div className={`mobile-panel ${menuOpen ? 'open' : ''}`} id="mobileMenu">
          <form onSubmit={search} className="mobile-search">
            <input value={keyword} onChange={e => setKeyword(e.target.value)} type="text" placeholder="Tìm kiếm sản phẩm..." />
            <button type="submit" aria-label="Tìm kiếm"><i className="fa-solid fa-magnifying-glass" /></button>
          </form>
          <NavLink end to="/">Trang chủ</NavLink>
          <NavLink to="/products">Sản phẩm</NavLink>
          <NavLink to="/about">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
          <NavLink to="/orders">Đơn hàng</NavLink>
          <NavLink to="/cart">Giỏ hàng</NavLink>
          {!user ? <NavLink to="/login">Đăng nhập</NavLink> : <button type="button" onClick={logout}>Đăng xuất</button>}
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" to="/">
              <span className="brand-mark"><i className="fa-solid fa-bolt" /></span>
              <span className="brand-copy">Hung<span>Gia dụng</span></span>
            </Link>
            <p>Shop thương mại điện tử chuyên đồ gia dụng, thiết bị nhà bếp và thiết bị chăm sóc nhà cửa chính hãng.</p>
            <div className="socials">
              <a href="#facebook" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
              <a href="#youtube" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
              <a href="#instagram" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
              <a href="#tiktok" aria-label="TikTok"><i className="fa-brands fa-tiktok" /></a>
            </div>
          </div>
          <div>
            <h3>Danh mục</h3>
            <Link to="/products?category=Nồi cơm điện">Nồi cơm điện</Link>
            <Link to="/products?category=Máy hút bụi">Máy hút bụi</Link>
            <Link to="/products?category=Máy xay sinh tố">Máy xay sinh tố</Link>
            <Link to="/products?category=Đồ dùng nhà bếp">Đồ dùng nhà bếp</Link>
            <Link to="/products?category=Quạt điện">Quạt điện</Link>
          </div>
          <div>
            <h3>Hỗ trợ</h3>
            <Link to="/about">Về chúng tôi</Link>
            <Link to="/contact">Liên hệ</Link>
            <a href="#warranty">Chính sách bảo hành</a>
            <a href="#returns">Đổi trả 7 ngày</a>
            <a href="#guide">Hướng dẫn mua hàng</a>
          </div>
          <div>
            <h3>Liên hệ</h3>
            <p><i className="fa-solid fa-location-dot" /> 123 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
            <p><i className="fa-solid fa-phone" /> 1800 6868</p>
            <p><i className="fa-solid fa-envelope" /> support@hunggiadung.vn</p>
            <p><i className="fa-solid fa-clock" /> 8:00 - 22:00 mỗi ngày</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Hung Gia dụng Shop. All rights reserved.</span>
          <span>Thiết kế cân bằng, mượt và tối ưu cho mua sắm.</span>
        </div>
      </footer>
    </div>
  );
}
