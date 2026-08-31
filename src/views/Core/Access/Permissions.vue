<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Dynamic RBAC" />
        
        <div class="flex gap-2">
          <button
            @click="fetchData"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 py-2 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Refresh
          </button>
          <button
            @click="openModal('create')"
            class="inline-flex items-center justify-center rounded-md bg-brand-500 py-2 px-6 text-center font-medium text-white hover:bg-brand-600"
          >
            + Tambah Akses Role
          </button>
        </div>
      </div>

      <!-- Error and Loading -->
      <Alert v-if="error" variant="error" title="Error" :message="error" class="mb-4" />
      <div v-if="isLoading" class="mb-4 text-sm text-gray-500">Memuat data akses...</div>

      <!-- Table Section -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 gap-4">
          <h3 class="font-bold text-gray-800 dark:text-white/90 text-title-sm">Access Control List (ACL)</h3>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative w-full sm:w-64">
              <input type="text" placeholder="Cari Role atau Modul..." class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
            </div>
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-800 dark:text-white/90">Role</p></th>
                <th class="px-5 py-3 text-left"><p class="font-semibold text-gray-800 dark:text-white/90">Module</p></th>
                <th class="px-5 py-3 text-center"><p class="font-semibold text-gray-800 dark:text-white/90">Read</p></th>
                <th class="px-5 py-3 text-center"><p class="font-semibold text-gray-800 dark:text-white/90">Write</p></th>
                <th class="px-5 py-3 text-center"><p class="font-semibold text-gray-800 dark:text-white/90">Delete</p></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="records.length === 0" class="border-b border-gray-200 dark:border-gray-700">
                <td colspan="5" class="px-5 py-4 text-center text-sm text-gray-500">Tidak ada data.</td>
              </tr>
              <tr v-else v-for="item in records" :key="item.id" class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-5 py-4">
                  <span class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {{ item.role_name }}
                  </span>
                </td>
                <td class="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                  {{ item.module }}
                </td>
                
                <!-- Read Toggle -->
                <td class="px-5 py-4 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" :checked="item.can_read" @change="handleToggle(item, 'read', $event)">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 dark:peer-checked:bg-green-500"></div>
                  </label>
                </td>

                <!-- Write Toggle -->
                <td class="px-5 py-4 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" :checked="item.can_write" @change="handleToggle(item, 'write', $event)">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 dark:peer-checked:bg-blue-500"></div>
                  </label>
                </td>

                <!-- Delete Toggle -->
                <td class="px-5 py-4 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" :checked="item.can_delete" @change="handleToggle(item, 'delete', $event)">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500 dark:peer-checked:bg-red-500"></div>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[999999] flex items-center justify-center">
        <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h4 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Tambah Akses Modul</h4>
          <form @submit.prevent="saveData">
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Role (Contoh: SALES)</label>
              <input v-model="formData.role_name" required type="text" class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Modul (Contoh: inventory)</label>
              <select v-model="formData.module" required class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"><option value="" disabled>-- Pilih Modul --</option><option v-for="mod in availableModules" :key="mod" :value="mod">{{ mod }}</option></select>
            </div>

            <div class="flex justify-end gap-3">
              <button type="button" @click="closeModal" class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
              <button type="submit" :disabled="isSaving" class="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import { permissionsService } from '@/services/core/permissions.service'
import type { IRolePermissionDto } from '@/types/core/permissions.dto'

const records = ref<IRolePermissionDto[]>([])
const availableModules = ref<string[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const isSaving = ref(false)
const formData = ref({ role_name: '', module: '' })

const fetchData = async () => {
  isLoading.value = true; error.value = null
  try {
    const data = await permissionsService.getAll()
    records.value = Array.isArray(data) ? data : []
    try {
      const modRes = await axios.get('http://localhost:8080/api/core/permissions/modules', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      availableModules.value = modRes.data.data || []
    } catch (e) {}
  } catch (err: any) {
    error.value = 'Gagal memuat data akses: ' + (err.message || '')
  } finally {
    isLoading.value = false
  }
}

const handleToggle = async (item: IRolePermissionDto, action: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newValue = target.checked;
  
  // Optimistic UI update
  const previousValue = (item as any)[`can_${action}`];
  (item as any)[`can_${action}`] = newValue;

  try {
    await permissionsService.toggle({
      role_name: item.role_name,
      module: item.module,
      action: action,
      value: newValue
    });
  } catch (err) {
    console.error('Toggle failed', err);
    // Revert on failure
    (item as any)[`can_${action}`] = previousValue;
    target.checked = previousValue;
    alert('Gagal mengubah status izin.');
  }
}

const openModal = (mode: 'create') => {
  formData.value = { role_name: '', module: '' }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveData = async () => {
  isSaving.value = true
  try {
    await permissionsService.toggle({
      role_name: formData.value.role_name,
      module: formData.value.module,
      action: 'read',
      value: true
    })
    closeModal()
    await fetchData()
  } catch (err: any) {
    console.error(err)
    alert('Gagal menambah akses baru. Pastikan format benar.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>




