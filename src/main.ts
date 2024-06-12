import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppConfig } from './app/app.confing';

platformBrowserDynamic().bootstrapModule(AppConfig)
  .catch(err => console.error(err));

