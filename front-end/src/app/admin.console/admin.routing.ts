import { NotificationComponent } from './component/notification/notification.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsoleComponent } from './component/console/console.component';
import { MessagesComponent } from './component/messages/messages.component';
import { ComplaintComponent } from './component/complaint/complaint.component';
import { EstatesComponent } from './component/estates/estates.component';
import { CallsComponent } from './component/calls/calls.component';

const routes: Routes = [
  {
    path: '',
    component: ConsoleComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: 'messages', component: MessagesComponent },
      { path: 'complaint', component: ComplaintComponent },
      { path: 'estates', component: EstatesComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'calls', component: CallsComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);