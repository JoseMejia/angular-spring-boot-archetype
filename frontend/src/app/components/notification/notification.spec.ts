import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notification } from './notification';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification-service';
import { ErrorDialog } from '../error-dialog/error-dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Notification component', () => {
  let fixture: ComponentFixture<Notification>;
  let notificationSubject: BehaviorSubject<string|Error|undefined>;

  const actionSubject = new Subject<void>();

  const snackSpy = {
    open: jasmine.createSpy('open').and.returnValue({
      onAction: () => actionSubject.asObservable()
    }),
    dismiss: jasmine.createSpy('dismiss')
  };

  const dialogSpy = {
    open: jasmine.createSpy('open')
  };

  const mockNotificationService = {
    getNotifications: () => notificationSubject.asObservable()
  };

  beforeEach(async () => {
    notificationSubject = new BehaviorSubject<string|Error|undefined>(undefined);

    await TestBed.configureTestingModule({
      declarations: [Notification],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MatSnackBar, useValue: snackSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Notification);
    fixture.detectChanges();

    // reset spies because BehaviorSubject initial value (undefined) fires immediately
    snackSpy.open.calls.reset();
    snackSpy.dismiss.calls.reset();
    dialogSpy.open.calls.reset();
  });

  it('shows a snack for string messages with duration option', () => {
    notificationSubject.next('hello world');
    expect(snackSpy.open).toHaveBeenCalledWith('hello world', 'Close', { duration: 3000 });
  });

  it('shows a snack for Error and opens ErrorDialog when Details action is clicked', () => {
    const err = new Error('boom');
    notificationSubject.next(err);
    expect(snackSpy.open).toHaveBeenCalledWith('boom', 'Details', {});
    // simulate clicking the action button on the snack
    actionSubject.next();
    expect(dialogSpy.open).toHaveBeenCalledWith(ErrorDialog, { width: '480px', data: { error: err } });
  });

  it('dismisses snack when notification is undefined', () => {
    // ensure previous calls cleared
    snackSpy.dismiss.calls.reset();
    notificationSubject.next(undefined);
    expect(snackSpy.dismiss).toHaveBeenCalled();
  });
});

