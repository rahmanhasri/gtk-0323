export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedInUser(state) {
    return state.auth.user;
  },

  loading(state) {
    return state.loading;
  }
};

export const state = () => ({
  loading: false,
  toastConfig: {
    theme: 'outline',
	  position: 'top-center',
	  duration : 5000,
  }
});

export const mutations = {
  loading(state) {
    state.loading = true;
  },
  finishLoading(state) {
    state.loading = false;
  },
};

export const actions = {
};