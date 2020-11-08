import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class AreaService {

  constructor(private http: HttpClient) {
  }

  saveArea(value) {
    return this.http.post<any>(environment.api_url + 'area-add', value);
  }

  updateArea(id, value) {
    return this.http.post<any>(environment.api_url + 'area-update/' + id, value);
  }

  getAreaById(id) {
    return this.http.get<any>(environment.api_url + 'area-get/' + id);
  }
  deleteAreaById(id) {
    return this.http.get<any>(environment.api_url + 'area-delete/' + id);
  }
  changeStatusById(id) {
    return this.http.get<any>(environment.api_url + 'area-change-status/' + id);
  }
  getAreas(is_org = false) {
    if(is_org){
      return this.http.get<any>(environment.api_url + 'area-get-all/'+is_org);
    }
    return this.http.get<any>(environment.api_url + 'area-get-all');
  }
}
