import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// redirect to https://ngx-libs.com if it's not that domain or localhost
if (location.hostname !== 'ngx-libs.com' && location.hostname !== 'localhost') {
  location.href = 'https://ngx-libs.com' + location.pathname;
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
