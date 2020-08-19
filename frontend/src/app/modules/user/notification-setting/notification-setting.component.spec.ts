import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSettingComponent } from './notification-setting.component';

describe('NotificationSettingComponent', () => {
  let component: NotificationSettingComponent;
  let fixture: ComponentFixture<NotificationSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
