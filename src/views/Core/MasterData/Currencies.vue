<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Top Title -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Multi-Currency & Kurs Tengah Bank Indonesia
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manajemen mata uang transaksi ekspor/impor dan nilai tukar resmi Bank Indonesia (BI) untuk laporan keuangan.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="syncBankIndonesiaRate"
            :disabled="isSyncing"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <svg :class="{'animate-spin': isSyncing}" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isSyncing ? 'Menyinkronkan...' : 'Tarik Kurs BI Harian' }}
          </button>
          <button
            @click="openModal('create')"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Tambah Valuta Asing
          </button>
        </div>
      </div>

      <!-- Live Currency Rate Highlights -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Mata Uang Dasar (Base)</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">IDR (Rp)</h3>
            <span class="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">UTAMA</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Standar PSAK Laporan Keuangan</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">USD / IDR (US Dollar)</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Rp 16.250</h3>
            <span class="text-xs font-semibold text-emerald-600">+0.15% ▲</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Kurs Tengah BI: Rp 16.250,00</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">EUR / IDR (Euro)</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Rp 17.580</h3>
            <span class="text-xs font-semibold text-rose-600">-0.08% ▼</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Kurs Tengah BI: Rp 17.580,00</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">SGD / IDR (Singapore Dollar)</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Rp 12.320</h3>
            <span class="text-xs font-semibold text-emerald-600">+0.04% ▲</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Kurs Tengah BI: Rp 12.320,00</p>
        </div>
      </div>

      <!-- Quick Currency Calculator Bar -->
      <div class="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 mb-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-emerald-600 text-white">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </span>
            <span class="text-xs font-bold text-emerald-900 dark:text-emerald-200">Kalkulator Konversi Kurs Cepat:</span>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <input
              v-model.number="calcAmount"
              type="number"
              class="w-28 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <select
              v-model="calcFrom"
              class="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }}</option>
            </select>
            <span class="font-bold text-gray-400">=</span>
            <span class="rounded-lg bg-white px-3 py-1.5 font-mono font-bold text-emerald-700 shadow-sm dark:bg-gray-800 dark:text-emerald-300">
              Rp {{ formatNumber(convertedValue) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Currency Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white">Daftar Valuta & Nilai Tukar Transaksi</h3>
          <span class="text-xs text-gray-400">Sinkronisasi otomatis harian pukul 09:00 WIB</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400 font-semibold">
              <tr>
                <th class="px-5 py-3">Kode ISO</th>
                <th class="px-5 py-3">Nama Mata Uang</th>
                <th class="px-5 py-3">Simbol</th>
                <th class="px-5 py-3 text-right">Nilai Tukar (Ke IDR)</th>
                <th class="px-5 py-3 text-center">Status</th>
                <th class="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="item in currencies" :key="item.code" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-5 py-3.5 font-mono text-sm font-bold text-gray-900 dark:text-white">
                  {{ item.code }}
                </td>
                <td class="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-200">
                  {{ item.name }}
                </td>
                <td class="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                  {{ item.symbol }}
                </td>
                <td class="px-5 py-3.5 text-right font-mono font-bold text-gray-900 dark:text-white">
                  Rp {{ formatNumber(item.rate) }}
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold" :class="(item.is_base || item.isBase) ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'">
                    {{ (item.is_base || item.isBase) ? 'BASE CURRENCY' : 'ACTIVE' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right whitespace-nowrap">
                  <button
                    v-if="!(item.is_base || item.isBase)"
                    @click="editRate(item)"
                    class="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    Edit Kurs
                  </button>
                  <span v-else class="text-[11px] text-gray-400 italic">Mata Uang Acuan</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Edit Kurs -->
    <Teleport to="body">
      <div v-if="editingCurrency" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">
            Edit Nilai Tukar: {{ editingCurrency.name }} ({{ editingCurrency.code }})
          </h3>
          <p class="text-xs text-gray-500 mb-4">
            Masukkan nilai kurs tengah rupiah untuk pencatatan transaksi valas
          </p>

          <form @submit.prevent="saveRate" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nilai Kurs ke IDR (Rp)</label>
              <input
                v-model.number="editingCurrency.rate"
                type="number"
                step="0.01"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="flex justify-end gap-2.5 pt-3">
              <button
                type="button"
                @click="editingCurrency = null"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Batal
              </button>
              <button
                type="submit"
                class="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Simpan Perubahan
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
import { http } from '@/services/http'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const isSyncing = ref(false)
const isLoading = ref(false)
const calcAmount = ref(100)
const calcFrom = ref('USD')
const editingCurrency = ref<any>(null)
const currencies = ref<any[]>([])

const convertedValue = computed(() => {
  const target = currencies.value.find(c => c.code === calcFrom.value)
  if (!target) return 0
  return calcAmount.value * target.rate
})

const formatNumber = (num: number) => {
  if (num === undefined || num === null) return '0.00'
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}

const fetchCurrencies = async () => {
  isLoading.value = true
  try {
    const res = await http.get('/base/currency')
    if (res.data?.data) {
      currencies.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to load currencies:', err)
  } finally {
    isLoading.value = false
  }
}

const syncBankIndonesiaRate = async () => {
  isSyncing.value = true
  try {
    const res = await http.post('/base/currency/sync-bi')
    if (res.data?.data) {
      currencies.value = res.data.data
    } else {
      await fetchCurrencies()
    }
    alert('✓ Berhasil! Kurs Tengah Bank Indonesia (JISDOR) berhasil disinkronkan ke seluruh sistem ERP.')
  } catch (err: any) {
    alert(`✗ Gagal sinkronisasi kurs: ${err.response?.data?.message || err.message}`)
  } finally {
    isSyncing.value = false
  }
}

const openModal = (mode: string) => {
  editingCurrency.value = { code: 'GBP', name: 'British Pound Sterling', symbol: '£', rate: 21100.00, is_base: false }
}

const editRate = (curr: any) => {
  editingCurrency.value = { ...curr }
}

const saveRate = async () => {
  if (!editingCurrency.value) return
  try {
    if (editingCurrency.value.id) {
      await http.put(`/base/currency/${editingCurrency.value.id}`, {
        code: editingCurrency.value.code,
        name: editingCurrency.value.name,
        symbol: editingCurrency.value.symbol,
        rate: Number(editingCurrency.value.rate),
        is_base: Boolean(editingCurrency.value.is_base),
      })
    } else {
      await http.post('/base/currency', {
        code: editingCurrency.value.code,
        name: editingCurrency.value.name,
        symbol: editingCurrency.value.symbol,
        rate: Number(editingCurrency.value.rate),
        is_base: Boolean(editingCurrency.value.is_base),
      })
    }
    await fetchCurrencies()
  } catch (err: any) {
    alert(`Gagal menyimpan kurs: ${err.response?.data?.message || err.message}`)
  } finally {
    editingCurrency.value = null
  }
}

onMounted(() => {
  fetchCurrencies()
})
</script>
