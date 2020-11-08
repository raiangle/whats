import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DefaultLayoutComponent} from './containers/default-layout';
import {SimpleLayoutComponent} from './containers/simple-layout';
import {AuthGuard} from './guards';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'event/management',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/event/event-management/management.module').then(m => m.ManagementModule)
      },
      {
        path: 'ads/ads-management',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/AdsManagement/ads-management.module').then(m => m.AdsManagementModule)
      },
      {
        path: 'area',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/administration/area/area.module').then(m => m.AreaModule)
      },
      {
        path: 'country',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/administration/country/country.module').then(m => m.CountryModule)
      },
      {
        path: 'about',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/content-management/static-pages/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'category',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/administration/category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/administration/users/user.module').then(m => m.UserModule)
      },
      {
        path: 'send/notification',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/administration/notification/notification.module').then(m => m.NotificationModule)
      },
      {
        path: 'organizer',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/administration/organizer/organizer.module').then(m => m.OrganizerModule)
      }
    ]
  },
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '404',
    component: SimpleLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/error/404.module').then(m => m.P404Module)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
