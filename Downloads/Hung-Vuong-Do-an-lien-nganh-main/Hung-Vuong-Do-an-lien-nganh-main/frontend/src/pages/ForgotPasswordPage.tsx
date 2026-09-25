import axios from 'axios';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await authApi.forgotPassword(email.trim());
      sessionStorage.setItem('password_reset_email', email.trim().toLowerCase());
      sessionStorage.setItem('password_reset_expires_at', data.expiresAt);
      sessionStorage.removeItem('password_reset_otp');
      navigate('/verify-otp');
    } catch (requestError) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setBusy(false);
    }
  };

  return <section className="auth-container">
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-header"><h1><i className="fa-solid fa-key" /> Quên mật khẩu</h1><p>Nhập email tài khoản để nhận mã OTP có hiệu lực trong 5 phút.</p></div>
      {error && <div className="auth-message error">{error}</div>}
      <div className="form-group"><label htmlFor="resetEmail">Email</label><input id="resetEmail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" required autoComplete="email" /></div>
      <button type="submit" className="btn btn-primary btn-wide" disabled={busy}><i className="fa-solid fa-paper-plane" /> {busy ? 'Đang gửi...' : 'Gửi mã OTP'}</button>
      <div className="auth-footer"><Link to="/login"><i className="fa-solid fa-arrow-left" /> Quay lại đăng nhập</Link></div>
    </form>
  </section>;
}
