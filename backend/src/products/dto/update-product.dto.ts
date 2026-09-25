// file định nghĩa và kiểm tra dữ liệu đầu vào cho chức năng update-product.
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
