import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StateService } from './services/state.service';

@Component({
  template: `
    <h3 mat-dialog-title>Check package.json</h3>

    <div mat-dialog-content>
      <mat-form-field style="width: 100%">
        <mat-label>
          Package.json dependencies or devDependencies value
        </mat-label>
        <textarea
          matInput
          rows="9"
          [ngModel]="packageJsonValue()"
          (ngModelChange)="packageJsonValue.set($event)"
          placeholder="
  {
    'dependencies': {
        '@angular/core': '12.0.0',
    }
  }
        "
        ></textarea>
        <mat-hint>
          Data is used only in your browser! They are not sent anywhere!
        </mat-hint>
      </mat-form-field>
    </div>

    <div mat-dialog-actions>
      <button (click)="dialogRef.close()" mat-flat-button>
        <mat-icon>close</mat-icon>
        Close
      </button>
      <button (click)="submit()" mat-flat-button color="primary">
        <mat-icon>check</mat-icon>
        Check
      </button>
    </div>
  `,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    NgIf,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CheckPackageJsonModalComponent {
  stateService = inject(StateService);
  dialogRef = inject<MatDialogRef<string>>(MatDialogRef);

  packageJsonValue = signal('');

  submit() {
    try {
      const jsonValue = JSON.parse(this.packageJsonValue());

      const dependencies = Object.keys(jsonValue.dependencies || {});
      const devDependencies = Object.keys(jsonValue.devDependencies || {});
      const allDependencies = [...dependencies, ...devDependencies];

      this.stateService.searchFilter.set(allDependencies.join(','));
    } catch (e) {
      alert('Please enter a valid json value!');
    }
  }
}
