<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <h4 class="text-xs font-bold text-gray-900 dark:text-white">Jejak Audit Kepatuhan (ISO 9001)</h4>
          <p class="text-2xs text-gray-400">Riwayat otentik perubahan status, nominal, diagnosa, dan penanggung jawab</p>
        </div>
      </div>
      <button
        type="button"
        @click="loadLogs"
        class="p-1 rounded-md text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        title="Muat Ulang Log"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-8 text-center text-xs text-gray-500">
      <div class="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-2xs">Memuat jejak audit...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="logs.length === 0" class="py-8 text-center text-xs text-gray-400 dark:text-gray-500">
      <p>Belum ada riwayat aktivitas yang tercatat untuk entitas ini.</p>
    </div>

    <!-- Timeline List -->
    <div v-else class="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-4 my-2">
      <div
        v-for="item in logs"
        :key="item.id"
        class="relative pl-4"
      >
        <!-- Dot Icon -->
        <span
          class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900"
          :class="getActionDotClass(item.action)"
        ></span>

        <div class="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-xs dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex items-center justify-between gap-2">
            <span
              class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              :class="getActionBadgeClass(item.action)"
            >
              {{ item.action }}
            </span>
            <span class="text-2xs text-gray-400 font-mono">
              {{ formatDateTime(item.created_at) }}
            </span>
          </div>

          <!-- Performer & IP -->
          <div class="mt-1.5 flex items-center gap-2 text-2xs text-gray-500 dark:text-gray-400">
            <span class="font-semibold text-gray-800 dark:text-gray-200">
              👤 {{ item.user_name || 'Sistem Otomatis' }}
            </span>
            <span v-if="item.ip_address" class="text-gray-400">
              (IP: {{ item.ip_address }})
            </span>
          </div>

          <!-- Notes -->
          <p v-if="item.notes" class="mt-1 text-2xs text-gray-700 dark:text-gray-300">
            {{ item.notes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { activityLogsService } from '@/services/services/activity-logs.service'
import type { IActivityLogDto } from '@/types/services'

const props = defineProps<{
  entityType: string
  entityId?: number | string
}>()

const logs = ref<IActivityLogDto[]>([])
const isLoading = ref(false)

const loadLogs = async () => {
  if (!props.entityId) return
  isLoading.value = true
  try {
    logs.value = await activityLogsService.getByEntity(props.entityType, props.entityId)
  } catch (err) {
    console.error('Failed to load activity logs:', err)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.entityId, (newVal) => {
  if (newVal) loadLogs()
}, { immediate: true })

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const getActionDotClass = (action?: string) => {
  switch ((action || '').toUpperCase()) {
    case 'CREATE': return 'bg-blue-500'
    case 'STATUS_CHANGE': return 'bg-amber-500'
    case 'QC_PASS': return 'bg-emerald-500'
    case 'BAST_VALIDATE': return 'bg-emerald-600'
    case 'ESCALATE': return 'bg-rose-500'
    case 'GPS_CHECK_IN': return 'bg-purple-500'
    default: return 'bg-gray-400'
  }
}

const getActionBadgeClass = (action?: string) => {
  switch ((action || '').toUpperCase()) {
    case 'CREATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    case 'STATUS_CHANGE': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    case 'QC_PASS': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    case 'BAST_VALIDATE': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    case 'ESCALATE': return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
    case 'GPS_CHECK_IN': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}
</script>
