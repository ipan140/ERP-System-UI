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
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
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
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
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
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
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
                    'menu-item group',
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
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
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
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
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
      { icon: GridIcon, name: "Dashboard", path: "/core/dashboard" },
      
      {
        icon: BoxCubeIcon,
        name: "Master Data",
        subItems: [
          { name: "Countries", path: "/core/countries", pro: false },
          { name: "Currencies", path: "/core/currencies", pro: false },
        ],
      },
      {
        icon: UserCircleIcon,
        name: "Sistem & Keamanan",
        subItems: [
          { name: "User Roles", path: "/core/user-roles", pro: false },
          { name: "Permissions", path: "/core/permissions", pro: false },
          { name: "Jejak Audit", path: "/sys/audit", pro: false },
        ],
      },
      {
        icon: ChatIcon,
        name: "Communications",
        subItems: [
          { name: "Discuss", path: "/core/discuss", pro: false },
          { name: "Mailer", path: "/core/mailer", pro: false },
          { name: "VoIP", path: "/core/voip", pro: false },
          { name: "WhatsApp", path: "/core/whatsapp", pro: false },
        ],
      },
      {
        icon: DocsIcon,
        name: "Documents",
        subItems: [
          { name: "Storage", path: "/core/storage", pro: false },
          { name: "Documents", path: "/core/documents", pro: false },
          { name: "Report", path: "/core/report", pro: false },
        ],
      },
      {
        icon: PlugInIcon,
        name: "Advanced Features",
        subItems: [
          { name: "Knowledge (Wiki)", path: "/core/knowledge", pro: false },
          { name: "IoT", path: "/core/iot", pro: false },
          { name: "AI Prompts", path: "/core/ai", pro: false },
        ],
      }
    ],
  },
  {
    title: "HRD & MANAJEMEN",
    items: [
      { icon: GridIcon, name: "Dashboard HRD", path: "/hr/dashboard" },
      { icon: CalenderIcon, name: "Kalender HRD", path: "/hr/calendar" },
      {
        icon: UserCircleIcon,
        name: "Data Induk",
        subItems: [
          { name: "Departments", path: "/hr/departments", pro: false },
          { name: "Job Positions", path: "/hr/job-positions", pro: false },
            { name: "Skills", path: "/hr/skills", pro: false },
          { name: "Employees", path: "/hr/employees", pro: false },
            { name: "Org Chart", path: "/hr/org-chart", pro: false },
            { name: "Surat Peringatan", path: "/hr/warning-letters", pro: false },
            { name: "Onboarding & Offboarding", path: "/hr/onboarding", pro: false },
            { name: "Lembur", path: "/hr/overtime", pro: false },
            { name: "Kasbon / Pinjaman", path: "/hr/loans", pro: false },
            { name: "Reimbursement", path: "/hr/expenses", pro: false },
            { name: "Contracts", path: "/hr/contracts", pro: false },
          { name: "Recruitment", path: "/hr/recruitment", pro: false },
        ],
      },
      {
        icon: CalenderIcon,
        name: "Kehadiran",
        subItems: [
          { name: "Attendances", path: "/hr/attendances", pro: false },
            { name: "Working Schedules", path: "/hr/working-schedules", pro: false },
          { name: "Time Off", path: "/hr/time-off", pro: false },
        ],
      },
      {
        icon: ListIcon,
        name: "Kinerja & Reward",
        subItems: [
          { name: "Appraisals", path: "/hr/appraisals", pro: false },
          { name: "Referrals", path: "/hr/referrals", pro: false },
        ],
      },
      {
        icon: PieChartIcon,
        name: "Benefit & Gaji",
        subItems: [
          { name: "Payroll", path: "/hr/payroll", pro: false },
          { name: "Lunch", path: "/hr/lunch", pro: false },
          { name: "Fleet (Kendaraan)", path: "/hr/fleet", pro: false },
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
        name: "Penjualan (Sales)",
        subItems: [
          { name: "CRM (Leads)", path: "/sales/crm", pro: false },
          { name: "Pesanan Penjualan", path: "/sales/core", pro: false },
          { name: "Point of Sale", path: "/sales/pos", pro: false },
          { name: "Langganan", path: "/sales/subscriptions", pro: false },
          { name: "Penyewaan", path: "/sales/rental", pro: false },
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
        name: "Pemasaran (Marketing)",
        subItems: [
          { name: "Otomatisasi", path: "/marketing/automation", pro: false },
          { name: "Email Massal", path: "/marketing/mass-mailing", pro: false },
          { name: "Pemasaran SMS", path: "/marketing/sms-marketing", pro: false },
          { name: "Media Sosial", path: "/marketing/social-marketing", pro: false },
          { name: "Manajemen Acara", path: "/marketing/events", pro: false },
          { name: "Survei", path: "/marketing/surveys", pro: false },
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
        icon: UserCircleIcon,
        name: "Layanan (Services)",
        subItems: [
          { name: "Pemesanan Jadwal", path: "/services/appointments", pro: false },
          { name: "Layanan Lapangan", path: "/services/field_service", pro: false },
          { name: "Helpdesk", path: "/services/helpdesk", pro: false },
          { name: "Perencanaan", path: "/services/planning", pro: false },
          { name: "Manajemen Proyek", path: "/services/project", pro: false },
          { name: "Reparasi", path: "/services/repairs", pro: false },
          { name: "Pencatatan Waktu", path: "/services/timesheets", pro: false },
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
        name: "Rantai Pasok (Supply)",
        subItems: [
          { name: "Sistem Barcode", path: "/supply_chain/barcode", pro: false },
          { name: "Gudang & Stok", path: "/supply_chain/inventory", pro: false },
          { name: "Pemeliharaan", path: "/supply_chain/maintenance", pro: false },
          { name: "Produksi", path: "/supply_chain/manufacturing", pro: false },
          { name: "PLM", path: "/supply_chain/plm", pro: false },
          { name: "Pembelian (PO)", path: "/supply_chain/purchase", pro: false },
          { name: "Kontrol Kualitas", path: "/supply_chain/quality", pro: false },
        ],
      }
    ],
  },
  {
    title: "KEUANGAN (FINANCE)",
    items: [
      { icon: GridIcon, name: "Dashboard Keuangan", path: "/finance/dashboard" },
      { icon: CalenderIcon, name: "Kalender Keuangan", path: "/finance/calendar" },
      {
        icon: PieChartIcon,
        name: "Keuangan (Finance)",
        subItems: [
          { name: "Faktur & Tagihan", path: "/finance/invoicing", pro: false },
          { name: "Klaim Pengeluaran", path: "/finance/expenses", pro: false },
          { name: "Akuntansi & Pajak", path: "/finance/accounting", pro: false },
          { name: "Persetujuan", path: "/finance/approvals", pro: false },
          { name: "Tanda Tangan Digital", path: "/finance/sign", pro: false },
          { name: "Konsolidasi", path: "/finance/consolidation", pro: false },
          { name: "Business Intelligence", path: "/finance/spreadsheet_bi", pro: false },
          { name: "Dokumen Keuangan", path: "/finance/documents", pro: false },
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
        name: "Website & Portal",
        subItems: [
          { name: "Toko Online", path: "/website/ecommerce", pro: false },
          { name: "Blog & Artikel", path: "/website/blog", pro: false },
          { name: "Website Builder", path: "/website/website_builder", pro: false },
          { name: "e-Learning", path: "/website/elearning", pro: false },
          { name: "Forum Komunitas", path: "/website/forum", pro: false },
          { name: "Live Chat", path: "/website/live_chat", pro: false },
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
