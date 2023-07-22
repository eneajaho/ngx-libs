import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContributorsModel } from './contributors.model';

@Injectable({ providedIn: 'root' })
export class ContributorsService {
  private http = inject(HttpClient);
  private contributorsBasePath =
    'https://api.github.com/repos/eneajaho/ngx-libs/contributors?q=contributions&order=asc';

  getContributors(): Observable<ContributorsModel[]> {
    return this.http.get<ContributorsModel[]>(`${this.contributorsBasePath}`);
  }
}
