import { Location, PlatformLocation } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LIBRARY_SUPPORT_DATA } from './libs.data';
import { getAllAngularVersionsFromLibrarySupportData } from './utils';

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

  location = inject(Location);
  platformLocation = inject(PlatformLocation);

  constructor() {
    effect(() => console.log('versionsToShow', this.versionsToShow()));
    effect(() => console.log('data', this.filteredData()));
    effect(() => console.log('searchFilter', this.searchFilter()));

    const url = new URL(this.platformLocation.href);
    if (url.searchParams.has('search')) {
      this.searchFilter.set(url.searchParams.get('search') || '');
    }
    if (url.searchParams.has('versions')) {
      const maybeCSV = url.searchParams.get('versions') || '';
      const maybeVersions = maybeCSV.split(',').map(v => v.trim()).filter(Boolean);
      const versions = maybeVersions.filter((v) => ALL_ANGULAR_VERSIONS.includes(v));
      this.versionsToShow.set(versions);
    }

    effect(() => {
      const searchFilter = this.searchFilter().trim();
      const versionsFilter = this.versionsToShow().join(',');
      const params = new URLSearchParams();

      if (searchFilter) {
        params.set('search', searchFilter);
      }
      if (versionsFilter) {
        params.set('versions', versionsFilter);
      }

      this.location.replaceState('', params.toString());
    });
  }
}
