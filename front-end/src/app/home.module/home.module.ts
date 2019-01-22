import { GalleriaModule } from 'primeng/primeng';
import { Uploader } from 'angular2-http-file-upload';
import { ImageUploadService } from './../service/image.upload.service';
import { DndModule } from 'ngx-dnd';
import { AppSharedModule } from './../app.shared.module';
import { HomeSharedModule } from 'app/home.module/home.shared.module';
import { ProfileUnconfirmComponent } from './../component/home/profile/unconfirm/profile.unconfirm.component';
import { EstateListComponent } from './../component/home/estate/list/estate.list.component';
import { EstatePricesComponent } from './../component/home/estate/prices/estate.prices.component';
import { EstateSafetyComponent } from './../component/home/estate/safety/estate.safety.component';
import { EstatePhotoComponent } from './../component/home/estate/photo/estate.photo.component';
import { EstateAmenityComponent } from './../component/home/estate/amenity/estate.amenity.component';
import { EstateLocationComponent } from './../component/home/estate/location/estate.location.component';
import { EstateDescriptionComponent } from './../component/home/estate/description/estate.description.component';
import { EstateGeneralComponent } from './../component/home/estate/general/estate.general.component';
import { EstateNavigationComponent } from './../component/home/estate/navigation/estate.navigation.component';
import { AccountSettingsComponent } from './../component/home/account/settings/account.settings.component';
import { AccountSecurityComponent } from './../component/home/account/security/account.security.component';
import { AccountNavigationComponent } from './../component/home/account/navigation/account.navigation.component';
import { ViewProfileComponent } from './../component/home/view.profile/view.profile.component';
import { ProfileVerificationComponent } from './../component/home/profile/verification/profile.verification.component';
import { ProfilePhotoComponent } from './../component/home/profile/photo/profile.photo.component';
import { ProfileEditComponent } from './../component/home/profile/edit/profile.edit.component';
import { ProfileNavigationComponent } from './../component/home/profile/navigation/profile.navigation.component';
import { HomeNavigationComponent } from './../component/home/navigation/home.navigation.component';
import { DashboardComponent } from './../component/home/dashboard/dashboard.component';
import { MessagesComponent } from './../component/home/messages/messages.component';
import { AccountService } from './../service/account.service';
import { NgModule } from '@angular/core';
import { routing } from './home.routing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CallRecordService } from 'app/service/call.record.service';

@NgModule({
  imports: [
    CommonModule,
    routing,
    ReactiveFormsModule,
    FormsModule,
    AppSharedModule,
    HomeSharedModule,
    DndModule.forRoot(),
    GalleriaModule,
  ],
  declarations: [
    HomeNavigationComponent,
    DashboardComponent,
    ProfileNavigationComponent,
    ProfileEditComponent,
    AccountNavigationComponent,
    AccountSecurityComponent,
    AccountSettingsComponent,
    ProfilePhotoComponent,
    ProfileVerificationComponent,
    ProfileUnconfirmComponent,
    EstateNavigationComponent,
    EstateGeneralComponent,
    EstateDescriptionComponent,
    EstateLocationComponent,
    EstateAmenityComponent,
    EstateSafetyComponent,
    EstatePricesComponent,
    EstateListComponent,
    EstatePhotoComponent,
    MessagesComponent,
    ViewProfileComponent
  ],
  providers: [
    AccountService,
    Uploader,
    ImageUploadService,
    CallRecordService
  ]
})
export class HomeModule { }

