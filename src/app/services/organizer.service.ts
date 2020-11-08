import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class OrganizerService {

  constructor(private http: HttpClient) {
  }

  saveOrganizer(value) {
    return this.http.post<any>(environment.api_url + 'organizer-add', value);
  }

  updateOrganizer(id, value) {
    return this.http.post<any>(environment.api_url + 'organizer-update/' + id, value);
  }
  resetPwOrganizer(id, value) {
    return this.http.post<any>(environment.api_url + 'organizer-reset-pw/' + id, value);
  }

  getOrganizerById(id) {
    return this.http.get<any>(environment.api_url + 'organizer-get/' + id);
  }

  addOrganizerGallery(value) {
    return this.http.post<any>(environment.api_url + 'organizer-add-gallery', value);
  }
}
