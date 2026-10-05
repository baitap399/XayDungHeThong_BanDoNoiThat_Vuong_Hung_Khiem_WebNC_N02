# Bài tập NestJS: Quản lý đăng ký môn học

## Cấu trúc dữ liệu

- `Sinhvien`: mã sinh viên, họ tên, email.
- `Monhoc`: mã môn học, tên môn học, số tín chỉ.
- `Dangki`: thông tin sinh viên đăng ký môn học và ngày đăng ký.

## Kết nối cơ sở dữ liệu (3.1)

## Cài đặt và chạy

Mở Terminal tại thư mục project:

powershell
npm install --legacy-peer-deps
npm run start:dev

Khi terminal hiện `Nest application successfully started`, ứng dụng đang chạy tại `http://localhost:3000`. Tất cả API có tiền tố `/api`. Giữ terminal chạy trong khi kiểm tra bằng Thunder Client.

## Các API và cách kiểm tra

Gửi request theo thứ tự: tạo sinh viên, tạo môn học, đăng ký môn học, rồi xem danh sách đăng ký. Với các request `POST`, chọn **Body → JSON** trong Thunder Client. Dùng `id` nhận được ở response thay vì mặc định rằng ID luôn là `1`.

### Tạo sinh viên

`POST http://localhost:3000/api/sinhvien`

```json
{
  "maSinhVien": "SV001",
  "hoTen": "Nguyen Van An",
  "email": "an@example.com"
}
```

### Tạo môn học

`POST http://localhost:3000/api/monhoc`

```json
{
  "maMonHoc": "NEST101",
  "tenMonHoc": "Lap trinh NestJS",
  "soTinChi": 3
}
```

### Đăng ký môn học (3.3)

`POST http://localhost:3000/api/dangki`

```json
{
  "sinhVienId": 1,
  "monHocId": 1
}
```

Thay hai giá trị ID bằng ID sinh viên và môn học vừa tạo. Request thành công tạo một bản ghi trong bảng `dangki`. API trả `404` nếu không tìm thấy sinh viên/môn học, `409` nếu đăng ký trùng và `400` nếu dữ liệu không hợp lệ.

### Liệt kê sinh viên đã đăng ký (3.4)

`GET http://localhost:3000/api/dangki/sinhvien`

Response gồm sinh viên và các môn học đã đăng ký. API trả danh sách rỗng nếu chưa có đăng ký.

Các API xem dữ liệu khác: `GET /api/sinhvien`, `GET /api/monhoc`, `GET /api/dangki`.

## Minh chứng nộp bài

Chèn các ảnh sau vào báo cáo:

1. **3.1:** terminal thể hiện kết nối TypeORM và ứng dụng khởi động thành công.
2. **3.2:** cấu trúc project và các lớp entity, service, module, controller.
3. **3.3:** request `POST /api/dangki` cùng response thành công.
4. **3.4:** request `GET /api/dangki/sinhvien` cùng response có sinh viên đã đăng ký.

## Kiểm tra project

```powershell
npm run build
npm run test
npm run lint
```
