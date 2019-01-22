import { PlayerComponent } from './../player/player.component';
import { CallsService } from './../../service/calls.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['../common.css', './calls.component.css']
})
export class CallsComponent implements OnInit {
  calls: Object[];
  totalPages: number;
  currentPage: number = 1;
  filter: any = {
    userId: null,
    phoneNumber: '',
    duration: null,
    pageNumber: 0,
    pageSize: 10
  }
  @ViewChild(PlayerComponent) playerComponent: PlayerComponent;
  updateTable: Boolean;
  noSuchUserException: Boolean;

  constructor(private callsService: CallsService) { }

  getCalls(page: number) {
    this.noSuchUserException = false;
    this.updateTable = true;
    this.filter.pageNumber = page - 1;
    this.currentPage = page;
    this.callsService.getCalls(this.filter)
      .then((res) => {
        this.totalPages = res.pageRequest.totalPages;
        this.calls = res.calls;
        this.updateTable = false;
      })
      .catch((err) => {
        this.updateTable = false;
        if (err.message === 'NoSuchUserException') {
          this.noSuchUserException = true;
        } else {
          console.log(err);
        }
      });
  }

  setupReadableDate(timestamp: number): string {
    let date = new Date(timestamp),
      day, month, year, hours, minutes, seconds;
    date.getHours() < 10 ? hours = '0' + date.getHours() : hours = date.getHours();
    date.getMinutes() < 10 ? minutes = '0' + date.getMinutes() : minutes = date.getMinutes();
    date.getSeconds() < 10 ? seconds = '0' + date.getSeconds() : seconds = date.getSeconds();
    date.getDate() < 10 ? day = '0' + date.getDate() : day = date.getDate();
    date.getMonth() + 1 < 10 ? month = '0' + (date.getMonth() + 1) : month = date.getMonth() + 1;
    date.getFullYear() < 10 ? year = '0' + date.getFullYear() : year = date.getFullYear();
    return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  showPlayer(id: string) {
    this.playerComponent.play(id, true);
  }

  clearFilter() {
    this.filter = {
      userId: null,
      phoneNumber: '',
      duration: null,
      pageNumber: 0,
      pageSize: 10
    };
    this.getCalls(1);
  }

  resetActiveCall(id: number) {
    let question = confirm(`Вы уверены что хотите сбросить звонок ID: ${id}`);
    if (question) {
      this.callsService.resetActiveCall(id)
        .then(() => {
          this.getCalls(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  searchByPhoneNumber(phoneNumber: string) {
    this.filter.phoneNumber = phoneNumber;
    this.getCalls(1);
  }

  ngOnInit() {
    this.getCalls(1)
  }

}
