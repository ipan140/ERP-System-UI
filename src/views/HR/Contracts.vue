<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
           <PageBreadcrumb pageTitle="Manajemen Kontrak" />
        </div>
        <button @click="openModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Buat Kontrak Baru
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
                <th scope="col" class="px-6 py-4 font-semibold">Pegawai</th>
                <th scope="col" class="px-6 py-4 font-semibold">Jabatan</th>
                <th scope="col" class="px-6 py-4 font-semibold">Gaji Pokok (Wage)</th>
                <th scope="col" class="px-6 py-4 font-semibold">Tgl Mulai</th>
                <th scope="col" class="px-6 py-4 font-semibold">Tgl Selesai</th>
                <th scope="col" class="px-6 py-4 font-semibold text-center">Status</th>
                <th scope="col" class="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="records.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div class="flex flex-col items-center justify-center">
                    <svg class="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p class="text-base font-medium">Belum ada kontrak kerja</p>
                    <p class="text-sm mt-1">Silakan buat kontrak baru untuk pegawai</p>
                  </div>
                </td>
              </tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ record.employee?.name || '-' }}</td>
                <td class="px-6 py-4">{{ record.job_position?.name || '-' }}</td>
                <td class="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">{{ formatCurrency(record.wage || 0) }}</td>
                <td class="px-6 py-4">{{ formatDate(record.start_date) }}</td>
                <td class="px-6 py-4">
                  <span v-if="record.end_date">{{ formatDate(record.end_date) }}</span>
                  <span v-else class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">Tanpa Batas</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    record.state === 'running' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    record.state === 'expired' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  ]">
                    {{ formatState(record.state) }}
                  </span>
                </td>
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
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Form -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800 my-8 overflow-hidden transform transition-all">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ modalMode === 'create' ? 'Buat Kontrak Baru' : 'Edit Kontrak' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveRecord" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <!-- Employee -->
            <div class="md:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Pegawai <span class="text-error-500">*</span></label>
              <select v-model="formData.employee_id" required class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="undefined" disabled>Pilih Pegawai...</option>
                <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
              </select>
            </div>

            <!-- Job Position -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan <span class="text-error-500">*</span></label>
              <select v-model="formData.job_position_id" required class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="undefined" disabled>Pilih Jabatan...</option>
                <option v-for="job in jobPositionsList" :key="job.id" :value="job.id">{{ job.name }}</option>
              </select>
            </div>

            <!-- Wage -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Gaji Pokok Dasar (Rp) <span class="text-error-500">*</span></label>
              <input v-model.number="formData.wage" type="number" required placeholder="Mis. 5000000" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>

            <!-- Start Date -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Mulai <span class="text-error-500">*</span></label>
              <input v-model="formData.start_date" type="date" required @click="($event.target as any)?.showPicker()" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>

            <!-- End Date -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Selesai (Opsional)</label>
              <input v-model="formData.end_date" type="date" @click="($event.target as any)?.showPicker()" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Kosongkan jika karyawan tetap (PKWTT)</p>
            </div>

            <!-- Working Schedule -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Jadwal Kerja (Shift)</label>
              <select v-model="formData.working_schedule_id" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="undefined">Gunakan Jadwal Default</option>
                <option v-for="ws in schedulesList" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
              </select>
            </div>

            <!-- State -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status Kontrak</label>
              <select v-model="formData.state" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option value="draft">Draft (Konsep)</option>
                <option value="running">Berjalan (Aktif)</option>
                <option value="expired">Berakhir / Kedaluwarsa</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
              <svg v-if="isSaving" class="w-4 h-4 mr-2 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Kontrak' }}
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
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { IContractDto, IEmployeeDto, IJobPositionDto, IWorkingScheduleDto } from '@/types/hr/employees.dto'
import type { PaginationMeta } from '@/types'

const records = ref<IContractDto[]>([])
const employeesList = ref<IEmployeeDto[]>([])
const jobPositionsList = ref<IJobPositionDto[]>([])
const schedulesList = ref<IWorkingScheduleDto[]>([])

const pagination = ref<PaginationMeta>({
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<Partial<IContractDto>>({
  employee_id: undefined,
  job_position_id: undefined,
  wage: undefined,
  start_date: '',
  end_date: '',
  working_schedule_id: undefined,
  state: 'draft'
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatState = (state?: string) => {
  switch (state) {
    case 'draft': return 'Draft'
    case 'running': return 'Aktif'
    case 'expired': return 'Berakhir'
    case 'cancelled': return 'Batal'
    default: return state || 'Draft'
  }
}

// Convert YYYY-MM-DDTHH:MM:SSZ to YYYY-MM-DD for HTML input
const toDateInputString = (isoString?: string) => {
  if (!isoString) return ''
  try {
    return isoString.split('T')[0]
  } catch {
    return ''
  }
}

const fetchData = async (page = pagination.value.page, perPage = pagination.value.per_page) => {
  isLoading.value = true
  error.value = null
  try {
    const [contractsRes, empsRes, jobsRes, schedRes] = await Promise.all([
      http.get('/hr/employees/contract', { params: { page, per_page: perPage } }),
      http.get('/hr/employees', { params: { all: true } }),
      http.get('/hr/employees/jobposition', { params: { all: true } }),
      http.get('/hr/employees/workingschedule', { params: { all: true } }).catch(() => ({ data: { data: [] } })) // Fallback if API missing
    ])
    
    records.value = contractsRes.data?.data || contractsRes.data || []
    if (contractsRes.data?.meta) {
      pagination.value = contractsRes.data.meta
    } else {
      pagination.value.total = records.value.length
      pagination.value.total_pages = Math.ceil(records.value.length / perPage) || 1
    }
    employeesList.value = empsRes.data?.data || empsRes.data || []
    jobPositionsList.value = jobsRes.data?.data || jobsRes.data || []
    schedulesList.value = schedRes.data?.data || schedRes.data || []
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data dari server'
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (newPag: PaginationMeta) => {
  fetchData(newPag.page, newPag.per_page)
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { 
      ...data,
      start_date: toDateInputString(data.start_date),
      end_date: toDateInputString(data.end_date)
    }
  } else {
    formData.value = {
      employee_id: undefined,
      job_position_id: undefined,
      wage: undefined,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      working_schedule_id: undefined,
      state: 'draft'
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    // Backend expects end_date to be omitted or null if empty
    const payload = { ...formData.value }
    if (payload.start_date && !payload.start_date.includes('T')) {
      payload.start_date += 'T00:00:00Z'
    }
    if (!payload.end_date) {
      delete payload.end_date
    } else if (!payload.end_date.includes('T')) {
      payload.end_date += 'T00:00:00Z'
    }

    if (modalMode.value === 'edit' && payload.id) {
      await http.put(`/hr/employees/contract/${payload.id}`, payload)
    } else {
      await http.post('/hr/employees/contract', payload)
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
  if (!confirm('Apakah Anda yakin ingin menghapus kontrak ini?')) return
  try {
    await http.delete(`/hr/employees/contract/${id}`)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => fetchData())
</script>
