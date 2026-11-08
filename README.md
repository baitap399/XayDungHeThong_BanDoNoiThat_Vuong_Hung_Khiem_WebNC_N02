# Gia Dụng Việt

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

## Khởi động dự án và truy cập các giao diện

Dự án có một backend và hai giao diện:

- **Frontend Native (Expo Web)** là giao diện hiện có trong checkout này, thường chạy tại `http://localhost:8081`.
- **Frontend Vite** là website React cũ, nếu có mã nguồn `frontend/` thì chạy tại `http://localhost:5173`; một số màn hình Expo chuyển tiếp sang website này. Checkout hiện tại không có thư mục `frontend/`, nên chỉ chạy được Vite nếu bạn có bản mã nguồn đó.
- **Backend NestJS** cung cấp API tại `http://localhost:3000`; đường dẫn API bắt đầu bằng `/api`.

Cần cài Node.js 22 trở lên, npm và MySQL. Mở các terminal riêng tại thư mục dự án (thư mục chứa README.md) và để backend cùng giao diện cần dùng chạy đồng thời.

### 1. Chuẩn bị cơ sở dữ liệu và backend

Tạo/nạp database bằng `database/schema.sql` trong MySQL Workbench (Server → Data Import → Import from Self-Contained File). Nếu dùng Git Bash, từ thư mục gốc dự án có thể chạy:

```bash
mysql -u root -p < database/schema.sql
```

Tạo `backend/.env` từ `backend/.env.example`, rồi điền thông tin MySQL và `JWT_SECRET`. Nếu dùng MySQL local, kiểm tra `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` và `DB_NAME`. Nếu dùng dịch vụ MySQL yêu cầu SSL, cấu hình CA certificate theo ghi chú trong `backend/.env.example` và `backend/src/database/ssl.ts`.

Cài thư viện và cập nhật các bảng mở rộng (chạy khi thiết lập database mới hoặc khi schema cần cập nhật):

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run db:auth-profile
npm run db:chatbot
npm run db:reviews
npm run db:promotions
npm run db:checkout
```

Khởi động backend trong terminal này:

```powershell
npm run start:dev
```

Backend sẵn sàng tại `http://localhost:3000`; API dùng tiền tố `/api` (ví dụ `http://localhost:3000/api`). Giữ terminal này mở.

### 2. Chạy website Frontend Vite

Nếu bạn có mã nguồn thư mục `frontend/`, mở terminal mới tại thư mục dự án. Tạo `frontend/.env` nếu chưa có:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ALLOWED_HOSTS=
```

Cài thư viện và chạy website:

```powershell
cd frontend
npm install
npm run dev
```

Mở URL Vite được in trong terminal, mặc định là **http://localhost:5173**. Đây là giao diện đầy đủ của website cũ. Nếu checkout không có thư mục `frontend/`, bỏ qua bước này; các màn hình Expo chuyển tiếp cần website Vite sẽ chưa mở được.

### 3. Chạy giao diện Frontend Native (Expo Web)

Mở terminal mới tại thư mục dự án, rồi chạy:

```powershell
cd frontend-native
Copy-Item .env.example .env
npm install
npm run web
```

Mở URL Expo Web được in trong terminal (thường là **http://localhost:8081**). Trang chủ Expo dùng API qua proxy dev đến backend ở `http://localhost:3000`. Các màn hình chưa chuyển đổi sẽ được mở trên website Vite; để sử dụng các luồng đó, cần có và chạy Vite ở cổng `5173`.

Nếu truy cập từ Android Emulator hoặc điện thoại thật, `localhost` không trỏ đến máy tính đang chạy backend. Cập nhật `EXPO_PUBLIC_API_URL` và `EXPO_PUBLIC_API_ORIGIN` trong `frontend-native/.env` theo hướng dẫn trong `frontend-native/README.md` (Android Emulator thường dùng `http://10.0.2.2:3000`; điện thoại thật dùng IP LAN của máy tính hoặc backend HTTPS). Với điện thoại thật, chạy Vite bằng `npm run dev -- --host 0.0.0.0` để thiết bị trong cùng mạng có thể truy cập.

### 4. Thứ tự truy cập nhanh

1. Khởi động MySQL.
2. Chạy backend ở cổng `3000`.
3. Chạy frontend Vite ở cổng `5173` nếu cần website đầy đủ hoặc các trang Expo chuyển tiếp.
4. Chạy frontend-native bằng `npm run web` nếu muốn xem giao diện Expo.
5. Mở URL tương ứng được in ở terminal: Vite `http://localhost:5173`, Expo Web thường `http://localhost:8081`. API backend ở `http://localhost:3000/api`.

Để dùng thanh toán PayOS, chatbot Gemini hoặc email OTP Resend, điền thông tin dịch vụ tương ứng trong `backend/.env`. Xem các mục biến môi trường trong `backend/.env.example` và `frontend-native/README.md` khi chạy trên thiết bị khác máy.

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

