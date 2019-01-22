import { TestBed, inject } from '@angular/core/testing';

import { ResetPasswordService } from './reset.password.service';

describe('ResetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResetPasswordService]
    });
  });

  it('should be created', inject([ResetPasswordService], (service: ResetPasswordService) => {
    expect(service).toBeTruthy();
  }));
});
