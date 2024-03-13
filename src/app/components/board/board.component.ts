import { Component, Input } from '@angular/core';
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



@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule, AddTaskDialogComponent, TaskItemComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  constructor(private dialog: MatDialog) {}

  @Input() column!: Column;

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      // drag drop in same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // Update localStorage for same column

      // getting localstorage and columnName
      const boardFromLocalStorage = JSON.parse(localStorage.getItem("board") || "{}");
      const columnName = event.container.element.nativeElement.getAttribute('data-column-name');
      
      if (columnName) {
        // finding the column to update
        const columnToUpdate = boardFromLocalStorage.columns.find((col: Column) => col.name === columnName);
        if (columnToUpdate) {
          // Update tasks array in localStorage with the new order
          columnToUpdate.tasks = event.container.data; 
        } else {
          console.error("Column not found in localStorage:", columnName);
        }
      } else {
        console.error("Column name not found in data attribute.");
      }
    } else {
      // Transfer task from previous column to current column
      const previousColumnName = event.previousContainer.element.nativeElement.getAttribute('data-column-name');

      // drag drop in different column
      const taskToMove = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data, 
        event.previousIndex,
        event.currentIndex
      );
  
      // getting localstorage and columnName
      const boardFromLocalStorage = JSON.parse(localStorage.getItem("board") || "{}");
      const columnName = event.container.element.nativeElement.getAttribute('data-column-name');

      if (previousColumnName && columnName) {
        // finding the two columns
        const prevColToUpdate = boardFromLocalStorage.columns.find((col: Column) => col.name === previousColumnName);
        const columnToUpdate = boardFromLocalStorage.columns.find((col: Column) => col.name === columnName);
        if (prevColToUpdate && columnToUpdate) {
          // updating the two columns
          prevColToUpdate.tasks = event.previousContainer.data
          columnToUpdate.tasks = event.container.data;
          localStorage.setItem("board", JSON.stringify(boardFromLocalStorage));
        } else {
          console.error("Column not found in localStorage:", columnName);
        }
      } else {
        console.error("Column name not found in data attribute.");
      }

    }
  }

  openTaskDialog() {
    this.dialog.open(AddTaskDialogComponent);

  }

  addTask(task: Task): void {
    const newTask = new Task(task.heading, task.description, task.dueDate, task.repeat);  
    const columnName = this.column.name;
    
    const boardFromLocalStorage = JSON.parse(localStorage.getItem("board") || "{}");  
    const columnToUpdate = boardFromLocalStorage.columns.find((col: Column) => col.name === columnName);
  
    if (columnToUpdate) {
      columnToUpdate.tasks.push(newTask);  
      localStorage.setItem("board", JSON.stringify(boardFromLocalStorage));
  
      console.log("Updated board:", boardFromLocalStorage);
    } else {
      console.error("Column not found in localStorage:", columnName);
    }

    this.column.tasks.push(newTask);
  }
  

  onDeleteTask(task: Task): void {
    const index = this.column.tasks.findIndex(t => t === task);
  
    if (index !== -1) {
      this.column.tasks.splice(index, 1);
  
      const boardFromLocalStorage = JSON.parse(localStorage.getItem("board") || "{}");
  
      const columnToUpdate = boardFromLocalStorage.columns.find((col: Column) => col.name === this.column.name);
      if (columnToUpdate) {
        const taskIndex = columnToUpdate.tasks.findIndex((t: Task) => t.heading === task.heading);
  
        if (taskIndex !== -1) {
          columnToUpdate.tasks.splice(taskIndex, 1);
  
          localStorage.setItem("board", JSON.stringify(boardFromLocalStorage));  
        } else {
          console.error("Task not found in localStorage column:", task);
        }
      } 
    }
  }

} 
