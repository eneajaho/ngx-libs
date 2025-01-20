export const ANGULAR_VERSIONS = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8];

export interface LibrarySupport {
  name: string; // name of the library (e.g. @rx-angular/isr)
  npmUrl: string; // url to the npm library
  githubUrl: string; // url to the github repo
  repo?: string; // name of the github repo (e.g. rx-angular/rx-angular)
  automated?: boolean; // if the library is automated

  versionSupport: {
    // key is version of angular (e.g. 11.0.0)
    [key: string]: LibraryAngularVersionSupport;
  };
}

export interface LibraryAngularVersionSupport {
  libraryVersion?: string; // version of the library (e.g. 17.0.0)
  support: true | false | 'progress' | 'partial'; // support for the library (e.g. true, false, 'progress', 'not breaks')
  link?: string; // link to the library version or release notes
  note?: string; // note for the library version
}
