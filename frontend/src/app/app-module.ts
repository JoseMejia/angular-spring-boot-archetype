import {
  CSP_NONCE,
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {SharedModule} from './shared/shared-module';
import {LogoutDialog} from './components/logout-dialog/logout-dialog';
import {App} from './app';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing-module';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';


function getCookie(name: string) {
  return (document.cookie).split(`; ${name}=`).pop()?.split(';')[0];
}
@NgModule({
  declarations: [
    App,
    LogoutDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,
      withComponentInputBinding()),
    provideHttpClient(),
    {
      provide: CSP_NONCE,
      useValue: getCookie('CSP-NONCE')
    }
  ],
  bootstrap: [App]
})
export class AppModule {
}
