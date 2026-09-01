<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      
      <!-- HEADER -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Cuti (Time Off)" />
        
        <div class="flex gap-2">
          <button @click="fetchData" class="inline-flex items-center justify-center rounded-lg border border-gray-300 py-2.5 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center justify-center rounded-lg bg-brand-500 py-2.5 px-6 text-center font-medium text-white hover:bg-brand-600 shadow-sm transition-transform hover:-translate-y-0.5">
            Ajukan Cuti Baru
          </button>
        </div>
      </div>

      <!-- DASHBOARD WIDGETS -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Jatah Cuti Tahunan</p>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white">12 Hari</h4>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cuti Terpakai</p>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white">4 Hari</h4>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sisa Cuti</p>
          <h4 class="text-2xl font-bold text-brand-500">8 Hari</h4>
        </div>
      </div>

      <!-- DATA TABLE -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div class="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-bold text-gray-800 dark:text-white/90 text-lg">Riwayat Pengajuan Cuti</h3>
          <div class="relative mt-3 sm:mt-0">
            <input type="text" placeholder="Cari..." class="w-full sm:w-64 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Pegawai</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Jenis Cuti</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Durasi</p></th>
                <th class="px-5 py-3 text-center"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Jumlah Hari</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Status</p></th>
                <th class="px-5 py-3 text-right"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Aksi</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="6" class="py-10 text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="6" class="py-10 text-center text-gray-500">Belum ada pengajuan cuti.</td>
              </tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {{ record.employee?.name ? record.employee.name.charAt(0) : '?' }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ record.employee?.name || `Pegawai #${record.employee_id || '-'}` }}</span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ record.leaveType?.name || 'Cuti Tahunan' }}</span>
                </td>
                <td class="px-5 py-4">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(record.start_date) }} - {{ formatDate(record.end_date) }}</span>
                </td>
                <td class="px-5 py-4 text-center">
                  <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold dark:bg-gray-700 dark:text-gray-300">
                    {{ record.number_of_days || '-' }} Hari
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span :class="getStatusClass(record.status)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(record.status)"></span>
                    {{ record.status || 'Pending' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal('edit', record)" class="p-1.5 text-gray-500 hover:text-brand-500 rounded transition-colors" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                    <button @click="record.id && deleteRecord(record.id)" class="p-1.5 text-gray-500 hover:text-error-500 rounded transition-colors" title="Batalkan"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Pengajuan Cuti -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 my-8 overflow-hidden">
        
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Pengajuan Cuti Baru' : 'Edit Pengajuan Cuti' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveRecord">
          <div class="p-6 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">ID Karyawan</label>
              <select v-model.number="formData.employee_id" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option :value="undefined">-- Pilih Pegawai --</option>
                  <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
                </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
                <input v-model="formData.start_date" type="date" @click="($event.target as any)?.showPicker()" required class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
                <input v-model="formData.end_date" type="date" @click="($event.target as any)?.showPicker()" required class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select v-model="formData.status" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Pending">Menunggu Persetujuan</option>
                <option value="Approved">Disetujui</option>
                <option value="Rejected">Ditolak</option>
              </select>
            </div>
          </div>
          
          <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Pengajuan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { employeesService } from '@/services/hr/employees.service'
import type { IEmployeeDto } from '@/types/hr/employees.dto'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { timeOffService } from '@/services/hr/time-off.service'
import type { ILeaveRequestDto } from '@/types/hr/time_off.dto'

const employeesList = ref<IEmployeeDto[]>([])
const records = ref<ILeaveRequestDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<Partial<ILeaveRequestDto>>({ id: undefined, employee_id: undefined, start_date: '', end_date: '', status: 'Pending' })

// Helpers
const formatDate = (val?: string) => {
  if (!val) return '-'
  return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
const formatForInput = (val?: string) => {
  if (!val) return ''
  return new Date(val).toISOString().split('T')[0]
}

const getStatusClass = (status?: string) => {
  if (status === 'Approved') return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
  if (status === 'Rejected') return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
  return 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
}
const getStatusDotClass = (status?: string) => {
  if (status === 'Approved') return 'bg-green-500'
  if (status === 'Rejected') return 'bg-red-500'
  return 'bg-yellow-500'
}

const fetchData = async () => {
  if (employeesList.value.length === 0) {
    try {
      employeesList.value = await employeesService.getAll()
    } catch(e) { console.error('Failed to load employees', e) }
  }
  isLoading.value = true; error.value = null
  try {
    const data = await timeOffService.getAll()
    records.value = data
  } catch (err: any) {
    error.value = 'Gagal memuat: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { 
      id: data.id, 
      employee_id: data.employee_id, 
      start_date: formatForInput(data.start_date),
      end_date: formatForInput(data.end_date),
      status: data.status || 'Pending' 
    }
  } else {
    formData.value = { id: undefined, employee_id: undefined, start_date: '', end_date: '', status: 'Pending' }
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const saveRecord = async () => {
  isSaving.value = true
  try {
    const payload = {
      employee_id: formData.value.employee_id,
      start_date: formData.value.start_date ? new Date(formData.value.start_date).toISOString() : undefined,
      end_date: formData.value.end_date ? new Date(formData.value.end_date).toISOString() : undefined,
      status: formData.value.status
    }
    
    if (modalMode.value === 'edit' && formData.value.id) {
      await timeOffService.update(formData.value.id, payload)
    } else {
      await timeOffService.create(payload)
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
  if (!confirm('Batalkan pengajuan cuti ini?')) return
  try {
    await timeOffService.delete(id)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => fetchData())
</script>
