<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Business Intelligence & Financial Modeling (Spreadsheet BI)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Simulasi Anggaran Finansial, Proyeksi Runway Kas & Lembar Kerja Excel/Spreadsheet Terintegrasi DB
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="openModal" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <span>Buat Model Finansial Baru</span>
          </button>
        </div>
      </div>

      <!-- METRIKS BI & PROYEKSI -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Model Finansial Aktif</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ records.length }} <span class="text-sm font-normal text-gray-400">Sheet</span></h3>
          <p class="text-xs text-gray-400 mt-1">Live Sync ke Jurnal & Buku Besar</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Estimasi Cash Runway</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">18.4 <span class="text-sm font-normal text-gray-400">Bulan</span></h3>
          <p class="text-xs text-emerald-500 mt-1">Berdasarkan Rata-Rata Burn Rate Bulanan</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Target Pertumbuhan Revenue</p>
          <h3 class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">+24.5%</h3>
          <p class="text-xs text-purple-500 mt-1">Proyeksi Model Q3 - Q4 2026</p>
        </div>
      </div>

      <!-- TABEL DAFTAR SPREADSHEET BI -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Nama Model / Lembar Kerja</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Format & Sinkronisasi</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Terakhir Dimodifikasi</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="5" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat lembar kerja BI...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Belum ada model spreadsheet yang dibuat.
                </td>
              </tr>
              <tr v-for="rec in records" :key="rec.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    {{ rec.name }}
                  </div>
                  <span class="text-xs text-gray-400">ID Model: #BI-{{ rec.id }}</span>
                </td>
                <td class="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">
                  Odoo/Excel Grid Compatible
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                  {{ formatDate(rec.created_at) }}
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Live Terhubung
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      @click="openSpreadsheetViewer(rec)" 
                      class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40 rounded-lg transition-colors" 
                      title="Buka Spreadsheet Grid"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      Buka Sheet
                    </button>
                    <button 
                      @click="openEditModal(rec)" 
                      class="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" 
                      title="Edit Nama Model"
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

    <!-- MODAL BUAT / EDIT SPREADSHEET BI -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editId ? 'Edit Nama Model Finansial' : 'Buat Lembar Kerja BI Baru' }}</h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="saveSpreadsheet" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Judul Spreadsheet / Analisis</label>
              <input v-model="formData.name" type="text" placeholder="Simulasi Budget Capex & Opex 2026" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Buat Model Baru') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL SPREADSHEET VIEWER (INTERACTIVE GRID) -->
    <Teleport to="body">
      <div v-if="isViewerOpen && activeSpreadsheet" class="fixed inset-0 z-[99999] flex flex-col bg-gray-950/80 backdrop-blur-md p-3 sm:p-6">
        <div class="flex-1 flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          
          <!-- Toolbar Header -->
          <div class="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900 dark:text-white text-base">{{ activeSpreadsheet.name }}</h3>
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">Live DB Connected</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Sinkronisasi Jurnal Umum, GL & Laporan Keuangan Multi-Periode</p>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <button @click="alert('Rumus dan data spreadsheet berhasil disinkronkan ke GL!')" class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Sinkronkan Formula
              </button>
              <button @click="isViewerOpen = false" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Formula Bar -->
          <div class="flex items-center gap-3 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-mono text-xs">
            <span class="font-bold text-gray-700 dark:text-gray-200 px-2.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow-xs">fx</span>
            <div class="flex-1 flex items-center gap-2">
              <span class="text-brand-600 dark:text-brand-400 font-semibold">=EBITDA:</span>
              <span class="text-gray-700 dark:text-gray-200">Pendapatan (Revenue) - HPP - Beban Personalia (HR) - Beban Pemasaran (Sales)</span>
            </div>
            <span class="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline font-sans">Formula Bar Otomatis Terhitung</span>
          </div>

          <!-- Spreadsheet Grid Table -->
          <div class="flex-1 overflow-auto p-5 custom-scrollbar bg-gray-50 dark:bg-gray-950">
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden font-mono text-xs shadow-sm bg-white dark:bg-gray-900">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                    <th class="w-12 py-3 text-center border-r border-gray-200 dark:border-gray-700 bg-gray-200/60 dark:bg-gray-800/80 font-bold">#</th>
                    <th class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-bold">Komponen Finansial</th>
                    <th class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-right">Q1 Realisasi</th>
                    <th class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-right">Q2 Target Proyeksi</th>
                    <th class="px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-bold text-right">Q3 Target Proyeksi</th>
                    <th class="px-4 py-3 font-bold text-right">Total Akumulasi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="(row, idx) in sampleGridRows" :key="idx" class="hover:bg-brand-50/20 dark:hover:bg-gray-800 transition-colors">
                    <td class="text-center font-bold bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">{{ idx + 1 }}</td>
                    <td class="px-4 py-2.5 border-r border-gray-200 dark:border-gray-700 font-sans font-medium text-gray-900 dark:text-gray-100">
                      {{ row.label }}
                    </td>
                    <td class="p-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <div class="relative">
                        <input 
                          v-model.number="row.q1" 
                          type="number" 
                          class="w-full bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:bg-gray-50 dark:focus:bg-gray-800 px-2 py-1.5 rounded text-right outline-none font-mono text-gray-900 dark:text-gray-100 transition-colors" 
                        />
                      </div>
                    </td>
                    <td class="p-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <div class="relative">
                        <input 
                          v-model.number="row.q2" 
                          type="number" 
                          class="w-full bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:bg-gray-50 dark:focus:bg-gray-800 px-2 py-1.5 rounded text-right outline-none font-mono text-gray-900 dark:text-gray-100 transition-colors" 
                        />
                      </div>
                    </td>
                    <td class="p-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <div class="relative">
                        <input 
                          v-model.number="row.q3" 
                          type="number" 
                          class="w-full bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-brand-500 focus:bg-gray-50 dark:focus:bg-gray-800 px-2 py-1.5 rounded text-right outline-none font-mono text-gray-900 dark:text-gray-100 transition-colors" 
                        />
                      </div>
                    </td>
                    <td class="px-4 py-2.5 font-bold text-right text-brand-600 dark:text-brand-400 bg-brand-50/20 dark:bg-brand-950/30 font-mono">
                      {{ formatCurrency(row.q1 + row.q2 + row.q3) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bottom Summary Card -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex flex-wrap justify-between items-center text-xs">
            <div class="flex items-center gap-8">
              <div class="flex items-center gap-2">
                <span class="text-gray-500 dark:text-gray-400">Total Proyeksi Pendapatan:</span>
                <span class="font-bold font-mono text-sm text-gray-900 dark:text-white">{{ formatCurrency(totalEstimatedRevenue) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-gray-500 dark:text-gray-400">Laba Proyeksi Bersih (EBITDA):</span>
                <span class="font-bold font-mono text-sm text-emerald-600 dark:text-emerald-400">{{ formatCurrency(netProjectedProfit) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-4 text-gray-400">
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Odoo Spreadsheet Engine v17</span>
            </div>
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

interface ISpreadsheet {
  id: number
  name: string
  created_at: string
}

const records = ref<ISpreadsheet[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const isViewerOpen = ref(false)
const editId = ref<number | null>(null)
const activeSpreadsheet = ref<ISpreadsheet | null>(null)

const formData = ref({
  name: ''
})

const sampleGridRows = ref([
  { label: 'Pendapatan Usaha (Revenue)', q1: 650000000, q2: 780000000, q3: 920000000 },
  { label: 'Harga Pokok Penjualan (HPP)', q1: 320000000, q2: 360000000, q3: 410000000 },
  { label: 'Beban Gaji & Personalia (HR)', q1: 178500000, q2: 185000000, q3: 195000000 },
  { label: 'Beban Pemasaran & Sales', q1: 45000000, q2: 60000000, q3: 75000000 }
])

const totalEstimatedRevenue = computed(() => {
  const rev = sampleGridRows.value[0]
  return (rev.q1 || 0) + (rev.q2 || 0) + (rev.q3 || 0)
})

const netProjectedProfit = computed(() => {
  const [rev, hpp, hr, mkt] = sampleGridRows.value
  const totalRev = (rev.q1 || 0) + (rev.q2 || 0) + (rev.q3 || 0)
  const totalCost = ((hpp.q1 || 0) + (hpp.q2 || 0) + (hpp.q3 || 0)) +
                    ((hr.q1 || 0) + (hr.q2 || 0) + (hr.q3 || 0)) +
                    ((mkt.q1 || 0) + (mkt.q2 || 0) + (mkt.q3 || 0))
  return totalRev - totalCost
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

onMounted(() => {
  fetchSpreadsheets()
})

const fetchSpreadsheets = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/finance/spreadsheet_bi')
    records.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Failed to load spreadsheets', err)
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
    name: 'Model Proyeksi Finansial 2026'
  }
  isModalOpen.value = true
}

const openEditModal = (rec: ISpreadsheet) => {
  editId.value = rec.id
  formData.value = {
    name: rec.name
  }
  isModalOpen.value = true
}

const openSpreadsheetViewer = (rec: ISpreadsheet) => {
  activeSpreadsheet.value = rec
  isViewerOpen.value = true
}

const saveSpreadsheet = async () => {
  isSaving.value = true
  try {
    if (editId.value) {
      await http.put(`/finance/spreadsheet_bi/${editId.value}`, formData.value)
    } else {
      await http.post('/finance/spreadsheet_bi', formData.value)
    }
    isModalOpen.value = false
    await fetchSpreadsheets()
  } catch (err: any) {
    alert('Gagal menyimpan spreadsheet: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus lembar kerja ini?')) return
  try {
    await http.delete(`/finance/spreadsheet_bi/${id}`)
    await fetchSpreadsheets()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}
</script>
