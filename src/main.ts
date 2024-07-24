import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppConfig } from './app//app.confing';
import { environment } from './environments/environment';
import 'leaflet';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppConfig)
  .catch(err => console.error(err));
