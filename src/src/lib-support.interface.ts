export interface LibrarySupport {
  name: string; // name of the library (e.g. @rx-angular/isr)
  npmUrl: string; // url to the npm library
  githubUrl: string; // url to the github repo

  versionSupport: {
    // key is version of angular (e.g. 11.0.0)
    [key: string]: LibraryAngularVersionSupport;
  };
}

export interface LibraryAngularVersionSupport {
  libraryVersion: string; // version of the library (e.g. 17.0.0)
  support: true | false | 'progress'; // support for the library (e.g. full, partial, none)
  link?: string; // link to the library version or release notes
}
