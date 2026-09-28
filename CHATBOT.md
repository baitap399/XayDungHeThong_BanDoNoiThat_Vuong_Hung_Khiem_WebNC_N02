# Chatbot Knowledge Base

## Vận hành

Yêu cầu Node.js >= 20.12 (máy hiện tại dùng 22.8). Dùng lại `@google/genai`, TypeORM, MySQL, JWT, Axios; không cài dependency mới.

Trong `backend/.env`, đặt `GEMINI_API_KEY=...` rồi khởi động lại backend. Key chỉ đọc ở backend; `.env` vẫn được gitignore. Giữ model hiện có `gemini-3.5-flash-lite`.

```powershell
cd backend
npm.cmd run db:chatbot
npm.cmd run start:dev
```

Terminal khác:

```powershell
cd frontend
npm.cmd run dev
```

Repo chưa có TypeORM migration runner; cấu hình database hiện tại dùng `synchronize: true` và được giữ nguyên. `db:chatbot` là script SQL bổ sung, chạy `CREATE TABLE IF NOT EXISTS chatbot_knowledge`, không sửa các bảng khác. Đã chạy trên database hiện tại. Khi triển khai production, chạy script này trong quy trình quản lý schema của môi trường; script không bật synchronize. File SQL: `database/chatbot_knowledge.sql`.

## Luồng xử lý

1. Chuẩn hóa câu hỏi, tra khóa SHA-256 có index trong MySQL; chỉ chọn `approved`. Nhận diện đồng nghĩa như “ship hàng” / “giao hàng”.
2. Nếu chưa có exact match, lấy tối đa 100 ứng viên bằng keywords và tính độ trùng từ với ngưỡng 0.9; không dùng kết quả mơ hồ. Số tiền, phủ định và các từ so sánh được giữ riêng để tránh gộp nhầm câu hỏi. Đây là lexical similarity, chưa phải embeddings. `chat-matching.ts` là nơi có thể thay cách tính điểm sau này.
3. Knowledge tổng quát khớp thì trả ngay, tăng `usage_count` bằng phép tăng nguyên tử, không gọi Gemini.
4. Với câu hỏi sản phẩm, query MySQL theo các trường hiện có, giới hạn giá/tồn kho, tối đa 5 sản phẩm. Tên/brand/category/description là các trường tìm kiếm; mô tả/thông số gửi đi được giới hạn độ dài. Chỉ các mẫu giá đã nhận diện được mới trở thành bộ lọc SQL. Cách hỏi không nhận diện đầy đủ có thể cho ít kết quả, không đảm bảo tìm kiếm ngữ nghĩa mọi cách diễn đạt.
5. Knowledge có dữ liệu sản phẩm chỉ được tái dùng nếu hash dữ liệu hiện tại còn khớp. Giá, tồn kho hoặc kết quả truy vấn thay đổi sẽ làm bản trả lời cũ không còn hợp lệ. Câu trả lời sản phẩm chỉ exact match, không fuzzy match giữa các nhu cầu khác nhau.
6. Chưa có câu hợp lệ thì gọi Gemini một lần, truyền câu hỏi và tối đa 5 sản phẩm liên quan; không truyền toàn bộ KB/catalog. Giới hạn đầu ra 600 token, timeout 15 giây, tắt retry tự động của SDK.
7. Lưu Q&A mới ở `pending`. Khóa unique `(question_key, context_hash)` chống lưu trùng và không ghi đè quyết định duyệt/từ chối. Sửa nội dung đưa về Pending; phải duyệt lại. Nếu lưu thất bại, người dùng vẫn nhận câu trả lời, backend ghi bộ đếm lỗi lưu để admin biết.

MySQL chính là bộ nhớ trả lời lâu dài. Không có cache RAM cho nội dung nên reject/edit/delete có hiệu lực ở các request tiếp theo. Chưa cần Redis, vector database hoặc fine-tune.

## Quản trị

Đăng nhập tài khoản ADMIN hiện có → menu **Chatbot Knowledge** tại `/admin/chatbot/knowledge`.

- Pending: xem và chỉnh câu hỏi/câu trả lời, sau đó **Approve**.
- Approved: chatbot được phép dùng; **Reject** để ngừng sử dụng.
- **Tạo FAQ**: nhập câu hỏi, câu trả lời, từ khóa tùy chọn; lưu Pending rồi Approve.
- **Edit**: lưu sửa đổi đưa về Pending. Với sản phẩm cần kiểm tra lại thông tin hiện tại trước khi duyệt.
- **Delete**: có xác nhận trên giao diện; xóa bản ghi vĩnh viễn.

Không có FAQ chính sách cửa hàng được tự động tạo/duyệt sẵn. Admin chịu trách nhiệm xác nhận câu trả lời trước khi cho tái sử dụng.

Thống kê `totalQuestions`, `knowledgeHits`, `geminiCalls`, `productQueries`, `knowledgeHitRate`, `errors`, `pendingSaveFailures` tính trong một tiến trình kể từ `since`; reset khi backend restart. `productQueries` đếm lượt chat có ngữ cảnh sản phẩm. `geminiCalls` tính cả lần gọi lỗi, kể cả câu trả lời `source=product`. `usage_count` từng knowledge được lưu trong MySQL, không reset khi restart.

## API

Prefix toàn cục vẫn là `/api`; API mới dùng JWT + RolesGuard hiện tại, chỉ cho ADMIN:

| Method | Endpoint | Nội dung |
| --- | --- | --- |
| GET | `/api/admin/chatbot/knowledge?status=pending&page=1&limit=20` | Danh sách phân trang; status có thể bỏ qua |
| GET | `/api/admin/chatbot/knowledge/:id` | Chi tiết |
| POST | `/api/admin/chatbot/knowledge` | Tạo Pending: `{ "question": "...", "answer": "...", "keywords": "..." }` |
| PATCH | `/api/admin/chatbot/knowledge/:id` | Sửa question/answer/keywords, đưa về Pending |
| PATCH | `/api/admin/chatbot/knowledge/:id/approve` | Duyệt |
| PATCH | `/api/admin/chatbot/knowledge/:id/reject` | Từ chối |
| DELETE | `/api/admin/chatbot/knowledge/:id` | Xóa |
| GET | `/api/admin/chatbot/stats` | Thống kê tiến trình |

`POST /api/chat` giữ request `{ "message": "..." }` (1–1000 ký tự sau trim), bổ sung `source` và `knowledgeId` khi trả từ knowledge:

```json
{ "message": "...", "source": "knowledge", "knowledgeId": 12 }
```

`source=product`: câu trả lời Gemini dựa trên kết quả tra sản phẩm. `source=gemini`: trả lời mới không kèm sản phẩm. Widget khách hàng vẫn chỉ hiển thị message.

Lỗi: validation 400, chưa đăng nhập 401, thiếu quyền 403, trùng/đã đổi dữ liệu 409, Gemini rate-limit 429, lỗi ngoài dự kiến 500, thiếu key/DB hoặc Gemini unavailable 503, timeout 504. Không trả lỗi thô/credentials về frontend và không ghi key/token/nội dung chat vào log.

## Kiểm thử

```powershell
cd backend
npm.cmd run test:chat
npm.cmd run build
node.exe scripts/verify-chatbot.cjs
# Tùy chọn: thêm một request Gemini thật, dùng key từ backend/.env
node.exe scripts/verify-chatbot.cjs --gemini
```

```powershell
cd frontend
npm.cmd run build
```

`test:chat` dùng node:test và Nest TestingModule sẵn có. Kiểm thử HTTP với JWT/roles thật; kho dữ liệu và Gemini giả lập để không tốn quota. Bao phủ lời chào, FAQ/ship, câu hỏi lặp trước/sau approve, câu mới lưu pending, query giá/tồn kho, thay đổi dữ liệu sản phẩm, CRUD, phân quyền 401/403, input sai/quá dài, thiếu key, 429/503/504/500 và lỗi lưu DB. Kiểm tra SQL được TypeORM tạo với bound parameters và LIMIT.

`verify-chatbot.cjs` dùng MySQL thật, `synchronize:false`; mọi knowledge kiểm thử nằm trong transaction và được rollback. `--gemini` kiểm tra câu trả lời thật → pending → approve → hỏi lại; assert hai câu hỏi chỉ gọi Gemini một lần. Không sửa products.

## File thay đổi

Tạo mới:

- `backend/src/database/entities/chatbot-knowledge.entity.ts`
- `backend/src/chat/chat-matching.ts`
- `backend/src/chat/chat-products.service.ts`
- `backend/src/chat/knowledge.service.ts`
- `backend/src/chat/knowledge.controller.ts`
- `backend/src/chat/dto/knowledge.dto.ts`
- `backend/src/chat/chat.spec.ts`
- `backend/scripts/setup-chatbot.cjs`
- `backend/scripts/verify-chatbot.cjs`
- `database/chatbot_knowledge.sql`
- `frontend/src/api/knowledge.ts`
- `frontend/src/pages/admin/ChatbotKnowledgePage.tsx`
- `frontend/src/styles/chatbot-knowledge.css`
- `CHATBOT.md`

Sửa:

- `backend/package.json`: lệnh test và setup bảng.
- `backend/src/chat/chat.module.ts`: đăng ký repository/services/controllers.
- `backend/src/chat/chat.service.ts`: flow knowledge → sản phẩm → Gemini → Pending.
- `backend/src/database/entities.ts` và `entities/index.ts`: đăng ký entity mới.
- `frontend/src/api/types.ts`: kiểu response/knowledge/stats.
- `frontend/src/App.tsx`: route quản lý.
- `frontend/src/layouts/AdminLayout.tsx`: menu quản lý.

Không thêm package. Không sửa `.env`, model đang dùng, widget khách hàng, authentication hoặc các module nghiệp vụ hiện tại.
