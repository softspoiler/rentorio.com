import { DomSanitizer } from '@angular/platform-browser';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../../store/state';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Validations from 'app/util/validation.utils';
import { WishesService, Wish } from 'app/service/wishes.service';
import { SearchFilter } from 'app/model/search.filter.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.css']
})
export class WishComponent implements OnInit, OnDestroy {
  public form: FormGroup
  public typeOfError: string;
  private wish: Wish = new Wish();
  private searchFilter: SearchFilter;
  public recaptchaResponse: string;
  public latitude: number;
  public longitude: number;
  public latitudeFormap: number;
  public longitudeFormap: number;
  public radius: number = 1000;
  public defaultCoords: any = {
    lat: 50.450788801336145,
    long: 30.521750883341735
  }
  public undefinedCoords: Boolean;
  public minDate = new Date();
  public lang: string;
  public accommodationTypeValue: any;
  public estateTypeValue: any;
  public roomsNumberValue: any;
  public roomsNumberInput: any;
  public calendarUk: any;
  public translateSubscription: Subscription;
  public submitAttempt: Boolean;
  public loading: Boolean;
  public success: boolean;
  public msgType: string;
  public msgLink: any;
  public token: string;
  @ViewChild('captchaRef') public gRecaptcha: RecaptchaComponent;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private wishesService: WishesService,
    private ngRedux: NgRedux<IAppState>,
    private location: Location,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {
    this.token = this.activatedRoute.snapshot.queryParams["t"];

    this.form = this.fb.group({
      gender: Validations.required(),
      accommodationType: [''],
      estateType: [''],
      roomsNumber: [''],
      priceMin: new FormControl('', Validators.pattern(/^\d+$/)),
      priceMax: new FormControl('', Validators.pattern(/^\d+$/)),
      date: Validations.required(),
      messengerType: ['VIBER']
    });
    if (this.location.isCurrentPathEqualTo('/wish?coords=true')) {
      this.searchFilter = this.ngRedux.getState().search.searchFilter;
      let latitude = this.searchFilter.getParamValue('latitude');
      let longitude = this.searchFilter.getParamValue('longitude');
      if (latitude && longitude) {
        this.setMapCenter({ latitude, longitude });
      }
    } else if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.setMapCenter(pos.coords);
      });
    };

    window['recaptchaHandler'] = this.recaptchaHandler.bind(this);

    this.minDate.setDate(this.minDate.getDate() + 1);

    this.accommodationTypeValue = [
      { label: 'entire', value: 'ENTIRE' },
      { label: 'private_room', value: 'PRIVATE_ROOM' },
      { label: 'shared_room', value: 'SHARED_ROOM' }
    ];
    this.estateTypeValue = [
      { label: 'apartment', value: 'APARTMENT' },
      { label: 'house', value: 'HOUSE' },
      { label: 'dormitory', value: 'DORMITORY' },
      { label: 'townhouse', value: 'TOWNHOUSE' },
      { label: 'villa', value: 'VILLA' },
      { label: 'loft', value: 'LOFT' },
    ]
    this.roomsNumberValue = [
      { label: '', value: '' },
      { label: '0', value: '0' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
    ]

  }
  public onSubmit() {
    let formValue = this.form.value;
    this.submitAttempt = true;
    if (this.form.valid && this.latitude && this.longitude) {
      this.loading = true;
      this.wish.rentFor = formValue.gender;
      formValue.accommodationType ? this.wish.accommodations = formValue.accommodationType.map((item) => { return item.value }).join(',') : this.wish.accommodations = null;
      formValue.estateType ? this.wish.estateTypes = formValue.estateType.map((item) => { return item.value }).join(',') : this.wish.estateTypes = null;
      (formValue.roomsNumber && formValue.roomsNumber[0]) ? this.wish.multiRoomsNumber = formValue.roomsNumber.join(',') : this.wish.multiRoomsNumber = null;
      let priceMin = Number(formValue.priceMin);
      let priceMax = Number(formValue.priceMax);
      if (!priceMin) {
        priceMin = 1;
      }
      if (!!priceMin && !!priceMax) {
        if (priceMin >= priceMax) {
          if (priceMin !== 0) {
            this.wish.priceMax = priceMin;
            this.wish.priceMin = 0;
          } else {
            this.wish.priceMax = 999999;
          }
        } else {
          this.wish.priceMax = priceMax;
          this.wish.priceMin = priceMin;
        }
      } else {
        this.wish.priceMax = 999999;
        this.wish.priceMin = 0;
      }
      this.wish.expiration = formValue.date;
      if (!this.token) {
        this.wish.messengerType = formValue.messengerType;
      } else {
        this.wish.messengerType = null;
      }
      this.wish.searchRadius = this.radius;
      this.wish.latitude = this.latitude;
      this.wish.longitude = this.longitude;
      this.wish.recaptchaResponse = this.recaptchaResponse;
      this.wish.agreedTermOfUse = true;
      this.wishesService.createNewWish(this.wish, this.token)
        .then((res) => {
          this.msgType = res.messengerType;
          if (res.subscribeUrl !== null) {
            this.msgLink = this.sanitizer.bypassSecurityTrustUrl(res.subscribeUrl);
          } else {
            this.msgLink = null;
          }
          this.loading = false;
          this.success = true;
          (<any>window).scrollTo(0, 0);
        })
        .catch((err) => {
          this.loading = false;
          this.gRecaptcha.reset();
          this.typeOfError = err.message || console.log(err);
          console.log(err);
        })
      console.dir(this.wish);
    } else {
      if (!this.latitude || !this.longitude) {
        this.undefinedCoords = true;
      }
    }
  }

  changeRoomsNumber(e) {
    console.log(e.value);
    if (e.itemValue === '') {
      this.roomsNumberInput = [''];
    } else {
      e.value.forEach((val, i) => {
        if (val === '') {
          e.value.splice(i, 1);
          this.roomsNumberInput = e.value;
        }
      })
      console.log('after', this.roomsNumberInput);
    }
  }

  private setMapCenter(coords) {
    this.defaultCoords.lat = coords.latitude;
    this.defaultCoords.long = coords.longitude;
    this.latitudeFormap = coords.latitude;
    this.longitudeFormap = coords.longitude;
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
  }

  public markerDragEventHandler(event: Event): void {
    this.latitude = event['coords'].lat;
    this.longitude = event['coords'].lng;
    this.latitudeFormap = event['coords'].lat;
    this.longitudeFormap = event['coords'].lng;
  }

  public mapClickEventHandler(event: Event): void {
    this.latitude = event['coords'].lat;
    this.longitude = event['coords'].lng;
    this.latitudeFormap = event['coords'].lat;
    this.longitudeFormap = event['coords'].lng;
    this.undefinedCoords = false;
  }

  public recaptchaHandler(token) {
    this.recaptchaResponse = token;
    this.onSubmit();
  }

  public executeRecaptcha() {
    this.submitAttempt = true;
    if (!this.latitude || !this.longitude) {
      this.undefinedCoords = true;
    }
    if (this.form.valid && this.latitude && this.longitude) {
      this.gRecaptcha.execute();
    }
  }

  public setupTextLanguage(lang: string) {
    if (lang === "uk") {
      this.roomsNumberValue[0].label = 'Не має значення';
      this.roomsNumberValue[1].label = 'Студія';
      this.lang = 'uk';
      this.calendarUk = {
        firstDayOfWeek: 0,
        dayNames: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
        dayNamesShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        dayNamesMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        monthNames: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        monthNamesShort: ["Січ", "Лют", "Бер", "Квіт", "Трав", "Черв", "Лип", "Серп", "Вер", "Жовт", "Лист", "Груд"],
        today: 'Сьогодні',
        clear: 'Очистити'
      };
    } else {
      this.roomsNumberValue[0].label = 'Не имеет значения';
      this.roomsNumberValue[1].label = 'Студия';
      this.lang = 'ru';
      this.calendarUk = {
        firstDayOfWeek: 0,
        dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"],
        today: 'Сегодня',
        clear: 'Очистить'
      };
    }
  }

  public resetFormsFields() {
    this.submitAttempt = false;
    this.defaultCoords.lat = this.latitudeFormap
    this.defaultCoords.long = this.longitudeFormap;
    this.success = false;
    this.gRecaptcha.reset();
  }

  ngOnInit() {
    (<any>window).scrollTo(0, 0);
    this.setupTextLanguage(this.translateService.currentLang);
    this.translateSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setupTextLanguage(event.lang);
    })
  }

  ngOnDestroy() {
    this.translateSubscription && this.translateSubscription.unsubscribe();
  }



}
