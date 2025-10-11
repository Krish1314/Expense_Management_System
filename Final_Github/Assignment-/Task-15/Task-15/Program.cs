using System;

class Program
{
    // 1. Sum and Average of Array
    static void SumAndAverage()
    {
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;

        foreach (int num in arr)
            sum += num;

        double avg = (double)sum / arr.Length;

        Console.WriteLine("1. Sum = " + sum);
        Console.WriteLine("1. Average = " + avg);
        Console.WriteLine();
    }

    // 2. Sum of 3x3 Matrices
    static void MatrixSum()
    {
        int[,] a = { {1,2,3}, {4,5,6}, {7,8,9} };
        int[,] b = { {9,8,7}, {6,5,4}, {3,2,1} };
        int[,] c = new int[3,3];

        Console.WriteLine("2. Sum of 3x3 Matrices:");
        for (int i = 0; i < 3; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                c[i,j] = a[i,j] + b[i,j];
                Console.Write(c[i,j] + " ");
            }
            Console.WriteLine();
        }
        Console.WriteLine();
    }

    // 3. Maximum element in Array
    static void MaxElement()
    {
        int[] arr = {12, 45, 7, 89, 34};
        int max = arr[0];

        foreach (int num in arr)
            if (num > max)
                max = num;

        Console.WriteLine("3. Maximum element = " + max);
        Console.WriteLine();
    }

    // 4. Column-wise sum of 2D Array
    static void ColumnSum()
    {
        int[,] arr = { {1,2,3}, {4,5,6}, {7,8,9} };
        int rows = arr.GetLength(0);
        int cols = arr.GetLength(1);

        Console.WriteLine("4. Column-wise Sum:");
        for (int j = 0; j < cols; j++)
        {
            int colSum = 0;
            for (int i = 0; i < rows; i++)
                colSum += arr[i, j];

            Console.WriteLine("Column " + (j+1) + " Sum = " + colSum);
        }
        Console.WriteLine();
    }

    // 5. Row-wise sum of 2D Array
    static void RowSum()
    {
        int[,] arr = { {1,2,3}, {4,5,6}, {7,8,9} };
        int rows = arr.GetLength(0);

        Console.WriteLine("5. Row-wise Sum:");
        for (int i = 0; i < rows; i++)
        {
            int rowSum = 0;
            for (int j = 0; j < arr.GetLength(1); j++)
                rowSum += arr[i, j];

            Console.WriteLine("Row " + (i+1) + " Sum = " + rowSum);
        }
        Console.WriteLine();
    }

    // Main Method
    static void Main()
    {
        SumAndAverage();
        MatrixSum();
        MaxElement();
        ColumnSum();
        RowSum();
    }
}