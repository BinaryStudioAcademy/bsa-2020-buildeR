import { TestBed } from '@angular/core/testing';

import { ImgageHeaderService } from './imgage-header-service.service';

describe('ImgageHeaderServiceService', () => {
  let service: ImgageHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgageHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
