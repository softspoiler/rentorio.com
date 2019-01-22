import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RealEstate } from './../../../../model/real.estate.model';
import { UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { IEstate } from './../../../../store/estate/estate.interface';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';

@Component({
  selector: 'app-description',
  templateUrl: './estate.description.component.html',
  styleUrls: ['./estate.description.component.css', '../common.css']
})
export class EstateDescriptionComponent {
  public realEstate: RealEstate;
  public form: FormGroup;
    
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private fb: FormBuilder,
    private dataChangesService: EstateDataChangesService
  ) {
    this.realEstate = this.ngRedux.getState().estate.realEstate;
    this.form = fb.group({
      shortDescription: [this.realEstate.shortDescription, Validators.required],
      description: [this.realEstate.description]
    });
  }

  public counter(maxValue: number, value: string): number {
    if (value) {
      return maxValue - value.length;
    } else {
      return maxValue;
    }
  }

  public update() {
    this.realEstate = Object.assign(this.realEstate, this.form.value);
    this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: this.realEstate });
    console.log('Redux state after update:');
    console.log('=============================');
    console.log(this.ngRedux.getState().estate);
    console.log('=============================');
    this.isDataChanged(true);
  };

  public isDataChanged(changed: boolean) {
    this.dataChangesService.emitChange(changed);
  }
}
