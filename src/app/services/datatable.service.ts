import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { StorageManagerService } from './storage-manager.service';

@Injectable()
export class DatatableService {
  constructor(private http: HttpClient) {
  }

  getTableData(dataTablesParameters, url) {
    if (url == 'datatable-areas' || url == 'datatable-management') {
      let countryID = StorageManagerService.getCountry();
      let areaID = StorageManagerService.getArea();
      if (countryID && countryID != null && parseInt(countryID) > 0) {
        dataTablesParameters.country_id = countryID;
      }
      if (areaID && areaID != null) {
        dataTablesParameters.area_id = areaID;
      }
    }
    return this.http.post<DataTablesResponse>(environment.api_url + url, dataTablesParameters);
  }
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
