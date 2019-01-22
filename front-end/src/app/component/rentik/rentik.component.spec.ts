import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentikComponent } from './rentik.component';

describe('RentikComponent', () => {
  let component: RentikComponent;
  let fixture: ComponentFixture<RentikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
