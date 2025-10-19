import {inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private logger: NGXLogger;
  private cookieService;

  constructor() {
    this.logger = inject(NGXLogger);
    this.cookieService = inject(CookieService);
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  debug(msg: string, ...optionalParams: any[]): void {
    this.logWith(LogLevel.Debug, msg, ...optionalParams);
  }

  info(msg: string, ...optionalParams: any[]): void {
    this.logWith(LogLevel.Info, msg, ...optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]): void {
    this.logWith(LogLevel.Warn, msg, ...optionalParams);
  }

  error(msg: string, ...optionalParams: any[]): void {
    this.logWith(LogLevel.Error, msg, ...optionalParams);
  }

  private logWith(level: LogLevel, msg: string, ...optionalParams: any[]): void {
    const cookie = this.cookieService.get('XSRF-TOKEN') || 'none';
    const headers = new HttpHeaders().set('X-XSRF-TOKEN', cookie);
    this.logger.partialUpdateConfig({
      customHttpHeaders: headers
    });
    switch (level) {
      case LogLevel.Debug:
        this.logger.debug(msg, ...optionalParams);
        return console.debug(msg, ...optionalParams);
      case LogLevel.Info:
        this.logger.info(msg, ...optionalParams);
        return console.info('%c' + msg, 'color: #6495ED', ...optionalParams);
      case LogLevel.Warn:
        this.logger.warn(msg, ...optionalParams);
        return console.warn('%c' + msg, 'color: #FF8C00', ...optionalParams);
      case LogLevel.Error:
        this.logger.error(msg, ...optionalParams);
        return console.error('%c' + msg, 'color: #DC143C', ...optionalParams);
      default:
        this.logger.debug(msg, ...optionalParams);
        return console.debug(msg);
    }
  }
}
