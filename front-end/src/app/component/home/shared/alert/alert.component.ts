import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() show: Boolean;
  @Input() type: string;
  @Input() title: string;
  @Input() text: string;
  @Input() textSize: string;
  @Output() clicked = new EventEmitter();

  constructor() { }

  close() {
    this.show = false;
    this.clicked.emit();
  }

  ngOnInit() {
  }
}
