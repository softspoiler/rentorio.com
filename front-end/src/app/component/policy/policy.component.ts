import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  constructor(private location: Location,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    window.scrollTo(0,0);
  }

  back() {
    this.location.back();
  }

}
