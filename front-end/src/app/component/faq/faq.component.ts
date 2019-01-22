import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  host: { '(window:scroll)': 'scrollHandler($event)' }
})
export class FaqComponent implements OnInit {
  public showTopArrow: Boolean;

  constructor() {
  }

  public goTo(hash: string): void {
    window.location.hash = '';
    window.location.hash = hash;
  }

  public scrollHandler(event) {
    if (event.path[1].pageYOffset > 500) {
      this.showTopArrow = true;
    } else {
      this.showTopArrow = false;
    }
  }

  ngOnInit() {
    window.scrollTo(0,0);
  }

}
