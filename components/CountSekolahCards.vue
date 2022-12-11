<template>
  <div id="sekolah-count" class="columns">
    <div class="column">
      <div class="tile is-parent">
        <div class="card tile is-child">
          <div class="card-content">
            <div class="level is-mobile">
              <div class="level-item">
                <div class="is-widget-label">
                  <h3 class="subtitle is-spaced">Semua Sekolah</h3>
                  <h1 class="title">{{ total }}</h1>
                </div>
              </div>
              <div class="level-item has-widget-icon">
                <div class="is-widget-icon">
                  <span class="icon has-text-primary is-large"
                    ><i class="mdi mdi-school mdi-48px"></i
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="tile is-parent">
        <div class="card tile is-child">
          <div class="card-content">
            <div class="level is-mobile">
              <div class="level-item">
                <div class="is-widget-label">
                  <h3 class="subtitle is-spaced">Sekolah Negeri</h3>
                  <h1 class="title">{{ negeri }}</h1>
                </div>
              </div>
              <div class="level-item has-widget-icon">
                <div class="is-widget-icon">
                  <span class="icon has-text-danger is-large"
                    ><i class="mdi mdi-school mdi-48px"></i
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="tile is-parent">
        <div class="card tile is-child">
          <div class="card-content">
            <div class="level is-mobile">
              <div class="level-item">
                <div class="is-widget-label">
                  <h3 class="subtitle is-spaced">Sekolah Swasta</h3>
                  <h1 class="title">{{ swasta }}</h1>
                </div>
              </div>
              <div class="level-item has-widget-icon">
                <div class="is-widget-icon">
                  <span class="icon has-text-info is-large"
                    ><i class="mdi mdi-school mdi-48px"></i
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountSekolahCards',
  props: {
    total: { type: Number, default: 0 },
    negeri: { type: Number, default: 0 },
    swasta: { type: Number, default: 0 },
  }
}
</script>

<style></style>
