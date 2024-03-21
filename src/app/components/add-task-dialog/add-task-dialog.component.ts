import {Component, Inject, Input, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogActions } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms'; 
import { EventEmitter } from '@angular/core';
import { MatDatepickerModule } from "@angular/material/datepicker"
import {MatCheckboxModule} from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { WeeklyComponent } from '../weekly/weekly.component';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {
  @Input() columnName: string = ''
  constructor(public dialog: MatDialog) {}

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() repeatTaskAdded: EventEmitter<any> = new EventEmitter<any>();

  openTaskDialog() {
    const dialogRef = this.dialog.open(TaskDialogData, {
      data: {
        columnName: this.columnName // Pass the columnName to the dialog
      }
    });

    // Subscribe to the emitted event from below
    dialogRef.componentInstance.taskAdded.subscribe((boxName: string) => {
      // Re-emit the event
      this.taskAdded.emit(boxName);
    });

    dialogRef.componentInstance.repeatTaskAdded.subscribe((data: any) => {
      // Handle the repeatTaskAdded event
      this.repeatTaskAdded.emit(data);
    });
  }
}


@Component({
  selector: 'task-dialog-data',
  templateUrl: 'add-task-dialog-body.html',
  standalone: true,
  imports: [NgIf, MatDialogTitle, MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, FormsModule, MatCheckboxModule, MatFormFieldModule, MatDatepickerModule, MatSelectModule, WeeklyComponent],
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./add-task-dialog.component.css']
})
export class TaskDialogData {
  constructor(
    public dialogRef: MatDialogRef<TaskDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  taskFields = {
    heading: '',
    description: '',
    fixed_dueDate: null as Date | null,
    variable_dueDate: null as Date | null,
    repeat: '',
    repeatFrequency: ''
  };

  @Output() taskAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() repeatTaskAdded: EventEmitter<any> = new EventEmitter<any>();
  
  onCancelClick(): void {
    console.log(this.data.columnName)
    this.dialogRef.close();
  }

  onAddTaskClick(): void {
    
    if (this.taskFields.repeatFrequency === 'weekly') {
      this.generateWeeklyTasks();
    } else {
      console.log("ehrerejrbjwe")
      this.setFixedDueDate(this.data.columnName)
      this.taskAdded.emit(this.taskFields)
      // Add logic for other repeat frequencies (if applicable)
    }
    this.dialogRef.close();
  }

  setFixedDueDate(columnName: string): void {
    switch (columnName.toLowerCase()) {
      case 'today':
        this.taskFields.variable_dueDate = new Date();
        break;
      case 'tomorrow':
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.taskFields.variable_dueDate = tomorrow;
        break;
      case 'this week':
        // Calculate the date for the next Monday
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const nextMonday = new Date(today.setDate(diffToMonday));
        this.taskFields.variable_dueDate = nextMonday;
        break;
      case 'next week':
        // Calculate the date for the Monday after next
        const todayForNext = new Date();
        const dayOfWeekForNext = todayForNext.getDay();
        const diffToNextMonday = todayForNext.getDate() - dayOfWeekForNext + (dayOfWeekForNext === 0 ? -6 : 1) + 7;
        const nextMondayAfter = new Date(todayForNext.setDate(diffToNextMonday));
        this.taskFields.variable_dueDate = nextMondayAfter;
        break;
      case 'this month':
        // Calculate the last day of the current month
        const todayForMonth = new Date();
        const lastDayOfMonth = new Date(todayForMonth.getFullYear(), todayForMonth.getMonth() + 1, 0);
        this.taskFields.variable_dueDate = lastDayOfMonth;
        break;
      case 'next month':
        // Calculate the last day of the next month
        const todayForNextMonth = new Date();
        const nextMonth = new Date(todayForNextMonth.getFullYear(), todayForNextMonth.getMonth() + 2, 0);
        this.taskFields.variable_dueDate = nextMonth;
        break;
      case 'this quarter':
        // Calculate the last day of the current quarter
        const todayForQuarter = new Date();
        const currentQuarter = Math.floor((todayForQuarter.getMonth() / 3)) + 1;
        const lastMonthOfQuarter = currentQuarter * 3;
        const lastDayOfQuarter = new Date(todayForQuarter.getFullYear(), lastMonthOfQuarter, 0);
        this.taskFields.variable_dueDate = lastDayOfQuarter;
        break;
      case 'next quarter':
        // Calculate the last day of the next quarter
        const todayForNextQuarter = new Date();
        const nextQuarter = Math.floor((todayForNextQuarter.getMonth() / 3)) + 2;
        const lastMonthOfNextQuarter = nextQuarter * 3;
        const lastDayOfNextQuarter = new Date(todayForNextQuarter.getFullYear(), lastMonthOfNextQuarter, 0);
        this.taskFields.variable_dueDate = lastDayOfNextQuarter;
        break;
      case 'this year':
        // Calculate the last day of the current year
        const todayForYear = new Date();
        const lastDayOfYear = new Date(todayForYear.getFullYear(), 11, 31);
        this.taskFields.variable_dueDate = lastDayOfYear;
        break;
      case 'next year':
        // Calculate the last day of the next year
        const todayForNextYear = new Date();
        const lastDayOfNextYear = new Date(todayForNextYear.getFullYear() + 1, 11, 31);
        this.taskFields.variable_dueDate = lastDayOfNextYear;
        break;
      default:
        this.taskFields.variable_dueDate = null;
        break;
    }
  }

  frequency : number = 0;
  selectedDays: string[] = [];
  receiveWeeklyData(data: any) {
    console.log('Received weekly data in parent:', data);
    this.frequency = data.frequency
    this.selectedDays = data.selectedDays
  }

  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  generateWeeklyTasks() {
    const currentDate = new Date();
    const selectedDaysIndices = this.selectedDays ? this.selectedDays.map((day: any) => this.daysOfWeek.indexOf(day)) : [];
    const frequency = this.frequency;
    console.log(selectedDaysIndices)
    // Check if selectedDaysIndices is empty or undefined
    if (!selectedDaysIndices || selectedDaysIndices.length === 0) {
      console.error('No selected days provided.');
      return;
    }
  
    // Calculate the end date for the tasks (e.g., 6 months from now)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
  
    const generatedTasks = [];
  
    // Generate tasks based on the weekly data
    while (currentDate < endDate) {
      const dayIndex = currentDate.getDay();
      for (let i = 0; i < 7; i++) {
        if (selectedDaysIndices.includes((dayIndex + i) % 7) && (i % frequency === 0)) {
          // Create a task for this day
          const task = {
            heading: this.taskFields.heading,
            description: this.taskFields.description,
            fixed_dueDate: this.addDays(currentDate, i)
          };
          generatedTasks.push(task);
        }
      }
      currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
    }
  
    // Do something with the generated tasks (e.g., save them to a database)
    console.log('Generated tasks:', generatedTasks);
    this.repeatTaskAdded.emit(generatedTasks);
  }
  
  

  addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
}
