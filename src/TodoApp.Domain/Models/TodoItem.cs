using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace TodoApp.Models
{
    public class TodoItem : BasicAggregateRoot<Guid>
    {
        public string Text { get; set; } = string.Empty;
        public string Category { get; set; }
        public bool IsCompleted { get; set; }
    }
}
