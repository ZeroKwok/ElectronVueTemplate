let appName = 'Unknown';
let appVersion = 'Unknown';
try {
    appName = __APP_NAME__ ?? appName;
    appVersion = __APP_VERSION__ ?? appVersion;
}
catch (e) { }

export default {
    settings: {
        theme: 'light',
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