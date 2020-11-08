import {NgModule} from '@angular/core';

import {DashboardComponent} from './dashboard.component';
import {DashboardRouting} from './dashboard.routing';

@NgModule({
  imports: [
    DashboardRouting,
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {
}
