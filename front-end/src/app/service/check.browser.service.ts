import { Injectable } from '@angular/core';
import * as bowser from 'bowser';

@Injectable()
export class BrowserSupCheck {
    constructor() {

    }

    public checkBrowser(): any {
        if (bowser.chrome || bowser.opera || bowser.safari || bowser.firefox || bowser.msedge) {
            return false;
        } else if (bowser.msie && Number(bowser.version) < 9) {
            return true;
        }
        return false;
    }
}
