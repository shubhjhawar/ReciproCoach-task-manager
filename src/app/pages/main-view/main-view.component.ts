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
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [DragDropModule, CommonModule, AddBoxDialogComponent, BoardComponent, RouterModule, FormsModule],
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
      new Task('some random idea', 'Description for some random idea', new Date(), new Date(), null, false, null, null),
      new Task('This is random', 'Description for This is random', new Date(), new Date(), null, false, null, null),
      new Task('build', 'Description for build', new Date(), new Date(), null, false, null, null)
    ];
  
    this.board = new Board('First Board', [
      new Column('Today', true, ideasTasks),
      new Column('Tomorrow', true, []),
      new Column('This Week', true, []),
      new Column('Next Week', true, []),
      new Column('This Month', true, []),
      new Column('Next Month', true, []),
      new Column('This Quarter', true, []),
      new Column('Next Quarter', true, []),
      new Column('This Year', true, []),
      new Column('Next Year', true, []),
    ]);
  
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('board', JSON.stringify(this.board));
    }
  

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

  public searchTerm: string = '';
  public filteredColumns : any = []
  public matchingTasks: Task[] = [];
  search() {
    if (this.searchTerm.trim() === '') {
        // If search term is empty, return all tasks from all columns
        this.filteredColumns = [...this.board.columns];
        return;
    }

    // Filter tasks that match the search term
    const matchingTasks: Task[] = [];
    for (const column of this.board.columns) {
        const tasks = column.tasks.filter(task =>
            task.heading.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        matchingTasks.push(...tasks);
    }

    // Update filtered columns with only the columns that contain the matching tasks
    this.filteredColumns = this.board.columns.filter(column =>
        column.tasks.some(task =>
            task.heading.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
    );

    this.matchingTasks = matchingTasks;

    console.log("Matching tasks = ", matchingTasks);
}



}
