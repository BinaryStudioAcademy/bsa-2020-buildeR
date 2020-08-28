import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialSettingsComponent } from './credential-settings.component';

describe('CredentialSettingsComponent', () => {
  let component: CredentialSettingsComponent;
  let fixture: ComponentFixture<CredentialSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredentialSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
