 # BÀI THỰC HÀNH KIỂM THỬ HỘP TRẮNG

## 1. Giới thiệu

Dự án thực hiện kiểm thử hộp trắng (White-box Testing) cho các chương trình Java cơ bản.

Mục tiêu của bài thực hành:

* Kiểm tra tính đúng đắn của chương trình.
* Phân tích cấu trúc bên trong của mã nguồn.
* Xác định các câu lệnh, điều kiện và nhánh của chương trình.
* Thiết kế các trường hợp kiểm thử dựa trên cấu trúc mã nguồn.
* Sử dụng JUnit 5 để tự động hóa kiểm thử.
* Sử dụng JaCoCo để đo độ bao phủ mã nguồn.

---

## 2. Công nghệ sử dụng

* **Java 17**
* **Maven**
* **JUnit 5**
* **JaCoCo 0.8.12**
* **Visual Studio Code**

---

## 3. Cấu trúc dự án

```text
kiem-thu-hop-trang/
│
├── src/
│   ├── main/
│   │   └── java/
│   │       └── WhiteBoxExercises.java
│   │
│   └── test/
│       └── java/
│           └── WhiteBoxExercisesTest.java
│
├── target/
│   └── site/
│       └── jacoco/
│           └── index.html
│
├── pom.xml
├── README.md
└── .gitignore
```

---

## 4. Nội dung chương trình

File `WhiteBoxExercises.java` gồm các chức năng:

### 4.1. Tính chu vi hình chữ nhật

Hàm:

```java
rectanglePerimeter(double length, double width)
```

Công thức:

```text
P = 2 × (length + width)
```

Kiểm tra kích thước âm và phát sinh `IllegalArgumentException` nếu dữ liệu không hợp lệ.

---

### 4.2. Tính diện tích hình chữ nhật

Hàm:

```java
rectangleArea(double length, double width)
```

Công thức:

```text
S = length × width
```

Kiểm tra kích thước âm.

---

### 4.3. Giải phương trình bậc hai

Hàm:

```java
solveQuadratic(double a, double b, double c)
```

Xử lý các trường hợp:

* `a = 0, b = 0, c = 0`: vô số nghiệm.
* `a = 0, b = 0, c != 0`: vô nghiệm.
* `a = 0, b != 0`: phương trình bậc nhất.
* `a != 0, delta < 0`: vô nghiệm.
* `a != 0, delta = 0`: nghiệm kép.
* `a != 0, delta > 0`: hai nghiệm phân biệt.

---

### 4.4. Tính số ngày trong tháng

Hàm:

```java
daysInMonth(int month, int year)
```

Xử lý:

* Tháng không hợp lệ.
* Tháng 2 của năm nhuận.
* Tháng 2 của năm thường.
* Các tháng có 30 ngày.
* Các tháng có 31 ngày.

Hàm `isLeapYear()` được sử dụng để kiểm tra năm nhuận.

---

### 4.5. Kiểm tra số nguyên tố

Hàm:

```java
isPrime(int n)
```

Kiểm tra:

* Số nhỏ hơn 2.
* Số 2.
* Số chẵn.
* Số nguyên tố lẻ.
* Số hợp số.

---

### 4.6. Tính tổng xen kẽ

Hàm:

```java
alternatingSum(int n)
```

Tính:

```text
S = 1 - 2 + 3 - 4 + ... + n
```

---

### 4.7. Tìm UCLN

Hàm:

```java
gcd(int a, int b)
```

Sử dụng thuật toán Euclid để tìm ước chung lớn nhất.

---

### 4.8. Tính giai thừa

Hàm:

```java
factorial(int n)
```

Tính:

```text
n! = 1 × 2 × 3 × ... × n
```

---

### 4.9. Tính tổng các giai thừa

Hàm:

```java
factorialSum(int n)
```

Tính:

```text
S = 1! + 2! + 3! + ... + n!
```

---

## 5. Phương pháp kiểm thử

Dự án sử dụng phương pháp **kiểm thử hộp trắng**.

Các bước thực hiện:

1. Phân tích mã nguồn.
2. Xác định các câu lệnh điều kiện.
3. Xác định các nhánh của chương trình.
4. Xác định các đường đi cần kiểm thử.
5. Thiết kế test case.
6. Viết JUnit Test.
7. Chạy toàn bộ test.
8. Sử dụng JaCoCo để kiểm tra độ bao phủ mã nguồn.

---

## 6. JUnit Test

File kiểm thử:

```text
src/test/java/WhiteBoxExercisesTest.java
```

JUnit được sử dụng để kiểm tra kết quả của các hàm trong `WhiteBoxExercises`.

Các phương thức kiểm thử sử dụng:

```java
assertEquals()
assertTrue()
assertFalse()
assertThrows()
```

Trong đó `assertThrows()` được sử dụng để kiểm tra các trường hợp chương trình phải phát sinh ngoại lệ.

---

## 7. Chạy kiểm thử

Mở Terminal tại thư mục dự án và chạy:

```bash
mvn clean test
```

Nếu tất cả kiểm thử thành công, Maven sẽ hiển thị:

```text
BUILD SUCCESS
```

Các test không được có:

```text
Failures
Errors
```

---

## 8. Kiểm tra độ bao phủ bằng JaCoCo

Sau khi chạy:

```bash
mvn clean test
```

JaCoCo sẽ tạo báo cáo tại:

```text
target/site/jacoco/index.html
```

Có thể mở báo cáo bằng lệnh:

```cmd
start target\site\jacoco\index.html
```

Báo cáo JaCoCo cung cấp các thông tin:

* Instructions Coverage
* Branch Coverage
* Lines Coverage
* Methods Coverage
* Classes Coverage

### Kết quả kiểm thử

Kết quả JaCoCo của dự án:

| Chỉ số       | Kết quả |
| ------------ | ------: |
| Instructions |     98% |
| Branches     |    100% |
| Lines        |     98% |
| Methods      |     91% |
| Classes      |    100% |

Kết quả cho thấy các nhánh của chương trình đã được kiểm thử đầy đủ theo báo cáo JaCoCo.

---

## 9. Một số test case tiêu biểu

### Phương trình bậc hai

| Test case             |  a |  b |  c | Kết quả mong đợi |
| --------------------- | -: | -: | -: | ---------------- |
| Hai nghiệm            |  1 | -3 |  2 | Hai nghiệm       |
| Nghiệm kép            |  1 |  2 |  1 | Nghiệm kép       |
| Vô nghiệm             |  1 |  0 |  1 | Vô nghiệm        |
| Phương trình bậc nhất |  0 |  2 | -4 | x = 2            |
| Vô số nghiệm          |  0 |  0 |  0 | Vô số nghiệm     |
| Vô nghiệm             |  0 |  0 |  5 | Vô nghiệm        |

### Số nguyên tố

| Test case      | Giá trị | Kết quả |
| -------------- | ------: | ------- |
| Nhỏ hơn 2      |       1 | `false` |
| Số 2           |       2 | `true`  |
| Số chẵn        |       4 | `false` |
| Số nguyên tố   |       7 | `true`  |
| Hợp số lẻ      |       9 | `false` |
| Nhiều vòng lặp |      17 | `true`  |

### Giai thừa

| Test case |  n |   Kết quả |
| --------- | -: | --------: |
| n = 0     |  0 |         1 |
| n = 1     |  1 |         1 |
| n = 5     |  5 |       120 |
| n âm      | -1 | Exception |

---

## 10. Kết luận

Qua bài thực hành, chương trình đã được kiểm thử bằng phương pháp kiểm thử hộp trắng kết hợp với JUnit 5.

Các trường hợp kiểm thử được xây dựng dựa trên cấu trúc điều kiện, nhánh và vòng lặp trong chương trình.

JaCoCo được sử dụng để đánh giá độ bao phủ mã nguồn. Kết quả đạt:

```text
Branch Coverage: 100%
Instruction Coverage: 98%
Line Coverage: 98%
Method Coverage: 91%
Class Coverage: 100%
```

Các kiểm thử được thực hiện thành công và không phát hiện lỗi trong các trường hợp đã xây dựng.

