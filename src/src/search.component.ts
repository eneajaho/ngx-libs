import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-search',
  template: `
    <form #ngForm="ngForm" (ngSubmit)="handleSubmit($event)">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr">
        <mat-form-field appearance="fill">
          <mat-label>Library name / slug</mat-label>
          <input matInput placeholder="Placeholder" />
          <mat-hint>Ex. @rx-angular/isr</mat-hint>
        </mat-form-field>

        <!-- <mat-form-field appearance="outline">
          <mat-label></mat-label>
          <input matInput placeholder="Placeholder" />
          <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
          <mat-hint>Hint</mat-hint>
        </mat-form-field> -->

        <button mat-raised-button type="submit">
          <mat-icon>search</mat-icon>
        </button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('submitted', event);
  }
}
