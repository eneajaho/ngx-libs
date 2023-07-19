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
import { ReplaceStringPipe } from './replace-string.pipe';
import { StateService } from './state.service';

@Component({
  selector: 'app-support-table',
  template: `
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="state.filteredData()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let row">
            <b style="font-size: 16px">{{ row.name }}</b>
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
              <span> Github</span>
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
        <ng-container matColumnDef="npmUrl">
          <th mat-header-cell *matHeaderCellDef>
            <div style="display: flex; align-items: center;">
              <img
                src="assets/npm.png"
                width="30"
                style="margin-right: 5px;"
                alt="Npm link"
              />
              <span>Npm</span>
            </div>
          </th>
          <td mat-cell *matCellDef="let row">
            <a mat-button color="primary" [href]="row.npmUrl" target="_blank">
              {{
                row.npmUrl
                  | replaceString : 'https://www.npmjs.com/package/' : ''
              }}
              <mat-icon>link</mat-icon>
            </a>
          </td>
        </ng-container>

        <ng-container
          *ngFor="let version of state.allAngularVersions"
          [matColumnDef]="version"
        >
          <th mat-header-cell *matHeaderCellDef>v{{ version }}</th>
          <td mat-cell *matCellDef="let row">
            {{ row.versionSupport[version].libraryVerion }}
            <ng-container *ngIf="row.versionSupport[version].support === true">
              <a
                mat-button
                color="primary"
                [href]="row.versionSupport[version].link"
                target="_blank"
              >
                ✅
                {{ row.versionSupport[version].libraryVersion }}
              </a>
            </ng-container>
            <ng-container *ngIf="row.versionSupport[version].support === false">
              ❌ Not Supported
            </ng-container>
            <ng-container
              *ngIf="row.versionSupport[version].support === 'progress'"
            >
              ⏳ In Progress
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
      </table>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    ReplaceStringPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportTableComponent {
  state = inject(StateService);

  displayedColumns = computed(() => {
    return ['name', 'npmUrl', 'githubUrl', ...this.state.versionsToShow()];
  });
}
