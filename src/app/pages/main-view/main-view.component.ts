import { Component, Inject, PLATFORM_ID } from '@angular/core';
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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AddBoxDialogComponent } from '../../components/add-box-dialog/add-box-dialog.component';
import { BoardComponent } from '../../components/board/board.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [DragDropModule, CommonModule, AddBoxDialogComponent, BoardComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
board: Board = new Board('First Board', []);  

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const storedBoard = localStorage.getItem('board');

    if (storedBoard) {
      this.board = JSON.parse(storedBoard);
    } else {
      this.initializeBoard();
    }
  }
}
initializeBoard(): void {
  const ideasTasks: Task[] = [
    new Task('some random idea', 'Description for some random idea', new Date(), false),
    new Task('This is random', 'Description for This is random', new Date(), false),
    new Task('build', 'Description for build', new Date(), false)
  ];

  this.board = new Board('First Board', [
    new Column('Today', ideasTasks),
    new Column('Tomorrow', []),
    new Column('Next Week', []),
    new Column('This Month', []),
    new Column('Next Month', []),
    new Column('This Quarter', []),
    new Column('Next Quarter', []),
    new Column('This Year', []),
    new Column('Next Year', []),
    new Column('Wishlist', []),
  ]);

  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('board', JSON.stringify(this.board));
  }
}

  drop(event: CdkDragDrop<Column[]>) {
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
    localStorage.setItem("board", JSON.stringify(this.board));
  }

}
