import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishComponent } from './wish.component';

describe('WishlistComponent', () => {
  let component: WishComponent;
  let fixture: ComponentFixture<WishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
