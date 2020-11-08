import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedCustomModule} from '../../../shared.module';
import {DataTablesModule} from 'angular-datatables';
import {FormElementsModule} from '../../../components/form-elements/form-elements.module';
import {DropzoneModule} from '../../../components/dropzone/dropzone.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {registerPlugin} from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import {ManagementComponent} from './management.component';
import {ManagementFormComponent} from './management-form/management-form.component';

registerPlugin(FilePondPluginFileValidateType);

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Management',
    },
    children: [
      {
        path: '',
        component: ManagementComponent,
        data: {
          title: '',
        }
      },
      {
        path: 'add',
        component: ManagementFormComponent,
        data: {
          title: 'Add',
        }
      },
      {
        path: 'edit/:id',
        component: ManagementFormComponent,
        data: {
          title: 'Edit',
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
  ],
  providers: [],
  declarations: [ManagementComponent, ManagementFormComponent]
})
export class ManagementModule {
}
