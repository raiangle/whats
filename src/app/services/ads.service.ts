import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()

export class AdsService {

  constructor(public http: HttpClient) {
  }

  saveAdsManagement(value) {
    return this.http.post<any>(environment.api_url + 'add-ads-management', value);
  }

  updateManagement(id, value) {
    return this.http.post<any>(environment.api_url + 'ads-management-update/' + id, value);
  }
  getAdsManagementById(id) {
    return this.http.get<any>(environment.api_url + 'ads-management-get/' + id);
  }
  getAllAds() {
    return this.http.get<any>(environment.api_url + 'ads-get-all');
  }
  saveAdsOrder(value) {
    return this.http.post<any>(environment.api_url + 'ads-management-order', value);
  }
}
