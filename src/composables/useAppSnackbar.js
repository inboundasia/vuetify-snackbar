import { ref, markRaw } from 'vue'

const queue = ref([])

export default function useAppSnackbar() {
  function show(options) {
    const id = Math.random().toString(36).slice(2)
    const item = {
      id,
      message: options.message || '',
      color: options.color || 'success',
      timeout: typeof options.timeout === 'number' ? options.timeout : 2500,
      action: options.action || null,
    }
    queue.value.push(markRaw(item))
    return id
  }

  function success(message, timeout) { return show({ message, color: 'success', timeout }) }
  function error(message, timeout) { return show({ message, color: 'error', timeout }) }
  function info(message, timeout) { return show({ message, color: 'info', timeout }) }
  function warning(message, timeout) { return show({ message, color: 'warning', timeout }) }

  function close(id) {
    if (!id) { queue.value.shift(); return }
    const idx = queue.value.findIndex(i => i.id === id)
    if (idx !== -1) queue.value.splice(idx, 1)
  }

  return { queue, show, success, error, info, warning, close }
}
