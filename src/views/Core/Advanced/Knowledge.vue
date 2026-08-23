<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Basis Pengetahuan (Knowledge Base)
        </h2>
        <button
          @click="fetchData"
          class="inline-flex items-center justify-center rounded-md bg-brand-500 py-2 px-6 text-center font-medium text-white hover:bg-brand-600 lg:px-8 xl:px-10"
        >
          Refresh Data
        </button>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">ID</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama / Judul</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p></th>
                <th class="px-5 py-3 text-right sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading" class="border-t border-gray-100 dark:border-gray-800">
                <td colspan="4" class="px-5 py-4 text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="error" class="border-t border-gray-100 dark:border-gray-800">
                <td colspan="4" class="px-5 py-4 text-center text-red-500">{{ error }}</td>
              </tr>
              <tr v-else-if="records.length === 0" class="border-t border-gray-100 dark:border-gray-800">
                <td colspan="4" class="px-5 py-4 text-center text-gray-500">Data masih kosong.</td>
              </tr>
              <tr v-for="record in records" :key="record.id" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-5 py-4 sm:px-6"><p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ record.id || '-' }}</p></td>
                <td class="px-5 py-4 sm:px-6">
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ record.name || record.title || 'Tidak ada nama' }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6"><p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ record.status || 'Aktif' }}</p></td>
                <td class="px-5 py-4 sm:px-6 text-right">
                  <button class="text-brand-500 hover:text-brand-700">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { API_BASE_URL } from '@/config/api'

const records = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/core/knowledge`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    records.value = Array.isArray(data) ? data : (data.data || [])
  } catch (err: any) {
    error.value = 'Gagal mengambil data dari server. (' + err.message + ')'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
