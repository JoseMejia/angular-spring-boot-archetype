import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, httpResource} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../environments/environment';

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private cookieService: CookieService;
  private http: HttpClient;
  constructor() {
    this.cookieService = inject(CookieService);
    this.http = inject(HttpClient);
  }

// Method to fetch user data and update the signal
  fetchUser(options = {}) {
    return httpResource<User>(()=> `${environment.context}/api/users/v1.0/current`, {...options});
  }

  logout() {
    const csrf = this.cookieService.get('XSRF-TOKEN') || 'none';
    const headers = new HttpHeaders().set('X-XSRF-TOKEN', csrf);
    return this.http.post(`${environment.context}/logout`, null, {headers});
  }
}
