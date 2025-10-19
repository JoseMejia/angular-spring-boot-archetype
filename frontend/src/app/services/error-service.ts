import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errorSubject = new BehaviorSubject<Error|undefined>(undefined);

  setError(error: Error) {
    this.errorSubject.next(error);
  }

  getError() {
    return this.errorSubject.asObservable();
  }

  clearError() {
    this.errorSubject.next(undefined);
  }

}
