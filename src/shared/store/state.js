
import vuex from 'vuex';
import preset from './preset';

const temp = { settings: preset.settings, cache: {} };
const state = window.electron
  ? await window.electron.ipcRenderer.invoke('get', 'state', temp)
  : temp;

const store = vuex.createStore({
  state: {
    ...state
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
  ['settings', 'cache'].forEach((key) => {
    store.watch(
      (state) => state[key],
      (newValue) => {
        window.electron.ipcRenderer.invoke('set', key, { ...newValue });
      },
      { deep: true }
    );
  });

  window.electron.ipcRenderer.on('changeed', (event, key, value) => {
    if (key === 'settings')
      store.dispatch('updateSettings', value);
    else if (key === 'cache')
      store.dispatch('updateCache', value);
  });
}

export default store;