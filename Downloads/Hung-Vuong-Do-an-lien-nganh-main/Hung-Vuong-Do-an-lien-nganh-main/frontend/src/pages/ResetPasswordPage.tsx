import axios from 'axios';
import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('password_reset_email') || '';
  const otp = sessionStorage.getItem('password_reset_otp') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!email || !otp) return <Navigate to="/forgot-password" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setBusy(true);
    try {
      await authApi.resetPassword(email, otp, password);
      sessionStorage.removeItem('password_reset_email');
      sessionStorage.removeItem('password_reset_otp');
      sessionStorage.removeItem('password_reset_expires_at');
      navigate('/login', { replace: true, state: { message: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.' } });
    } catch (requestError) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(message || 'Không thể đổi mật khẩu. Vui lòng thực hiện lại yêu cầu.');
    } finally {
      setBusy(false);
    }
  };

  return <section className="auth-container">
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-header"><h1><i className="fa-solid fa-lock" /> Đặt mật khẩu mới</h1><p>Mật khẩu mới cần có ít nhất 6 ký tự.</p></div>
      {error && <div className="auth-message error">{error}</div>}
      <div className="form-group"><label htmlFor="newPassword">Mật khẩu mới</label><div className="password-field"><input id="newPassword" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required autoComplete="new-password" /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}><i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} /></button></div></div>
      <div className="form-group"><label htmlFor="confirmPassword">Nhập lại mật khẩu</label><input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required autoComplete="new-password" /></div>
      <button type="submit" className="btn btn-primary btn-wide" disabled={busy}><i className="fa-solid fa-floppy-disk" /> {busy ? 'Đang cập nhật...' : 'Đổi mật khẩu'}</button>
    </form>
  </section>;
}
