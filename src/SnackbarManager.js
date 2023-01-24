import Vue from 'vue'
import AppSnackbar from './AppSnackbar'

export default class {
  constructor(options) {
    this.options = options
  }

  setDynamicModalContainer(root) {
    this.root = root
  }

  show(propsData) {
    (propsData)
    const SnackbarComponent = Vue.extend(AppSnackbar)
    const instance = new SnackbarComponent({
      parent: this.root,
      propsData,
    }).$mount()
    document
      .querySelector(this.options?.container || '#__nuxt .v-application--wrap')
      .appendChild(instance.$el)
    return instance
  }
}
