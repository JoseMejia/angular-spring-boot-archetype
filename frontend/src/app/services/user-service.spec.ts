import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import { UserService} from './user-service';
import {provideHttpClient} from '@angular/common/http';
import {ApplicationRef, Injector} from '@angular/core';


describe('UserService', () => {
  let service: UserService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);

    service = TestBed.inject(UserService);
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

      httpTesting.verify();
    });

  });
});
