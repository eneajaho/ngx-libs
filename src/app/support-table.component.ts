import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReplaceStringPipe } from './replace-string.pipe';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-support-table',
  template: `
    <div class="table-container mat-elevation-z2">
      <table mat-table [dataSource]="state.filteredData()">
        <ng-container matColumnDef="name" sticky>
          <th mat-header-cell *matHeaderCellDef>
            <div style="display: flex; align-items: center;">
              <img
                src="assets/npm.png"
                width="30"
                style="margin-right: 5px;"
                alt="Npm link"
              />
              <span>package name</span>
            </div>
          </th>
          <td mat-cell *matCellDef="let row">
            <a mat-button color="primary" [href]="row.npmUrl" target="_blank">
              {{ row.name }}
              <mat-icon>link</mat-icon>
            </a>
          </td>
        </ng-container>
        <ng-container matColumnDef="githubUrl">
          <th mat-header-cell *matHeaderCellDef>
            <div style="display: flex; align-items: center;">
              <img
                src="assets/github.svg"
                width="25"
                style="margin-right: 5px;"
                alt="Github link"
              />
              <span>Github</span>
            </div>
          </th>
          <td mat-cell *matCellDef="let row">
            <a
              mat-button
              color="primary"
              [href]="row.githubUrl"
              target="_blank"
            >
              {{ row.githubUrl | replaceString : 'https://github.com/' : '' }}
              <mat-icon>link</mat-icon>
            </a>
          </td>
        </ng-container>

        <ng-container
          *ngFor="
            let version of state.allAngularVersions;
            trackBy: trackByVersion
          "
          [matColumnDef]="version"
        >
          <th mat-header-cell *matHeaderCellDef>
            <div>v{{ version }}</div>
          </th>
          <td mat-cell *matCellDef="let row">
            <ng-container *ngIf="row.versionSupport[version]?.support === true">
              <a
                mat-button
                color="primary"
                [href]="row.versionSupport[version]?.link"
                target="_blank"
              >
                ✅
                {{ row.versionSupport[version]?.libraryVersion }}
              </a>
            </ng-container>
            <ng-container
              *ngIf="row.versionSupport[version]?.support === false"
            >
              ❌ Not Supported
              <a
                mat-button
                [href]="row.githubUrl + '/issues/new?title=chore:version'"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔑 Create an issue
              </a>
            </ng-container>
            <ng-container
              *ngIf="row.versionSupport[version]?.support === 'progress'"
            >
              ⏳ In Progress
            </ng-container>

            <ng-container
              *ngIf="row.versionSupport[version]?.support === 'partial'"
            >
              <a
                mat-button
                [href]="row.versionSupport[version]?.link"
                target="_blank"
                [matTooltip]="row.versionSupport[version]?.note"
              >
                🧪 Partial ({{ row.versionSupport[version]?.libraryVersion }})
              </a>
            </ng-container>

            <ng-container *ngIf="row.versionSupport[version] === undefined">
              ⚠️ Not Checked
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
      </table>
    </div>

    <h3 style="margin-top: 20px">{{ state.data().length }} Libraries 🚀</h3>
  `,
  styles: [
    `
      .table-container {
        width: 100%;
        overflow: auto;
        border-radius: 5px;
      }

      .mat-mdc-header-cell > div {
        padding: 0px 8px;
      }

      .mat-column-name {
        max-width: 190px;
        z-index: 10 !important;
      }

      .mat-column-githubUrl {
        max-width: 190px;
      }

      .mat-mdc-table-sticky-border-elem-right {
        border-left: 1px solid #e0e0e0;
      }

      .mat-mdc-table-sticky-border-elem-left {
        border-right: 1px solid #e0e0e0;
      }

      .mat-mdc-row .mat-mdc-cell {
        background-color: #fff;
        cursor: pointer;
      }

      .mat-mdc-row:hover .mat-mdc-cell {
        background-color: #f5f5f5;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    ReplaceStringPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportTableComponent {
  state = inject(StateService);

  displayedColumns = computed(() => {
    return ['name', 'githubUrl', ...this.state.versionsToShow()];
  });

  trackByVersion(index: number, version: string) {
    return version;
  }
}
