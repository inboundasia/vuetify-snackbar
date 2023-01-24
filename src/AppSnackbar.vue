<!-- <template>
  <v-snackbar v-bind.sync="props">
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn color="pink" text v-bind="attrs" @click="props.value = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template> -->

<script>
import { VSnackbar, VBtn } from 'vuetify/lib'

export default {
  props: {
    props: {
      type: Object,
      default: () => {
        return {}
      },
    },
    message: {
      type: String,
      default: '',
    },
    actionSlot: {
      type: Function,
      default: null,
    },
    listeners: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  methods: {
    close() {
      setTimeout(() => {
        this.$set(this.props, 'value', false)
        this.$nextTick(() => {
          this.$destroy()
          this.$el.remove()
        })
      }, 500)
    },
  },
  render(createElement) {
    const children = [this.message]
    const scopedSlots = {}

    if (this.actionSlot) {
      scopedSlots.action = this.actionSlot
    } else {
      scopedSlots.action = () =>
        createElement(
          VBtn,
          {
            props: {
              text: true,
              color: 'pink',
            },
            on: {
              click: () => {
                const callback = this.listeners['close']
                if (callback) {
                  callback()
                }
              },
            },
          },
          'Close'
        )
    }

    return createElement(
      VSnackbar,
      {
        props: Object.assign({}, this.props),
        scopedSlots,
        on: {
          input: () => {
            const callback = this.listeners['input']
            if (callback) {
              callback()
            }
          },
        },
      },
      children
    )
  },
}
</script>
