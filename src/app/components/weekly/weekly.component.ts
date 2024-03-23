import { Component, Output, EventEmitter} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weekly',
  standalone: true,
  imports: [MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgIf, FormsModule],
  templateUrl: './weekly.component.html',
  styleUrl: './weekly.component.css'
})
export class WeeklyComponent {
  weeklyFormData = {
    frequency: 1,
    selectedDays: [] as string[]
  };

  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  @Output() weeklyDataEmitter: EventEmitter<any> = new EventEmitter<any>();

  submitForm() {
    this.weeklyDataEmitter.emit(this.weeklyFormData);
  }

  updateSelectedDays(day: string, isChecked: boolean) {
    if (isChecked) {
      this.weeklyFormData.selectedDays.push(day);
    } else {
      this.weeklyFormData.selectedDays = this.weeklyFormData.selectedDays.filter(selectedDay => selectedDay !== day);
    }
    this.submitForm();
  }

  onFrequencyChange(event: any) {
    this.weeklyFormData.frequency = event.target.value;
    this.submitForm();
  }
}
