import { ClickOutsideModule } from 'ng-click-outside';

import { MainSearchComponent } from './../component/search/main/main.search.component';
import { SearchResultComponent } from './../component/search/search.result/search.result.component';
import { DetailsComponent } from './../component/search/details/details.component';
import { AppSharedModule } from './../app.shared.module';
import { NgModule } from '@angular/core';
import { routing } from './search.routing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchSharedModule } from 'app/search.module/search.shared.module';

@NgModule({
    imports: [
        routing,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SearchSharedModule,
        AppSharedModule,
        ClickOutsideModule
    ],
    declarations: [
        MainSearchComponent,
        SearchResultComponent,
        DetailsComponent
    ],
    providers: []
})
export class SearchModule { }

