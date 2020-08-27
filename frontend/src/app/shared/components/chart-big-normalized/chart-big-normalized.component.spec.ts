import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBigNormalizedComponent } from './chart-big-normalized.component';

describe('ChartBigNormalizedComponent', () => {
  let component: ChartBigNormalizedComponent;
  let fixture: ComponentFixture<ChartBigNormalizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBigNormalizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBigNormalizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
