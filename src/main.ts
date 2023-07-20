import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (location.hostname === 'ngx-libs.netlify.app') {
  location.href = 'https://ngx-libs.com' + location.pathname;
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
