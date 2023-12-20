import { ANGULAR_VERSIONS, LibrarySupport } from '@libs/models';
import fs from 'fs';
import { Octokit } from 'octokit';

const supportData = () =>
  JSON.parse(
    fs.readFileSync(
      './src/assets/library-support-data.json'
    ) as unknown as string
  );

const LIBRARY_SUPPORT_DATA: LibrarySupport[] = supportData();

// Replace 'GITHUB_TOKEN' with your GitHub personal access token
const octokit = new Octokit({
  auth: process.env?.['GITHUB_TOKEN'] || '',
});

const GENERATE_RELEASES_JSON = process.env?.['GENERATE_RELEASES_JSON'];

// Function to fetch releases for a given repository
async function getReleases(repo: string): Promise<GithubRelease[]> {
  try {
    const { data } = await octokit.rest.repos.listReleases({
      owner: repo.split('/')[0],
      repo: repo.split('/')[1],
    });

    return data.map((release) => ({
      link: release.html_url,
      name: release.name,
      tag: release.tag_name,
      body: release.body,
    }));
  } catch (error: any) {
    console.error(`Error fetching releases for ${repo}: ${error.message}`);
    return [];
  }
}

// Main function to fetch releases for all repositories
async function fetchAllReleases() {
  const allReleases: Record<string, GithubRelease[]> = {};

  // List of repositories to fetch releases
  const repositories = getAllLibsThatHaveGithubReleases(LIBRARY_SUPPORT_DATA);

  for (const repo of repositories) {
    const releases = await getReleases(repo);
    allReleases[repo] = releases;
  }

  return allReleases;
}

// Save releases to a JSON file
async function saveReleasesToFile(data: any, path: string) {
  const jsonReleases = JSON.stringify(data, null, 2);

  fs.writeFile(path, jsonReleases, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Releases saved to ' + path);
    }
  });
}

// Run the script
async function run() {
  const releases = await fetchAllReleases();
  const newLibrarySupportData = LIBRARY_SUPPORT_DATA;

  // merge releases with library support data
  for (const lib of newLibrarySupportData) {
    const repo = lib.repo || getRepoFromUrl(lib.githubUrl);
    const releasesForRepo = releases[repo];
    lib.automated = releasesForRepo.length > 0;

    for (const release of releasesForRepo) {
      for (const angularVersion of ANGULAR_VERSIONS) {
        const { support } = lib.versionSupport[angularVersion] || {};

        if (support === undefined && angularVersion < 10) {
          continue; // skip angular versions below 10 if the library doesn't have support for them
        }

        // if the library already has support for this version, skip
        if (support === true) continue; // already has support for this version

        if (support === 'partial' || support === 'progress') {
          // already has partial support for this version check if this release has support for this version
          if (releaseHasSupportForAngular(release, angularVersion + '')) {
            lib.versionSupport[angularVersion] = {
              libraryVersion: release.tag,
              support: true,
              link: release.link,
            };
          }
          continue;
        }

        // check if the release has support for this angular version
        if (releaseHasSupportForAngular(release, angularVersion + '')) {
          lib.versionSupport[angularVersion] = {
            libraryVersion: release.tag,
            support: true,
            link: release.link,
          };
        } else {
          lib.versionSupport[angularVersion] = {
            // if version is 15 or higher, set partial support to true because it probably works
            support: angularVersion > 15 ? 'partial' : false,
          };
        }
      }
    }
  }

  if (GENERATE_RELEASES_JSON) {
    await saveReleasesToFile(releases, 'releases.json');
  }

  await saveReleasesToFile(
    newLibrarySupportData,
    'src/assets/library-support-data.json'
  );
}

run();

function libHasReleasesLinks(lib: LibrarySupport) {
  for (const versionSupport of Object.values(lib.versionSupport)) {
    if (
      versionSupport.link?.includes('github.com') &&
      versionSupport.link?.includes('releases')
    ) {
      return true;
    }
  }
  return false;
}

function getAllLibsThatHaveGithubReleases(
  librarySupportData: LibrarySupport[]
) {
  const libs = librarySupportData
    .filter((lib) => {
      // check if versionSupport items have a link that points to github releases
      return libHasReleasesLinks(lib) || lib.githubUrl;
    })
    .map((lib) => {
      if (lib.repo) return lib.repo;
      return getRepoFromUrl(lib.githubUrl);
    });
  return libs;
}

function getRepoFromUrl(url: string) {
  // return only the owner/repo part of the url
  return url
    .replace('https://github.com/', '')
    .split('/') // split by slash
    .slice(0, 2) // take only the first two parts
    .join('/'); // join back with slash
}

function releaseHasSupportForAngular(
  release: GithubRelease,
  angularVersion: string
) {
  const body = release.body || '';
  // check if the release body contains the angular version
  return (
    body.includes('a `' + angularVersion) || // ngular `8*** or ngular `9*** or ngular `10*** etc. (ng-bootstrap)
    body.includes('v ' + angularVersion) ||
    body.includes('a' + angularVersion) || // a16 or a17 etc. (ng-mocks)
    body.includes('ngular ' + angularVersion) || // remove the 'a' from 'angular' to match both 'angular' and 'Angular'
    body.includes('ngular v' + angularVersion) // (ngx-translate/core)
  );
}

interface GithubRelease {
  name: string | null;
  tag: string;
  body: string | null | undefined;
  link: string;
}
