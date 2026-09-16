 public class WhiteBoxExercises {

    // 1. Tính chu vi hình chữ nhật
    public static double rectanglePerimeter(double length, double width) {
        if (length < 0 || width < 0) {
            throw new IllegalArgumentException("Kich thuoc khong hop le");
        }

        return 2 * (length + width);
    }

    // 2. Tính diện tích hình chữ nhật
    public static double rectangleArea(double length, double width) {
        if (length < 0 || width < 0) {
            throw new IllegalArgumentException("Kich thuoc khong hop le");
        }

        return length * width;
    }

    // 3. Giải phương trình bậc 2
    public static String solveQuadratic(double a, double b, double c) {

        if (a == 0) {
            if (b == 0) {
                if (c == 0) {
                    return "Vo so nghiem";
                } else {
                    return "Vo nghiem";
                }
            }

            double x = -c / b;
            return "Nghiem x = " + x;
        }

        double delta = b * b - 4 * a * c;

        if (delta < 0) {
            return "Vo nghiem";
        } else if (delta == 0) {
            double x = -b / (2 * a);
            return "Nghiem kep x = " + x;
        } else {
            double x1 = (-b + Math.sqrt(delta)) / (2 * a);
            double x2 = (-b - Math.sqrt(delta)) / (2 * a);

            return "Hai nghiem x1 = " + x1 + ", x2 = " + x2;
        }
    }

    // 4. Tính số ngày của một tháng
    public static int daysInMonth(int month, int year) {

        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Thang khong hop le");
        }

        switch (month) {
            case 2:
                if (isLeapYear(year)) {
                    return 29;
                } else {
                    return 28;
                }

            case 4:
            case 6:
            case 9:
            case 11:
                return 30;

            default:
                return 31;
        }
    }

    // Kiểm tra năm nhuận
    public static boolean isLeapYear(int year) {

        if (year % 400 == 0) {
            return true;
        }

        if (year % 100 == 0) {
            return false;
        }

        return year % 4 == 0;
    }

    // 5. Kiểm tra số nguyên tố
    public static boolean isPrime(int n) {

        if (n < 2) {
            return false;
        }

        if (n == 2) {
            return true;
        }

        if (n % 2 == 0) {
            return false;
        }

        for (int i = 3; i * i <= n; i += 2) {
            if (n % i == 0) {
                return false;
            }
        }

        return true;
    }

    // 6. Tính S = 1 - 2 + 3 - 4 + ... + n
    public static int alternatingSum(int n) {

        if (n < 1) {
            throw new IllegalArgumentException("n phai >= 1");
        }

        int sum = 0;

        for (int i = 1; i <= n; i++) {
            if (i % 2 == 0) {
                sum -= i;
            } else {
                sum += i;
            }
        }

        return sum;
    }

    // 7. Tìm UCLN
    public static int gcd(int a, int b) {

        a = Math.abs(a);
        b = Math.abs(b);

        while (b != 0) {
            int temp = a % b;
            a = b;
            b = temp;
        }

        return a;
    }

    // 8. Tính S = 1! + 2! + ... + n!

    // Hàm tính giai thừa
    public static long factorial(int n) {

        if (n < 0) {
            throw new IllegalArgumentException("n phai >= 0");
        }

        long result = 1;

        for (int i = 1; i <= n; i++) {
            result *= i;
        }

        return result;
    }

    public static long factorialSum(int n) {

        if (n < 1) {
            throw new IllegalArgumentException("n phai >= 1");
        }

        long sum = 0;

        for (int i = 1; i <= n; i++) {
            sum += factorial(i);
        }

        return sum;
    }
}
