import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  saveCat(value) {
    return this.http.post<any>(environment.api_url + 'category-add', value);
  }

  updateCat(id, value) {
    return this.http.post<any>(environment.api_url + 'category-update/' + id, value);
  }

  getCatById(id) {
    return this.http.get<any>(environment.api_url + 'category-get/' + id);
  }

  getCategory(types) {
    return this.http.get<any>(environment.api_url + 'category-get-all/' + types);
  }

  getOrganizerCategoryWithPlace() {
    return this.http.get<any>(environment.api_url + 'get-organizer-category-with-place');
  }
  
  getCategoriesALL() {
    return this.http.get<any>(environment.api_url + 'category-gets');
  }

  saveOrder(value) {
    return this.http.post<any>(environment.api_url + 'category-order', value);
  }

  saveOrganizerCategoryWithPlace(arr, tempDeleted) {
    return this.http.post<any>(environment.api_url + 'save-organizer-category-with-place', {data: arr, dataDeleted: tempDeleted});
  }
}
