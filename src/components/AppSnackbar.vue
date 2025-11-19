<template>
  <div class="ds-snackbar-container" role="presentation">
    <transition-group name="ds-fade" tag="div">
      <div
        v-for="item in queue"
        :key="item.id"
        class="ds-snackbar"
        :style="{ '--ds-snackbar-bg': resolveColor(item.color) }"
        role="status"
        aria-live="polite"
      >
        <div class="ds-snackbar__message">
          {{ item.message }}
        </div>

        <div class="ds-snackbar__actions">
          <button
            v-if="item.action"
            class="ds-snackbar__btn"
            type="button"
            @click="onAction(item)"
          >
            {{ item.action?.text }}
          </button>
          <button
            class="ds-snackbar__icon-btn"
            type="button"
            aria-label="Close"
            @click="closeSnackbar(item.id)"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'
import useAppSnackbar from '../composables/useAppSnackbar'

const { queue, close } = useAppSnackbar()
const timers = new Map()

const COLOR_MAP = {
  success: '#2e7d32',
  error: '#c62828',
  info: '#1565c0',
  warning: '#ed6c02',
}

function resolveColor(color) {
  if (!color) return COLOR_MAP.success
  return COLOR_MAP[color] || color
}

function schedule(item) {
  if (timers.has(item.id)) return
  const timeout = typeof item.timeout === 'number' ? item.timeout : 2500
  if (timeout <= 0) return
  const handler = setTimeout(() => closeSnackbar(item.id), timeout)
  timers.set(item.id, handler)
}

function clearTimer(id) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function closeSnackbar(id) {
  clearTimer(id)
  close(id)
}

watch(
  queue,
  (list) => {
    list.forEach(schedule)
    Array.from(timers.keys()).forEach((id) => {
      if (!list.some((item) => item.id === id)) {
        clearTimer(id)
      }
    })
  },
  { immediate: true, deep: true },
)

onBeforeUnmount(() => {
  timers.forEach((timer) => clearTimeout(timer))
  timers.clear()
})

function onAction(item) {
  try {
    item.action?.handler?.()
  } finally {
    closeSnackbar(item.id)
  }
}
</script>

<style scoped>
.ds-snackbar-container {
  pointer-events: none;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9999;
  padding: 12px;
}

.ds-snackbar {
  pointer-events: auto;
  min-width: 280px;
  max-width: min(420px, calc(100vw - 32px));
  margin-bottom: 12px;
  background: var(--ds-snackbar-bg, #323232);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 14px 18px;
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  line-height: 1.4;
}

.ds-snackbar__message {
  flex: 1;
  word-break: break-word;
}

.ds-snackbar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ds-snackbar__btn {
  background: transparent;
  border: none;
  color: inherit;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.ds-snackbar__btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.ds-snackbar__icon-btn {
  background: transparent;
  border: none;
  color: inherit;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ds-snackbar__icon-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.ds-fade-enter-active,
.ds-fade-leave-active {
  transition: all 0.2s ease;
}

.ds-fade-enter-from,
.ds-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
