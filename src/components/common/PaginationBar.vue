<template>
  <div
    v-if="pagination && pagination.total_items > 0"
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900"
  >
    <!-- Left: Showing items info & Per page dropdown -->
    <div class="flex items-center gap-3">
      <span>
        Menampilkan
        <strong class="font-semibold text-gray-800 dark:text-gray-200">{{ startItem }}</strong>
        -
        <strong class="font-semibold text-gray-800 dark:text-gray-200">{{ endItem }}</strong>
        dari
        <strong class="font-semibold text-gray-900 dark:text-white">{{ pagination.total_items }}</strong>
        entri
      </span>

      <div class="flex items-center gap-1.5 pl-2 border-l border-gray-200 dark:border-gray-700">
        <label for="perPageSelect" class="text-2xs text-gray-400">Baris:</label>
        <select
          id="perPageSelect"
          :value="pagination.per_page"
          @change="onLimitChange($event)"
          class="rounded-md border border-gray-300 bg-white px-2 py-1 text-2xs text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }} / hal
          </option>
        </select>
      </div>
    </div>

    <!-- Right: Pagination Buttons -->
    <div class="flex items-center gap-1 self-end sm:self-auto">
      <!-- First Page -->
      <button
        type="button"
        @click="goToPage(1)"
        :disabled="pagination.current_page <= 1"
        class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Halaman Pertama"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>

      <!-- Prev Page -->
      <button
        type="button"
        @click="goToPage(pagination.current_page - 1)"
        :disabled="!pagination.has_prev"
        class="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-1"
        title="Halaman Sebelumnya"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span class="hidden sm:inline">Prev</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === -1" class="px-1.5 text-gray-400">...</span>
          <button
            v-else
            type="button"
            @click="goToPage(p)"
            class="min-w-[28px] h-7 px-2 text-xs rounded font-medium transition-colors"
            :class="p === pagination.current_page
              ? 'bg-brand-500 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
          >
            {{ p }}
          </button>
        </template>
      </div>

      <!-- Next Page -->
      <button
        type="button"
        @click="goToPage(pagination.current_page + 1)"
        :disabled="!pagination.has_next"
        class="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-1"
        title="Halaman Berikutnya"
      >
        <span class="hidden sm:inline">Next</span>
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <!-- Last Page -->
      <button
        type="button"
        @click="goToPage(pagination.total_pages)"
        :disabled="pagination.current_page >= pagination.total_pages"
        class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Halaman Terakhir"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IPaginationMeta } from '@/types'

const props = withDefaults(
  defineProps<{
    pagination?: IPaginationMeta | null
    pageSizes?: number[]
  }>(),
  {
    pagination: () => ({
      current_page: 1,
      per_page: 10,
      total_items: 0,
      total_pages: 1,
      has_next: false,
      has_prev: false
    }),
    pageSizes: () => [10, 25, 50, 100]
  }
)

const emit = defineEmits<{
  (e: 'change', payload: { page: number; limit: number }): void
  (e: 'update:page', page: number): void
  (e: 'update:limit', limit: number): void
}>()

const startItem = computed(() => {
  if (!props.pagination || props.pagination.total_items === 0) return 0
  return (props.pagination.current_page - 1) * props.pagination.per_page + 1
})

const endItem = computed(() => {
  if (!props.pagination) return 0
  return Math.min(props.pagination.current_page * props.pagination.per_page, props.pagination.total_items)
})

const visiblePages = computed(() => {
  if (!props.pagination) return []
  const total = props.pagination.total_pages
  const current = props.pagination.current_page
  const pages: number[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push(-1) // ellipsis

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push(-1) // ellipsis
    pages.push(total)
  }

  return pages
})

const goToPage = (page: number) => {
  if (!props.pagination) return
  if (page < 1 || page > props.pagination.total_pages || page === props.pagination.current_page) return
  emit('update:page', page)
  emit('change', { page, limit: props.pagination.per_page })
}

const onLimitChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const newLimit = parseInt(target.value, 10) || 10
  emit('update:limit', newLimit)
  emit('change', { page: 1, limit: newLimit })
}
</script>
