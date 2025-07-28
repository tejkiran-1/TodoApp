using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.DTOs
{
    public class TodoItemDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Category { get; set; }
        public bool IsCompleted { get; set; }
    }
}
