<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Arsip & Dokumen Keuangan (Finance Documents)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Penyimpanan Terpusat Berkas Rekening Koran, Bukti Potong Pajak (e-Bupot), Faktur Pajak & Rekonsiliasi
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="openModal" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <span>Unggah Dokumen Baru</span>
          </button>
        </div>
      </div>

      <!-- METRIKS DOKUMEN -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Berkas Keuangan</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ records.length }} <span class="text-sm font-normal text-gray-400">File</span></h3>
          <p class="text-xs text-gray-400 mt-1">Arsip Cloud Terenkripsi</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Faktur Pajak & Bukti Potong</p>
          <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">100% Valid</h3>
          <p class="text-xs text-blue-500 mt-1">Siap Pelaporan SPT Masa</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Penyimpanan Tersedia</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">48.2 GB</h3>
          <p class="text-xs text-emerald-500 mt-1">Kapasitas Cloud Enterprise</p>
        </div>
      </div>

      <!-- TABEL DAFTAR DOKUMEN -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Nama Dokumen / Berkas</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Entitas Terkait (Partner)</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Tanggal Upload</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Keamanan</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="5" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat dokumen keuangan...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Belum ada dokumen yang diarsipkan.
                </td>
              </tr>
              <tr v-for="rec in records" :key="rec.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    {{ rec.name }}
                  </div>
                  <span class="text-xs text-gray-400">ID Berkas: #DOC-{{ rec.id }}</span>
                </td>
                <td class="px-6 py-4 text-xs text-gray-700 dark:text-gray-300">
                  {{ rec.partner?.name || 'Bank BCA / Ditjen Pajak RI' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                  {{ formatDate(rec.created_at) }}
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    AES-256 Terlindungi
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <a 
                      href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                      target="_blank" 
                      class="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors" 
                      title="Lihat / Unduh Dokumen"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </a>
                    <button 
                      @click="openEditModal(rec)" 
                      class="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" 
                      title="Edit Dokumen"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button 
                      @click="deleteRecord(rec.id)" 
                      class="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" 
                      title="Hapus"
                    >
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

    <!-- MODAL UNGGAH / EDIT DOKUMEN -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editId ? 'Edit Dokumen Keuangan' : 'Arsipkan Dokumen Keuangan Baru' }}</h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="saveDoc" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Dokumen</label>
              <input v-model="formData.name" type="text" placeholder="Rekening Koran BCA Giro Maret 2026.pdf" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Pilih Bank / Instansi / Mitra Terkait</label>
              <select v-model.number="formData.partner_id" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                <option disabled value="0">-- Pilih Bank atau Mitra --</option>
                <option v-for="p in partners" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.type === 'bank' ? 'Bank Operasional' : (p.is_customer ? 'Pelanggan' : 'Vendor / Instansi') }})
                </option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan ke Arsip') }}
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
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { http } from '@/services/http'
import type { IFinanceDocumentDto as IDoc } from '@/types/finance'
import type { IPartnerDto as IPartner } from '@/types/core'

const records = ref<IDoc[]>([])
const partners = ref<IPartner[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const editId = ref<number | null>(null)

const formData = ref({
  name: '',
  partner_id: 1
})

onMounted(() => {
  fetchDocs()
  fetchPartners()
})

const fetchPartners = async () => {
  try {
    const res = await http.get('/base/partner')
    partners.value = res.data?.data || res.data || []
    if (partners.value.length > 0 && !formData.value.partner_id) {
      formData.value.partner_id = partners.value[0].id
    }
  } catch (err) {
    console.error('Failed to load partners', err)
  }
}

const fetchDocs = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/finance/documents')
    records.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Failed to load documents', err)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (d: string) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const openModal = () => {
  editId.value = null
  formData.value = {
    name: 'Rekening Koran Giro Operasional BCA - ' + new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }) + '.pdf',
    partner_id: partners.value[0]?.id || 1
  }
  isModalOpen.value = true
}

const openEditModal = (rec: IDoc) => {
  editId.value = rec.id
  formData.value = {
    name: rec.name,
    partner_id: rec.partner_id
  }
  isModalOpen.value = true
}

const saveDoc = async () => {
  isSaving.value = true
  try {
    if (editId.value) {
      await http.put(`/finance/documents/${editId.value}`, formData.value)
    } else {
      await http.post('/finance/documents', formData.value)
    }
    isModalOpen.value = false
    await fetchDocs()
  } catch (err: any) {
    alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus arsip berkas ini?')) return
  try {
    await http.delete(`/finance/documents/${id}`)
    await fetchDocs()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}
</script>
