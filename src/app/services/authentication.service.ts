import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  login(user) {
    return this.http.post<any>(environment.api_url + 'auth/login', user);
  }
}
