import type {
  LibraryAngularVersionSupport,
  LibrarySupport,
} from '@libs/models';
import { formatFiles, Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { prompt } from 'enquirer';
import { isStringLiteral } from 'typescript';
import type { NewLibGeneratorSchema } from './schema';

type VersionSupportPrompt = Omit<LibraryAngularVersionSupport, 'support'> & {
  support: string;
};

export async function newLibGenerator(
  tree: Tree,
  options: NewLibGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(options);
  const libDataPath = 'src/app/libs.data.ts';
  const libDataContent = tree.read(libDataPath, 'utf8');

  if (!libDataContent) {
    console.log(`${libDataPath} is empty. Cannot proceed`);
    return;
  }

  const existingLibNameNodes = tsquery.query(
    libDataContent,
    'PropertyAssignment:has(Identifier[name=name]) > StringLiteral'
  );
  const exist = existingLibNameNodes.some(
    (node) => isStringLiteral(node) && node.text === normalizedOptions.name
  );

  if (exist) {
    console.log(
      `${normalizedOptions.name} already exists. Please update ${libDataPath} manually.`
    );
    return;
  }

  let ngVersions = await promptNgVersions();

  while (!ngVersions.length) {
    ngVersions = await promptNgVersions();
  }

  for (const ngVersion of ngVersions) {
    console.log('==================');
    normalizedOptions.versionSupport[ngVersion] =
      await prompt<VersionSupportPrompt>([
        {
          type: 'input',
          name: 'libraryVersion',
          message: `What version of the library supports Angular ${ngVersion}?`,
          required: true,
          // TODO: semver validation
        },
        {
          type: 'select',
          name: 'support',
          message: `Level of support?`,
          choices: ['fully-support', 'no-support', 'in-progress', 'partial'],
          required: true,
        },
        {
          type: 'input',
          name: 'link',
          message: 'CHANGELOG/Release link?',
          initial: '',
        },
        {
          type: 'input',
          name: 'note',
          message: 'Note for this library version?',
          initial: '',
        },
      ]).then(({ support: promptSupport, ...value }) => {
        const support = (() => {
          switch (promptSupport) {
            case 'fully-support':
              return true;
            case 'no-support':
              return false;
            case 'in-progress':
              return 'progress';
            default:
              return promptSupport;
          }
        })();
        return { ...value, support } as LibraryAngularVersionSupport;
      });
  }

  console.log('==================');
  console.log(JSON.stringify(normalizedOptions, null, 2));
  const { proceed } = await prompt<{ proceed: boolean }>({
    type: 'confirm',
    name: 'proceed',
    message: 'Does this look correct? If not, please rerun the generator',
    initial: true,
  });

  if (proceed) {
    const updatedContent = tsquery.replace(
      libDataContent,
      'ArrayLiteralExpression > ObjectLiteralExpression:last-child',
      (node) => {
        return (
          node.getFullText() +
          ',\n' +
          JSON.stringify(normalizedOptions, null, 2)
        );
      }
    );

    tree.write(libDataPath, updatedContent);
    await formatFiles(tree);
  }
}

function normalizeOptions(options: NewLibGeneratorSchema): LibrarySupport {
  return {
    name: options.name,
    npmUrl: `https://www.npmjs.com/package/${options.name}`,
    githubUrl: options.github ? `https://github.com/${options.github}` : '',
    versionSupport: {},
  };
}

async function promptNgVersions() {
  const result = await prompt<{ angularVersions: string[] }>({
    type: 'multiselect',
    name: 'angularVersions',
    message: 'What Angular versions does this library support?',
    choices: ['16', '15', '14', '13', '12', '11', '10'],
  });

  return result.angularVersions;
}

export default newLibGenerator;
