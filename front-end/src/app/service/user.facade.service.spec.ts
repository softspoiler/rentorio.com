/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserFacadeService } from './user.facade.service';

describe('Service: User.fake.facade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFacadeService]
    });
  });

  it('should ...', inject([UserFacadeService], (service: UserFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
