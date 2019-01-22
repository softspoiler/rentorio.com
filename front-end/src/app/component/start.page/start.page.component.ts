import { UserActionService } from 'app/service/user.action.service';
import { Component, OnInit } from '@angular/core';
import { EstateService } from '../../service/estate.service';
import { NgxCarousel } from 'ngx-carousel';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.component.html',
  styleUrls: ['./start.page.component.css']
})
export class StartPageComponent implements OnInit {
  public showModal: Boolean;
  public estates: any;
  public carouselSetting: Object = {
    grid: { xs: 1, sm: 2, md: 3, lg: 3, all: 0 },
    slide: 1,
    speed: 250,
    interval: 4000,
    point: {
      visible: true,
    },
    touch: true,
    custom: 'banner',
    easing: 'cubic-bezier(0,.01,1,.99)'
  };

  constructor(private estateService: EstateService, private userActionService: UserActionService) { }

  public getLastAddedEstates() {
    this.estateService.getLastAddedEstates()
      .then((res) => {
        this.estates = res;
        console.log('estates', this.estates);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public sendAction(id) {
    this.userActionService.sendUserAction({ 'details': id });
  }

  ngOnInit() {
    this.getLastAddedEstates();
  }

}
