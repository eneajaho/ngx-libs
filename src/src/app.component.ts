import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './header.component';
import { SearchComponent } from './search.component';
import { SupportTableComponent } from './support-table.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { SupportGridComponent } from './support-grid.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>

    <div style="padding: 20px;">
      <div style="display: grid; grid-template-columns: 3fr 1fr ;">
        <app-search style="margin: 20px 0"></app-search>
        <div style="display: flex; justify-content: end; align-items: center">
          <mat-button-toggle-group [(value)]="showType" aria-label="Show type">
            <mat-button-toggle value="grid">
              <mat-icon>apps</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="table">
              <mat-icon>view_list</mat-icon>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </div>

      <app-support-table *ngIf="showType === 'table'"></app-support-table>
      <app-support-grid *ngIf="showType === 'grid'"></app-support-grid>
    </div>

    <app-footer></app-footer>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    HeaderComponent,
    SearchComponent,
    SupportTableComponent,
    SupportGridComponent,
    MatButtonToggleModule,
    MatIconModule,
    FooterComponent,
  ],
})
export class AppComponent {
  showType: 'grid' | 'table' = 'table';

  constructor() {
    // if is mobile, show grid by default
    if (window.innerWidth < 600) {
      this.showType = 'grid';
    }
  }
}
