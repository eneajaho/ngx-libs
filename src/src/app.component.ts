import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './header.component';
import { SearchComponent } from './search.component';
import { SupportTableComponent } from './support-table.component';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>

    <div style="padding: 20px;">
      <app-search></app-search>
      <app-support-table></app-support-table>
    </div>
  `,
  standalone: true,
  imports: [HeaderComponent, SearchComponent, SupportTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
