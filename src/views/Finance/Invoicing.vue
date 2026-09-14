<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Faktur & Tagihan (Customer Invoicing)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manajemen Piutang Usaha (AR), PPN 11%, Status Pembayaran & Cetak Faktur PDF Resmi
          </p>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <button @click="triggerDunning" :disabled="isDunningRunning" class="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-400 shadow-sm hover:bg-amber-100 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {{ isDunningRunning ? 'Menyapu Tagihan...' : 'Sapu Tagihan Macet (Dunning)' }}
          </button>
          <button @click="openInvoiceModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Buat Faktur Baru
          </button>
        </div>
      </div>

      <!-- KPI METRICS INVOICING -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Nilai Faktur</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ formatCurrency(totalInvoiced) }}</h3>
          <p class="text-xs text-gray-400 mt-1">{{ records.length }} Faktur Terbit</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Menunggu Pembayaran</p>
          <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{{ formatCurrency(totalUnpaid) }}</h3>
          <p class="text-xs text-blue-500 mt-1">{{ unpaidCount }} Faktur Belum Lunas</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Lunas Terbayar</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ formatCurrency(totalPaid) }}</h3>
          <p class="text-xs text-emerald-500 mt-1">{{ paidCount }} Faktur Selesai</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Faktur Draf</p>
          <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ draftCount }} <span class="text-sm font-normal text-gray-400">Faktur</span></h3>
          <p class="text-xs text-amber-500 mt-1">Belum Diposting ke Jurnal</p>
        </div>
      </div>

      <!-- FILTER & PENCARIAN -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button 
            v-for="st in statusTabs" 
            :key="st.value" 
            @click="selectedStatus = st.value"
            :class="['px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors', selectedStatus === st.value ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700']"
          >
            {{ st.label }}
          </button>
        </div>

        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari no faktur atau pelanggan..." 
            class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2 pl-10 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
          />
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <!-- TABEL DAFTAR FAKTUR PENJUALAN -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">No. Faktur</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Pelanggan</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Tanggal & Jatuh Tempo</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Total Tagihan</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="6" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat data faktur...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Tidak ada faktur yang sesuai dengan kriteria.
                </td>
              </tr>
              <tr 
                v-for="inv in records" 
                :key="inv.id" 
                class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors"
              >
                <!-- No Faktur -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono text-sm font-bold text-brand-600 dark:text-brand-400">
                    {{ inv.name || `INV/2026/${inv.id}` }}
                  </span>
                  <div v-if="inv.follow_up_level && inv.follow_up_level > 0" class="mt-0.5">
                    <span class="inline-flex text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded">
                      Dunning Level {{ inv.follow_up_level }}
                    </span>
                  </div>
                </td>

                <!-- Pelanggan -->
                <td class="px-6 py-4">
                  <div class="font-semibold text-gray-900 dark:text-white text-sm">
                    {{ inv.partner?.name || `Customer #${inv.partner_id || '-'}` }}
                  </div>
                  <span class="text-xs text-gray-400">{{ inv.partner?.street || 'Indonesia' }}</span>
                </td>

                <!-- Tanggal -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-xs text-gray-700 dark:text-gray-300">Terbit: {{ formatDate(inv.invoice_date) }}</div>
                  <div class="text-xs text-rose-600 dark:text-rose-400 font-medium">Jatuh Tempo: {{ formatDate(inv.due_date) }}</div>
                </td>

                <!-- Total Tagihan -->
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="font-mono font-bold text-sm text-gray-900 dark:text-white">
                    {{ formatCurrency(inv.amount_total) }}
                  </div>
                  <div class="text-[11px] text-gray-400">
                    PPN (11%): {{ formatCurrency(inv.amount_tax) }}
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span :class="getStatusBadge(inv.state)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ inv.state || 'DRAFT' }}
                  </span>
                </td>

                <!-- Aksi -->
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    
                    <!-- Tombol Edit Faktur -->
                    <button 
                      @click="openInvoiceModal('edit', inv)" 
                      class="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" 
                      title="Edit Faktur"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>

                    <!-- Tombol Post (Jika masih Draft) -->
                    <button 
                      v-if="inv.state === 'draft' || !inv.state" 
                      @click="postInvoice(inv.id)" 
                      class="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors" 
                      title="Posting ke Jurnal Akuntansi"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>

                    <!-- Tombol Unduh PDF Resmi -->
                    <a 
                      :href="`/api/finance/invoicing/${inv.id}/export`" 
                      target="_blank" 
                      class="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors inline-flex items-center" 
                      title="Cetak / Unduh PDF Faktur"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    </a>

                    <!-- Tombol Hapus -->
                    <button 
                      @click="deleteInvoice(inv.id)" 
                      class="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" 
                      title="Hapus Faktur"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Server-side Pagination Bar -->
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>

    </div>

    <!-- MODAL PEMBUATAN FAKTUR BARU -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 my-8">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ isEditing ? 'Edit Faktur Penjualan' : 'Buat Faktur Penjualan Baru' }}
            </h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="saveInvoice" class="space-y-4 mt-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nomor Faktur</label>
                <input v-model="formData.name" type="text" placeholder="INV/2026/0001" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Pilih Pelanggan (Customer Partner)</label>
                <select v-model.number="formData.partner_id" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                  <option disabled value="0">-- Pilih Pelanggan --</option>
                  <option v-for="p in partners" :key="p.id" :value="p.id">
                    {{ p.name }} ({{ p.city || 'Indonesia' }})
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Tanggal Faktur</label>
                <div class="relative">
                  <input 
                    v-model="formData.invoice_date" 
                    type="date" 
                    required 
                    @click="($event.target as any)?.showPicker?.()"
                    class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 cursor-pointer" 
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Jatuh Tempo (Due Date)</label>
                <div class="relative">
                  <input 
                    v-model="formData.due_date" 
                    type="date" 
                    required 
                    @click="($event.target as any)?.showPicker?.()"
                    class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 space-y-3">
              <h4 class="text-xs font-bold uppercase text-gray-700 dark:text-gray-200">Item Produk / Jasa</h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Deskripsi Item</label>
                  <input v-model="itemLine.description" type="text" placeholder="Jasa Konsultasi ERP / Lisensi Software" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Jumlah (Qty)</label>
                  <input v-model.number="itemLine.quantity" type="number" min="1" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Harga Satuan (Rp)</label>
                  <input v-model.number="itemLine.unit_price" type="number" min="1000" step="any" required placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none font-mono font-bold" />
                </div>
                <div class="flex items-center pt-5">
                  <label class="inline-flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                    <input v-model="includeTax" type="checkbox" class="w-4 h-4 rounded text-brand-500" />
                    <span>Termasuk PPN 11%</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Rangkuman Perhitungan -->
            <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-800 dark:text-blue-300 flex justify-between items-center font-mono">
              <span>Estimasi Total (Dasar + PPN 11%):</span>
              <span class="font-bold text-sm">{{ formatCurrency(calculatedTotal) }}</span>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menerbitkan...' : 'Terbitkan Faktur' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { IInvoiceDto as IInvoice } from '@/types/finance'
import type { IPaginationMeta } from '@/types'

const records = ref<IInvoice[]>([])
const allRecords = ref<IInvoice[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isDunningRunning = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')

// Server-side Pagination State
const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const onPaginationChange = (payload: { page: number; limit: number }) => {
  pagination.value.current_page = payload.page
  pagination.value.per_page = payload.limit
  fetchInvoices()
}

let searchTimer: any = null
watch([searchQuery, selectedStatus], () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchInvoices()
  }, 300)
})

const statusTabs = [
  { label: 'Semua Faktur', value: 'all' },
  { label: 'Draf (Draft)', value: 'draft' },
  { label: 'Belum Lunas (Posted)', value: 'posted' },
  { label: 'Lunas (Paid)', value: 'paid' },
]

// Form Modal
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const includeTax = ref(true)
const formData = ref<Partial<IInvoice>>({
  name: '',
  partner_id: 1,
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
})

const itemLine = ref({
  description: 'Jasa Implementasi Sistem ERP & Cloud Server',
  quantity: 1,
  unit_price: 25000000
})

const partners = ref<any[]>([])

onMounted(() => {
  fetchInvoices()
  fetchKpiMetrics()
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

const fetchKpiMetrics = async () => {
  try {
    const res = await http.get('/finance/invoicing?all=true')
    allRecords.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Failed to load KPI metrics', err)
  }
}

const fetchInvoices = async () => {
  isLoading.value = true
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedStatus.value && selectedStatus.value !== 'all') params.status = selectedStatus.value

    const res = await http.get('/finance/invoicing', { params })
    if (res.data && res.data.pagination) {
      records.value = res.data.data || []
      pagination.value = res.data.pagination
    } else if (Array.isArray(res.data?.data)) {
      records.value = res.data.data
    } else if (Array.isArray(res.data)) {
      records.value = res.data
    }
  } catch (err) {
    console.error('Failed to load invoices', err)
  } finally {
    isLoading.value = false
  }
}

// Perhitungan Otomatis
const calculatedUntaxed = computed(() => {
  return (itemLine.value.quantity || 1) * (itemLine.value.unit_price || 0)
})

const calculatedTax = computed(() => {
  return includeTax.value ? calculatedUntaxed.value * 0.11 : 0
})

const calculatedTotal = computed(() => {
  return calculatedUntaxed.value + calculatedTax.value
})

// Computed KPI (uses allRecords if available, else falls back to records)
const kpiSource = computed(() => allRecords.value.length ? allRecords.value : records.value)
const totalInvoiced = computed(() => kpiSource.value.reduce((acc, c) => acc + (c.amount_total || 0), 0))
const totalUnpaid = computed(() => kpiSource.value.filter(r => r.state === 'posted').reduce((acc, c) => acc + (c.amount_total || 0), 0))
const totalPaid = computed(() => kpiSource.value.filter(r => r.state === 'paid').reduce((acc, c) => acc + (c.amount_total || 0), 0))
const unpaidCount = computed(() => kpiSource.value.filter(r => r.state === 'posted').length)
const paidCount = computed(() => kpiSource.value.filter(r => r.state === 'paid').length)
const draftCount = computed(() => kpiSource.value.filter(r => r.state === 'draft' || !r.state).length)

// Formatters
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const formatDate = (d: string) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusBadge = (state: string) => {
  const s = (state || 'draft').toLowerCase()
  if (s === 'paid') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
  if (s === 'posted') return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
}

// Actions
const openInvoiceModal = (mode: 'create' | 'edit', inv?: IInvoice) => {
  isEditing.value = mode === 'edit'
  if (mode === 'edit' && inv) {
    editingId.value = inv.id
    formData.value = {
      name: inv.name,
      partner_id: inv.partner_id,
      invoice_date: inv.invoice_date ? new Date(inv.invoice_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      due_date: inv.due_date ? new Date(inv.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      state: inv.state || 'draft',
    }
    // Jika untaxed sudah ada
    if (inv.amount_untaxed > 0) {
      itemLine.value.unit_price = inv.amount_untaxed
      itemLine.value.quantity = 1
    }
  } else {
    editingId.value = null
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    formData.value = {
      name: `INV/${new Date().getFullYear()}/${randomNum}`,
      partner_id: partners.value.length > 0 ? partners.value[0].id : 1,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    }
  }
  isModalOpen.value = true
}

const saveInvoice = async () => {
  isSaving.value = true
  try {
    const payload = {
      name: formData.value.name,
      partner_id: formData.value.partner_id,
      invoice_date: new Date(formData.value.invoice_date!).toISOString(),
      due_date: new Date(formData.value.due_date!).toISOString(),
      state: isEditing.value ? (formData.value.state || 'draft') : 'draft',
      amount_untaxed: calculatedUntaxed.value,
      amount_tax: calculatedTax.value,
      amount_total: calculatedTotal.value,
      residual_amount: calculatedTotal.value,
    }
    if (isEditing.value && editingId.value) {
      await http.put(`/finance/invoicing/${editingId.value}`, payload)
      alert('Faktur berhasil diperbarui!')
    } else {
      await http.post('/finance/invoicing', payload)
      alert('Faktur berhasil dibuat dalam status Draf!')
    }
    isModalOpen.value = false
    await fetchInvoices()
    await fetchKpiMetrics()
  } catch (err: any) {
    alert('Gagal menyimpan faktur: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const postInvoice = async (id: number) => {
  if (!confirm('Posting faktur ini ke Jurnal Akuntansi (AR)?')) return
  try {
    await http.post(`/finance/invoicing/${id}/post`)
    await fetchInvoices()
    await fetchKpiMetrics()
    alert('Faktur berhasil diposting dan piutang telah tercatat di Jurnal Akuntansi!')
  } catch (err: any) {
    alert('Gagal posting faktur: ' + (err.response?.data?.message || err.message))
  }
}

const deleteInvoice = async (id: number) => {
  if (!confirm('Hapus faktur ini?')) return
  try {
    await http.delete(`/finance/invoicing/${id}`)
    await fetchInvoices()
    await fetchKpiMetrics()
    alert('Faktur berhasil dihapus!')
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

const triggerDunning = async () => {
  isDunningRunning.value = true
  try {
    await http.post('/finance/invoicing/dunning')
    await fetchInvoices()
    alert('Mesin Dunning berhasil memindai semua faktur jatuh tempo!')
  } catch (err: any) {
    alert('Gagal: ' + (err.response?.data?.message || err.message))
  } finally {
    isDunningRunning.value = false
  }
}
</script>
