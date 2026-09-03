<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <PageBreadcrumb pageTitle="Manajemen Lembur" />
        </div>
        <button @click="openModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Data
        </button>
      </div>

      <!-- Data Table -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div v-if="isLoading" class="py-10 text-center"><div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div v-else-if="records.length === 0" class="py-10 text-center text-gray-500">Belum ada data.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Pegawai</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Tanggal</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Durasi (Jam)</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Keterangan</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="row in records" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ row.employee?.name || 'Unknown' }}</td>
                <td class="px-6 py-4">{{ formatDate(row.date) }}</td>
                <td class="px-6 py-4">{{ row.hours }}</td>
                <td class="px-6 py-4">{{ row.description }}</td>
                <td class="px-6 py-4">
                  <span :class="['inline-flex px-2 py-1 text-xs font-medium rounded-full', row.status === 'approved' ? 'bg-green-100 text-green-800' : row.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800']">
                    {{ row.status?.toUpperCase() || 'PENDING' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button @click="openModal('edit', row)" title="Edit Data Lembur" class="p-2 text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deleteRecord(row.id)" title="Hapus Data Lembur" class="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="font-bold text-gray-900 dark:text-white">{{ modalMode === 'create' ? 'Tambah Data' : 'Edit Data' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>
        <form @submit.prevent="saveRecord" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Pegawai</label>
            <select v-model="formData.employee_id" required class="w-full rounded-lg border border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option :value="undefined">-- Pilih Pegawai --</option>
              <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
            </select>
          </div>
          <div><label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Tanggal</label><input type="date" step="any" v-model="formData.date" @click="($event.target as any)?.showPicker()" required class="w-full rounded-lg border border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
          <div><label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Durasi (Jam)</label><input type="number" step="any" v-model="formData.hours"  required class="w-full rounded-lg border border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
          <div><label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Keterangan</label><textarea v-model="formData.description" rows="3" class="w-full rounded-lg border border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
          <div v-if="modalMode === 'edit'">
            <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Status Persetujuan</label>
            <select v-model="formData.status" class="w-full rounded-lg border border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="mt-6 flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <button type="button" @click="closeModal" class="px-5 py-2.5 border rounded-lg">Batal</button>
            <button type="submit" :disabled="isSaving" class="px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600">{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</button>
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
import { http } from '@/services/http'

const records = ref<any[]>([])
const employeesList = ref<any[]>([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const modalMode = ref<'create'|'edit'>('create')
const isSaving = ref(false)
const formData = ref<any>({})

const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('id-ID') : '-'
const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

const fetchData = async () => {
  isLoading.value = true
  try {
    const [res, empRes] = await Promise.all([
      http.get('/hr/employees/overtime'),
      http.get('/hr/employees')
    ])
    records.value = res.data?.data || res.data || []
    employeesList.value = empRes.data?.data || empRes.data || []
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create'|'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data }
    if (formData.value.date) formData.value.date = formData.value.date.split('T')[0]
  } else {
    formData.value = { status: 'pending', date: new Date().toISOString().split('T')[0] }
  }
  isModalOpen.value = true
}

const closeModal = () => isModalOpen.value = false

const saveRecord = async () => {
  isSaving.value = true
  try {
    const payload = { ...formData.value }
    
    if (payload.hours) payload.hours = Number(payload.hours)
    
    if (payload.date && !payload.date.includes('T')) payload.date += 'T00:00:00Z'

    if (modalMode.value === 'edit' && payload.id) {
      await http.put(`/hr/employees/overtime/${payload.id}`, payload)
    } else {
      await http.post('/hr/employees/overtime', payload)
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
    await http.delete(`/hr/employees/overtime/${id}`)
    fetchData()
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => fetchData())
</script>
