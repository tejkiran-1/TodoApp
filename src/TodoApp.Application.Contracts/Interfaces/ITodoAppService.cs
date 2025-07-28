using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.DTOs;
using Volo.Abp.Application.Services;

namespace TodoApp.Interfaces
{
    public interface ITodoAppService : IApplicationService
    {
        Task<List<TodoItemDto>> GetTodoItemsAsync();
        Task<TodoItemDto> CreateTodoItemAsync(string text, bool isCompleted, string category);
        Task<TodoItemDto> UpdateTodoItemAsync(Guid id, string text, bool isCompleted, string category);
        Task DeleteAsync(Guid id);
    }
}
