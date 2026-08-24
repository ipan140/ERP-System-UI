
<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-start justify-between mb-6">
        <PageBreadcrumb pageTitle="Events" />
        
        <div class="flex gap-2">
          <button @click="fetchData" class="inline-flex items-center justify-center rounded-md border border-gray-300 py-2 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center justify-center rounded-md bg-brand-500 py-2 px-6 text-center font-medium text-white hover:bg-brand-600">
            + Tambah Data
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        
        <div class="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 gap-4">
          <h3 class="font-bold text-gray-800 dark:text-white/90 text-title-sm">Recent Data</h3>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative w-full sm:w-64">
              <input type="text" placeholder="Search..." class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M19.7 18.3l-4.8-4.8c1-1.3 1.6-2.9 1.6-4.7 0-4.3-3.5-7.8-7.8-7.8S1 4.5 1 8.8s3.5 7.8 7.8 7.8c1.8 0 3.4-.6 4.7-1.6l4.8 4.8c.2.2.4.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4zM2.5 8.8c0-3.5 2.8-6.3 6.3-6.3s6.3 2.8 6.3 6.3-2.8 6.3-6.3 6.3-6.3-2.8-6.3-6.3z"/></svg>
              </span>
            </div>
            <button class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="w-12 px-5 py-3 sm:px-6">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800" />
                </th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">ID / Info</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama / Judul</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p></th>
                <th class="px-5 py-3 text-right sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="5" class="py-10 text-center">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                </td>
              </tr>
              <tr v-else-if="error"><td colspan="5" class="p-4"><Alert variant="error" title="Gagal" :message="error" /></td></tr>
              <tr v-else-if="records.length === 0"><td colspan="5" class="px-5 py-4 text-center text-gray-500">Data masih kosong.</td></tr>
              <tr v-for="(record, index) in records" :key="record.id || index" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-5 py-4 sm:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold dark:bg-gray-800">
                      {{ record.id || (index + 1) }}
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ record.name || record.title || 'Data ' + (index+1) }}</span>
                  <span class="block text-gray-500 text-theme-xs dark:text-gray-400">{{ record.description || record.job_title || '-' }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <Badge color="success">
                    {{ record.status || 'Active' }}
                  </Badge>
                </td>
                <td class="px-5 py-4 sm:px-6 text-right">
                  <div class="flex items-center justify-end gap-3">
                    <button @click="openModal('edit', record)" class="text-brand-500 hover:text-brand-700 font-medium">Edit</button>
                    <button @click="deleteRecord(record.id)" class="text-gray-500 hover:text-error-500 transition-colors" title="Hapus">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-end gap-4 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <button class="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">&larr; Previous</button>
          <div class="flex items-center gap-1">
            <button class="w-8 h-8 flex items-center justify-center text-sm font-medium text-white bg-brand-500 rounded-lg">1</button>
            <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-50 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800">2</button>
            <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-50 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800">3</button>
          </div>
          <button class="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Next &rarr;</button>
        </div>

      </div>
    </div>
  </AdminLayout>

  <!-- Modal CRUD -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 my-8">
      <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {{ modalMode === 'create' ? 'Tambah Data' : 'Edit Data' }}
      </h3>
      <form @submit.prevent="saveRecord">
        
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama / Judul</label>
          <input v-model="formData.name" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi / Keterangan</label>
          <input v-model="formData.description" type="text" class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="closeModal" class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
          <button type="submit" :disabled="isSaving" class="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50">
            {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import Badge from '@/components/ui/Badge.vue'
import { API_BASE_URL } from '@/config/api'

const records = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref({ id: null, name: '', description: '' })

const fetchData = async () => {
  isLoading.value = true; error.value = null
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(API_BASE_URL + '/marketing/events', {
      headers: { 'Authorization': token ? 'Bearer ' + token : '', 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error('HTTP error! status: ' + res.status)
    const data = await res.json()
    records.value = Array.isArray(data) ? data : (data.data || [])
  } catch (err: any) { error.value = 'Gagal: ' + err.message } finally { isLoading.value = false }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { id: data.id, name: data.name || data.title || '', description: data.description || '' }
  } else {
    formData.value = { id: null, name: '', description: '' }
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const saveRecord = async () => {
  isSaving.value = true
  try {
    const token = localStorage.getItem('token')
    const isEdit = modalMode.value === 'edit'
    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit ? API_BASE_URL + '/marketing/events/' + formData.value.id : API_BASE_URL + '/marketing/events'
    
    const { id, ...payload } = formData.value

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': token ? 'Bearer ' + token : '', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Gagal menyimpan data')
    closeModal(); fetchData()
  } catch (err: any) { alert(err.message) } finally { isSaving.value = false }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus data ini?')) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(API_BASE_URL + '/marketing/events/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': token ? 'Bearer ' + token : '' }
    })
    if (!res.ok) throw new Error('Gagal menghapus')
    fetchData()
  } catch (err: any) { alert(err.message) }
}

onMounted(() => fetchData())
</script>
