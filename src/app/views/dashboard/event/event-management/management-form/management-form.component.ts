import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService, AreaService, CategoryService, HelperService, LoaderService, ManagementService } from '../../../../services';
import { MouseEvent } from '@agm/core';
import { ToastrService } from 'ngx-toastr';

import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventApi } from '@fullcalendar/core/api/EventApi';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'management-form.component.html',
  styleUrls: ['management-form.component.scss']
})
export class ManagementFormComponent implements OnInit {

  public managementForm: FormGroup;
  public eventManagementGalForm: FormGroup;

  systemCategories = [];
  areasList = [];
  countriesList = [];
  eventMgtData = null;


  @ViewChild('search') public searchElementRef: ElementRef;

  public mapZoom = 12;
  private geoCoder;
  public marker: any = {
    // url: '/assets/img/marker.png',
    scaledSize: {
      width: 32,
      height: 30
    }
  };
  public prevImages = [];

  public id = 0;

  // calender
  options: OptionsInput = {
    editable: true,
    header: {
      left: 'prev,next today myCustomButton',
      center: 'title',
      // right: 'dayGridMonth'
    },
    plugins: [dayGridPlugin, interactionPlugin]
  };

  eventForm: FormGroup;
  eventToEdit: EventApi = null;
  eventsToDisplay: any = [];
  events: any[] = [];
  eventsRemove: any[] = [];

  modalRef: BsModalRef;
  public show: any = false;
  public buttonDisable: any = 'Show';


  constructor(private router: Router,
    private _activatedRouter: ActivatedRoute,
    private categoryService: CategoryService,
    private managementService: ManagementService,
    private _toasterService: ToastrService,
    private modalService: BsModalService,
    private areaService: AreaService,
    private countryService: CountryService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.managementForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'image': ['', Validators.required],
      'description': ['', Validators.required],
      'category_id': ['', Validators.required],
      'area_id': ['', Validators.required],
      'country_id': ['', Validators.required],
      // organizer_id: ['', Validators.required],
      'contact': [''],
      'ticket_url': [''],
      'lat': [''],
      'long': [''],
      'address': ['', Validators.required],
      'events': [''],
      'eventsToRemove': ['']
    });
    this.eventManagementGalForm = this.formBuilder.group({
      'id': [null],
      'image_to_add': this.formBuilder.array([]),
      'image_to_remove': this.formBuilder.array([]),
    });

    this.eventForm = this.formBuilder.group({
      id: [],
      index: [],
      title: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      time: ['', Validators.required],
      time2: ['', Validators.required]
    });

    this.id = +this._activatedRouter.snapshot.params['id'];
    this.getSystemCategories();
    // this.getAreas();
    this.getCountries();
    if (this.id) {
      this.getEventManagementId(this.id);
    }
  }


  setCountryValue = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user['data'] && user['data']['user']) {
      const role = user['data']['user']['roles'][0]['name'];
      if (role === 'employee') {
        const temp_area = localStorage.getItem('area_id');
        let area = 0;
        if (temp_area !== 'show_all') {
          area = parseInt(temp_area, 10);
        }
        const country = parseInt(localStorage.getItem('country_id'), 10);
        this.managementForm.get('country_id').setValue(country);
        this.managementForm.get('country_id').disable({ onlySelf: true });
        const Obj = this.countriesList.find(t => t.id === country);
        if (Obj) {
          this.areasList = Obj.areas;
        }
        if (temp_area !== 'show_all') {
          this.managementForm.get('area_id').setValue(area);
          this.managementForm.get('area_id').disable({ onlySelf: true });
        }
      }
    }
  }

  get minDate() {
    return new Date();
  }

  getEventManagementId(id) {
    this.managementService.getManagementById(id).subscribe(response => {
      this.eventMgtData = response['data'];
      const responseData = response['data'];
      // tslint:disable-next-line:forin
      for (const field in this.managementForm.controls) {
        this.managementForm.get(field).setValue(responseData[field]);
      }
      this.managementForm.get('country_id').setValue(responseData.area.country_id);

      let Obj = this.countriesList.find(t => t.id == responseData.area.country_id);
      if (Obj) {
        this.areasList = Obj.areas;
      }

      this.setGallery(response.data.gallery);
      this.setCalenderEvent(response.data.calenderevent);
    }, error => {

    });
  }

  setCalenderEvent(calenderEvent) {
    this.events = [];
    for (let i = 0; i < calenderEvent.length; i++) {
      const eventItem = calenderEvent[i];
      this.events.push({
        id: eventItem.id,
        start: moment(eventItem.start_date_time),
        end: moment(eventItem.end_date_time),
        title: eventItem.title,
        index: i,
        time: moment(eventItem.start_date_time),
        time2: moment(eventItem.end_date_time),
      });
    }

    this.eventsArrayToCalenderEvents();
  }

  setGallery(gallery) {
    for (const gal of gallery) {
      this.prevImages.push({ id: gal.id, path: gal.full_management_image });
    }

  }

  getSystemCategories() {
    LoaderService.show();
    this.categoryService.getCategoriesALL().subscribe(response => {
      LoaderService.hide();
      this.systemCategories = response['data'];
    }, error => {
      LoaderService.hide();
    });
  }

  getAreas() {
    LoaderService.show();
    this.areaService.getAreas().subscribe(response => {
      LoaderService.hide();
      // this.areasList = response['data'];
      this.areasList = [];
    }, error => {
      LoaderService.hide();
    });
  }

  getCountries() {
    this.countryService.getCountries().subscribe(response => {
      this.countriesList = response['data'];
      if (this.managementForm.value.country_id) {
        let Obj = this.countriesList.find(t => t.id == this.managementForm.value.country_id);
        this.areasList = Obj.areas;
      }
      this.setCountryValue();

    }, error => {
    });
  }

  onChangeCountry(event) {
    let Obj = this.countriesList.find(t => t.id == this.managementForm.value.country_id);
    this.areasList = Obj.areas;
    this.managementForm.value.area_id = '';
    this.managementForm.get('area_id').setValue('');
  }

  cancel() {
    this.router.navigate(['/', 'event', 'management']);
  }

  addEventManagement() {

    this.managementForm.markAllAsTouched();

    LoaderService.show();
    if (this.events.length > 0) {
      this.managementForm.get('events').setValue(this.events);
    }
    if (this.eventsRemove.length > 0) {
      this.managementForm.get('eventsToRemove').setValue(this.eventsRemove);
    }

    if (this.id) {
      const formData = HelperService.createFormData(this.managementForm.value);

      this.managementService.updateManagement(this.id, formData)
        .subscribe((response) => {
          LoaderService.hide();
          this.eventManagementGalForm.get('id').setValue(this.id);
          const formGalleryData = HelperService.createFormData(this.eventManagementGalForm.getRawValue());
          this.managementService.addManagementGallery(formGalleryData).subscribe((res) => {

          });
          this._toasterService.success('Event Updated', 'Success');
          this.cancel();
        }, (e) => {
          LoaderService.hide();
          this.setServeErrors(e.error);
          this._toasterService.error('Event Update Failed', 'Failed');
        });
    } else {
      const formData = HelperService.createFormData(this.managementForm.value);

      this.managementService.saveManagement(formData)
        .subscribe((response) => {
          const event_id = response['data']['id'];
          LoaderService.hide();
          this.eventManagementGalForm.get('id').setValue(event_id);
          const formGalleryData = HelperService.createFormData(this.eventManagementGalForm.getRawValue());

          this.managementService.addManagementGallery(formGalleryData).subscribe((res) => {

          });
          this._toasterService.success('Event Added', 'Success');
          this.cancel();
        }, (e) => {
          LoaderService.hide();
          this.setServeErrors(e.error);
          this._toasterService.error('Event Add Failed', 'Failed');
        });
    }
  }

  setServeErrors(errorResponse) {
    for (const controlKey of Object.keys(errorResponse.errors)) {
      this.managementForm.get(controlKey).setErrors({ serverErrors: errorResponse.errors[controlKey] });
    }
  }

  markerChanged($event: MouseEvent) {
    this.setLatLong($event.coords.lat, $event.coords.lng);
    this.getAddress($event.coords.lat, $event.coords.lng);
  }

  setLatLong(lat, lng) {
    this.managementForm.get('lat').setValue(lat);
    this.managementForm.get('long').setValue(lng);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.mapZoom = 12;
          // console.log('address - ', results[0].formatted_address);
        }
      } else {
        // console.log('map error status', status);
      }
    });
  }

  handleImage(file) {
    const control = <FormArray>this.eventManagementGalForm.get('image_to_add');
    control.push(this.formBuilder.control(file));
  }

  onFileRemove(val: any) {
    if (val.id !== 0) {
      const control = <FormArray>this.eventManagementGalForm.get('image_to_remove');
      control.push(this.formBuilder.control(val.id));
    }
  }


  insertData(model, modalTemplate) {
    const currentDate = model.dateStr;
    const dateToDeclare = moment().format('YYYY-MM-DD');
    this.eventToEdit = null;
    this.eventForm.reset();

    // if (currentDate >= dateToDeclare) {
    this.modalRef = this.modalService.show(modalTemplate);
    // }
    // if (currentDate < dateToDeclare) {
    //   this._toasterService.info('The date is not allowed');
    // }
  }

  public disableClick() {
    this.show = !this.show;
    if (this.show) {
      this.buttonDisable = 'Disabled';
    } else {
      this.buttonDisable = 'Enabled';
    }
  }

  onValueChange(value, isFrom) {
    if (value === null) {
      return;
    }
    if (moment(value).isBefore(moment().subtract(1, 'days'))) {
      if (isFrom) {
        this.eventForm.get('start').setValue(null);
      } else {
        this.eventForm.get('end').setValue(null);
      }
      return;
    }
  }

  public deleteEvent() {
    const index = this.getIndexToEdit();
    if (index !== null) {
      const eventToDelete = this.events[index];

      if (eventToDelete.id) {
        this.eventsRemove.push({
          id: eventToDelete.id
        });
      }

      this.events.splice(index, 1);
      this.eventsArrayToCalenderEvents();
    }
    this.modalRef.hide();
  }

  public getIndexToEdit() {
    if (this.eventToEdit === null) {
      return null;
    }
    let index = null;
    for (const calenderEventItem of this.events) {
      if (calenderEventItem.index === this.eventToEdit.extendedProps.index) {
        index = calenderEventItem.index;
        break;
      }
    }
    return index;
  }

  eventsArrayToCalenderEvents() {
    const eventsToDisplayArray: any[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.events.length; i++) {
      const eventItem = this.events[i];
      eventsToDisplayArray.push({
        id: eventItem.id,
        end: eventItem.end.toDate(),
        start: eventItem.start.toDate(),
        title: eventItem.title,
        extendedProps: {
          index: eventItem.index,
          time: eventItem.time.toDate(),
          time2: eventItem.time2.toDate()
        }
      });
    }

    this.eventsToDisplay = eventsToDisplayArray;
  }

  editEvents(event, modalTemplate: TemplateRef<any>) {
    this.eventToEdit = event.event;
    this.eventForm.get('id').setValue(this.eventToEdit.id);
    this.eventForm.get('index').setValue(this.eventToEdit.extendedProps.index);
    this.eventForm.get('title').setValue(this.eventToEdit.title);
    this.eventForm.get('start').setValue(this.eventToEdit.start);
    this.eventForm.get('end').setValue(this.eventToEdit.end);
    this.eventForm.get('time').setValue(this.eventToEdit.extendedProps.time);
    this.eventForm.get('time2').setValue(this.eventToEdit.extendedProps.time2);
    this.modalRef = this.modalService.show(modalTemplate);
  }

  public submit() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.valid) {
      this.eventForm.get('start').setValue(moment(this.eventForm.get('start').value));
      this.eventForm.get('end').setValue(moment(this.eventForm.get('end').value));
      this.eventForm.get('time').setValue(moment(this.eventForm.get('time').value));
      this.eventForm.get('time2').setValue(moment(this.eventForm.get('time2').value));

      if (this.eventToEdit != null) {
        const index = this.getIndexToEdit();
        if (index !== null) {
          this.events[index] = this.eventForm.value;
        }
      } else {
        this.eventForm.get('index').setValue(this.events.length);
        this.events.push(this.eventForm.value);
      }

      this.eventForm.reset();
      this.eventsArrayToCalenderEvents();
      this.modalRef.hide();
    }
  }

}
