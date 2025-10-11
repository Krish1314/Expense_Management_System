// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");
using System;

namespace BasicAssignments
{
    class Program
    {
        static void Main(string[] args)
        {

            HelloMessage();
            AdditionSubtractionProductQuotient();
            ChoiceBasedOperations();
            DisplayName10Times();
            EvenNumbers();
            OddNumbers();
            TableOfNumber();
            Numbers100to5Gap3();
            DisplayIntegersOneLine();
            DisplayIntegersSeparateLines();
        }

        static void HelloMessage()
        {
            Console.WriteLine("Hello, Welcome to .NET and C#!");
        }

        static void AdditionSubtractionProductQuotient()
        {
            int a = 20, b = 5;
            Console.WriteLine($"Addition: {a + b}");
            Console.WriteLine($"Subtraction: {a - b}");
            Console.WriteLine($"Product: {a * b}");
            Console.WriteLine($"Quotient: {a / b}");
        }

        static void ChoiceBasedOperations()
        {
            int a = 20, b = 5;
            Console.WriteLine("Choose operation: 1.Add 2.Subtract 3.Multiply 4.Divide");
            int choice = Convert.ToInt32(Console.ReadLine());

            switch (choice)
            {
                case 1: Console.WriteLine($"Addition: {a + b}"); break;
                case 2: Console.WriteLine($"Subtraction: {a - b}"); break;
                case 3: Console.WriteLine($"Product: {a * b}"); break;
                case 4: Console.WriteLine($"Quotient: {a / b}"); break;
                default: Console.WriteLine("Invalid choice"); break;
            }
        }

        static void DisplayName10Times()
        {
            for (int i = 1; i <= 10; i++)
            {
                Console.WriteLine($"{i}. Krish Patel");
            }
        }

        static void EvenNumbers()
        {
            Console.WriteLine("Even numbers using for loop:");
            for (int i = 2; i <= 20; i += 2)
                Console.Write(i + " ");
            Console.WriteLine();

            Console.WriteLine("Even numbers using while loop:");
            int j = 2;
            while (j <= 20)
            {
                Console.Write(j + " ");
                j += 2;
            }
            Console.WriteLine();

            Console.WriteLine("Even numbers using do-while loop:");
            int k = 2;
            do
            {
                Console.Write(k + " ");
                k += 2;
            } while (k <= 20);
            Console.WriteLine();
        }

        static void OddNumbers()
        {
            Console.WriteLine("Odd numbers using for loop:");
            for (int i = 1; i <= 19; i += 2)
                Console.Write(i + " ");
            Console.WriteLine();

            Console.WriteLine("Odd numbers using while loop:");
            int j = 1;
            while (j <= 19)
            {
                Console.Write(j + " ");
                j += 2;
            }
            Console.WriteLine();

            Console.WriteLine("Odd numbers using do-while loop:");
            int k = 1;
            do
            {
                Console.Write(k + " ");
                k += 2;
            } while (k <= 19);
            Console.WriteLine();
        }

        static void TableOfNumber()
        {
            Console.Write("Enter number for table: ");
            int num = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Using for loop:");
            for (int i = 1; i <= 10; i++)
                Console.WriteLine($"{num} x {i} = {num * i}");

            Console.WriteLine("Using while loop:");
            int j = 1;
            while (j <= 10)
            {
                Console.WriteLine($"{num} x {j} = {num * j}");
                j++;
            }

            Console.WriteLine("Using do-while loop:");
            int k = 1;
            do
            {
                Console.WriteLine($"{num} x {k} = {num * k}");
                k++;
            } while (k <= 10);
        }

        static void Numbers100to5Gap3()
        {
            for (int i = 100; i >= 5; i -= 3)
                Console.Write(i + " ");
            Console.WriteLine();
        }

        static void DisplayIntegersOneLine()
        {
            int a = 10, b = 20, c = 30;
            Console.WriteLine($"{a}, {b}, {c}");
        }

        static void DisplayIntegersSeparateLines()
        {
            int a = 10, b = 20, c = 30;
            Console.WriteLine(a);
            Console.WriteLine(b);
            Console.WriteLine(c);
        }
    }
}