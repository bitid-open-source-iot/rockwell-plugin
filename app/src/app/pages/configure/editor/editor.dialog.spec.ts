import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEditorDialog } from './editor.dialog';

describe('InputEditorDialog', () => {
  let component: InputEditorDialog;
  let fixture: ComponentFixture<InputEditorDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputEditorDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
