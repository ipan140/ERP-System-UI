<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Welcome Header -->
      <div class="mb-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-700 p-6 text-white shadow-lg">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/30 shadow-inner">
              {{ profile.name ? profile.name.charAt(0) : 'U' }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-bold">{{ profile.name || 'Karyawan' }}</h2>
                <span class="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-semibold border border-emerald-300/40 text-emerald-100">
                  Portal Mandiri (ESS)
                </span>
              </div>
              <p class="text-sm text-indigo-100 mt-1">
                {{ profile.job_position?.name || 'Staff' }} &bull; {{ profile.department?.name || 'Divisi Umum' }} &bull; Status: {{ profile.is_active ? 'Aktif Bekerja' : 'Non-Aktif' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
            <div>
              <span class="text-indigo-200 block">Status Pajak PTKP</span>
              <span class="font-bold text-white text-sm">{{ profile.ptkp_status || 'TK/0' }}</span>
            </div>
            <div class="border-l border-white/20 pl-3 ml-2">
              <span class="text-indigo-200 block">Email Kantor</span>
              <span class="font-bold text-white text-sm">{{ profile.work_email || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Tabs -->
      <div class="mb-6 flex border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'payslips'"
          :class="[
            'flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-all',
            activeTab === 'payslips'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Slip Gaji Saya ({{ payslips.length }})
        </button>

        <button
          @click="activeTab = 'warnings'"
          :class="[
            'flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-all',
            activeTab === 'warnings'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Catatan Disiplin / SP ({{ warnings.length }})
        </button>
      </div>

      <!-- Tab 1: Slip Gaji Pribadi -->
      <div v-if="activeTab === 'payslips'" class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white">Riwayat Slip Gaji Resmi</h3>
            <p class="text-xs text-gray-500">Hanya menampilkan slip gaji rahasia milik Anda sendiri.</p>
          </div>
        </div>

        <div v-if="isLoading" class="py-12 text-center text-gray-500">Memuat slip gaji...</div>
        <div v-else-if="payslips.length === 0" class="py-12 text-center text-gray-500">
          Belum ada slip gaji yang diterbitkan untuk akun Anda.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold">Periode</th>
                <th class="px-6 py-4 font-semibold">Gaji Pokok</th>
                <th class="px-6 py-4 font-semibold text-emerald-600">Total Pendapatan</th>
                <th class="px-6 py-4 font-semibold text-red-500">Total Potongan (PPh 21/BPJS)</th>
                <th class="px-6 py-4 font-semibold text-indigo-600">Gaji Bersih (Take Home Pay)</th>
                <th class="px-6 py-4 font-semibold text-center">Status</th>
                <th class="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="slip in payslips" :key="slip.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">{{ slip.period }}</td>
                <td class="px-6 py-4">{{ formatCurrency(slip.basic_salary) }}</td>
                <td class="px-6 py-4 font-medium text-emerald-600">{{ formatCurrency(slip.total_earning) }}</td>
                <td class="px-6 py-4 font-medium text-red-500">- {{ formatCurrency(slip.total_deduction) }}</td>
                <td class="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400 text-base">
                  {{ formatCurrency(slip.net_salary) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="[
                      'inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full',
                      slip.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    ]"
                  >
                    {{ slip.status.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="viewDetail(slip)"
                    class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 shadow-sm"
                  >
                    Lihat Slip
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: Catatan SP Pribadi -->
      <div v-if="activeTab === 'warnings'" class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div class="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-bold text-gray-900 dark:text-white">Riwayat Surat Peringatan (Disiplin)</h3>
          <p class="text-xs text-gray-500">Transparansi kedisiplinan dan masa kedaluwarsa SP pribadi Anda.</p>
        </div>

        <div v-if="warnings.length === 0" class="py-12 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-emerald-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="font-medium text-gray-800 dark:text-white">Catatan Bersih!</p>
          <p class="text-xs text-gray-400 mt-1">Anda tidak memiliki Surat Peringatan (SP) aktif. Pertahankan performa baik Anda!</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-4 font-semibold">Tingkat SP</th>
                <th class="px-6 py-4 font-semibold">Alasan / Pelanggaran</th>
                <th class="px-6 py-4 font-semibold">Tanggal Diterbitkan</th>
                <th class="px-6 py-4 font-semibold">Berlaku Sampai</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="w in warnings" :key="w.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 font-bold text-red-600">{{ w.level }}</td>
                <td class="px-6 py-4 text-gray-800 dark:text-gray-200">{{ w.reason }}</td>
                <td class="px-6 py-4">{{ formatDate(w.date) }}</td>
                <td class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">{{ formatDate(w.expiry_date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Rincian Slip Gaji Karyawan -->
    <Teleport to="body">
      <div v-if="selectedSlip" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rincian Slip Gaji Mandiri</h3>
              <p class="text-xs text-gray-500">Periode: {{ selectedSlip.period }}</p>
            </div>
            <button @click="selectedSlip = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="py-4 space-y-4">
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/40 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Gaji Pokok:</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(selectedSlip.basic_salary) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Total Pendapatan:</span>
                <span class="font-bold text-emerald-600">{{ formatCurrency(selectedSlip.total_earning) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Total Potongan Resmi:</span>
                <span class="font-bold text-red-500">- {{ formatCurrency(selectedSlip.total_deduction) }}</span>
              </div>
            </div>

            <!-- Komponen Breakdown -->
            <div v-if="selectedSlip.payslip_lines && selectedSlip.payslip_lines.length > 0">
              <p class="text-xs font-semibold uppercase text-gray-400 mb-2">Rincian Potongan & Tunjangan</p>
              <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <div
                  v-for="line in selectedSlip.payslip_lines"
                  :key="line.id"
                  class="flex justify-between text-xs py-1 px-2.5 rounded bg-gray-100/70 dark:bg-gray-700/50"
                >
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ line.name }}</span>
                  <span :class="line.category === 'deduction' ? 'text-red-500 font-semibold' : 'text-emerald-600 font-semibold'">
                    {{ line.category === 'deduction' ? '-' : '+' }} {{ formatCurrency(line.amount) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-900/20 flex justify-between items-center">
              <span class="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Gaji Bersih Diterima:</span>
              <span class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{{ formatCurrency(selectedSlip.net_salary) }}</span>
            </div>
          </div>

          <div class="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              @click="selectedSlip = null"
              class="rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { http } from '@/services/http'

const profile = ref<any>({})
const payslips = ref<any[]>([])
const warnings = ref<any[]>([])
const activeTab = ref<'payslips' | 'warnings'>('payslips')
const isLoading = ref(true)
const selectedSlip = ref<any>(null)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const fetchAll = async () => {
  isLoading.value = true
  try {
    const [profRes, payRes, warnRes] = await Promise.all([
      http.get('/hr/employees/me/profile'),
      http.get('/hr/employees/me/payslips'),
      http.get('/hr/employees/me/warning-letters')
    ])
    profile.value = profRes.data?.data || profRes.data || {}
    payslips.value = payRes.data?.data || payRes.data || []
    warnings.value = warnRes.data?.data || warnRes.data || []
  } catch (err: any) {
    console.error('Failed to load ESS data', err)
  } finally {
    isLoading.value = false
  }
}

const viewDetail = (slip: any) => {
  selectedSlip.value = slip
}

onMounted(() => {
  fetchAll()
})
</script>
