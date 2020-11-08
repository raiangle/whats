import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()

export class NotificationService {

  constructor(public http: HttpClient) {
  }

  sendNotification(value) {
    return this.http.post<any>(environment.api_url + 'send-notification', value);
  }
}
