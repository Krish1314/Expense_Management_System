using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Marks { get; set; }
}

class Program
{
    static void Main()
    {
        var students = new List<Student>
        {
            new Student { Id = 1, Name = "Krish", Marks = 87 },
            new Student { Id = 2, Name = "Aryan", Marks = 67 },
            new Student { Id = 3, Name = "Prantik", Marks = 68 },
            new Student { Id = 4, Name = "Sarthak", Marks = 89 },
            new Student { Id = 5, Name = "Dev", Marks = 90 }
        };

        var courses = new List<(int StudentId, string Course)>
        {
            (1, "Math"), (2, "Science"), (3, "History"),
            (1, "English"), (4, "Biology"), (5, "Math")
        };

        // Order students by marks and then name
        var sortedAsc = students.OrderBy(s => s.Marks).ThenBy(s => s.Name);
        Console.WriteLine("Students sorted by Marks then Name:");
        foreach (var s in sortedAsc)
            Console.WriteLine($"{s.Name} - {s.Marks}");

        // Group students by marks
        var grouped = students.GroupBy(s => s.Marks);
        Console.WriteLine("\nStudents grouped by Marks:");
        foreach (var group in grouped)
        {
            Console.WriteLine($"Marks: {group.Key}");
            foreach (var s in group)
                Console.WriteLine($"   {s.Name}");
        }

        // Join students with their courses
        var studentCourses = students.Join(
            courses,
            s => s.Id,
            c => c.StudentId,
            (s, c) => new { s.Name, c.Course }
        );
        Console.WriteLine("\nStudents with their Courses:");
        foreach (var sc in studentCourses)
            Console.WriteLine($"{sc.Name} - {sc.Course}");

        //Find total marks
        var totalMarks = students.Sum(s => s.Marks);
        Console.WriteLine($"\nTotal Marks of all students = {totalMarks}");

        // Find highest marks student
        var topper = students.OrderByDescending(s => s.Marks).First();
        Console.WriteLine($"Topper: {topper.Name} with {topper.Marks} marks");
    }
}