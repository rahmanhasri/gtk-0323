export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedInUser(state) {
    return state.auth.user;
  },

  loading(state) {
    return state.loading;
  },

  isRootAdmin(state) {
    return state.userScope === 'all'
  },
  isProvinsiUser(state) {
    return state.userScope === 'dinasprov'
  },

  isDinasPendidikanUser(state) {
    return state.userScope === 'pendidikan'
  },

  isKemenagUser(state) {
    return state.userScope === 'kemenag'
  },
  isReadonlyUser(state) {
    return state.userScope === 'readonly'
  }
};

export const state = () => ({
  loading: false,
  userScope: '',
});

export const mutations = {
  loading(state) {
    state.loading = true;
  },
  finishLoading(state) {
    state.loading = false;
  },
  userScope(state, userScope) {
    state.userScope = userScope
  },
};

export const actions = {
};
