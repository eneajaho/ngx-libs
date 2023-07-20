import { LibrarySupport } from '@models';

export const NGNEAT_CASHEW: LibrarySupport = {
  name: '@ngneat/cashew',
  npmUrl: 'https://www.npmjs.com/package/@ngneat/cashew',
  githubUrl: 'https://github.com/ngneat/cashew',
  versionSupport: {
    '16': {
      libraryVersion: '3.1.0',
      support: 'partial',
      link: 'https://github.com/ngneat/cashew/releases/tag/v3.1.0',
      note: 'Can be used with Angular 16.0.0',
    },
    '15': {
      libraryVersion: '3.1.0',
      support: 'partial',
      link: 'https://github.com/ngneat/cashew/releases/tag/v3.1.0',
      note: 'Can be used with Angular 15.0.0',
    },
    '14': {
      libraryVersion: '3.1.0',
      support: true,
      link: 'https://github.com/ngneat/cashew/releases/tag/v3.1.0',
    },
    '13': {
      libraryVersion: '3.0.0',
      support: true,
      link: 'https://github.com/ngneat/cashew/releases/tag/v3.0.0',
    },
    '12': {
      libraryVersion: '2.0.0',
      support: true,
      link: 'https://github.com/ngneat/cashew/releases/tag/v2.0.0',
    },
    '11': {
      libraryVersion: '1.3.2',
      support: 'partial',
      link: 'https://github.com/ngneat/cashew/releases/tag/v1.3.2',
      note: 'Can be used with Angular 11.0.0',
    },
    '10': {
      libraryVersion: '1.3.2',
      support: true,
      link: 'https://github.com/ngneat/cashew/releases/tag/v1.3.2',
    },
  },
};
