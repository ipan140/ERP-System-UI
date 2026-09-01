<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 h-full flex flex-col">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Rekrutmen (Pelamar)" />
        
        <div class="flex gap-2">
          <button @click="fetchData" class="inline-flex items-center justify-center rounded-md border border-gray-300 py-2 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center justify-center rounded-md bg-brand-500 py-2 px-6 text-center font-medium text-white hover:bg-brand-600 transition-colors shadow-sm">
            + Tambah Pelamar
          </button>
        </div>
      </div>

      <!-- Loader & Error -->
      <div v-if="isLoading" class="py-10 text-center">
        <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <Alert v-else-if="error" variant="error" title="Gagal Memuat" :message="error || ''" class="mb-4" />

      <!-- KANBAN BOARD -->
      <div class="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div class="flex gap-6 h-full min-w-max items-start">
          
          <!-- Loop through stages -->
          <div v-for="stage in stages" :key="stage.id" class="w-80 flex flex-col bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-200 dark:border-gray-700 h-full max-h-[75vh]">
            
            <!-- Column Header -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-900 rounded-t-xl sticky top-0 z-10">
              <div class="flex items-center gap-2">
                <div :class="['w-3 h-3 rounded-full', stage.colorClass]"></div>
                <h3 class="font-bold text-gray-800 dark:text-white">{{ stage.name }}</h3>
              </div>
              <span class="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-1 px-2.5 rounded-full">
                {{ getApplicantsByStage(stage.id).length }}
              </span>
            </div>

            <!-- Draggable Area -->
            <div class="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              <draggable 
                :list="getApplicantsByStage(stage.id)" 
                item-key="id" 
                group="applicants" 
                @change="onCardMove($event, stage.id)"
                class="min-h-[100px] flex flex-col gap-3"
                ghost-class="opacity-50"
              >
                <template #item="{ element }">
                  <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow group relative">
                    <!-- Actions -->
                    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10 bg-white dark:bg-gray-900 rounded">
                      <button @click="openModal('edit', element)" class="p-1.5 text-gray-400 hover:text-brand-500 rounded transition-colors" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteRecord(element.id)" class="p-1.5 text-gray-400 hover:text-error-500 rounded transition-colors" title="Hapus">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>

                    <h4 class="font-bold text-gray-800 dark:text-white mb-1 pr-12">{{ element.name || 'Pelamar Tanpa Nama' }}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">{{ element.jobposition?.name || 'Posisi Tidak Ditentukan' }}</p>
                    
                    <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                      <div class="flex items-center gap-1" title="Email" v-if="element.email">
                        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span class="truncate w-20">{{ element.email }}</span>
                      </div>
                      <div class="flex items-center gap-1" title="Ekspektasi Gaji" v-if="element.expected_salary">
                        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span class="truncate">{{ element.expected_salary.toLocaleString('id-ID') }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
              
              <!-- Quick Add Button -->
              <button @click="openQuickAdd(stage.id)" class="w-full py-2.5 mt-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-dashed border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Tambah
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal CRUD -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 my-8 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Pelamar Baru' : 'Edit Data Pelamar' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="saveRecord">
          <div class="p-6 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <input v-model="formData.name" type="text" required placeholder="Nama pelamar" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input v-model="formData.email" type="email" placeholder="email@contoh.com" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">No. Telepon</label>
                <input v-model="formData.phone" type="text" placeholder="0812..." class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tahap (Stage)</label>
                <select v-model="formData.stage_id" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option v-for="stage in stages" :key="stage.id" :value="stage.id">{{ stage.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ekspektasi Gaji</label>
                <input v-model.number="formData.expected_salary" type="number" placeholder="Mis. 5000000" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow" />
              </div>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-70 transition-colors shadow-sm">
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import draggable from 'vuedraggable'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import { recruitmentService } from '@/services/hr/recruitment.service'
import type { IApplicantDto } from '@/types/hr/recruitment.dto'

// Dummy stages for Odoo-like recruitment process
const stages = ref([
  { id: 1, name: 'Kualifikasi Awal', colorClass: 'bg-blue-400' },
  { id: 2, name: 'Wawancara Pertama', colorClass: 'bg-yellow-400' },
  { id: 3, name: 'Wawancara Kedua', colorClass: 'bg-orange-400' },
  { id: 4, name: 'Penawaran Kontrak', colorClass: 'bg-purple-400' },
  { id: 5, name: 'Diterima', colorClass: 'bg-green-500' }
])

const records = ref<IApplicantDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)

const formData = ref<Partial<IApplicantDto>>({ 
  id: undefined, 
  name: '', 
  email: '', 
  phone: '', 
  expected_salary: undefined,
  stage_id: 1 
})

// Dapatkan daftar applicant berdasarkan stage
const getApplicantsByStage = (stageId: number) => {
  return records.value.filter(app => (app.stage_id || 1) === stageId)
}

// Handler saat kartu didrag & drop antar kolom
const onCardMove = async (evt: any, toStageId: number) => {
  if (evt.added) {
    const movedElement = evt.added.element
    movedElement.stage_id = toStageId
    
    // Panggil API untuk update stage_id secara background
    try {
      await recruitmentService.update(movedElement.id, { stage_id: toStageId })
    } catch (err: any) {
      console.error('Gagal update posisi:', err)
      fetchData() // Rollback jika gagal
    }
  }
}

const fetchData = async () => {
  isLoading.value = true; error.value = null
  try {
    const data = await recruitmentService.getAll()
    records.value = data
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
      name: data.name || '', 
      email: data.email || '', 
      phone: data.phone || '', 
      expected_salary: data.expected_salary,
      stage_id: data.stage_id || 1 
    }
  } else {
    formData.value = { id: undefined, name: '', email: '', phone: '', expected_salary: undefined, stage_id: 1 }
  }
  isModalOpen.value = true
}

const openQuickAdd = (stageId: number) => {
  formData.value = { id: undefined, name: '', email: '', phone: '', expected_salary: undefined, stage_id: stageId }
  modalMode.value = 'create'
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const saveRecord = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      await recruitmentService.update(formData.value.id, formData.value)
    } else {
      await recruitmentService.create(formData.value)
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
  if (!confirm('Hapus data pelamar ini?')) return
  try {
    await recruitmentService.delete(id)
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => fetchData())
</script>
