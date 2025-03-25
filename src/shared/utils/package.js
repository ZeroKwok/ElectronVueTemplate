import path from 'node:path';
import { readFileSync } from 'node:fs';

export function getPackage() {
    return JSON.parse(readFileSync(path.resolve('package.json')));
};