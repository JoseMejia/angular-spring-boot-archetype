import {CSP_NONCE, NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {SharedModule} from './shared/shared-module';
import {LogoutDialog} from './components/logout-dialog/logout-dialog';
import {App} from './app';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing-module';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withXsrfConfiguration} from '@angular/common/http';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {ErrorMessage} from './components/error-message/error-message';
import {environment} from '../environments/environment';


function getCookie(name: string) {
  return (document.cookie).split(`; ${name}=`).pop()?.split(';')[0];
}

@NgModule({
  declarations: [
    App,
    ErrorMessage,
    LogoutDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    LoggerModule.forRoot({
      serverLoggingUrl: `${environment.context}/api/logs/v1`,
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.INFO
    })
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,
      withComponentInputBinding()),
    provideHttpClient(
      withXsrfConfiguration({cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN'})
    ),
    {
      provide: CSP_NONCE,
      useValue: getCookie('CSP-NONCE')
    },
  ],
  bootstrap: [App]
})
export class AppModule {
}
