Câu 2.
Đề tài:
Xây dựng hệ thống quản lý kinh doanh nội thất và gia dụng
Hệ thống hỗ trợ cửa hàng kinh doanh các sản phẩm nội thất như:
•	Bàn 
•	Ghế 
•	Giường 
•	Tủ 
•	Sofa 
•	Kệ 
•	Đèn 
•	Đồ trang trí...
Câu 3.
Có 2 đối tượng chính:
Khách hàng
-	Đăng ký / đăng nhập 
-	Xem sản phẩm 
-	Tìm kiếm sản phẩm 
-	Lọc sản phẩm 
-	Thêm vào giỏ hàng 
-	Đặt hàng 
-	Thanh toán 
-	Xem lịch sử đơn hàng 
-	Đánh giá sản phẩm 
Quản trị viên
-	Quản lý sản phẩm 
-	Quản lý danh mục 
-	Quản lý khách hàng 
-	Quản lý đơn hàng 
-	Quản lý tồn kho 
-	Quản lý đánh giá 
-	Xem thống kê doanh thu
Các đối tượng trong hệ thống:
User, Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, Payment, Review, Address, Inventory.
Mối quan hệ
User – Address
Một khách hàng có thể có nhiều địa chỉ.
User 1 ─────── N Address
Category – Product
Một danh mục có nhiều sản phẩm.
Category 1 ─────── N Product
Ví dụ:
Sofa
 ├── Sofa 2 chỗ
 ├── Sofa 3 chỗ
 └── Sofa chữ L
User – Cart
Một khách hàng có một giỏ hàng.
User 1 ─────── 1 Cart
Cart – CartItem
Một giỏ hàng có nhiều sản phẩm.
Cart 1 ─────── N CartItem
Product – CartItem
Một sản phẩm có thể xuất hiện trong nhiều giỏ hàng.
Product 1 ─────── N CartItem
User – Order
Một khách hàng có thể có nhiều đơn hàng.
User 1 ─────── N Order
Order – OrderItem
Một đơn hàng có nhiều sản phẩm.
Order 1 ─────── N OrderItem
Product – OrderItem
Một sản phẩm có thể xuất hiện trong nhiều đơn hàng.
Product 1 ─────── N OrderItem
Order – Payment
Một đơn hàng có một thông tin thanh toán.
Order 1 ─────── 1 Payment
User – Review
Một khách hàng có thể viết nhiều đánh giá.
User 1 ─────── N Review
Product – Review
Một sản phẩm có nhiều đánh giá.
Product 1 ─────── N Review
