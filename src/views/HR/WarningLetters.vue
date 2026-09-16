<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <PageBreadcrumb pageTitle="Surat Peringatan (SP)" />
        </div>
        <button @click="openModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Terbitkan SP Baru
        </button>
      </div>

      <!-- Data Table -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div v-if="isLoading" class="py-10 text-center">
          <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="records.length === 0" class="py-10 text-center text-gray-500">
          Belum ada data Surat Peringatan.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Pegawai</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Jenis SP</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Tanggal Terbit</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Berlaku Sampai</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Keterangan</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="row in records" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ row.employee?.name || 'Unknown' }}
                </td>
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex px-2.5 py-1 text-xs font-bold rounded-full',
                    row.warning_type === 'SP1' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    row.warning_type === 'SP2' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                    row.warning_type === 'SP3' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ row.warning_type }}
                  </span>
                </td>
                <td class="px-6 py-4">{{ formatDate(row.issue_date) }}</td>
                <td class="px-6 py-4">
                  <span :class="{'text-red-500 font-bold': isExpired(row.expiry_date)}">
                    {{ formatDate(row.expiry_date) }}
                  </span>
                  <span v-if="isExpired(row.expiry_date)" class="ml-1 text-xs text-red-500">(Kedaluwarsa)</span>
                </td>
                <td class="px-6 py-4 truncate max-w-[200px]" :title="row.description">{{ row.description }}</td>
                <td class="px-6 py-4 text-right">
                  <button @click="openModal('edit', row)" class="text-gray-400 hover:text-brand-500 mx-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                  <button @click="deleteRecord(row.id)" class="text-gray-400 hover:text-red-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Form -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Terbitkan SP' : 'Edit SP' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveRecord" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Pegawai</label>
              <select v-model="formData.employee_id" required class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option :value="undefined">-- Pilih Pegawai --</option>
                <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Jenis SP</label>
                <select v-model="formData.warning_type" required class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                  <option value="SP1">SP 1 (Ringan)</option>
                  <option value="SP2">SP 2 (Sedang)</option>
                  <option value="SP3">SP 3 (Berat)</option>
                  <option value="Suspend">Skorsing (Suspend)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Tanggal Terbit</label>
                <input v-model="formData.issue_date" type="date" @click="($event.target as any)?.showPicker()" required class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Berlaku Sampai (Kedaluwarsa)</label>
              <input v-model="formData.expiry_date" type="date" @click="($event.target as any)?.showPicker()" class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              <p class="text-xs text-gray-500 mt-1">Kosongkan jika SP ini bersifat permanen.</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Keterangan / Kronologi Pelanggaran</label>
              <textarea v-model="formData.description" required rows="3" class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500"></textarea>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving" class="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 transition-colors">
              {{ isSaving ? 'Menyimpan...' : (modalMode === 'create' ? 'Terbitkan' : 'Simpan') }}
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
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { PaginationMeta } from '@/types'

const records = ref<any[]>([])
const employeesList = ref<any[]>([])
const isLoading = ref(true)

const pagination = ref<PaginationMeta>({
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const isModalOpen = ref(false)
const modalMode = ref<'create'|'edit'>('create')
const isSaving = ref(false)
const formData = ref<any>({})

const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('id-ID') : '-'
const isExpired = (date?: string) => {
  if (!date) return false
  return new Date(date) < new Date()
}

const fetchData = async (page = pagination.value.page, perPage = pagination.value.per_page) => {
  isLoading.value = true
  try {
    const [res, empRes] = await Promise.all([
      http.get('/hr/employees/warningletter', { params: { page, per_page: perPage } }),
      http.get('/hr/employees', { params: { all: true } })
    ])
    records.value = res.data?.data || res.data || []
    if (res.data?.meta) {
      pagination.value = res.data.meta
    } else {
      pagination.value.total = records.value.length
      pagination.value.total_pages = Math.ceil(records.value.length / perPage) || 1
    }
    employeesList.value = empRes.data?.data || empRes.data || []
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (newPag: PaginationMeta) => {
  fetchData(newPag.page, newPag.per_page)
}

const openModal = (mode: 'create'|'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data }
    if (formData.value.issue_date) formData.value.issue_date = formData.value.issue_date.split('T')[0]
    if (formData.value.expiry_date) formData.value.expiry_date = formData.value.expiry_date.split('T')[0]
  } else {
    formData.value = { warning_type: 'SP1', issue_date: new Date().toISOString().split('T')[0] }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    const payload = { ...formData.value }
    // Fix Go Time parsing
    if (payload.issue_date && !payload.issue_date.includes('T')) payload.issue_date += 'T00:00:00Z'
    if (payload.expiry_date && !payload.expiry_date.includes('T')) payload.expiry_date += 'T00:00:00Z'
    if (!payload.expiry_date) delete payload.expiry_date

    if (modalMode.value === 'edit' && payload.id) {
      await http.put(`/hr/employees/warningletter/${payload.id}`, payload)
    } else {
      await http.post('/hr/employees/warningletter', payload)
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
  if (!confirm('Cabut SP ini?')) return
  try {
    await http.delete(`/hr/employees/warningletter/${id}`)
    fetchData()
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => fetchData())
</script>
