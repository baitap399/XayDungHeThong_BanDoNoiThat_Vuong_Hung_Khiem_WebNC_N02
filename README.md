#Gia Dụng Việt

## Thành viên

| Họ và tên        | Mã sinh viên |
| ------------------- | -------------- |
| Nguyễn Quang Hưng | 23010103       |
| Vi Hùng Vương    | 23016891       |
|Nguyễn Anh Khiêm|23010092|


## Tổng quan hệ thống

Gia dụng Việt mô phỏng quy trình mua sắm trực tuyến từ lúc khách tìm sản phẩm đến khi cửa hàng tiếp nhận và xử lý đơn. Người mua có thể duyệt danh mục, tìm kiếm, xem thông tin sản phẩm, lưu sản phẩm yêu thích, quản lý giỏ hàng, áp mã giảm giá và theo dõi đơn hàng. Quản trị viên có thể cập nhật sản phẩm, xử lý đơn, quản lý người dùng và xem báo cáo doanh thu.


Ứng dụng gồm hai thành phần phối hợp với nhau:

- **Frontend:** giao diện React + TypeScript, cung cấp khu vực mua sắm cho khách hàng và trang quản trị.
- **Backend:** REST API xây dựng bằng NestJS, xử lý xác thực, nghiệp vụ cửa hàng, thanh toán và trao đổi dữ liệu với MySQL.
- **Cơ sở dữ liệu:** MySQL, truy cập qua TypeORM; cấu hình kết nối hiện bật SSL.
- **Dịch vụ tích hợp:** PayOS cho thanh toán QR, Gemini cho chatbot và Resend cho email OTP. Các tích hợp này cần thông tin xác thực riêng.

## Chức năng chính

### Dành cho khách hàng

- Tạo tài khoản, đăng nhập, xác thực OTP khi đặt lại mật khẩu và quản lý hồ sơ.
- Duyệt, tìm kiếm và xem chi tiết sản phẩm; xem đánh giá và chương trình khuyến mãi.
- Quản lý giỏ hàng, sản phẩm yêu thích và địa chỉ giao hàng.
- Đặt hàng, áp dụng mã giảm giá, chọn phương thức thanh toán và xem trạng thái đơn.
- Gửi tin nhắn liên hệ với cửa hàng.
- Trao đổi với chatbot để hỏi về sản phẩm và nhận hỗ trợ theo dữ liệu cửa hàng.

### Dành cho quản trị viên

- Xem bảng điều khiển và báo cáo doanh thu.
- Quản lý sản phẩm, chương trình khuyến mãi, mã giảm giá và tài khoản người dùng.
- Theo dõi đơn hàng và cập nhật trạng thái xử lý.
- Quản lý tài khoản người dùng, mã giảm giá và tin nhắn liên hệ.
- Xem dashboard và doanh thu theo tháng.
- Quản lý nội dung kiến thức cho chatbot.
- Chuyển giao diện quản trị giữa chế độ sáng và tối.

## Công nghệ

| Thành phần   | Công nghệ                              |
| -------------- | ---------------------------------------- |
| Giao diện     | React 19, TypeScript, Vite, React Router |
| API            | NestJS 11, TypeScript, REST              |
| Dữ liệu      | MySQL, TypeORM                           |
| Xác thực     | JWT, phân quyền USER/ADMIN             |
| Thanh toán QR | PayOS                                    |
| Chatbot        | Google Gemini                            |
| Email          | Resend                                   |

## Yêu cầu trước khi chạy

- Node.js **22 trở lên** và npm.
- MySQL tương thích, cùng thông tin máy chủ, tài khoản và cơ sở dữ liệu.
- Git để lấy mã nguồn (nếu chưa có dự án trên máy).

## Hướng dẫn chạy web bằng Terminal

Làm theo các bước dưới đây. Mở Terminal/PowerShell tại **thư mục chứa file README.md**. Cần bật MySQL trước khi chạy Backend.

### Bước 1: Chuẩn bị Backend (chỉ làm lần đầu)

Tạo file cấu hình Backend:

```powershell
cd backend
Copy-Item .env.example .env
```

Mở `backend/.env`, điền thông tin MySQL (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`) và đặt `JWT_SECRET`. Nếu đã có file `.env` thì không cần chép đè; chỉ kiểm tra các thông tin bên trong.

Nếu đây là database mới, nạp `database/schema.sql` bằng MySQL Workbench. Sau đó, trong Terminal ở thư mục `backend`, cài thư viện và cập nhật các bảng:

```powershell
npm install
npm run db:auth-profile
npm run db:chatbot
npm run db:reviews
npm run db:promotions
npm run db:checkout
```

Các lệnh cập nhật database chỉ cần chạy khi cài đặt lần đầu hoặc khi dự án yêu cầu cập nhật schema.

### Bước 2: Mở Backend

Trong Terminal đang ở thư mục `backend`, chạy:

```powershell
npm run start:dev
```

Để Terminal này mở. Backend chạy tại `http://localhost:3000`. API sản phẩm có thể xem tại `http://localhost:3000/api/products`. Backend là nơi cung cấp dữ liệu cho giao diện, không phải trang mua sắm.

### Bước 3: Mở giao diện Frontend Native

Mở **Terminal/PowerShell thứ hai** tại thư mục chứa README.md, rồi chạy lần lượt:

```powershell
cd frontend-native
npm install
npm run web
```

`npm install` chỉ cần chạy lần đầu hoặc sau khi cập nhật thư viện. Khi Expo chạy xong, mở địa chỉ được in trong Terminal, thường là **http://localhost:8081**. Giữ cả hai Terminal (Backend và Expo) mở trong lúc sử dụng web.

Trên trình duyệt, Expo tự chuyển tiếp yêu cầu `/api` đến Backend ở cổng `3000`. Nếu trang không tải được dữ liệu, kiểm tra MySQL và xem Terminal Backend có báo lỗi không.

### Nếu có mã nguồn Frontend Vite

Checkout hiện tại không có thư mục `frontend/`, nên dùng Frontend Native ở Bước 3. Nếu bạn có bản mã nguồn khác có thư mục `frontend/`, hãy mở Terminal thứ ba tại thư mục chứa README.md và chạy:

```powershell
cd frontend
npm install
npm run dev
```

Mở địa chỉ Vite in trong Terminal (thường **http://localhost:5173**). Website Vite và Backend phải cùng chạy. Một số trang chưa chuyển đổi của Frontend Native sẽ chuyển sang website Vite này.

### Mỗi lần mở web sau lần đầu

1. Bật MySQL.
2. Mở Terminal thứ nhất, chạy Backend:

   ```powershell
   cd backend
   npm run start:dev
   ```

3. Mở Terminal thứ hai, chạy giao diện:

   ```powershell
   cd frontend-native
   npm run web
   ```

4. Truy cập **http://localhost:8081** (hoặc URL Expo in ra trong Terminal). Dừng máy chủ bằng `Ctrl+C` trong Terminal tương ứng.

Khi dùng Frontend Vite từ bản mã nguồn có thư mục `frontend/`, chạy thêm `cd frontend` rồi `npm run dev` trong một Terminal khác và mở `http://localhost:5173`.

## Tài khoản và dữ liệu trình diễn

File `database/schema.sql` cung cấp dữ liệu khởi tạo. Hãy kiểm tra tài khoản mẫu trực tiếp trong file SQL trước khi đăng nhập; nếu không có tài khoản phù hợp, đăng ký tài khoản mới và cấp vai trò ADMIN trong database khi cần trình diễn khu vực quản trị. Không sử dụng mật khẩu mẫu trên môi trường công khai.

## Build ứng dụng

Chạy riêng trong từng thư mục:

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Cấu trúc mã nguồn

```text
backend/
  src/
    admin/       Dashboard và nghiệp vụ quản trị
    auth/        Đăng ký, đăng nhập, hồ sơ, JWT
    chat/        Chatbot, hội thoại và kiến thức
    database/    Cấu hình TypeORM và entity
    orders/      Đơn hàng
    payment/     Thanh toán và PayOS
    products/    Sản phẩm
    promotions/  Chương trình khuyến mãi
    reviews/     Đánh giá sản phẩm
  scripts/       Script thiết lập/cập nhật schema
frontend/
  src/
    api/         Giao tiếp với backend
    components/  Thành phần giao diện tái sử dụng
    context/     Trạng thái đăng nhập và giỏ hàng
    layouts/     Bố cục khách hàng và quản trị
    pages/       Các trang của ứng dụng
database/
  schema.sql     Schema cơ sở và dữ liệu khởi tạo
  *.sql          Schema bổ sung cho các chức năng mở rộng
```

## Giấy phép (License)

Dự án này được phát hành dưới giấy phép [MIT](LICENSE). Xem chi tiết tại file [LICENSE](LICENSE).

