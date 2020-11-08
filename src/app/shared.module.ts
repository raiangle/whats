import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// import {BsDatepickerModule, ModalModule, TimepickerModule} from 'ngx-bootstrap';
import {AgmCoreModule} from '@agm/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    FullCalendarModule,
    TimepickerModule.forRoot(),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw',
      apiKey: 'AIzaSyClURN7KC8BMNjLzEHm3T5_xO9C6BiZjMM',
      // apiKey: 'AIzaSyAQXMUzx4_3TnrQkPZGi7vwYNTvHny30Yw',
      libraries: ['places']
    }),
    BsDatepickerModule.forRoot()
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    AgmCoreModule,
    FullCalendarModule,
    TimepickerModule,
    BsDatepickerModule
  ]
})
export class SharedCustomModule {
}
