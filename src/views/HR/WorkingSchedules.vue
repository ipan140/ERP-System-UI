<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
           <PageBreadcrumb pageTitle="Jadwal Kerja (Shift)" />
        </div>
        <button @click="openModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Jadwal
        </button>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div v-if="isLoading" class="py-10 text-center">
          <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Alert v-else-if="error" variant="error" title="Gagal Memuat" :message="error || ''" class="m-4" />
        
        <div v-else class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th scope="col" class="px-6 py-4 font-semibold">Nama Jadwal</th>
                <th scope="col" class="px-6 py-4 font-semibold text-center">Jam Per Minggu</th>
                <th scope="col" class="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="records.length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div class="flex flex-col items-center justify-center">
                    <svg class="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-base font-medium">Belum ada jadwal kerja</p>
                    <p class="text-sm mt-1">Silakan buat template jadwal shift baru</p>
                  </div>
                </td>
              </tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ record.name }}</td>
                <td class="px-6 py-4 text-center font-mono font-semibold">{{ record.hours_per_week }} Jam</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal('edit', record)" class="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors" title="Edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button @click="record.id && deleteRecord(record.id)" class="p-1.5 text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors" title="Hapus">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 my-8 overflow-hidden transform transition-all">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ modalMode === 'create' ? 'Tambah Jadwal Kerja' : 'Edit Jadwal Kerja' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveRecord" class="p-6">
          <div class="space-y-5">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Jadwal <span class="text-error-500">*</span></label>
              <input v-model="formData.name" type="text" required placeholder="Mis. Shift Pagi (08:00 - 17:00)" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
            
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Total Jam Kerja / Minggu <span class="text-error-500">*</span></label>
              <input v-model.number="formData.hours_per_week" type="number" step="0.5" required placeholder="Mis. 40" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Standar normal adalah 40 jam per minggu (8 jam x 5 hari).</p>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
              <svg v-if="isSaving" class="w-4 h-4 mr-2 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import { http } from '@/services/http'
import type { IWorkingScheduleDto } from '@/types/hr/employees.dto'

const records = ref<IWorkingScheduleDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<Partial<IWorkingScheduleDto>>({ id: undefined, name: '', hours_per_week: 40 })

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await http.get('/hr/employees/workingschedule')
    records.value = res.data?.data || res.data || []
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data dari server'
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data }
  } else {
    formData.value = { id: undefined, name: '', hours_per_week: 40 }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      await http.put(`/hr/employees/workingschedule/${formData.value.id}`, formData.value)
    } else {
      await http.post('/hr/employees/workingschedule', formData.value)
    }
    closeModal()
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return
  try {
    await http.delete(`/hr/employees/workingschedule/${id}`)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => fetchData())
</script>
