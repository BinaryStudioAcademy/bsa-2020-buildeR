import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectResolverComponent } from './project-resolver.component';

describe('ProjectResolverComponent', () => {
  let component: ProjectResolverComponent;
  let fixture: ComponentFixture<ProjectResolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectResolverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
