import { Component, Input, Output, EventEmitter} from '@angular/core';
import { NgIf } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Column } from '../../models/column.model';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { FormsModule } from '@angular/forms';
import { Board } from '../../models/board.model';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule, AddTaskDialogComponent, TaskItemComponent, NgIf, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  @Input() board!: Board;
  constructor(private dialog: MatDialog) {}

  @Input() column!: Column;

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
        );
      }
    }
    
  isEditingColumn = false;
  editedColumnName = '';
  @Output() ColumnDeleted: EventEmitter<Column> = new EventEmitter<Column>();


  openTaskDialog() {
    this.dialog.open(AddTaskDialogComponent);

  }

  addTask(task: Task): void {
    const newTask = new Task(task.heading, task.description, task.fixed_dueDate, task.variable_dueDate, null);
    this.column.tasks.push(newTask);
  }

  onDeleteTask(task: Task): void {
    const index = this.column.tasks.findIndex(t => t === task);
    if (index !== -1) {
      this.column.tasks.splice(index, 1); // Remove the task from the array
    }
  }

  toggleEditColumn() {
    this.isEditingColumn = !this.isEditingColumn;
    if (this.isEditingColumn) {
      this.editedColumnName = this.column.name;
    }
  }

  onEditColumn() {
    this.column.name = this.editedColumnName;
    this.isEditingColumn = false;
  }

  onDeleteColumn(column: Column): void {
    console.log("this working")
    this.ColumnDeleted.emit(column)
  }

  filterTasks(tasks: Task[]): Task[] {
    const currentDate = new Date();
    let filterTasks : Task[] = [];
    let closestRepeatTask: Task | null = null;
  
    tasks.forEach(task => {
      if(task.repeat) {
        if (!closestRepeatTask || Math.abs(task.fixed_dueDate.getTime() - currentDate.getTime()) < Math.abs(closestRepeatTask.fixed_dueDate.getTime() - currentDate.getTime())) {
          closestRepeatTask = task;
        }
      } else {
        filterTasks.push(task)
      }
    })
  
    if (closestRepeatTask) {
      filterTasks.push(closestRepeatTask);
    }
  
    return filterTasks;
  }
  

  addRepeatTasks(repeatedTasks: Task[]): void {
    console.log("Parent component tasks emitted:", repeatedTasks);
    repeatedTasks.forEach(task => {
      const dueDate = task.fixed_dueDate;
      task.repeat = true;
      if (!dueDate) return; // Skip tasks with no due date
      for (const column of this.board.columns) {
        if (this.isTaskInColumnTimeFrame(task, column)) {
          column.tasks.push(task);
          break;
        }
      }
    });
  }

  isTaskInColumnTimeFrame(task: Task, column: Column): boolean {
    const dueDate = new Date(task.fixed_dueDate);
    switch (column.name) {
      case 'Today':
        return this.isToday(dueDate);
      case 'Tomorrow':
        return this.isTomorrow(dueDate);
      case 'This Week':
        return this.isThisWeek(dueDate);
      case 'Next Week':
        return this.isNextWeek(dueDate);
      case 'This Month':
        return this.isThisMonth(dueDate);
      case 'Next Month':
        return this.isNextMonth(dueDate);
      case 'This Quarter':
        return this.isThisQuarter(dueDate);
      case 'Next Quarter':
        return this.isNextQuarter(dueDate);
      case 'This Year':
        return this.isThisYear(dueDate);
      case 'Next Year':
        return this.isNextYear(dueDate);
      default:
        return false;
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isTomorrow(date: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getFullYear() === tomorrow.getFullYear();
  }

  isThisWeek(date: Date): boolean {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    return date >= startOfWeek && date <= endOfWeek;
  }

  isNextWeek(date: Date): boolean {
    const today = new Date();
    const startOfNextWeek = new Date(today);
    startOfNextWeek.setDate(startOfNextWeek.getDate() - startOfNextWeek.getDay() + 7);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
    return date >= startOfNextWeek && date <= endOfNextWeek;
  }

  isThisMonth(date: Date): boolean {
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isNextMonth(date: Date): boolean {
    const today = new Date();
    const nextMonth = (today.getMonth() + 1) % 12;
    const nextYear = today.getFullYear() + (nextMonth === 0 ? 1 : 0);
    return date.getMonth() === nextMonth && date.getFullYear() === nextYear;
  }

  isThisQuarter(date: Date): boolean {
    const today = new Date();
    const currentQuarter = Math.floor(today.getMonth() / 3);
    return Math.floor(date.getMonth() / 3) === currentQuarter &&
           date.getFullYear() === today.getFullYear();
  }

  isNextQuarter(date: Date): boolean {
    const today = new Date();
    const currentQuarter = Math.floor(today.getMonth() / 3);
    const nextQuarter = (currentQuarter + 1) % 4;
    const nextYear = today.getFullYear() + (nextQuarter === 0 ? 1 : 0);
    return Math.floor(date.getMonth() / 3) === nextQuarter && date.getFullYear() === nextYear;
  }

  isThisYear(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear();
  }

  isNextYear(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() + 1;
  }
}

