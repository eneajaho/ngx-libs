import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContributorsService {
  private apiUrl = 'https://api.github.com';
  private owner = 'eneajaho';
  private repo = 'ngx-libs';

  private http = inject(HttpClient);

  // fetching contributors list from github repo
  getContributors() {
    const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/stats/contributors`;
    return this.http.get<any[]>(url);
  }
}
