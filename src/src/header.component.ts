import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">
      <button
        mat-icon-button
        class="example-icon"
        aria-label="Example icon-button with menu icon"
      >
        <mat-icon>support</mat-icon>
      </button>
      <span>Angular Libraries Support</span>
      <span class="example-spacer"></span>
      <button
        mat-icon-button
        class="example-icon favorite-icon"
        aria-label="Example icon-button with heart icon"
      >
        <mat-icon>favorite</mat-icon>
      </button>
      <button
        mat-icon-button
        class="example-icon"
        aria-label="Example icon-button with share icon"
      >
        <mat-icon>share</mat-icon>
      </button>
    </mat-toolbar>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }
    `,
  ],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})
export class HeaderComponent {}
