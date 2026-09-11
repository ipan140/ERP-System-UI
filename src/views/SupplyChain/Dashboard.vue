<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </span>
            Executive Dashboard Rantai Pasok (SCM)
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ringkasan terpadu 5 Pilar Rantai Pasok standar Odoo 18 / Mekari SCM untuk Perusahaan Menengah (100–1.000 Karyawan).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="fetchDashboardData"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <svg :class="['w-4 h-4', { 'animate-spin': isLoading }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Critical SCM Alert Banners -->
      <div v-if="summary.alerts && summary.alerts.length > 0" class="space-y-2">
        <div
          v-for="(alert, idx) in summary.alerts"
          :key="idx"
          :class="[
            'p-4 rounded-xl border flex items-center justify-between text-xs font-medium',
            alert.severity === 'danger'
              ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300'
              : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-300'
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-lg bg-white/60 dark:bg-black/20 font-bold">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <div>
              <span class="font-bold uppercase tracking-wider text-2xs mr-2">{{ alert.title }}</span>
              <span>{{ alert.message }}</span>
            </div>
          </div>
          <span class="font-mono text-2xs font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-black/40">
            {{ alert.ref_code }}
          </span>
        </div>
      </div>

      <!-- 5 Pilar SCM Executive Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Pilar 1: Inventaris & Gudang -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Valuasi Stok</span>
            <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            Rp {{ (summary.total_inventory_valuation || 0).toLocaleString('id-ID') }}
          </h3>
          <p class="text-2xs text-gray-400 mt-2">
            Total SKU: <strong class="text-gray-700 dark:text-gray-300">{{ summary.total_sku_count }}</strong> | Kritis: <strong class="text-rose-600">{{ summary.low_stock_count }}</strong>
          </p>
        </div>

        <!-- Pilar 2: Pengadaan / Purchase -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">PO Aktif / Belanja</span>
            <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            {{ summary.total_active_pos }} Order Aktif
          </h3>
          <p class="text-2xs text-gray-400 mt-2">
            Total Nilai: <strong class="text-gray-700 dark:text-gray-300">Rp {{ (summary.monthly_purchase_spend || 0).toLocaleString('id-ID') }}</strong>
          </p>
        </div>

        <!-- Pilar 3: Manufaktur / MRP -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">SPK Manufaktur</span>
            <div class="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-extrabold text-amber-600 dark:text-amber-400">
            {{ summary.active_manufacturing_mos }} Lini Produksi
          </h3>
          <p class="text-2xs text-gray-400 mt-2">
            Selesai Bulan Ini: <strong class="text-emerald-600">{{ summary.completed_mos_monthly }} MO</strong>
          </p>
        </div>

        <!-- Pilar 4: Quality Control (QC) -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tingkat Lolos QC</span>
            <div class="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-extrabold text-teal-600 dark:text-teal-400">
            {{ summary.quality_pass_rate }}%
          </h3>
          <p class="text-2xs text-gray-400 mt-2">
            Total Inspeksi: <strong class="text-gray-700 dark:text-gray-300">{{ summary.total_qc_checks }}</strong> batch
          </p>
        </div>

        <!-- Pilar 5: Mesin & Maintenance -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Servis & Mesin</span>
            <div class="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-extrabold text-purple-600 dark:text-purple-400">
            {{ summary.active_maintenance_tickets }} Tiket Servis
          </h3>
          <p class="text-2xs text-gray-400 mt-2">
            Total Mesin Aktif: <strong class="text-gray-700 dark:text-gray-300">{{ summary.total_equipments }} Unit</strong>
          </p>
        </div>
      </div>

      <!-- Quick Navigation Matrix to 8 SCM Submodules -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
        <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-4">Navigasi Cepat Modul Rantai Pasok (SCM)</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <router-link
            to="/supply-chain/inventory"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">Inventaris & Gudang</span>
            <span class="text-2xs text-gray-400 block mt-1">Multi-lokasi, HPP & Stok Opname</span>
          </router-link>

          <router-link
            to="/supply-chain/purchase"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">Pengadaan (PO)</span>
            <span class="text-2xs text-gray-400 block mt-1">Vendor PO, Approval Matrix & Penerimaan</span>
          </router-link>

          <router-link
            to="/supply-chain/manufacturing"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">Manufaktur / MRP</span>
            <span class="text-2xs text-gray-400 block mt-1">SPK Produksi, BOM & Work Centers</span>
          </router-link>

          <router-link
            to="/supply-chain/quality"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">Kendali Mutu (QC)</span>
            <span class="text-2xs text-gray-400 block mt-1">Inspeksi Lolos/Gagal & Standar Batch</span>
          </router-link>

          <router-link
            to="/supply-chain/maintenance"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">Perawatan Mesin</span>
            <span class="text-2xs text-gray-400 block mt-1">Preventif, Tiket Servis & Master Mesin</span>
          </router-link>

          <router-link
            to="/supply-chain/plm"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">PLM & ECO</span>
            <span class="text-2xs text-gray-400 block mt-1">Engineering Change Orders & Versi BOM</span>
          </router-link>

          <router-link
            to="/supply-chain/barcode"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">Sistem Barcode</span>
            <span class="text-2xs text-gray-400 block mt-1">Scanner Interaktif & Label Cetak SKU</span>
          </router-link>

          <router-link
            to="/supply-chain/calendar"
            class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
          >
            <span class="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-500 block">Kalender Terpadu</span>
            <span class="text-2xs text-gray-400 block mt-1">Jadwal PO, Target Produksi & Servis</span>
          </router-link>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { scmDashboardService } from '@/services/supply-chain/dashboard.service'
import type { IScmDashboardSummary } from '@/types/supply-chain/dashboard.dto'

const isLoading = ref(false)
const summary = ref<IScmDashboardSummary>({
  total_inventory_valuation: 0,
  total_sku_count: 0,
  low_stock_count: 0,
  total_active_pos: 0,
  monthly_purchase_spend: 0,
  active_manufacturing_mos: 0,
  completed_mos_monthly: 0,
  quality_pass_rate: 100,
  total_qc_checks: 0,
  total_equipments: 0,
  active_maintenance_tickets: 0,
  alerts: [],
})

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const res = await scmDashboardService.getSummary()
    summary.value = res
  } catch (err) {
    console.error('Failed to load SCM Dashboard summary', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
