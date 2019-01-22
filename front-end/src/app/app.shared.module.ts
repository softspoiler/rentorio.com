import { NewEstatePopupUk } from './component/home/estate/newEstatePopup/new.estate.popup.uk.component';
import { NewEstatePopupRu } from './component/home/estate/newEstatePopup/new.estate.popup.ru.component';
import { EstatePreviewComponent } from './component/home/estate/preview/estate.preview.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { ComplaintService } from './service/complaint.service';
import { LoadingComponent } from './component/home/shared/loading/loading.component';
import { UnsupportedBrowser } from './component/unsupported.browser/unsupported.browser.component';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AlertComponent } from 'app/component/home/shared/alert/alert.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { ComplaintComponent } from 'app/component/complaint/complaint.component';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from 'app/component/notification/notification.component';

@NgModule({
    declarations: [
        AlertComponent,
        UnsupportedBrowser,
        LoadingComponent,
        ComplaintComponent,
        EstatePreviewComponent,
        NotificationComponent,
        NewEstatePopupRu,
        NewEstatePopupUk
    ],
    exports: [
        AlertComponent,
        AgmCoreModule,
        UnsupportedBrowser,
        LoadingComponent,
        ComplaintComponent,
        NgxGalleryModule,
        EstatePreviewComponent,
        TranslateModule,
        NotificationComponent,
        NewEstatePopupRu,
        NewEstatePopupUk
    ],
    imports: [
        RouterModule,
        CommonModule,
        TranslateModule,
        // TODO update Agm package, to avoid error: "You have included the Google Maps API multiple times on this page" 
        AgmCoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgxGalleryModule,
        
    ]
})
export class AppSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppSharedModule,
            providers: [ComplaintService]
        };
    }
}