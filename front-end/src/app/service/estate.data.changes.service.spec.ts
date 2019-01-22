/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EstateDataChangesService } from './estate.data.changes.service';

describe('Service: Estate.data.changes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstateDataChangesService]
    });
  });

  it('should ...', inject([EstateDataChangesService], (service: EstateDataChangesService) => {
    expect(service).toBeTruthy();
  }));
});