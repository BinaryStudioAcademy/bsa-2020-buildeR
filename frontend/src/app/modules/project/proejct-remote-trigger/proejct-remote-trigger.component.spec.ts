import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProejctRemoteTriggerComponent } from './proejct-remote-trigger.component';

describe('ProejctRemoteTriggerComponent', () => {
  let component: ProejctRemoteTriggerComponent;
  let fixture: ComponentFixture<ProejctRemoteTriggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProejctRemoteTriggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProejctRemoteTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
