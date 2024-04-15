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
import { DailyComponent } from '../daily/daily.component';
import { WeeklyComponent } from '../weekly/weekly.component';
import { MonthlyComponent } from '../monthly/monthly.component';
import { YearlyComponent } from '../yearly/yearly.component';
import { generateDailyTasks } from '../../../utils/daily-utils';
import { generateWeeklyTasks } from '../../../utils/weekly-task-utils';
import { generateMonthlyTasks } from '../../../utils/monthly-task-utils';
import { generateYearlyTasks } from '../../../utils/yearly-task-utils';

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
  imports: [NgIf, MatDialogTitle, MatDialogContent, MatDialogActions, MatFormFieldModule, MatInputModule, FormsModule, MatCheckboxModule, MatFormFieldModule, MatDatepickerModule, MatSelectModule, DailyComponent, WeeklyComponent, MonthlyComponent, YearlyComponent],
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

  onAddTaskClick(): void {
    if (this.taskFields.repeatFrequency === 'daily') {
      let generatedTasks = generateDailyTasks(this.dailyFrequency, this.taskFields);
      this.repeatTaskAdded.emit(generatedTasks);
    } else if (this.taskFields.repeatFrequency === 'weekly') {
      let generatedTasks = generateWeeklyTasks(this.selectedDays, this.frequency, this.taskFields);
      this.repeatTaskAdded.emit(generatedTasks);
    } else if(this.taskFields.repeatFrequency === 'monthly') {
      let generatedTasks = generateMonthlyTasks(this.monthFrequency, this.monthSelectedWeek, this.monthSelectedDay, this.taskFields);
      this.repeatTaskAdded.emit(generatedTasks);
    } else if(this.taskFields.repeatFrequency === 'annually') {
      let generatedTasks = generateYearlyTasks(this.yearFrequency, this.yearSelectedMonth, this.yearSelectedWeek, this.yearSelectedDay, this.taskFields);
      this.repeatTaskAdded.emit(generatedTasks);
    } else {
      this.setFixedDueDate(this.data.columnName)
      this.taskAdded.emit(this.taskFields)
      // Add logic for other repeat frequencies (if applicable)
    }
    this.dialogRef.close();
  }
  
  dailyFrequency : number = 0;
  receiveDailyData(data: any) {
    console.log('Received daily data in parent:', data.frequency);
    this.dailyFrequency = data.frequency
  }

  frequency : number = 0;
  selectedDays: string[] = [];
  receiveWeeklyData(data: any) {
    console.log('Received weekly data in parent:', data);
    this.frequency = data.frequency
    this.selectedDays = data.selectedDays
  }
  
  monthFrequency: number = 0;
  monthSelectedWeek: number = 0;
  monthSelectedDay: string = '';
  receiveMonthlyData(data: any) {
    console.log('Received monthly data in parent:', data);
    this.monthFrequency = data.frequency
    this.monthSelectedWeek = data.selectedWeek
    this.monthSelectedDay = data.selectedDay
  }

  yearFrequency: number = 0;
  yearSelectedMonth: string = '';
  yearSelectedWeek: any = 0;
  yearSelectedDay: string = '';
  receiveYearlyData(data: any) {
    console.log('Received yearly data in parent:', data);
    this.yearFrequency = data.frequency
    this.yearSelectedMonth=data.selectedMonth
    this.yearSelectedWeek = data.selectedWeek
    this.yearSelectedDay = data.selectedDay
  }
  
}
