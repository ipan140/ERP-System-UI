<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Onboarding & Offboarding</h2>
          <PageBreadcrumb pageTitle="Daftar Tugas (Checklist)" />
        </div>
        <button @click="openModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Tugas
        </button>
      </div>

      <!-- Kanban Board -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        <!-- Onboarding Column -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 min-h-[60vh]">
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Karyawan Baru (Onboarding)
            </h3>
            <span class="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
              {{ onboardingTasks.length }}
            </span>
          </div>

          <div class="space-y-3">
            <div v-for="task in onboardingTasks" :key="task.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative group">
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="deleteRecord(task.id)" class="text-gray-400 hover:text-red-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <label class="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" :checked="task.status === 'completed'" @change="toggleStatus(task)" class="mt-1 w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700" />
                <div>
                  <p :class="['font-medium text-sm', task.status === 'completed' ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-800 dark:text-gray-200']">{{ task.task_name }}</p>
                  <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    {{ task.employee?.name || 'Unknown Employee' }}
                  </p>
                </div>
              </label>
            </div>
            <div v-if="onboardingTasks.length === 0" class="text-center py-8 text-sm text-gray-500">
              Tidak ada tugas onboarding yang tertunda.
            </div>
          </div>
        </div>

        <!-- Offboarding Column -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 min-h-[60vh]">
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              Karyawan Keluar (Offboarding)
            </h3>
            <span class="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
              {{ offboardingTasks.length }}
            </span>
          </div>

          <div class="space-y-3">
            <div v-for="task in offboardingTasks" :key="task.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative group">
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="deleteRecord(task.id)" class="text-gray-400 hover:text-red-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <label class="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" :checked="task.status === 'completed'" @change="toggleStatus(task)" class="mt-1 w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700" />
                <div>
                  <p :class="['font-medium text-sm', task.status === 'completed' ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-800 dark:text-gray-200']">{{ task.task_name }}</p>
                  <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    {{ task.employee?.name || 'Unknown Employee' }}
                  </p>
                </div>
              </label>
            </div>
            <div v-if="offboardingTasks.length === 0" class="text-center py-8 text-sm text-gray-500">
              Tidak ada tugas offboarding yang tertunda.
            </div>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>

  <!-- Modal Form -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Tambah Tugas (Checklist)</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveRecord" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Pegawai Terkait</label>
              <select v-model="formData.employee_id" required class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option :value="undefined">-- Pilih Pegawai --</option>
                <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Tipe Tugas</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                  <input type="radio" v-model="formData.type" value="onboarding" class="text-brand-500" />
                  Onboarding (Masuk)
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                  <input type="radio" v-model="formData.type" value="offboarding" class="text-brand-500" />
                  Offboarding (Resign)
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5 dark:text-gray-300">Deskripsi Tugas</label>
              <input v-model="formData.task_name" type="text" required placeholder="Cth: Siapkan Laptop, Buat Akun Email..." class="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving" class="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 transition-colors">
              {{ isSaving ? 'Menyimpan...' : 'Tambahkan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { http } from '@/services/http'

const records = ref<any[]>([])
const employeesList = ref<any[]>([])
const isLoading = ref(true)

const isModalOpen = ref(false)
const isSaving = ref(false)
const formData = ref<any>({})

const onboardingTasks = computed(() => records.value.filter(t => t.type === 'onboarding'))
const offboardingTasks = computed(() => records.value.filter(t => t.type === 'offboarding'))

const fetchData = async () => {
  isLoading.value = true
  try {
    const [res, empRes] = await Promise.all([
      http.get('/hr/employees/employeetask'),
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

const toggleStatus = async (task: any) => {
  const newStatus = task.status === 'completed' ? 'pending' : 'completed'
  try {
    await http.put(`/hr/employees/employeetask/${task.id}`, { ...task, status: newStatus })
    task.status = newStatus // Optimistic update
  } catch (err: any) {
    alert(err.message)
  }
}

const openModal = () => {
  formData.value = { type: 'onboarding', status: 'pending' }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    await http.post('/hr/employees/employeetask', formData.value)
    closeModal()
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus tugas ini?')) return
  try {
    await http.delete(`/hr/employees/employeetask/${id}`)
    fetchData()
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => fetchData())
</script>
