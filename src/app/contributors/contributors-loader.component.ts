import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contributors-loader',
  template: `
    <div class="loader-container">
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
        gap: 8px;
        .loader {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
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
