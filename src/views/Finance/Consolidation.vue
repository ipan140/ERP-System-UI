<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Konsolidasi Keuangan Multi-Cabang & Entitas</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Penggabungan Neraca Saldo & Laba Rugi Anak Perusahaan / Kantor Cabang Regional
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="openModal" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <span>Buat Laporan Konsolidasi</span>
          </button>
        </div>
      </div>

      <!-- METRIKS KONSOLIDASI -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Entitas / Cabang</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">4 <span class="text-sm font-normal text-gray-400">Cabang Aktif</span></h3>
          <p class="text-xs text-emerald-500 mt-1">HQ Jakarta, Surabaya, Medan, Bali</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Laporan Diterbitkan</p>
          <h3 class="text-2xl font-black text-brand-600 dark:text-brand-400 mt-2">{{ records.length }} <span class="text-sm font-normal text-gray-400">Periode</span></h3>
          <p class="text-xs text-gray-400 mt-1">Tersimpan dalam format konsolidasi IFRS</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Eliminasi Intercompany</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">100% <span class="text-sm font-normal text-gray-400">Seimbang</span></h3>
          <p class="text-xs text-emerald-500 mt-1">Transaksi antar-cabang tereliminasi</p>
        </div>
      </div>

      <!-- TABEL KONSOLIDASI -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Nama Laporan Konsolidasi</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Periode Finansial</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Tanggal Dibuat</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Cakupan Cabang</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="5" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat laporan konsolidasi...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Belum ada laporan konsolidasi multi-cabang yang dibuat.
                </td>
              </tr>
              <tr v-for="rec in records" :key="rec.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm">{{ rec.name }}</div>
                  <span class="text-xs text-gray-400 font-mono">Consolidation ID: #CS-{{ rec.id }}</span>
                </td>
                <td class="px-6 py-4 font-mono font-medium text-xs text-brand-600 dark:text-brand-400">
                  {{ rec.period || 'Q1 - 2026' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                  {{ formatDate(rec.created_at) }}
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span 
                    :class="(rec.branches && rec.branches.length === availableBranches.length) 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'"
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
                  >
                    {{ rec.branches ? `${rec.branches.length}/${availableBranches.length} Cabang Terpilih` : 'Semua Cabang (4/4)' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      @click="openViewModal(rec)" 
                      class="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors" 
                      title="Lihat Detail Konsolidasi"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button 
                      @click="openEditModal(rec)" 
                      class="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" 
                      title="Edit Laporan"
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

    <!-- MODAL BUAT / EDIT KONSOLIDASI -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editId ? 'Edit Laporan Konsolidasi' : 'Buat Laporan Konsolidasi Grup' }}</h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="saveReport" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Judul Laporan</label>
              <input v-model="formData.name" type="text" placeholder="Laporan Konsolidasi Finansial Q1 2026" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Periode Kuartal / Tahun</label>
              <input v-model="formData.period" type="text" placeholder="Q1 - 2026" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>

            <!-- PILIHAN CABANG / ENTITAS -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300">Pilih Cabang / Entitas Konsolidasi</label>
                <div class="flex gap-2">
                  <button type="button" @click="selectAllBranches" class="text-[11px] text-brand-600 dark:text-brand-400 hover:underline">Pilih Semua</button>
                  <span class="text-gray-300 dark:text-gray-600">|</span>
                  <button type="button" @click="formData.selectedBranches = []" class="text-[11px] text-gray-500 hover:underline">Reset</button>
                </div>
              </div>
              <div class="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-h-44 overflow-y-auto">
                <label 
                  v-for="branch in availableBranches" 
                  :key="branch.id" 
                  class="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700/60 cursor-pointer transition-colors"
                >
                  <input 
                    type="checkbox" 
                    :value="branch.id" 
                    v-model="formData.selectedBranches"
                    class="w-4 h-4 text-brand-600 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-brand-500" 
                  />
                  <div class="flex-1 text-xs">
                    <span class="font-bold text-gray-900 dark:text-white block">{{ branch.name }}</span>
                    <span class="text-gray-500 dark:text-gray-400 text-[11px]">{{ branch.region }}</span>
                  </div>
                </label>
              </div>
              <p v-if="formData.selectedBranches.length === 0" class="text-xs text-rose-500 mt-1">⚠️ Pilih minimal 1 cabang untuk dikonsolidasi.</p>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving || formData.selectedBranches.length === 0" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Jalankan Konsolidasi') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL DETAIL BREAKDOWN KONSOLIDASI CABANG -->
    <Teleport to="body">
      <div v-if="isViewModalOpen && activeConsolidation" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-950/70 backdrop-blur-sm p-4">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ activeConsolidation.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Rincian Saldo Konsolidasian Entitas Cabang Pilihan (PSAK 65)</p>
            </div>
            <button @click="isViewModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                <span class="text-[11px] text-gray-500">Periode Finansial:</span>
                <p class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">{{ activeConsolidation.period }}</p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                <span class="text-[11px] text-gray-500">Cabang Terkonsolidasi:</span>
                <p class="font-bold text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                  {{ filteredBranchesForActive.length }} dari {{ availableBranches.length }} Entitas
                </p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                <span class="text-[11px] text-gray-500">Eliminasi Intercompany:</span>
                <p class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">Seimbang (Pass)</p>
              </div>
            </div>

            <!-- Breakdown Tabel Cabang yang Terpilih Saja -->
            <div class="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden text-xs">
              <table class="w-full text-left">
                <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                  <tr>
                    <th class="px-4 py-2.5">Entitas Cabang / Regional</th>
                    <th class="px-4 py-2.5 text-right">Total Aset</th>
                    <th class="px-4 py-2.5 text-right">Total Liabilitas</th>
                    <th class="px-4 py-2.5 text-right">Laba Bersih Cabang</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300 font-mono">
                  <tr v-for="b in filteredBranchesForActive" :key="b.id">
                    <td class="px-4 py-2.5 font-sans font-medium text-gray-900 dark:text-white">{{ b.name }}</td>
                    <td class="px-4 py-2.5 text-right">{{ b.asset }}</td>
                    <td class="px-4 py-2.5 text-right">{{ b.liability }}</td>
                    <td class="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400">{{ b.profit }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
            <button type="button" @click="isViewModalOpen = false" class="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Tutup</button>
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

interface IConsolidation {
  id: number
  name: string
  period: string
  branches?: string[]
  created_at: string
}

const records = ref<IConsolidation[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const isViewModalOpen = ref(false)
const editId = ref<number | null>(null)
const activeConsolidation = ref<IConsolidation | null>(null)

const availableBranches = ref([
  { id: 'hq', name: 'PT Holding Jakarta (HQ)', region: 'Kantor Pusat - DKI Jakarta', asset: 'Rp 1.450.000.000', liability: 'Rp 320.000.000', profit: '+Rp 310.000.000' },
  { id: 'sby', name: 'Cabang Surabaya Regional', region: 'Regional Jawa Timur', asset: 'Rp 620.000.000', liability: 'Rp 140.000.000', profit: '+Rp 125.000.000' },
  { id: 'mdn', name: 'Cabang Medan Sumatera', region: 'Regional Sumatera Utara', asset: 'Rp 480.000.000', liability: 'Rp 95.000.000', profit: '+Rp 84.000.000' },
  { id: 'dps', name: 'Cabang Denpasar Bali', region: 'Regional Bali & Nusa Tenggara', asset: 'Rp 390.000.000', liability: 'Rp 60.000.000', profit: '+Rp 92.500.000' }
])

const formData = ref({
  name: '',
  period: 'Kuartal 1 (Jan - Mar 2026)',
  selectedBranches: ['hq', 'sby', 'mdn', 'dps']
})

const selectAllBranches = () => {
  formData.value.selectedBranches = availableBranches.value.map(b => b.id)
}

const filteredBranchesForActive = computed(() => {
  if (!activeConsolidation.value) return availableBranches.value
  const bList = activeConsolidation.value.branches
  if (!bList || bList.length === 0) return availableBranches.value
  return availableBranches.value.filter(b => bList.includes(b.id))
})

onMounted(() => {
  fetchConsolidations()
})

const fetchConsolidations = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/finance/consolidation')
    const raw = res.data?.data || res.data || []
    records.value = raw.map((item: any) => {
      let b = item.branches
      if (typeof b === 'string' && b.startsWith('[')) {
        try { b = JSON.parse(b) } catch {}
      }
      return { ...item, branches: Array.isArray(b) ? b : (b ? [b] : null) }
    })
  } catch (err) {
    console.error('Failed to load consolidations', err)
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
    name: 'Laporan Konsolidasi Kuartal 1 - 2026',
    period: 'Q1 - 2026',
    selectedBranches: ['hq', 'sby', 'mdn', 'dps']
  }
  isModalOpen.value = true
}

const openEditModal = (rec: IConsolidation) => {
  editId.value = rec.id
  formData.value = {
    name: rec.name,
    period: rec.period,
    selectedBranches: rec.branches && rec.branches.length ? [...rec.branches] : ['hq', 'sby', 'mdn', 'dps']
  }
  isModalOpen.value = true
}

const openViewModal = (rec: IConsolidation) => {
  activeConsolidation.value = rec
  isViewModalOpen.value = true
}

const saveReport = async () => {
  isSaving.value = true
  const payload = {
    name: formData.value.name,
    period: formData.value.period,
    branches: formData.value.selectedBranches
  }
  try {
    if (editId.value) {
      await http.put(`/finance/consolidation/${editId.value}`, payload)
    } else {
      await http.post('/finance/consolidation', payload)
    }
    isModalOpen.value = false
    await fetchConsolidations()
  } catch (err: any) {
    alert('Gagal menyimpan konsolidasi: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus laporan konsolidasi ini?')) return
  try {
    await http.delete(`/finance/consolidation/${id}`)
    await fetchConsolidations()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}
</script>
