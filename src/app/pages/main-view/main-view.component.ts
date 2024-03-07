import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { CommonModule } from '@angular/common';
import { AddBoxDialogComponent } from '../../components/add-box-dialog/add-box-dialog.component';
import { BoardComponent } from '../../components/board/board.component';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [DragDropModule, CommonModule, AddBoxDialogComponent, BoardComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

  board: Board = new Board('Test Board', [
    new Column('Ideas', [
      "some random idea",
      "This is random",
      "build"
    ]),
    new Column('Ideassfsdfs', [
      "some random idead",
      "This is randomasasdasdasdsa",
      "build asdsa"
    ])
  ]);

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

  handleBoxAdded(boxName: string): void {
    // Create a new column with the box name
    const newColumn = new Column(boxName, []);

    // Push the new column to the board
    this.board.columns.push(newColumn);

    console.log('Box added:', boxName);
    console.log('Board:', this.board);
  }

}
