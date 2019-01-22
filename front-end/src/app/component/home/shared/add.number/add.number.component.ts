import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import Validations from './../../../../util/validation.utils';
import { InvalidSmsVerifyCodeError } from './../../../../service/error/invalid.sms.verify.code.error';
import { PhoneNumberAlreadyExistError } from './../../../../service/error/phone.number.already.exist.error';
import { SmsVerifyCodeAttemptLimitError } from './../../../../service/error/sms.verify.code.attempt.limit.error';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { UserProfile } from './../../../../model/user.profile.model';
import { InputMaskModule } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { UPDATE_CURRENT_USER } from './../../../../store/actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../../../../store/state';

@Component({
  selector: 'add-number',
  templateUrl: './add.number.component.html',
  styleUrls: ['./add.number.component.css']
})

export class AddNumberComponent implements OnInit {
  @Output() newPhoneEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() showOnlyForm: Boolean;
  public showForm: Boolean;
  public profile: UserProfile;
  public phoneForm: FormGroup;
  public checkError: Boolean = false;
  public codes: string[] = ['050', '095', '066', '099', '067', '097', '098', '068', '063', '093', '073', '096'];
  public showCode: Boolean = false;
  public phoneNumber: string;
  public typeOfError: String;
  public countDown: any;
  public counter: number = 60;
  private attempt: number = 1;
  public allowResendSms: Boolean;
  public veryfyLoad: Boolean;
  public checkLoad: Boolean;

  constructor(private userService: UserFacadeService, private fb: FormBuilder,
    private ngRedux: NgRedux<IAppState>) {
    this.userService.getUserProfile()
      .then((res) => {
        this.profile = res;
      })
      .catch((err) => {
        console.log(err);
      });
    this.phoneForm = this.fb.group({
      phoneCode: fb.control(this.codes[0]),
      num: Validations.phoneNumberValidation(),
      smsCode: fb.control('')
    });
    console.log(this.phoneForm.value);
  }

  public verify(): void {
    if (this.phoneForm.get('num').valid && !!this.phoneForm.value.num) {
      this.veryfyLoad = true;
      this.phoneNumber = '+38' + this.phoneForm.value.phoneCode + this.phoneForm.value.num;
      console.log(this.phoneNumber, this.profile.phoneNumber);
      this.userService.sendSmsVerifyCode(this.phoneNumber)
        .then(() => {
          this.veryfyLoad = false;
          this.showCode = true;
          this.allowResendSms = false;
          this.counter = 60;
          this.startCountDown();
          this.typeOfError = null;
          console.log(this.phoneNumber, this.profile.phoneNumber);
        })
        .catch((e) => {
          this.veryfyLoad = false;
          this.typeOfError = e.message || console.log(e);
        });
    }
  }

  public check(): void {
    this.checkLoad = true;
    this.userService.checkSmsVerifyCode(this.phoneForm.value.smsCode)
      .then(() => {
        this.checkLoad = false;
        this.showCode = false;
        this.showForm = false;
        this.phoneForm.reset({ phoneCode: this.codes[0], num: '', smsCode: '' });
        this.typeOfError = null;
        this.newPhoneEvent.emit(this.phoneNumber);
        return this.userService.getCurrentUser();
      })
      .then((user) => {
        this.ngRedux.dispatch({ type: UPDATE_CURRENT_USER, payload: user });
        console.log(JSON.stringify(this.ngRedux.getState()));
      })
      .catch((e) => {
        this.checkLoad = false;
        this.checkError = true;
        if (e instanceof InvalidSmsVerifyCodeError) {
          this.typeOfError = 'InvalidSmsVerifyCodeError';
        } else {
          console.log(e);
        }
      });
  }

  public startCountDown() {
    this.counter = 60 * Math.min(this.attempt, 5);
    this.countDown = Observable.timer(0, 100)
      .take(this.counter)
      .map(() => {
        if (this.counter === 1) {
          this.allowResendSms = true;
          ++this.attempt;
          this.counter = null;
        } else {
          return --this.counter
        };
      });
  }

  ngOnInit() {
  }

}

