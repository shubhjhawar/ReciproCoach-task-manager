import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

interface Week {
  label: string,
  value: number
}

@Component({
  selector: 'app-yearly',
  standalone: true,
  imports: [FormsModule, NgIf, MatInputModule, MatButtonToggleModule],
  templateUrl: './yearly.component.html',
  styleUrl: './yearly.component.css'
})
export class YearlyComponent {
  yearlyFormData = {
    frequency: 1,
    selectedMonth: null as string | null,
    selectedWeek: null as number | null,
    selectedDay: null as string | null
  }

  weeks: Week[] = [
    { label: 'First', value: 1 },
    { label: 'Second', value: 2 },
    { label: 'Third', value: 3 },
    { label: 'Fourth', value: 4 },
    { label: 'Last', value: -1 }
  ];

  daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Day', 'Weekday', 'Weekend day'];

  @Output() yearlyDataEmitter: EventEmitter<any> = new EventEmitter<any>();

  submitForm() {
    console.log(this.yearlyFormData)
    this.yearlyDataEmitter.emit(this.yearlyFormData);
  }

  onFrequencyChange(event: any) {
    this.yearlyFormData.frequency = event.target.value;
    this.submitForm();
  }

  onWeekChange(event: any) {
    this.yearlyFormData.selectedWeek = event.value;
    this.submitForm();
  }

  onDayChange(event: any) {
    this.yearlyFormData.selectedDay = event.value;
    this.submitForm();
  }

  onMonthChange(event: any) {
    this.yearlyFormData.selectedMonth = event.value;
    this.submitForm();
  }
}
