import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: 'input[maxValue]'
})
export class MaxLengthDirective {
  @Input() maxValue;
  constructor() { }

  @HostListener('keypress', ['$event'])
  keyHandler(event: Event) {
    if (event.target['value'].length >= this.maxValue) {
      event.target['value'] = event.target['value'].slice(0,this.maxValue);
      return false;
    }
  }


}
