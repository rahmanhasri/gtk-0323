<template>

  <body>
    <section>
      <div class="columns is-multiline" style="z-index:1000">
        <div class="column is-8 is-offset-2 register">
          <div class="columns shadowed">
            <div class="column left">
              <h2 class="title is-3">Sistem Dashboard Guru dan Tenaga Kependidikan</h2>
              <h2 class="subtitle colored is-4">Kabupaten Sampang</h2>
            </div>
            <div class="column right has-text-centered">
              <h1 class="title is-4">Login</h1>
              <div v-if="error" class="notification is-danger">
                <button class="delete" @click="error = null"></button>
              Email / Password salah
              </div>
              <form @submit.prevent="login">
                <div class="field">
                  <div class="control">
                    <input v-model="email" class="input " placeholder="Username">
                  </div>
                </div>
                <div class="field" style="">
                  <div class="control">
                    <input v-model="password" class="input " type="password" placeholder="Password">
                  </div>
                </div>
                <button type="submit" :loading="loading" class="button is-block is-primary is-fullwidth" :class="{ 'is-loading': loading }">Login</button>
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
            },
          });
          this.$store.commit('finishLoading');
          this.$auth.$storage.setUniversal('rolusr', response.data.user.level);
        } catch (e) {
          this.error = e.message
          this.$store.commit('finishLoading');
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