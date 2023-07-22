import { JsonPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ContributorsLoaderComponent } from './contributors-loader.component';
import { ContributorsStore } from './store/contributors.store';

@Component({
  selector: 'app-contributors',
  template: `
    <div class="contributors-container">
      <ng-container *ngIf="vm() as vm">
        <ng-container *ngIf="vm.isLoading; else contributorsTemplate">
          <app-contributors-loader />
        </ng-container>
        <ng-template #contributorsTemplate>
          <pre>{{ vm | json }}</pre>
        </ng-template>
      </ng-container>
    </div>
  `,
  imports: [NgIf, JsonPipe, ContributorsLoaderComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContributorsStore],
  styles: [
    `
      .contributors-container {
        margin: 24px 0;
      }
    `,
  ],
})
export class ContributorsComponent implements OnInit {
  private contributorsStore = inject(ContributorsStore);
  readonly vm = this.contributorsStore.vm;
  ngOnInit(): void {
    this.contributorsStore.getContributors();
  }
}
