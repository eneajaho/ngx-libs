import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { LibrarySupport } from './lib-support.interface';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LIBRARY_SUPPORT_DATA } from './libs.data';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReplaceStringPipe } from './replace-string.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-support-table',
  template: `
    <mat-form-field>
      <mat-label>Filter</mat-label>
      <input
        matInput
        (keyup)="applyFilter($event)"
        placeholder="Ex. Mia"
        #input
      />
    </mat-form-field>

    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let row">
            <b style="font-size: 18px">{{ row.name }}</b>
          </td>
        </ng-container>
        <ng-container matColumnDef="githubUrl">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            <img
              src="assets/github.svg"
              width="25"
              style="margin-right: 5px;"
              alt="Github link"
            />
            Github
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
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            <img
              src="assets/npm.png"
              width="30"
              style="margin-right: 5px;"
              alt="Npm link"
            />
            Npm
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
          *ngFor="let version of angularVersions"
          [matColumnDef]="version"
        >
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            v{{ version }}
          </th>
          <td mat-cell *matCellDef="let row">
            {{ row.versionSupport[version].libraryVerion }}
            <ng-container *ngIf="row.versionSupport[version].support">
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
              ❌
            </ng-container>
            <ng-container
              *ngIf="row.versionSupport[version].support === 'progress'"
            >
              ⏳
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="4">
            No data matching the filter "{{ input.value }}"
          </td>
        </tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page of users"
      ></mat-paginator>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    ReplaceStringPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportTableComponent {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource(LIBRARY_SUPPORT_DATA);

  angularVersions =
    getAllAngularVersionsFromLibrarySupportData(LIBRARY_SUPPORT_DATA);

  constructor() {
    this.displayedColumns = [
      'name',
      'npmUrl',
      'githubUrl',
      ...this.angularVersions,
    ];
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function getAllAngularVersionsFromLibrarySupportData(data: LibrarySupport[]) {
  const angularVersions = data.map((x) => Object.keys(x.versionSupport));

  return angularVersions
    .flat() // flatten array
    .map((version) => +version) // convert to number
    .sort((a, b) => b - a) // sort descending
    .map((x) => x.toString()); // convert back to string
}
