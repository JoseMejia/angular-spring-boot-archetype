import {TestBed} from '@angular/core/testing';
import {App} from './app';
import {User, UserService} from './services/user-service';
import {signal} from '@angular/core';
import {HttpResourceRef} from '@angular/common/http';

describe('App', () => {

  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['fetchUser']);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {provide: UserService, useValue: spy},
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    userServiceSpy.fetchUser.and.returnValue({
        value: signal({name: 'Test User'}),
        isLoading: signal(false)
      } as unknown as HttpResourceRef<User | undefined>
    );

    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Logged in as Test User');
  });

});
