import { useEffect, useState } from 'react';
import { formatVnd } from '../../api/client';
import { orderApi } from '../../api/services';
import type { Order } from '../../api/types';

export function OrdersAdminPage() {
  const [orders,setOrders]=useState<Order[]>([]); const load=()=>orderApi.adminList().then(r=>setOrders(r.data)); useEffect(()=>{load().catch(()=>{});},[]);
  const change=async(o:Order,status:Order['status'])=>{await orderApi.adminUpdateStatus(o.id,status);await load();};
  return <div className="admin-page-shell"><div className="admin-page-header"><div><div className="eyebrow">ORDERS</div><h1>Đơn hàng</h1><p>{orders.length} đơn hàng trong hệ thống.</p></div></div><div className="admin-panel"><table className="admin-table"><thead><tr><th>Đơn</th><th>Khách</th><th>Tổng</th><th>Thanh toán</th><th>Trạng thái</th><th>Ngày</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><b>#{o.id}</b><div style={{color:'#4d6b4d',fontSize:'.72rem'}}>{o.phone}</div></td><td>{o.fullName}<div style={{color:'#4d6b4d',fontSize:'.72rem'}}>{o.address}</div></td><td>{formatVnd(o.totalAmount)}</td><td>{o.paymentMethod} / {o.paymentStatus}</td><td><select className="admin-select" value={o.status} onChange={e=>change(o,e.target.value as Order['status'])}>{['PENDING','CONFIRMED','DELIVERED','CANCELLED'].map(s=><option key={s}>{s}</option>)}</select></td><td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td></tr>)}</tbody></table>{!orders.length&&<div className="admin-empty">Chưa có đơn hàng.</div>}</div></div>;
}
