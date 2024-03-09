import {Component, Output} from '@angular/core';
import {MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogActions } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms'; 
import { EventEmitter } from '@angular/core';
import { MatDatepickerModule } from "@angular/material/datepicker"
import {MatCheckboxModule} from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {
  constructor(public dialog: MatDialog) {}

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();

  openTaskDialog() {
    const dialogRef = this.dialog.open(TaskDialogData);

    // Subscribe to the emitted event from below
    dialogRef.componentInstance.taskAdded.subscribe((boxName: string) => {
      // Re-emit the event
      this.taskAdded.emit(boxName);
    });
  }
}


@Component({
  selector: 'task-dialog-data',
  templateUrl: 'add-task-dialog-body.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, FormsModule, MatCheckboxModule, MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./add-task-dialog.component.css']
})
export class TaskDialogData {
  constructor(public dialogRef: MatDialogRef<TaskDialogData>) {}

  taskFields = {
    heading: '',
    description: '',
    dueDate: null,
    repeat: ''
  };

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();


  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAddTaskClick(): void {
    this.taskAdded.emit(this.taskFields)
    this.dialogRef.close();
  }
}
