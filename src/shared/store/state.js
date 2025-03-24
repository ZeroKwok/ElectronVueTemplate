
import vuex from 'vuex';
import preset from './preset.js';

const cache = window.electron
  ? await window.electron.ipcRenderer.invoke('get', 'cache', {})
  : {};
const settings = window.electron
  ? await window.electron.ipcRenderer.invoke('get', 'settings', preset.settings)
  : preset.settings;

const store = vuex.createStore({
  state: {
    cache: cache,
    settings: settings,
  },
  mutations: {
    setTheme(state, theme) {
      state.settings.theme = theme;
    },
    setLanguage(state, language) {
      state.settings.language = language;
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
    setCache(state, cache) {
      state.cache = cache;
    },
  },
  actions: {
    updateLanguage({ commit }, language) {
      commit('setLanguage', language);
    },
    updateSettings({ commit }, settings) {
      commit('setSettings', settings);
    },
    updateCache({ commit }, cache) {
      commit('setCache', cache);
    }
  },
});

if (window.electron) {
  store.watch(
    (state) => state.settings,
    (newSettings) => {
      window.electron.ipcRenderer.invoke('set', 'settings', { ...newSettings });
    },
    { deep: true }
  );

  window.electron.ipcRenderer.on('changeed', (event, key, value) => {
    if (key === 'settings')
      store.dispatch('updateSettings', settings);
    else if (key === 'cache')
      store.dispatch('updateCache', value);
  });
}

export default store;