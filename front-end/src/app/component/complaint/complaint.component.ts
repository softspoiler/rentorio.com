import { UserActionService } from 'app/service/user.action.service';
import { PopupService } from './../../service/popup.service';
import { ComplaintService } from './../../service/complaint.service';
import { IAppState } from './../../store/state';
import { NgRedux } from '@angular-redux/store';
import { Component, OnInit, OnDestroy, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ComplaintType } from 'app/model/complaint.type.enum';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit, OnDestroy {
  // public showComplaintModal: Boolean;
  public hideComplaintBtn: Boolean;
  public isUnknownUser: Boolean;
  public complaintType: string;
  public success: Boolean;
  public complaintTypeHtml: HTMLInputElement;
  @Input() path: string;
  @Input() id: number;
  @Input() landlordId: number;
  @Input() withoutComplaintBtn: Boolean;
  @ViewChild('modal') public modal: ElementRef;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private complaintService: ComplaintService,
    private renderer: Renderer2,
    private popupService: PopupService,
    private userActionService:UserActionService
  ) { }

  public checkUserStatus() {
    if (this.ngRedux.getState().session.isAuthenticated) {
      this.isUnknownUser = false;
      return true;
    }
    this.isUnknownUser = true;
    return false;

  }

  public sendComplaint(message: HTMLTextAreaElement): void {
    this.complaintService.sendComplaint(
      { 'message': message.value, 'type': ComplaintType[ComplaintType[this.complaintType]] },
      this.id,
      this.path
    ).then((res) => {
      this.hideComplaintModal();
      this.success = true;
      message.value = '';
      this.complaintTypeHtml.checked = false;
      setTimeout(() => {
        this.success = false;
      }, 4000);
    }).catch((err) => {
      console.log(err);
    });
  }

  public setComplaintType(complaintTypeHTML: HTMLInputElement): void {
    this.complaintType = complaintTypeHTML.value;
    this.complaintTypeHtml = complaintTypeHTML;
  }

  showComplaintModalWithCheck() {
    if (this.checkUserStatus()) {
      let currentUser = this.ngRedux.getState().session.currentUser;
      if (!currentUser.emailConfirmed || !currentUser.phoneConfirmed) {
        this.popupService.popupError.next('NeedConfirmError');
      } else {
        this.showComplaintModal();
      }
    } else {
      this.showComplaintModal();
    }
  }

  public showComplaintModal() {
    this.renderer.addClass(this.modal.nativeElement, 'show-modal');
    this.renderer.addClass(this.modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    this.userActionService.sendUserAction({ 'complaint': this.id });
  }

  public hideComplaintModal() {
    this.renderer.removeClass(this.modal.nativeElement, 'show-modal');
    this.renderer.removeClass(this.modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  ngOnInit() {
    if (this.ngRedux.getState().session.isAuthenticated) {
      switch (this.path) {
        case 'estates':
          if (this.ngRedux.getState().session.currentUser.id === this.landlordId) {
            this.hideComplaintBtn = true;
          }
          break;
        case 'users':
          if (this.ngRedux.getState().session.currentUser.id === this.id) {
            this.hideComplaintBtn = true;
          }
      }
    }
  }

  ngOnDestroy() {
    this.hideComplaintModal();
  }
}
