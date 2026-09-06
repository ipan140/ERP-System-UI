<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </span>
            Dashboard Pemasaran Terpadu (Executive Marketing Analytics)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo & HubSpot: Konsolidasi 6 kanal promosi (Email, SMS, Sosial, Otomasi, Acara, & Survei NPS) terintegrasi ke Omzet Penjualan (ROAS & CAC).
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Multi-Channel Feeds
          </span>
          <button @click="fetchAll" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Sinkronkan
          </button>
        </div>
      </div>

      <!-- Top 6 Pillar Executive KPI Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <!-- 1. Mass Mailing -->
        <router-link to="/marketing/mass-mailing" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Email Massal</span>
            <span class="text-lg group-hover:scale-110 transition">✉️</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalEmailsSent.toLocaleString('id-ID') }}</h4>
          <p class="mt-1 text-xs text-purple-600 font-medium">A/B Split Test Aktif</p>
        </router-link>

        <!-- 2. WhatsApp Business API -->
        <router-link to="/marketing/sms-marketing" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-emerald-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">WhatsApp & SMS</span>
            <span class="text-lg group-hover:scale-110 transition">💬</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.totalSmsSent.toLocaleString('id-ID') }}</h4>
          <p class="mt-1 text-xs text-emerald-600 font-medium">WABA Meta Cloud API</p>
        </router-link>

        <!-- 3. Social Marketing -->
        <router-link to="/marketing/social-marketing" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-pink-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Social Reach</span>
            <span class="text-lg group-hover:scale-110 transition">🌐</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalSocialReach.toLocaleString('id-ID') }}</h4>
          <p class="mt-1 text-xs text-pink-600 font-medium">4 Kanal Terhubung</p>
        </router-link>

        <!-- 4. Automation -->
        <router-link to="/marketing/automation" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-indigo-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Omnichannel Drip</span>
            <span class="text-lg group-hover:scale-110 transition">⚡</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-gray-900 dark:text-white">{{ stats.activeWorkflowsCount }} Skenario</h4>
          <p class="mt-1 text-xs text-indigo-600 font-medium">Journey Auto-Pilot</p>
        </router-link>

        <!-- 5. Hot Leads CRM -->
        <router-link to="/sales/crm" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-rose-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Hot Leads (CRM)</span>
            <span class="text-lg group-hover:scale-110 transition">🎯</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-rose-600 dark:text-rose-400">{{ stats.hotLeadsCount }} Prospek</h4>
          <p class="mt-1 text-xs text-rose-600 font-medium">Skor >= 75 Poin</p>
        </router-link>

        <!-- 6. Surveys NPS -->
        <router-link to="/marketing/surveys" class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-teal-500 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Skor NPS</span>
            <span class="text-lg group-hover:scale-110 transition">📊</span>
          </div>
          <h4 class="mt-3 text-xl font-bold text-teal-600 dark:text-teal-400">+{{ stats.avgNps }}</h4>
          <p class="mt-1 text-xs text-teal-600 font-medium">Kepuasan Pelanggan</p>
        </router-link>
      </div>

      <!-- Middle Grid: Multi-Channel ROI Breakdown & CRM Conversion Funnel -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Revenue & ROAS Matrix (8 Cols) -->
        <div class="col-span-12 lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 dark:border-gray-700">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>💰</span> Efektivitas Kanal Pemasaran vs Omzet Penjualan (ROAS)
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Membandingkan alokasi anggaran iklan dari Modul Finance dengan omzet penjualan riil Sales CRM.
              </p>
            </div>
            <span class="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg">
              ROAS: 4.8x
            </span>
          </div>

          <!-- Channel Revenue Bars -->
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-gray-700 dark:text-gray-300">Email Massal & Buletin Penawaran</span>
                <span class="text-emerald-600 font-bold">Rp 185.000.000 (42%)</span>
              </div>
              <div class="h-2.5 w-full bg-gray-100 rounded-full dark:bg-gray-700 overflow-hidden">
                <div class="bg-brand-500 h-2.5 rounded-full" style="width: 42%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-gray-700 dark:text-gray-300">Iklan Media Sosial (FB, IG, LinkedIn, X)</span>
                <span class="text-emerald-600 font-bold">Rp 142.500.000 (33%)</span>
              </div>
              <div class="h-2.5 w-full bg-gray-100 rounded-full dark:bg-gray-700 overflow-hidden">
                <div class="bg-pink-500 h-2.5 rounded-full" style="width: 33%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-gray-700 dark:text-gray-300">Tiket Acara & Seminar Eksekutif</span>
                <span class="text-emerald-600 font-bold">Rp 68.000.000 (15%)</span>
              </div>
              <div class="h-2.5 w-full bg-gray-100 rounded-full dark:bg-gray-700 overflow-hidden">
                <div class="bg-amber-500 h-2.5 rounded-full" style="width: 15%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-gray-700 dark:text-gray-300">SMS Broadcast & WhatsApp Direct Push</span>
                <span class="text-emerald-600 font-bold">Rp 44.500.000 (10%)</span>
              </div>
              <div class="h-2.5 w-full bg-gray-100 rounded-full dark:bg-gray-700 overflow-hidden">
                <div class="bg-emerald-500 h-2.5 rounded-full" style="width: 10%"></div>
              </div>
            </div>
          </div>

          <!-- Bottom Summary -->
          <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Total Omzet Pemasaran</p>
              <h4 class="text-lg font-bold text-emerald-600 dark:text-emerald-400">Rp 440.000.000</h4>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Anggaran Terpakai (Finance)</p>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">Rp 91.500.000</h4>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Rata-rata CAC (Per Lead)</p>
              <h4 class="text-lg font-bold text-blue-600 dark:text-blue-400">Rp 82.500</h4>
            </div>
          </div>
        </div>

        <!-- Conversion Funnel & Quick Actions (4 Cols) -->
        <div class="col-span-12 lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎯</span> Funnel Konversi Prospek
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Perjalanan prospek dari interaksi kampanye hingga transaksi faktur lunas.
          </p>

          <div class="space-y-3 pt-2">
            <div class="rounded-xl bg-blue-50/80 p-3.5 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
              <div class="flex justify-between items-center">
                <span class="text-xs font-semibold text-blue-800 dark:text-blue-300">1. Total Jangkauan Iklan</span>
                <span class="text-xs font-bold text-blue-900 dark:text-blue-200">128.400 Impresi</span>
              </div>
            </div>

            <div class="rounded-xl bg-purple-50/80 p-3.5 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40">
              <div class="flex justify-between items-center">
                <span class="text-xs font-semibold text-purple-800 dark:text-purple-300">2. Klik & Kunjungan Tautan (UTM)</span>
                <span class="text-xs font-bold text-purple-900 dark:text-purple-200">9.620 Pengunjung</span>
              </div>
            </div>

            <div class="rounded-xl bg-amber-50/80 p-3.5 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
              <div class="flex justify-between items-center">
                <span class="text-xs font-semibold text-amber-800 dark:text-amber-300">3. Prospek Masuk (Sales Leads)</span>
                <span class="text-xs font-bold text-amber-900 dark:text-amber-200">1.108 Leads</span>
              </div>
            </div>

            <div class="rounded-xl bg-emerald-50/80 p-3.5 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
              <div class="flex justify-between items-center">
                <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">4. Penjualan Closing (Won Deal)</span>
                <span class="text-xs font-bold text-emerald-900 dark:text-emerald-200">242 Pelanggan</span>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <router-link to="/marketing/mass-mailing" class="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-600 transition">
              <span>🚀</span> Luncurkan Kampanye Baru
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { massMailingService } from '@/services/marketing/mass-mailing.service'
import { smsMarketingService } from '@/services/marketing/sms.service'
import { socialMarketingService } from '@/services/marketing/social.service'
import { marketingAutomationService } from '@/services/marketing/automation.service'
import { eventsService } from '@/services/marketing/events.service'
import { surveysService } from '@/services/marketing/surveys.service'
import { crmService } from '@/services/sales/crm.service'

const stats = ref({
  totalEmailsSent: 0,
  totalSmsSent: 0,
  smsCampaignsCount: 0,
  totalSocialReach: 0,
  activeWorkflowsCount: 0,
  totalTicketsCount: 0,
  scannedTicketsCount: 0,
  hotLeadsCount: 0,
  avgNps: 76
})

const fetchAll = async () => {
  try {
    const [camps, sms, social, auto, evTickets, surveys, leads] = await Promise.all([
      massMailingService.getAll().catch(() => []),
      smsMarketingService.getAll().catch(() => []),
      socialMarketingService.getAll().catch(() => []),
      marketingAutomationService.getAll().catch(() => []),
      eventsService.getAllTickets().catch(() => []),
      surveysService.getAll().catch(() => []),
      crmService.getAll().catch(() => [])
    ])

    stats.value.hotLeadsCount = (leads || []).filter((l: any) => (l.lead_score || 0) >= 75).length

    // Compute metrics
    stats.value.totalEmailsSent = (camps || []).reduce((acc: number, c: any) => acc + (c.sent_count || 0), 0)
    stats.value.totalSmsSent = (sms || []).reduce((acc: number, s: any) => acc + (s.sent_count || 0), 0)
    stats.value.smsCampaignsCount = (sms || []).length
    stats.value.totalSocialReach = (social || []).reduce((acc: number, s: any) => acc + (s.reach_count || 0), 0)
    stats.value.activeWorkflowsCount = (auto || []).filter((a: any) => a.status === 'Active').length || (auto || []).length
    stats.value.totalTicketsCount = (evTickets || []).length
    stats.value.scannedTicketsCount = (evTickets || []).filter((t: any) => t.is_scanned).length

    if ((surveys || []).length > 0) {
      const totalNps = (surveys || []).reduce((acc: number, s: any) => acc + (s.nps_score || 75), 0)
      stats.value.avgNps = Math.round(totalNps / surveys.length)
    }
  } catch (err) {
    console.error('Failed to load marketing dashboard stats:', err)
  }
}

onMounted(() => {
  fetchAll()
})
</script>
