import {Injectable} from '@angular/core';

@Injectable()
export class StorageManagerService {

  private static readonly TOKEN = 'token';

  static storeToken(token) {
    localStorage.setItem(this.TOKEN, token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN);
  }

  static storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUser() {
    return localStorage.getItem('user');
  }

  static clearAll() {
    localStorage.clear();
  }

  static storeCountryAndArea(data) {
    localStorage.setItem('country_id', data.country_id);
    localStorage.setItem('area_id', data.area_id);
  }

  static getCountry() {
    return localStorage.getItem('country_id');
  }

  static getArea() {
    return localStorage.getItem('area_id');
  }
}
