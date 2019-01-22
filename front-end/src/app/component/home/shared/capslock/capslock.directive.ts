import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: 'input[detectCapslock]',
})
export class CapslockDirective {
  @Output() capslockEvent: EventEmitter<Boolean> = new EventEmitter();
  @HostListener('keypress', ['$event']) onkeydownHandler(e) {
    let charCode = e.keyCode ? e.keyCode : e.which;
    let shiftKey = e.shiftKey ? e.shiftKey : ((charCode == 16) ? true : false);
    if (((charCode >= 65 && charCode <= 90) && !shiftKey) || ((charCode >= 97 && charCode <= 122) && shiftKey)) {
      // Capslock is on
      this.capslockEvent.emit(true);
    } else {
      // Capslock is off.
      if ((charCode >= 0 && charCode <= 64) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
        return;
      } else {
        this.capslockEvent.emit(false);
      }
    }
  }

  constructor() { }

}
