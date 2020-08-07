import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronBuilderComponent } from './cron-builder.component';

describe('CronBuilderComponent', () => {
  let component: CronBuilderComponent;
  let fixture: ComponentFixture<CronBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
