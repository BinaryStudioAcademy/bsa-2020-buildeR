import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawLogsComponent } from './raw-logs.component';

describe('RawLogsComponent', () => {
  let component: RawLogsComponent;
  let fixture: ComponentFixture<RawLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
