import { RealEstate } from './../../../../model/real.estate.model';
import { UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { EstateProperty } from './../../../../model/estate.property.model';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';

@Component({
  selector: 'estate-safety',
  templateUrl: './estate.safety.component.html',
  styleUrls: ['./estate.safety.component.css', '../common.css']
})

export class EstateSafetyComponent implements OnInit {
  public realEstate: RealEstate;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private dataChangesService: EstateDataChangesService
  ) {
    this.realEstate = this.ngRedux.getState().estate.realEstate;
    this.realEstate.estateProperties = this.ngRedux.getState().estate.realEstate.estateProperties || new Set<number>([]);
  }

  public checked(value: any): boolean {
    value = parseInt(value, 10);
    return this.realEstate.estateProperties.has(value);
  }

  public check(value: any): void {
    value = parseInt(value, 10);
    if (this.realEstate.estateProperties.has(value)) {
      this.realEstate.estateProperties.delete(value);
    } else {
      this.realEstate.estateProperties.add(value);
    }
  }

  public update() {
    this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: this.realEstate });
    this.isDataChanged(true);
    console.log('Redux state after update:');
    console.log('=============================');
    console.log(this.ngRedux.getState().estate);
    console.log('=============================');
  }

  public isDataChanged(changed: boolean) {
    this.dataChangesService.emitChange(changed);
  }

  ngOnInit() {
    console.log(this.ngRedux.getState().estate);

  }
}
