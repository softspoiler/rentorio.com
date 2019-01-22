/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EstatePricesComponent } from './estate.prices.component';

describe('PricesComponent', () => {
  let component: EstatePricesComponent;
  let fixture: ComponentFixture<EstatePricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatePricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatePricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
