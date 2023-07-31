import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from '@ngrx/component-store';
import { pipe, switchMap, tap } from 'rxjs';
import { GithubService } from 'src/app/services/github.service';
import { ContributorsModel } from '../contributors.model';

interface ContributorsStateModel {
  contributors: ContributorsModel[];
  isLoading: boolean;
  error?: Error | null;
}

@Injectable()
export class ContributorsStore
  extends ComponentStore<ContributorsStateModel>
  implements OnStateInit
{
  private githubService = inject(GithubService);
  constructor() {
    super({
      contributors: [],
      isLoading: false,
    });
  }

  ngrxOnStateInit() {
    this.getContributors();
  }

  readonly vm = this.selectSignal(({ contributors, isLoading }) => ({
    contributors,
    isLoading,
  }));

  readonly getContributors = this.effect<void>(
    pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.githubService.getContributors().pipe(
          tapResponse({
            next: (contributors) => this.patchState({ contributors }),
            error: (error: HttpErrorResponse) =>
              console.error('Fetch contributors error: ', error),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );
}
