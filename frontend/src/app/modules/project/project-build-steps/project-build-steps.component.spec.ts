import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBuildStepsComponent } from './project-build-steps.component';

describe('ProjectBuildStepsComponent', () => {
  let component: ProjectBuildStepsComponent;
  let fixture: ComponentFixture<ProjectBuildStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBuildStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBuildStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
