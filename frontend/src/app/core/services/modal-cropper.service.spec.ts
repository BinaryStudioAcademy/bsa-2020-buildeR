import { TestBed } from '@angular/core/testing';

import { ModalCropperService } from './modal-cropper.service';

describe('ModalCropperService', () => {
  let service: ModalCropperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCropperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
