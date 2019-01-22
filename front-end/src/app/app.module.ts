import { TenantsComponent } from './component/tenants/tenants.component';
import { Constants } from './service/constants';
import { CanLoadGuard } from './service/canLoadGuard';
import { ResetPasswordService } from './service/reset.password.service';
import { RegistrationService } from './service/registration.service';
import { RestangularModule } from 'ngx-restangular';
import { EstateService } from './service/estate.service';
import { ProfileService } from './service/profile.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginService } from './service/login.service';
import { EstateDataChangesService } from './service/estate.data.changes.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LogoutService } from './service/logout.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserSupCheck } from './service/check.browser.service';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ActivateAccountComponent } from './component/account/activate.account/activate.account.component';
import { NgReduxModule } from '@angular-redux/store';
import { RecoveryPasswordComponent } from './component/account/recovery.password/recovery.password.component';
import { InputMaskModule, MultiSelectModule, SelectButtonModule, SliderModule, CalendarModule } from 'primeng/primeng';
import { UserStorageService } from './service/user.storage.service';
import { ChatService } from './service/chat.service';
import { CallService } from './service/call.service';
import { StartPageComponent } from './component/start.page/start.page.component';
import { SearchService } from './service/search.service';
import { ImageDirective } from './component/home/shared/image/image.directive';
import { FavoriteComponent } from './component/search/favorite/favorite.component';
import { FavoriteService } from './service/favorite.service';
import { DetailsService } from './service/details.service';
import { SupportComponent } from './component/support/support.component';
import { SupportService } from './service/support.service';
import { CapslockDirective } from './component/home/shared/capslock/capslock.directive';
import { FaqComponent } from './component/faq/faq.component';
import { BenefitsComponent } from './component/benefits/benefits.component';
import { AboutComponent } from './component/about/about.component';
import { TermsComponent } from './component/terms/terms.component';
import { MaxLengthDirective } from './component/home/shared/max.length/max-length.directive';
import { CanDeactivateGuard } from './service/can.deactivate.guard.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './component/login/login.component';
import { PopupService } from './service/popup.service';
import { RegistrationComponent } from './component/registration/registration.component';
import 'hammerjs';
import { HomeSharedModule } from 'app/home.module/home.shared.module';
import { AppSharedModule } from 'app/app.shared.module';
import { SearchSharedModule } from 'app/search.module/search.shared.module';
import { routing } from 'app/app.routing.module';
import { Router } from '@angular/router';
import { PopupComponent } from 'app/component/home/shared/popup/popup.component';
import { PolicyComponent } from './component/policy/policy.component';
import { AuthGuard } from 'app/service/authGuard';
import { CurrentUserService } from 'app/service/current.user.service';
import { CookieService } from 'ngx-cookie-service';
import { OneClickCallModalUkComponent } from './component/benefits/one.click.call.modal.uk.component';
import { OneClickCallModalRuComponent } from './component/benefits/one.click.call.modal.ru.component';
import { PolicyInfoRuComponent } from './component/policy/policy.info.ru.component';
import { PolicyInfoUkComponent } from './component/policy/policy.info.uk.component';
import { TermsInfoRuComponent } from './component/terms/terms.info.ru.component';
import { TermsInfoUkComponent } from './component/terms/terms.info.uk.component';
import { AboutInfoRuComponent } from './component/about/about.info.ru.component';
import { AboutInfoUkComponent } from './component/about/about.info.uk.component';
import { CancelAccountComponent } from './component/account/cancel.account/cancel.account.component';
import { ConfirmationService } from './service/confirmation.service';
import { EmailConfirmComponent } from './component/account/email.confirm/email.confirm.component';
import { UnlockPasswordComponent } from './component/account/unlock.password/unlock.password.component';
import { GlobalNotificationService } from 'app/service/global.notification.service';
import { GlobalNotificationsComponent } from './component/global.notifications/global.notifications.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserActionService } from 'app/service/user.action.service';
import { AgmCoreModule } from '@agm/core';
import { RentikComponent } from './component/rentik/rentik.component';
import { WishComponent } from './component/wish/wish.component';
import { WishesService } from 'app/service/wishes.service';
import { WishlistComponent } from './component/wishlist/wishlist.component';
import { TenantsService } from './service/tenants.service';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/messages.', '.json');
}

export function RestangularConfigFactory(RestangularProvider, Router, LogoutService, PopupService, CurrentUserService) {
  RestangularProvider.setBaseUrl(Constants.BASE_URL);
  RestangularProvider.setDefaultHeaders({ 'Content-Type': 'application/json', });
  RestangularProvider.setDefaultHttpFields({ withCredentials: true });

  const availablePages: String[] = [
    '/',
    '/login', '/registration',
    '/terms', '/unsupportedbrowser', '/about', '/faq',
    '/search',
    '/account/activate', '/account/cancel', '/account/password/unlock', '/account/password/recovery', '/account/email/confirm',
    '/wishlist', '/wish','/tenants'
  ];

  let isAvailablePages = function (path, response): Boolean {
    if ((availablePages.some((page) => page === path) || path.split('/').slice(1, -1).join('/') === 'search/details') && response.request.url === '/rest/users/current') {
      return true;
    } else return false;
  }
  RestangularProvider.addErrorInterceptor((response) => {
    let path = window.location.pathname;
    console.log(response);
    if (response.status === 404) {
      PopupService.popupError.next("UnknownError");
      return false;
    } else if (response.data && (response.data.message === 'AccountBlockedException' || response.data.message === 'AccountAutoBlockedException') && response.request.url !== '/rest/login') {
      LogoutService.logout();
      Router.navigateByUrl('/logout');
    } else if ((response.status === 401 || response.status === 403) && path !== '/home/account/security') {
      localStorage.removeItem('auth-token');
      CurrentUserService.getCurrentUser()
        .then(() => {
          return true;
        })
        .catch(() => {
          if (isAvailablePages(path, response)) {
            return true;
          } else {
            LogoutService.logout();
            Router.navigateByUrl('/login');
            return false;
          }
        });
    } else if (response.data && (response.data.message === 'EmailNotConfirmedException' || response.data.message === 'PhoneNumberNotConfirmedException')) {
      PopupService.popupError.next('NeedConfirmError');
    } else if (response.status >= 500) {
      PopupService.popupError.next("ServerError");
      return false;
    }
    // } else {
    //   PopupService.popupError.next("UnknownError");
    //   return false;
    // }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    ActivateAccountComponent,
    RecoveryPasswordComponent,
    StartPageComponent,
    ImageDirective,
    FavoriteComponent,
    SupportComponent,
    CapslockDirective,
    FaqComponent,
    BenefitsComponent,
    AboutComponent,
    TermsComponent,
    MaxLengthDirective,
    PopupComponent,
    PolicyComponent,
    OneClickCallModalUkComponent,
    OneClickCallModalRuComponent,
    TermsInfoRuComponent,
    TermsInfoUkComponent,
    PolicyInfoUkComponent,
    PolicyInfoRuComponent,
    AboutInfoUkComponent,
    AboutInfoRuComponent,
    CancelAccountComponent,
    EmailConfirmComponent,
    UnlockPasswordComponent,
    GlobalNotificationsComponent,
    RentikComponent,
    WishComponent,
    WishlistComponent,
    TenantsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    routing,
    ReactiveFormsModule,
    HttpClientModule,
    HomeSharedModule.forRoot(),
    SearchSharedModule,
    AppSharedModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgReduxModule,
    InputMaskModule,
    RecaptchaModule.forRoot(),
    RestangularModule.forRoot([Router, LogoutService, PopupService, CurrentUserService], RestangularConfigFactory),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAIy0DAopd9q2asDYWzUTSqJ6O6C8r1Psg',
      libraries: ['places', 'geocoder'],
      language: 'uk'
    }),
    MultiSelectModule,
    SelectButtonModule,
    SliderModule,
    CalendarModule
  ],
  providers: [
    LoginService,
    LogoutService,
    ProfileService,
    BrowserSupCheck,
    EstateService,
    RegistrationService,
    UserStorageService,
    ResetPasswordService,
    ChatService,
    CallService,
    SearchService,
    FavoriteService,
    DetailsService,
    SupportService,
    CanDeactivateGuard,
    EstateDataChangesService,
    NotificationService,
    PopupService,
    CanLoadGuard,
    AuthGuard,
    CurrentUserService,
    CookieService,
    ConfirmationService,
    GlobalNotificationService,
    UserActionService,
    WishesService,
    TenantsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
