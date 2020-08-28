import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProjectsComponent } from './group-projects.component';

describe('GroupProjectsComponent', () => {
  let component: GroupProjectsComponent;
  let fixture: ComponentFixture<GroupProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
