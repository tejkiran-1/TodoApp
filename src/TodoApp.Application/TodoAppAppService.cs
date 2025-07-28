using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.DTOs;
using TodoApp.Interfaces;
using TodoApp.Models;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace TodoApp;

/* Inherit your application services from this class.
 */
public class TodoAppAppService : ApplicationService, ITodoAppService
{
    private readonly IRepository<TodoItem, Guid> _todoItemRepository;
    public TodoAppAppService(IRepository<TodoItem, Guid> todoRepository)
    {
        _todoItemRepository = todoRepository;
    }


    [AllowAnonymous]
    public async Task<List<TodoItemDto>> GetTodoItemsAsync()
    {
        var todoItems = await _todoItemRepository.GetListAsync();
        return todoItems.Select(item => new TodoItemDto
        {
            Id = item.Id,
            Text = item.Text,
            Category = item.Category,
            IsCompleted = item.IsCompleted
        }).ToList();
    }

    [AllowAnonymous]
    public async Task<TodoItemDto> CreateTodoItemAsync(string text, bool isCompleted, string category)
    {
        var todoItem = new TodoItem
        {
            Text = text,
            Category = category,
            IsCompleted = isCompleted
        };
        await _todoItemRepository.InsertAsync(todoItem);
        return new TodoItemDto
        {
            Id = todoItem.Id,
            Text = todoItem.Text,
            Category = todoItem.Category,
            IsCompleted = isCompleted
        };
    }


    [AllowAnonymous]
    public async Task DeleteAsync(Guid id)
    {
        var todoItem = await _todoItemRepository.GetAsync(id);
        if (todoItem == null)
        {
            throw new Exception(L["TodoItemNotFound", id]);
        }
        await _todoItemRepository.DeleteAsync(id);
    }

    [AllowAnonymous]
    public async Task<TodoItemDto> UpdateTodoItemAsync(Guid id, string text, bool isCompleted, string category)
    {
        var todoItem = await _todoItemRepository.GetAsync(id);
        if (todoItem == null)
        {
            throw new Exception(L["TodoItemNotFound", id]);
        }
        todoItem.Text = text;
        todoItem.Category = category;
        todoItem.IsCompleted = isCompleted;
        await _todoItemRepository.UpdateAsync(todoItem);
        return new TodoItemDto
        {
            Id = todoItem.Id,
            Text = todoItem.Text,
            Category = todoItem.Category,
            IsCompleted = todoItem.IsCompleted
        };
    }

}
