// file là trang success của giao diện người dùng.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderApi } from '../api/services';
import type { Order } from '../api/types';

export function SuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(orderId);
    if (!id) {
      setLoading(false);
      return;
    }

    orderApi.detail(id)
      .then((response) => setOrder(response.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const paymentText = order?.paymentStatus === 'PAID'
    ? 'Đã thanh toán'
    : 'Đang xác nhận thanh toán / Chưa thanh toán';

  return <div className="success-container">
    <div className="success-box">
      <div className="success-icon"><i className="fa-solid fa-check-circle" /></div>
      <h1 className="success-title">Đặt hàng thành công!</h1>
      <p className="success-desc">Cảm ơn bạn đã đặt hàng.<br />Chúng tôi sẽ xác nhận đơn hàng của bạn trong thời gian sớm nhất.</p>
      <div className="order-info">
        <div className="info-row">
          <Info label="Mã đơn hàng" value={`#${order?.id || orderId || ''}`} highlight />
          <Info label="Trạng thái" value={loading ? 'Đang tải' : order?.status || 'Không tìm thấy'} />
        </div>
        <div className="info-row">
          <Info label="Phương thức" value={order?.paymentMethod || '--'} />
          <Info label="Thanh toán" value={loading ? 'Đang tải' : paymentText} />
        </div>
      </div>
      <div className="actions">
        <Link to={`/orders/${orderId}`} className="btn-action btn-primary-action"><i className="fa-solid fa-receipt" /> Xem đơn hàng</Link>
        <Link to="/products" className="btn-action btn-secondary-action"><i className="fa-solid fa-bag-shopping" /> Tiếp tục mua sắm</Link>
      </div>
    </div>
  </div>;
}

function Info({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="info-item"><div className="info-label">{label}</div><div className={`info-value ${highlight ? 'highlight' : ''}`}>{value}</div></div>;
}
