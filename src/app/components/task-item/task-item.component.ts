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
import { Column } from '../../models/column.model';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { CompletedTask } from '../../models/completed-tasks.model';


@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatBottomSheetModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css' 
})
export class TaskItemComponent {
  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet) {}

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSuccessSheet);
  }

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

  formatDate(date: any) {
    date = new Date(date)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  completeTask(task: Task): void {
    task.complete = !task.complete;
    if (task.complete) {
       console.log(task)
       CompletedTask.tasks.push(task);
       this.taskDeleted.emit(this.task);
       this.openBottomSheet();
    }
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
    fixed_dueDate: this.task.fixed_dueDate,
    variable_dueDate: this.task.variable_dueDate,
    repeat: this.task.repeat
  };

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onEditTaskClick(): void {
    const boardFromLocalStorage = JSON.parse(localStorage.getItem("board") || "{}");
    for (const column of boardFromLocalStorage.columns) {
      console.log(column)
      const taskIndex = column.tasks.findIndex((t: Task) => t.heading === this.task.heading);
  
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = this.task;
        Object.assign(this.task, this.EditedTaskFields);
  
        localStorage.setItem("board", JSON.stringify(boardFromLocalStorage));
  
        this.dialogRef.close();
        return;
      }
    }
  
  }

  deleteTask(): void {
    this.taskDeleted.emit(this.task);
    this.dialogRef.close();
  }

}


@Component({
  selector: 'bottom-success-sheet',
  templateUrl: './bottom-success-sheet.html',
  standalone: true,
  imports: [MatListModule],
})
export class BottomSuccessSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSuccessSheet>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}