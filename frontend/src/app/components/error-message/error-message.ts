import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ErrorService} from '../../services/error-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-error-message',
  standalone: false,
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessage implements OnInit, OnDestroy {
  private errorService = inject(ErrorService);
  private subscription: Subscription | undefined;

  errorMessage = signal('');

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.errorService.getError().subscribe((data: Error | undefined) => {
      this.errorMessage.set(data?.message || '');
    });
  }

  clearError() {
    this.errorMessage.set('');
  }
}
