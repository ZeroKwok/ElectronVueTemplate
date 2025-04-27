
import vuex from 'vuex';
import preset from '#/store/preset.js';
import { setProperty } from 'dot-prop';

const temp = { settings: preset.settings, shared: { } };
const state = window.electron
  ? await window.electron.ipcRenderer.invoke('get', 'state', temp)
  : temp;

const store = vuex.createStore({
  state: {
    ...state
  },
  mutations: {
    set(state, {key, value}) {
      setProperty(state, key, value);
    }
  },
  actions: {
    update({ commit }, option) {
      commit('set', option);
    }
  },
});

if (window.electron) {
  ['settings', 'shared'].forEach((key) => {
    store.watch(
      (state) => state[key],
      (newValue) => {
        const value = JSON.parse(JSON.stringify(newValue))
        window.electron.ipcRenderer.invoke('set', key, value);
      },
      { deep: true }
    );
  });

  window.electron.ipcRenderer.on('changeed', (event, key, value) => {
    if (['settings', 'shared'].includes(key))
      store.dispatch('update', { key, value });
  });
}

export default store;