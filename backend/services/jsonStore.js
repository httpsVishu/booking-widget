import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');

function filePath(name) {
  return join(DATA_DIR, `${name}.json`);
}

export function readStore(name) {
  const fp = filePath(name);
  if (!existsSync(fp)) return null;
  const raw = readFileSync(fp, 'utf-8');
  return JSON.parse(raw);
}

export function writeStore(name, data) {
  writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8');
}