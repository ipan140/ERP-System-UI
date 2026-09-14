<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      
      <!-- HEADER -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Kehadiran (Attendances)" />
        <div class="flex gap-2">
          <button @click="fetchData" class="inline-flex items-center justify-center rounded-lg border border-gray-300 py-2.5 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <!-- CHECK IN / OUT ACTION AREA (Odoo Style) -->
      <div class="mb-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center shadow-sm">
        <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 text-4xl shadow-inner">
          👤
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Selamat Datang!</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Silakan rekam kehadiran Anda hari ini.</p>
        
        <div class="flex gap-4">
          <button @click="quickCheckIn" class="flex items-center gap-2 rounded-full bg-brand-500 py-3 px-8 text-lg font-bold text-white hover:bg-brand-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            Check In
          </button>
        </div>
      </div>

      <!-- ATTENDANCE TABLE -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <h3 class="font-bold text-gray-800 dark:text-white/90 text-lg mr-2">Riwayat Kehadiran</h3>
            <div class="relative w-full sm:w-64">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Cari nama pegawai..." 
                class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-1.5 pl-8 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
              />
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M19.7 18.3l-4.8-4.8c1-1.3 1.6-2.9 1.6-4.7 0-4.3-3.5-7.8-7.8-7.8S1 4.5 1 8.8s3.5 7.8 7.8 7.8c1.8 0 3.4-.6 4.7-1.6l4.8 4.8c.2.2.4.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4zM2.5 8.8c0-3.5 2.8-6.3 6.3-6.3s6.3 2.8 6.3 6.3-2.8 6.3-6.3 6.3-2.8 6.3-6.3z"/></svg>
              </span>
            </div>
            <select 
              v-model="employeeFilter" 
              class="rounded-lg border border-gray-300 bg-transparent px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Pegawai</option>
              <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
            </select>
          </div>
          <button @click="openModal('create')" class="text-sm font-medium text-brand-500 hover:text-brand-600 shrink-0">
            + Tambah Manual
          </button>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Pegawai</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Check In</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Check Out</p></th>
                <th class="px-5 py-3 text-center"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Jam Kerja</p></th>
                <th class="px-5 py-3 text-right"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Aksi</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="5" class="py-10 text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="5" class="py-10 text-center text-gray-500">Belum ada riwayat kehadiran.</td>
              </tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                      {{ record.employee?.name ? record.employee.name.charAt(0) : '?' }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ record.employee?.name || `Pegawai #${record.employee_id || '-'}` }}</span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ formatDateTime(record.check_in) }}</span>
                </td>
                <td class="px-5 py-4">
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ formatDateTime(record.check_out) }}</span>
                </td>
                <td class="px-5 py-4 text-center">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ record.worked_hours ? record.worked_hours.toFixed(2) + ' Jam' : '-' }}</span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal('edit', record)" class="p-1.5 text-gray-500 hover:text-brand-500 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                    <button @click="record.id && deleteRecord(record.id)" class="p-1.5 text-gray-500 hover:text-error-500 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
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

  <!-- Modal Manual Entry -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 my-8">
        <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          {{ modalMode === 'create' ? 'Input Kehadiran Manual' : 'Edit Kehadiran' }}
        </h3>
        <form @submit.prevent="saveRecord">
          <div class="mb-4">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">ID Karyawan</label>
            <select v-model.number="formData.employee_id" class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option :value="undefined">-- Pilih Pegawai --</option>
                  <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
                </select>
          </div>
          <div class="mb-4">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Waktu Check In</label>
            <input v-model="formData.check_in" type="datetime-local" class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div class="mb-4">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Waktu Check Out</label>
            <input v-model="formData.check_out" type="datetime-local" class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-white hover:bg-brand-600 disabled:opacity-50 transition-colors">
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { employeesService } from '@/services/hr/employees.service'
import type { IEmployeeDto } from '@/types/hr/employees.dto'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { attendancesService } from '@/services/hr/attendances.service'
import type { IAttendanceDto } from '@/types/hr/attendances.dto'
import type { IPaginationMeta } from '@/types'

const employeesList = ref<IEmployeeDto[]>([])
const records = ref<IAttendanceDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const employeeFilter = ref('all')

const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<Partial<IAttendanceDto>>({ id: undefined, employee_id: undefined, check_in: '', check_out: '' })

// Format Helper
const formatDateTime = (val?: string) => {
  if (!val) return '-'
  return new Date(val).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}
const formatForInput = (val?: string) => {
  if (!val) return ''
  const d = new Date(val)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const fetchData = async () => {
  if (employeesList.value.length === 0) {
    try {
      const empRes = await employeesService.getAll({ all: 'true' })
      employeesList.value = Array.isArray(empRes) ? empRes : (empRes?.data || [])
    } catch(e) { console.error('Failed to load employees', e) }
  }
  isLoading.value = true; error.value = null
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (employeeFilter.value !== 'all') params.employee_id = employeeFilter.value

    const res = await attendancesService.getAll(params)
    if (res?.pagination) {
      records.value = res.data || []
      pagination.value = res.pagination
    } else if (Array.isArray(res)) {
      records.value = res
    } else {
      records.value = res?.data || []
    }
  } catch (err: any) {
    error.value = 'Gagal memuat: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (page: number) => {
  pagination.value.current_page = page
  fetchData()
}

let searchDebounceTimer: any = null
watch([searchQuery, employeeFilter], () => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchData()
  }, 300)
})

  const quickCheckIn = async () => {
    try {
      const now = new Date();
      const checkOutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
      
      let workedHours = 0;
      if (checkOutTime > now) {
        workedHours = (checkOutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      }

      await attendancesService.create({ 
        employee_id: 1, 
        check_in: now.toISOString(),
        check_out: checkOutTime.toISOString(),
        worked_hours: workedHours
      })
      alert("Berhasil Check In! Waktu Check-Out telah otomatis diset ke jam 17:00 hari ini, dan Jam Kerja telah dihitung.")
      fetchData()
    } catch (e: any) { alert("Gagal Check In: " + e.message) }
  }

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { 
      id: data.id, 
      employee_id: data.employee_id, 
      check_in: formatForInput(data.check_in), 
      check_out: formatForInput(data.check_out) 
    }
  } else {
    formData.value = { id: undefined, employee_id: undefined, check_in: formatForInput(new Date().toISOString()), check_out: '' }
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const saveRecord = async () => {
    isSaving.value = true
    try {
      const payload: any = {
        employee_id: formData.value.employee_id,
        check_in: formData.value.check_in ? new Date(formData.value.check_in).toISOString() : undefined,
        check_out: formData.value.check_out ? new Date(formData.value.check_out).toISOString() : undefined
      }

      if (payload.check_in && payload.check_out) {
        const inTime = new Date(payload.check_in).getTime()
        const outTime = new Date(payload.check_out).getTime()
        if (outTime > inTime) {
          payload.worked_hours = (outTime - inTime) / (1000 * 60 * 60)
        }
      }

      if (modalMode.value === 'edit' && formData.value.id) {
        await attendancesService.update(formData.value.id, payload)
      } else {
        await attendancesService.create(payload)
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
  if (!confirm('Hapus data ini?')) return
  try {
    await attendancesService.delete(id)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => fetchData())
</script>
