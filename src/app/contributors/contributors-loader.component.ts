import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contributors-loader',
  template: `
    <div class="loader-container">
      <div class="loader"></div>
      <div class="loader"></div>
      <div class="loader"></div>
      <div class="loader"></div>
      <div class="loader"></div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .loader-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .loader {
          width: 2rem;
          height: 2rem;
          border-radius: 4rem;
          background: #e4e4e7;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      }
      @keyframes pulse {
        50% {
          opacity: 0.5;
        }
      }
    `,
  ],
})
export class ContributorsLoaderComponent {}
