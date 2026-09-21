// file là trang checkout của giao diện người dùng.
import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatVnd, imageUrl } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/services';
import type { PaymentMethod } from '../api/types';

export function CheckoutPage(){
 const {cart,refresh}=useCart(); const {user}=useAuth(); const loc=useLocation(); const nav=useNavigate();
 const initial={fullName:user?.fullName||'',email:user?.email||'',phone:user?.phone||'',address:'',paymentMethod:'QR' as PaymentMethod,note:''};
 const [form,setForm]=useState(initial); const [step,setStep]=useState(loc.pathname.endsWith('/payment')?2:loc.pathname.endsWith('/invoice')?3:1); const [busy,setBusy]=useState(false);
 useEffect(()=>{try{const raw=sessionStorage.getItem('giadung_checkout');if(raw)setForm(JSON.parse(raw))}catch{}},[]);
 useEffect(()=>{sessionStorage.setItem('giadung_checkout',JSON.stringify(form))},[form]);
 useEffect(()=>{if(!cart?.items?.length)nav('/cart')},[cart?.items?.length]);
 if(!cart?.items?.length)return null;
 const update=(k:keyof typeof form,v:string)=>setForm(f=>({...f,[k]:v}));
 const nextInfo=(e:FormEvent)=>{e.preventDefault();setStep(2);nav('/checkout/payment')};
 const nextPay=(e:FormEvent)=>{e.preventDefault();setStep(3);nav('/checkout/invoice')};
 const confirm=async(e:FormEvent)=>{e.preventDefault();setBusy(true);try{const {data}=await orderApi.create(form);await refresh();sessionStorage.removeItem('giadung_checkout');nav(`/checkout/success/${data.id}`,{replace:true})}finally{setBusy(false)}};
 const go=(n:number)=>{setStep(n);nav(n===1?'/checkout/info':n===2?'/checkout/payment':'/checkout/invoice')};
 return <>
 {step===1&&<><section className="page-hero compact"><span className="eyebrow dark">Checkout</span><h1>Thông tin giao hàng</h1><p>Nhập đầy đủ thông tin. Dấu sao chuyển xanh khi trường hợp lệ.</p></section><section className="checkout-wrap">
  <form className="checkout-card" onSubmit={nextInfo}><div className="checkout-steps"><Step active={step>=1} icon="fa-location-dot" text="Thông tin"/><Step active={step>=2} icon="fa-wallet" text="Thanh toán"/><Step active={step>=3} icon="fa-file-invoice" text="Xác nhận"/></div><h2 className="checkout-title"><i className="fa-solid fa-location-dot"/> Địa chỉ nhận hàng</h2>
  <div className="form-grid">
   <Field label="Họ tên" value={form.fullName} set={v=>update('fullName',v)} required/><Field label="Số điện thoại" value={form.phone} set={v=>update('phone',v)} required/><Field label="Email" value={form.email} set={v=>update('email',v)} type="email" required full/><Field label="Địa chỉ" value={form.address} set={v=>update('address',v)} textarea required full/><Field label="Ghi chú" value={form.note} set={v=>update('note',v)} textarea full/>
  </div><div className="actions"><button className="btn btn-primary">Tiếp tục thanh toán <i className="fa-solid fa-arrow-right"/></button></div></form>
  <Summary cart={cart}/>
 </section></>}

 {step===2&&<><section className="page-hero compact"><span className="eyebrow dark">Payment</span><h1>Chọn phương thức thanh toán</h1><p>QR có mã quét thật, thẻ nhập thông tin nhanh, hoặc thanh toán tiền mặt khi nhận hàng.</p></section><section className="payment-shell">
  <form className="payment-panel" onSubmit={nextPay}><div className="payment-head"><h2 className="payment-title"><i className="fa-solid fa-wallet"/> Phương thức thanh toán</h2><span className="payment-pill"><i className="fa-solid fa-shield-halved"/> Bảo mật SSL</span></div>
   <div className="payment-methods">{([['QR','QR','Quét bằng app ngân hàng','fa-qrcode'],['CARD','Thẻ','Visa, Mastercard, ATM','fa-credit-card'],['CASH','Tiền mặt','Thanh toán khi nhận hàng','fa-money-bill-wave']] as const).map(([v,n,sub,ic])=><label className="payment-method" key={v}><input type="radio" checked={form.paymentMethod===v} onChange={()=>update('paymentMethod',v)}/><span className="payment-method-card"><span className="method-icon"><i className={`fa-solid ${ic}`}/></span><span className="method-name">{n}</span><span className="method-sub">{sub}</span></span></label>)}</div>
   {form.paymentMethod==='QR'&&<div className="method-detail active"><div className="qr-layout"><div className="qr-frame"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(`BANK: Vietcombank | STK: 1051987654321 | TEN: GIA DỤNG VIỆT | AMOUNT: ${cart.total}`)}`} alt="Mã QR thanh toán"/></div><div><h3>Quét mã QR để thanh toán</h3><p style={{color:'var(--muted)',lineHeight:1.8}}>Mở ứng dụng ngân hàng, chọn quét QR và kiểm tra đúng thông tin trước khi chuyển khoản.</p><div className="qr-meta"><div className="bank-line"><span>Ngân hàng</span><span>Vietcombank</span></div><div className="bank-line"><span>Số tài khoản</span><span>1051987654321</span></div><div className="bank-line"><span>Chủ tài khoản</span><span>GIA DỤNG VIỆT</span></div><div className="bank-line"><span>Nội dung</span><span>ORDER {form.phone}</span></div></div></div></div></div>}
   {form.paymentMethod==='CARD'&&<div className="method-detail active"><h3>Thông tin thẻ</h3><div className="form-grid"><input className="form-input full" placeholder="Số thẻ" maxLength={19}/><input className="form-input" placeholder="MM/YY"/><input className="form-input" placeholder="CVV"/><input className="form-input full" placeholder="Tên chủ thẻ"/></div></div>}
   {form.paymentMethod==='CASH'&&<div className="method-detail active"><div className="cash-box"><i className="fa-solid fa-truck-fast"/><div><h3>Thanh toán tiền mặt khi nhận hàng</h3><p>Bạn kiểm tra sản phẩm, hóa đơn và thanh toán trực tiếp cho nhân viên giao hàng.</p></div></div></div>}
   <button className="btn btn-primary btn-wide" style={{marginTop:24}}> <i className="fa-solid fa-file-invoice"/> Xem hóa đơn xác nhận</button><button type="button" className="btn btn-ghost btn-wide" style={{marginTop:10}} onClick={()=>go(1)}>Quay lại</button>
  </form><Summary cart={cart} payment customer={form}/>
 </section></>}

 {step===3&&<div className="invoice-container"><div className="invoice-header"><h1><i className="fa-solid fa-file-invoice"/> Hóa Đơn Xác Nhận</h1><p>Vui lòng kiểm tra thông tin trước khi xác nhận thanh toán</p></div>
 <form className="invoice-box" onSubmit={confirm}><div className="invoice-section"><div className="invoice-section-title">Thông tin giao hàng</div><div className="invoice-info"><Info label="Họ và tên" value={form.fullName}/><Info label="Email" value={form.email}/><Info label="Số điện thoại" value={form.phone}/><Info label="Địa chỉ giao hàng" value={form.address}/></div></div>
 <div className="invoice-section"><div className="invoice-section-title">Sản phẩm</div><table className="invoice-items-table"><thead><tr><th>Sản phẩm</th><th style={{textAlign:'center'}}>Số lượng</th><th style={{textAlign:'right'}}>Giá</th><th style={{textAlign:'right'}}>Thành tiền</th></tr></thead><tbody>{cart.items.map(i=><tr key={i.id}><td>{i.product.name}</td><td style={{textAlign:'center'}}>{i.quantity}</td><td style={{textAlign:'right'}}>{formatVnd(i.product.price)}</td><td style={{textAlign:'right',fontWeight:600}}>{formatVnd(i.subtotal)}</td></tr>)}</tbody></table></div>
 <div className="invoice-total"><div className="invoice-total-box"><div className="invoice-total-label">Tổng tiền</div><div className="invoice-total-amount">{formatVnd(cart.total)}</div><div className="payment-method-box"><div style={{fontSize:'.9rem',color:'var(--muted)'}}>Phương thức thanh toán:</div><div style={{fontWeight:600,marginTop:'.5rem'}}>{form.paymentMethod}</div></div></div></div>
 <div className="actions"><button className="btn-confirm" disabled={busy}><i className="fa-solid fa-check"/> {busy?'Đang xác nhận...':'Xác nhận thanh toán'}</button><button type="button" className="btn-back" onClick={()=>go(2)}><i className="fa-solid fa-arrow-left"/> Quay lại</button></div></form></div>}
 </>;
}
function Step({active,icon,text}:{active:boolean,icon:string,text:string}){return <div className={`checkout-step ${active?'active':''}`}><i className={`fa-solid ${icon}`}/><span>{text}</span></div>}
function Field({label,value,set,type='text',textarea=false,required=false,full=false}:{label:string,value:string,set:(v:string)=>void,type?:string,textarea?:boolean,required?:boolean,full?:boolean}){return <div className={`field ${full?'full':''}`}><label>{label} {required&&<span className="required">*</span>}</label>{textarea?<textarea className="form-input" value={value} onChange={e=>set(e.target.value)} required={required}/>:<input className="form-input" type={type} value={value} onChange={e=>set(e.target.value)} required={required}/>}</div>}
function Info({label,value}:{label:string,value:string}){return <div className="invoice-item"><div className="invoice-item-label">{label}</div><div className="invoice-item-value">{value}</div></div>}
function Summary({cart,payment=false,customer}:{cart:any,payment?:boolean,customer?:any}){return <aside className="summary-panel"><h2 className="summary-title"><i className="fa-solid fa-receipt"/> Tóm tắt đơn</h2><div className="summary-row"><span>Số lượng</span><strong>{cart.itemCount}</strong></div><div className="summary-row"><span>Giao hàng</span><strong>0 ₫</strong></div><div className="summary-row summary-total"><span>Tổng cộng</span><strong>{formatVnd(cart.total)}</strong></div>{payment&&customer&&<div className="customer-box"><strong>Người nhận</strong><br/>{customer.fullName}<br/>{customer.phone}<br/>{customer.address}</div>}<div className="secure-note"><i className="fa-solid fa-lock"/> Thông tin được mã hóa khi xử lý thanh toán</div></aside>}
