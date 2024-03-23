import { Component, Inject, PLATFORM_ID, EventEmitter, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
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
  imports: [DragDropModule, CommonModule, AddBoxDialogComponent, BoardComponent, RouterModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

    // Create tasks for the 'Ideas' column
ideasTasks: Task[] = [
  new Task('some random idea', 'Description for some random idea', new Date(), new Date(), null, false),
  new Task('This is random', 'Description for This is random', new Date(),new Date(), null, false),
  new Task('build', 'Description for build', new Date(), new Date(), null, false)
];

// // Create tasks for the 'Ideassfsdfs' column
// ideassfsdfsTasks: Task[] = [
//   new Task('some random idead', 'Description for some random idead', new Date(),new Date(), false),
//   new Task('This is randomasasdasd asdsa', 'Description for This is randomasasd asdasdsa', new Date(),new Date(), false),
//   new Task('build asdsa', 'Description for build asdsa', new Date(),new Date(), false)
// ];

// Instantiate the Board object with the provided columns and tasks

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
    const newColumn = new Column(boxName, false, []);

    // Push the new column to the board
    this.board.columns.push(newColumn);

    console.log('Box added:', boxName);
    console.log('Board:', this.board);
    localStorage.setItem("board", JSON.stringify(this.board));
  }

  handleBoxDeleted(column: Column) {
    const index = this.board.columns.findIndex(c => c === column);
    if (index !== -1) {
      this.board.columns.splice(index, 1); // Remove the column from the array
    }
  }

}
