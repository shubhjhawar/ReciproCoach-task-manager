import {Component, Output} from '@angular/core';
import {MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogActions } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { EventEmitter } from '@angular/core';

 
@Component({
  selector: 'app-add-box-dialog',
  standalone:true,
  imports: [MatButtonModule],
  templateUrl: './add-box-dialog.component.html',
  styleUrls: ['./add-box-dialog.component.css']
})
export class AddBoxDialogComponent {  
  constructor(public dialog: MatDialog) {}

  @Output() boxAdded: EventEmitter<any> = new EventEmitter<any>();

  openDialog() {
    const dialogRef = this.dialog.open(DialogDataDialog);

    // Subscribe to the emitted event from below
    dialogRef.componentInstance.boxAdded.subscribe((boxName: string) => {
      // Re-emit the event
      this.boxAdded.emit(boxName);
    });
  }
}


@Component({
  selector: 'dialog-data-dialog',
  templateUrl: 'box-dialog-body.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, FormsModule],
  styleUrls: ['./add-box-dialog.component.css']
})
export class DialogDataDialog {
  boxName = '';
  @Output() boxAdded: EventEmitter<string> = new EventEmitter<string>();

  constructor(public dialogRef: MatDialogRef<DialogDataDialog>) {}

  onCancelClick(): void {
    this.dialogRef.close(); // Close the dialog without adding the box
  }

  onAddClick(): void {
    if (this.boxName.trim()) {
      this.boxAdded.emit(this.boxName); // Emit the new box name to the above component
      this.dialogRef.close(); // Close the dialog after adding the box
    }
  }
}
