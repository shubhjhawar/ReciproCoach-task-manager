import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { NgIf } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [NgIf],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css' 
})
export class TaskItemComponent {
  constructor(public dialog: MatDialog) {}


  @Input() task!: Task;
  @Output() taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();

  onDoubleClick() {
    const dialogRef = this.dialog.open(EditTaskItemComponent, {
      data: this.task
    });

    // Subscribe to the emitted event from below
    dialogRef.componentInstance.taskDeleted.subscribe((task: string) => {
      // Re-emit the event
      this.taskDeleted.emit(this.task);
    });
  }

  formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

}

@Component({
  selector: 'app-edit-task-item',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, FormsModule, MatCheckboxModule, MatDatepickerModule],
  templateUrl: './edit-item-task.html',
  styleUrl: './task-item.component.css'
})
export class EditTaskItemComponent {
  constructor(
    public dialogRef: MatDialogRef<TaskItemComponent>,
    @Inject(MAT_DIALOG_DATA) public task: any
  ) {}
  @Output() taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();


  EditedTaskFields = {
    heading: this.task.heading,
    description: this.task.description,
    dueDate: this.task.dueDate,
    repeat: this.task.repeat
  };

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onEditTaskClick(): void {
    Object.assign(this.task, this.EditedTaskFields);
    this.dialogRef.close();
  }

  deleteTask(): void {
    console.log("delete")
    this.taskDeleted.emit(this.task);
    this.dialogRef.close();
  }

  check() {
    console.log("checkefknsekjfjkdsf")
  }

}

