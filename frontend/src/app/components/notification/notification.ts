import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialog} from '../error-dialog/error-dialog';
import {NotificationService} from '../../services/notification-service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.html',
})
export class Notification implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private subscription: Subscription | undefined;
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  error = signal<Error | undefined>(undefined);

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.notificationService.getNotifications()
      .subscribe((data: string | Error | undefined) => {
        if (data instanceof Error) {
          this.openSnackBar(data.message, 'Details', true);
          this.error.set(data);
          return;
        }
        this.error.set(undefined);
        if (data) {
          this.openSnackBar(data, 'Close', false, {duration: 3000});
          return;
        }
        this.snack.dismiss();
      });
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  openSnackBar(message: string, action: string, isError: boolean, opts: Record<string, any> = {}): void {
    const snackBarRef = this.snack.open(message, action, opts || {});
    snackBarRef.onAction().subscribe(() => {
      if (isError) {
        this.dialog.open(ErrorDialog, {width: '480px', data: {error: this.error()}});
      }
    });
    /* eslint-enable  @typescript-eslint/no-explicit-any */

  }

}
