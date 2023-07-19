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
      <a
        mat-button
        href="https://github.com/eneajaho/ngx-libs/blob/master/src/src/libs.data.ts"
        target="_blank"
        class="example-icon favorite-icon"
        aria-label="Example icon-button with heart icon"
      >
        <mat-icon>edit</mat-icon>
        Update Data
      </a>
      <a
        href="https://github.com/eneajaho/ngx-libs"
        target="_blank"
        mat-icon-button
        class="example-icon"
        aria-label="Github icon"
      >
        <img
          src="assets/github-white.svg"
          width="25"
          style="margin-right: 5px;"
          alt="Github link"
        />
      </a>
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
