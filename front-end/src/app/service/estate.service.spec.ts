/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EstateService } from './estate.service';

describe('EstateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstateService]
    });
  });

  it('should ...', inject([EstateService], (service: EstateService) => {
    expect(service).toBeTruthy();
  }));
});
