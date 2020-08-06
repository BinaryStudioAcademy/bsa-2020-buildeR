import { TestBed } from '@angular/core/testing';

import { ToastrNotificationsService } from './toastr-notifications.service';

describe('ToastrNotificationsService', () => {
  let service: ToastrNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
