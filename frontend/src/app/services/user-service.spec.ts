import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {UserService} from './user-service';
import {provideHttpClient} from '@angular/common/http';
import {ApplicationRef, Injector} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

describe('UserService', () => {
  let service: UserService;
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    mockCookieService = jasmine.createSpyObj('CookieService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: CookieService, useValue: mockCookieService},
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);

    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchUser', () => {

    it('should use httpResource to fetch user data', async () => {
      const response = service.fetchUser({injector: TestBed.inject(Injector)});

      TestBed.tick();

      const req = httpTesting.expectOne('/api/users/v1.0/current', 'Request to load the user');
      expect(req.request.method).toBe('GET');
      req.flush({name: 'Test User'});

      await TestBed.inject(ApplicationRef).whenStable();

      expect(response.value()).toEqual({name: 'Test User'});
    });
  });

  describe('logout', () => {
    it('should send POST request to /logout with CSRF token', () => {
      mockCookieService.get.and.returnValue('dummy-csrf-token');

      service.logout().subscribe();

      const req = httpTesting.expectOne('/logout', 'POST request to /logout');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('X-XSRF-TOKEN')).toBe('dummy-csrf-token');

      req.flush({}, {status: 200, statusText: 'OK'});
    });

    it('should send POST request with "none" as csrf default value', () => {
      mockCookieService.get.and.returnValue('');

      service.logout().subscribe();

      const req = httpTesting.expectOne('/logout', 'POST request to /logout');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('X-XSRF-TOKEN')).toBe('none');

      req.flush({}, {status: 200, statusText: 'OK'});
    });
  });
});
