
import vuex from 'vuex';

const store = vuex.createStore({
  state: {
    settings: window.electron ? await window.electron.ipcRenderer.invoke('getSetting', {}) : {},
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
  },
  actions: {
    updateLanguage({ commit }, language) {
      commit('setLanguage', language);
    },
    updateSettings({ commit }, settings) {
      commit('setSettings', settings);
    }
  },
});

if (window.electron) {
  store.watch(
    (state) => state.settings,
    (newSettings) => {
      window.electron.ipcRenderer.invoke('setSetting', { ...newSettings });
    },
    { deep: true }
  );

  window.electron.ipcRenderer.on('settingsChangeed', (event, settings) => {
    store.dispatch('updateSettings', settings);
  });
}

export default store;