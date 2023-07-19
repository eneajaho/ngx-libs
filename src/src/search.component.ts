import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StateService } from './state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search',
  template: `
    <div
      style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-gap: 10px"
    >
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
            *ngFor="let version of state.allAngularVersions"
            [value]="version"
          >
            v{{ version }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
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
}
