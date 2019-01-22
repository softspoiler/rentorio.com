import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EstateDataChangesService {
    public emitChangeSource = new BehaviorSubject(false);
    public userEstatesCount = new Subject();

    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }
}