import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideComponentStore } from '@ngrx/component-store';
import { ContributorsLoaderComponent } from './contributors-loader.component';
import { ContributorsModel } from './contributors.model';
import { ContributorsStore } from './store/contributors.store';

@Component({
  selector: 'app-contributors',
  template: `
    <div class="contributors-container">
      <h3 class="title">{{ vm().contributors.length }} Contributors 🪄</h3>
      <ng-container *ngIf="vm() as vm">
        <ng-container *ngIf="vm.isLoading; else contributorsTemplate">
          <app-contributors-loader count="5" />
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
                loading="lazy"
                width="40"
                height="40"
                [alt]="contributor.login"
              />
              <span class="contributions-count">
                {{ contributor.contributions }}
              </span>
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
  providers: [provideComponentStore(ContributorsStore)],
  styles: [
    `
      .contributors-container {
        margin: 1.5rem 0;
        .title {
          margin-bottom: 0.75rem;
        }
      }

      .contributor-container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.25rem;
      }

      .contributor {
        display: block;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 4rem;
        position: relative;

        img {
          object-fit: cover;
          border-radius: 4rem;
        }

        .contributions-count {
          position: absolute;
          bottom: -0.25rem;
          right: -0.25rem;
          background-color: #000;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
        }
      }
    `,
  ],
})
export class ContributorsComponent {
  private contributorsStore = inject(ContributorsStore);
  readonly vm = this.contributorsStore.vm;

  trackBy(index: number, item: ContributorsModel) {
    return item.id;
  }
}
