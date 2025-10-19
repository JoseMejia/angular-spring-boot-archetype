import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error-service';
import {take} from 'rxjs';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('error should be initially undefined', (done) => {
    service.getError().pipe(take(1))
      .subscribe(data => {
        expect(data).toBeUndefined();
        done();
      });
  });

  it('error should be error value', (done) => {
    const error = new Error('hello');
    service.setError(error);
    service.getError().pipe(take(1))
      .subscribe(data => {
        expect(data).toBe(error);
        done();
      });
  });

  it('error should be cleared to undefined', (done) => {
    const error = new Error('hello');
    service.setError(error);
    service.clearError();
    service.getError().pipe(take(1))
      .subscribe(data => {
        expect(data).toBe(undefined);
        done();
      });
  });
});
