<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Departemen</h2>
          <PageBreadcrumb pageTitle="Master Departemen" />
        </div>
        <div class="flex gap-2">
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors shadow-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Departemen
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>

      <div v-else-if="error" class="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        {{ error }}
      </div>

      <div v-else class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" class="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">ID</th>
                <th scope="col" class="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Nama Departemen</th>
                <th scope="col" class="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Manajer</th>
                <th scope="col" class="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Induk Departemen (Parent)</th>
                <th scope="col" class="px-5 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
              <tr v-if="records.length === 0">
                <td colspan="5" class="px-5 py-8 text-center text-gray-500 dark:text-gray-400">Tidak ada data departemen.</td>
              </tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{{ record.id }}</td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900 dark:text-white">{{ record.name }}</div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div v-if="record.manager" class="h-6 w-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {{ record.manager.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      {{ record.manager?.name || '-' }}
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ record.parent?.name || '-' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal('edit', record)" class="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors" title="Edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button @click="record.id && deleteRecord(record.id)" class="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Hapus">
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
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            {{ modalMode === 'create' ? 'Tambah Departemen' : 'Edit Departemen' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="saveRecord">
          <div class="p-6 space-y-5">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Departemen <span class="text-red-500">*</span></label>
              <input v-model="formData.name" type="text" required placeholder="Mis. HR, Finance, IT" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Manajer Departemen</label>
              <select v-model.number="formData.manager_id" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="undefined">-- Pilih Manajer --</option>
                <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Pilih pegawai yang menjadi kepala departemen ini.</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Induk Departemen (Parent)</label>
              <select v-model.number="formData.parent_id" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow">
                <option :value="undefined">-- Tidak Ada (Pusat) --</option>
                <template v-for="dept in records" :key="dept.id">
                  <option v-if="dept.id !== formData.id" :value="dept.id">{{ dept.name }}</option>
                </template>
              </select>
              <p class="mt-1 text-xs text-gray-500">Gunakan jika departemen ini adalah subdivisi dari departemen lain.</p>
            </div>
          </div>
          
          <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Batal</button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Departemen' }}
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
import { departmentsService } from '@/services/hr/departments.service'
import { employeesService } from '@/services/hr/employees.service'
import type { IDepartmentDto, IEmployeeDto } from '@/types/hr/employees.dto'

const records = ref<IDepartmentDto[]>([])
const employeesList = ref<IEmployeeDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<Partial<IDepartmentDto>>({ id: undefined, name: '', manager_id: undefined, parent_id: undefined })

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [deptData, empData] = await Promise.all([
      departmentsService.getAll(),
      employeesService.getAll()
    ])
    records.value = deptData
    employeesList.value = empData
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { 
      id: data.id, 
      name: data.name,
      manager_id: data.manager_id,
      parent_id: data.parent_id
    }
  } else {
    formData.value = { id: undefined, name: '', manager_id: undefined, parent_id: undefined }
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
      await departmentsService.update(formData.value.id, formData.value as IDepartmentDto)
    } else {
      await departmentsService.create(formData.value as IDepartmentDto)
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
  if (!confirm('Apakah Anda yakin ingin menghapus departemen ini?')) return
  try {
    await departmentsService.delete(id)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>
