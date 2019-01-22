import { RealEstate } from './../../../../model/real.estate.model';
import { UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { EstateService } from './../../../../service/estate.service';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';
import { Router } from '@angular/router';
import { EstateStatus } from './../../../../model/estate.status.enum';

@Component({
  selector: 'app-prices',
  templateUrl: './estate.prices.component.html',
  styleUrls: ['./estate.prices.component.css', '../common.css']
})
export class EstatePricesComponent {
  public realEstate: RealEstate;
  public form: FormGroup;
  public isNew: Boolean;
  public success = false;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private fb: FormBuilder,
    private router: Router,
    private estateService: EstateService,
    private dataChangesService: EstateDataChangesService
  ) {
    this.realEstate = this.ngRedux.getState().estate.realEstate;
    this.isNew = this.ngRedux.getState().estate.isNew;
    this.form = this.fb.group({
      price: [this.realEstate.price, Validators.required],
      depositType: [this.realEstate.depositType],
      utilitiesPaymentType: [this.realEstate.utilitiesPaymentType],
      currency: [this.realEstate.currency]
    });
  }

  public isDataChanged(changed: boolean) {
    this.dataChangesService.emitChange(changed);
  }

  public update() {
    console.log("preice", this.realEstate.price);
    this.form.value.depositType = this.form.value.depositType || 'MONTH';
    this.form.value.utilitiesPaymentType = this.form.value.utilitiesPaymentType || 'SEPARATELY';
    this.form.value.currency = this.form.value.currency || 'UAH';
    this.realEstate = Object.assign(this.realEstate, this.form.value);
    this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: this.realEstate });
    console.log('Redux state after update:');
    console.log('=============================');
    console.log(this.ngRedux.getState().estate.realEstate);
    console.log('=============================');
    this.isDataChanged(true);
  };

  public changePrice(e) {
    if (/^\d+$/.test(e.target.value)) {
      this.realEstate.price = Number(e.target.value);
    } else {
      this.realEstate.price = null;
    }
  }

  public save() {
    if (!this.realEstate.type || !this.realEstate.accommodation || !this.realEstate.publicPhoneNumber) {
      this.router.navigateByUrl('home/estate/general');
      return;
    }
    if (!this.realEstate.shortDescription) {
      this.router.navigateByUrl('home/estate/description');
      return;
    }
    if (!this.realEstate.latitude || !this.realEstate.longitude) {
      this.router.navigateByUrl('home/estate/location');
      return;
    }
    if (this.realEstate.photos.length < 2) {
      this.router.navigateByUrl('home/estate/photo');
      return;
    }
    if (!this.realEstate.price) {
      return;
    }
    if (this.isNew) {
      this.realEstate = Object.assign(this.realEstate, { status: 'ONLINE' });
      this.estateService.createEstate(this.realEstate)
        .then((estate) => {
          this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: estate });
          this.isDataChanged(false);
          this.dataChangesService.userEstatesCount.next(1);
          this.router.navigateByUrl('home/estate/list?n=true');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.estateService.updateEstate(this.realEstate.id, this.realEstate)
        .then(() => {
          this.isDataChanged(false);
          this.success = true;
          setTimeout(() => {
            this.success = false;
            this.router.navigateByUrl('/home/estate/list');
          }, 4000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

}
