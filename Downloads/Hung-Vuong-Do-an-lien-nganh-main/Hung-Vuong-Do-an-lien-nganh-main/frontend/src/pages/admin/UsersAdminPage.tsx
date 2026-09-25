// file là trang quản trị usersadmin dành cho khu vực admin.
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { orderApi } from '../../api/services';
import type { User } from '../../api/types';

export function UsersAdminPage(){const [users,setUsers]=useState<User[]>([]);useEffect(()=>{orderApi.users().then(r=>setUsers(r.data)).catch(()=>{});},[]);return <div className="admin-page-shell"><div className="admin-page-header"><div><div className="eyebrow">USERS</div><h1>Người dùng</h1></div></div><div className="admin-panel"><table className="admin-table"><thead><tr><th>ID</th><th>Họ tên</th><th>Username</th><th>Email</th><th>Điện thoại</th><th>Role</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.id}</td><td>{u.fullName}</td><td>{u.username||'-'}</td><td>{u.email}</td><td>{u.phone||'-'}</td><td><span className="admin-status"><Users size={13}/> {u.role}</span></td></tr>)}</tbody></table></div></div>}
