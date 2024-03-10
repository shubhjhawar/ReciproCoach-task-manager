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

  openTaskDialog() {
    this.dialog.open(AddTaskDialogComponent);

  }

  addTask(task: Task): void {
    const newTask = new Task(task.heading, task.description, task.dueDate, task.repeat);
    this.column.tasks.push(newTask);
  }

  onDeleteTask(task: Task): void {
    const index = this.column.tasks.findIndex(t => t === task);
    if (index !== -1) {
      this.column.tasks.splice(index, 1); // Remove the task from the array
    }
  }
}
