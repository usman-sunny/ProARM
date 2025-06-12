import { TestBed } from '@angular/core/testing';

import { StupidDataService } from './stupid-data.service';

describe('StupidDataService', () => {
  let service: StupidDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StupidDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
