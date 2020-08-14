import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTriggersComponent } from './project-triggers.component';

describe('ProjectTriggersComponent', () => {
  let component: ProjectTriggersComponent;
  let fixture: ComponentFixture<ProjectTriggersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTriggersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
