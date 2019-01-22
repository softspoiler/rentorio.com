import { LogoutService } from './logout.service';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';


describe('Service: Logout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogoutService]
    });
  });

  it('should ...', inject([LogoutService], (service: LogoutService) => {
    expect(service).toBeTruthy();
  }));
});