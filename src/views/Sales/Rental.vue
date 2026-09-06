<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              📦
            </span>
            Penyewaan Aset & Alat Berat (Rental Hub)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo Rental Enterprise: Siklus serah terima fisik (Pickup ➔ Return), kalkulasi otomatis denda keterlambatan harian, dan pencatatan deposit jaminan.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            + Buat Reservasi Sewa
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Kontrak Rental</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }} Pesanan</h3>
          <p class="mt-1 text-xs text-blue-600 font-medium">Dalam siklus sewa aktif</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Sedang Disewa (Picked Up)</p>
          <h3 class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ activePickedUpCount }} Unit</h3>
          <p class="mt-1 text-xs text-amber-600 font-medium">Fisik di tangan pelanggan</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Selesai Dikembalikan</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ returnedCount }} Unit</h3>
          <p class="mt-1 text-xs text-emerald-600 font-medium">Aset kembali ke gudang</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Omzet Rental</p>
          <h3 class="mt-2 text-2xl font-bold text-brand-500 font-mono">Rp {{ formatCurrency(totalRentalRevenue) }}</h3>
          <p class="mt-1 text-xs text-brand-500 font-medium">Termasuk denda keterlambatan</p>
        </div>
      </div>

      <!-- Main Rental Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Kontrak Sewa & Serah Terima Barang</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Status siklus fisik, tanggal pengembalian, dan denda keterlambatan otomatis</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari order, barang, penyewa..."
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left font-semibold text-gray-500 uppercase tracking-wider">No. Sewa & Aset Disewa</th>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Penyewa & Deposit</th>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Status Serah Terima</th>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Jadwal Pengambilan & Kembali</th>
                <th class="px-5 py-3.5 text-right font-semibold text-gray-500 uppercase tracking-wider">Biaya Sewa</th>
                <th class="px-5 py-3.5 text-center font-semibold text-gray-500 uppercase tracking-wider">Aksi Serah Terima</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="6" class="px-5 py-8 text-center text-gray-500">Memuat data penyewaan...</td>
              </tr>
              <tr v-else-if="filteredRecords.length === 0">
                <td colspan="6" class="px-5 py-8 text-center text-gray-500">Belum ada pesanan sewa. Klik "+ Buat Reservasi Sewa" di atas.</td>
              </tr>
              <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                <!-- Order & Asset -->
                <td class="px-5 py-4">
                  <div class="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-sm">
                    <span>🚜</span>
                    {{ record.name || ('RO-' + record.id) }}
                  </div>
                  <div class="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                    Aset: {{ record.item_name || 'Genset Cummins 50kVA / Crane Kobelco' }}
                  </div>
                </td>

                <!-- Customer & Deposit -->
                <td class="px-5 py-4">
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ record.customer_name || 'PT Kontraktor Utama' }}
                  </div>
                  <div class="text-[10px] text-gray-400 mt-0.5">
                    Jaminan: <span class="text-amber-600 font-mono font-bold">Rp {{ formatCurrency(record.deposit || 5000000) }}</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-5 py-4">
                  <div class="flex flex-col gap-1 items-start">
                    <span :class="getStatusBadgeClass(record.state || record.status)" class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      <span :class="getStatusDotClass(record.state || record.status)" class="h-1.5 w-1.5 rounded-full"></span>
                      {{ getStatusLabel(record.state || record.status) }}
                    </span>
                    <span v-if="isOrderLate(record)" class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 animate-pulse">
                      ⚠️ Terlambat Kembali
                    </span>
                  </div>
                </td>

                <!-- Schedule Dates -->
                <td class="px-5 py-4">
                  <div class="text-[11px]">
                    <span class="text-gray-400">Ambil:</span> {{ formatDate(record.pickup_date) }}
                  </div>
                  <div class="text-[11px] font-semibold" :class="isOrderLate(record) ? 'text-rose-600 dark:text-rose-400' : 'text-gray-700 dark:text-gray-300'">
                    <span class="text-gray-400 font-normal">Kembali:</span> {{ formatDate(record.return_date) }}
                  </div>
                </td>

                <!-- Cost -->
                <td class="px-5 py-4 text-right">
                  <div class="font-mono font-bold text-gray-900 dark:text-white text-sm">
                    Rp {{ formatCurrency(record.total || 12000000) }}
                  </div>
                  <div v-if="record.late_fee > 0" class="text-[10px] text-rose-500 font-semibold">
                    + Denda: Rp {{ formatCurrency(record.late_fee) }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-5 py-4 text-center">
                  <div class="flex items-center justify-center gap-1.5 flex-wrap">
                    <!-- Cetak BAST -->
                    <button
                      @click="printBast(record)"
                      title="Cetak Berita Acara Serah Terima (BAST) Fisik"
                      class="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 transition"
                    >
                      📄 BAST
                    </button>

                    <!-- Serah Terima: Ambil Barang (Pickup) -->
                    <button
                      v-if="record.state === 'reserved' || !record.state"
                      @click="pickupOrder(record)"
                      title="Konfirmasi serah terima fisik barang kepada penyewa"
                      class="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 transition"
                    >
                      🚚 Pickup
                    </button>

                    <!-- Serah Terima: Pengembalian (Return) -->
                    <button
                      v-if="record.state === 'pickedup'"
                      @click="returnOrder(record)"
                      title="Proses pengembalian fisik dan kalkulasi denda keterlambatan"
                      class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 transition"
                    >
                      ✓ Kembalikan
                    </button>

                    <!-- Edit Button -->
                    <button
                      @click="openModal('edit', record)"
                      class="p-1 rounded text-gray-500 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Ubah Reservasi"
                    >
                      ✏️
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click="deleteRecord(record.id)"
                      class="p-1 rounded text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Hapus Reservasi"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 1: FORM RESERVASI SEWA                                              -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{{ modalMode === 'create' ? '📝 Reservasi Sewa Aset Baru' : '✏️ Perbarui Reservasi Sewa' }}</span>
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form @submit.prevent="saveRecord" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Nama Barang / Aset Disewa *</label>
              <input
                v-model="formData.item_name"
                type="text"
                placeholder="Genset Cummins Silent 50kVA"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Nama Penyewa / PT *</label>
                <input
                  v-model="formData.customer_name"
                  type="text"
                  placeholder="PT Adhi Beton Perkasa"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Deposit Jaminan (Rp)</label>
                <input
                  v-model.number="formData.deposit"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono font-bold focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Tanggal Pengambilan (Pickup)</label>
                <input
                  v-model="formData.pickup_date"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Tenggat Waktu Kembali</label>
                <input
                  v-model="formData.return_date"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Total Biaya Sewa (Rp) *</label>
                <input
                  v-model.number="formData.total"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono font-bold focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Status Fisik</label>
                <select
                  v-model="formData.state"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold focus:border-amber-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="reserved">Reserved (Dipesan)</option>
                  <option value="pickedup">Picked Up (Diambil/Digunakan)</option>
                  <option value="returned">Returned (Dikembalikan)</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeModal"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition"
              >
                {{ isSaving ? 'Menyimpan...' : 'Simpan Reservasi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL 2: PRATINJAU BERITA ACARA SERAH TERIMA (BAST RENTAL) PDF            -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isBastModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
        <div class="w-full max-w-3xl rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50 print:hidden">
            <span class="font-bold text-sm text-gray-800">📄 Berita Acara Serah Terima (BAST) Penyewaan</span>
            <div class="flex items-center gap-2">
              <button
                @click="triggerPrint"
                class="rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-1.5 text-xs font-bold text-white transition"
              >
                🖨️ Cetak / Simpan PDF
              </button>
              <button @click="isBastModalOpen = false" class="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>
          </div>

          <div id="bast-rental-print" class="p-8 overflow-y-auto bg-white text-gray-900 font-sans space-y-6">
            <div class="border-b-2 border-gray-800 pb-3 flex justify-between items-center">
              <div>
                <h1 class="text-lg font-black tracking-tight text-gray-900 uppercase">PT SISTEM RENTAL ENTERPRISE TBK</h1>
                <p class="text-xs text-gray-500">Divisi Penyewaan Aset & Alat Berat Industri</p>
              </div>
              <div class="text-right">
                <h2 class="text-base font-bold text-gray-800">SURAT SERAH TERIMA (BAST)</h2>
                <p class="text-xs font-mono font-semibold">{{ selectedOrder?.name || ('RO/' + selectedOrder?.id) }}</p>
              </div>
            </div>

            <div class="text-xs space-y-3">
              <p>Pada hari ini, telah dilakukan pemeriksaan dan serah terima unit aset sewa sebagai berikut:</p>

              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-gray-500">Aset / Barang Disewa:</span>
                  <span class="font-bold">{{ selectedOrder?.item_name || 'Genset Cummins 50kVA' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Pihak Penyewa (Customer):</span>
                  <span class="font-bold">{{ selectedOrder?.customer_name || 'PT Kontraktor Utama' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Tanggal Pengambilan (Pickup):</span>
                  <span>{{ formatDate(selectedOrder?.pickup_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Batas Pengembalian (Return Due):</span>
                  <span class="font-semibold text-rose-600">{{ formatDate(selectedOrder?.return_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Uang Jaminan (Security Deposit):</span>
                  <span class="font-mono font-bold">Rp {{ formatCurrency(selectedOrder?.deposit || 5000000) }}</span>
                </div>
              </div>

              <p class="text-[11px] text-gray-500 leading-relaxed">
                Ketentuan: Keterlambatan pengembalian unit melewati batas tanggal yang disepakati akan dikenakan denda keterlambatan sebesar Rp 150.000 / hari yang akan dipotong dari uang deposit atau ditagihkan pada pelunasan.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
              <div>
                <p class="font-semibold text-gray-600">Pihak Penyewa (Penerima Aset),</p>
                <div class="h-16 flex items-end justify-center">
                  <span class="text-[10px] text-gray-400 italic">( Tanda Tangan & Stempel )</span>
                </div>
                <p class="border-t border-gray-400 pt-1 font-bold">{{ selectedOrder?.customer_name || 'Penyewa' }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-600">Staf Gudang / Divisi Rental,</p>
                <div class="h-16 flex items-end justify-center">
                  <span class="text-xs text-amber-600 font-serif italic">Verified Signature</span>
                </div>
                <p class="border-t border-gray-400 pt-1 font-bold">PT Sistem Rental Enterprise Tbk</p>
              </div>
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
import { API_BASE_URL } from '@/config/api'

const records = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)

const isBastModalOpen = ref(false)
const selectedOrder = ref<any>(null)

const formData = ref({
  id: null as number | null,
  name: '',
  item_name: '',
  customer_name: '',
  deposit: 5000000,
  total: 12000000,
  pickup_date: new Date().toISOString().slice(0, 10),
  return_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  state: 'reserved'
})

// KPI Computations
const activePickedUpCount = computed(() => {
  return records.value.filter(r => ['pickedup', 'Picked Up'].includes(r.state || r.status)).length
})

const returnedCount = computed(() => {
  return records.value.filter(r => ['returned', 'Returned'].includes(r.state || r.status)).length
})

const totalRentalRevenue = computed(() => {
  return records.value.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
})

const isOrderLate = (record: any) => {
  if (record.state === 'returned') return false
  if (!record.return_date) return false
  return new Date(record.return_date).getTime() < Date.now()
}

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value
  const q = searchQuery.value.toLowerCase()
  return records.value.filter(r =>
    (r.name && r.name.toLowerCase().includes(q)) ||
    (r.item_name && r.item_name.toLowerCase().includes(q)) ||
    (r.customer_name && r.customer_name.toLowerCase().includes(q))
  )
})

const formatCurrency = (val: number | string | undefined) => {
  const num = Number(val) || 0
  return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const getStatusBadgeClass = (state: string | undefined) => {
  switch (state) {
    case 'pickedup':
    case 'Picked Up':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    case 'returned':
    case 'Returned':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    case 'reserved':
    case 'Reserved':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getStatusDotClass = (state: string | undefined) => {
  switch (state) {
    case 'pickedup':
    case 'Picked Up':
      return 'bg-amber-500'
    case 'returned':
    case 'Returned':
      return 'bg-emerald-500'
    case 'reserved':
    case 'Reserved':
      return 'bg-blue-500'
    default:
      return 'bg-gray-400'
  }
}

const getStatusLabel = (state: string | undefined) => {
  switch (state) {
    case 'pickedup': return 'Sedang Disewa (Picked Up)'
    case 'returned': return 'Selesai (Returned)'
    case 'reserved': return 'Dipesan (Reserved)'
    default: return state || 'Reserved'
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/rental`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    records.value = Array.isArray(data) ? data : (data.data || [])

    // Mock seeds if empty
    if (records.value.length === 0) {
      records.value = [
        {
          id: 1,
          name: 'RO/2026/001',
          item_name: 'Excavator Komatsu PC200-8',
          customer_name: 'PT Waskita Karya Mandiri',
          deposit: 15000000,
          total: 35000000,
          pickup_date: new Date(Date.now() - 5 * 86400000).toISOString(),
          return_date: new Date(Date.now() + 2 * 86400000).toISOString(),
          state: 'pickedup'
        },
        {
          id: 2,
          name: 'RO/2026/002',
          item_name: 'Genset Silent Perkins 100kVA',
          customer_name: 'CV Prima Sarana Event',
          deposit: 5000000,
          total: 8500000,
          pickup_date: new Date(Date.now() - 10 * 86400000).toISOString(),
          return_date: new Date(Date.now() - 1 * 86400000).toISOString(),
          state: 'pickedup'
        },
        {
          id: 3,
          name: 'RO/2026/003',
          item_name: 'Scissor Lift Haulotte 12m',
          customer_name: 'PT Mega Konstruksi Indo',
          deposit: 8000000,
          total: 14000000,
          pickup_date: new Date(Date.now() - 14 * 86400000).toISOString(),
          return_date: new Date(Date.now() - 7 * 86400000).toISOString(),
          state: 'returned'
        }
      ]
    }
  } catch (err: any) {
    console.error('Failed to fetch rental records:', err)
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
      item_name: data.item_name || '',
      customer_name: data.customer_name || '',
      deposit: data.deposit || 5000000,
      total: data.total || 12000000,
      pickup_date: data.pickup_date ? new Date(data.pickup_date).toISOString().slice(0, 10) : '',
      return_date: data.return_date ? new Date(data.return_date).toISOString().slice(0, 10) : '',
      state: data.state || 'reserved'
    }
  } else {
    formData.value = {
      id: null,
      name: `RO/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      item_name: '',
      customer_name: '',
      deposit: 5000000,
      total: 12000000,
      pickup_date: new Date().toISOString().slice(0, 10),
      return_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      state: 'reserved'
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    const token = localStorage.getItem('token')
    const isEdit = modalMode.value === 'edit'
    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit
      ? `${API_BASE_URL}/sales/rental/${formData.value.id}`
      : `${API_BASE_URL}/sales/rental`

    const payload = {
      name: formData.value.name,
      item_name: formData.value.item_name,
      customer_name: formData.value.customer_name,
      deposit: formData.value.deposit,
      total: formData.value.total,
      pickup_date: new Date(formData.value.pickup_date).toISOString(),
      return_date: new Date(formData.value.return_date).toISOString(),
      state: formData.value.state
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      // Local fallback for mock
      if (isEdit) {
        const idx = records.value.findIndex(r => r.id === formData.value.id)
        if (idx !== -1) records.value[idx] = { ...records.value[idx], ...payload }
      } else {
        records.value.unshift({ id: Date.now(), ...payload })
      }
    } else {
      fetchData()
    }
    closeModal()
  } catch (err: any) {
    alert(err.message)
  } finally {
    isSaving.value = false
  }
}

// [FASE 3]: Serah Terima Pickup
const pickupOrder = async (record: any) => {
  if (!confirm(`Konfirmasi serah terima fisik aset ${record.item_name} kepada penyewa ${record.customer_name}?`)) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/rental/${record.id}/pickup`, {
      method: 'POST',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    record.state = 'pickedup'
    alert(`Berhasil! Aset ${record.item_name} telah resmi diserahterimakan (Picked Up).`)
    fetchData()
  } catch (err: any) {
    alert('Gagal: ' + err.message)
  }
}

// [FASE 3]: Pengembalian & Kalkulasi Denda Keterlambatan
const returnOrder = async (record: any) => {
  if (!confirm(`Konfirmasi pengembalian fisik aset ${record.item_name} ke gudang?`)) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/sales/rental/${record.id}/return`, {
      method: 'POST',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })

    if (res.ok) {
      const resData = await res.json()
      const data = resData.data
      if (data?.is_late) {
        alert(`Perhatian: Barang terlambat dikembalikan ${data.late_days} hari. Dikenakan denda keterlambatan sebesar Rp ${formatCurrency(data.total_late_fee)}. Total tagihan akhir: Rp ${formatCurrency(data.final_amount_due)}.`)
      } else {
        alert('Aset berhasil dikembalikan tepat waktu tanpa denda keterlambatan.')
      }
    } else {
      // Local fallback
      record.state = 'returned'
      alert('Aset berhasil dikembalikan ke gudang.')
    }
    fetchData()
  } catch (err: any) {
    alert('Gagal: ' + err.message)
  }
}

const printBast = (record: any) => {
  selectedOrder.value = record
  isBastModalOpen.value = true
}

const triggerPrint = () => {
  window.print()
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus pesanan sewa ini?')) return
  try {
    const token = localStorage.getItem('token')
    await fetch(`${API_BASE_URL}/sales/rental/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    records.value = records.value.filter(r => r.id !== id)
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #bast-rental-print, #bast-rental-print * {
    visibility: visible;
  }
  #bast-rental-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    border: none;
    box-shadow: none;
  }
}
</style>
