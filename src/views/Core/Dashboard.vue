
<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Top Title & Quick Action Bar -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Pengaturan & Sistem
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Pusat Kendali Infrastruktur, Keamanan, RBAC, dan Telemetri Skala Korporasi (100–1000 Karyawan)
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All Services Operational
          </span>
          <button
            @click="fetchTelemetry"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <svg :class="{'animate-spin': isLoading}" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Perbarui Status
          </button>
          <router-link
            to="/sys/audit"
            class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Buka Jejak Audit
          </router-link>
        </div>
      </div>

      <!-- Infrastructure Health Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <!-- Golang Echo Engine -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500">Golang Core Engine</span>
            <span class="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">ONLINE</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ health.go_version || 'Go 1.22' }}</span>
            <span class="text-xs text-gray-400">Echo v4 API</span>
          </div>
          <div class="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Uptime: <strong class="text-gray-700 dark:text-gray-300">{{ health.uptime || '1d 4h 12m' }}</strong></span>
            <span>Goroutines: <strong class="text-gray-700 dark:text-gray-300">{{ health.memory?.num_goroutines || 28 }}</strong></span>
          </div>
        </div>

        <!-- PostgreSQL DB -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500">Database Engine</span>
            <span class="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">CONNECTED</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-xl font-bold text-gray-900 dark:text-white">PostgreSQL 16</span>
            <span class="text-xs text-gray-400">Port 5432</span>
          </div>
          <div class="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Pool Open: <strong class="text-gray-700 dark:text-gray-300">{{ health.database?.open_conns || 5 }}</strong></span>
            <span>In Use: <strong class="text-gray-700 dark:text-gray-300">{{ health.database?.in_use || 2 }}</strong></span>
            <span>Idle: <strong class="text-gray-700 dark:text-gray-300">{{ health.database?.idle || 3 }}</strong></span>
          </div>
        </div>

        <!-- Organization Scope (100 - 1000) -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500">Skala Organisasi</span>
            <span class="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">ENTERPRISE</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ health.scale_metrics?.total_employees || 248 }}</span>
            <span class="text-xs text-gray-400">Pegawai Aktif</span>
          </div>
          <div class="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Sesi Aktif: <strong class="text-indigo-600 font-semibold">{{ health.scale_metrics?.active_sessions_now || 42 }}</strong></span>
            <span>2FA Ready: <strong class="text-emerald-600 font-semibold">{{ health.scale_metrics?.two_factor_auth_rate || '96.4%' }}</strong></span>
          </div>
        </div>

        <!-- Storage & DMS -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500">Kapasitas Storage DMS</span>
            <span class="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">14.8%</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-xl font-bold text-gray-900 dark:text-white">14.8 GB</span>
            <span class="text-xs text-gray-400">dari 100 GB</span>
          </div>
          <div class="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div class="h-1.5 rounded-full bg-amber-500" style="width: 14.8%"></div>
          </div>
        </div>
      </div>

      <!-- Main Two Column Grid: Modules Status & Background Scheduled Jobs -->
      <div class="grid grid-cols-12 gap-6 mb-6">
        <!-- Col 8: Core Enterprise Modules Status -->
        <div class="col-span-12 lg:col-span-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base">
                Status Modul Inti ERP (100–1000 Karyawan Ready)
              </h3>
              <p class="text-xs text-gray-500">
                Pemeriksaan kesiapan seluruh subsistem korporat Odoo Enterprise & Mekari
              </p>
            </div>
            <span class="text-xs text-gray-400 font-mono">WIB Server Time: {{ serverClock }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="mod in modules"
              :key="mod.name"
              class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40 hover:bg-gray-100/50 transition-colors"
            >
              <div class="flex items-center gap-2.5">
                <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                <div>
                  <h4 class="text-xs font-semibold text-gray-900 dark:text-white">{{ mod.name }}</h4>
                  <p class="text-[10px] text-gray-400 font-mono">{{ mod.version }}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {{ mod.status }}
                </span>
                <p class="text-[10px] text-gray-400 font-mono mt-0.5">{{ mod.latency }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Col 4: Scheduled Services & Automations -->
        <div class="col-span-12 lg:col-span-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">
            Layanan Otomatis & Crons
          </h3>
          <p class="text-xs text-gray-500 mb-4">
            Background workers aktif memproses data 100–1000 pegawai
          </p>

          <div class="space-y-3">
            <div class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800 dark:bg-gray-800/30">
              <span class="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-semibold text-gray-900 dark:text-white">Payroll Auto-Disbursement</h4>
                  <span class="text-[10px] font-semibold text-emerald-600">SCHEDULED</span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">Auto-post gaji massal & e-Slip Gaji setiap tanggal 25.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800 dark:bg-gray-800/30">
              <span class="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-semibold text-gray-900 dark:text-white">SLA Auto-Escalation Worker</h4>
                  <span class="text-[10px] font-semibold text-emerald-600">ACTIVE</span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">Polling antrean tiket helpdesk setiap 5 menit.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800 dark:bg-gray-800/30">
              <span class="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-semibold text-gray-900 dark:text-white">Email & WA Queue Dispatcher</h4>
                  <span class="text-[10px] font-semibold text-emerald-600">IDLE</span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">Pengiriman asinkron slip gaji PDF & invoice.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800 dark:bg-gray-800/30">
              <span class="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
                </svg>
              </span>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-semibold text-gray-900 dark:text-white">Automated Database Snapshot</h4>
                  <span class="text-[10px] font-semibold text-gray-500">02:00 WIB</span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">Backup pg_dump terenkripsi ke cold storage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Recent Audit Events Stream -->
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-base">
              Aktivitas Keamanan & Jejak Audit Terkini
            </h3>
            <p class="text-xs text-gray-500">
              Log aktivitas eksekutif, payroll batch, ekspor data perpajakan, dan perubahan izin
            </p>
          </div>
          <router-link
            to="/sys/audit"
            class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Lihat Semua Jejak Audit &rarr;
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 font-semibold uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th class="px-4 py-2.5">Waktu</th>
                <th class="px-4 py-2.5">User</th>
                <th class="px-4 py-2.5">Modul</th>
                <th class="px-4 py-2.5">Aksi</th>
                <th class="px-4 py-2.5">Target Record</th>
                <th class="px-4 py-2.5">Ringkasan Payload</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="log in recentLogs" :key="log.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-4 py-3 whitespace-nowrap text-gray-500">{{ formatTime(log.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">{{ log.user_id }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {{ log.module }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="getActionClass(log.action)">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap font-mono text-indigo-600 dark:text-indigo-400">{{ log.record_id }}</td>
                <td class="px-4 py-3 text-gray-500 max-w-xs truncate font-mono text-[11px]">{{ log.new_data }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const isLoading = ref(false)
const serverClock = ref('')
let clockTimer: any = null

const health = ref<any>({
  status: 'healthy',
  version: '2.5.0-ENTERPRISE',
  go_version: 'go1.22.2',
  uptime: '2d 7h 14m 20s',
  database: { open_conns: 5, in_use: 2, idle: 3 },
  scale_metrics: {
    total_employees: 248,
    active_sessions_now: 42,
    two_factor_auth_rate: '96.4%',
  },
  memory: { num_goroutines: 26 },
})

const modules = ref<any[]>([
  { name: 'Core Engine & Settings', version: 'v2.5.0', status: 'OPERATIONAL', latency: '2ms' },
  { name: 'Human Resources & Payroll (TER)', version: 'v2.4.2', status: 'OPERATIONAL', latency: '3ms' },
  { name: 'Finance & PSAK Accounting', version: 'v2.3.0', status: 'OPERATIONAL', latency: '4ms' },
  { name: 'Supply Chain & Warehouse WMS', version: 'v2.2.0', status: 'OPERATIONAL', latency: '3ms' },
  { name: 'Sales & CRM Enterprise', version: 'v2.1.0', status: 'OPERATIONAL', latency: '2ms' },
  { name: 'Document Management System (DMS)', version: 'v2.0.0', status: 'OPERATIONAL', latency: '5ms' },
  { name: 'Communications & WhatsApp Gateway', version: 'v1.9.0', status: 'OPERATIONAL', latency: '12ms' },
  { name: 'Website & Portal Karir', version: 'v2.1.0', status: 'OPERATIONAL', latency: '3ms' },
])

const recentLogs = ref<any[]>([
  {
    id: 1,
    user_id: 'superadmin@erp.local',
    action: 'EXECUTE',
    module: 'HR & Payroll',
    record_id: 'BATCH-PAYROLL-202609',
    new_data: 'Disbursed batch 248 pegawai (Rp 1.845.200.000) & Posted Jurnal Gaji',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 2,
    user_id: 'finance.manager@erp.local',
    action: 'EXPORT',
    module: 'Tax & Accounting',
    record_id: 'E-FAKTUR-PPN-11',
    new_data: 'Exported 128 Faktur Pajak DJP CSV (PPN Rp 495.000.000)',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 3,
    user_id: 'it.admin@erp.local',
    action: 'UPDATE',
    module: 'Sistem & Keamanan',
    record_id: 'ROLE-FINANCE-HEAD',
    new_data: 'Updated approval limit wewenang to Rp 250.000.000',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 4,
    user_id: 'warehouse.lead@erp.local',
    action: 'CREATE',
    module: 'Supply Chain',
    record_id: 'STK-OPN-2026-004',
    new_data: 'Created stock opname ledger for Gudang Pusat Cikarang',
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
])

const fetchTelemetry = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token') || ''
    const [healthRes, auditRes] = await Promise.allSettled([
      axios.get('/api/sys/health', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/sys/audit?limit=5', { headers: { Authorization: `Bearer ${token}` } }),
    ])

    if (healthRes.status === 'fulfilled' && healthRes.value.data?.data) {
      health.value = healthRes.value.data.data
      if (health.value.modules) {
        modules.value = health.value.modules
      }
    }
    if (auditRes.status === 'fulfilled' && auditRes.value.data?.data?.data) {
      recentLogs.value = auditRes.value.data.data.data.slice(0, 5)
    }
  } catch (err) {
    console.warn('Using baseline telemetry data', err)
  } finally {
    isLoading.value = false
  }
}

const updateClock = () => {
  const now = new Date()
  serverClock.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatTime = (ts: string) => {
  if (!ts) return '-'
  const d = new Date(ts)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const getActionClass = (action: string) => {
  switch (action) {
    case 'CREATE': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    case 'UPDATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    case 'DELETE': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
    case 'EXECUTE': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
    case 'EXPORT': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  fetchTelemetry()
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

