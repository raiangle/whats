import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdsService, HelperService, LoaderService} from '../../../services';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-ads-form-management',
  templateUrl: './ads-form-management.component.html',
  styleUrls: ['./ads-form-management.component.scss']
})
export class AdsManagementFormComponent implements OnInit {

  public adsManagementForm: FormGroup;
  public eventManagementGalForm: FormGroup;
  public adsDetailForm: FormGroup;

  eventMgtData = null;
  public id;

  public resourceOptions = [
    {name: 'Internal', value: 1},
    {name: 'External', value: 2},
  ];

  public statusOptions = [
    {label: 'Organizer', value: 0},
    {label: 'Event', value: 1},
  ];
  public radioOptions = [
    {label: 'Header', value: 0},
    {label: 'INBODY', value: 1},
    {label: 'FOOTER', value: 2}
  ];

  public events = [];
  public removeEvents = [];

  constructor(private router: Router,
              private _activatedRouter: ActivatedRoute,
              private formBuilder: FormBuilder,
              private _toasterService: ToastrService,
              private adsService: AdsService) {
  }

  ngOnInit() {
    this.adsManagementForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      resource_type: ['', Validators.required],
      internal_id: [''],
      url: [''],
      ad_detail: [''],
      ad_remove_detail: [''],


    });
    this.adsDetailForm = this.formBuilder.group({
      radioType: ['', Validators.required],
      selectCategory: ['', Validators.required],
      dateRange: ['', Validators.required],
      startPosition: [''],
      repeatNumber: ['']
    });

    this.eventManagementGalForm = this.formBuilder.group({
      'id': [null],
      'image_to_add': this.formBuilder.array([]),
      'image_to_remove': this.formBuilder.array([]),
    });
    this.id = +this._activatedRouter.snapshot.params['id'];
    if (this.id) {
      this.getAdsEventManagementId(this.id);
    }
  }

  setBodyValue(radioVal) {
    if (radioVal === 1) {
      this.adsDetailForm.get('startPosition').setValue(0);
      this.adsDetailForm.get('repeatNumber').setValue(0);
    } else {
      this.adsDetailForm.get('startPosition').setValue('');
      this.adsDetailForm.get('repeatNumber').setValue('');
    }
  }

  resourceValidation(eve) {
    if (eve === 1) {
      this.adsManagementForm.get('internal_id').setValidators([Validators.required]);
      this.adsManagementForm.get('url').setValidators(null);
    } else {
      this.adsManagementForm.get('url').setValidators([Validators.required]);
      this.adsManagementForm.get('internal_id').setValidators(null);
    }
    this.adsManagementForm.get('internal_id').updateValueAndValidity();
    this.adsManagementForm.get('url').updateValueAndValidity();

  }


  saveDetails() {
    if (this.adsDetailForm.valid) {
      let isDuplicate = false;
      if (this.events.length > 0) {
        const eventToCheck = this.adsDetailForm.value;
        for (let i = 0; i < this.events.length; i++) {
          const event = this.events[i];
          if (event.selectCategory === eventToCheck.selectCategory && event.radioType === eventToCheck.radioType) {
            isDuplicate = true;
            break;
          }
        }
      }
      if (!isDuplicate) {
        this.events.push(this.adsDetailForm.value);
      }
      this.resetDetails();
    }
  }

  resetDetails() {
    this.adsDetailForm.reset();
  }

  removeDetails(index: number, eventToDelete) {
    this.events.splice(index, 1);
    this.removeEvents.push({
      id: eventToDelete
    });
  }


  getAdsEventManagementId(id) {
    this.adsService.getAdsManagementById(id).subscribe(response => {
      this.eventMgtData = response['data'];
      // tslint:disable-next-line:forin
      for (const field in this.adsManagementForm.controls) {
        this.adsManagementForm.get(field).setValue(this.eventMgtData[field]);
      }
      this.setDetailsManagement(response.data.details);
    }, error => {
    });
  }

  setDetailsManagement(details) {
    this.events = [];
    for (let i = 0; i < details.length; i++) {
      const eventItem = details[i];
      this.events.push({
        id: eventItem.id,
        dateRange: [moment(eventItem.start_date), moment(eventItem.end_date)],
        startPosition: eventItem.start_position,
        radioType: eventItem.type,
        repeatNumber: eventItem.repetition,
        selectCategory: eventItem.category
      });
    }
  }

  cancel() {
    this.router.navigate(['ads', 'ads-management']);
  }

  adsManagement() {
    this.adsManagementForm.markAllAsTouched();
    if (this.adsManagementForm.valid) {


      if (this.events.length > 0) {
        this.adsManagementForm.get('ad_detail').setValue(this.events);
      } else {
        this.adsDetailForm.markAllAsTouched();
        return false;
      }
      if (this.removeEvents.length > 0) {
        this.adsManagementForm.get('ad_remove_detail').setValue(this.removeEvents);
      }
      const valuesToSave = Object.assign({}, this.adsManagementForm.value);
      valuesToSave.resource_type = valuesToSave.resource_type + '';

      const postValues = HelperService.createFormData(valuesToSave);
      LoaderService.show();
      if (this.id) {
        this.adsService.updateManagement(this.id, postValues)
          .subscribe((response) => {
            LoaderService.hide();
            this.eventManagementGalForm.get('id').setValue(this.id);
            const formGalleryData = HelperService.createFormData(this.eventManagementGalForm.getRawValue());
            LoaderService.hide();
            this._toasterService.success('Ads Management Updated', 'Success');
            this.cancel();
          }, (e) => {
            LoaderService.hide();
            this.setServeErrors(e.error);
            this._toasterService.error('Ads Management Update Failed', 'Failed');
          });
      } else {
        this.adsService.saveAdsManagement(postValues).subscribe(response => {
          LoaderService.hide();
          if (response['status'] === 'success') {
            this._toasterService.success('Ads Management Updated', 'Success');
            this.cancel();
          }
        });
      }
    }
  }

  setServeErrors(errorResponse) {
    for (const controlKey of Object.keys(errorResponse.errors)) {
      this.adsManagementForm.get(controlKey).setErrors({serverErrors: errorResponse.errors[controlKey]});
    }
  }

  getFormattedDate(dates) {
    const start = moment(dates[0]);
    const end = moment(dates[1]);
    return start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
  }
}

