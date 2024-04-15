import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from './api.service';
import { API_CONSTANTS } from './apiconstant';

@Injectable({
  providedIn: 'root',
})
export class CommonserviceService {
  constructor(private apiService: ApiService) {}

  //column api

  createColumn(payload: any) {
    const endpoint = API_CONSTANTS.createColumn;
    return this.apiService
      .post(endpoint, payload)
      .pipe(map(({ body }: any) => body));
  }

  getColumns() {
    const endpoint = API_CONSTANTS.getColumns;
    return this.apiService.get(endpoint).pipe(map(({ body }) => body));
  }

  getColumn(id: string) {
    const endpoint = API_CONSTANTS.getColumn + id;
    return this.apiService.get(endpoint).pipe(map(({ body }) => body));
  }

  updateColumn(id: string, payload: any) {
    const endpoint = API_CONSTANTS.updateColumn + id;
    return this.apiService
      .put(endpoint, payload)
      .pipe(map(({ body }: any) => body));
  }

  deleteColumn(id: string) {
    const endpoint = API_CONSTANTS.deleteColumn + id;
    return this.apiService.delete(endpoint).pipe(map(({ body }) => body));
  }

  //Task api
  createTask(payload: any) {
    const endpoint = API_CONSTANTS.createTask;
    return this.apiService
      .post(endpoint, payload)
      .pipe(map(({ body }: any) => body));
  }

  getTasks() {
    const endpoint = API_CONSTANTS.getTasks;
    return this.apiService.get(endpoint).pipe(map(({ body }) => body));
  }

  getCompletedTasks() {
    const endpoint = API_CONSTANTS.getCompletedTasks;
    return this.apiService.get(endpoint).pipe(map(({ body }) => body));
  }

  getTask(id: string) {
    const endpoint = API_CONSTANTS.getTask + id;
    return this.apiService.get(endpoint).pipe(map(({ body }) => body));
  }

  updateTask(id?: string | null, payload?: any) {
    const endpoint = API_CONSTANTS.updateTask + id;
    return this.apiService
      .put(endpoint, payload)
      .pipe(map(({ body }: any) => body));
  }

  updateColumnIds(id: string, payload: any) {
    const endpoint = API_CONSTANTS.updateColumns + id;
    return this.apiService
      .put(endpoint, payload)
      .pipe(map(({ body }: any) => body));
  }

  updateTasksIndices(payload: any) {
    const endpoint = API_CONSTANTS.updateIndices;
    return this.apiService
      .put(endpoint, payload)
      .pipe(map(({ body }: any) => body));
  }

  deleteTask(id: string) {
    const endpoint = API_CONSTANTS.deleteTask + id;
    return this.apiService.delete(endpoint).pipe(map(({ body }) => body));
  }
}
