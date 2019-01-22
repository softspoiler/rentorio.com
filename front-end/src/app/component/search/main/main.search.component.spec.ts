import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSearchComponent } from './main.search.component';

describe('MainComponent', () => {
  let component: MainSearchComponent;
  let fixture: ComponentFixture<MainSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
