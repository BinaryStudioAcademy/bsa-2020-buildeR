import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubAuthEndpointComponent } from './github-auth-endpoint.component';

describe('GithubAuthEndpointComponent', () => {
  let component: GithubAuthEndpointComponent;
  let fixture: ComponentFixture<GithubAuthEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubAuthEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubAuthEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
