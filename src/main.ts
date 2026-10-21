import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';

import { AppModule } from './app/app.module';
import { initializeSentry } from './app/sentry';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

initializeSentry(environment);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    Sentry.captureException(err);
    console.error(err);
    throw err;
  });
