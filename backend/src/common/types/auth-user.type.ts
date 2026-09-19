export type AuthUser = {
  id: number;
  username?: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
};
