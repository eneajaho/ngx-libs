import type { LibrarySupport } from 'libs/models';

export function getAllAngularVersionsFromLibrarySupportData(
  data: LibrarySupport[]
) {
  assertLibrariesAreAllUnique(data);

  const angularVersions = data.map((x) => Object.keys(x.versionSupport));

  const uniqueAngularVersions: string[] = Array.from(
    new Set(angularVersions.flat())
  );

  return uniqueAngularVersions
    .map((version) => +version) // convert to number
    .sort((a, b) => b - a) // sort descending
    .map((x) => x.toString()); // convert back to string
}

export function assertLibrariesAreAllUnique(data: LibrarySupport[]) {
  for (let i = 0; i < data.length; i++) {
    const lib = data[i];

    const matchingLibraries = data.filter(
      (x) => x.name === lib.name || x.npmUrl === lib.npmUrl,
    );

    if (matchingLibraries.length > 1) {
      alert(
        `Library ${lib.name} is not unique. Found ${matchingLibraries.length} libraries with the same name or npmUrl.`,
      );
    }
  }
}
