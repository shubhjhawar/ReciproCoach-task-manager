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


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule, AddTaskDialogComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  constructor(private dialog: MatDialog) {}

  @Input() column!: Column;

  drop(event: CdkDragDrop<string[]>) {
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
    const dialogRef = this.dialog.open(AddTaskDialogComponent);
    dialogRef.componentInstance.boxAdded.subscribe((boxName: string) => {
      // Handle the emitted event from the task dialog if needed
      console.log('Box name emitted:', boxName);
    });
  }
}
