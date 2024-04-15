import {
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject, throwError } from "rxjs";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  responseType = {
    observe: "response",
  };
  miniCartSubject = new ReplaySubject(1);

  constructor(
    private http: HttpClient,
  ) { }

  get(url: any, options: any = {}): Observable<any> {
    let requestOptions = { ...this.responseType, ...options };
    return this.http.get(`${environment.apiBaseUrl}${url}`, requestOptions).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  };

  post(endpoint: any, payload: any, options: any = {}, baseUrlIncluded = false) {
    let requestOptions = { ...options, ...this.responseType };
    const url = `${baseUrlIncluded ? '' : environment.apiBaseUrl}${endpoint}`;
    return this.http
      .post(url, payload, requestOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  };

  put(url: any, payload: any, options: any = {}) {
    let requestOptions = { ...options, ...this.responseType };
    return this.http
      .put(`${environment.apiBaseUrl}${url}`, payload, requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  patch(url: any, payload: any, options: any = {}) {
    let requestOptions = { ...options, ...this.responseType };
    return this.http
      .patch(`${environment.apiBaseUrl}${url}`, payload, requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  };

  delete(url: any, options: any = {}): Observable<any> {
    let requestOptions = { ...options, ...this.responseType };
    return this.http
      .delete(`${environment.apiBaseUrl}${url}`, requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  };


  
}
