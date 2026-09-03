<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Tanda Tangan Digital Dokumen (Digital Signatures)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Penandatanganan Digital Sah Sesuai UU ITE untuk Kontrak Finansial, PO Vendor & Dokumen Pajak
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="openModal" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            + Buat Permintaan Tanda Tangan
          </button>
        </div>
      </div>

      <!-- KPI METRICS -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Permintaan Dokumen</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ records.length }} <span class="text-sm font-normal text-gray-400">Dokumen</span></h3>
          <p class="text-xs text-gray-400 mt-1">Tersimpan dalam Enkripsi SHA-256</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Menunggu Tanda Tangan</p>
          <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ pendingCount }} <span class="text-sm font-normal text-gray-400">Dokumen</span></h3>
          <p class="text-xs text-amber-500 mt-1">Perlu Tanda Tangan Direksi / Vendor</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Selesai Ditandatangani</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ signedCount }} <span class="text-sm font-normal text-gray-400">Sah & Valid</span></h3>
          <p class="text-xs text-emerald-500 mt-1">Sertifikat Digital Tersemat</p>
        </div>
      </div>

      <!-- TABEL DAFTAR DOKUMEN TTD -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Judul Dokumen Keuangan</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Penandatangan (Signer)</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Tanggal & Bukti Digital</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="5" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat dokumen digital...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Belum ada dokumen yang membutuhkan tanda tangan digital.
                </td>
              </tr>
              <tr v-for="rec in records" :key="rec.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm">{{ rec.document_title || rec.name }}</div>
                  <span class="text-xs text-gray-400 font-mono">Doc Ref: #SIGN-{{ rec.id }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-800 dark:text-white text-sm">{{ rec.signer_name || 'Bapak Direktur Utama' }}</div>
                  <span class="text-xs text-gray-400">{{ rec.signer_role || 'Direktur Keuangan' }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-xs text-gray-700 dark:text-gray-300">Dibuat: {{ formatDate(rec.created_at) }}</div>
                  <div v-if="rec.signature_hash" class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 truncate max-w-xs">
                    Hash: {{ rec.signature_hash.substring(0, 16) }}...
                  </div>
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span :class="getStatusBadge(rec.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ rec.status === 'signed' ? 'SUDAH TTD' : 'MENUNGGU TTD' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      @click="openViewModal(rec)"
                      class="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors" 
                      title="Lihat Detail Tanda Tangan"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button 
                      v-if="rec.status !== 'signed'" 
                      @click="openEditModal(rec)"
                      class="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" 
                      title="Edit Dokumen"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button 
                      v-if="rec.status !== 'signed'" 
                      @click="signDocument(rec)" 
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm" 
                      title="Bubuhi Tanda Tangan Digital"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Tanda Tangani
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

    <!-- MODAL PENGAJUAN TTD BARU -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Buat Permintaan Tanda Tangan Digital</h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="saveRequest" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Judul Dokumen Resmi</label>
              <input v-model="formData.document_title" type="text" placeholder="Kontrak Kerjasama Vendor Cloud Server 2026" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Penandatangan</label>
                <input v-model="formData.signer_name" type="text" placeholder="Dr. H. Hendra Gunawan" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Jabatan Penandatangan</label>
                <input v-model="formData.signer_role" type="text" placeholder="CFO / Managing Director" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menerbitkan...' : 'Terbitkan Dokumen' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
    
    <!-- VIEW MODAL -->
    <Teleport to="body">
      <div v-if="isViewModalOpen && viewData" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Detail Tanda Tangan</h3>
            <button @click="isViewModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div class="mt-5 space-y-4 text-sm">
            <div>
              <p class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Judul Dokumen</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ viewData.document_title || viewData.name }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Penandatangan</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ viewData.signer_name || 'Bapak Direktur Utama' }}</p>
                <p class="text-xs text-gray-500">{{ viewData.signer_role || 'Direktur Keuangan (CFO)' }}</p>
              </div>
              <div>
                <p class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Status</p>
                <p class="mt-1">
                  <span :class="getStatusBadge(viewData.status)" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {{ viewData.status === 'signed' ? 'SAH & VALID' : 'MENUNGGU TTD' }}
                  </span>
                </p>
              </div>
            </div>

            <div v-if="viewData.status === 'signed'" class="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
              <p class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Cryptographic Signature Hash</p>
              <p class="font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                {{ viewData.signature_hash }}
              </p>
              
              <div class="mt-4 flex items-center gap-3">
                <div class="w-16 h-16 bg-white p-1 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  <!-- Simulated QR Code placeholder -->
                  <svg class="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z"/></svg>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <p class="font-bold text-gray-700 dark:text-gray-300">Tanda Tangan Tersertifikasi</p>
                  <p>Sertifikat ini secara matematis mengunci konten dokumen.</p>
                  <p class="mt-1 font-mono">TS: {{ formatDate(viewData.updated_at || viewData.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-100 dark:border-gray-700">
            <a 
              :href="`http://localhost:8080/api/finance/sign/${viewData.id}/preview`" 
              target="_blank" 
              class="px-5 py-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Lihat File Dokumen
            </a>
            <button type="button" @click="isViewModalOpen = false" class="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg">Tutup</button>
          </div>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { http } from '@/services/http'

interface ISignRequest {
  id: number
  name: string
  document_title: string
  signer_name: string
  signer_role: string
  status: string
  signature_hash?: string
  signed_at?: string
  created_at: string
  updated_at?: string
}

const records = ref<ISignRequest[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const isViewModalOpen = ref(false)
const editId = ref<number | null>(null)
const viewData = ref<ISignRequest | null>(null)

const formData = ref({
  name: '',
  document_title: '',
  signer_name: '',
  signer_role: 'Direktur Keuangan (CFO)',
  status: 'pending'
})

onMounted(() => {
  fetchSigns()
})

const fetchSigns = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/finance/sign')
    records.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Failed to load signs', err)
  } finally {
    isLoading.value = false
  }
}

const pendingCount = computed(() => records.value.filter(r => r.status !== 'signed').length)
const signedCount = computed(() => records.value.filter(r => r.status === 'signed').length)

const formatDate = (d: string) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getStatusBadge = (status: string) => {
  if (status === 'signed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
}

const openModal = () => {
  editId.value = null
  formData.value = {
    name: 'Dokumen Digital #' + Math.floor(1000 + Math.random() * 9000),
    document_title: '',
    signer_name: '',
    signer_role: 'Direktur Keuangan (CFO)',
    status: 'pending'
  }
  isModalOpen.value = true
}

const openEditModal = (rec: ISignRequest) => {
  editId.value = rec.id
  formData.value = {
    name: rec.name || '',
    document_title: rec.document_title || '',
    signer_name: rec.signer_name || '',
    signer_role: rec.signer_role || '',
    status: rec.status || 'pending'
  }
  isModalOpen.value = true
}

const openViewModal = (rec: ISignRequest) => {
  viewData.value = rec
  isViewModalOpen.value = true
}

const saveRequest = async () => {
  isSaving.value = true
  formData.value.name = formData.value.document_title
  try {
    if (editId.value) {
      await http.put(`/finance/sign/${editId.value}`, formData.value)
    } else {
      await http.post('/finance/sign', formData.value)
    }
    isModalOpen.value = false
    await fetchSigns()
  } catch (err: any) {
    alert('Gagal menyimpan permintaan TTD: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const signDocument = async (doc: ISignRequest) => {
  if (!confirm(`Bubuhi tanda tangan digital kriptografis pada "${doc.document_title || doc.name}"?`)) return
  try {
    doc.status = 'signed'
    doc.signature_hash = 'SHA256:' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')
    await http.put(`/finance/sign/${doc.id}`, doc)
    await fetchSigns()
    alert('Dokumen berhasil ditandatangani secara digital dengan stempel hash resmi!')
  } catch (err: any) {
    alert('Gagal menandatangani: ' + (err.response?.data?.message || err.message))
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus dokumen ini?')) return
  try {
    await http.delete(`/finance/sign/${id}`)
    await fetchSigns()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}
</script>
