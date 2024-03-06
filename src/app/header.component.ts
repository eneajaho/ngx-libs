import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div style="display: flex; align-items:center; gap: 4px;">
        <button
          mat-icon-button
          class="example-icon"
          aria-label="Example icon-button with menu icon"
        >
          <mat-icon>support</mat-icon>
        </button>
        <span>Angular Libraries Support</span>
      </div>
      <span class="example-spacer"></span>
      <div style="display: flex; align-items:center; gap: 8px;">
        <button mat-button type="button" (click)="checkPackageJson()">
          <mat-icon>assignment_turned_in</mat-icon>
          Check package.json
        </button>
        <a
          mat-button
          href="https://github.com/eneajaho/ngx-libs/blob/master/src/assets/library-support-data.json"
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
      </div>
    </mat-toolbar>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }

      @media (max-width: 640px) {
        .toolbar {
          flex-direction: column;
          height: auto;
        }
      }
    `,
  ],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})
export class HeaderComponent {
  dialog = inject(MatDialog);

  async checkPackageJson() {
    const { CheckPackageJsonModalComponent } = await import(
      './check-package-json.modal'
    );
    this.dialog.open(CheckPackageJsonModalComponent, {
      minWidth: 500,
    });
  }
}
