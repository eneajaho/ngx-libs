import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-container">
      <mat-form-field appearance="outline">
        <mat-label>Library name / slug</mat-label>
        <input
          matInput
          placeholder="Placeholder"
          [formControl]="searchControl"
        />
        <mat-hint>Ex. @rx-angular/isr</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Angular Versions</mat-label>
        <mat-select [formControl]="versionsControl" multiple>
          <mat-option
            *ngFor="
              let version of state.allAngularVersions;
              trackBy: state.trackItems
            "
            [value]="version"
          >
            v{{ version }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .search-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 8px;
      }
      @media (max-width: 1024px) {
        .search-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 640px) {
        .search-container {
          grid-template-columns: 1fr;
          grid-gap: 16px;
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  state = inject(StateService);

  searchControl = new FormControl<string>('', { nonNullable: true });
  versionsControl = new FormControl<string[]>([], { nonNullable: true });

  constructor() {
    this.versionsControl.setValue(this.state.versionsToShow());

    this.versionsControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.state.versionsToShow.set(value);
      });

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(200))
      .subscribe((value) => {
        this.state.searchFilter.set(value);
      });
  }

  ngOnInit() {
    this.searchControl.setValue(this.state.searchFilter());
  }
}
