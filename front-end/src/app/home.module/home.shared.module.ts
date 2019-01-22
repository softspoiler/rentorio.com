import { RECAPTCHA_SETTINGS, RecaptchaSettings,RecaptchaModule } from 'ng-recaptcha';
import { ConfirmInformationComponent } from './../component/home/shared/confirm.information/confirm.information.component';
import { InputMaskModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { AddNumberComponent } from './../component/home/shared/add.number/add.number.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppSharedModule } from './../app.shared.module';
import { ConvenientCallTimeModalUkComponent } from '../component/benefits/convenient.call.time.modal.uk.component';
import { ConvenientCallTimeModalRuComponent } from '../component/benefits/convenient.call.time.modal.ru.component';

const recaptchaSetting: RecaptchaSettings = { siteKey: '6LfAIU0UAAAAAOrvzLB9LkxtnDKM3Q3DdramBYbN' };

@NgModule({
    declarations: [
        AddNumberComponent,
        ConfirmInformationComponent,
        ConvenientCallTimeModalUkComponent,
        ConvenientCallTimeModalRuComponent
    ],
    exports: [
        AddNumberComponent,
        InputMaskModule,
        ConfirmInformationComponent,
        ConvenientCallTimeModalUkComponent,
        ConvenientCallTimeModalRuComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputMaskModule,
        AppSharedModule,
        RecaptchaModule.forRoot()
    ]
})
export class HomeSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HomeSharedModule,
            providers: [
                {
                    provide: RECAPTCHA_SETTINGS,
                    useValue: recaptchaSetting
                  },
            ]
        };
    }
}