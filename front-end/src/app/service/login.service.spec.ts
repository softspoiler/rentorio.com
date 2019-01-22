import { LoginService } from './login.service';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';


describe('Service: Login', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginService]
    });
  });

  it('should ...', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));
});