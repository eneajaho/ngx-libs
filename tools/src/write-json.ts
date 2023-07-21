import * as fs from 'fs';
import { LIBRARY_SUPPORT_DATA } from '../../src/app/libs.data';

const outputPath = process.argv[2];

if (!outputPath) {
  console.error('No output path provided');
  process.exit(1);
}

const data = JSON.stringify(LIBRARY_SUPPORT_DATA, undefined, 2);
fs.writeFileSync(outputPath, data);
