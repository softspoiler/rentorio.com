import { WishComponent } from './component/wish/wish.component';
import { UnlockPasswordComponent } from './component/account/unlock.password/unlock.password.component';
import { AuthGuard } from 'app/service/authGuard';
import { NotificationComponent } from './component/notification/notification.component';
import { FavoriteComponent } from './component/search/favorite/favorite.component';
import { StartPageComponent } from './component/start.page/start.page.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { UnsupportedBrowser } from './component/unsupported.browser/unsupported.browser.component';
import { LoginComponent } from './component/login/login.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { TermsComponent } from './component/terms/terms.component';
import { ActivateAccountComponent } from './component/account/activate.account/activate.account.component';
import { RecoveryPasswordComponent } from './component/account/recovery.password/recovery.password.component';
import { FaqComponent } from './component/faq/faq.component';
import { AboutComponent } from './component/about/about.component';
// import { CanDeactivateGuard } from './service/can.deactivate.guard.service';
import { CanLoadGuard } from 'app/service/canLoadGuard';
import { PolicyComponent } from 'app/component/policy/policy.component';
import { CancelAccountComponent } from 'app/component/account/cancel.account/cancel.account.component';
import { EmailConfirmComponent } from 'app/component/account/email.confirm/email.confirm.component';
import { WishlistComponent } from './component/wishlist/wishlist.component';
import { TenantsComponent } from './component/tenants/tenants.component';

const routes: Routes = [

    { path: 'home', canActivate: [AuthGuard], loadChildren: './home.module/home.module#HomeModule' },
    { path: 'unsupportedbrowser', component: UnsupportedBrowser },
    { path: 'login', canActivate: [AuthGuard], component: LoginComponent },
    { path: 'registration', canActivate: [AuthGuard], component: RegistrationComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'policy', component: PolicyComponent },
    { path: 'about', component: AboutComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'search', loadChildren: './search.module/search.module#SearchModule' },
    { path: 'favorite', component: FavoriteComponent, canActivate: [AuthGuard] },
    { path: 'notifications', component: NotificationComponent },
    { path: 'wish', component: WishComponent },
    { path: 'wishlist', component: WishlistComponent },
    { path: 'tenants', component: TenantsComponent },
    { path: 'console', loadChildren: './admin.console/admin.module#AdminModule', canLoad: [CanLoadGuard] },
    { path: '', component: StartPageComponent },
    {
        path: 'account', children: [
            { path: 'activate', component: ActivateAccountComponent },
            { path: 'email/confirm', component: EmailConfirmComponent },
            { path: 'password/recovery', component: RecoveryPasswordComponent },
            { path: 'password/unlock', component: UnlockPasswordComponent },
            { path: 'cancel', component: CancelAccountComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });