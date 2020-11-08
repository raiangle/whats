import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class CountryService {

  constructor(private http: HttpClient) {
  }

  saveCountry(value) {
    return this.http.post<any>(environment.api_url + 'country-add', value);
  }

  updateCountry(id, value) {
    return this.http.post<any>(environment.api_url + 'country-update/' + id, value);
  }

  getCountryById(id) {
    return this.http.get<any>(environment.api_url + 'country-get/' + id);
  }
  deleteCountryById(id) {
    return this.http.get<any>(environment.api_url + 'country-delete/' + id);
  }
  changeStatusById(id) {
    return this.http.get<any>(environment.api_url + 'country-change-status/' + id);
  }
  getCountries() {
    return this.http.get<any>(environment.api_url + 'country-get-all');
  }
}
