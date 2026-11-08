# ĐỀ CƯƠNG BÁO CÁO MÔN WEB NÂNG CAO

## Đề tài

**Xây dựng website thương mại điện tử Gia dụng Việt**  
Frontend: Expo, React Native Web, TypeScript, Expo Router, React Bootstrap.  
Backend: NestJS, REST API, TypeORM, MySQL.  

> Đây là mục lục và hướng dẫn nội dung để hoàn thiện báo cáo Web nâng cao. Số trang sẽ cập nhật sau khi dàn trang bản cuối. Các ghi chú `[CẦN HÌNH/SƠ ĐỒ: …]` là vị trí để nhóm tự chèn minh họa.

## Phần đầu báo cáo

- Trang bìa theo mẫu của khoa/trường.
- Lời cảm ơn.
- Lời cam đoan và ghi nhận nguồn tài nguyên bên thứ ba.
- Thông tin nhóm, lớp học phần, giảng viên hướng dẫn.
- Phân công và tỷ lệ đóng góp của từng thành viên.
- Mục lục.
- Danh mục hình, sơ đồ, bảng và từ viết tắt.

## CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI

### 1.1. Bối cảnh và vấn đề

Nêu nhu cầu mua sắm đồ gia dụng trực tuyến; khó khăn trong tra cứu sản phẩm, theo dõi đơn hàng và quản lý tập trung của cửa hàng.

### 1.2. Mục tiêu đề tài

Xây dựng ứng dụng web mua sắm có khu vực khách hàng và quản trị; trình bày rõ phần đã triển khai trong mã nguồn và phần mới dừng ở mô phỏng/định hướng.

### 1.3. Đối tượng và phạm vi

Khách hàng, quản trị viên và các nghiệp vụ sản phẩm, tài khoản, giỏ hàng, đặt hàng, thanh toán, khuyến mãi, đánh giá, liên hệ, chatbot. Nêu rõ giới hạn tích hợp dịch vụ ngoài.

### 1.4. Công nghệ và môi trường phát triển

Expo, React Native Web, TypeScript, Expo Router, React Bootstrap; NestJS, REST, TypeORM, MySQL; JWT và các dịch vụ tích hợp đang có trong mã nguồn. Phân biệt frontend-native với frontend Vite nếu đề cập cả hai.

### 1.5. Bố cục báo cáo

Tóm tắt nội dung từng chương.

## CHƯƠNG 2. PHÂN TÍCH YÊU CẦU VÀ NGHIỆP VỤ

### 2.1. Vai trò người dùng và quyền hạn

Mô tả khách vãng lai/khách hàng và quản trị viên; nêu quyền truy cập tương ứng.

### 2.2. User stories

Trình bày **ít nhất 12 user stories** cho nhóm 2 thành viên; nên lập 16 câu chuyện để bao quát các vai trò và nghiệp vụ. Dùng đúng mẫu: “Là [vai trò], tôi muốn [mục tiêu], để [giá trị]”. Lập bảng mã US, vai trò, câu chuyện, tiêu chí chấp nhận, độ ưu tiên và tỷ lệ điểm. Phân bổ tỷ lệ theo độ phức tạp/phạm vi, tổng bằng 100%; ghi rõ cách quy đổi điểm theo yêu cầu của giảng viên.

### 2.3. Yêu cầu chức năng

#### 2.3.1. Tài khoản, đăng nhập và hồ sơ

#### 2.3.2. Tìm kiếm, danh mục và chi tiết sản phẩm

#### 2.3.3. Yêu thích, giỏ hàng và địa chỉ giao hàng

#### 2.3.4. Đặt hàng, báo giá và thanh toán

#### 2.3.5. Đơn hàng, đánh giá và liên hệ

#### 2.3.6. Khuyến mãi, mã giảm giá và chatbot

#### 2.3.7. Chức năng quản trị

### 2.4. Yêu cầu phi chức năng

Tính dễ sử dụng, khả năng tương thích web, hiệu năng, độ tin cậy, bảo trì, bảo mật và khả năng mở rộng; chỉ đưa số đo khi đã kiểm thử.

### 2.5. Quy trình nghiệp vụ và luồng thông tin

Mô tả luồng đăng ký/đăng nhập, duyệt sản phẩm, giỏ hàng, đặt hàng/thanh toán, và quản trị đơn hàng. Ghi rõ nhánh lỗi và điều kiện đầu vào/đầu ra.

### 2.6. Đối tượng và quan hệ

Liệt kê Actor, entity nghiệp vụ và quan hệ chính giữa khách hàng, sản phẩm, giỏ hàng, đơn hàng, thanh toán, khuyến mãi và đánh giá.

**[CẦN SƠ ĐỒ: Use Case tổng quát; có thể tách sơ đồ khách hàng và quản trị viên.]**

**[CẦN SƠ ĐỒ: Activity/flowchart cho luồng đặt hàng và thanh toán.]**

## CHƯƠNG 3. THIẾT KẾ HỆ THỐNG

### 3.1. Kiến trúc tổng thể

Giải thích mô hình frontend–backend phân lớp và luồng React Native Web/Expo Router → REST API NestJS → TypeORM → MySQL; trình bày dịch vụ ngoài nếu luồng đó có trong phạm vi phiên bản báo cáo.

**[CẦN SƠ ĐỒ: Kiến trúc triển khai, các thành phần và hướng trao đổi dữ liệu.]**

### 3.2. Thiết kế frontend và điều hướng

Tổ chức route Expo Router, layout, nhóm màn hình khách hàng/quản trị, thành phần dùng lại và cách gọi API. Nêu vai trò React Bootstrap trong giao diện web; không mô tả React Native như React DOM thuần.

### 3.3. Thiết kế backend NestJS

Trình bày Module–Controller–Service–DTO, xác thực/ủy quyền, validation và xử lý lỗi theo cấu trúc thực tế của dự án.

**[CẦN SƠ ĐỒ: Sơ đồ phân lớp NestJS và quan hệ giữa Controller, Service, DTO, Entity.]**

### 3.4. Biểu đồ lớp UML

Nêu lớp/entity chính, thuộc tính tiêu biểu, quan hệ và bội số. Sơ đồ phải khớp mã nguồn/entity hiện tại, không đưa lớp giả định như đã triển khai.

**[CẦN SƠ ĐỒ: Class Diagram UML.]**

### 3.5. Thiết kế dữ liệu và ORM

Mô tả các bảng, khóa chính/ngoại, quan hệ và cách TypeORM ánh xạ entity sang MySQL; giải thích truy vấn/ghi dữ liệu tiêu biểu và tính toàn vẹn dữ liệu.

**[CẦN SƠ ĐỒ: ERD được đối chiếu với schema SQL hiện tại.]**

### 3.6. Thiết kế API

Tóm tắt endpoint theo module, HTTP method, quyền yêu cầu, dữ liệu đầu vào/đầu ra, mã phản hồi và lỗi thường gặp. Phần chi tiết có thể đưa vào phụ lục/API collection.

### 3.7. Thiết kế bảo mật

Trình bày JWT, băm mật khẩu, phân quyền USER/ADMIN, validation, giới hạn truy cập, CORS, cookie/token nếu áp dụng, quản lý secret qua biến môi trường và bảo vệ dữ liệu khi gọi API. Chỉ khẳng định cơ chế đã được kiểm tra trong mã nguồn.

### 3.8. Wireframe và thiết kế giao diện

Giải thích bố cục, điều hướng, thành phần chung, trạng thái tải/rỗng/lỗi và nguyên tắc giảm thao tác cho người dùng.

**[CẦN HÌNH: Wireframe các màn hình chính — Trang chủ, danh sách/chi tiết sản phẩm, giỏ hàng/checkout, đăng nhập, dashboard quản trị.]**

## CHƯƠNG 4. CÀI ĐẶT VÀ HIỆN THỰC CHỨC NĂNG

### 4.1. Cấu trúc mã nguồn và cách khởi chạy

Mô tả các thư mục frontend-native, backend, database và lệnh chạy; nêu cấu hình môi trường mẫu, không đưa secret thật vào báo cáo.

### 4.2. Hiện thực frontend

Mô tả điều hướng, gọi API, quản lý trạng thái, xác thực, giao diện responsive/web và các màn hình đã hoàn thành.

### 4.3. Hiện thực backend và REST API

Mô tả các module nghiệp vụ, DTO/validation, controller/service, xác thực và phản hồi lỗi; minh họa một vài API tiêu biểu.

### 4.4. Hiện thực truy cập cơ sở dữ liệu bằng TypeORM

Minh họa entity, repository/query và ít nhất một luồng đọc/ghi dữ liệu thật của hệ thống.

### 4.5. Tích hợp dịch vụ

Mô tả PayOS, email OTP, chatbot hoặc dịch vụ khác nếu đã cấu hình và có bằng chứng chạy; phân biệt tích hợp thật, sandbox và mô phỏng.

### 4.6. Giao diện và trải nghiệm sử dụng

Đánh giá tính nhất quán, khả năng tìm thấy chức năng, số thao tác cho tác vụ chính, thông báo lỗi/thành công và trạng thái trên thiết bị/kích thước màn hình đã kiểm tra.

**[CẦN HÌNH: Ảnh chụp màn hình chức năng đã chạy, có chú thích và dữ liệu demo không nhạy cảm.]**

## CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ

### 5.1. Chiến lược và môi trường kiểm thử

Ghi phiên bản môi trường, dữ liệu thử, cách chạy và phạm vi test tự động/thủ công.

### 5.2. Kiểm thử đơn vị và kiểm thử API

Lập bảng mã test, chức năng, tiền điều kiện, bước kiểm tra, kết quả mong đợi, kết quả thực tế và trạng thái.

### 5.3. Kiểm thử giao diện

Kiểm tra luồng người dùng, điều hướng, biểu mẫu, responsive, trạng thái tải/rỗng/lỗi và phân quyền giao diện.

### 5.4. Phân tích trường hợp thành công và thất bại

Bao gồm dữ liệu hợp lệ/không hợp lệ, chưa đăng nhập, sai quyền, sản phẩm hết tồn, đặt hàng lặp, thanh toán lỗi hoặc dịch vụ ngoài không sẵn sàng.

### 5.5. Kết quả, lỗi đã xử lý và hạn chế

Đưa số liệu đúng với log/kết quả thực chạy; ghi rõ chức năng chưa kiểm thử hoặc chỉ mô phỏng.

**[CẦN HÌNH: Ảnh kết quả chạy test, báo cáo test hoặc minh chứng luồng kiểm thử.]**

## CHƯƠNG 6. QUẢN LÝ DỰ ÁN VÀ TRÁCH NHIỆM NGHỀ NGHIỆP

### 6.1. Kế hoạch và quy trình phối hợp

Tóm tắt các mốc công việc, cách theo dõi nhiệm vụ và xử lý thay đổi.

### 6.2. Phân công và đóng góp thành viên

Nêu nhiệm vụ cụ thể của từng người và tỷ lệ đóng góp có căn cứ.

### 6.3. Lịch sử Git và minh chứng làm việc nhóm

Thống kê commit/PR theo thành viên, nêu đóng góp tiêu biểu; số liệu cần lấy từ Git thật.

### 6.4. Pháp luật, đạo đức xã hội và đạo đức nghề nghiệp

Thảo luận dữ liệu cá nhân, bản quyền mã nguồn/hình ảnh, ghi nguồn, bảo mật tài khoản, tính minh bạch của giá/khuyến mãi và trách nhiệm khi dùng AI/dịch vụ bên thứ ba.

### 6.5. Bài học và kiến thức cần tiếp tục học

Nêu điểm mạnh, điểm cần cải thiện và kế hoạch học tập gắn với React Native Web/Expo, NestJS, kiểm thử và bảo mật.

## CHƯƠNG 7. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 7.1. Kết quả đạt được

Đối chiếu mục tiêu và user stories với chức năng có bằng chứng.

### 7.2. Hạn chế

Nêu hạn chế của phiên bản hiện tại, phạm vi tích hợp và kiểm thử.

### 7.3. Hướng phát triển

Chỉ đề xuất các bước tiếp theo khả thi: hoàn thiện kiểm thử/tích hợp, tối ưu hiệu năng, tăng cường bảo mật, triển khai và mở rộng trải nghiệm.

## TÀI LIỆU THAM KHẢO

Ghi nguồn tài liệu chính thức, thư viện, hình ảnh và nội dung tham khảo theo một quy cách thống nhất.

## PHỤ LỤC

- Phụ lục A. Danh sách user stories và tiêu chí chấp nhận.
- Phụ lục B. Bảng endpoint/tài liệu API.
- Phụ lục C. Test case và kết quả kiểm thử.
- Phụ lục D. Link demo (thời lượng trình diễn dưới 8 phút) và GitHub repository.
- Phụ lục E. Bảng đóng góp thành viên và minh chứng Git.
- Phụ lục F. Hướng dẫn cài đặt/chạy dự án; loại bỏ thông tin bí mật.

