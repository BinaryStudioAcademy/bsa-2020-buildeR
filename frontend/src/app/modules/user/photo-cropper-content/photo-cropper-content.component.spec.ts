import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCropperContentComponent } from './photo-cropper-content.component';

describe('PhotoCropperContentComponent', () => {
  let component: PhotoCropperContentComponent;
  let fixture: ComponentFixture<PhotoCropperContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoCropperContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCropperContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
