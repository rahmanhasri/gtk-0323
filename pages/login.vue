<template>

  <body>
    <img src="aksen.svg" style="position:absolute; top:0; width:100%" />
    <img src="buah.png" style="position:absolute; bottom:-60px; width:100%" />
    <img src="kementan-logo.png" style="position:absolute; width:8%; top:30px; left:20px;" />
    <section>
      <div class="columns is-multiline" style="z-index:1000">
        <div class="column is-8 is-offset-2 register">
          <div class="columns shadowed">
            <div class="column left">
              <h2 class="title is-3">Sistem Pelayanan Sertifikasi GAP-GHP Hortikultura</h2>
              <h2 class="subtitle colored is-4">Kementerian Pertanian Republik Indonesia</h2>
            </div>
            <div class="column right has-text-centered">
              <h1 class="title is-4">Login</h1>
              <div v-if="error !== null" class="notification is-danger">
                <button class="delete" @click=" error = null"></button>
              {{error}} <br> Email / Password salah
              </div>
              <form @submit.prevent="login">
                <div class="field">
                  <div class="control">
                    <input class="input " type="email" v-model="email" placeholder="Email">
                  </div>
                </div>
                <div class="field" style="">
                  <div class="control">
                    <input class="input " type="password" v-model="password" placeholder="password">
                  </div>
                </div>
                <button type="submit" class="button is-block is-primary is-fullwidth" :class="{ 'is-loading': loading }">Login</button>
                <br />
                <small><em>Belum memiliki akun? <nuxt-link to="signup">daftar disini</nuxt-link></em></small>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </body>
</template>


<script>
  export default {
    layout: 'login',
    middleware: 'guest',
    data() {
      return {
        email: '',
        password: '',
        error: null
      }
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
    },
    methods: {
      async login() {
        try {
          this.$store.commit('loading');
          const response = await this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password,
              strategy: 'local',
            },
          });
          this.$store.commit('finishLoading');
          this.$auth.$storage.setUniversal('rolusr', response.data.user.role);
        } catch (e) {
          this.error = e.message
        }
      }
    }
  }
</script>

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