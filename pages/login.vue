<template>
  <div class="columns is-flex" style="z-index: 1000">
    <div class="column is-8 is-offset-2 register">
      <div class="columns shadowed">
        <div class="column left">
          <span>
            <h2 class="title is-3 has-text-centered">SISWA PENTER</h2>
            <figure class="is-flex image">
              <img src="@/assets/Sampang.png" />
            </figure>
          </span>
          <h2 class="subtitle colored is-4 has-text-centered">
            Aplikasi Satu Wadah Data Pendidikan Terintegrasi - Kabupaten Sampang
          </h2>
        </div>
        <div class="column right hero">
          <form class="hero-body" @submit.prevent="login">
            <h1 class="title is-4 has-text-centered">Login</h1>
            <div class="field">
              <div class="control">
                <input
                  v-model="username"
                  class="input"
                  placeholder="Username"
                />
              </div>
            </div>
            <div class="field" style="">
              <div class="control">
                <input
                  v-model="password"
                  class="input is-fullwidth"
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>
            <button
              type="submit"
              :loading="loading"
              class="button is-block is-primary is-fullwidth"
              :class="{ 'is-loading': loading }"
            >
              Login
            </button>
            <div v-if="error" class="notification is-danger mt-4">
              <button class="delete" @click="error = null"></button>
              Username / Password salah
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  data() {
    return {
      username: '',
      password: '',
      error: '',
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
  methods: {
    async login() {
      try {
        this.$store.commit('loading')
        const response = await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password,
          },
        })
        this.$auth.$storage.setUniversal(
          'scopeusr',
          response?.data?.user?.scope
        )
        this.$router.replace('/')
        this.$store.commit('finishLoading')
      } catch (e) {
        this.error = e.message
        this.$store.commit('finishLoading')
      }
    },
  },
}
</script>

<style scoped>
.shadowed {
  box-shadow: 10px 10px 42px -3px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 10px 10px 42px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 42px -3px rgba(0, 0, 0, 0.75);
}
body {
  background: rgb(247, 247, 247);
  height: 100vh;
  color: hsla(0, 0%, 0%, 0.66);
}
.hero-body {
  padding-left: 0px;
  padding-right: 0px;
}
.field:not(:last-child) {
  margin-bottom: 1rem;
}
.register {
  margin-top: 8%;
  background: white;
  border-radius: 10px;
}
.left,
.right {
  padding: 4.5rem;
}
.left {
  border-right: 5px solid rgb(247, 247, 247);
}
.left .title {
  font-weight: 800;
  letter-spacing: -2px;
}
.left .colored {
  color: hsl(166, 67%, 51%);
  font-weight: 500;
  margin-top: 1rem !important;
  letter-spacing: -1px;
}
.left p {
  color: hsla(0, 0%, 0%, 0.33);
  font-size: 1.15rem;
}
.right .title {
  font-weight: 800;
  letter-spacing: -1px;
}
.right .description {
  margin-top: 1rem;
  margin-bottom: 1rem !important;
  color: hsla(0, 0%, 0%, 0.33);
  font-size: 1.15rem;
}
.right small {
  color: hsla(0, 0%, 0%, 0.33);
}
input {
  font-size: 1rem;
}
input:focus {
  border-color: hsl(166, 67%, 51%) !important;
  box-shadow: 0 0 0 1px hsl(166, 67%, 51%) !important;
}
</style>

<style scoped>
  .va {
    display: flex;
    align-items: center;
  }
  .shadowed {
    box-shadow: 10px 10px 42px -3px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 10px 10px 42px -3px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 10px 10px 42px -3px rgba(0, 0, 0, 0.75);
  }
  /* :root {
      --brandColor: hsl(166, 67%, 51%);
      --background: rgb(247, 247, 247);
      --textDark: hsla(0, 0%, 0%, 0.66);
      --textLight: hsla(0, 0%, 0%, 0.33);
    } */
  body {
    background: rgb(247, 247, 247);
    height: 100vh;
    color: hsla(0, 0%, 0%, 0.66);
  }
  .field:not(:last-child) {
    margin-bottom: 1rem;
  }
  .register {
    margin-top: 12%;
    background: white;
    border-radius: 10px;
  }
  .left,
  .right {
    padding: 4.5rem;
  }
  .left {
    border-right: 5px solid rgb(247, 247, 247);
  }
  .left .title {
    font-weight: 800;
    letter-spacing: -2px;
  }
  .left .colored {
    color: hsl(166, 67%, 51%);
    font-weight: 500;
    margin-top: 1rem !important;
    letter-spacing: -1px;
  }
  .left p {
    color: hsla(0, 0%, 0%, 0.33);
    font-size: 1.15rem;
  }
  .right .title {
    font-weight: 800;
    letter-spacing: -1px;
  }
  .right .description {
    margin-top: 1rem;
    margin-bottom: 1rem !important;
    color: hsla(0, 0%, 0%, 0.33);
    font-size: 1.15rem;
  }
  .right small {
    color: hsla(0, 0%, 0%, 0.33);
  }
  input {
    font-size: 1rem;
  }
  input:focus {
    border-color: hsl(166, 67%, 51%) !important;
    box-shadow: 0 0 0 1px hsl(166, 67%, 51%) !important;
  }
  .fab,
  .fas {
    color: hsla(0, 0%, 0%, 0.33);
    margin-right: 1rem;
  }
</style>