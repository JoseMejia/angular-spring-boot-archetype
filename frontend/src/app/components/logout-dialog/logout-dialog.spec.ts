import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutDialog } from './logout-dialog';
import {SharedModule} from '../../shared/shared-module';

describe('LogoutDialog', () => {
  let component: LogoutDialog;
  let fixture: ComponentFixture<LogoutDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoutDialog],
      imports: [SharedModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should render text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Do you want to end the session?');
  });

  it('should render two buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    expect(buttons[0].textContent?.trim()).toBe('No');
    expect(buttons[1].textContent?.trim()).toBe('Yes');
  });
});
