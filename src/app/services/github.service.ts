import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContributorsModel } from '../contributors/contributors.model';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private http = inject(HttpClient);
  private readonly basePath = 'https://api.github.com/repos/eneajaho/ngx-libs';
  private readonly contributorsPath =
    this.basePath + '/contributors?q=contributions&order=asc';

  getContributors(): Observable<ContributorsModel[]> {
    return this.http.get<ContributorsModel[]>(`${this.contributorsPath}`);
  }
}
