import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';
import { CompletedTask } from '../../models/completed-tasks.model';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './completed.component.html',
  styleUrl: './completed.component.css'
})
export class CompletedComponent {
  completedTasks: Task[] = CompletedTask.tasks;
  constructor() {}
}
