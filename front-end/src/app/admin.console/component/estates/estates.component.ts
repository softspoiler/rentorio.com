import { UserService } from './../../service/user.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryImageSize } from 'ngx-gallery';
import { EstateService } from './../../service/estate.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.css']
})

export class EstatesComponent implements OnInit {
  public estateList: any;
  public pageNumber: number = 0;
  public currentPage: number = 1;
  public totalPages: number;
  public estateLoad: Boolean;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[] = [];
  public confortProperty: number[] = [];
  public securityProperty: number[] = [];
  public securityPropertyValue: Object = {
    '4001': 'Датчик дыма',
    '4002': 'Детектор угарного газа',
    '4003': 'Аптечка',
    '4004': 'Памятка безопастности',
    '4005': 'Огнетушитель'
  };
  public confortPropertyValue: Object = {
    "1003": "Телевизор",
    "1006": "Лоджия",
    "1005": "Кабельное телевидение",
    "1008": "Душевая кабина",
    "1007": "Кондиционер",
    "1010": "Холодильник",
    "1009": "Отопление",
    "1012": "Мебели",
    "1011": "Интернет",
    "1014": "Счетчики",
    "1013": "Беспроводной интеренет",
    "1016": "Шкаф",
    "1002": "Ванная",
    "1017": "Кровать",
    "1004": "Балкон",
    "2001": "Джакузи",
    "2002": "Камин",
    "2003": "Стиральная машина",
    "2004": "Домофон",
    "2005": "Бассейн",
    "2006": "Вахтер",
    "2007": "Сушильная машина",
    "2014": "Домашний кинотеатр",
    "2009": "Бесплатна парковка",
    "2016": "Газовая плита",
    "2010": "Спортзал",
    "2018": "Бойлер",
    "2011": "Лифт",
    "2020": "Духовой шкаф",
    "2013": "Бильярд",
    "2022": "Спутниковое телевидение",
    "2015": "Микроволновая печь",
    "2024": "Платная парковка",
    "2017": "Персональный компьютер",
    "2028": "Сигнализация",
    "2019": "Сауна",
    "2030": "Бронированные двери",
    "2021": "Электроплита",
    "2027": "Посудомоечная машина",
    "2029": "Кофеварка",
    "3001": "Подходит для детей/семей",
    "3002": "Можно курить",
    "3004": "Можно с домашними животными",
    "3005": "Здесь есть домашние животные",
    "3006": "Подходит людям с ограниченными возможностями"
  }
  public userEstates: any;
  public estateStatus: Boolean;

  constructor(private estateService: EstateService, private userService: UserService) { }

  public getListsForApproval(page: number) {
    this.confortProperty = [];
    this.securityProperty = [];
    this.estateLoad = true;
    this.currentPage = page;
    this.pageNumber = page - 1;
    this.estateService.getListsForApproval(this.pageNumber)
      .then((res) => {
        this.estateLoad = false;
        this.estateList = res.lists;
        this.estateStatus = !!this.estateList.length;
        this.setupPhotoGallery();
        this.totalPages = res.pageRequest.totalPages;
        if (this.estateList[0] && this.estateList[0].properties) {
          this.estateList[0].properties.forEach((prop) => {
            if (prop.id > 4000) {
              this.securityProperty.push(prop.id);
            } else {
              this.confortProperty.push(prop.id);
            }
          });
        }
        if (this.estateList[0]) {
          this.userService.getUserEstates(this.estateList[0].landlord.id)
            .then((res) => {
              this.userEstates = res;
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public approve(estateId: number) {
    let question = confirm('Подтвердить?');
    if (question) {
      this.estateService.approve(estateId)
        .then(() => {
          this.getListsForApproval(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public decline(estateId: number) {
    let question = confirm('Отклонить?');
    if (question) {
      this.estateService.decline(estateId)
        .then(() => {
          this.getListsForApproval(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public setupRegistrationDate(timestamp: number): string {
    let date = new Date(timestamp),
      day, month, year;
    date.getDate() < 10 ? day = '0' + date.getDate() : day = date.getDate();
    date.getMonth() + 1 < 10 ? month = '0' + (date.getMonth() + 1) : month = date.getMonth() + 1;
    date.getFullYear() < 10 ? year = '0' + date.getFullYear() : year = date.getFullYear();
    return day + '.' + month + '.' + year;
  }

  public setupPhotoGallery() {
    this.galleryImages = [];
    this.galleryOptions = [
      {
        fullWidth: true,
        imagePercent: 100,
        thumbnails: false,
        imageArrows: false,
        imageSize: NgxGalleryImageSize.Cover
      }
    ];
    if (this.estateList[0] && this.estateList[0].images[0]) {
      this.estateList[0].images.forEach((photo) => {
        this.galleryImages.push({ medium: photo.imageUrl, big: photo.imageUrl });
      });
    } else {
      this.galleryImages.push({
        medium: '../../../../assets/image/empty-photo.png',
        big: '../../../../assets/image/empty-photo.png'
      });
    }
  }


  ngOnInit() {
    this.getListsForApproval(1);
  }

}
