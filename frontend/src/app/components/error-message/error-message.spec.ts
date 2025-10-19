import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorMessage} from './error-message';
import {ErrorService} from '../../services/error-service';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {SharedModule} from '../../shared/shared-module';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatButtonHarness} from '@angular/material/button/testing';

describe('ErrorMessage', () => {
  let component: ErrorMessage;
  let fixture: ComponentFixture<ErrorMessage>;
  let loader: HarnessLoader;
  const mockErrorService: jasmine.SpyObj<ErrorService> =
    jasmine.createSpyObj('errorService', ['setError', 'getError']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessage],
      imports: [SharedModule],
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
    loader = TestbedHarnessEnvironment.loader(fixture);
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

  it('should clear message', async () => {
    mockErrorService.getError.and.returnValue(of({message: 'hello'} as Error));

    component.ngOnInit();

    fixture.detectChanges();

    expect(component.errorMessage()).toBe('hello');

    const clearButton = await loader.getHarness(MatButtonHarness.with({selector: '.cancel-icon'}));
    await clearButton?.click()

    fixture.detectChanges();

    expect(component.errorMessage()).toBeFalsy();

    const message = fixture.debugElement.query(By.css('[data-test="error-message"]'));
    expect(message).toBeFalsy();
  });
});
