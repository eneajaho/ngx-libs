import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { pipe, switchMap, tap } from 'rxjs';
import { ContributorsModel } from '../contributors.mode';
import { ContributorsService } from './../contributors.service';

interface ContributorsStateModel {
  contributors: ContributorsModel[];
  isLoading: boolean;
  error?: Error | null;
}

@Injectable()
export class ContributorsStore extends ComponentStore<ContributorsStateModel> {
  private contributorsService = inject(ContributorsService);
  constructor() {
    super({
      contributors: [],
      isLoading: false,
    });
  }

  readonly vm = this.selectSignal(({ contributors, isLoading }) => ({
    contributors,
    isLoading,
  }));

  readonly getContributors = this.effect<void>(
    pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.contributorsService.getContributors().pipe(
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
