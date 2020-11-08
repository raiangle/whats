import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {LocationStrategy, PathLocationStrategy, DatePipe} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {DefaultLayoutComponent, SimpleLayoutComponent} from './containers';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

// services

import {
  AboutService,
  AdsService,
  NotificationService,
  AreaService,
  CountryService,
  AuthenticationService,
  CategoryService,
  DatatableService,
  LoaderService,
  ManagementService, OrganizerService, UserService
} from './services';

import {AuthGuard, TokenInterceptor} from './guards';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';
import {ToastrModule} from 'ngx-toastr';
import {ErrorInterceptor} from './guards/errror-interceptor';


const APP_CONTAINERS = [
  DefaultLayoutComponent,
  SimpleLayoutComponent
];

const APP_SERVICES = [
  LoaderService,
  AuthenticationService,
  DatatableService,
  AreaService,
  CountryService,
  CategoryService,
  ManagementService,
  AdsService,
  NotificationService,
  AboutService,
  UserService,
  OrganizerService
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    BsDropdownModule.forRoot(),
    HttpClientModule,
    PerfectScrollbarModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
    }),
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
  ],
  providers: [
    AuthGuard,
    ...APP_SERVICES,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
