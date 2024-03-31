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
  selector: 'app-monthly',
  standalone: true,
  imports: [FormsModule, NgIf, MatInputModule, MatButtonToggleModule],
  templateUrl: './monthly.component.html',
  styleUrl: './monthly.component.css'
})
export class MonthlyComponent {
  monthlyFormData = {
    frequency: 1,
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

  @Output() monthlyDataEmitter: EventEmitter<any> = new EventEmitter<any>();

  submitForm() {
    // Implement form submission logic here
    console.log(this.monthlyFormData)
    this.monthlyDataEmitter.emit(this.monthlyFormData);
  }

  onFrequencyChange(event: any) {
    this.monthlyFormData.frequency = event.target.value;
    this.submitForm();
  }

  onWeekChange(event: any) {
    this.monthlyFormData.selectedWeek = event.value;
    this.submitForm();
  }

  onDayChange(event: any) {
    this.monthlyFormData.selectedDay = event.value;
    this.submitForm();
  }
}
