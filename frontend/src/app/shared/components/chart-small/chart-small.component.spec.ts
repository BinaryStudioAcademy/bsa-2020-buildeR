import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSmallComponent } from './chart-small.component';

describe('ChartSmallComponent', () => {
  let component: ChartSmallComponent;
  let fixture: ComponentFixture<ChartSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
