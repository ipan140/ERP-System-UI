<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white shadow-xs"
      @click="toggleDropdown"
      title="Pusat Notifikasi Enterprise"
    >
      <!-- Unread Count Badge with Ping -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-gray-900"
      >
        <span class="absolute inline-flex w-full h-full bg-rose-400 rounded-full opacity-75 -z-1 animate-ping"></span>
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>

      <!-- Bell Icon -->
      <svg
        class="fill-current w-5 h-5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="dropdownOpen"
      class="absolute -right-12 sm:right-0 mt-3 flex h-[520px] w-[360px] sm:w-[420px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900 z-[9999]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 text-sm">
            🔔
          </span>
          <div>
            <h5 class="text-sm font-bold text-gray-900 dark:text-white">Pusat Aksi & Notifikasi</h5>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ unreadCount }} notifikasi memerlukan perhatian
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-[11px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition"
          >
            Tandai Dibaca
          </button>
          <button
            @click="closeDropdown"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-1 py-2.5 border-b border-gray-100 dark:border-gray-800">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          @click="activeFilter = tab.key"
          :class="activeFilter === tab.key ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 font-bold border-brand-200 dark:border-brand-800' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 border-transparent'"
          class="rounded-lg border px-2.5 py-1 text-[11px] transition flex items-center gap-1"
        >
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count > 0"
            :class="activeFilter === tab.key ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'"
            class="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Notification List -->
      <div class="flex-1 overflow-y-auto space-y-2 py-2 pr-1 custom-scrollbar">
        <div
          v-if="filteredNotifications.length === 0"
          class="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400"
        >
          <div class="text-3xl mb-2">🎉</div>
          <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">Semua Beres!</p>
          <p class="text-[11px] text-gray-400 mt-0.5">Tidak ada notifikasi aktif untuk filter ini.</p>
        </div>

        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          @click="handleNotificationClick(item)"
          :class="[
            item.read ? 'opacity-70 bg-white dark:bg-gray-900 hover:opacity-100' : 'bg-gray-50/80 dark:bg-gray-800/60 border-l-4 ' + item.borderAccent,
            'cursor-pointer rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-all dark:border-gray-800'
          ]"
        >
          <div class="flex items-start gap-3">
            <div class="text-xl p-1.5 rounded-lg shrink-0" :class="item.iconBg">
              {{ item.icon }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <span
                  class="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
                  :class="item.badgeClass"
                >
                  {{ item.module }}
                </span>
                <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ item.time }}</span>
              </div>

              <h4 class="text-xs font-bold text-gray-900 dark:text-white truncate">
                {{ item.title }}
              </h4>

              <p class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                {{ item.desc }}
              </p>

              <div class="flex items-center justify-between mt-2 pt-1 border-t border-gray-100 dark:border-gray-800/80 text-[10px]">
                <span class="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 hover:underline">
                  Buka Modul &rarr;
                </span>
                <span v-if="!item.read" class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Quick Status -->
      <div class="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
        <span class="text-gray-400">Status Gateway: <span class="text-emerald-500 font-semibold">● Terhubung</span></span>
        <button
          @click="resetDemoNotifications"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          title="Muat Ulang Data Notifikasi Contoh"
        >
          ↻ Refresh Notifikasi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

interface EnterpriseNotification {
  id: number
  module: string
  title: string
  desc: string
  time: string
  route: string
  isUrgent: boolean
  read: boolean
  icon: string
  iconBg: string
  borderAccent: string
  badgeClass: string
}

const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const activeFilter = ref<'all' | 'unread' | 'urgent'>('all')

const initialNotifications: EnterpriseNotification[] = [
  {
    id: 1,
    module: 'FINANCE & BUDGET',
    title: 'Pagu Anggaran Dept IT Mendekati Limit (88%)',
    desc: 'Penyerapan anggaran belanja kuartal berjalan tersisa Rp 24.000.000. Waspadai penguncian transaksi hard-lock.',
    time: '10 mnt lalu',
    route: '/finance/budget',
    isUrgent: true,
    read: false,
    icon: '🚨',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600',
    borderAccent: 'border-rose-500',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
  },
  {
    id: 2,
    module: 'SCM / GUDANG',
    title: 'Stok Kritis: SSD NVMe 1TB (Sisa 4 Unit)',
    desc: 'Stok fisik berada di bawah Safety Stock minimum (10 unit). Auto-Restock draf PO siap diproses.',
    time: '25 mnt lalu',
    route: '/supply_chain/inventory',
    isUrgent: true,
    read: false,
    icon: '📦',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600',
    borderAccent: 'border-amber-500',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  },
  {
    id: 3,
    module: 'HR / PAYROLL',
    title: 'Penggajian Massal Siap Diproses (120 Pegawai)',
    desc: 'Perhitungan PPh 21 TER 2024 dan BPJS telah diverifikasi. Menunggu persetujuan Finance Director untuk pelunasan massal.',
    time: '1 jam lalu',
    route: '/hr/payroll',
    isUrgent: false,
    read: false,
    icon: '👥',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600',
    borderAccent: 'border-sky-500',
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300'
  },
  {
    id: 4,
    module: 'PENJUALAN & CRM',
    title: 'Approval Diskon Penawaran 22% (PT Mega Perkasa)',
    desc: 'Sales Order #SO-2026-008 memerlukan otorisasi Direktur Penjualan karena diskon melebihi pagu batas 20%.',
    time: '2 jam lalu',
    route: '/sales/orders',
    isUrgent: true,
    read: false,
    icon: '💼',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600',
    borderAccent: 'border-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
  },
  {
    id: 5,
    module: 'HELPDESK & SLA',
    title: 'Peringatan SLA Tiket #TKT-8842 Klien VIP',
    desc: 'Waktu respons tiket tersisa 18 menit sebelum pelanggaran Service Level Agreement (Tier-1 Urgent).',
    time: '3 jam lalu',
    route: '/services/helpdesk',
    isUrgent: true,
    read: true,
    icon: '🎫',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600',
    borderAccent: 'border-indigo-500',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
  },
  {
    id: 6,
    module: 'PABRIKASI / MO',
    title: 'Work Order Manufaktur #MO-2026-015 Selesai',
    desc: 'Konsumsi bahan baku backflushing 500 unit produk jadi telah dibukukan otomatis ke persediaan gudang.',
    time: '5 jam lalu',
    route: '/supply_chain/manufacturing',
    isUrgent: false,
    read: true,
    icon: '⚙️',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600',
    borderAccent: 'border-purple-500',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
  }
]

const notifications = ref<EnterpriseNotification[]>([...initialNotifications])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const urgentCount = computed(() => notifications.value.filter(n => n.isUrgent && !n.read).length)

const filterTabs = computed(() => [
  { key: 'all' as const, label: 'Semua', count: notifications.value.length },
  { key: 'unread' as const, label: 'Belum Dibaca', count: unreadCount.value },
  { key: 'urgent' as const, label: 'Mendesak / Urgent', count: urgentCount.value }
])

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  if (activeFilter.value === 'urgent') {
    return notifications.value.filter(n => n.isUrgent)
  }
  return notifications.value
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
}

const handleNotificationClick = (item: EnterpriseNotification) => {
  item.read = true
  closeDropdown()
  if (item.route) {
    router.push(item.route)
  }
}

const resetDemoNotifications = () => {
  notifications.value = initialNotifications.map(n => ({ ...n }))
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
