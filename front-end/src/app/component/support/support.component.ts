import { RecaptchaComponent } from 'ng-recaptcha';
import { SupportService } from './../../service/support.service';
import { Observable } from 'rxjs/Observable';
import { ISession } from './../../store/session/session.interface';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from './../../store/state';
import { Component, OnInit, ViewChild, Input, ElementRef, Renderer2,OnDestroy } from '@angular/core';
import { SupportInquiryType } from 'app/model/SupportInquiryType.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import Validations from 'app/util/validation.utils';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit,OnDestroy {
  public form: FormGroup;
  public supportInquiryTypeHtml: HTMLInputElement;
  public hasError: Boolean;
  public success: Boolean;
  @select() public session$: Observable<ISession>;
  public recaptchaResponse: string;
  @Input('text') text: String;
  @Input('defaultText') defaultText:Boolean;
  @ViewChild('captchaRef') public gRecaptcha: RecaptchaComponent;
  @ViewChild('modal') public modal: ElementRef;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private fb: FormBuilder,
    private supportService: SupportService,
    private renderer: Renderer2
  ) {
    this.form = this.fb.group({
      firstName: Validations.firstNameValidation(),
      email: Validations.emailValidation(),
      message: Validations.textArea()
    });

    window['recaptchaHandler'] = this.recaptchaHandler.bind(this);
  }

  public onSubmit(): void {
    this.hasError = false;
    if (this.ngRedux.getState().session.isAuthenticated) {
      if (this.form.get('message').valid && this.supportInquiryTypeHtml.value) {
        // for known users
        this.supportService.sendSupportInquiry(
          {
            'currentUser': true,
            'type': SupportInquiryType[SupportInquiryType[this.supportInquiryTypeHtml.value]],
            'message': this.form.get('message').value
          },
          true
        )
          .then((res) => {
            this.success = true;
            this.hideSupportModal();
            this.form.reset();
            this.supportInquiryTypeHtml.checked = false;
            setTimeout(() => {
              this.success = false;
            }, 4000);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // message not valid
        this.hasError = true;
      }
    } else {
      if (this.form.get('firstName').valid && this.form.get('email').valid && this.form.get('message').valid && this.supportInquiryTypeHtml.value) {
        // for unknown users
        this.supportService.sendSupportInquiry(
          {
            'who': this.form.get('firstName').value,
            'email': this.form.get('email').value,
            'type': SupportInquiryType[SupportInquiryType[this.supportInquiryTypeHtml.value]],
            'message': this.form.get('message').value,
            'recaptchaResponse': this.recaptchaResponse
          }
        )
          .then((res) => {
            this.gRecaptcha.reset();
            this.success = true;
            this.hideSupportModal();
            this.form.reset();
            this.supportInquiryTypeHtml.checked = false;
            setTimeout(() => {
              this.success = false;
            }, 4000);
          })
          .catch((err) => {
            this.gRecaptcha.reset();
            console.log(err);
          });
      } else {
        this.hasError = true;
      }
    }
  }

  public recaptchaHandler(token) {
    this.recaptchaResponse = token;
    this.onSubmit();
  }

  public executeRecaptcha() {
    if (this.form.valid) {
      this.gRecaptcha.execute();
    } else {
      this.hasError = true;
    }
  }

  public setSupportInquiryType(value: HTMLInputElement): void {
    this.supportInquiryTypeHtml = value;
  }

  public showSupportModal() {
    this.renderer.addClass(this.modal.nativeElement, 'show-modal');
    this.renderer.addClass(this.modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  public hideSupportModal() {
    this.renderer.removeClass(this.modal.nativeElement, 'show-modal');
    this.renderer.removeClass(this.modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    if(this.modal){
      this.hideSupportModal();
    }
  }
}
