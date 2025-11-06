import {ComponentFixture, TestBed} from '@angular/core/testing';
import { App } from './app';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {HttpParams, provideHttpClient} from '@angular/common/http';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {FormsModule} from '@angular/forms';
import {environment} from '../environments/environment';

describe('Login Page', () => {
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let mockWindow: Partial<Window>;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<App>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    mockCookieService= jasmine.createSpyObj<CookieService>('CookieService', ['get']);
    mockWindow= { location : { 'href': '' } as Location};

    await TestBed.configureTestingModule({
      imports: [App, FormsModule],
      providers: [
        {provide: Window, useValue: mockWindow},
        {provide: CookieService, useValue: mockCookieService},
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    loader = TestbedHarnessEnvironment.loader(fixture);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render a username field', async() => {
    const usernameField = await loader.getHarness(MatInputHarness.with({selector: 'input[name="username"]'}));

    expect(usernameField).toBeTruthy();
    expect(await usernameField.getType()).toBe('text');
    expect(await usernameField.getName()).toBe('username');

  });

  it('should render a password field', async() => {
    const passwordField = await loader.getHarness(MatInputHarness.with({selector: 'input[name="password"]'}));

    expect(passwordField).toBeTruthy();
    expect(await passwordField.getType()).toBe('password');
    expect(await passwordField.getName()).toBe('password');
  });

  it('should reveal the password field', async() => {
    const toggleButton = await loader.getHarness(MatButtonHarness.with({selector: 'button[data-test="togglePassword"]'}));

    expect(toggleButton).toBeTruthy();

    const toggleButtonElement = await toggleButton.host();
    toggleButtonElement.dispatchEvent('click', {pointerType: 'mouse'});

    fixture.detectChanges();

    const passwordField = await loader.getHarness(MatInputHarness.with({selector: 'input[name="password"]'}));
    expect(await passwordField.getType()).toBe('text');
  });

  it('should login successfully', async () => {
    mockCookieService.get.and.returnValue('dummy-csrf-token');

    const usernameField = await loader.getHarness(MatInputHarness.with({selector: 'input[name="username"]'}));
    await usernameField.setValue('testuser');

    const passwordField = await loader.getHarness(MatInputHarness.with({selector: 'input[name="password"]'}));
    await passwordField.setValue('testpassword');

    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: 'button[type="submit"]'}));
    await submitButton.click();

    const req = httpTesting.expectOne(`${environment.context}/login`);
    req.flush({status: 200});
    expect(req.request.method).toBe('POST');

    const payload = new HttpParams()
      .set('username', 'testuser')
      .set('password', 'testpassword');
    expect(req.request.body).toEqual(payload);

    expect(req.request.headers.get('X-XSRF-TOKEN')).toBe('dummy-csrf-token');

    expect(mockWindow?.location?.href).toBe(`${environment.context}/`);
  });

  it('should not redirect if login failed', async () => {
    mockCookieService.get.and.returnValue('dummy-csrf-token');

    const usernameField = await loader.getHarness(MatInputHarness.with({selector: 'input[name="username"]'}));
    await usernameField.setValue('testuser');

    const passwordField = await loader.getHarness(MatInputHarness.with({selector: 'input[name="password"]'}));
    await passwordField.setValue('testpassword');

    const submitButton = await loader.getHarness(MatButtonHarness.with({selector: 'button[type="submit"]'}));
    await submitButton.click();

    const req = httpTesting.expectOne(`${environment.context}/login`);
    req.flush('', {status: 404, statusText: 'error'});
    expect(req.request.method).toBe('POST');

    expect(mockWindow?.location?.href).not.toBe(`${environment.context}/`);
  });

});
