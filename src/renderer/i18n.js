
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n';
import store from '#/store/state.js';

const i18n = createI18n({
    legacy: false,
    locale: store.state.settings.language,
    fallbackLocale: 'en',
    messages: {},
});
i18n.global.index = { locales: {}, fallbackLocale: 'en', };

const localesPath = store.state.shared?.locales ?? './locales';

async function loadLocale(i18n, locale) {
    if (i18n.global.availableLocales.includes(locale))
        return;

    const locales = i18n.global.index.locales;
    if (!locale in locales)
        throw new Error('Invalid locale');

    const file = locales[locale].file;
    const module = await import(`${localesPath}/${file}`);
    i18n.global.setLocaleMessage(locale, module.default);
};

async function setLocale(i18n, locale) {
    if (!i18n.global.availableLocales.includes(locale))
        throw new Error('Invalid locale');

    document.querySelector('html').setAttribute('lang', locale);
    i18n.global.locale.value = locale;
    return nextTick();
}

await import(`${localesPath}/index.js`).then(async (module) => {
    const index = module.default;
    i18n.global.index = index;
    i18n.global.fallbackLocale = index.fallbackLocale;

    await loadLocale(i18n, i18n.global.locale.value);
    nextTick();
});

store.watch(
    (state) => state.settings.language,
    async (language) => {
        await loadLocale(i18n, language);
        await setLocale(i18n, language);
    }
);

export default i18n;