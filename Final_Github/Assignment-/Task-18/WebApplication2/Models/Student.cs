using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication2.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(50)]
        [Display(Name = "Full Name")]
        public string Name { get; set; }

        [Range(18, 100, ErrorMessage = "Age must be between 18 and 100")]
        public int? Age { get; set; }

        [Required(ErrorMessage = "Course is required")]
        [StringLength(100)]
        [Display(Name = "Course")]
        [Column("Department")] // map Course to existing Department column in DB
        public string Course { get; set; }

        [Required(ErrorMessage = "Marks are required")]
        [Range(0, 100, ErrorMessage = "Marks must be between 0 and 100")]
        [Display(Name = "Marks")] 
        public int Marks { get; set; }

        [Required(ErrorMessage = "Date of Birth is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        [Column(TypeName = "date")] // store as date (no time) in PostgreSQL
        public DateTime DateOfBirth { get; set; }
    }
}