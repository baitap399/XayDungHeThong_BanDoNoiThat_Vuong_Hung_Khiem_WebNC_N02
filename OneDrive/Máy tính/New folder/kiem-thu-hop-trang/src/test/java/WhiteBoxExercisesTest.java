 import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

public class WhiteBoxExercisesTest {

    // =========================
    // 1. Chu vi hình chữ nhật
    // =========================

    @Test
    void testRectanglePerimeterNormal() {
        assertEquals(14, WhiteBoxExercises.rectanglePerimeter(5, 2));
    }

    @Test
    void testRectanglePerimeterZero() {
        assertEquals(10, WhiteBoxExercises.rectanglePerimeter(5, 0));
    }

    @Test
    void testRectanglePerimeterNegativeLength() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.rectanglePerimeter(-1, 5)
        );
    }

    @Test
    void testRectanglePerimeterNegativeWidth() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.rectanglePerimeter(5, -1)
        );
    }


    // =========================
    // 2. Diện tích hình chữ nhật
    // =========================

    @Test
    void testRectangleAreaNormal() {
        assertEquals(15, WhiteBoxExercises.rectangleArea(5, 3));
    }

    @Test
    void testRectangleAreaZero() {
        assertEquals(0, WhiteBoxExercises.rectangleArea(5, 0));
    }

    @Test
    void testRectangleAreaNegativeLength() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.rectangleArea(-1, 5)
        );
    }

    @Test
    void testRectangleAreaNegativeWidth() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.rectangleArea(5, -1)
        );
    }


    // =========================
    // 3. Phương trình bậc 2
    // =========================

    @Test
    void testQuadraticTwoRoots() {
        String result =
                WhiteBoxExercises.solveQuadratic(1, -3, 2);

        assertEquals(
                "Hai nghiem x1 = 2.0, x2 = 1.0",
                result
        );
    }

    @Test
    void testQuadraticDoubleRoot() {
        String result =
                WhiteBoxExercises.solveQuadratic(1, 2, 1);

        assertEquals(
                "Nghiem kep x = -1.0",
                result
        );
    }

    @Test
    void testQuadraticNoRootDeltaNegative() {
        assertEquals(
                "Vo nghiem",
                WhiteBoxExercises.solveQuadratic(1, 0, 1)
        );
    }

    @Test
    void testQuadraticAZeroBNonZero() {
        assertEquals(
                "Nghiem x = 2.0",
                WhiteBoxExercises.solveQuadratic(0, 2, -4)
        );
    }

    @Test
    void testQuadraticAZeroBCZero() {
        assertEquals(
                "Vo so nghiem",
                WhiteBoxExercises.solveQuadratic(0, 0, 0)
        );
    }

    @Test
    void testQuadraticAZeroBZeroCNonZero() {
        assertEquals(
                "Vo nghiem",
                WhiteBoxExercises.solveQuadratic(0, 0, 5)
        );
    }


    // =========================
    // 4. Số ngày trong tháng
    // =========================

    @Test
    void testFebruaryLeapYear() {
        assertEquals(29,
                WhiteBoxExercises.daysInMonth(2, 2024));
    }

    @Test
    void testFebruaryNormalYear() {
        assertEquals(28,
                WhiteBoxExercises.daysInMonth(2, 2023));
    }

    @Test
    void testFebruaryYearDivisibleBy400() {
        assertEquals(29,
                WhiteBoxExercises.daysInMonth(2, 2000));
    }

    @Test
    void testFebruaryYearDivisibleBy100() {
        assertEquals(28,
                WhiteBoxExercises.daysInMonth(2, 1900));
    }

    @Test
    void testThirtyDayMonth() {
        assertEquals(30,
                WhiteBoxExercises.daysInMonth(4, 2024));
    }

    @Test
    void testThirtyOneDayMonth() {
        assertEquals(31,
                WhiteBoxExercises.daysInMonth(1, 2024));
    }

    @Test
    void testInvalidMonthBelowOne() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.daysInMonth(0, 2024)
        );
    }

    @Test
    void testInvalidMonthAboveTwelve() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.daysInMonth(13, 2024)
        );
    }


    // =========================
    // 5. Số nguyên tố
    // =========================

    @Test
    void testPrimeLessThanTwo() {
        assertFalse(WhiteBoxExercises.isPrime(1));
    }

    @Test
    void testPrimeTwo() {
        assertTrue(WhiteBoxExercises.isPrime(2));
    }

    @Test
    void testEvenNumberGreaterThanTwo() {
        assertFalse(WhiteBoxExercises.isPrime(4));
    }

    @Test
    void testPrimeOddNumber() {
        assertTrue(WhiteBoxExercises.isPrime(7));
    }

    @Test
    void testCompositeOddNumber() {
        assertFalse(WhiteBoxExercises.isPrime(9));
    }

    @Test
    void testPrimeWithMultipleLoopIterations() {
        assertTrue(WhiteBoxExercises.isPrime(17));
    }


    // =========================
    // 6. Tổng 1 - 2 + 3 - 4...
    // =========================

    @Test
    void testAlternatingSumOne() {
        assertEquals(1,
                WhiteBoxExercises.alternatingSum(1));
    }

    @Test
    void testAlternatingSumTwo() {
        assertEquals(-1,
                WhiteBoxExercises.alternatingSum(2));
    }

    @Test
    void testAlternatingSumFive() {
        assertEquals(3,
                WhiteBoxExercises.alternatingSum(5));
    }

    @Test
    void testAlternatingSumInvalid() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.alternatingSum(0)
        );
    }


    // =========================
    // 7. UCLN
    // =========================

    @Test
    void testGcdNormal() {
        assertEquals(6,
                WhiteBoxExercises.gcd(18, 24));
    }

    @Test
    void testGcdSecondNumberZero() {
        assertEquals(5,
                WhiteBoxExercises.gcd(5, 0));
    }

    @Test
    void testGcdFirstNumberZero() {
        assertEquals(5,
                WhiteBoxExercises.gcd(0, 5));
    }

    @Test
    void testGcdNegativeNumbers() {
        assertEquals(6,
                WhiteBoxExercises.gcd(-18, 24));
    }

    @Test
    void testGcdMultipleIterations() {
        assertEquals(6,
                WhiteBoxExercises.gcd(48, 18));
    }


    // =========================
    // 8. Giai thừa
    // =========================

    @Test
    void testFactorialZero() {
        assertEquals(1,
                WhiteBoxExercises.factorial(0));
    }

    @Test
    void testFactorialOne() {
        assertEquals(1,
                WhiteBoxExercises.factorial(1));
    }

    @Test
    void testFactorialFive() {
        assertEquals(120,
                WhiteBoxExercises.factorial(5));
    }

    @Test
    void testFactorialNegative() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.factorial(-1)
        );
    }


    // =========================
    // Tổng giai thừa
    // =========================

    @Test
    void testFactorialSumOne() {
        assertEquals(1,
                WhiteBoxExercises.factorialSum(1));
    }

    @Test
    void testFactorialSumThree() {
        assertEquals(9,
                WhiteBoxExercises.factorialSum(3));
    }

    @Test
    void testFactorialSumInvalid() {
        assertThrows(
                IllegalArgumentException.class,
                () -> WhiteBoxExercises.factorialSum(0)
        );
    }
}
