let appName = 'Unknown';
let appVersion = 'Unknown';
let theme = 'light';

try {
    appName = __APP_NAME__ ?? appName;
    appVersion = __APP_VERSION__ ?? appVersion;

    if (document?.documentElement) {
        theme = getComputedStyle(document.documentElement)?.getPropertyValue('--color-scheme') ?? theme;
    }
}
catch (e) { }

export default {
    settings: {
        theme: theme,
        language: 'en',
        roundedWindow: false,
    },
    shared: {
        app: {
            name: appName,
            version: appVersion,
        }
    },
}