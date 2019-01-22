import { UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { IEstate } from './../../../../store/estate/estate.interface';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';
import { ISubscription } from 'rxjs/Subscription';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'estate-general',
  templateUrl: './estate.general.component.html',
  styleUrls: ['./estate.general.component.css', '../common.css']
})

export class EstateGeneralComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public showInfo: boolean;
  public estate: IEstate;
  public isNew: boolean;
  @select() public estate$: Observable<IEstate>;
  public subscriptionEstate: ISubscription;
  public currentUserPhoneNumber: String;
  public publicPhoneModel: any;
  public showSuggestion: Boolean;

  constructor(
    private fb: FormBuilder,
    private ngRedux: NgRedux<IAppState>,
    private dataChangesService: EstateDataChangesService,
    public userService: UserFacadeService,
    public renderer: Renderer2,
    public translate: TranslateService
  ) {
    this.userService.getUserProfile()
      .then((res) => {
        this.currentUserPhoneNumber = res.phoneNumber;
      })
    this.subscriptionEstate = this.estate$.subscribe((value) => {
      if (value['isNew'] && !this.isNew) {
        console.log('isNew now');
      }
      this.estate = value;
      if (this.estate.realEstate) {
        console.log('fb');
        let pubNumber = this.estate.realEstate.publicPhoneNumber ? this.estate.realEstate.publicPhoneNumber.slice(3) : '';
        this.publicPhoneModel = pubNumber;
        this.form = this.fb.group({
          phoneType: this.fb.group({
            publicPhoneNumber: [pubNumber]
          }, { validator: this.customValidation }),
          type: [this.estate.realEstate.type, Validators.required],
          accommodation: [this.estate.realEstate.accommodation, Validators.required],
          allowedHabitants: [this.estate.realEstate.allowedHabitants],
          roomsNumber: [this.estate.realEstate.roomsNumber],
          bedroomsNumber: [this.estate.realEstate.bedroomsNumber],
          bathroomsNumber: [this.estate.realEstate.bathroomsNumber],
          totalArea: [this.estate.realEstate.totalArea],
          livingArea: [this.estate.realEstate.livingArea],
          kitchenArea: [this.estate.realEstate.kitchenArea],
          floor: [this.estate.realEstate.floor],
          floors: [this.estate.realEstate.floors],
        });
      };
    });

    this.showInfo = !this.userService.getEstateRemember();
    console.log(`showInfo ${this.showInfo}`)

  }

  customValidation(formGroup): any {
    let publicNumberSelected = !(formGroup.get('publicPhoneNumber').value[14] === '_' || !formGroup.get('publicPhoneNumber').value);
    if (!publicNumberSelected) {
      return { publicPhoneEmpty: true };
    }
  }

  public update() {
    let formValue: any = {};
    console.log(this.form.value)
    formValue.type = this.form.value.type;
    formValue.accommodation = this.form.value.accommodation;
    formValue.allowedHabitants = parseInt(this.form.value.allowedHabitants, 10) || 1;
    formValue.roomsNumber = Number(this.form.value.roomsNumber);
    formValue.bedroomsNumber = parseInt(this.form.value.bedroomsNumber, 10) || 1;
    formValue.bathroomsNumber = parseInt(this.form.value.bathroomsNumber, 10) || 1;
    formValue.floor = parseInt(this.form.value.floor, 10) || 1;
    formValue.floors = parseInt(this.form.value.floors, 10) || 1;
    formValue.totalArea = parseInt(this.form.value.totalArea, 10) || 0;
    formValue.livingArea = parseInt(this.form.value.livingArea, 10) || 0;
    formValue.kitchenArea = parseInt(this.form.value.kitchenArea, 10) || 0;
    if (this.publicPhoneModel && this.publicPhoneModel[14] !== '_') {
      formValue.publicPhoneNumber = ("+38" + this.publicPhoneModel).replace(/ |[()-]/g, '');
    }
    console.log(this.estate.realEstate);
    console.log(formValue);
    this.estate.realEstate = Object.assign(this.estate.realEstate, formValue);
    this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: this.estate.realEstate });
    this.estate = this.ngRedux.getState().estate;
    console.log('Redux state after update:');
    console.log('=============================');
    console.log(this.ngRedux.getState().estate);
    console.log('=============================');
    this.isDataChanged(true);
    console.log('there is unsaved data');
  };

  ngOnInit() {
  }

  public isDataChanged(changed: boolean) {
    this.dataChangesService.emitChange(changed);
  }

  hideInfo(event) {
    if (event.target.checked) {
      this.userService.setEstateRemember();
    }
  }

  closePopup() {
    this.showInfo = false;
  }

  infoEvent() {
    this.showInfo = true;
  }

  phoneSuggestionClickHandler() {
    this.publicPhoneModel = this.currentUserPhoneNumber.slice(3);
    this.update();
  }

  showModal(elem: HTMLDivElement) {
    this.renderer.addClass(elem, 'show-modal');
    this.renderer.addClass(elem.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  hideModal(elem: HTMLDivElement) {
    this.renderer.removeClass(elem, 'show-modal');
    this.renderer.removeClass(elem.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  ngOnDestroy() {
    this.subscriptionEstate.unsubscribe();
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }
}
