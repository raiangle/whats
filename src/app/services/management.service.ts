import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class ManagementService {

  constructor(private http: HttpClient) {
  }

  saveManagement(value) {
    return this.http.post<any>(environment.api_url + 'management-add', value);
  }

  updateManagement(id, value) {
    return this.http.post<any>(environment.api_url + 'management-update/' + id, value);
  }

  getManagementById(id) {
    return this.http.get<any>(environment.api_url + 'management-get/' + id);
  }
  getManagements() {
    return this.http.get<any>(environment.api_url + 'management-get-all');
  }

  addManagementGallery(value) {
    return this.http.post<any>(environment.api_url + 'management-add-gallery', value);
  }
}
