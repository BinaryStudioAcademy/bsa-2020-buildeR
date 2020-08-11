import { TestBed } from '@angular/core/testing';

import { ProjectResolverService } from './project-resolver.service';

describe('ProjectResolverService', () => {
  let service: ProjectResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
