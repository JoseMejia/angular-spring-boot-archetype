import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessage } from './error-message';
import {ErrorService} from '../../services/error-service';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';

describe('ErrorMessage', () => {
  let component: ErrorMessage;
  let fixture: ComponentFixture<ErrorMessage>;
  const mockErrorService: jasmine.SpyObj<ErrorService> =
    jasmine.createSpyObj('errorService', ['setError', 'getError']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessage],
      providers: [
        {
          provide: ErrorService,
          useValue: mockErrorService
        }
      ]
    })
    .compileComponents();

    mockErrorService.getError.and.returnValue(of(undefined));

    fixture = TestBed.createComponent(ErrorMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render message for no error', () => {
    const message = fixture.debugElement.query(By.css('[data-test="error-message"]'));
    expect(message).toBeFalsy();
  });

  it('should render message', () => {
    mockErrorService.getError.and.returnValue(of({message: 'hello'} as Error));

    component.ngOnInit();

    fixture.detectChanges();

    expect(component.errorMessage()).toBe('hello');
    const message = fixture.debugElement.query(By.css('[data-test="error-message"]'));
    expect(message).toBeTruthy();
    expect(message.nativeElement.textContent).toBe('hello');
  });
});
