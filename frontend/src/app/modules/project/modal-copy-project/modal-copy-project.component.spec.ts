import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCopyProjectComponent } from './modal-copy-project.component';

describe('ModalCopyProjectComponent', () => {
  let component: ModalCopyProjectComponent;
  let fixture: ComponentFixture<ModalCopyProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCopyProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCopyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
