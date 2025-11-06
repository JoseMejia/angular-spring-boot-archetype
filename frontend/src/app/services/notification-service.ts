import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<string|Error|undefined>(undefined);

  notify(message: string | Error) {
    this.notificationSubject.next(message);
  }

  getNotifications(): Observable<string|Error|undefined> {
    return this.notificationSubject.asObservable();
  }

  clear() {
    this.notificationSubject.next(undefined);
  }
}
