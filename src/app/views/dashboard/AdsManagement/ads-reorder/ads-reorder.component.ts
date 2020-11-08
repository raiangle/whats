import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ToastrService} from 'ngx-toastr';
import {AdsService, DatatableService, LoaderService} from '../../../services';

@Component({
  templateUrl: 'ads-reorder.component.html',
  styleUrls: ['ads-reorder.component.scss']
})
export class AdsReorderComponent implements OnInit {

  public categories = [];

  constructor(private _router: Router,
              private adsService: AdsService,
              private _toasterService: ToastrService,
              private _datatableService: DatatableService) {
  }

  ngOnInit() {
    this.getAds();
  }

  getAds() {
    LoaderService.show();
    this.adsService.getAllAds().subscribe(response => {
      LoaderService.hide();
      this.categories = response['data'];
    }, error => {
      LoaderService.hide();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }
  saveCatOrder() {
    LoaderService.show();
    this.adsService.saveAdsOrder(this.categories).subscribe(response => {
      LoaderService.hide();
      this._toasterService.success('Reorder Succeessfully', 'Success');
    }, error => {
      this._toasterService.error('Reorder Failed', 'Failed');
      LoaderService.hide();
    });
  }

}
