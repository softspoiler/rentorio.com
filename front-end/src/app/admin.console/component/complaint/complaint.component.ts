import { ComplaintService } from './../../service/complaint.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['../common.css', './complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  public complaints: Object[];
  public showFullMessage: Boolean;
  public fullMessage: String;
  public showUserProfile: Boolean;
  public userId: Number;
  public totalPages: number;
  public currentPage: number = 1;
  public complaintsType: String = '';
  public updateTable: Boolean;
  public noSuchUserException: Boolean;
  public filter: any = {
    onLandlords: true,
    type: '',
    userId: null,
    pageNumber: 0,
    pageSize: 10
  };

  constructor(private complaintsService: ComplaintService) { }

  ngOnInit() {
    this.getComplaints(1);
  }

  public getComplaints(page: number) {
    this.updateTable = true;
    this.currentPage = page;
    this.filter.pageNumber = page - 1;
    this.complaintsService.getComplaints(this.filter)
      .then((res) => {
        this.noSuchUserException = false;
        this.totalPages = res.pageRequest.totalPages;
        this.complaints = res.complaints;
        this.updateTable = false;
      })
      .catch((err) => {
        if (err.message === 'NoSuchUserException') {
          this.noSuchUserException = true;
        } else {
          console.log(err);
        }
      });
  }

  public blockUser(accusedId, accuserId) {
    let question = confirm(`Вы Уверены что хотите ЗАБЛОКИРОВАТЬ пользователя ID:${accusedId}, по жалобе от ID:${accuserId}?`);
    if (question) {
      this.complaintsService.blockUser(accusedId)
        .then((res) => {
          this.getComplaints(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public unBlockUser(userId) {
    let question = confirm(`Вы Уверены что хотите СНЯТЬ блокировку с пользователя ID:${userId}?`);
    if (question) {
      this.complaintsService.unBlockUser(userId)
        .then((res) => {
          this.getComplaints(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public complaintViewed(complaintId) {
    let question = confirm('Вы Уверены что хотите позначить как ПОСМОТРЕНО?');
    if (question) {
      this.complaintsService.complaintViewed(complaintId)
        .then((res) => {
          this.getComplaints(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public setupReadableComplaintDate(timestamp: number): string {
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
}
