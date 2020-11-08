import {Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {LazyLoadEvent, User} from '../../models/index';
import {UsersService, LoaderService} from './../../services/index';
import {Routes, RouterModule, Router, ActivatedRoute} from '@angular/router';
import {MatPaginator, MatTableDataSource, MatSort, PageEvent, Sort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {Vessel_detailsService} from '../../services/index';

@Component({
  templateUrl: 'vessel-details.component.html',
})
export class VesselDetailsComponent implements OnInit {
  public loading = false;
  dataSource;
  dtInstance: any = {};
  Vessel_id;
  pageEvent: PageEvent;
  sorts: Sort;
  displayedColumns: string[];
  cur_date = moment().format('Y-MM-DD H:mm:ss');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() page: EventEmitter<PageEvent>;
  @Output() sortChange: EventEmitter<Sort>;

  constructor(private loaderService: LoaderService,
              private router: Router,
              public _http: HttpClient,
              public vesselDetailsService: Vessel_detailsService) {
    const AuthUser = JSON.parse(localStorage.getItem('currentUser'));
    this.Vessel_id = AuthUser.id;
    this.dtInstance.columns = 'id';
    this.dtInstance.sortype = 'desc';
    this.dtInstance.pageIndex = 0;
    this.dtInstance.first = 0;
    this.dtInstance.rows = 10;
    this.dtInstance.globalFilter = '';
    this.loadDatas(this.dtInstance);

  }

  ngOnInit() {

  }

  loadDatas(dtInstance) {
    this.loaderService.display(true);
    this.vesselDetailsService.getVesselDetails(dtInstance).subscribe(response => {
      this.dataSource = response.data;
      this.displayedColumns = ['title', 'auction_ends', 'option'];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator.length = response.totalrecords;
      this.dataSource.paginator.pageIndex = this.dtInstance.pageIndex;
      this.dataSource.paginator.pageSize = this.dtInstance.rows;
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  applyFilter(event) {
    this.dtInstance.pageIndex = 0;
    this.dtInstance.first = 0;
    this.dtInstance.globalFilter = event;
    this.loadDatas(this.dtInstance);
  }

  applyPagination(event) {
    this.dtInstance.pageIndex = event.pageIndex;
    this.dtInstance.first = event.pageIndex * event.pageSize;
    this.dtInstance.rows = event.pageSize;
    this.loadDatas(this.dtInstance);
  }

  applySort(event) {
    this.dtInstance.columns = event.active;
    this.dtInstance.sortype = event.direction;
    this.loadDatas(this.dtInstance);
  }

  openDeleteDialog(id) {
    Swal({
      title: 'Are you sure?',
      text: 'Do you want to delete vessel?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteVesselDetail(id);
        Swal(
          'Deleted!',
          'Your Vessel has been deleted.',
          'success'
        );
      }
    });
  }

  deleteVesselDetail(id) {
    this.loaderService.display(true);
    this.vesselDetailsService.deleteVesselDetailsById(id).subscribe(response => {
      this.loadDatas(this.dtInstance);
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  getStatus(event) {
    const currentDate = moment();
    const endDate = moment(event.auction_ends);
    if (endDate >= currentDate && (!event.is_sold)) {
      if (event.comingsoon) {
        return 'Comingsoon';
      }
      return 'Current';
    }  else {
        if (event.is_sold) {
          return 'Sold';
        } else {
          return 'Past';
        }
    }
  }
}
