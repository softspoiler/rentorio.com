/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnsupportedBrowser } from './unsupported.browser.component';

describe('DownloadComponent', () => {
  let component: UnsupportedBrowser;
  let fixture: ComponentFixture<UnsupportedBrowser>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedBrowser ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedBrowser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
