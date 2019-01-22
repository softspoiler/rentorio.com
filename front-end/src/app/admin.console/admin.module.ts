import { CallRecordService } from './../service/call.record.service';
import { NotificationService } from './service/notification.service';
import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { routing } from './admin.routing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstateService } from './service/estate.service';
import { ComplaintService } from './service/complaint.service';
import { MessageService } from './service/message.service';
import { UserService } from './service/user.service';
import { ConsoleComponent } from './component/console/console.component';
import { MessagesComponent } from './component/messages/messages.component';
import { ComplaintComponent } from './component/complaint/complaint.component';
import { EstatesComponent } from './component/estates/estates.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserDetailsComponent } from './component/user.details/user.details.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { NotificationComponent } from './component/notification/notification.component';
import { EditorModule } from 'primeng/primeng';
import { PlayerComponent } from './component/player/player.component';
import { CallsComponent } from './component/calls/calls.component';
import { CallsService } from './service/calls.service';

@NgModule({
  imports: [routing,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgxGalleryModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAi2FJFc10Vz-XYthgeXX6xOk6Rb27VT1M',
      libraries: ['places', 'geocoder']
    }),
    EditorModule
  ],
  declarations: [
    ConsoleComponent,
    MessagesComponent,
    ComplaintComponent,
    EstatesComponent,
    UserDetailsComponent,
    NotificationComponent,
    PlayerComponent,
    CallsComponent
  ],
  providers: [
    MessageService,
    ComplaintService,
    EstateService,
    UserService,
    NotificationService,
    CallRecordService,
    CallsService
  ]
})
export class AdminModule { }

