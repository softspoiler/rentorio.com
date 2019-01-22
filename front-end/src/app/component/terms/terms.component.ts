import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(private location: Location,
    public translate: TranslateService) { }

  back() {
    this.location.back();
  }

  ngOnInit() {
    window.scrollTo(0,0);
  }
}
