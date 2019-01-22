import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatesComponent } from './estates.component';

describe('EstatesComponent', () => {
  let component: EstatesComponent;
  let fixture: ComponentFixture<EstatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
