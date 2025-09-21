import {ComponentFixture, TestBed} from '@angular/core/testing';
import {App} from './app';
import {User, UserService} from './services/user-service';
import {signal} from '@angular/core';
import {HttpResourceRef} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatDialogHarness} from '@angular/material/dialog/testing';
import {of} from 'rxjs';
import {SharedModule} from './shared/shared-module';
import {RouterModule} from '@angular/router';
import {LogoutDialog} from './components/logout-dialog/logout-dialog';

describe('App', () => {
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let fixture: ComponentFixture<App>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    mockCookieService = jasmine.createSpyObj('CookieService', ['get']);

    mockUserService = jasmine.createSpyObj('UserService', ['fetchUser', 'logout']);
    mockUserService.fetchUser.and.returnValue({
        value: signal({name: 'Test User'}),
        isLoading: signal(false)
      } as unknown as HttpResourceRef<User | undefined>
    );

    await TestBed.configureTestingModule({
      declarations: [App, LogoutDialog],
      imports: [
        RouterModule.forRoot([]),
        SharedModule],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: CookieService, useValue: mockCookieService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create the app', () => {

    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Logged in as Test User');
  });

  it('should cancel the logout', async () => {
    mockUserService.logout.and.returnValue(of());
    const logoutButton = await loader.getHarness(MatButtonHarness.with({selector: '[aria-label="Logout"]'}));

    expect(logoutButton).toBeTruthy();

    fixture.detectChanges();

    await logoutButton.click();

    const dialogs = await loader.getAllHarnesses(MatDialogHarness);
    expect(dialogs.length).toBe(1);

    expect(await dialogs[0].getText()).toContain('Do you want to end the session?');

    const noButton = await loader.getHarness(MatButtonHarness.with({selector: '[data-test="cancel-logout"]'}));
    expect(noButton).toBeTruthy();
    await noButton.click();

    fixture.detectChanges();

    expect(await loader.getAllHarnesses(MatDialogHarness)).toHaveSize(0);

    expect(mockUserService.logout).not.toHaveBeenCalled();
  });

  it('should logout when clicking on the logout button', async () => {
    mockUserService.logout.and.returnValue(of());
    const logoutButton = await loader.getHarness(MatButtonHarness.with({selector: '[aria-label="Logout"]'}));

    expect(logoutButton).toBeTruthy();

    fixture.detectChanges();

    await logoutButton.click();

    const yesButton = await loader.getHarness(MatButtonHarness.with({selector: '[data-test="confirm-yes"]'}));
    expect(yesButton).toBeTruthy();
    await yesButton.click();

    fixture.detectChanges();

    expect(mockUserService.logout).toHaveBeenCalled();

    expect(await loader.getAllHarnesses(MatDialogHarness)).toHaveSize(0);

  });

});
