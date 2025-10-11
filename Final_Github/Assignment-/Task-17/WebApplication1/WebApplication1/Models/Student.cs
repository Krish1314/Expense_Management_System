using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace WebApplication1.Models
{
    public class Student
    {
        public int Id { get; set; }
        [Required, StringLength(100)]
        public string Name { get; set; }
        [DataType(DataType.Date)]
        [Column(TypeName = "timestamp without time zone")] // store as timestamp w/o TZ
        public DateTime DateOfBirth { get; set; }
        [Required, StringLength(100)]
        public string Department { get; set; }
        [Range(0, 100)]
        public int Marks { get; set; }
    }
}