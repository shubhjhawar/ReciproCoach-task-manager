import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WeeklyComponent } from '../weekly/weekly.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDialogModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    WeeklyComponent
  ]
})
export class AddTaskDialogModule { }
