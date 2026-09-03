<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">CFO & Financial Analytics Dashboard</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pemantauan Arus Kas, Likuiditas, Profitabilitas, Piutang (AR) & Beban Operasional Skala Enterprise
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="fetchDashboardData" class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-gray-800">
            <svg :class="['h-4 w-4 text-gray-600 dark:text-gray-300', isLoading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Perbarui Data Real-Time
          </button>
        </div>
      </div>

      <!-- 4 UTAMA KPI CARD -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <!-- Total Likuiditas Kas & Bank -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kas & Setara Kas (Liquidity)</p>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ formatCompact(totalCash) }}</h4>
          <p class="text-xs text-gray-400 mt-1">{{ cashAccountsCount }} Rekening Bank & Kas Kecil</p>
        </div>

        <!-- Piutang Usaha (AR) -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Piutang Pelanggan (AR)</p>
            <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{{ formatCompact(totalAR) }}</h4>
          <p class="text-xs text-blue-500 mt-1">{{ unpaidInvoiceCount }} Faktur Belum Lunas</p>
        </div>

        <!-- Hutang Lancar & Pajak (AP) -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kewajiban & Hutang (AP)</p>
            <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <h4 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ formatCompact(totalAP) }}</h4>
          <p class="text-xs text-amber-500 mt-1">Hutang Usaha, Gaji & Pajak PPh/PPN</p>
        </div>

        <!-- Laba Bersih Tahun Berjalan -->
        <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Laba Bersih (Net Profit)</p>
            <div class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <h4 :class="['text-2xl font-black mt-2', netProfit >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-rose-600 dark:text-rose-400']">
            {{ formatCompact(netProfit) }}
          </h4>
          <p class="text-xs text-gray-400 mt-1">Margin: {{ netMarginPercent.toFixed(1) }}% dari Omzet</p>
        </div>

      </div>

      <!-- GRAFIK ARUS KEUANGAN -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- KOMPOSISI PENDAPATAN VS BEBAN (BAR CHART) -->
        <div class="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Struktur Posisi Keuangan (Neraca & Laba Rugi)</h3>
          <div v-if="isLoading" class="h-[320px] flex items-center justify-center text-gray-400">Memuat visualisasi...</div>
          <apexchart v-else type="bar" height="320" :options="barChartOptions" :series="barChartSeries"></apexchart>
        </div>

        <!-- KOMPOSISI BEBAN OPERASIONAL (DONUT) -->
        <div class="col-span-1 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Distribusi Beban Usaha</h3>
          <div v-if="isLoading" class="h-[320px] flex items-center justify-center text-gray-400">Memuat visualisasi...</div>
          <apexchart v-else type="donut" height="320" :options="donutOptions" :series="donutSeries"></apexchart>
        </div>

      </div>

      <!-- RECENT FINANCE OVERVIEW TABLE -->
      <div class="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-6">
        <h3 class="font-bold text-gray-900 dark:text-white mb-4">Status Integrasi Modul Keuangan</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          
          <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
            <div class="font-bold text-gray-900 dark:text-white">Chart of Accounts (COA)</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">24 Akun Standar SAK Indonesia Aktif</div>
            <router-link to="/finance/accounting" class="inline-block mt-3 text-xs font-bold text-brand-600 hover:underline">Kelola Akun &rarr;</router-link>
          </div>

          <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
            <div class="font-bold text-gray-900 dark:text-white">Faktur & Piutang (Invoicing)</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Kalkulasi PPN 11% & Cetak PDF Resmi</div>
            <router-link to="/finance/invoicing" class="inline-block mt-3 text-xs font-bold text-brand-600 hover:underline">Kelola Faktur &rarr;</router-link>
          </div>

          <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
            <div class="font-bold text-gray-900 dark:text-white">Laporan Keuangan SAK</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Laba Rugi & Neraca Seimbang Terverifikasi</div>
            <router-link to="/finance/reports" class="inline-block mt-3 text-xs font-bold text-brand-600 hover:underline">Lihat Laporan &rarr;</router-link>
          </div>

        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import VueApexCharts from 'vue3-apexcharts'
import { http } from '@/services/http'

const apexchart = VueApexCharts
const isLoading = ref(false)

const totalCash = ref(0)
const cashAccountsCount = ref(0)
const totalAR = ref(0)
const unpaidInvoiceCount = ref(0)
const totalAP = ref(0)
const netProfit = ref(0)
const totalRevenue = ref(0)
const totalExpense = ref(0)
const totalHPP = ref(0)

const isDark = ref(document.documentElement.classList.contains('dark'))

onMounted(() => {
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  fetchDashboardData()
})

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const [accRes, invRes, plRes, bsRes] = await Promise.all([
      http.get('/finance/accounting/accounts').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/finance/invoicing').then(r => r.data?.data || r.data || []).catch(()=>[]),
      http.get('/finance/accounting/reports/profit-loss').then(r => r.data?.data || r.data || {}).catch(()=>({})),
      http.get('/finance/accounting/reports/balance-sheet').then(r => r.data?.data || r.data || {}).catch(()=>({}))
    ])

    // 1. Kas & Bank
    const cashAccs = accRes.filter((a: any) => a.type === 'asset' && (a.code.startsWith('1-100') || a.category?.includes('Kas') || a.name?.includes('Bank')))
    totalCash.value = cashAccs.reduce((acc: number, c: any) => acc + (c.balance || 0), 0)
    cashAccountsCount.value = cashAccs.length

    // 2. Invoicing (AR)
    totalAR.value = invRes.filter((i: any) => i.state === 'posted').reduce((acc: number, c: any) => acc + (c.amount_total || 0), 0)
    unpaidInvoiceCount.value = invRes.filter((i: any) => i.state === 'posted').length

    // 3. Hutang (AP)
    totalAP.value = bsRes.total_liability || 0

    // 4. Laba Rugi
    netProfit.value = plRes.net_profit || 0
    totalRevenue.value = plRes.total_income || 0
    totalExpense.value = plRes.total_expense || 0
    totalHPP.value = plRes.total_hpp || 0

  } catch (err) {
    console.error('Failed to load finance dashboard', err)
  } finally {
    isLoading.value = false
  }
}

const netMarginPercent = computed(() => {
  if (!totalRevenue.value || totalRevenue.value === 0) return 0
  return (netProfit.value / totalRevenue.value) * 100
})

const formatCompact = (val: number) => {
  if (!val || val === 0) return 'Rp 0'
  if (Math.abs(val) >= 1000000000) return `Rp ${(val / 1000000000).toFixed(2)} M`
  if (Math.abs(val) >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

// Charts
const barChartSeries = computed(() => [{
  name: 'Nominal (Rp)',
  data: [totalCash.value, totalAR.value, totalAP.value, totalRevenue.value, totalExpense.value, netProfit.value]
}])

const barChartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  colors: ['#10b981'],
  xaxis: {
    categories: ['Kas/Bank', 'Piutang (AR)', 'Hutang (AP)', 'Pendapatan', 'Beban Usaha', 'Laba Bersih'],
    labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563', fontSize: '11px' } }
  },
  yaxis: { labels: { style: { colors: isDark.value ? '#9ca3af' : '#4b5563' } } },
  grid: { borderColor: isDark.value ? '#374151' : '#e5e7eb' },
  tooltip: { theme: isDark.value ? 'dark' : 'light' }
}))

const donutSeries = computed(() => {
  return [totalHPP.value || 1, totalExpense.value || 1]
})

const donutOptions = computed(() => ({
  chart: { type: 'donut', background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Harga Pokok (HPP)', 'Beban Operasional & HR'],
  colors: ['#f59e0b', '#ef4444'],
  legend: { position: 'bottom', labels: { colors: isDark.value ? '#d1d5db' : '#374151' } },
  stroke: { show: false }
}))
</script>
