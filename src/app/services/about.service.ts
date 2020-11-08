import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class AboutService {

  constructor(private http: HttpClient) {
  }

  saveAbout(value) {
    return this.http.post<any>(environment.api_url + 'about-add', value);
  }

  updateAbout(id, value) {
    return this.http.post<any>(environment.api_url + 'about-update/' + id, value);
  }

  getAboutData() {
    return this.http.get<any>(environment.api_url + 'about-get');
  }
}
