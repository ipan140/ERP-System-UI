<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Jejak Audit (Audit Trails)</h2>
        <p class="text-sm text-gray-500 mt-1">Memantau aktivitas perubahan data sensitif oleh sistem atau administrator.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div v-if="isLoading" class="py-10 text-center text-gray-500">Memuat log keamanan...</div>
        <div v-else-if="records.length === 0" class="py-10 text-center text-gray-500">Belum ada jejak audit yang terekam.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold">Waktu (Timestamp)</th>
                <th class="px-6 py-4 font-semibold">Tabel/Modul</th>
                <th class="px-6 py-4 font-semibold">Aksi</th>
                <th class="px-6 py-4 font-semibold">ID Record</th>
                <th class="px-6 py-4 font-semibold">Data Lama</th>
                <th class="px-6 py-4 font-semibold">Data Baru</th>
                <th class="px-6 py-4 font-semibold text-right">Admin (User ID)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="row in records" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">{{ new Date(row.created_at).toLocaleString('id-ID') }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ row.target_table }}</td>
                <td class="px-6 py-4">
                  <span :class="['inline-flex px-2 py-1 text-xs font-bold rounded-md', row.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700']">
                    {{ row.action }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono">#{{ row.record_id }}</td>
                <td class="px-6 py-4 text-xs text-red-600 bg-red-50/50 dark:bg-red-900/10">{{ row.old_data }}</td>
                <td class="px-6 py-4 text-xs text-green-600 bg-green-50/50 dark:bg-green-900/10">{{ row.new_data }}</td>
                <td class="px-6 py-4 text-right font-medium">User #{{ row.user_id }}</td>
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
import { http } from '@/services/http'

const records = ref<any[]>([])
const isLoading = ref(true)

const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/hr/employees/audit-logs')
    records.value = res.data?.data || res.data || []
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())
</script>
