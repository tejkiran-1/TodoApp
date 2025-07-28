import type { TodoItemDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TodoAppService {
  apiName = 'Default';
  

  createTodoItem = (text: string, isCompleted: boolean, category: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TodoItemDto>({
      method: 'POST',
      url: '/api/app/todo-app/todo-item',
      params: { text, isCompleted, category },
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/todo-app/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getTodoItems = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, TodoItemDto[]>({
      method: 'GET',
      url: '/api/app/todo-app/todo-items',
    },
    { apiName: this.apiName,...config });
  

  updateTodoItem = (id: string, text: string, isCompleted: boolean, category: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TodoItemDto>({
      method: 'PUT',
      url: `/api/app/todo-app/${id}/todo-item`,
      params: { text, isCompleted, category },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
