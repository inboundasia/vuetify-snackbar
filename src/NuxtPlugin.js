import SnackbarManager from './SnackbarManager'
import AppSnackbar from './AppSnackbar'

// Reference: https://github.com/euvl/vue-js-modal/blob/master/src/Plugin.js
const Plugin = {
  install(Vue, options = {}) {
    if (Vue.prototype.$snackbar) {
      return
    }

    const Manager = new SnackbarManager(options)

    Object.defineProperty(Vue.prototype, '$snackbar', {
      get: function () {
        const caller = this

        if (caller instanceof Vue) {
          const root = caller.$root

          if (!Manager.root) {
            Manager.setDynamicModalContainer(root)
          }
        }

        return Manager
      },
    })

    Vue.component('AppSnackbar', AppSnackbar)
  },
}

export default Plugin
