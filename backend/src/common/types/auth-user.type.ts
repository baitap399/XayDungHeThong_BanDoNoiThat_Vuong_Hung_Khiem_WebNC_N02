// file định nghĩa kiểu dữ liệu dùng chung cho thông tin xác thực và người dùng.
export type AuthUser = {
  id: number;
  username?: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
};
