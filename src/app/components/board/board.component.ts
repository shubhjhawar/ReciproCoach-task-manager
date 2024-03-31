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
import {
  isToday,
  isTomorrow,
  isThisWeek,
  isNextWeek,
  isThisMonth,
  isNextMonth,
  isThisQuarter,
  isNextQuarter,
  isThisYear,
  isNextYear
} from '../../../utils/date-utils';

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

  isEditingColumn = false;
  editedColumnName = '';
  @Output() ColumnDeleted: EventEmitter<Column> = new EventEmitter<Column>();

  openTaskDialog() {
    this.dialog.open(AddTaskDialogComponent);

  }

  addTask(task: Task): void {
    const newTask = new Task(task.heading, task.description, task.fixed_dueDate, task.variable_dueDate, null, false, null);  
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
    console.log("hehe")
  }
  

  onDeleteTask(task: Task): void {
    const index = this.column.tasks.findIndex((t: Task) => t === task);

    if (index !== -1) {
      this.column.tasks.splice(index, 1);

      const columnName = this.column.name;
      const boardFromLocalStorage = JSON.parse(localStorage.getItem("board") || "{}");
      const columnToUpdate = boardFromLocalStorage.columns.find((col: Column) => col.name === columnName);

      if (columnToUpdate) {
          const taskIndexToDelete = columnToUpdate.tasks.findIndex((t: Task) => t.heading === task.heading);

          if (taskIndexToDelete !== -1) {
              columnToUpdate.tasks.splice(taskIndexToDelete, 1);
              localStorage.setItem("board", JSON.stringify(boardFromLocalStorage));
          } else {
              console.error("Task not found in columnToUpdate tasks:", task);
          }
      } else {
          console.error("Column not found in localStorage:", columnName);
      }
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
    let uniqueTasks: Map<string, Task> = new Map(); // Map to store unique tasks by their unique identifier
    let closestRepeatTask: Task | null = null;

    tasks.forEach(task => {
        uniqueTasks.set(task.heading, task);
        // // Check if the task is a repeat task
        // if (task.repeat) {
        //     const timeInQuestion = new Date(task.fixed_dueDate)
        //     // If there is no closest repeat task yet or if the current task is closer to the current date
        //     if (!closestRepeatTask || Math.abs(timeInQuestion.getTime() - currentDate.getTime()) < Math.abs(new Date(closestRepeatTask.fixed_dueDate).getTime() - currentDate.getTime())) {
        //         closestRepeatTask = task;
        //     }
        //     // Add the closest repeat task (if any) to the unique tasks map
        //     if (closestRepeatTask) {
        //         uniqueTasks.set(closestRepeatTask.heading, closestRepeatTask);
        //     }
        // } else {
        //     // For non-repeat tasks, add them directly to the unique tasks map
        //     uniqueTasks.set(task.heading, task);
        // }
    });

    // Convert the map values (unique tasks) back to an array and return it
    return Array.from(uniqueTasks.values());
  }

  addRepeatTasks(repeatedTasks: Task[]): void {
    repeatedTasks.forEach(task => {
      const dueDate = task.fixed_dueDate;
      task.repeat = true;
      if (!dueDate) return; // Skip tasks with no due date
      for (const column of this.board.columns) {
        if (this.isTaskInColumnTimeFrame(task, column)) {
          column.tasks.push(task);
  
          // Store the updated board in local storage
          const boardFromLocalStorage = JSON.parse(localStorage.getItem("board") || "{}");  
          const columnToUpdate = boardFromLocalStorage.columns.find((col: Column) => col.name === column.name);
          if (columnToUpdate) {
            columnToUpdate.tasks.push(task);  
            localStorage.setItem("board", JSON.stringify(boardFromLocalStorage));
          } else {
            console.error("Column not found in localStorage:", column.name);
          }
  
          break;
        }
      }
    });
  }
  

  isTaskInColumnTimeFrame(task: Task, column: Column): boolean {
    const dueDate = new Date(task.fixed_dueDate);
    switch (column.name) {
      case 'Today':
        return isToday(dueDate);
      case 'Tomorrow':
        return isTomorrow(dueDate);
      case 'This Week':
        return isThisWeek(dueDate);
      case 'Next Week':
        return isNextWeek(dueDate);
      case 'This Month':
        return isThisMonth(dueDate);
      case 'Next Month':
        return isNextMonth(dueDate);
      case 'This Quarter':
        return isThisQuarter(dueDate);
      case 'Next Quarter':
        return isNextQuarter(dueDate);
      case 'This Year':
        return isThisYear(dueDate);
      case 'Next Year':
        return isNextYear(dueDate);
      default:
        return false;
    }
  }
}
