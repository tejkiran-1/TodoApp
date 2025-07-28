import { Component, OnInit } from '@angular/core';
import { TodoItemDto } from '../proxy/dtos';
import { TodoAppService } from '../proxy';
import { ToasterService } from '@abp/ng.theme.shared';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule, DragDropModule]
})
export class HomeComponent implements OnInit {
  todoItems: TodoItemDto[] = [];
  newTodoItem: string = '';
  newTodoCategory: string = '';
  categories: string[] = ['Work', 'Personal', 'Shopping', 'Health', 'Others'];

  editableText: string = '';
  editableCategory: string = '';
  selectedTodoId: string = '';

  constructor(
    private todoService: TodoAppService,
    private toastService: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadAllTodos();
  }

  // ---------------------------
  // CRUD Operations
  // ---------------------------

  create(): void {
    if (!this.newTodoItem.trim() || !this.newTodoCategory) return;

    this.todoService.createTodoItem(this.newTodoItem, false, this.newTodoCategory)
      .subscribe((created) => {
        this.todoItems.push(created);
        this.resetNewTodoForm();
      });
  }

  delete(id: string): void {
    this.todoService.delete(id).subscribe(() => {
      this.todoItems = this.todoItems.filter(item => item.id !== id);
      this.toastService.success('Todo item deleted successfully');
    });
  }

  toggleComplete(todo: TodoItemDto): void {
    const updated = { ...todo, isCompleted: !todo.isCompleted };
    this.todoService.updateTodoItem(todo.id, updated.text, updated.isCompleted, updated.category)
      .subscribe((res) => {
        this.updateItemInList(res);
      });
  }

  confirmUpdate(): void {
    if (!this.editableText.trim()) return;

    const original = this.todoItems.find(t => t.id === this.selectedTodoId);
    if (!original) return;

    this.todoService.updateTodoItem(this.selectedTodoId, this.editableText, original.isCompleted, this.editableCategory)
      .subscribe((res) => {
        this.updateItemInList(res);
        this.toastService.success('Todo item updated successfully');
        this.hideModal('updateModal');
      });
  }

  // ---------------------------
  // UI/UX Methods
  // ---------------------------

  openUpdateModal(todo: TodoItemDto): void {
    this.editableText = todo.text;
    this.editableCategory = todo.category || '';
    this.selectedTodoId = todo.id;
    this.showModal('updateModal');
  }

  drop(event: CdkDragDrop<TodoItemDto[]>): void {
    moveItemInArray(this.todoItems, event.previousIndex, event.currentIndex);
  }

  get completionPercentage(): number {
    const total = this.todoItems.length;
    const completed = this.todoItems.filter(t => t.isCompleted).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  // ---------------------------
  // Filtering
  // ---------------------------

  showAll(): void {
    this.loadAllTodos();
  }

  showCompleted(): void {
    this.todoService.getTodoItems().subscribe(items => {
      this.todoItems = items.filter(i => i.isCompleted);
    });
  }

  showNotCompleted(): void {
    this.todoService.getTodoItems().subscribe(items => {
      this.todoItems = items.filter(i => !i.isCompleted);
    });
  }

  // ---------------------------
  // Helper Methods
  // ---------------------------

  private loadAllTodos(): void {
    this.todoService.getTodoItems().subscribe((items) => {
      this.todoItems = items;
    });
  }

  private resetNewTodoForm(): void {
    this.newTodoItem = '';
    this.newTodoCategory = '';
  }

  private updateItemInList(updatedItem: TodoItemDto): void {
    const index = this.todoItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.todoItems[index] = updatedItem;
    }
  }

  private showModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  private hideModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}
