import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialog } from './error-dialog';
import {SharedModule} from '../../shared/shared-module';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('ErrorDialog', () => {
  let component: ErrorDialog;
  let fixture: ComponentFixture<ErrorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorDialog],
      imports: [SharedModule],
      providers: [{
        provide: MAT_DIALOG_DATA, useValue: {}
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
