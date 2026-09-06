<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Otomatisasi Pemasaran
        </h2>
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
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">ID</p></th>
                <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Kampanye</p></th><th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Pemicu (Trigger)</p></th>
                <th class="px-5 py-3 text-right sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading"><td colspan="4" class="px-5 py-4 text-center text-gray-500">Memuat data...</td></tr>
              <tr v-else-if="error"><td colspan="4" class="px-5 py-4 text-center text-red-500">{{ error }}</td></tr>
              <tr v-else-if="records.length === 0"><td colspan="4" class="px-5 py-4 text-center text-gray-500">Data masih kosong.</td></tr>
              <tr v-for="record in records" :key="record.id" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-5 py-4 sm:px-6"><p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ record.id || '-' }}</p></td>
                <td class="px-5 py-4 sm:px-6"><p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ record.campaign_name || '-' }}</p></td><td class="px-5 py-4 sm:px-6"><p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ record.trigger || '-' }}</p></td>
                <td class="px-5 py-4 sm:px-6 text-right">
                  <div class="flex items-center justify-end gap-3">
                    <button @click="openModal('edit', record)" class="text-brand-500 hover:text-brand-700 font-medium">Edit</button>
                    <button @click="record.id && deleteRecord(record.id)" class="text-red-500 hover:text-red-700 font-medium">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal CRUD -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 my-8">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {{ modalMode === 'create' ? 'Tambah Data' : 'Edit Data' }}
        </h3>
        <form @submit.prevent="saveRecord">
          
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Kampanye</label>
            <input v-model="formData.campaign_name" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Pemicu (Trigger)</label>
            <input v-model="formData.trigger" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select v-model="formData.status" class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="Active">Active</option><option value="Paused">Paused</option><option value="Completed">Completed</option>
            </select>
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
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { marketingAutomationService } from '@/services/marketing/automation.service'

const records = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref({ id: null, campaign_name: '', trigger: '', status: 'Active' })

const fetchData = async () => {
  isLoading.value = true; error.value = null
  try {
    const data = await marketingAutomationService.getAll()
    records.value = data
  } catch (err: any) {
    error.value = 'Gagal: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { id: data.id, campaign_name: data.campaign_name || '', trigger: data.trigger || '', status: data.status || 'Active' }
  } else {
    formData.value = { id: null, campaign_name: '', trigger: '', status: 'Active' }
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const saveRecord = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      await marketingAutomationService.update(formData.value.id, formData.value)
    } else {
      await marketingAutomationService.create(formData.value)
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
    await marketingAutomationService.delete(id)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => fetchData())
</script>
