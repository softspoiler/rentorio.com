import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input('show') public show: Boolean;
  @Input('insideOverlay') public insideOverlay: Boolean;
  constructor() { }

  ngOnInit() {
  }

}
