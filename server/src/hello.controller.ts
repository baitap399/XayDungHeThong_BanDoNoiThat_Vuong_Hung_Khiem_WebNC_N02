import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';

@Controller('hello') // Nhóm tất cả các API trong này dưới đường dẫn gốc: /hello
export class HelloController {

  // 1. Thực hành GET: http://localhost:3000/hello
  @Get()
  getHello(): string {
    return 'Hello NestJS'; 
  }

  // 2. Thực hành POST: http://localhost:3000/hello
  @Post()
  createHello(@Body() body: any) {
    return {
      message: 'Bạn đã gửi yêu cầu POST để tạo mới dữ liệu!',
      receivedData: body,
    };
  }

  // 3. Thực hành PUT: http://localhost:3000/hello/123
  @Put(':id')
  updateHello(@Param('id') id: string, @Body() body: any) {
    return {
      message: `Bạn đã gửi yêu cầu PUT để cập nhật hoàn toàn bản ghi ID: ${id}`,
      updatedData: body,
    };
  }

  // 4. Thực hành DELETE: http://localhost:3000/hello/123
  @Delete(':id')
  deleteHello(@Param('id') id: string) {
    return {
      message: `Bạn đã gửi yêu cầu DELETE để xóa bản ghi ID: ${id}`,
    };
  }
}
