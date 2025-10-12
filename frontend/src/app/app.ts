import {Component, inject, signal} from '@angular/core';
import {environment} from '../environments/environment';
import {UserService} from './services/user-service';
import {MatDialog} from '@angular/material/dialog';
import {LogoutDialog} from './components/logout-dialog/logout-dialog';
import {LogService} from './services/log-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: false
})
export class App {
  protected readonly title = signal(environment.app);
  protected readonly user;
  protected readonly isLoading;
  readonly dialog = inject(MatDialog);
  private userService: UserService;
  private logService: LogService;

  constructor() {
    this.logService = inject(LogService);
    this.userService = inject(UserService);
    const userHttpResourceRef = this.userService.fetchUser({defaultValue: undefined});
    this.user = userHttpResourceRef.value;
    this.isLoading = userHttpResourceRef.isLoading;
    this.logService.info('App initialized');
  }

  submitLogout(event: Event) {
    event.preventDefault();

    const dialogRef = this.dialog.open(LogoutDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performLogout();
      }
    });
  }

  performLogout() {
    this.userService.logout().subscribe({
      next: () => {
        // Redirect or handle successful login
        window.location.reload();
      },
      error: (error) => {
        if (error.status === 200) {
          window.location.reload();
        }
        console.error('Logout error:', error);
      }
    });
  }
}
