import useAppSnackbar from './composables/useAppSnackbar'
import AppSnackbar from './components/AppSnackbar.vue'

const install = (app) => {
  app.component('AppSnackbar', AppSnackbar)
  app.provide('useAppSnackbar', useAppSnackbar)
}

export { AppSnackbar, useAppSnackbar }
export default { AppSnackbar, useAppSnackbar, install }
