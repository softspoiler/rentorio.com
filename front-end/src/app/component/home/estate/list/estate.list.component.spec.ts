/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EstateListComponent } from './estate.list.component';

describe('ListComponent', () => {
  let component: EstateListComponent;
  let fixture: ComponentFixture<EstateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
