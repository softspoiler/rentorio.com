/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EstateAmenityComponent } from './estate.amenity.component';

describe('EstateAmenityComponent', () => {
  let component: EstateAmenityComponent;
  let fixture: ComponentFixture<EstateAmenityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateAmenityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
