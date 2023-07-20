import { PlatformLocation } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LIBRARY_SUPPORT_DATA } from './libs.data';
import { getAllAngularVersionsFromLibrarySupportData } from './utils';

type SearchQueryParams = {
  search?: string;
  versions?: string;
};

const ALL_ANGULAR_VERSIONS =
  getAllAngularVersionsFromLibrarySupportData(LIBRARY_SUPPORT_DATA);

@Injectable({ providedIn: 'root' })
export class StateService {
  allAngularVersions = ALL_ANGULAR_VERSIONS;
  // select 3 versions by default
  versionsToShow = signal(ALL_ANGULAR_VERSIONS.slice(0, 3));

  searchFilter = signal('');

  data = signal(LIBRARY_SUPPORT_DATA);

  filteredData = computed(() => {
    const searchFilter = this.searchFilter();
    const data = this.data();

    if (!searchFilter) return data;

    return data
      .filter((lib) => {
        return lib.name.toLowerCase().includes(searchFilter.toLowerCase());
      })
      .slice(0, 30); // always limit to 30 results
  });

  platformLocation = inject(PlatformLocation);
  router = inject(Router);

  sanitizeVersions(
    unsafeInput: string | null,
    validVersions: string[] = this.allAngularVersions,
  ) {
    const maybeCSV = unsafeInput || '';
    const maybeVersions = maybeCSV
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    return maybeVersions.filter((v) => validVersions.includes(v));
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
        this.sanitizeVersions(url.searchParams.get('versions')),
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
  }
}
