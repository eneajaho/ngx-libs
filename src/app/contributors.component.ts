import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ContributorsService } from './contributors.service';

@Component({
  selector: 'app-contributors',
  template: `
    <!-- <div style="display: none;">TBD: Contributors</div> -->
    <div class="contributors">
      <h1>Contributors</h1>
      <ul class="contributors-list">
        <li
          *ngFor="let contributor of contributors; trackBy: trackByContributer"
        >
          <a
            [href]="contributor.author.html_url"
            target="_blank"
            class="contributor-link"
          >
            <img
              [src]="contributor.author.avatar_url"
              alt="Avatar"
              class="avatar"
            />
            <span class="tooltip">{{ contributor.author.login }}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .contributors {
        margin: 20px;
      }

      h2 {
        margin-bottom: 10px;
      }

      .contributors-list {
        list-style-type: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      li {
        position: relative;
      }

      .contributor-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        color: #333;
      }

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .tooltip {
        visibility: hidden;
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 5px;
        border-radius: 5px;
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }

      .contributor-link:hover .tooltip {
        visibility: visible;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ContributorsComponent {
  // TODO: Add contributors from Github API
  contributorService = inject(ContributorsService);
  private changeDetector = inject(ChangeDetectorRef);

  contributors: any[] = [];

  fetchContributors() {
    this.contributorService.getContributors().subscribe({
      next: (data) => {
        this.contributors = data;
        this.changeDetector.detectChanges();
      },
      error: (error) => console.log(error),
    });
  }

  trackByContributer(index: number, contributor: any): string {
    return contributor.login;
  }

  constructor() {
    this.fetchContributors();
  }
}
