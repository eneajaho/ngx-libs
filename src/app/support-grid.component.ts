import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { LibraryAngularVersionSupport } from '@libs/models';
import { ReplaceStringPipe } from './replace-string.pipe';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-support-grid',
  template: `
    <div class="cards-grid">
      <ng-container *ngIf="cardData().length; else noFilterMatch">
        <mat-card *ngFor="let lib of cardData(); trackBy: state.trackItems">
          <mat-card-header>
            <mat-card-title>{{ lib.name }}</mat-card-title>
            <mat-card-subtitle>
              <a mat-button color="primary" [href]="lib.npmUrl" target="_blank">
                <img src="assets/npm.png" width="20" alt="Npm link" />
                {{
                  lib.npmUrl
                    | replaceString : 'https://www.npmjs.com/package/' : ''
                }}
              </a>
              <a
                mat-button
                color="primary"
                [href]="lib.githubUrl"
                target="_blank"
              >
                <img src="assets/github.svg" width="12" alt="Github link" />
                {{ lib.githubUrl | replaceString : 'https://github.com/' : '' }}
              </a>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table style="width:100%">
              <tr>
                <th>Ng Version</th>
                <th>Support</th>
                <th>Library Version</th>
              </tr>
              <tr
                *ngFor="
                  let item of lib.versionSupport;
                  trackBy: state.trackItems
                "
              >
                <td>v{{ item.angularVersion }}</td>
                <td>
                  <ng-container *ngIf="item.support === true">✅</ng-container>
                  <ng-container *ngIf="item.support === false">❌</ng-container>
                  <ng-container *ngIf="item.support === 'progress'">
                    ⏳
                  </ng-container>
                  <ng-container *ngIf="item.support === 'partial'">
                    🧪
                  </ng-container>
                </td>
                <td>
                  <a
                    *ngIf="item.support === true"
                    mat-button
                    color="primary"
                    [href]="item.link"
                    target="_blank"
                  >
                    <mat-icon>link</mat-icon>
                    {{ item.libraryVersion }}
                  </a>
                  <ng-container *ngIf="item.support === 'partial'">
                    <a
                      mat-flat-button
                      [href]="item.link"
                      target="_blank"
                      [matTooltip]="item.note || ''"
                    >
                      Partial
                      <ng-container *ngIf="item.libraryVersion">
                        ({{ item.libraryVersion }})
                      </ng-container>
                    </a>
                  </ng-container>
                  <ng-container *ngIf="item.support === false">
                    Not supported
                  </ng-container>
                  <ng-container *ngIf="item.support === 'progress'">
                    In progress
                  </ng-container>
                </td>
              </tr>
            </table>
          </mat-card-content>
        </mat-card>
      </ng-container>

      <ng-template #noFilterMatch>
        <p>No package matching the filter "{{ state.searchFilter() }}" 🫤</p>
      </ng-template>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    ReplaceStringPipe,
  ],
  styles: [
    `
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 1rem;
        margin-bottom: 1rem;
      }

      p {
        border: 1px solid rgba(0, 0, 0, 0.12);
        margin: 0;
        padding: 1rem;
        text-align: center;
        grid-column: 1 / -1;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
          0px 2px 2px 0px rgba(0, 0, 0, 0.14),
          0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportGridComponent {
  state = inject(StateService);

  cardData = computed(() => {
    const versionsToShow = this.state.versionsToShow();
    const data = this.state.filteredData();

    return data.map((lib) => {
      const keys = Object.keys(lib.versionSupport);

      const versionSupport = keys
        .sort((a, b) => +b - +a)
        .reduce((acc, key) => {
          if (versionsToShow.includes(key))
            acc.push({
              angularVersion: key,
              ...lib.versionSupport[key],
            });
          return acc;
        }, [] as Array<LibraryAngularVersionSupport & { angularVersion: string }>);

      return { ...lib, versionSupport };
    });
  });
}
