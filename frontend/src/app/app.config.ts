import {
  ApplicationConfig,
  CSP_NONCE,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

function getCookie(name: string) {
  return (document.cookie).split(`; ${name}=`).pop()?.split(';')[0];
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: CSP_NONCE,
      useValue: getCookie('CSP-NONCE')
    }
  ]
};
