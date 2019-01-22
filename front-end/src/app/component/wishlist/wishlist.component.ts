import { WishesService } from 'app/service/wishes.service';
import { Component, ViewChild, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Wish } from '../../service/wishes.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  public wishes: Wish[];
  public token: string;
  public loading: Boolean;
  public deleteLoading: Boolean;
  public mapProps: any = {
    latitude: 0,
    longitude: 0,
    radius: 500,
    zoom: 12
  };
  @ViewChild('mapModal') public mapModal: ElementRef;
  public today: number = Date.now();
  constructor(
    private wishesService: WishesService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.activatedRoute.snapshot.queryParams["t"];
    if (this.token) {
      this.getUserWishes();
    } else {
      this.router.navigateByUrl('/');
    }
    console.log(this.today);
  }

  getUserWishes() {
    this.loading = true;
    this.wishesService.getWishes(this.token)
      .then((res) => {
        this.loading = false;
        this.wishes = res;
      })
      .catch((err) => {
        this.loading = false;
        console.log(err);
      });
  }

  public deleteWish(id) {
    this.deleteLoading = true;
    this.wishesService.deleteWish(this.token, id)
      .then(() => {
        this.wishes = this.wishes.filter((wish) => {
          return wish.id !== id;
        });
        this.deleteLoading = false;
      })
      .catch((err) => {
        this.deleteLoading = false;
        console.log(err);
      });
  }

  public setupReadableDate(timestamp: number): string {
    let date = new Date(timestamp),
      day, month, year;
    date.getDate() < 10 ? day = '0' + date.getDate() : day = date.getDate();
    date.getMonth() + 1 < 10 ? month = '0' + (date.getMonth() + 1) : month = date.getMonth() + 1;
    date.getFullYear() < 10 ? year = '0' + date.getFullYear() : year = date.getFullYear();
    return day + '.' + month + '.' + year;
  }

  public showMap(mapProps) {
    this.mapProps = mapProps;
    if (mapProps.radius >= 500 && mapProps.radius < 1000) {
      this.mapProps.zoom = 15;
    } else if (mapProps.radius >= 1000 && mapProps.radius < 1500) {
      this.mapProps.zoom = 14;
    } else if (mapProps.radius >= 1500 && mapProps.radius < 2500) {
      this.mapProps.zoom = 13;
    } else if (mapProps.radius >= 2500 && mapProps.radius <= 3000) {
      this.mapProps.zoom = 12;
    }
    this.renderer.addClass(this.mapModal.nativeElement, 'show-modal');
    this.renderer.addClass(this.mapModal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  public hideMap() {
    this.mapProps = {
      latitude: 0,
      longitude: 0,
      radius: 500
    };
    this.renderer.removeClass(this.mapModal.nativeElement, 'show-modal');
    this.renderer.removeClass(this.mapModal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  ngOnDestroy() {
    if (this.mapModal) {
      this.hideMap();
    }
  }

  ngOnInit() {
    (<any>window).scrollTo(0, 0);
  }

}
