import { TestBed } from '@angular/core/testing';

import { BittrexApiService } from './bittrex-api.service';

describe('BittrexApiService', () => {
  let service: BittrexApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BittrexApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
