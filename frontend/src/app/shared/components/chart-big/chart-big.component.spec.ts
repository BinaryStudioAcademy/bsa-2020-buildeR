import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBigComponent } from './chart-big.component';

describe('ChartBigComponent', () => {
  let component: ChartBigComponent;
  let fixture: ComponentFixture<ChartBigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
