import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public year;
  constructor() { }

  ngOnInit() { 
    this.setupCopyrightYear();
  }

  public setupCopyrightYear(){
    let date = new Date();
    if(date.getFullYear() !== 2018){
      this.year = 2018 + ' - ' + date.getFullYear();
    } else {
      this.year = 2018;
    }
  }

}