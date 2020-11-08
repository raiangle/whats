import {INavData} from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },
  {
    name: 'Event Management',
    url: 'event',
    icon: 'fas fa-city',
    children: [
      {
        name: 'Event List',
        url: '/event/management',
      },
    ]
  },
  {
    name: 'Ads Management',
    url: 'ads',
    icon: 'fas fa-city',
    children: [
      {
        name: ' Ads ',
        url: '/ads/ads-management'
      },
      {
        name: 'Manage Ads',
        url: '/ads/ads-management/reorder'
      }
    ]
  },
  {
    name: 'Content Management',
    url: 'about',
    icon: 'fas fa-city',
    children: [
      {
        name: 'Static Pages',
        url: 'about',
        children: [
          {
            name: 'About Us',
            url: '/about',
          }
        ]
      },
    ]
  },
  {
    name: 'Administration',
    url: 'admin',
    icon: 'fas fa-city',
    children: [
      {
        name: 'Members',
        url: '/user',
      },
      {
        name: 'System Categories',
        url: '/category',
      },
      {
        name: 'Organizer List',
        url: '/organizer',
      },
      {
        name: 'Country',
        url: '/country',
      },
      {
        name: 'Push',
        url: '/send/notification',
      },
      {
        name: 'Areas',
        url: '/area',
      },
      {
        name: 'Reorder Categories',
        url: '/category/reorder',
      },
      {
        name: 'Add Trending',
        url: '/category/add_trending',
      },
    ]
  },
];
