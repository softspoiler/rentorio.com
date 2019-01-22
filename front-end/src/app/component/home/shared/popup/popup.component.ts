import { IAppState } from './../../../../store/state';
import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CallService } from './../../../../service/call.service';
import { PopupService } from './../../../../service/popup.service';
import { ISession } from './../../../../store/session/session.interface';
import { select, NgRedux } from '@angular-redux/store';

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

export class PopupComponent implements OnDestroy {

  @select() private session$: Observable<ISession>;
  public call: any;
  public calling: boolean;
  public error: any;
  public phoneNumber: string;
  private popupEvent: Subject<any>;
  private subscriptions: Array<Subscription> = [];
  private showPopup: boolean;

  constructor(private callService: CallService,
    private popupService: PopupService,
    private router: Router,
    private ngRedux: NgRedux<IAppState>
  ) {

    this.subscriptions.push(
      this.popupService.popupError.subscribe((event) => {
        if (event) this.error = event;
      }),
      this.popupService.popupCall.subscribe((event) => {
        if (event) this.call = event;
      })

    );
  }

  private toCall() {
    if (this.ngRedux.getState().session.isAuthenticated && this.call && !this.call.phoneNumber) {
      this.callService.callToLandlord(this.call.estateId)
        .then(() => {
          this.calling = true;
        })
      this.popupService.popupCall.next(null);
      this.call = null;
    };
  
    // this.subscriptions.push(
    //   this.session$
    //     .subscribe((value) => {
    //       if (value['isAuthenticated']) {
    //         if (this.call) {
    //           this.callService.callToLandlord(this.call.estateId)
    //             .then(() => {
    //               this.calling = true;
    //             })
    //             this.popupService.popupCall.next(null);
    //             this.call = null;
    //         }     
    //       }
    //     })
    // );
  }

  close() {
    this.popupService.closePopup();
    this.error = null;
    this.call = null;
    this.calling = null;
  }

  overlayClickHandler(e) {
    if (e.target.hasAttribute('data-overlay')) {
      this.close();
    }
  }

  toMain() {
    this.router.navigateByUrl('/');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    })
  }
}



