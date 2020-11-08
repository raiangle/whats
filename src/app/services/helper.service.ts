import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  static defaultLatitude = -33.8688;
  static defaultLongitude = 151.2093;

  constructor() {
  }

  static toSlug(str: string) {
    return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  static createFormData(object: Object, form?: FormData, namespace?: string): FormData {
    const formData = form || new FormData();
    // tslint:disable-next-line:forin
    for (const property in object) {
      if (!object.hasOwnProperty(property) || !object[property]) {
        if (object[property] !== null && object[property] !== '' && object[property] !== 0) {
          continue;
        }
      }
      const formKey = namespace ? `${namespace}[${property}]` : property;
      if (object[property] instanceof Date) {
        formData.append(formKey, moment(object[property]).format());
      } else if (object[property] instanceof moment) {
        formData.append(formKey, moment(object[property]).format());
      } else if (object[property] === null || object[property] === '') {
        formData.append(formKey, '');
      } else if (object[property] === 0) {
        formData.append(formKey, '0');
      } else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
        this.createFormData(object[property], formData, formKey);
      } else {
        formData.append(formKey, object[property]);
      }
    }
    return formData;
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
