# Bài thực hành 03 - Kiểm thử hộp đen

## 📚 Giới thiệu
Dự án này thực hiện 8 bài toán với kiểm thử hộp đen sử dụng kỹ thuật phân lớp tương đương và phân tích giá trị biên.

## 📋 Các bài toán
1. Tính chu vi hình chữ nhật
2. Tính diện tích hình chữ nhật
3. Giải phương trình bậc 2
4. Tính số ngày của một tháng
5. Kiểm tra n có phải là số nguyên tố hay không
6. Tính tổng S = 1 - 2 + 3 - 4 + ... + n
7. Tìm UCLN của a và b
8. Tính tổng S = 1! + 2! + 3! + ... + n!

## 📁 Cấu trúc thư mục
kiem-thu-hop-den/
├── src/
│ ├── functions.py # Các hàm xử lý chính
│ └── main.py # Chương trình chính
├── tests/
│ └── test_functions.py # File kiểm thử
├── test_cases/
│ ├── test_cases_valid.md # Test case dữ liệu hợp lệ
│ └── test_cases_invalid.md # Test case dữ liệu không hợp lệ
├── results/
│ └── test_results.txt # Kết quả kiểm thử
└── README.md
#####
Cách chạy kiểm thử
python tests/test_functions.py
#####
kiểm thử từng phần
python src/main.py