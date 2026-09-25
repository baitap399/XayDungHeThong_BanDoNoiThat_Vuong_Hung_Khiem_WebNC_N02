import axios from 'axios';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const message = (requestError: unknown, fallback: string) => {
    const value = axios.isAxiosError<{ message?: string | string[] }>(requestError)
      ? requestError.response?.data?.message
      : undefined;
    return Array.isArray(value) ? value.join('. ') : value || fallback;
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError('');
    setBusy(true);
    try {
      await authApi.login({ usernameOrEmail: user.username || user.email, password: currentPassword });
      setVerified(true);
    } catch {
      setError('Mật khẩu hiện tại không đúng.');
    } finally {
      setBusy(false);
    }
  };

  const change = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setBusy(true);
    try {
      await authApi.changePassword(currentPassword, newPassword, confirmPassword);
      window.dispatchEvent(new CustomEvent('toast', { detail: 'Đổi mật khẩu thành công.' }));
      navigate('/profile', { replace: true });
    } catch (requestError) {
      setError(message(requestError, 'Không thể đổi mật khẩu. Vui lòng thử lại.'));
    } finally {
      setBusy(false);
    }
  };

  return <section className="auth-container">
    <form className="auth-form" onSubmit={verified ? change : verify}>
      <div className="auth-header">
        <h1><i className="fa-solid fa-key" /> Đổi mật khẩu</h1>
        <p>{verified ? 'Nhập mật khẩu mới có ít nhất 6 ký tự.' : 'Nhập mật khẩu hiện tại để xác minh tài khoản.'}</p>
      </div>
      {error && <div className="auth-message error" role="alert">{error}</div>}
      {!verified ? <div className="form-group">
        <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
        <div className="password-field">
          <input id="currentPassword" type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required autoComplete="current-password" autoFocus />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}><i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} /></button>
        </div>
      </div> : <>
        <div className="auth-message success" role="status"><i className="fa-solid fa-circle-check" /> Xác minh mật khẩu thành công.</div>
        <div className="form-group"><label htmlFor="newPassword">Mật khẩu mới</label><input id="newPassword" type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} minLength={6} required autoComplete="new-password" autoFocus /></div>
        <div className="form-group"><label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label><input id="confirmPassword" type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} minLength={6} required autoComplete="new-password" /></div>
      </>}
      <button type="submit" className="btn btn-primary btn-wide" disabled={busy}>
        <i className={`fa-solid ${verified ? 'fa-floppy-disk' : 'fa-shield-halved'}`} /> {busy ? 'Đang xử lý...' : verified ? 'Đổi mật khẩu' : 'Xác minh'}
      </button>
      <div className="auth-footer"><Link to="/profile"><i className="fa-solid fa-arrow-left" /> Quay lại hồ sơ</Link></div>
    </form>
  </section>;
}
