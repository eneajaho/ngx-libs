import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contributors',
  template: `
    <div style="display: none;">TBD: Contributors</div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsComponent {
  // TODO: Add contributors from Github API
}
