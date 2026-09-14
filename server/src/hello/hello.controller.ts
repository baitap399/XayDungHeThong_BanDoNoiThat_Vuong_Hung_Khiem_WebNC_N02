import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('hello')
export class HelloController {
  @Get()
  getHello(): string {
    return 'Hello NestJS!';
  }

  @Post()
  postHello(@Body() bodyData: any): string {
    // 1. In dữ liệu ra Terminal TRƯỚC khi return
    console.log("Dữ liệu nhận được từ client là:", bodyData);

    // 2. Sau đó mới trả về phản hồi
    return 'Đã nhận dữ liệu POST thành công!';
  }
}