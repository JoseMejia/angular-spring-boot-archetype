import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {

  readonly hide = signal(true);
  readonly loginStatus = signal<string | null>(null);
  readonly isLoading = signal(false);

  private cookieService: CookieService;
  private http: HttpClient;
  private window: Window;

  constructor() {
    this.cookieService = inject(CookieService);
    this.http = inject(HttpClient);
    this.window = inject(Window, {optional: true}) || window;
  }

  clickEvent(event: MouseEvent) {
    event.stopPropagation();
    this.hide.set(!this.hide());
  }

  submitForm(event: Event, username: string, password: string) {
    event.preventDefault();

    this.isLoading.set(true);
    this.loginStatus.set(null);

    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    const csrf = this.getCsrfValue();

    const headers = new HttpHeaders().set('X-XSRF-TOKEN', csrf);

    this.http.post('/login', body, {headers}).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.loginStatus.set('Login successful');
        // Redirect or handle successful login
        this.window.location.href = '/';
      },
      error: (error) => {
        this.isLoading.set(false);
        this.loginStatus.set('Login failed: ' + (error.error?.message || error.statusText || 'Unknown error'));
        console.error('Login error:', error);
      }
    });
  }

  private getCsrfValue() {
    return this.cookieService.get('XSRF-TOKEN') || 'none';
  }
}
