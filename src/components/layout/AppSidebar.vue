<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/" class="flex items-center gap-3">
        <img src="/images/logo/logo-icon.svg" alt="Logo" width="32" height="32" />
        <h1 v-if="isExpanded || isHovered || isMobileOpen" class="text-2xl font-bold text-brand-500 dark:text-white">
          ERP System
        </h1>
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-5">
          <div
            v-for="(menuGroup, groupIndex) in menuGroups"
            :key="groupIndex"
            class="pb-3 border-b border-gray-100 dark:border-gray-800/60 last:border-b-0"
          >
            <h2
              :class="[
                'mb-2 text-[11px] font-bold tracking-wider uppercase flex leading-[20px] text-gray-400 dark:text-gray-500',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-1">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full py-2 text-xs font-semibold rounded-xl transition-all',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" class="w-4 h-4" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text truncate"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-4 h-4 transition-transform duration-200 opacity-60 group-hover:opacity-100',
                      {
                        'rotate-180 text-brand-500 opacity-100': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group py-2 text-xs font-semibold rounded-xl transition-all',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" class="w-4 h-4" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text truncate"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-1 space-y-0.5 ml-5 pl-2.5 border-l-2 border-gray-100 dark:border-gray-800">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item py-1.5 px-2.5 text-xs rounded-lg transition-all flex items-center gap-2',
                            {
                              'menu-dropdown-item-active font-semibold': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          <span
                            class="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
                            :class="isActive(subItem.path) ? 'bg-brand-500 ring-2 ring-brand-500/30 scale-125' : 'bg-gray-300 dark:bg-gray-600'"
                          ></span>
                          <span class="truncate">{{ subItem.name }}</span>
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- Widget removed -->
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
  BarChartIcon,
  UserGroupIcon,
  FolderIcon,
  SettingsIcon,
  TaskIcon,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const menuGroups = [
  {
    title: "PENGATURAN (SETTING)",
    items: [
      { icon: GridIcon, name: "Dashboard Sistem", path: "/core/dashboard" },
      {
        icon: BoxCubeIcon,
        name: "Master Data",
        subItems: [
          { name: "Negara (Countries)", path: "/core/countries", pro: false },
          { name: "Mata Uang (Currencies)", path: "/core/currencies", pro: false },
        ],
      },
      {
        icon: SettingsIcon,
        name: "Sistem & Keamanan",
        subItems: [
          { name: "Peran Pengguna (Roles)", path: "/core/user-roles", pro: false },
          { name: "Hak Akses (Permissions)", path: "/core/permissions", pro: false },
          { name: "Jejak Audit (Audit Trail)", path: "/sys/audit", pro: false },
        ],
      },
      {
        icon: ChatIcon,
        name: "Komunikasi Tim",
        subItems: [
          { name: "Diskusi Internal", path: "/core/discuss", pro: false },
          { name: "Email Server (Mailer)", path: "/core/mailer", pro: false },
          { name: "Telefoni (VoIP)", path: "/core/voip", pro: false },
          { name: "Integrasi WhatsApp", path: "/core/whatsapp", pro: false },
        ],
      },
      {
        icon: DocsIcon,
        name: "Dokumen & Arsip",
        subItems: [
          { name: "Penyimpanan Berkas", path: "/core/storage", pro: false },
          { name: "Manajemen Dokumen", path: "/core/documents", pro: false },
          { name: "Pusat Laporan Sistem", path: "/core/report", pro: false },
        ],
      },
      {
        icon: PlugInIcon,
        name: "Inovasi & Ekstensi",
        subItems: [
          { name: "Pusat Pengetahuan (Wiki)", path: "/core/knowledge", pro: false },
          { name: "Perangkat IoT", path: "/core/iot", pro: false },
          { name: "Kecerdasan Buatan (AI)", path: "/core/ai", pro: false },
        ],
      }
    ],
  },
  {
    title: "HRD & TALENTA",
    items: [
      { icon: GridIcon, name: "Dashboard HRD", path: "/hr/dashboard" },
      { icon: CalenderIcon, name: "Kalender HRD", path: "/hr/calendar" },
      {
        icon: UserGroupIcon,
        name: "Karyawan & Struktur",
        subItems: [
          { name: "Direktori Karyawan", path: "/hr/employees", pro: false },
          { name: "Struktur Organisasi", path: "/hr/org-chart", pro: false },
          { name: "Departemen Perusahaan", path: "/hr/departments", pro: false },
          { name: "Posisi & Jabatan", path: "/hr/job-positions", pro: false },
          { name: "Matriks Keahlian", path: "/hr/skills", pro: false },
          { name: "Rekrutmen & Pelamar", path: "/hr/recruitment", pro: false },
          { name: "Onboarding & Orientasi", path: "/hr/onboarding", pro: false },
          { name: "Kontrak Kerja", path: "/hr/contracts", pro: false },
        ],
      },
      {
        icon: CalenderIcon,
        name: "Waktu & Kehadiran",
        subItems: [
          { name: "Presensi & Absensi", path: "/hr/attendances", pro: false },
          { name: "Jadwal Kerja & Shift", path: "/hr/working-schedules", pro: false },
          { name: "Pengajuan Cuti & Izin", path: "/hr/time-off", pro: false },
          { name: "Lembur (Overtime)", path: "/hr/overtime", pro: false },
        ],
      },
      {
        icon: PieChartIcon,
        name: "Payroll & Kesejahteraan",
        subItems: [
          { name: "Penggajian (Payroll)", path: "/hr/payroll", pro: false },
          { name: "Kalkulator THR Resmi", path: "/hr/thr", pro: false },
          { name: "Kasbon & Pinjaman Karyawan", path: "/hr/loans", pro: false },
          { name: "Klaim & Reimbursement", path: "/hr/expenses", pro: false },
          { name: "Kupon Makan Siang", path: "/hr/lunch", pro: false },
          { name: "Kendaraan Dinas (Fleet)", path: "/hr/fleet", pro: false },
        ],
      },
      {
        icon: ListIcon,
        name: "Kinerja & Portal Mandiri",
        subItems: [
          { name: "Evaluasi Kinerja (KPI)", path: "/hr/appraisals", pro: false },
          { name: "Surat Peringatan (SP)", path: "/hr/warning-letters", pro: false },
          { name: "Portal Karyawan (ESS)", path: "/hr/my-portal", pro: false },
          { name: "Program Referral Kerja", path: "/hr/referrals", pro: false },
        ],
      },
    ],
  },
  {
    title: "PENJUALAN (SALES)",
    items: [
      { icon: GridIcon, name: "Dashboard Penjualan", path: "/sales/dashboard" },
      { icon: CalenderIcon, name: "Kalender Penjualan", path: "/sales/calendar" },
      {
        icon: PlugInIcon,
        name: "Pipeline & Transaksi",
        subItems: [
          { name: "CRM (Leads & Peluang)", path: "/sales/crm", pro: false },
          { name: "Pesanan Penjualan (SO)", path: "/sales/core", pro: false },
          { name: "Kasir (Point of Sale)", path: "/sales/pos", pro: false },
        ],
      },
      {
        icon: TableIcon,
        name: "Kontrak & Langganan",
        subItems: [
          { name: "Layanan Berlangganan", path: "/sales/subscriptions", pro: false },
          { name: "Penyewaan & Rental", path: "/sales/rental", pro: false },
        ],
      }
    ],
  },
  {
    title: "PEMASARAN (MARKETING)",
    items: [
      { icon: GridIcon, name: "Dashboard Pemasaran", path: "/marketing/dashboard" },
      { icon: CalenderIcon, name: "Kalender Pemasaran", path: "/marketing/calendar" },
      {
        icon: MailIcon,
        name: "Kampanye & Broadcast",
        subItems: [
          { name: "Otomatisasi Pemasaran", path: "/marketing/automation", pro: false },
          { name: "Email Massal (Newsletter)", path: "/marketing/mass-mailing", pro: false },
          { name: "Pemasaran SMS", path: "/marketing/sms-marketing", pro: false },
          { name: "Manajemen Media Sosial", path: "/marketing/social-marketing", pro: false },
        ],
      },
      {
        icon: TaskIcon,
        name: "Event & Riset Audiens",
        subItems: [
          { name: "Manajemen Event & Acara", path: "/marketing/events", pro: false },
          { name: "Survei & Riset Kepuasan", path: "/marketing/surveys", pro: false },
        ],
      }
    ],
  },
  {
    title: "LAYANAN (SERVICES)",
    items: [
      { icon: GridIcon, name: "Dashboard Layanan", path: "/services/dashboard" },
      { icon: CalenderIcon, name: "Kalender Layanan", path: "/services/calendar" },
      {
        icon: TaskIcon,
        name: "Proyek & Waktu Kerja",
        subItems: [
          { name: "Manajemen Proyek", path: "/services/project", pro: false },
          { name: "Perencanaan Tim (Planning)", path: "/services/planning", pro: false },
          { name: "Lembar Waktu (Timesheets)", path: "/services/timesheets", pro: false },
        ],
      },
      {
        icon: UserCircleIcon,
        name: "Bantuan & Dukungan Teknis",
        subItems: [
          { name: "Pusat Bantuan (Helpdesk)", path: "/services/helpdesk", pro: false },
          { name: "Layanan Lapangan (Field Service)", path: "/services/field_service", pro: false },
          { name: "Pemesanan Janji Temu", path: "/services/appointments", pro: false },
          { name: "Reparasi & Servis", path: "/services/repairs", pro: false },
        ],
      }
    ],
  },
  {
    title: "RANTAI PASOK (SUPPLY CHAIN)",
    items: [
      { icon: GridIcon, name: "Dashboard Rantai Pasok", path: "/supply_chain/dashboard" },
      { icon: CalenderIcon, name: "Kalender Rantai Pasok", path: "/supply_chain/calendar" },
      {
        icon: BoxCubeIcon,
        name: "Inventaris & Pengadaan",
        subItems: [
          { name: "Gudang & Stok Barang", path: "/supply_chain/inventory", pro: false },
          { name: "Pembelian Bahan (PO)", path: "/supply_chain/purchase", pro: false },
          { name: "Pemindai Barcode", path: "/supply_chain/barcode", pro: false },
        ],
      },
      {
        icon: SettingsIcon,
        name: "Manufaktur & Mutu",
        subItems: [
          { name: "Perintah Produksi (MO)", path: "/supply_chain/manufacturing", pro: false },
          { name: "Siklus Produk (PLM)", path: "/supply_chain/plm", pro: false },
          { name: "Kendali Mutu (QC)", path: "/supply_chain/quality", pro: false },
          { name: "Pemeliharaan Mesin", path: "/supply_chain/maintenance", pro: false },
        ],
      }
    ],
  },
  {
    title: "KEUANGAN & AKUNTANSI (FINANCE)",
    items: [
      { icon: GridIcon, name: "Dashboard Keuangan", path: "/finance/dashboard" },
      { icon: CalenderIcon, name: "Kalender Keuangan", path: "/finance/calendar" },
      {
        icon: TableIcon,
        name: "Operasional & Penagihan",
        subItems: [
          { name: "Faktur & Tagihan (Invoicing)", path: "/finance/invoicing", pro: false },
          { name: "Master Rekanan & Bank", path: "/finance/partners", pro: false },
          { name: "Rekonsiliasi Bank Otomatis", path: "/finance/reconciliation", pro: false },
          { name: "Klaim Pengeluaran Staf", path: "/finance/expenses", pro: false },
        ],
      },
      {
        icon: BarChartIcon,
        name: "Buku Besar & Anggaran",
        subItems: [
          { name: "Bagan Akun (COA) & Jurnal", path: "/finance/accounting", pro: false },
          { name: "Kontrol Anggaran (Budget)", path: "/finance/budget", pro: false },
          { name: "Aset Tetap & Depresiasi", path: "/finance/assets", pro: false },
          { name: "Konsolidasi Laporan Grup", path: "/finance/consolidation", pro: false },
        ],
      },
      {
        icon: DocsIcon,
        name: "Laporan, Pajak & Approval",
        subItems: [
          { name: "Laporan Keuangan Standar SAK", path: "/finance/reports", pro: false },
          { name: "Pajak Indonesia (PPh & PPN)", path: "/finance/tax", pro: false },
          { name: "Spreadsheet & Business BI", path: "/finance/spreadsheet_bi", pro: false },
          { name: "Arsip Dokumen Finansial", path: "/finance/documents", pro: false },
          { name: "Tanda Tangan Digital Legal", path: "/finance/sign", pro: false },
          { name: "Jalur Persetujuan (Approval)", path: "/finance/approvals", pro: false },
        ],
      }
    ],
  },
  {
    title: "WEBSITE & PORTAL",
    items: [
      { icon: GridIcon, name: "Dashboard Website", path: "/website/dashboard" },
      { icon: CalenderIcon, name: "Kalender Website", path: "/website/calendar" },
      {
        icon: GridIcon,
        name: "Situs Web & Konten",
        subItems: [
          { name: "Website Builder CMS", path: "/website/website_builder", pro: false },
          { name: "Toko Online (eCommerce)", path: "/website/ecommerce", pro: false },
          { name: "Blog & Artikel SEO", path: "/website/blog", pro: false },
          { name: "Corporate e-Learning", path: "/website/elearning", pro: false },
        ],
      },
      {
        icon: UserGroupIcon,
        name: "Portal Publik & Komunitas",
        subItems: [
          { name: "Portal Mitra Rekanan B2B", path: "/website/partner-portal", pro: false },
          { name: "Portal Karir & Rekrutmen", path: "/website/careers", pro: false },
          { name: "Forum Komunitas", path: "/website/forum", pro: false },
          { name: "Live Chat Pengunjung", path: "/website/live_chat", pro: false },
          { name: "Whistleblowing System (WBS)", path: "/website/whistleblowing", pro: false },
        ],
      }
    ],
  }
];

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
