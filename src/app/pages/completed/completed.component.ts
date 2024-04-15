import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';
import { CommonserviceService } from '../../apiService/commonservice.service';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './completed.component.html',
  styleUrl: './completed.component.css'
})
export class CompletedComponent {
  completedTasks: Task[] = [];
  constructor(private apiService: CommonserviceService) {}

  ngOnInit(): void {
    this.getAllCompletedTasks();
  }

  getAllCompletedTasks() {
    this.apiService.getCompletedTasks().subscribe(
      (response: any) => {
        if(response) {
          this.completedTasks = response.tasks;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
