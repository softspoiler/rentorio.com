import { AppSharedModule } from './../app.shared.module';
import { SearchInputComponent } from './../component/home/shared/search.input/search.input.component';
import { RouterModule } from '@angular/router';
import { NgxCarouselModule } from 'ngx-carousel';
import { NgxPaginationModule } from 'ngx-pagination';
import { ResultListComponent } from './../component/search/result.list/result.list.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';


@NgModule({
    declarations: [
        ResultListComponent,
        SearchInputComponent
    ],
    exports: [
        ResultListComponent,
        NgxCarouselModule,
        SearchInputComponent,
        AgmSnazzyInfoWindowModule,
        AgmJsMarkerClustererModule
    ],
    imports: [
        CommonModule,
        AppSharedModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NgxCarouselModule,
        RouterModule,
        AgmSnazzyInfoWindowModule,
        AgmJsMarkerClustererModule
    ]
})
export class SearchSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SearchSharedModule,
            providers: []
        };
    }
}