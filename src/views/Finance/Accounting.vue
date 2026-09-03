<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Chart of Accounts & Kas Bank</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bagan Akun Standar SAK Indonesia & Pencatatan Kas Masuk / Kas Keluar Operasional
          </p>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <button @click="openCashModal('in')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Kas Masuk
          </button>
          <button @click="openCashModal('out')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
            Kas Keluar
          </button>
          <button @click="openAccountModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Buat Akun
          </button>
        </div>
      </div>

      <!-- RINGKASAN SALDO NERACA KAS/BANK & LIQUIDITY -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Kas & Bank</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ formatCurrency(totalCashAndBank) }}</h3>
          <p class="text-xs text-gray-400 mt-1">{{ cashAndBankAccounts.length }} Rekening Aktif</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Piutang Usaha (AR)</p>
          <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{{ formatCurrency(totalReceivables) }}</h3>
          <p class="text-xs text-gray-400 mt-1">Termasuk Piutang Kasbon HR</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hutang Lancar (AP)</p>
          <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ formatCurrency(totalPayables) }}</h3>
          <p class="text-xs text-gray-400 mt-1">Hutang Usaha & Pajak</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Beban Gaji & Personalia</p>
          <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{{ formatCurrency(totalPayrollExpense) }}</h3>
          <p class="text-xs text-gray-400 mt-1">Terhubung Modul HR</p>
        </div>
      </div>

      <!-- FILTER & TAB KELOMPOK AKUN -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button 
            v-for="cat in categories" 
            :key="cat.value" 
            @click="selectedCategory = cat.value"
            :class="['px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors', selectedCategory === cat.value ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700']"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari akun atau kode..." 
            class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2 pl-10 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
          />
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <!-- TABEL DAFTAR AKUN (CHART OF ACCOUNTS) -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Kode Akun</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Nama Akun</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Tipe / Kategori</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Saldo Berjalan</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="6" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat Chart of Accounts...</p>
                </td>
              </tr>
              <tr v-else-if="filteredAccounts.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Tidak ada akun rekening yang sesuai dengan filter.
                </td>
              </tr>
              <tr 
                v-for="acc in filteredAccounts" 
                :key="acc.id" 
                class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors"
              >
                <!-- Kode Akun -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {{ acc.code }}
                  </span>
                </td>

                <!-- Nama Akun -->
                <td class="px-6 py-4">
                  <div class="font-semibold text-gray-900 dark:text-white text-sm">{{ acc.name }}</div>
                  <span v-if="acc.category" class="text-xs text-gray-400">{{ acc.category }}</span>
                </td>

                <!-- Tipe -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeBadge(acc.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {{ formatTypeLabel(acc.type) }}
                  </span>
                </td>

                <!-- Saldo Berjalan -->
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <span :class="['font-mono font-bold text-sm', acc.balance < 0 ? 'text-rose-500' : 'text-gray-900 dark:text-white']">
                    {{ formatCurrency(acc.balance) }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Aktif
                  </span>
                </td>

                <!-- Aksi -->
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openAccountModal('edit', acc)" class="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors" title="Edit Akun">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deleteAccount(acc.id)" class="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Hapus Akun">
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

    <!-- MODAL 1: TAMBAH / EDIT AKUN -->
    <Teleport to="body">
      <div v-if="isAccountModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 my-8">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ accountModalMode === 'create' ? 'Tambah Akun Rekening Baru' : 'Edit Akun Rekening' }}
            </h3>
            <button @click="isAccountModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="saveAccount" class="space-y-4 mt-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Klasifikasi Tipe Akun</label>
                <select v-model="accountForm.type" @change="onTypeChange" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-semibold">
                  <option value="asset">1 - Aset / Harta (Kas/Bank/Piutang)</option>
                  <option value="liability">2 - Kewajiban / Hutang (AP)</option>
                  <option value="equity">3 - Ekuitas / Modal</option>
                  <option value="income">4 - Pendapatan Usaha (Omzet)</option>
                  <option value="expense">6 - Beban Operasional (Biaya)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">
                  Kode Akun COA 
                  <span class="text-[10px] text-brand-500 font-normal lowercase">(otomatis/sesuaikan)</span>
                </label>
                <input v-model="accountForm.code" type="text" placeholder="Contoh: 1-1004" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              </div>
            </div>

            <!-- Petunjuk Standar Kode Akun SAK -->
            <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300 space-y-1">
              <div class="font-bold flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Standar Penomoran Akun (SAK Indonesia):
              </div>
              <div>• <strong>Awalan 1-xxxx</strong>: Kas & Bank (1-1001 s/d 1-1099), Piutang (1-1200), Aset Tetap (1-1500)</div>
              <div>• <strong>Awalan 2-xxxx</strong>: Hutang Usaha (2-1100), Hutang Pajak (2-1200)</div>
              <div>• <strong>Awalan 3-xxxx</strong>: Modal Saham (3-1000), Laba Ditahan (3-2000)</div>
              <div>• <strong>Awalan 4-xxxx</strong>: Pendapatan Penjualan Jasa/Produk (4-1000)</div>
              <div>• <strong>Awalan 6-xxxx</strong>: Beban Gaji (6-1000), Sewa (6-1100), Utilitas (6-1200)</div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Akun Rekening</label>
              <input v-model="accountForm.name" type="text" placeholder="Contoh: Bank BNI Giro Operasional" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-medium" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Kategori Laporan</label>
                <input v-model="accountForm.category" type="text" placeholder="Mis. Kas & Setara Kas / Aset Lancar" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Saldo Awal (Rp)</label>
                <input v-model.number="accountForm.balance" type="number" step="any" placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isAccountModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan Akun' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL 2: KAS MASUK / KAS KELUAR -->
    <Teleport to="body">
      <div v-if="isCashModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 my-8">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span :class="['w-3 h-3 rounded-full', cashForm.type === 'in' ? 'bg-emerald-500' : 'bg-rose-500']"></span>
              {{ cashForm.type === 'in' ? 'Pencatatan Kas Masuk (Receive Money)' : 'Pencatatan Kas Keluar (Spend Money)' }}
            </h3>
            <button @click="isCashModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitCashTransaction" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">
                {{ cashForm.type === 'in' ? 'Masuk ke Rekening / Kas' : 'Dikeluarkan dari Rekening / Kas' }}
              </label>
              <select v-model.number="cashForm.bank_account_id" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                <option :value="undefined">-- Pilih Kas / Bank Sumber --</option>
                <option v-for="acc in cashAndBankAccounts" :key="acc.id" :value="acc.id">
                  [{{ acc.code }}] {{ acc.name }} - (Saldo: {{ formatCurrency(acc.balance) }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">
                {{ cashForm.type === 'in' ? 'Diterima dari Akun (Lawan)' : 'Dialokasikan untuk Akun (Beban / Hutang)' }}
              </label>
              <select v-model.number="cashForm.opposite_acc_id" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                <option :value="undefined">-- Pilih Akun Lawan --</option>
                <option v-for="acc in oppositeAccounts" :key="acc.id" :value="acc.id">
                  [{{ acc.code }}] {{ acc.name }} ({{ formatTypeLabel(acc.type) }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nominal (Rp)</label>
                <input v-model.number="cashForm.amount" type="number" min="1" step="any" required placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">No. Bukti / Kuitansi</label>
                <input v-model="cashForm.reference" type="text" placeholder="BKM/2026/001" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Keterangan Transaksi</label>
              <textarea v-model="cashForm.description" rows="2" required placeholder="Contoh: Pembelian alat tulis kantor / Penerimaan pelunasan" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isCashModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" :class="['px-5 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50', cashForm.type === 'in' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600']">
                {{ isSaving ? 'Membukukan...' : (cashForm.type === 'in' ? 'Bukukan Kas Masuk' : 'Bukukan Kas Keluar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { http } from '@/services/http'
import type { IAccountDto as IAccount } from '@/types/finance'

const accounts = ref<IAccount[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { label: 'Semua Akun', value: 'all' },
  { label: '1 - Aset (Harta)', value: 'asset' },
  { label: '2 - Kewajiban (Hutang)', value: 'liability' },
  { label: '3 - Ekuitas (Modal)', value: 'equity' },
  { label: '4 - Pendapatan', value: 'income' },
  { label: '5/6 - Beban & Biaya', value: 'expense' }
]

// Modals
const isAccountModalOpen = ref(false)
const accountModalMode = ref<'create' | 'edit'>('create')
const accountForm = ref<Partial<IAccount>>({
  code: '',
  name: '',
  type: 'asset',
  category: '',
  balance: 0
})

const isCashModalOpen = ref(false)
const cashForm = ref<{
  type: 'in' | 'out'
  bank_account_id?: number
  opposite_acc_id?: number
  amount: number
  reference: string
  description: string
}>({
  type: 'in',
  bank_account_id: undefined,
  opposite_acc_id: undefined,
  amount: 0,
  reference: '',
  description: ''
})

onMounted(() => {
  fetchAccounts()
})

const fetchAccounts = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/finance/accounting/accounts')
    accounts.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Failed to load accounts', err)
  } finally {
    isLoading.value = false
  }
}

// Computed Filters & Totals
const filteredAccounts = computed(() => {
  return accounts.value.filter(acc => {
    const matchCat = selectedCategory.value === 'all' || acc.type === selectedCategory.value
    const matchSearch = acc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        acc.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchSearch
  })
})

const cashAndBankAccounts = computed(() => {
  return accounts.value.filter(a => a.type === 'asset' && (a.code.startsWith('1-100') || a.category?.includes('Kas') || a.name?.includes('Bank')))
})

const oppositeAccounts = computed(() => {
  return accounts.value.filter(a => !cashAndBankAccounts.value.some(cb => cb.id === a.id))
})

const totalCashAndBank = computed(() => {
  return cashAndBankAccounts.value.reduce((acc, curr) => acc + (curr.balance || 0), 0)
})

const totalReceivables = computed(() => {
  return accounts.value.filter(a => a.code.startsWith('1-12') || a.code.startsWith('1-14')).reduce((acc, curr) => acc + (curr.balance || 0), 0)
})

const totalPayables = computed(() => {
  return accounts.value.filter(a => a.type === 'liability').reduce((acc, curr) => acc + (curr.balance || 0), 0)
})

const totalPayrollExpense = computed(() => {
  return accounts.value.filter(a => a.code.startsWith('6-10')).reduce((acc, curr) => acc + (curr.balance || 0), 0)
})

// Formatting Helpers
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const formatTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    asset: 'Aset / Harta',
    liability: 'Kewajiban / Hutang',
    equity: 'Ekuitas / Modal',
    income: 'Pendapatan Usaha',
    expense: 'Beban Operasional'
  }
  return map[type] || type
}

const getTypeBadge = (type: string) => {
  const map: Record<string, string> = {
    asset: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
    liability: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    equity: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
    income: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    expense: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

// Account Modal Actions
const onTypeChange = () => {
  if (accountModalMode.value !== 'create') return
  const type = accountForm.value.type
  if (type === 'asset') {
    // Cari akun aset kas/bank tertinggi
    const assetAccounts = accounts.value.filter(a => a.code.startsWith('1-10'))
    const lastNum = assetAccounts.length + 1
    accountForm.value.code = `1-100${lastNum}`
    accountForm.value.category = 'Kas & Bank Operasional'
  } else if (type === 'liability') {
    const liabAccounts = accounts.value.filter(a => a.code.startsWith('2-'))
    accountForm.value.code = `2-110${liabAccounts.length + 1}`
    accountForm.value.category = 'Hutang Lancar'
  } else if (type === 'equity') {
    accountForm.value.code = `3-100${accounts.value.filter(a => a.code.startsWith('3-')).length + 1}`
    accountForm.value.category = 'Modal Perusahaan'
  } else if (type === 'income') {
    accountForm.value.code = `4-100${accounts.value.filter(a => a.code.startsWith('4-')).length + 1}`
    accountForm.value.category = 'Pendapatan Usaha'
  } else if (type === 'expense') {
    accountForm.value.code = `6-120${accounts.value.filter(a => a.code.startsWith('6-')).length + 1}`
    accountForm.value.category = 'Beban Operasional'
  }
}

const openAccountModal = (mode: 'create' | 'edit', acc?: IAccount) => {
  accountModalMode.value = mode
  if (mode === 'edit' && acc) {
    accountForm.value = { ...acc }
  } else {
    accountForm.value = { code: '1-1004', name: '', type: 'asset', category: 'Kas & Bank Operasional', balance: 0 }
    onTypeChange()
  }
  isAccountModalOpen.value = true
}

const saveAccount = async () => {
  isSaving.value = true
  try {
    if (accountModalMode.value === 'create') {
      await http.post('/finance/accounting/accounts', accountForm.value)
    } else {
      await http.put(`/finance/accounting/accounts/${accountForm.value.id}`, accountForm.value)
    }
    isAccountModalOpen.value = false
    await fetchAccounts()
  } catch (err: any) {
    alert('Gagal menyimpan akun: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteAccount = async (id: number) => {
  if (!confirm('Yakin ingin menghapus akun ini dari Chart of Accounts?')) return
  try {
    await http.delete(`/finance/accounting/accounts/${id}`)
    await fetchAccounts()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

// Cash Transaction Actions
const openCashModal = (type: 'in' | 'out') => {
  cashForm.value = {
    type,
    bank_account_id: cashAndBankAccounts.value[0]?.id,
    opposite_acc_id: undefined,
    amount: 0,
    reference: `${type === 'in' ? 'BKM' : 'BKK'}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    description: ''
  }
  isCashModalOpen.value = true
}

const submitCashTransaction = async () => {
  if (!cashForm.value.bank_account_id || !cashForm.value.opposite_acc_id) {
    alert('Silakan pilih akun kas/bank dan akun lawan!')
    return
  }
  isSaving.value = true
  try {
    await http.post('/finance/accounting/cash-transaction', cashForm.value)
    isCashModalOpen.value = false
    await fetchAccounts()
    alert('Transaksi berhasil dibukukan ke jurnal dan saldo akun ter-update!')
  } catch (err: any) {
    alert('Gagal membukukan transaksi: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}
</script>
