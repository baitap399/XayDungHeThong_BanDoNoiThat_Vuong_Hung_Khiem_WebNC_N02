// file tạo decorator khai báo các quyền hoặc role được phép truy cập endpoint.
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<'USER' | 'ADMIN'>) => SetMetadata(ROLES_KEY, roles);
