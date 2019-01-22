import { RealEstate } from './../../../../model/real.estate.model';
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { IEstate } from './../../../../store/estate/estate.interface';
import { CLEAR_ESTATE, UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { Router } from '@angular/router';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';
import { ISubscription } from 'rxjs/Subscription';
import { EstateService } from './../../../../service/estate.service';
import { NewEstatePopupRu } from './../newEstatePopup/new.estate.popup.ru.component';
import { NewEstatePopupUk } from './../newEstatePopup/new.estate.popup.uk.component';


@Component({
  selector: 'estate-navigation',
  templateUrl: './estate.navigation.component.html',
  styleUrls: ['./estate.navigation.component.css', '../common.css']
})

export class EstateNavigationComponent implements OnInit, OnDestroy {
  public isNew: Boolean;
  public realEstate: RealEstate;
  public unsavedData = false;
  public confirmDialog = false;
  public success = false;
  public showRouteroutlet: Boolean;
  @select() public estate$: Observable<IEstate>;
  @ViewChild('save') save: ElementRef;
  @ViewChild('close') close: ElementRef;
  public subscriptionUnsavedData: ISubscription;
  public subscriptionEstate: ISubscription;

  constructor(
    private router: Router,
    private ngRedux: NgRedux<IAppState>,
    private estateService: EstateService,
    private dataChangesService: EstateDataChangesService
  ) {
    let estate = this.ngRedux.getState().estate;
    if (!estate.realEstate) {
      this.router.navigateByUrl('/home/estate/list');
    } else if (estate.realEstate && estate.isNew) {
      this.router.navigateByUrl('/home/estate/general');
    }
    this.showRouteroutlet = true;

    this.subscriptionEstate = this.estate$.subscribe((value) => {
      this.isNew = value.isNew;
      this.realEstate = value.realEstate;
    });
    this.unsavedData = this.dataChangesService.emitChangeSource.getValue();
    console.log(this.unsavedData);
    this.subscriptionUnsavedData = this.dataChangesService.emitChangeSource.subscribe(
      unsavedData => {
        this.unsavedData = unsavedData;
        console.log(this.unsavedData);
      });

  }

  ngOnInit() {

  }

  canDeactivate(): Promise<boolean> | boolean {
    console.log(this.unsavedData);
    if (!this.unsavedData || this.isNew) {
      return true;
    };
    return this.confirmChanges();
  }
  public confirmChanges(): Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.confirmDialog = true;
      this.save.nativeElement.onclick = () => {
        if (!this.realEstate.type || !this.realEstate.accommodation || !this.realEstate.publicPhoneNumber) {
          this.router.navigateByUrl('home/estate/general');
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        if (!this.realEstate.latitude || !this.realEstate.longitude) {
          this.router.navigateByUrl('home/estate/location');
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        if (this.realEstate.photos === null || this.realEstate.photos.length < 2) {
          this.router.navigateByUrl('home/estate/photo');
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        if (!this.realEstate.price) {
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        this.estateService.updateEstate(this.realEstate.id, this.realEstate)
          .then(() => {
            this.unsavedData = false;
            this.dataChangesService.emitChange(false);
            this.dataChangesService.userEstatesCount.next(1);
            this.success = true;
            setTimeout(() => {
              this.confirmDialog = false;
              this.success = false;
              resolve(true);
              // this.router.navigateByUrl('/home/estate/list');
            }, 4000);
          })
          .catch((error) => {
            this.confirmDialog = false;
            resolve(false);
            alert(error);
          });
      };
      this.close.nativeElement.onclick = () => {
        this.dataChangesService.emitChange(false);
        resolve(true);
        this.ngRedux.dispatch({ type: CLEAR_ESTATE });
        console.log('Redux state after update:');
        console.log('=============================');
        console.log(this.ngRedux.getState().estate);
        console.log('=============================');
      };
    });
  }

  ngOnDestroy() {
    this.subscriptionUnsavedData.unsubscribe();
    this.subscriptionEstate.unsubscribe();
  }

  public activateRoutingHandler(elem: HTMLElement) {
    let scrollTop = <any>window.pageYOffset || document.documentElement.scrollTop;
    let topOffset = elem.getBoundingClientRect().top + scrollTop - 80;
    <any>window.scrollTo(0, topOffset);
  }
}
