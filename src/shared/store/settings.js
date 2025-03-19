import path from 'node:path';
import process from 'node:process';
import { readFileSync } from 'node:fs';
import Store from 'electron-store';
import preset from './preset.js';
import { isElectron } from '../utils/env.js';

class Settings extends Store {
    constructor(options) {
        options = {
            name: 'settings',
            defaults: preset,
            ...options,
        };

        if (!isElectron) {
            options.cwd ||= path.join(process.cwd(), 'data');

            const info = JSON.parse(readFileSync(path.resolve('package.json')));
            options.projectName ||= info.productName;
            options.projectVersion ||= info.version;
        }
        super(options);
    }
};

export default new Settings();