import {Component, ElementRef, Inject, PLATFORM_ID, QueryList, ViewChildren} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {Board} from '../../models/board.model';
import {Column} from '../../models/column.model';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {AddBoxDialogComponent} from '../../components/add-box-dialog/add-box-dialog.component';
import {BoardComponent} from '../../components/board/board.component';
import {Task} from '../../models/task.model';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [DragDropModule, CommonModule, AddBoxDialogComponent, BoardComponent, RouterModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {
  @ViewChildren(BoardComponent) boards!: QueryList<BoardComponent>

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private elRef: ElementRef) {
  }

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

  ngAfterViewInit() {
    let draggingId = -1;
    let draggingOverId = -1;

    const getTarget = (e: DragEvent) => {
      let droppedOnId;
      let droppedOn = e.target as HTMLElement;
      droppedOnId = (droppedOn as HTMLElement).getAttribute("colId");
      while (!droppedOnId) {
        droppedOn = droppedOn.parentElement as HTMLElement;
        if (!droppedOn) {
          return;
        }
        droppedOnId = (droppedOn as HTMLElement).getAttribute("colId");
      }
      return {
        el: droppedOn,
        id: Number(droppedOnId)
      }
    }

    const moveCol = (movedColId: Number, moveToColId: Number) => {
      let moveFromIndex = -1;
      let movetoIndex = -1;
      for (let i = 0; i < this.board.columns.length; i += 1) {
        const col = this.board.columns[i];
        if (col.id === movedColId) {
          moveFromIndex = i;
        } else if (col.id === moveToColId) {
          movetoIndex = i;
        }
      }
      if (moveFromIndex >= 0 && movetoIndex >= 0 && moveFromIndex !== movetoIndex) {
        const movedCol = this.board.columns.splice(moveFromIndex, 1)
        this.board.columns.splice(movetoIndex, 0, movedCol[0]);
      }
    }

    const dragStart = (e: any) => {
      const target = getTarget(e);
      draggingId = target?.id ?? -1;
    }

    const dragEnter = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const target = getTarget(e);
      draggingOverId = target?.id ?? -1;
      target?.el.classList.add("dragging-over")
    }

    const dragLeave = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const target = getTarget(e);
      draggingOverId = target?.id ?? -1;
      target?.el.classList.remove("dragging-over")
    }

    const dragOver = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const target = getTarget(e);
      const droppedOnId = target?.id ?? -1;
      moveCol(draggingId, droppedOnId);
    }

    const drop = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const target = getTarget(e);
      const droppedOnId = target?.id ?? -1;
      moveCol(draggingId, droppedOnId);
      localStorage.setItem('board', JSON.stringify(this.board));
    }

    const els = this.elRef.nativeElement.querySelectorAll("app-board");
    for (const el of els) {
      el.addEventListener("dragstart", dragStart);
      el.addEventListener("dragover", dragOver);
      el.addEventListener("dragenter", dragEnter);
      el.addEventListener("drop", drop);
    }
  }

  initializeBoard(): void {
    const ideasTasks: Task[] = [
      new Task('some random idea', 'Description for some random idea', new Date(), new Date(), null, false, null, null),
      new Task('This is random', 'Description for This is random', new Date(), new Date(), null, false, null, null),
      new Task('build', 'Description for build', new Date(), new Date(), null, false, null, null)
    ];

    console.log("creating board from scratch");
    this.board = new Board('First Board', [
      new Column('Today', true, ideasTasks, 1),
      new Column('Tomorrow', true, [], 2),
      new Column('This Week', true, [], 3),
      new Column('Next Week', true, [], 4),
      new Column('This Month', true, [], 5),
      new Column('Next Month', true, [], 6),
      new Column('This Quarter', true, [], 7),
      new Column('Next Quarter', true, [], 8),
      new Column('This Year', true, [], 9),
      new Column('Next Year', true, [], 10),
    ]);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('board', JSON.stringify(this.board));
    }


    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('board', JSON.stringify(this.board));
    }
  }

  handleBoxAdded(boxName: string): void {
    // Create a new column with the box name
    const newColumn = new Column(boxName, false, [], 100 + this.board.columns.length);

    // Push the new column to the board
    this.board.columns.push(newColumn);

    localStorage.setItem("board", JSON.stringify(this.board));
  }

  handleBoxDeleted(column: Column) {
    const index = this.board.columns.findIndex(c => c === column);
    if (index !== -1) {
      this.board.columns.splice(index, 1); // Remove the column from the array
    }
  }
}
