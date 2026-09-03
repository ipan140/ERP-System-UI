<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Kalkulator THR (Tunjangan Hari Raya)</h2>
            <span class="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              Permenaker No. 6/2016
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            Perhitungan otomatis hak THR keagamaan resmi: Masa kerja &ge; 12 bulan dapat 1 bulan upah penuh, masa kerja &lt; 12 bulan dihitung prorata.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="openGenerateModal"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hitung THR Otomatis
          </button>
        </div>
      </div>

      <!-- Ringkasan Kartu Stat -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs font-semibold uppercase text-gray-500">Total Karyawan Berhak</p>
          <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }} Orang</p>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Masa kerja minimal 1 bulan</span>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs font-semibold uppercase text-gray-500">Total Pembayaran THR</p>
          <p class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(totalTHR) }}</p>
          <span class="text-xs text-gray-500">Estimasi anggaran tahun {{ selectedYear }}</span>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs font-semibold uppercase text-gray-500">Tahun Pajak / Hari Raya</p>
          <div class="mt-2 flex items-center gap-2">
            <select
              v-model="selectedYear"
              @change="fetchData"
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option :value="2026">Tahun 2026</option>
              <option :value="2025">Tahun 2025</option>
              <option :value="2024">Tahun 2024</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabel THR -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div v-if="isLoading" class="py-12 text-center text-gray-500">
          Memuat perhitungan THR...
        </div>
        <div v-else-if="records.length === 0" class="py-12 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="font-medium text-gray-800 dark:text-white">Belum Ada Kalkulasi THR untuk Tahun {{ selectedYear }}</p>
          <p class="text-xs text-gray-400 mt-1">Klik tombol "Hitung THR Otomatis" di kanan atas untuk memproses hak karyawan.</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold">Pegawai</th>
                <th class="px-6 py-4 font-semibold">Tgl Masuk</th>
                <th class="px-6 py-4 font-semibold text-center">Masa Kerja</th>
                <th class="px-6 py-4 font-semibold">Gaji Pokok Acuan</th>
                <th class="px-6 py-4 font-semibold">Skema Regulasi</th>
                <th class="px-6 py-4 font-semibold text-right">Nominal THR</th>
                <th class="px-6 py-4 font-semibold text-center">Status</th>
                <th class="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="row in records" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-bold flex items-center justify-center text-xs">
                      {{ row.employee?.name ? row.employee.name.charAt(0) : '?' }}
                    </div>
                    <span>{{ row.employee?.name || `Pegawai #${row.employee_id}` }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">{{ formatDate(row.join_date) }}</td>
                <td class="px-6 py-4 text-center font-semibold">
                  <span class="rounded-md bg-gray-100 px-2.5 py-1 text-xs dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {{ row.tenure_months }} Bulan
                  </span>
                </td>
                <td class="px-6 py-4">{{ formatCurrency(row.basic_wage) }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      row.tenure_months >= 12
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    ]"
                  >
                    {{ row.calculation_type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-base">
                  {{ formatCurrency(row.thr_amount) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      row.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : row.status === 'approved'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    ]"
                  >
                    {{ row.status.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    v-if="row.status !== 'paid'"
                    @click="markPaid(row.id)"
                    class="rounded bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-600 shadow-sm"
                  >
                    Setujui & Bayar
                  </button>
                  <span v-else class="text-xs text-gray-400 font-medium">Lunas</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Generate THR -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Kalkulasi Otomatis THR</h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="runGenerateTHR" class="space-y-4 pt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tahun Hari Raya</label>
              <input
                v-model.number="genForm.year"
                type="number"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tanggal Cut-off Hari Raya
              </label>
              <input
                v-model="genForm.cutoff_date"
                type="date"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <p class="text-xs text-gray-400 mt-1">Digunakan untuk menghitung masa kerja presisi karyawan.</p>
            </div>

            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300">
              Aturan Permenaker: Karyawan masa kerja &ge; 12 bulan dapat 1 bulan upah penuh. Karyawan 1 s/d &lt; 12 bulan dihitung prorata (N/12).
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isModalOpen = false"
                class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isGenerating"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {{ isGenerating ? 'Menghitung...' : 'Proses THR Semua Karyawan' }}
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

const records = ref<any[]>([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isGenerating = ref(false)
const selectedYear = ref(2026)

const genForm = ref({
  year: 2026,
  cutoff_date: '2026-04-10' // Estimasi Idul Fitri 2026
})

const totalTHR = computed(() => {
  return records.value.reduce((acc, row) => acc + (row.thr_amount || 0), 0)
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await http.get(`/hr/employees/thr?year=${selectedYear.value}`)
    records.value = res.data?.data || res.data || []
  } catch (err: any) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const openGenerateModal = () => {
  genForm.value.year = selectedYear.value
  isModalOpen.value = true
}

const runGenerateTHR = async () => {
  isGenerating.value = true
  try {
    const res = await http.post('/hr/employees/thr/generate', genForm.value)
    alert(res.data?.message || 'THR berhasil dikalkulasi!')
    isModalOpen.value = false
    selectedYear.value = genForm.value.year
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isGenerating.value = false
  }
}

const markPaid = async (id: number) => {
  if (!confirm('Tandai THR karyawan ini sebagai LUNAS/DIBAYAR?')) return
  try {
    await http.put(`/hr/employees/thr/${id}/status`, { status: 'paid' })
    fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>
