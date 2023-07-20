import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <div
      style="display: flex; justify-content: center; align-items: center; flex-direction: column; margin-top: 30px"
    >
      <div>
        Built with Angular and ❤️ by
        <a href="https://twitter.com/Enea_Jahollari" target="_blank">
          Enea Jahollari
        </a>

        🙌
      </div>

      <div style="margin-top: 20px;">
        <a href="https://ko-fi.com/A0A5KJQS4" target="_blank"
          ><img
            height="36"
            style="border:0px;height:36px;"
            src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
            border="0"
            alt="Buy Me a Coffee at ko-fi.com"
        /></a>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
