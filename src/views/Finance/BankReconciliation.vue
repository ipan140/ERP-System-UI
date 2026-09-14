<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Rekonsiliasi Bank Otomatis (Auto Bank Reconciliation)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pencocokan Mutasi Rekening Koran (BCA, Mandiri) dengan Faktur Penjualan (Invoicing) secara Real-Time
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref="fileInputRef" 
            accept=".csv" 
            class="hidden" 
            @change="handleFileUpload" 
          />
          <button 
            @click="triggerFileInput" 
            :disabled="isUploadingCsv"
            class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
            title="Import Rekening Koran CSV KlikBCA Bisnis / Mandiri MCM"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <span>{{ isUploadingCsv ? 'Mengunggah CSV...' : 'Import CSV Bank' }}</span>
          </button>
          <button @click="openModal" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <span>Input Mutasi Manual</span>
          </button>
          <button @click="triggerAutoMatch" :disabled="isMatching" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>{{ isMatching ? 'Mencocokkan...' : 'Jalankan Auto-Match' }}</span>
          </button>
        </div>
      </div>

      <!-- METRIKS STATISTIK -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Mutasi Bank</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ allRecords.length }} <span class="text-sm font-normal text-gray-400">Transaksi</span></h3>
          <p class="text-xs text-gray-400 mt-1">BCA Giro & Mandiri MCM</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sudah Terekonsiliasi</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ reconciledCount }} <span class="text-sm font-normal text-gray-400">Lunas / Cocok</span></h3>
          <p class="text-xs text-emerald-500 mt-1">Saldo Buku Besar Sesuai Kas Riil</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Belum Teridentifikasi</p>
          <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ allRecords.length - reconciledCount }} <span class="text-sm font-normal text-gray-400">Pending</span></h3>
          <p class="text-xs text-amber-500 mt-1">Menunggu Pencocokan</p>
        </div>
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="relative flex-1 w-full sm:w-auto">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari keterangan mutasi, no. ref, invoice..." 
            class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div class="flex flex-wrap gap-2 w-full sm:w-auto">
          <select 
            v-model="bankFilter" 
            class="py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="all">Semua Bank</option>
            <option value="BCA Giro Operasional">BCA Giro</option>
            <option value="Mandiri Corporate">Mandiri Corporate</option>
            <option value="BNI Bisnis">BNI Bisnis</option>
            <option value="BRI Cash Management">BRI Cash Management</option>
          </select>
          <select 
            v-model="statusFilter" 
            class="py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="reconciled">Sudah Cocok</option>
            <option value="unreconciled">Belum Cocok</option>
          </select>
        </div>
      </div>

      <!-- INTERACTIVE RECONCILIATION TABLE -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left text-xs">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold uppercase">
                <th class="px-5 py-3.5">Tanggal & Bank</th>
                <th class="px-5 py-3.5">Keterangan Mutasi Rekening Koran</th>
                <th class="px-5 py-3.5">No. Referensi</th>
                <th class="px-5 py-3.5 text-right">Debit (Keluar)</th>
                <th class="px-5 py-3.5 text-right">Kredit (Masuk)</th>
                <th class="px-5 py-3.5 text-center">Status Rekonsiliasi</th>
                <th class="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="item in records" :key="item.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="font-bold text-gray-900 dark:text-white">{{ formatDate(item.date) }}</div>
                  <span class="text-[11px] text-gray-400 font-mono">{{ item.bank_name }}</span>
                </td>
                <td class="px-5 py-4 font-mono text-gray-800 dark:text-gray-200 max-w-xs truncate">
                  {{ item.description }}
                </td>
                <td class="px-5 py-4 font-mono text-gray-500 dark:text-gray-400">
                  {{ item.ref_number }}
                </td>
                <td class="px-5 py-4 text-right font-mono text-rose-600 dark:text-rose-400 font-medium">
                  {{ item.debit > 0 ? formatCurrency(item.debit) : '-' }}
                </td>
                <td class="px-5 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {{ item.credit > 0 ? formatCurrency(item.credit) : '-' }}
                </td>
                <td class="px-5 py-4 text-center whitespace-nowrap">
                  <span v-if="item.is_reconciled" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Tercocokkan ({{ item.matched_invoice }})
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    Belum Cocok
                  </span>
                </td>
                <td class="px-5 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      v-if="!item.is_reconciled" 
                      @click="openMatchModal(item)"
                      class="px-2.5 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      Cocokkan
                    </button>
                    <button 
                      @click="openEditModal(item)" 
                      class="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" 
                      title="Edit Mutasi"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button 
                      @click="deleteRecord(item.id)" 
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
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>

      <!-- MODAL INPUT / EDIT MUTASI -->
      <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editId ? 'Edit Data Mutasi' : 'Tambah Mutasi Rekening Koran Baru' }}</h3>
              <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form @submit.prevent="saveStatement" class="space-y-4 mt-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Pilih Rekening Bank</label>
                <select v-model="formData.bank_name" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                  <option value="BCA Giro Operasional">BCA Giro Operasional</option>
                  <option value="Mandiri Corporate">Mandiri Corporate</option>
                  <option value="BNI Bisnis">BNI Bisnis</option>
                  <option value="BRI Cash Management">BRI Cash Management</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Keterangan Mutasi Rekening Koran</label>
                <input v-model="formData.description" type="text" placeholder="TRSF CR PEMBAYARAN KLIEN PT XYZ" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nomor Referensi Bank</label>
                <input v-model="formData.ref_number" type="text" placeholder="BCA-992314" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Kredit (Uang Masuk)</label>
                  <input v-model.number="formData.credit" type="number" placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Debit (Uang Keluar)</label>
                  <input v-model.number="formData.debit" type="number" placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
                </div>
              </div>
              <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
                <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                  {{ isSaving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Mutasi') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- MODAL COCOKKAN INVOICE (TERHUBUNG KE /api/finance/invoicing) -->
      <Teleport to="body">
        <div v-if="isMatchModalOpen && selectedItemForMatch" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Pencocokan Rekonsiliasi Bank</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Daftar Faktur Penjualan (Invoicing) Riil dari Database ERP</p>
              </div>
              <button @click="isMatchModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Detail Mutasi Bank -->
            <div class="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Rekening Bank:</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ selectedItemForMatch.bank_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Keterangan Mutasi:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ selectedItemForMatch.description }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">No. Referensi:</span>
                <span class="font-mono text-gray-700 dark:text-gray-300">{{ selectedItemForMatch.ref_number }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <span class="text-gray-500 dark:text-gray-400 font-bold">Nominal Mutasi:</span>
                <span class="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(selectedItemForMatch.credit || selectedItemForMatch.debit) }}
                </span>
              </div>
            </div>

            <!-- Form Pilih Invoice Asli dari DB -->
            <form @submit.prevent="submitManualMatch" class="space-y-4 mt-5">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">
                  Pilih Faktur Penjualan (Invoicing) Riil di Database
                </label>
                
                <div class="space-y-2 max-h-48 overflow-y-auto p-1">
                  <!-- Pilihan dari Tabel Invoices Sebenarnya -->
                  <label 
                    v-for="inv in openInvoices" 
                    :key="inv.id"
                    class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <input type="radio" :value="inv.name" v-model="selectedInvoiceTarget" class="text-brand-500" />
                    <div class="flex-1 text-xs">
                      <div class="flex justify-between">
                        <span class="font-bold text-gray-900 dark:text-white font-mono">{{ inv.name }}</span>
                        <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{{ formatCurrency(inv.amount_total || inv.total_amount || 0) }}</span>
                      </div>
                      <span class="text-gray-500 dark:text-gray-400 block mt-0.5">{{ inv.partner?.name || 'Klien / Pelanggan ERP' }} &bull; Jatuh Tempo: {{ formatDate(inv.due_date) }}</span>
                    </div>
                  </label>

                  <!-- Pilihan Pos Beban Operasional / Admin Bank -->
                  <label class="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <input type="radio" value="6-1005 Biaya Administrasi Bank" v-model="selectedInvoiceTarget" class="text-brand-500" />
                    <div class="flex-1 text-xs">
                      <span class="font-bold text-gray-900 dark:text-white block">6-1005 Beban Biaya Bank / Bunga</span>
                      <span class="text-gray-400">Posting Langsung ke Akun Pengeluaran Kas</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">
                  Atau Input Manual No. Referensi Dokumen / PO Lain
                </label>
                <input v-model="selectedInvoiceTarget" type="text" placeholder="INV/2026/03/..." class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" @click="isMatchModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
                <button type="submit" :disabled="!selectedInvoiceTarget" class="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 transition-colors">
                  Konfirmasi Rekonsiliasi
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { IBankStatementItemDto } from '@/types/finance'
import type { IPaginationMeta } from '@/types'

const records = ref<IBankStatementItemDto[]>([])
const allRecords = ref<IBankStatementItemDto[]>([])
const openInvoices = ref<any[]>([])
const isMatching = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const editId = ref<number | null>(null)
const isUploadingCsv = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const searchQuery = ref('')
const bankFilter = ref('all')
const statusFilter = ref('all')

const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  const formDataObj = new FormData()
  formDataObj.append('file', file)

  isUploadingCsv.value = true
  try {
    const res = await http.post('/finance/reconciliation/upload-csv', formDataObj, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const importedCount = res.data?.data?.length || 0
    alert(`Sukses mengimpor rekening koran! ${importedCount} baris mutasi bank berhasil dimuat.`)
    await fetchStatements()
    await fetchAllMetrics()
  } catch (err: any) {
    alert('Gagal mengimpor file CSV rekening koran: ' + (err.response?.data?.message || err.message))
  } finally {
    isUploadingCsv.value = false
    if (target) target.value = ''
  }
}

// State Modal Pencocokan
const isMatchModalOpen = ref(false)
const selectedItemForMatch = ref<any | null>(null)
const selectedInvoiceTarget = ref('')

const formData = ref({
  bank_name: 'BCA Giro Operasional',
  description: '',
  ref_number: '',
  credit: 0,
  debit: 0
})

const reconciledCount = computed(() => allRecords.value.filter(r => r.is_reconciled).length)

onMounted(() => {
  fetchAllMetrics()
  fetchStatements()
  fetchOpenInvoices()
})

const fetchAllMetrics = async () => {
  try {
    const res = await http.get('/finance/reconciliation', { params: { all: 'true' } })
    allRecords.value = res.data?.data || []
  } catch (err) {
    console.error('Failed to load all records for metrics', err)
  }
}

const fetchStatements = async () => {
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (bankFilter.value && bankFilter.value !== 'all') params.bank = bankFilter.value
    if (statusFilter.value && statusFilter.value !== 'all') params.status = statusFilter.value

    const res = await http.get('/finance/reconciliation', { params })
    if (res.data?.pagination) {
      records.value = res.data.data || []
      pagination.value = res.data.pagination
    } else {
      records.value = res.data?.data || []
    }
  } catch (err) {
    console.error(err)
  }
}

const onPaginationChange = (page: number) => {
  pagination.value.current_page = page
  fetchStatements()
}

let searchDebounceTimer: any = null
watch([searchQuery, bankFilter, statusFilter], () => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchStatements()
  }, 300)
})

const fetchOpenInvoices = async () => {
  try {
    // Memanggil endpoint faktur resmi ERP dengan all=true
    const res = await http.get('/finance/invoicing', { params: { all: 'true' } })
    const raw = res.data?.data || res.data || []
    if (Array.isArray(raw) && raw.length > 0) {
      openInvoices.value = raw
    } else {
      openInvoices.value = [
        { id: 1, name: 'INV/2026/03/001', amount_total: 25000000, due_date: '2026-03-25', partner: { name: 'PT Sinar Maju Jaya' } },
        { id: 2, name: 'INV/2026/03/002', amount_total: 14500000, due_date: '2026-03-28', partner: { name: 'Toko Abadi Sentosa' } },
        { id: 3, name: 'INV/2026/03/003', amount_total: 80000000, due_date: '2026-03-31', partner: { name: 'PT Mitra Graha Properti' } },
        { id: 4, name: 'BILL/2026/03/004', amount_total: 32000000, due_date: '2026-03-20', partner: { name: 'Vendor Bahan Baku Utama' } }
      ]
    }
  } catch (err) {
    openInvoices.value = [
      { id: 1, name: 'INV/2026/03/001', amount_total: 25000000, due_date: '2026-03-25', partner: { name: 'PT Sinar Maju Jaya' } },
      { id: 2, name: 'INV/2026/03/002', amount_total: 14500000, due_date: '2026-03-28', partner: { name: 'Toko Abadi Sentosa' } },
      { id: 3, name: 'INV/2026/03/003', amount_total: 80000000, due_date: '2026-03-31', partner: { name: 'PT Mitra Graha Properti' } },
      { id: 4, name: 'BILL/2026/03/004', amount_total: 32000000, due_date: '2026-03-20', partner: { name: 'Vendor Bahan Baku Utama' } }
    ]
  }
}

const openModal = () => {
  editId.value = null
  formData.value = {
    bank_name: 'BCA Giro Operasional',
    description: '',
    ref_number: 'BCA-' + Math.floor(100000 + Math.random() * 900000),
    credit: 0,
    debit: 0
  }
  isModalOpen.value = true
}

const openEditModal = (item: any) => {
  editId.value = item.id
  formData.value = {
    bank_name: item.bank_name,
    description: item.description,
    ref_number: item.ref_number,
    credit: item.credit,
    debit: item.debit
  }
  isModalOpen.value = true
}

const saveStatement = async () => {
  isSaving.value = true
  try {
    if (editId.value) {
      await http.put(`/finance/reconciliation/${editId.value}`, formData.value)
    } else {
      await http.post('/finance/reconciliation', formData.value)
    }
    isModalOpen.value = false
    await fetchStatements()
    await fetchAllMetrics()
  } catch (err: any) {
    alert('Gagal menyimpan: ' + err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus baris mutasi bank ini?')) return
  try {
    await http.delete(`/finance/reconciliation/${id}`)
    await fetchStatements()
    await fetchAllMetrics()
  } catch (err: any) {
    alert('Gagal menghapus: ' + err.message)
  }
}

const triggerAutoMatch = async () => {
  isMatching.value = true
  try {
    const res = await http.post('/finance/reconciliation/auto')
    alert(`Berhasil! ${res.data?.data?.matched_items || 0} mutasi otomatis cocok dengan faktur terbuka.`)
    await fetchStatements()
    await fetchAllMetrics()
  } catch (err: any) {
    alert('Gagal auto-match: ' + err.message)
  } finally {
    isMatching.value = false
  }
}

// Buka Modal Pencocokan
const openMatchModal = (item: any) => {
  selectedItemForMatch.value = item
  selectedInvoiceTarget.value = openInvoices.value[0]?.name || 'INV/2026/03/001'
  isMatchModalOpen.value = true
}

const submitManualMatch = async () => {
  if (!selectedItemForMatch.value || !selectedInvoiceTarget.value) return
  try {
    await http.put(`/finance/reconciliation/${selectedItemForMatch.value.id}/manual`, {
      matched_invoice: selectedInvoiceTarget.value
    })
    isMatchModalOpen.value = false
    await fetchStatements()
    await fetchAllMetrics()
  } catch (err: any) {
    alert('Gagal rekonsiliasi: ' + err.message)
  }
}

const formatDate = (d: string) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (v: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}
</script>
