import {Injectable} from '@angular/core';
import {httpResource} from '@angular/common/http';

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Method to fetch user data and update the signal
  fetchUser(options = {}) {
    return httpResource<User>(()=> '/api/users/v1.0/current', {...options});
  }
}
