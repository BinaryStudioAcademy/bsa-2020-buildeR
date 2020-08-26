import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvVarsEditorComponent } from './env-vars-editor.component';

describe('EnvVarsEditorComponent', () => {
  let component: EnvVarsEditorComponent;
  let fixture: ComponentFixture<EnvVarsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvVarsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvVarsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
