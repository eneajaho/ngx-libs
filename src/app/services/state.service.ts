import { PlatformLocation } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ANGULAR_VERSIONS, LibrarySupport } from '@libs/models';

type SearchQueryParams = {
  search?: string;
  versions?: string;
};

const getAllAngularVersions: () => Promise<LibrarySupport[]> = () =>
  import('../../assets/library-support-data.json').then(
    (x) => (x as any).default as LibrarySupport[]
  );

// sort from biggest to smallest
const ALL_ANGULAR_VERSIONS = ANGULAR_VERSIONS.map((x) => x + '');

@Injectable({ providedIn: 'root' })
export class StateService {
  // select 3 versions by default
  versionsToShow = signal(ALL_ANGULAR_VERSIONS.slice(0, 5));

  allAngularVersions = ALL_ANGULAR_VERSIONS;

  searchFilter = signal('');

  data = signal<LibrarySupport[]>([]);

  filteredData = computed(() => {
    const searchFilter = this.searchFilter(); // ngx-toastr, ngx-clipboard, etc.
    const data = this.data();

    if (!searchFilter) return data;

    const searchFilterSplit = searchFilter
      .split(',') // split by comma
      .filter((x) => x.trim().length > 0); // remove empty strings

    return data
      .filter((lib) => {
        return searchFilterSplit.some((searchFilter) => {
          return lib.name.toLowerCase().includes(searchFilter.toLowerCase());
        });
      })
      .slice(0, 40); // always limit to 40 results
  });

  platformLocation = inject(PlatformLocation);
  router = inject(Router);

  sanitizeVersions(unsafeInput: string | null) {
    const maybeCSV = unsafeInput || '';
    const maybeVersions = maybeCSV
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    return maybeVersions.filter((v) => this.allAngularVersions.includes(v));
  }

  constructor() {
    effect(() => console.log('versionsToShow', this.versionsToShow()));
    effect(() => console.log('data', this.filteredData()));
    effect(() => console.log('searchFilter', this.searchFilter()));

    // Initialize state from URL
    const url = new URL(this.platformLocation.href);
    if (url.searchParams.has('search')) {
      this.searchFilter.set(url.searchParams.get('search') || '');
    }
    if (url.searchParams.has('versions')) {
      this.versionsToShow.set(
        this.sanitizeVersions(url.searchParams.get('versions'))
      );
    }

    effect(() => {
      // Auto-update URL when state changes
      const searchFilter = this.searchFilter().trim();
      const versionsFilter = this.versionsToShow().join(',');
      const queryParams: SearchQueryParams = {};
      if (searchFilter) {
        queryParams.search = searchFilter;
      }
      if (versionsFilter) {
        queryParams.versions = versionsFilter;
      }
      this.router.navigate([], { queryParams, replaceUrl: true });
    });

    getAllAngularVersions().then((x) => {
      this.data.set(x);
    });
  }

  /**
   *
   * @param index of item
   * @param item
   */
  public trackItems<T>(index: number, item: T): number {
    return index;
  }
}
