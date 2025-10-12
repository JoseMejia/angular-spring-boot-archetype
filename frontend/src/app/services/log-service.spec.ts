import { TestBed } from '@angular/core/testing';

import { LogService } from './log-service';
import {LoggerTestingModule} from 'ngx-logger/testing';
import {NGXLogger} from 'ngx-logger';

describe('LogService', () => {
  let service: LogService;
  let logger: NGXLogger;
  const mockCookieService = jasmine.createSpyObj('CookieService', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      providers: [
        LogService,
        {provide: 'CookieService', useValue: mockCookieService}
      ]
    });
    service = TestBed.inject(LogService);
    logger = TestBed.inject(NGXLogger);
    mockCookieService.get.and.returnValue('dummy-csrf-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should log info messages', () => {
    spyOn(logger, 'info').and.callThrough();

    service.info('Info message');

    expect(logger.info).toHaveBeenCalledWith('Info message');
  });
  it('should log warn messages', () => {
    spyOn(logger, 'warn').and.callThrough();

    service.warn('Warn message');

    expect(logger.warn).toHaveBeenCalledWith('Warn message');
  });
  it('should log error messages', () => {
    spyOn(logger, 'error').and.callThrough();

    service.error('Error message');

    expect(logger.error).toHaveBeenCalledWith('Error message');
  });
  it('should log debug messages', () => {
    spyOn(logger, 'debug').and.callThrough();

    service.debug('Debug message');

    expect(logger.debug).toHaveBeenCalledWith('Debug message');
  });
});
