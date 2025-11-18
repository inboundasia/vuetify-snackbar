<template>
  <div class="ds-snackbar-container">
    <transition-group name="fade" tag="div">
      <v-snackbar
        v-for="item in queue"
        :key="item.id"
        v-model="visible[item.id]"
        :color="item.color"
        :timeout="item.timeout"
        location="bottom right"
        class="mb-2"
        @update:model-value="(val) => onVisibleChange(item.id, val)"
      >
        {{ item.message }}
        <template #actions>
          <v-btn v-if="item.action" variant="text" @click="onAction(item)">{{ item.action?.text }}</v-btn>
          <v-btn icon variant="text" @click="close(item.id)"><v-icon>mdi-close</v-icon></v-btn>
        </template>
      </v-snackbar>
    </transition-group>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import useAppSnackbar from '../composables/useAppSnackbar'

const { queue, close } = useAppSnackbar()
const visible = reactive({})

watch(queue, (list) => {
  list.forEach(i => { if (visible[i.id] === undefined) visible[i.id] = true })
}, { immediate: true, deep: true })

function onVisibleChange(id, val) {
  if (val === false) {
    close(id)
    delete visible[id]
  }
}

function onAction(item) {
  try { item.action?.handler?.() } finally { close(item.id) }
}
</script>

<style scoped>
.ds-snackbar-container { position: fixed; right: 0; bottom: 0; z-index: 9999; padding-right: 12px; padding-bottom: 12px; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
