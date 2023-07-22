import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContributorsLoaderComponent } from './contributors-loader.component';
import { ContributorsModel } from './contributors.mode';
import { ContributorsStore } from './store/contributors.store';

@Component({
  selector: 'app-contributors',
  template: `
    <div class="contributors-container">
      <h3 class="title">Contributors</h3>
      <ng-container *ngIf="vm() as vm">
        <ng-container *ngIf="vm.isLoading; else contributorsTemplate">
          <app-contributors-loader />
        </ng-container>
        <ng-template #contributorsTemplate>
          <div class="contributor-container">
            <a
              class="contributor"
              *ngFor="let contributor of vm.contributors; trackBy: trackBy"
              [href]="contributor.html_url"
              target="_blank"
              [matTooltip]="contributor.login"
              matTooltipPosition="above"
            >
              <img
                [ngSrc]="contributor.avatar_url"
                width="32"
                height="32"
                [alt]="contributor.login"
              />
            </a>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `,
  imports: [
    MatTooltipModule,
    NgIf,
    NgFor,
    NgOptimizedImage,
    ContributorsLoaderComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContributorsStore],
  styles: [
    `
      .contributors-container {
        margin: 24px 0;
        .title {
          margin-bottom: 12px;
        }
      }

      .contributor-container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
      }

      .contributor {
        display: block;
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        img {
          object-fit: cover;
          border-radius: 9999px;
        }
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

  trackBy(index: number, item: ContributorsModel) {
    return item.id;
  }
}
