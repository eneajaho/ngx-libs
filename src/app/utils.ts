import { LibrarySupport } from './lib-support.interface';

export function getAllAngularVersionsFromLibrarySupportData(
  data: LibrarySupport[],
) {
  const angularVersions = data.map((x) => Object.keys(x.versionSupport));

  const uniqueAngularVersions: string[] = Array.from(
    new Set(angularVersions.flat()),
  );

  return uniqueAngularVersions
    .map((version) => +version) // convert to number
    .sort((a, b) => b - a) // sort descending
    .map((x) => x.toString()); // convert back to string
}
