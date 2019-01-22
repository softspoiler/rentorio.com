import { EstatePreviewComponent } from './../component/home/estate/preview/estate.preview.component';
import { ViewProfileComponent } from './../component/home/view.profile/view.profile.component';
import { EstateListComponent } from './../component/home/estate/list/estate.list.component';
import { EstatePricesComponent } from './../component/home/estate/prices/estate.prices.component';
import { EstateSafetyComponent } from './../component/home/estate/safety/estate.safety.component';
import { EstatePhotoComponent } from './../component/home/estate/photo/estate.photo.component';
import { EstateAmenityComponent } from './../component/home/estate/amenity/estate.amenity.component';
import { EstateLocationComponent } from './../component/home/estate/location/estate.location.component';
import { EstateDescriptionComponent } from './../component/home/estate/description/estate.description.component';
import { EstateGeneralComponent } from './../component/home/estate/general/estate.general.component';
import { CanDeactivateGuard } from './../service/can.deactivate.guard.service';
import { EstateNavigationComponent } from './../component/home/estate/navigation/estate.navigation.component';
import { AccountSettingsComponent } from './../component/home/account/settings/account.settings.component';
import { AccountSecurityComponent } from './../component/home/account/security/account.security.component';
import { AccountNavigationComponent } from './../component/home/account/navigation/account.navigation.component';
import { ProfileVerificationComponent } from './../component/home/profile/verification/profile.verification.component';
import { ProfilePhotoComponent } from './../component/home/profile/photo/profile.photo.component';
import { ProfileEditComponent } from './../component/home/profile/edit/profile.edit.component';
import { ProfileNavigationComponent } from './../component/home/profile/navigation/profile.navigation.component';
import { HomeNavigationComponent } from './../component/home/navigation/home.navigation.component';
import { DashboardComponent } from './../component/home/dashboard/dashboard.component';
import { MessagesComponent } from './../component/home/messages/messages.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '', component: HomeNavigationComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'messages', component: MessagesComponent },
      {
        path: 'profile', component: ProfileNavigationComponent, children: [
          { path: '', redirectTo: 'edit', pathMatch: 'full' },
          { path: 'edit', component: ProfileEditComponent },
          { path: 'photo', component: ProfilePhotoComponent },
          { path: 'trust', component: ProfileVerificationComponent }
        ]
      },
      {
        path: 'account', component: AccountNavigationComponent, children: [
          { path: '', redirectTo: 'security', pathMatch: 'full' },
          { path: 'security', component: AccountSecurityComponent },
          { path: 'settings', component: AccountSettingsComponent }
        ]
      },
      {
        path: 'estate', component: EstateNavigationComponent, canDeactivate: [CanDeactivateGuard], children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' },
          { path: 'general', component: EstateGeneralComponent },
          { path: 'description', component: EstateDescriptionComponent },
          { path: 'location', component: EstateLocationComponent },
          { path: 'amenity', component: EstateAmenityComponent },
          { path: 'photo', component: EstatePhotoComponent },
          { path: 'safety', component: EstateSafetyComponent },
          { path: 'prices', component: EstatePricesComponent }
        ]
      },
      { path: 'estate/list', component: EstateListComponent },
      { path: 'view_profile', component: ViewProfileComponent },
      { path: 'estate/preview', component: EstatePreviewComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);