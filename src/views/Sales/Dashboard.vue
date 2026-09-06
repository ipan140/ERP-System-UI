<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Executive Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              💼
            </span>
            Executive Sales & Revenue Command Center
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo Enterprise & Mekari: Konsolidasi 5 pilar bisnis (B2B Sales Orders, CRM Pipeline, POS Retail, SaaS Subscriptions, & Rental Aset).
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Realtime ERP Sync
          </span>
          <button
            @click="fetchAll"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Muat Ulang Data
          </button>
        </div>
      </div>

      <!-- 5 Pillar Executive Navigation Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <!-- 1. CRM Pipeline -->
        <router-link to="/sales/crm" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-red-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">CRM Leads</span>
            <span class="text-lg group-hover:scale-110 transition">🎯</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-gray-900 dark:text-white">{{ crmLeads.length }} Prospek</h4>
          <p class="mt-1 text-xs text-rose-600 font-medium font-mono">{{ hotLeadsCount }} Hot Leads (🔥)</p>
        </router-link>

        <!-- 2. B2B Sales Orders -->
        <router-link to="/sales/core" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-emerald-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Pesanan Penjualan</span>
            <span class="text-lg group-hover:scale-110 transition">📄</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatCompact(salesRevenue) }}</h4>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ salesOrders.length }} Penawaran / SO</p>
        </router-link>

        <!-- 3. Point of Sale (POS) -->
        <router-link to="/sales/pos" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-blue-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Point of Sale</span>
            <span class="text-lg group-hover:scale-110 transition">🛒</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-blue-600 dark:text-blue-400">Rp {{ formatCompact(posRevenue) }}</h4>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ posOrders.length }} Transaksi Kasir</p>
        </router-link>

        <!-- 4. Subscriptions (SaaS MRR) -->
        <router-link to="/sales/subscriptions" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-purple-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Langganan (MRR)</span>
            <span class="text-lg group-hover:scale-110 transition">🔄</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-purple-600 dark:text-purple-400">Rp {{ formatCompact(mrrRevenue) }}</h4>
          <p class="mt-1 text-xs text-purple-600 font-medium">{{ activeSubsCount }} Klien Aktif</p>
        </router-link>

        <!-- 5. Rental Aset -->
        <router-link to="/sales/rental" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-amber-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Penyewaan Aset</span>
            <span class="text-lg group-hover:scale-110 transition">🚜</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-amber-600 dark:text-amber-400">Rp {{ formatCompact(rentalRevenue) }}</h4>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ rentalOrders.length }} Kontrak Sewa</p>
        </router-link>
      </div>

      <!-- Main Financial Highlights (Grand Gross Revenue) -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-md">
          <p class="text-xs font-bold uppercase tracking-wider text-emerald-100">Total Akumulasi Omzet (All Pillars)</p>
          <h3 class="text-3xl font-black mt-2 font-mono">Rp {{ grandTotalRevenue.toLocaleString('id-ID') }}</h3>
          <p class="text-xs text-emerald-100/90 mt-2">
            Konsolidasi terpadu pendapatan dari B2B Sales, POS Kasir, Recurring Subscription & Biaya Rental.
          </p>
          <div class="mt-6 pt-4 border-t border-emerald-500/40 flex justify-between text-xs">
            <span>Komisi Sales Akumulasi:</span>
            <span class="font-bold font-mono text-emerald-200">Rp {{ totalCommission.toLocaleString('id-ID') }}</span>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-theme-xs flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Target Kuota Bulanan</span>
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {{ quotaAchievementPct.toFixed(1) }}% Tercapai
              </span>
            </div>
            <h4 class="text-2xl font-bold text-gray-900 dark:text-white mt-2 font-mono">
              Rp {{ salesRevenue.toLocaleString('id-ID') }}
            </h4>
            <p class="text-xs text-gray-400 mt-1">Target Perusahaan: Rp {{ monthlyTarget.toLocaleString('id-ID') }}</p>
            <!-- Progress Bar -->
            <div class="w-full bg-gray-100 rounded-full h-3 dark:bg-gray-700 mt-4 overflow-hidden">
              <div
                class="bg-emerald-500 h-3 rounded-full transition-all duration-700"
                :style="{ width: Math.min(quotaAchievementPct, 100) + '%' }"
              ></div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Pacing Track:</span>
            <span :class="quotaAchievementPct >= 70 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'">
              {{ quotaAchievementPct >= 70 ? '🟢 On Track' : '🟡 Butuh Akselerasi Deal' }}
            </span>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-theme-xs flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pipeline Win Ratio</span>
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {{ winRatioPct.toFixed(1) }}% Closing
              </span>
            </div>
            <h4 class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {{ confirmedSalesCount }} <span class="text-sm font-normal text-gray-500">Deals Won</span>
            </h4>
            <p class="text-xs text-gray-400 mt-1">Dari {{ salesOrders.length }} total penawaran harga (SPH) yang diajukan</p>
            <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 text-xs">
              <div>
                <span class="text-gray-400">Menunggu Approval:</span>
                <p class="font-bold text-rose-600 dark:text-rose-400">{{ pendingApprovalCount }} SO</p>
              </div>
              <div>
                <span class="text-gray-400">Tertanda Digital:</span>
                <p class="font-bold text-emerald-600 dark:text-emerald-400">{{ signedCount }} SO</p>
              </div>
            </div>
          </div>
          <router-link to="/sales/core" class="mt-4 text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1">
            Buka Manajemen Pesanan ➔
          </router-link>
        </div>
      </div>

      <!-- Charts Row: ApexCharts Revenue Contribution & CRM Funnel -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Revenue Distribution by Pillar -->
        <div class="col-span-12 lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Kontribusi Omzet Lintas Pilar Bisnis</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Distribusi realisasi pendapatan dari seluruh lini penjualan</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              5 Pilar Aktif
            </span>
          </div>
          <div class="h-72">
            <VueApexCharts type="bar" height="100%" :options="barOptions" :series="barSeries" />
          </div>
        </div>

        <!-- Donut / Pipeline Breakdown -->
        <div class="col-span-12 lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Komposisi Pendapatan</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Persentase share kontribusi per pilar</p>
              </div>
            </div>
            <div class="h-64 flex items-center justify-center">
              <VueApexCharts type="donut" height="100%" :options="donutOptions" :series="donutSeries" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-gray-600 dark:text-gray-300 truncate">B2B Core SO</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span class="text-gray-600 dark:text-gray-300 truncate">POS Kasir Ritel</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span class="text-gray-600 dark:text-gray-300 truncate">SaaS Retainer</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span class="text-gray-600 dark:text-gray-300 truncate">Sewa & Rental</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Tables: Recent Orders & Top Sales Leaderboard Preview -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Recent Orders Feed -->
        <div class="col-span-12 lg:col-span-7 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs overflow-hidden">
          <div class="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-sm">Pesanan Penjualan Terbaru (Recent Transactions)</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Sinkronisasi data langsung dari modul B2B Penjualan</p>
            </div>
            <router-link to="/sales/core" class="text-xs text-brand-500 font-bold hover:underline">
              Lihat Semua ➔
            </router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-xs">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/30 text-gray-500 dark:text-gray-400">
                  <th class="px-4 py-3 text-left">Nomor & Pelanggan</th>
                  <th class="px-4 py-3 text-left">Salesperson</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-right">Nilai Transaksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr v-if="salesOrders.length === 0">
                  <td colspan="4" class="p-6 text-center text-gray-400">Belum ada data transaksi.</td>
                </tr>
                <tr v-for="ord in salesOrders.slice(0, 5)" :key="ord.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                  <td class="px-4 py-3">
                    <p class="font-bold text-gray-900 dark:text-white">{{ ord.name || ('SO-' + ord.id) }}</p>
                    <p class="text-[11px] text-gray-400">{{ ord.customer_name || 'Pelanggan Umum' }}</p>
                  </td>
                  <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {{ ord.salesperson_name || 'Sales Team' }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      :class="[
                        ord.state === 'sale' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' :
                        ord.state === 'draft' ? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300' :
                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
                        'px-2 py-0.5 rounded text-[10px] font-bold border'
                      ]"
                    >
                      {{ ord.state === 'sale' ? 'Confirmed SO' : ord.state === 'draft' ? 'Draft SPH' : ord.state }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right font-mono font-bold text-gray-900 dark:text-white">
                    Rp {{ formatCurrency(ord.amount_total || ((ord.amount_untaxed || 0) * 1.11)) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Salesperson Leaderboard Widget -->
        <div class="col-span-12 lg:col-span-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs p-5 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-sm">🏆 Top Sales Leaderboard</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Peringkat kinerja dan pencapaian kuota sales</p>
              </div>
              <router-link to="/sales/core" class="text-xs text-emerald-600 font-bold hover:underline">
                Peringkat Lengkap ➔
              </router-link>
            </div>

            <div class="space-y-3">
              <div
                v-for="(person, idx) in leaderboard.slice(0, 4)"
                :key="idx"
                class="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/30"
              >
                <div class="flex items-center gap-3">
                  <span class="text-base font-bold w-6 text-center">
                    {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '#' + (idx + 1) }}
                  </span>
                  <div>
                    <h5 class="text-xs font-bold text-gray-900 dark:text-white">{{ person.salesperson_name }}</h5>
                    <p class="text-[10px] text-gray-400">{{ person.confirmed_deals }} Deals Terkonfirmasi</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {{ formatCompact(person.total_revenue) }}
                  </p>
                  <p class="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                    Komisi: Rp {{ formatCompact(person.total_commission) }}
                  </p>
                </div>
              </div>

              <div v-if="leaderboard.length === 0" class="p-6 text-center text-xs text-gray-400">
                Belum ada kalkulasi peringkat tim sales.
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Standar Komisi Perusahaan:</span>
            <span class="font-bold text-gray-900 dark:text-white">3.0% DPP Transaksi</span>
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
import { API_BASE_URL } from '@/config/api'

import { salesCoreService } from '@/services/sales/core.service'
import { crmService } from '@/services/sales/crm.service'
import { pointOfSaleService } from '@/services/sales/pos.service'
import { subscriptionsService } from '@/services/sales/subscriptions.service'
import { rentalService } from '@/services/sales/rental.service'

const isLoading = ref(false)

const salesOrders = ref<any[]>([])
const crmLeads = ref<any[]>([])
const posOrders = ref<any[]>([])
const subscriptions = ref<any[]>([])
const rentalOrders = ref<any[]>([])
const leaderboard = ref<any[]>([])

const monthlyTarget = 500000000 // Target Perusahaan Rp 500 Juta

// Computed metrics per pillar
const salesRevenue = computed(() => {
  return salesOrders.value.reduce((sum, item) => sum + (Number(item.amount_total) || ((Number(item.amount_untaxed) || 0) * 1.11) || 0), 0)
})

const posRevenue = computed(() => {
  return posOrders.value.reduce((sum, item) => sum + (Number(item.amount_total) || 0), 0)
})

const mrrRevenue = computed(() => {
  return subscriptions.value
    .filter(s => s.status === 'Active' || s.status === 'active')
    .reduce((sum, item) => sum + (Number(item.recurring_amount) || 0), 0)
})

const rentalRevenue = computed(() => {
  return rentalOrders.value.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0)
})

const grandTotalRevenue = computed(() => {
  return salesRevenue.value + posRevenue.value + mrrRevenue.value + rentalRevenue.value
})

const hotLeadsCount = computed(() => {
  return crmLeads.value.filter(l => (l.lead_score || 0) >= 75).length
})

const activeSubsCount = computed(() => {
  return subscriptions.value.filter(s => s.status === 'Active' || s.status === 'active').length
})

const confirmedSalesCount = computed(() => {
  return salesOrders.value.filter(o => o.state === 'sale' || o.state === 'done').length
})

const pendingApprovalCount = computed(() => {
  return salesOrders.value.filter(o => o.needs_approval && o.approval_status !== 'Approved').length
})

const signedCount = computed(() => {
  return salesOrders.value.filter(o => o.is_signed).length
})

const winRatioPct = computed(() => {
  if (salesOrders.value.length === 0) return 0
  return (confirmedSalesCount.value / salesOrders.value.length) * 100
})

const quotaAchievementPct = computed(() => {
  if (monthlyTarget <= 0) return 0
  return (salesRevenue.value / monthlyTarget) * 100
})

const totalCommission = computed(() => {
  return salesOrders.value.reduce((sum, item) => {
    const untaxed = Number(item.amount_untaxed) || Number(item.total_amount) || 0
    return sum + (Number(item.commission_amount) || (untaxed * 0.03))
  }, 0)
})

const formatCurrency = (val: number | string) => {
  return (Number(val) || 0).toLocaleString('id-ID')
}

const formatCompact = (val: number | string) => {
  const num = Number(val) || 0
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + ' M'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + ' Jt'
  if (num >= 1000) return (num / 1000).toFixed(0) + ' Rb'
  return num.toLocaleString('id-ID')
}

// Chart Apex Configuration
const barSeries = computed(() => [
  {
    name: 'Total Omzet (Rp)',
    data: [
      salesRevenue.value,
      posRevenue.value,
      mrrRevenue.value,
      rentalRevenue.value,
      crmLeads.value.reduce((s, l) => s + (Number(l.expected_revenue) || 0), 0)
    ]
  }
])

const barOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  colors: ['#10b981'],
  plotOptions: {
    bar: {
      borderRadius: 8,
      horizontal: false,
      columnWidth: '40%'
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['B2B Sales', 'POS Ritel', 'SaaS MRR', 'Rental Aset', 'CRM Pipeline'],
    labels: {
      style: { fontSize: '11px', fontWeight: 600 }
    }
  },
  yaxis: {
    labels: {
      formatter: (val: number) => formatCompact(val)
    }
  },
  grid: {
    strokeDashArray: 4
  },
  tooltip: {
    y: {
      formatter: (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID')
    }
  }
}))

const donutSeries = computed(() => {
  const sRev = salesRevenue.value || 1
  const pRev = posRevenue.value || 1
  const mRev = mrrRevenue.value || 1
  const rRev = rentalRevenue.value || 1
  return [sRev, pRev, mRev, rRev]
})

const donutOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'inherit'
  },
  labels: ['B2B Sales Order', 'POS Kasir Ritel', 'SaaS Subscriptions', 'Rental Aset'],
  colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0
  },
  tooltip: {
    y: {
      formatter: (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID')
    }
  }
}))

const fetchAll = async () => {
  isLoading.value = true
  try {
    const [salesRes, crmRes, posRes, subsRes, rentRes] = await Promise.all([
      salesCoreService.getAll().catch(() => []),
      crmService.getAll().catch(() => []),
      pointOfSaleService.getAll().catch(() => []),
      subscriptionsService.getAll().catch(() => []),
      rentalService.getAll().catch(() => [])
    ])

    salesOrders.value = Array.isArray(salesRes) ? salesRes : (salesRes?.data || [])
    crmLeads.value = Array.isArray(crmRes) ? crmRes : (crmRes?.data || [])
    posOrders.value = Array.isArray(posRes) ? posRes : (posRes?.data || [])
    subscriptions.value = Array.isArray(subsRes) ? subsRes : (subsRes?.data || [])
    rentalOrders.value = Array.isArray(rentRes) ? rentRes : (rentRes?.data || [])

    // Fetch Leaderboard
    const token = localStorage.getItem('token')
    const boardRes = await fetch(`${API_BASE_URL}/sales/core/leaderboard`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    if (boardRes.ok) {
      const data = await boardRes.json()
      leaderboard.value = Array.isArray(data) ? data : (data.data || [])
    }
  } catch (err) {
    console.error('Failed to load sales dashboard data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAll()
})
</script>
