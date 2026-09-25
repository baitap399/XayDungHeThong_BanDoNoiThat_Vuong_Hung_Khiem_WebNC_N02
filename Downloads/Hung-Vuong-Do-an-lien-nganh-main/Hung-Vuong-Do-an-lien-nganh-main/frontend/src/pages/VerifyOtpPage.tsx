import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('password_reset_email') || '';
  const expiresAt = sessionStorage.getItem('password_reset_expires_at') || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(() => Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000)));

  useEffect(() => {
    const updateTimer = () => setRemainingSeconds(Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000)));
    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (!email || !expiresAt) return <Navigate to="/forgot-password" replace />;

  const expired = remainingSeconds <= 0;
  const timerText = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await authApi.verifyResetOtp(email, otp);
      sessionStorage.setItem('password_reset_otp', otp);
      navigate('/reset-password');
    } catch (requestError) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
    } finally {
      setBusy(false);
    }
  };

  return <section className="auth-container">
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-header"><h1><i className="fa-solid fa-shield-halved" /> Xác thực OTP</h1><p>Mã xác thực đã được gửi tới <strong>{email}</strong>.</p></div>
      <div className={`otp-countdown${expired ? ' expired' : ''}`}><i className="fa-regular fa-clock" /><span>{expired ? 'Mã OTP đã hết hạn' : `Mã hết hạn sau ${timerText}`}</span></div>
      {error && <div className="auth-message error">{error}</div>}
      <div className="form-group"><label htmlFor="otp">Mã OTP</label><input id="otp" className="otp-input" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="000000" required autoComplete="one-time-code" /></div>
      <button type="submit" className="btn btn-primary btn-wide" disabled={busy || expired || otp.length !== 6}><i className="fa-solid fa-check" /> {busy ? 'Đang kiểm tra...' : 'Xác nhận OTP'}</button>
      <div className="auth-footer">{expired ? 'Mã đã hết hiệu lực. ' : 'Chưa nhận được mã? '}<Link to="/forgot-password">Gửi lại</Link></div>
    </form>
  </section>;
}
