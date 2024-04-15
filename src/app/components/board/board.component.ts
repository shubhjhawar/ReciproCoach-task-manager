import { Component, Input, Output, EventEmitter } from '@angular/core';
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
import { CommonserviceService } from '../../apiService/commonservice.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule, AddTaskDialogComponent, TaskItemComponent, NgIf, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  @Input() board!: Board;
  @Input() column!: Column;
  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();
  constructor(private dialog: MatDialog, private apiService: CommonserviceService) { }



  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      // drag drop in same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      debugger;
      const columnName = event.container.element.nativeElement.getAttribute('data-column-name');
      const dataIds = event.container.data.map((d) => d._id);
      if (columnName && dataIds && dataIds.length) {
        this.apiService.updateTasksIndices({ columnName, dataIds }).subscribe((response: any) => {
          if (response) {
            this.taskAdded.emit();
          }
        },
          error => {
            console.log(error);
          })
      } else {
        console.error("Column name not found in data attribute.");
      }
    } else {
      // Transfer task from previous column to current column
      const previousColumnName = event.previousContainer.element.nativeElement.getAttribute('data-column-name');
      const newColumnName = event.container.element.nativeElement.getAttribute('data-column-name');
      const taskToMoveId = event.previousContainer.data[event.previousIndex]._id;

      // drag drop in different column
      const taskToMove = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (previousColumnName && newColumnName && taskToMoveId) {
        this.apiService.updateColumnIds(taskToMoveId, { previousColumnName, newColumnName }).subscribe((response: any) => {
          if (response) {
            this.taskAdded.emit();
          }
        },
          error => {
            console.log(error);
          })
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

  addTask(task: any): void {
    debugger;
    task.columnId = this.column?._id;
    this.apiService.createTask(task).subscribe((response: any) => {
      if (response) {
        this.taskAdded.emit();
      }
    },
      error => {
        console.log(error);
      })
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

  filterTasks(columnName: string, tasks: Task[]): Task[] {
    const currentDate = new Date();
    // let uniqueTasks: Map<string, Task> = new Map(); 
    // if(tasks.length) {
    //   tasks.forEach(task => {
    //     uniqueTasks.set(task.heading, task);
    // });
    // }
    
    let visibleTasks: Task[] = [];
    if (tasks.length) {
      tasks.forEach((task: Task) => {
        if (!task.repeat) {
          visibleTasks.push(task)
        } else {
          if (task.repeatFrequency === 'daily' && (columnName === "Today" || columnName === "Tomorrow" || columnName === "This Week" || columnName === "Next Week")) {
            if(visibleTasks.length === 0) {
              visibleTasks.push(task);
            } else if(visibleTasks.find((d) => d.heading !== task.heading)) {
              visibleTasks.push(task);
            }
          } else if (task.repeatFrequency === 'weekly' && (columnName === "This Week" || columnName === "Next Week")) {
            if(visibleTasks.length === 0) {
              visibleTasks.push(task);
            } else if(visibleTasks.find((d) => d.heading !== task.heading)) {
              visibleTasks.push(task);
            }
          } else if (task.repeatFrequency === 'monthly' && (columnName === "This Month" || columnName === "Next Month")) {
            if(visibleTasks.length === 0) {
              visibleTasks.push(task);
            } else if(visibleTasks.find((d) => d.heading !== task.heading)) {
              visibleTasks.push(task);
            }
          } else if (task.repeatFrequency === 'yearly' && (columnName === "This Year" || columnName === "Next Year")) {
            if(visibleTasks.length === 0) {
              visibleTasks.push(task);
            } else if(visibleTasks.find((d) => d.heading !== task.heading)) {
              visibleTasks.push(task);
            }
          }
          // else if (columnName === "This Quarter" || columnName === "Next Quarter") {
          //   visibleTasks.push(task);
          // }
        }
      })
    }
    
    // visibleTasks = tasks;
    // uniqueTasks.forEach((task, key) => {
    //   const timeInQuestion = new Date(task.fixed_dueDate)
    //   if(!task.repeat){
    //     visibleTasks.push(task)
    //   }

    //   // Include tasks based on their repeat frequency and the specified column
    // if (task.repeatFrequency === 'daily' && (columnName === "Today" || columnName === "Tomorrow")) {
    //     visibleTasks.push(task);
    // } else if (task.repeatFrequency === 'weekly' && (columnName === "This Week" || columnName === "Next Week")) {
    //     visibleTasks.push(task);
    // } else if (task.repeatFrequency === 'monthly' && (columnName === "This Month" || columnName === "Next Month")) {
    //     visibleTasks.push(task);
    // } else if (task.repeatFrequency === 'yearly' && (columnName === "This Year" || columnName === "Next Year")) {
    //     visibleTasks.push(task);
    // } else if (columnName === "This Quarter" || columnName === "Next Quarter") {
    //     visibleTasks.push(task);
    // }

    //   // if(task.repeatFrequency === 'daily' && columnName==="Today"){
    //   //   // if(isToday(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(task.repeatFrequency === 'daily' && columnName==="Tomorrow"){
    //   //   // if(isTomorrow(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(task.repeatFrequency === 'weekly' && columnName==="This Week"){
    //   //   // if(isThisWeek(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(task.repeatFrequency === 'weekly' && columnName==="Next Week"){
    //   //   // if(isNextWeek(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(task.repeatFrequency === 'monthly' && columnName==="This Month"){
    //   //   // if(isThisMonth(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(task.repeatFrequency === 'monthly' && columnName==="Next Month"){
    //   //   // if(isNextMonth(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(task.repeatFrequency === 'yearly' && columnName==="This Year"){
    //   //   // if(isThisYear(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(task.repeatFrequency === 'yearly' && columnName==="Next Year"){
    //   //   // if(isNextYear(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(columnName==="This Quarter"){
    //   //   // if(isThisQuarter(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // } else if(columnName==="Next Quarter"){
    //   //   // if(isNextQuarter(timeInQuestion)){
    //   //     visibleTasks.push(task)
    //   //   // }
    //   // }

    // })
    // Convert the map values (unique tasks) back to an array and return it
    // console.log("check here-",columnName, visibleTasks.values())
    return Array.from(visibleTasks.values());
  }

  addRepeatTasks(repeatedTasks: Task[]): void {
    this.apiService.createTask(repeatedTasks).subscribe((response: any) => {
      if (response) {
        this.taskAdded.emit();
      }
    },
      error => {
        console.log(error);
      })
  }
}
