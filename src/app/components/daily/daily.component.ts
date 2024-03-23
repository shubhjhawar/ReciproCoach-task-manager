import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})
export class DailyComponent {
  dailyFormData = {
    frequency: 0,
  }

  @Output() dailyDataEmitter: EventEmitter<any> = new EventEmitter<any>();

  submitForm() {
    // Implement form submission logic here
    console.log(this.dailyFormData)
    this.dailyDataEmitter.emit(this.dailyFormData);
  }

  onFrequencyChange(event: any) {
    this.dailyFormData.frequency = event.target.value;
    this.submitForm();
  }
}
