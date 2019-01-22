import { DetailsComponent } from './../component/search/details/details.component';
import { MainSearchComponent } from './../component/search/main/main.search.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: '', component: MainSearchComponent },
    { path: 'details/:id', component: DetailsComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);