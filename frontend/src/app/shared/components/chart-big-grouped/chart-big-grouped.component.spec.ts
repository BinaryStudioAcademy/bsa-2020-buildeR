import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBigGroupedComponent } from './chart-big-grouped.component';

describe('ChartBigGroupedComponent', () => {
  let component: ChartBigGroupedComponent;
  let fixture: ComponentFixture<ChartBigGroupedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBigGroupedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBigGroupedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
