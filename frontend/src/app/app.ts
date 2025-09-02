import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SharedModule} from './shared/shared-module';
import {environment} from '../environments/environment';
import {UserService} from './services/user-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = signal(environment.app);
  protected user;
  protected isLoading;

  constructor() {
    const userService = inject(UserService);
    const userHttpResourceRef = userService.fetchUser({defaultValue: undefined});
    this.user= userHttpResourceRef.value;
    this.isLoading= userHttpResourceRef.isLoading;
  }

}
