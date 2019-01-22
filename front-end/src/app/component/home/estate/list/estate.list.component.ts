import { UserActionService } from 'app/service/user.action.service';
import { IEstate } from './../../../../store/estate/estate.interface';
import { CREATE_REAL_ESTATE, EDIT_REAL_ESTATE, UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { Router, ActivatedRoute } from '@angular/router';
import { EstateService } from './../../../../service/estate.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RealEstate } from './../../../../model/real.estate.model';
import { IAppState } from './../../../../store/state';
import { EstateStatus } from './../../../../model/estate.status.enum';
import { NgRedux } from '@angular-redux/store';
import { PopupService } from './../../../../service/popup.service';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';

@Component({
  selector: 'app-list',
  templateUrl: './estate.list.component.html',
  styleUrls: ['./estate.list.component.css']
})
export class EstateListComponent implements OnInit {
  public currentEstateId: number;
  public previousEstate: RealEstate;
  public estatesArray: RealEstate[];
  public showAlert: Boolean;
  public loading: Boolean = true;
  public estateStatusModal: Boolean;

  constructor(private ngRedux: NgRedux<IAppState>,
    private estateService: EstateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private popupService: PopupService,
    private estateDataService: EstateDataChangesService,
    private changeRef: ChangeDetectorRef,
    private userActionService: UserActionService
  ) {
    this.estateService.getUserEstates()
      .then((estate) => {
        this.estatesArray = estate;
        if (this.activatedRoute.snapshot.queryParams['n']) {
          this.estateStatusModal = true;
        }
        console.log(this.estatesArray);
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
      });
  }

  public removeEstate(): void {
    this.estateService.deleteEstate(this.currentEstateId)
      .then((response) => {
        this.estatesArray = this.estatesArray.filter((item) => {
          return item.id !== this.currentEstateId;
        });
        if (this.estatesArray.length > 0) {
          this.estateDataService.userEstatesCount.next(1);
        } else {
          this.estateDataService.userEstatesCount.next(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.showAlert = false;
  }

  // public getEstate(id: number): Promise<any> {
  //   this.loading = true;
  //   return this.estateService.getEstate(id)
  //     .then((estate) => {
  //       // if (!this.reduxEstate.realEstate) {
  //       this.loading = false;
  //       this.ngRedux.dispatch({ type: EDIT_REAL_ESTATE });
  //       console.log('---------------')
  //       console.log('estate after EDIT_REAL_ESTATE')
  //       console.log(this.ngRedux.getState().estate);
  //       console.log('---------------')
  //       // }
  //       this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: estate });
  //       console.log('---------------')
  //       console.log('estate after UPDATE_REAL_ESTATE')
  //       console.log(this.ngRedux.getState().estate);
  //       console.log('---------------')
  //     })
  //     .catch((error) => {
  //       this.loading = false;
  //       console.log(error);
  //     });
  // }
  // preview and edit profile
  public openEstate(id: number, path: string) {
    if (path === 'general' && (!this.ngRedux.getState().session.currentUser.emailConfirmed || !this.ngRedux.getState().session.currentUser.phoneConfirmed)) {
      this.popupService.popupError.next('NeedConfirmError');
    } else {
      this.loading = true;
      this.estateService.getEstate(id)
        .then((estate) => {
          this.loading = false;
          if (!this.ngRedux.getState().estate.realEstate) {
            this.ngRedux.dispatch({ type: CREATE_REAL_ESTATE });
          }
          this.ngRedux.dispatch({ type: EDIT_REAL_ESTATE, payload: estate });
          this.estateDataService.emitChange(false);
          this.router.navigateByUrl('home/estate/' + path);
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        })
    }
  }

  public changeEstateStatus(value: string, estate: any) {
    if (!this.ngRedux.getState().session.currentUser.emailConfirmed || !this.ngRedux.getState().session.currentUser.phoneConfirmed) {
      this.popupService.popupError.next('NeedConfirmError');
    } else {
      estate.status = value;
      this.changeRef.detectChanges();
      if (value === 'ONLINE') {
        this.showAlert = false;
        this.estateStatusModal = true;
      }
      this.estateService.updateStatus(value, estate.id)
        .then((response) => {

          return;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  public showPrompt(id: number) {
    this.estateStatusModal = false;
    this.currentEstateId = id;
    this.showAlert = true;
  }

  public createNewEstate() {
    if (this.ngRedux.getState().session.currentUser.emailConfirmed && this.ngRedux.getState().session.currentUser.phoneConfirmed) {
      this.ngRedux.dispatch({ type: CREATE_REAL_ESTATE });
      this.userActionService.sendUserAction({ 'create': 'estate' });
      this.router.navigateByUrl('/home/estate/general');
    } else {
      this.popupService.popupError.next('NeedConfirmError');
    }

  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}