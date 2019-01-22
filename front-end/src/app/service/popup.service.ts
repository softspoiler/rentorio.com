import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class PopupService {
public popupCall: Subject<any> = new Subject;
public popupError: Subject<any> = new Subject;
  constructor() { }

  public closePopup() {
    this.popupCall.next(null);
    this.popupError.next(null);
  }
}
