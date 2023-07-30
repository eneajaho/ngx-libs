import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ContributorsComponent } from './contributors/contributors.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';
import { SearchComponent } from './search.component';
import { SupportGridComponent } from './support-grid.component';
import { SupportTableComponent } from './support-table.component';

@Component({
  selector: 'app-root',
  template: `
    <app-header />

    <div style="padding: 20px;">
      <div class="toolbar-container">
        <app-search />
        <div style="display: flex; justify-content: end; align-items: start">
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

      <app-support-table *ngIf="showType === 'table'" />
      <app-support-grid *ngIf="showType === 'grid'" />
      <app-contributors />
    </div>

    <app-footer />
  `,
  styles: [
    `
      .toolbar-container {
        display: grid;
        grid-template-columns: 3fr 1fr;
        margin: 24px 0;
      }
      @media (max-width: 640px) {
        .toolbar-container {
          grid-template-columns: 1fr;
          justify-content: center;
          align-items: center;
        }
      }
    `,
  ],
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
    ContributorsComponent,
  ],
})
export class AppComponent {
  showType: 'grid' | 'table' = 'table';

  constructor() {
    const breakpointObserver = inject(BreakpointObserver);
    // if is mobile, show grid by default
    if (breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.showType = 'grid';
    }
  }
}
