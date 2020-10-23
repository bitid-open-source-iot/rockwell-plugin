import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatQrcodeComponent } from './mat-qrcode.component';

describe('MatQrcodeComponent', () => {
  let component: MatQrcodeComponent;
  let fixture: ComponentFixture<MatQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
