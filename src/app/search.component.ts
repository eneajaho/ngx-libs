import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
          <mat-option [value]="allOption" (click)="toggleAllVersions()">
            All
          </mat-option>
          <mat-option
            *ngFor="
              let version of state.allAngularVersions;
              trackBy: state.trackItems
            "
            [value]="version"
            (click)="togglePerSelection()"
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
export class SearchComponent {
  state = inject(StateService);
  allOption = 'all';

  searchControl = new FormControl<string>('', { nonNullable: true });
  versionsControl = new FormControl<string[]>([], { nonNullable: true });

  constructor() {
    this.versionsControl.setValue(this.state.versionsToShow());

    this.versionsControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((values: string[]) => {
        if (values.includes(this.allOption)) {
          values = values.filter((value) => value !== this.allOption);
        }
        this.state.versionsToShow.set(values);
      });

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        this.state.searchFilter.set(value);
      });

    // update the search input value on state change
    effect(() => this.searchControl.setValue(this.state.searchFilter()));
  }

  toggleAllVersions() {
    if (this.versionsControl.value.includes(this.allOption)) {
      this.versionsControl.patchValue([
        this.allOption,
        ...this.state.allAngularVersions,
      ]);
    } else {
      this.versionsControl.patchValue([]);
    }
  }

  togglePerSelection() {
    const values: string[] = this.versionsControl.value;

    if (values.includes(this.allOption)) {
      this.versionsControl.patchValue(
        values.filter((v) => v !== this.allOption)
      );
    } else if (values.length == this.state.allAngularVersions.length) {
      this.versionsControl.patchValue([
        this.allOption,
        ...this.state.allAngularVersions,
      ]);
    } else {
      this.versionsControl.patchValue(values);
    }
  }
}
