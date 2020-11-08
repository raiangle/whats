import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedCustomModule} from '../../shared.module';
import {DataTablesModule} from 'angular-datatables';
import {DropzoneModule} from '../../components/dropzone/dropzone.module';
import {FormElementsModule} from '../../components/form-elements/form-elements.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {AdsManagementComponent} from './ads-management.component';
import {AdsManagementFormComponent} from './ads-management-form/ads-form-management.component';
import {AdsReorderComponent} from './ads-reorder/ads-reorder.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Management',
    },
    children: [
      {
        path: '',
        component: AdsManagementComponent,
        data: {
          title: '',
        }
      },
      {
        path: 'add',
        component: AdsManagementFormComponent,
        data: {
          title: 'Add',
        }
      },
      {
        path: 'edit/:id',
        component: AdsManagementFormComponent,
        data: {
          title: 'Edit',
        }
      },
      {
        path: 'reorder',
        component: AdsReorderComponent,
        data: {
          title: 'Reorder',
        }
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedCustomModule,
    DataTablesModule,
    DropzoneModule,
    FormElementsModule,
    NgSelectModule,
    DragDropModule,
  ],
  providers: [],
  declarations: [AdsManagementComponent, AdsManagementFormComponent, AdsReorderComponent]
})

export class AdsManagementModule {

}
