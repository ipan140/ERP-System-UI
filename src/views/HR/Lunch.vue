<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      
      <!-- HEADER -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Makan Siang (Lunch)" />
        
        <div class="flex gap-2">
          <button @click="fetchData" class="inline-flex items-center justify-center rounded-lg border border-gray-300 py-2.5 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center justify-center rounded-lg bg-brand-500 py-2.5 px-6 text-center font-medium text-white hover:bg-brand-600 shadow-sm transition-transform hover:-translate-y-0.5">
            + Tambah Cashmove
          </button>
        </div>
      </div>

      <!-- DASHBOARD WIDGETS -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 opacity-10">
            <svg class="w-24 h-24 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"></path></svg>
          </div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 relative z-10">Total Transaksi</p>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white relative z-10">{{ allRecords.length }} Trx</h4>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] p-5 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 relative z-10">Total Uang (Out/In)</p>
          <h4 class="text-2xl font-bold text-green-500 relative z-10">Rp {{ totalAmount.toLocaleString('id-ID') }}</h4>
        </div>
      </div>

      <!-- DATA TABLE -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-bold text-gray-800 dark:text-white/90 text-lg">Riwayat Lunch (Cashmove)</h3>
          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select v-model="selectedEmployee" class="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90">
              <option value="all">Semua Pegawai</option>
              <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
            </select>
            <div class="relative flex-1 sm:flex-initial">
              <input v-model="searchQuery" type="text" placeholder="Cari cashmove..." class="w-full sm:w-64 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Pegawai</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Tanggal</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Deskripsi</p></th>
                <th class="px-5 py-3 text-right"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Jumlah (Rp)</p></th>
                <th class="px-5 py-3 text-right"><p class="font-semibold text-gray-600 text-xs uppercase dark:text-gray-400">Aksi</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="5" class="py-10 text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="5" class="py-10 text-center text-gray-500">Belum ada transaksi.</td>
              </tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {{ record.employee?.name ? record.employee.name.charAt(0) : '?' }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ record.employee?.name || `Pegawai #${record.employee_id || '-'}` }}</span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(record.date) }}</span>
                </td>
                <td class="px-5 py-4">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ record.description || '-' }}</span>
                </td>
                <td class="px-5 py-4 text-right">
                  <span :class="(record.amount || 0) < 0 ? 'text-red-500' : 'text-green-500'" class="font-bold">
                    {{ (record.amount || 0).toLocaleString('id-ID') }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal('edit', record)" class="p-1.5 text-gray-500 hover:text-brand-500 rounded transition-colors" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                    <button @click="record.id && deleteRecord(record.id)" class="p-1.5 text-gray-500 hover:text-error-500 rounded transition-colors" title="Hapus"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar :pagination="pagination" @change="onPaginationChange" class="border-t border-gray-200 dark:border-gray-700" />
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Lunch -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 my-8 overflow-hidden">
        
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Cashmove' : 'Edit Cashmove' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveRecord">
          <div class="p-6 space-y-4">
            
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">ID Pegawai</label>
              <select v-model.number="formData.employee_id" required class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option :value="undefined">-- Pilih Pegawai --</option>
                  <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
                </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
              <input v-model="formData.date" type="date" @click="($event.target as any)?.showPicker()" required class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp) <span class="text-xs text-gray-400">(Bisa minus untuk pengeluaran)</span></label>
              <input v-model.number="formData.amount" type="number" required class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
              <input v-model="formData.description" type="text" placeholder="Mis. Topup saldo / Beli makan" class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            
          </div>
          
          <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors">
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { employeesService } from '@/services/hr/employees.service'
import type { IEmployeeDto } from '@/types/hr/employees.dto'
import { ref, onMounted, computed, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { lunchService } from '@/services/hr/lunch.service'
import type { ILunchCashmoveDto } from '@/types/hr/lunch.dto'
import type { IPaginationMeta } from '@/types'

const employeesList = ref<IEmployeeDto[]>([])
const allRecords = ref<ILunchCashmoveDto[]>([])
const records = ref<ILunchCashmoveDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedEmployee = ref('all')
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
const formData = ref<Partial<ILunchCashmoveDto>>({ id: undefined, employee_id: undefined, date: '', amount: 0, description: '' })

// Dashboard
const totalAmount = computed(() => allRecords.value.reduce((acc, curr) => acc + (curr.amount || 0), 0))

// Helpers
const formatDate = (val?: string) => {
  if (!val) return '-'
  return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
const formatForInput = (val?: string) => {
  if (!val) return ''
  return new Date(val).toISOString().split('T')[0]
}

let searchDebounceTimer: any = null
watch(searchQuery, () => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchPaginatedData()
  }, 400)
})

watch(selectedEmployee, () => {
  pagination.value.current_page = 1
  fetchPaginatedData()
})

const onPaginationChange = (page: number, limit?: number) => {
  pagination.value.current_page = page
  if (limit) pagination.value.per_page = limit
  fetchPaginatedData()
}

const fetchAllMetrics = async () => {
  try {
    const res = await lunchService.getAll({ all: 'true' })
    allRecords.value = Array.isArray(res) ? res : (res?.data || [])
  } catch (e) { console.error('Failed to load lunch metrics', e) }
}

const fetchPaginatedData = async () => {
  if (employeesList.value.length === 0) {
    try {
      const empRes = await employeesService.getAll({ all: 'true' })
      employeesList.value = Array.isArray(empRes) ? empRes : (empRes?.data || [])
    } catch(e) { console.error('Failed to load employees', e) }
  }
  isLoading.value = true; error.value = null
  try {
    const params: any = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedEmployee.value !== 'all') params.employee_id = selectedEmployee.value

    const res = await lunchService.getAll(params)
    if (res && res.data) {
      records.value = res.data
      if (res.pagination) {
        pagination.value = res.pagination
      }
    } else if (Array.isArray(res)) {
      records.value = res
    }
  } catch (err: any) {
    error.value = 'Gagal memuat: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const fetchData = async () => {
  await Promise.all([fetchAllMetrics(), fetchPaginatedData()])
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { 
      id: data.id, 
      employee_id: data.employee_id, 
      date: formatForInput(data.date),
      amount: data.amount || 0,
      description: data.description || ''
    }
  } else {
    formData.value = { id: undefined, employee_id: undefined, date: '', amount: 0, description: '' }
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const saveRecord = async () => {
  isSaving.value = true
  try {
    const payload = { ...formData.value }
    if (payload.date) payload.date = new Date(payload.date).toISOString()

    if (modalMode.value === 'edit' && formData.value.id) {
      await lunchService.update(formData.value.id, payload as ILunchCashmoveDto)
    } else {
      await lunchService.create(payload as ILunchCashmoveDto)
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
  if (!confirm('Hapus cashmove ini?')) return
  try {
    await lunchService.delete(id)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => fetchData())
</script>
