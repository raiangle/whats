import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {DatatableService} from '../../services';

@Component({
  selector: 'app-ads-management',
  templateUrl: './ads-management.component.html',
  styleUrls: ['./ads-management.component.scss']
})
export class AdsManagementComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective) public dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = {};

  public dtTrigger: Subject<any> = new Subject();

  public managements = [];

  constructor(private _router: Router,
              private _datatableService: DatatableService) {
  }

  ngOnInit() {
    this.getManagements();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  getManagements() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      serverSide: true,
      searchDelay: 1000,
      processing: true,
      language: {
        searchPlaceholder: 'Search...',
        search: ''
      },
      ajax: (dataTablesParameters: any, callback) => {
        this._datatableService.getTableData(dataTablesParameters, 'datatable-ads-management')
          .subscribe(resp => {
            this.managements = resp.data;
            // this.setMarkers();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      order: [],
      columns: [
        {name: 'title'},
        {name: 'image', orderable: false},
        {name: 'description', orderable: false},
        {name: 'id', orderable: false},
      ]
    };
  }

  redirectToEditManagement(adsId) {
    this._router.navigate(['ads', 'ads-management', 'edit', adsId]);
  }
}
