import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()

export class UserService {

  constructor(public http: HttpClient) {
  }

  getUserById(id) {
    return this.http.get<any>(environment.api_url + 'usert-get/' + id);
  }

}
