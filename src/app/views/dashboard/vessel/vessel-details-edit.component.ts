import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DropzoneComponent, DropzoneDirective} from 'ngx-dropzone-wrapper';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '../../constants/app.constants';
import {CurrencyService, LoaderService, OptionService, RoleService} from './../../services/index';
import {FileUploadService, Vessel_detailsService} from '../../services/index';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as moment from 'moment';

@Component({
  styleUrls: ['vessel-details.component.scss'],
  templateUrl: 'vessel-details-edit.component.html',
})
export class VesselDetailsEditComponent implements OnInit {
  @ViewChild(DropzoneComponent) componentRef: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;
  @ViewChild('dropzonePicture') dropzonePicture: DropzoneComponent;
  @ViewChild('dropzoneGallery') dropzoneGallery: DropzoneComponent;

  vesselForm: FormGroup;
  vesselFormErrors: any;
  errors = '';
  vessel: any = {};
  vessel_gallery = [];
  additional_file_uploads = [];
  vessel_additional_fields = [];
  roles = [];
  user_status = [];
  action;
  dtInstance: any = {};
  cancleUser;
  img_name = '';
  timeout;
  sub;
  FILE_URL;
  IMAGE_URL;
  IMAGE_THUMB_URL;
  dropzone: any;
  file: {};
  emailAlready = false;
  usernameAlready = false;
  wysiwygConfig;
  emailPattern = '^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,3})+$';

  filesArr: any = [];
  docArr: any = [];
  oldDocArr: any = [];

  files: File[] = [];
  private id;
  currentCheckedValue = null;

  sold_amt = false;

  bid_agreement_bool = false;
  opening_bid_bool = false;
  bid_work_bool = false;
  bid_reg_bool = false;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    public _http: HttpClient,
    public vesselDetailsService: Vessel_detailsService,
    public fileUploadService: FileUploadService,
    public roleService: RoleService,
    public optionService: OptionService,
    public currencyService: CurrencyService,
    private ren: Renderer2
  ) {
    this.FILE_URL = AppConstants.FILE_URL;
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.IMAGE_THUMB_URL = AppConstants.IMAGE_THUMB_URL;
    this.vesselFormErrors = {
      title: {},
      auction_start_price: {}
    };
    this.wysiwygConfig = {
      toolbar: [
        ['misc', ['codeview', 'undo', 'redo']],
        ['style', ['bold', 'italic', 'underline']],
        ['font', ['strikethrough', 'superscript', 'subscript', 'clear']],
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
        ['insert', ['picture', 'link', 'hr', 'video']]
      ],
      fontSizes: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '24', '36']
    };
  }

  ngOnInit() {

    this.initForm();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    if (this.id) {
      this.loaderService.display(true);
      this.action = 'Edit';
      this.getVesselDetailById();
    } else {
      this.loaderService.display(true);
      this.getCurrency();
      this.action = 'Add';
      this.vessel.is_opening_bid_incentive_url = true;
      this.vessel.is_bidding_work_url = true;

      this.vessel.how_bidding_work_url = 'https://boathouseauctions.com/storage/public/Uploads/pdf_files/EnZGiIdNkgsbr5RGe54kYiqGL.pdf ';
      this.vessel.opening_bid_incentive_url = 'https://boathouseauctions.com/storage/public/Uploads/pdf_files/EnZGiIdNkgsbr5RGe54kYiqGL.pdf ';
      this.loaderService.display(false);
    }
  }


  initForm = () => {
    this.vesselForm = this.formBuilder.group({
      feature_image: [''],
      title: ['', Validators.required],
      description: [''],
      location: [''],
      year: [''],
      make: [''],
      model: [''],
      loa: [''],
      beam: [''],
      draft: [''],
      co_brokerage: [''],
      broker_name: [''],
      broker_email: [''],
      broker_cell: [''],
      preview_period: [''],
      haul_out: [''],
      sea_trial: [''],
      auction_feature: [''],
      auction_address: [''],
      auction_start_price: ['', Validators.required],
      auction_reserve_price: [''],
      auction_buy_now_price: [''],
      auction_quantity: [''],
      auction_begins: [''],
      auction_ends: [''],
      incremental_bid: ['', Validators.required],
      buyer_document_agreement: [''],
      bidders_agreement: [''],
      opening_bid_incentive: [''],
      allow_opening_bid_incentive: [''],
      allowed_comment: [''],
      show_on_homepage: [''],
      show_on_preview: [''],
      auction_images: [''],
      deposit_amount: ['', Validators.required],
      sold_amount: [''],
      check_vessel: [''],
      currency_id: [''],
      buyers_permium: [''],
      section_title: [''],
      preview_date: [''],
      buyer_premium_tooltip: [''],
      opening_bid_rebate_tooltip: [''],
      opening_bid_rebate: [''],
      how_bidding_work: [''],
      how_reg_to_bid: [''],
      is_bidders_agreement_url: [''],
      bidders_agreement_url: [''],
      opening_bid_incentive_url: [''],
      is_opening_bid_incentive_url: [''],
      is_bidding_work_url: [''],
      how_bidding_work_url: [''],
      is_bidding_reg_url: [''],
      how_reg_to_bid_url: [''],
      is_sale_pending: [''],
      available_for_offer: [''],
      escrow_pdf: [''],
      vessel_additional_fields: this.formBuilder.array([])
    });
  }

  getCurrency() {
    this.currencyService.getCurrencyData().subscribe(response => {
      this.vessel.currency = response;
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
      this.errors = error;
    });
  }

  getVesselDetailById() {
    this.vesselDetailsService.getVesselDetailsById(this.id).subscribe(response => {
      this.vessel = response;

      if (this.vessel.feature_image) {
        this.previewThumbailFromUrl(this.vessel.feature_image);
      }
      if (this.vessel.galleryimages) {
        this.previewThumbailFromUrlGallery(this.vessel.galleryimages);
      }

      if (this.vessel.auction_begins) {
        // this.vessel.auction_begins = new Date(this.vessel.auction_begins.replace(/\s/, 'T'));
        this.vessel.auction_begins = moment(this.vessel.auction_begins).toDate();
      }
      if (this.vessel.auction_ends) {
        // this.vessel.auction_ends = new Date(this.vessel.auction_ends.replace(/\s/, 'T'));
        this.vessel.auction_ends = moment(this.vessel.auction_ends).toDate();
      }

      if (this.vessel.is_bidders_agreement_url) {
        this.vessel.is_bidders_agreement_url = true;
      }
      if (this.vessel.is_opening_bid_incentive_url) {
        this.vessel.is_opening_bid_incentive_url = true;
      }
      if (this.vessel.is_bidding_work_url) {
        this.vessel.is_bidding_work_url = true;
      }
      if (this.vessel.is_bidding_reg_url) {
        this.vessel.is_bidding_reg_url = true;
      }
      if (this.vessel.additional_fields) {
        this.vessel.vessel_additional_fields = this.vessel.additional_fields;
        this.vessel.additional_fields.forEach((element, index) => {
          setTimeout(() => {
            this.addAdditionalFields();
          }, 20);
          setTimeout(() => {
            this.vesselForm.get('vessel_additional_fields')['controls'][index].get('id').setValue(element.id);
            this.vesselForm.get('vessel_additional_fields')['controls'][index].get('title').setValue(element.title);
            this.vesselForm.get('vessel_additional_fields')['controls'][index].get('field_filename').setValue(element.field_filename);
          }, 20);
        });
      }
      if (this.vessel.is_sold) {
        this.vessel.check_vessel = 1;
      } else if (this.vessel.comingsoon) {
        this.vessel.check_vessel = 2;
        this.setClickCominsoonValidatorFalse(false, 2);
      } else {
        this.vessel.check_vessel = '';
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  cancel() {
    this.router.navigate(['/vessel_details']);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  createAdditionalFields(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      upload_file: [''],
      field_filename: [''],
    });

  }

  removeAdditionalFields(i: number, machine_id): void {
    const control = <FormArray>this.vesselForm.controls['vessel_additional_fields'];
    // this.vessel['vessel_additional_fields'].splice(i, 1);
    control.removeAt(i);
    //
    // if (machine_id) {
    //   this.deleteAdditionalFields(machine_id);
    // }
  }

  addAdditionalFields(): void {
    const control = <FormArray>this.vesselForm.controls['vessel_additional_fields'];
    control.push(this.createAdditionalFields());

  }

  RemoveFile(listid) {
    this.vesselForm.controls.vessel_additional_fields.value.forEach((element, key) => {
      if (listid == key) {
        element.field_filename = '';
        this.vesselForm.get('vessel_additional_fields')['controls'][key].get('field_filename').setValue('');
      }
    });
  }

  removeFileInfividual(url_name) {
    this.vesselForm.get(url_name).setValue('');
    this.vessel[url_name] = '';
  }

  deleteAdditionalFields(id) {
    // this.loaderService.display(true);
    // this.plant_listsService.deletePlant_machine(id).subscribe(response => {
    //     this.loaderService.display(false);
    // }, error => {
    //     this.loaderService.display(false);
    // });
  }

  previewThumbailFromUrl(feature_image) {
    const dz = this.dropzonePicture.directiveRef.dropzone();
    const thumb = {
      name: feature_image,
      size: 0,
      dataURL: this.IMAGE_URL + feature_image,
      serverImgUrl: this.IMAGE_URL + feature_image
    };
    dz.files.push(thumb);
    dz.emit('addedfile', thumb);
    dz.createThumbnailFromUrl(thumb,
      dz.options.thumbnailWidth, dz.options.thumbnailHeight,
      dz.options.thumbnailMethod, true, function (thumbnail) {
        dz.emit('thumbnail', thumb, thumbnail);
      }, 'anonymous');
    dz.emit('complete', thumb);
    dz.options.maxFiles = 2;
  }

  previewThumbailFromUrlGallery(gallery_images) {

    const dz = this.dropzoneGallery.directiveRef.dropzone();

    this.vessel_gallery = [];

    dz.files.forEach((file) => {
      dz.removeFile(file);
    });

    gallery_images.forEach(element => {
      // if (!this.vessel_gallery.includes(element['image_name'])) {
      this.vessel_gallery.push(element['image_name']);
      // }
      // console.log(this.vessel_gallery);
      const thumb = {
        name: element['image_name'],
        size: 0,
        dataURL: this.IMAGE_THUMB_URL + element['image_name'],
        serverImgUrl: this.IMAGE_THUMB_URL + element['image_name'],
        serverId: element['id']
      };
      dz.files.push(thumb);
      dz.emit('addedfile', thumb);
      dz.createThumbnailFromUrl(thumb,
        dz.options.thumbnailWidth, dz.options.thumbnailHeight,
        dz.options.thumbnailMethod, true, function (thumbnail) {
          dz.emit('thumbnail', thumb, thumbnail);
        }, 'anonymous');
      dz.emit('complete', thumb);
    });
    // dz.options.maxFiles = dz.options.maxFiles - 1;
  }

  emptyFormArray = () => {
    const addControls = <FormArray>this.vesselForm.get('vessel_additional_fields');
    while (addControls.length > 0) {
      addControls.removeAt(0);
    }
  };

  detectFiles(files: FileList, listid) {
    const fileToUpload = files.item(0);
    this.loaderService.display(true);
    this.fileUploadService.postFile(fileToUpload).subscribe(response => {
      this.vesselForm.controls.vessel_additional_fields.value.forEach((element, key) => {
        if (listid == key) {
          element.field_filename = response['filename'];
        }
      });
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
      this.errors = error;
    });

  }

  detectFilesIndividual(files: FileList, url_name) {
    const fileToUpload = files.item(0);
    this.loaderService.display(true);
    this.fileUploadService.postFile(fileToUpload).subscribe(response => {
      this.loaderService.display(false);
      this.vessel[url_name] = response['filename'];
      // this.vesselForm.get(url_name).setValue(response['filename']);
    }, error => {
      this.loaderService.display(false);
      this.errors = error;
    });

  }

  SaveVesselDetails() {

    if (this.vesselForm.invalid) {
      this.vesselForm.markAsTouched();
    } else {
      this.vessel.auction_begins = moment(this.vessel.auction_begins).format('YYYY-MM-DD HH:mm:ss');
      this.vessel.auction_ends = moment(this.vessel.auction_ends).format('YYYY-MM-DD HH:mm:ss');

      this.vessel['galllery_images'] = this.vessel_gallery;
      this.vessel['vessel_additional_fields'] = this.vesselForm.controls.vessel_additional_fields.value;


      if (!this.vessel.is_opening_bid_incentive_url) {

        this.vessel.opening_bid_incentive_url = '';
      }
      if (!this.vessel.is_bidding_work_url) {
        this.vessel.how_bidding_work_url = '';
      }
      if (this.vessel.check_vessel == '1') {
        this.vessel.is_sold = 1;
        this.vessel.comingsoon = 0;
      } else if (this.vessel.check_vessel == '2') {
        this.vessel.comingsoon = 1;
        this.vessel.is_sold = 0;
        this.vessel.sold_amount = '';
      } else {
        this.vessel.comingsoon = 0;
        this.vessel.is_sold = 0;
        this.vessel.sold_amount = '';
      }

      this.loaderService.display(true);
      this.vesselDetailsService.saveVesselDetails(this.vessel).subscribe(response => {
        if (this.id) {
          this.vessel = {};
          this.emptyFormArray();
          this.getVesselDetailById();
        } else {
          this.router.navigate(['../edit/' + response['id']], {relativeTo: this.route});
        }
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
        this.errors = error;
      });
    }
  }

  onFormValuesChanged() {
    for (const field in this.vesselFormErrors) {
      if (!this.vesselFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.vesselFormErrors[field] = {};

      // Get the control
      const control = this.vesselForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.vesselFormErrors[field] = control.errors;
      }
    }
  }

  onUploadSuccess($event) {
    //        console.log($event);
    this.img_name = $event[1]['filename'];
    this.vessel['feature_image'] = this.img_name;
  }

  onUploadError($event) {
    // console.log($event);
  }

  onUploadadd($event) {
    // console.log($event);
  }

  onUploadRemoved($event) {
    //    console.log($event);
  }

  onUploadSuccessGalllery($event) {
    //        console.log($event);
    this.img_name = $event[1]['filename'];
    this.vessel_gallery.push(this.img_name);
  }

  onUploadErrorGalllery($event) {
    // console.log($event);
  }

  onUploadaddGalllery($event) {
    // console.log($event);
  }

  onUploadRemovedGalllery($event) {

    if ($event.serverId) {
      for (let i = 0; i < this.vessel_gallery.length; i++) {
        if (this.vessel_gallery[i] === $event.name) {
          this.vessel_gallery.splice(i, 1);
        }
      }
    } else {
      const server_filname = JSON.parse($event.xhr.response);
      for (let i = 0; i < this.vessel_gallery.length; i++) {
        if (this.vessel_gallery[i] === server_filname.filename) {
          this.vessel_gallery.splice(i, 1);
        }
      }
    }
  }

  public dropped = (event: CdkDragDrop<string[]>) => {
    moveItemInArray(
      this.files,
      event.previousIndex,
      event.currentIndex
    );

  };
  public onSelect = (event) => {

    this.files.push(...event.addedFiles);
  };
  public onRemove = (event) => {

    this.files.splice(this.files.indexOf(event), 1);
  };

  checkState = el => {

    this.setClickCominsoonValidatorFalse(el.checked, el.value);
    if (el.checked) {
      requestAnimationFrame(() => {
        el.checked = false;
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-program-focused');
        this.vessel.check_vessel = null;

      });
    }

  };

  setClickCominsoonValidatorFalse(checkedValue, valueField) {
    if (checkedValue == false && valueField == 2) {
      this.vesselForm.get('auction_start_price').clearValidators();
      this.vesselForm.get('incremental_bid').clearValidators();
      this.vesselForm.get('deposit_amount').clearValidators();

    } else {
      this.vesselForm.get('auction_start_price').setValidators([Validators.required]);
      this.vesselForm.get('incremental_bid').setValidators([Validators.required]);
      this.vesselForm.get('deposit_amount').setValidators([Validators.required]);
    }
    this.vesselForm.get('auction_start_price').updateValueAndValidity();
    this.vesselForm.get('incremental_bid').updateValueAndValidity();
    this.vesselForm.get('deposit_amount').updateValueAndValidity();
  }

  // checkUrl(event, url_name) {
  //     if (url_name === 'bidders_agreement' && event.checked) {
  //         this.bid_agreement_bool = true;
  //     } else {
  //         this.bid_agreement_bool = false;
  //     }
  //
  //     if (url_name === 'opening_bid_incentive' && event.checked) {
  //         this.opening_bid_bool = true;
  //     } else {
  //         this.opening_bid_bool = false;
  //     }
  //
  //     if (url_name === 'how_bidding_work' && event.checked) {
  //         this.bid_work_bool = true;
  //     } else {
  //         this.bid_work_bool = false;
  //     }
  //
  //     if (url_name === 'how_reg_to_bid' && event.checked) {
  //         this.bid_reg_bool = true;
  //     } else {
  //         this.bid_reg_bool = false;
  //     }
  // }
}

