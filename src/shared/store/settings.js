import process from 'node:process';
import Store from 'electron-store';
import preset from './preset.js';
import env from '../utils/env.js';

class Settings extends Store {
    constructor(options) {
        options = {
            name: 'settings',
            defaults: preset,
            ...options,
        };

        if (!env.isElectron) {
            options.cwd ||= path.join(process.cwd(), 'data');
            options.projectName ||= env.appName;
            options.projectVersion ||= env.version;
        }
        super(options);
    }
};

export default new Settings();