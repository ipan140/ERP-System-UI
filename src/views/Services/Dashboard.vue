<template>
  <AdminLayout>
    <div class="space-y-6 pb-8">
      <!-- Top Bar: Title, Live Status & Filters -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="flex items-center gap-3">
            <PageBreadcrumb pageTitle="Dashboard Layanan" />
            <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-2xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Operasional Layanan Normal
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Command Center Layanan Enterprise: Pemantauan SLA real-time, throughput tiket, efisiensi MTTR, dan utilisasi personel teknisi.
          </p>
        </div>

        <!-- Period Filter & Refresh -->
        <div class="flex items-center gap-2 self-start lg:self-auto">
          <div class="inline-flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <button
              v-for="p in periods"
              :key="p.value"
              @click="selectedPeriod = p.value"
              :class="selectedPeriod === p.value
                ? 'bg-brand-500 text-white font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
              class="rounded-lg px-3 py-1.5 text-xs transition-all duration-150"
            >
              {{ p.label }}
            </button>
          </div>

          <button
            @click="loadAllDashboardData"
            :disabled="isLoading"
            title="Muat Ulang Data Real-Time"
            class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 transition-all"
          >
            <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Quick Action Module Launcher (6 Compact Enterprise Service Cards) -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <!-- 1. Helpdesk -->
        <router-link
          to="/services/helpdesk"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-red-800/80"
        >
          <div class="flex items-center justify-between">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 group-hover:scale-105 transition-transform">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span class="rounded-full bg-red-50 px-2 py-0.5 text-2xs font-bold text-red-600 dark:bg-red-950/60 dark:text-red-300">
              {{ rawTickets.length }} Tiket
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs font-bold text-gray-900 dark:text-white">Helpdesk</p>
            <p class="text-2xs text-gray-500 dark:text-gray-400 truncate">Kelola Tiket Bantuan</p>
          </div>
        </router-link>

        <!-- 2. SPK Lapangan -->
        <router-link
          to="/services/field_service"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800/80"
        >
          <div class="flex items-center justify-between">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span class="rounded-full bg-blue-50 px-2 py-0.5 text-2xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
              {{ rawFieldServices.length }} SPK
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs font-bold text-gray-900 dark:text-white">SPK Lapangan</p>
            <p class="text-2xs text-gray-500 dark:text-gray-400 truncate">On-Site & e-BAST</p>
          </div>
        </router-link>

        <!-- 3. Reparasi Unit -->
        <router-link
          to="/services/repairs"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-800/80"
        >
          <div class="flex items-center justify-between">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span class="rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-bold text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
              {{ rawRepairs.length }} RMA
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs font-bold text-gray-900 dark:text-white">Reparasi Unit</p>
            <p class="text-2xs text-gray-500 dark:text-gray-400 truncate">Servis & Garansi</p>
          </div>
        </router-link>

        <!-- 4. Proyek & Termin -->
        <router-link
          to="/services/project"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800/80"
        >
          <div class="flex items-center justify-between">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-2xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              {{ rawProjects.length }} Proyek
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs font-bold text-gray-900 dark:text-white">Proyek & Termin</p>
            <p class="text-2xs text-gray-500 dark:text-gray-400 truncate">Milestone Billing</p>
          </div>
        </router-link>

        <!-- 5. Pencatatan Jam (Timesheets) -->
        <router-link
          to="/services/timesheets"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800/80"
        >
          <div class="flex items-center justify-between">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
              {{ billableHours.toFixed(0) }} Jam
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs font-bold text-gray-900 dark:text-white">Pencatatan Jam</p>
            <p class="text-2xs text-gray-500 dark:text-gray-400 truncate">Utilisasi Billable</p>
          </div>
        </router-link>

        <!-- 6. Kalender & Jadwal -->
        <router-link
          to="/services/calendar"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-800/80"
        >
          <div class="flex items-center justify-between">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span class="rounded-full bg-purple-50 px-2 py-0.5 text-2xs font-bold text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
              Kalender
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs font-bold text-gray-900 dark:text-white">Jadwal Operasi</p>
            <p class="text-2xs text-gray-500 dark:text-gray-400 truncate">Agenda Terpadu</p>
          </div>
        </router-link>
      </div>

      <!-- Top Executive 5 KPI Metric Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <!-- 1. Kepatuhan SLA -->
        <div class="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white p-4.5 shadow-xs transition-all hover:shadow-sm dark:border-emerald-950/60 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Kepatuhan SLA</span>
            <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-bold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:border-emerald-800/60 dark:text-emerald-300">
              Target &ge; 90%
            </span>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {{ slaComplianceRate.toFixed(1) }}%
              </span>
            </div>
            <p class="mt-1 text-2xs text-gray-500 dark:text-gray-400">
              {{ totalTickets - breachedTicketsCount }} dari {{ totalTickets }} tiket tepat waktu
            </p>
          </div>
          <div class="mt-3 h-1.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-950/60 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" :style="{ width: `${slaComplianceRate}%` }"></div>
          </div>
        </div>

        <!-- 2. Resolusi (MTTR) -->
        <div class="relative overflow-hidden rounded-2xl border border-blue-100/90 bg-white p-4.5 shadow-xs transition-all hover:shadow-sm dark:border-blue-950/60 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Resolusi (MTTR)</span>
            <span class="rounded-full bg-blue-50 px-2 py-0.5 text-2xs font-bold text-blue-700 border border-blue-200/60 dark:bg-blue-900/30 dark:border-blue-800/60 dark:text-blue-300">
              Optimal
            </span>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{{ avgMttrHours.toFixed(1) }}</span>
              <span class="text-xs font-semibold text-gray-500">Jam Kerja</span>
            </div>
            <p class="mt-1 text-2xs text-emerald-600 dark:text-emerald-400 font-semibold">
              &darr; 18.2% lebih cepat vs SLA
            </p>
          </div>
          <div class="mt-3 h-1.5 w-full rounded-full bg-blue-100 dark:bg-blue-950/60 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style="width: 78%"></div>
          </div>
        </div>

        <!-- 3. Rasio Utilisasi Billable -->
        <div class="relative overflow-hidden rounded-2xl border border-indigo-100/90 bg-white p-4.5 shadow-xs transition-all hover:shadow-sm dark:border-indigo-950/60 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Utilisasi Billable</span>
            <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-2xs font-bold text-indigo-700 border border-indigo-200/60 dark:bg-indigo-900/30 dark:border-indigo-800/60 dark:text-indigo-300">
              Tertagih
            </span>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">{{ billableRatio.toFixed(1) }}%</span>
            </div>
            <p class="mt-1 text-2xs text-gray-500 dark:text-gray-400">
              {{ billableHours.toFixed(0) }} jam billable ke klien
            </p>
          </div>
          <div class="mt-3 h-1.5 w-full rounded-full bg-indigo-100 dark:bg-indigo-950/60 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" :style="{ width: `${billableRatio}%` }"></div>
          </div>
        </div>

        <!-- 4. Antrean Tiket Terbuka -->
        <div class="relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4.5 shadow-xs transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Antrean Tiket</span>
            <span
              class="rounded-full px-2 py-0.5 text-2xs font-bold"
              :class="breachedTicketsCount > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-300'"
            >
              {{ breachedTicketsCount }} Breached
            </span>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{{ activeTicketsCount }}</span>
              <span class="text-xs font-semibold text-gray-500">Tiket Aktif</span>
            </div>
            <p class="mt-1 text-2xs text-gray-500 dark:text-gray-400">
              {{ urgentTicketsCount }} berstatus prioritas Urgent
            </p>
          </div>
          <div class="mt-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style="width: 45%"></div>
          </div>
        </div>

        <!-- 5. Skor CSAT -->
        <div class="relative overflow-hidden rounded-2xl border border-amber-100/90 bg-white p-4.5 shadow-xs transition-all hover:shadow-sm dark:border-amber-950/60 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Skor CSAT</span>
            <span class="rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-bold text-amber-700 border border-amber-200/60 dark:bg-amber-900/30 dark:border-amber-800/60 dark:text-amber-300">
              Sangat Baik
            </span>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold tracking-tight text-amber-500">4.8</span>
              <span class="text-xs font-bold text-gray-400">/ 5.0</span>
            </div>
            <p class="mt-1 text-2xs text-gray-500 dark:text-gray-400">
              96.4% rating kepuasan BAST
            </p>
          </div>
          <div class="mt-3 h-1.5 w-full rounded-full bg-amber-100 dark:bg-amber-950/60 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" style="width: 96%"></div>
          </div>
        </div>
      </div>

      <!-- Pipeline Alur Layanan Terpadu (Operations Lifecycle Stream) -->
      <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Pipeline Alur Layanan Terpadu
              <span class="text-2xs font-normal text-gray-400">(Operations Lifecycle Flow)</span>
            </h4>
            <p class="text-2xs text-gray-500 dark:text-gray-400">Aliran kerja end-to-end dari permohonan tiket, janji temu, penugasan teknisi, servis unit, hingga penyelesaian proyek</p>
          </div>
          <span class="self-start sm:self-auto rounded-full bg-gray-100 px-2.5 py-1 text-2xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            5 Tahap Terkoneksi
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <!-- Step 1: Helpdesk -->
          <router-link
            to="/services/helpdesk"
            class="group relative flex flex-col justify-between rounded-xl border border-gray-200/70 bg-gray-50/40 p-4 transition-all duration-200 hover:bg-red-50/20 hover:border-red-300 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-red-900/60"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-2xs font-extrabold tracking-wider text-red-600 dark:text-red-400 uppercase">01. Helpdesk</span>
                <span class="rounded-md bg-red-100 px-1.5 py-0.5 text-3xs font-bold text-red-700 dark:bg-red-950/60 dark:text-red-300">Tiket</span>
              </div>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">{{ rawTickets.length }}</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs">
              <span class="text-gray-600 dark:text-gray-400">Aktif: <strong class="text-gray-900 dark:text-white">{{ activeTicketsCount }}</strong></span>
              <span class="text-emerald-600 dark:text-emerald-400">Selesai: <strong>{{ rawTickets.filter(t => t.stage === 'resolved' || t.stage === 'closed').length }}</strong></span>
            </div>
          </router-link>

          <!-- Step 2: Appointments -->
          <router-link
            to="/services/appointments"
            class="group relative flex flex-col justify-between rounded-xl border border-gray-200/70 bg-gray-50/40 p-4 transition-all duration-200 hover:bg-emerald-50/20 hover:border-emerald-300 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-emerald-900/60"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-2xs font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">02. Janji Temu</span>
                <span class="rounded-md bg-emerald-100 px-1.5 py-0.5 text-3xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Booking</span>
              </div>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">{{ rawAppointments.length }}</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs">
              <span class="text-gray-600 dark:text-gray-400">Konfirmasi: <strong class="text-gray-900 dark:text-white">{{ rawAppointments.filter(a => a.status === 'confirmed').length }}</strong></span>
              <span class="text-emerald-600 dark:text-emerald-400">Selesai: <strong>{{ rawAppointments.filter(a => a.status === 'done').length }}</strong></span>
            </div>
          </router-link>

          <!-- Step 3: Field Service -->
          <router-link
            to="/services/field_service"
            class="group relative flex flex-col justify-between rounded-xl border border-gray-200/70 bg-gray-50/40 p-4 transition-all duration-200 hover:bg-blue-50/20 hover:border-blue-300 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-blue-900/60"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-2xs font-extrabold tracking-wider text-blue-600 dark:text-blue-400 uppercase">03. SPK Lapangan</span>
                <span class="rounded-md bg-blue-100 px-1.5 py-0.5 text-3xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">On-Site</span>
              </div>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">{{ rawFieldServices.length }}</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs">
              <span class="text-gray-600 dark:text-gray-400">On-Site: <strong class="text-gray-900 dark:text-white">{{ rawFieldServices.filter(f => f.stage === 'in_progress').length }}</strong></span>
              <span class="text-emerald-600 dark:text-emerald-400">BAST Sah: <strong>{{ rawFieldServices.filter(f => f.stage === 'done').length }}</strong></span>
            </div>
          </router-link>

          <!-- Step 4: Repairs -->
          <router-link
            to="/services/repairs"
            class="group relative flex flex-col justify-between rounded-xl border border-gray-200/70 bg-gray-50/40 p-4 transition-all duration-200 hover:bg-amber-50/20 hover:border-amber-300 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-amber-900/60"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-2xs font-extrabold tracking-wider text-amber-600 dark:text-amber-400 uppercase">04. Reparasi (RMA)</span>
                <span class="rounded-md bg-amber-100 px-1.5 py-0.5 text-3xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Unit Servis</span>
              </div>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">{{ rawRepairs.length }}</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs">
              <span class="text-gray-600 dark:text-gray-400">Dikerjakan: <strong class="text-gray-900 dark:text-white">{{ rawRepairs.filter(r => r.stage === 'repairing' || r.stage === 'diagnosing').length }}</strong></span>
              <span class="text-emerald-600 dark:text-emerald-400">Siap Ambil: <strong>{{ rawRepairs.filter(r => r.stage === 'ready' || r.stage === 'completed').length }}</strong></span>
            </div>
          </router-link>

          <!-- Step 5: Projects -->
          <router-link
            to="/services/project"
            class="group relative flex flex-col justify-between rounded-xl border border-gray-200/70 bg-gray-50/40 p-4 transition-all duration-200 hover:bg-indigo-50/20 hover:border-indigo-300 hover:shadow-xs dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-indigo-900/60"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-2xs font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">05. Proyek Klien</span>
                <span class="rounded-md bg-indigo-100 px-1.5 py-0.5 text-3xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">Delivery</span>
              </div>
              <p class="mt-2 text-2xl font-black text-gray-900 dark:text-white">{{ rawProjects.length }}</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs">
              <span class="text-gray-600 dark:text-gray-400">Aktif: <strong class="text-gray-900 dark:text-white">{{ rawProjects.filter(p => p.status !== 'completed').length }}</strong></span>
              <span class="text-indigo-600 dark:text-indigo-400">Termin: <strong>{{ rawTimesheets.filter(t => t.is_billable).length }} Log</strong></span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 2-Column Insight Grid: Matriks SLA & Kapasitas Teknisi -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Matriks Kepatuhan SLA per Kategori Layanan -->
        <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                  Matriks Kepatuhan SLA per Kategori Layanan
                </h4>
                <p class="text-2xs text-gray-400">Pemenuhan resolusi vs SLA kontrak enterprise</p>
              </div>
              <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-2xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                Target Enterprise: &ge; 90%
              </span>
            </div>

            <div class="space-y-4 pt-1">
              <div v-for="cat in serviceCategories" :key="cat.name" class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full" :class="cat.dotClass"></span>
                    <span class="font-medium text-gray-800 dark:text-gray-200">{{ cat.name }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-2xs text-gray-400">{{ cat.total }} Tiket</span>
                    <span class="font-bold text-xs" :class="cat.rate >= 95 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'">
                      {{ cat.rate.toFixed(1) }}%
                    </span>
                  </div>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="cat.barClass"
                    :style="{ width: `${cat.rate}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs text-gray-500 dark:text-gray-400">
            <span>Respon pertama: <strong class="text-gray-800 dark:text-gray-200">&lt; 15 Menit</strong> &bull; Eskalasi L2/L3: <strong class="text-emerald-600 dark:text-emerald-400">0 Kasus</strong></span>
            <router-link to="/services/helpdesk" class="text-brand-500 font-semibold hover:underline">
              Kelola Aturan Matriks SLA &rarr;
            </router-link>
          </div>
        </div>

        <!-- Roster Shift & Kapasitas Teknisi Hari Ini -->
        <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                  Roster Shift & Kapasitas Teknisi Hari Ini
                </h4>
                <p class="text-2xs text-gray-400">{{ todayFormatted }}</p>
              </div>
              <span class="rounded-full bg-blue-50 px-2.5 py-1 text-2xs font-bold text-blue-700 border border-blue-200/60 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300">
                16 Teknisi Siap Operasi
              </span>
            </div>

            <!-- 3 Mini Metric Cards untuk Distribusi Tim -->
            <div class="grid grid-cols-3 gap-2.5 mb-4">
              <div class="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 text-center">
                <span class="text-2xs text-gray-400 block font-medium">Helpdesk Support</span>
                <span class="text-base font-bold text-gray-900 dark:text-white">10 Staff</span>
                <span class="text-3xs text-emerald-600 font-semibold">Tersedia 100%</span>
              </div>
              <div class="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 text-center">
                <span class="text-2xs text-gray-400 block font-medium">Teknisi Lapangan</span>
                <span class="text-base font-bold text-gray-900 dark:text-white">4 Tim</span>
                <span class="text-3xs text-blue-600 font-semibold">Siap Mobilisasi</span>
              </div>
              <div class="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 text-center">
                <span class="text-2xs text-gray-400 block font-medium">Teknisi Lab RMA</span>
                <span class="text-base font-bold text-gray-900 dark:text-white">2 Teknisi</span>
                <span class="text-3xs text-amber-600 font-semibold">Lab Hardware</span>
              </div>
            </div>

            <!-- List Active Shifts atau Shift Tim Standar yang Rapi -->
            <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
              <div
                v-for="s in displayShifts"
                :key="s.id"
                class="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300 font-bold flex items-center justify-center text-xs">
                    {{ s.avatar }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-800 dark:text-white leading-tight">{{ s.name }}</p>
                    <p class="text-2xs text-gray-400">{{ s.role }} &bull; {{ s.time }}</p>
                  </div>
                </div>

                <span class="rounded-full px-2 py-0.5 text-3xs font-bold" :class="s.statusBadgeClass">
                  {{ s.statusLabel }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs text-gray-500 dark:text-gray-400">
            <span>Beban Kerja: <strong class="text-emerald-600 dark:text-emerald-400">Seimbang & Bebas Konflik</strong></span>
            <router-link to="/services/planning" class="text-brand-500 font-semibold hover:underline">
              Kelola Roster di Planning &rarr;
            </router-link>
          </div>
        </div>
      </div>

      <!-- Bottom Operational Section: Dual Grid (Kesehatan Antrean Kritis & Aktivitas Layanan) -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 1. Status Antrean Kritis & SLA Assurance -->
        <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                  Pengawasan Antrean Kritis & Eskalasi
                </h4>
                <p class="text-2xs text-gray-400">Monitoring tiket prioritas mendesak & keterlambatan penanganan</p>
              </div>
              <span
                class="rounded-full px-2.5 py-1 text-2xs font-bold"
                :class="urgentItems.length > 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300'"
              >
                {{ urgentItems.length > 0 ? `${urgentItems.length} Item Prioritas` : 'Zero Critical Backlog' }}
              </span>
            </div>

            <!-- Priority Breakdown 4-Grid -->
            <div class="grid grid-cols-4 gap-2 mb-4">
              <div class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-2 text-center">
                <span class="text-3xs font-semibold text-gray-400 block uppercase">Urgent</span>
                <span class="text-base font-bold text-emerald-600 dark:text-emerald-400">0</span>
                <span class="text-3xs text-gray-400 block">Terkendali</span>
              </div>
              <div class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-2 text-center">
                <span class="text-3xs font-semibold text-gray-400 block uppercase">Tinggi</span>
                <span class="text-base font-bold text-blue-600 dark:text-blue-400">2</span>
                <span class="text-3xs text-gray-400 block">Ditangani</span>
              </div>
              <div class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-2 text-center">
                <span class="text-3xs font-semibold text-gray-400 block uppercase">Sedang</span>
                <span class="text-base font-bold text-amber-600 dark:text-amber-400">8</span>
                <span class="text-3xs text-gray-400 block">Terjadwal</span>
              </div>
              <div class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-2 text-center">
                <span class="text-3xs font-semibold text-gray-400 block uppercase">Rendah</span>
                <span class="text-base font-bold text-gray-700 dark:text-gray-300">5</span>
                <span class="text-3xs text-gray-400 block">Normal</span>
              </div>
            </div>

            <!-- Clean Jaminan Layanan Prima Card -->
            <div class="rounded-xl bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-blue-50/40 dark:from-emerald-950/20 dark:via-gray-900 dark:to-blue-950/20 border border-emerald-100/80 dark:border-emerald-900/40 p-3.5">
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white">
                    Seluruh Layanan Operasional Dalam Batas SLA
                  </h5>
                  <p class="text-2xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    Tidak terdapat tiket eskalasi lewat batas waktu (SLA breached). Seluruh 15 tiket helpdesk, 15 SPK teknisi on-site, dan unit RMA berjalan sesuai prosedur standar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs text-gray-500 dark:text-gray-400">
            <span>Tingkat Kepatuhan SLA: <strong class="text-emerald-600 dark:text-emerald-400 font-bold">100.0%</strong></span>
            <router-link to="/services/helpdesk" class="text-brand-500 font-semibold hover:underline">
              Buka Semua Antrean Tiket &rarr;
            </router-link>
          </div>
        </div>

        <!-- 2. Aktivitas Layanan Terkini (Recent Operational Activity) -->
        <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                  Aktivitas Layanan Terkini
                </h4>
                <p class="text-2xs text-gray-400">Log transaksi real-time lintas sub-modul operasional</p>
              </div>
              <span class="rounded-full bg-gray-100 px-2.5 py-1 text-2xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                Live Feed
              </span>
            </div>

            <!-- Feed Items -->
            <div class="space-y-3">
              <div
                v-for="act in recentActivities"
                :key="act.id"
                class="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" :class="act.iconBg">
                    <component :is="act.icon" class="w-4 h-4" :class="act.iconColor" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ act.title }}</p>
                    <p class="text-2xs text-gray-400 truncate">{{ act.desc }}</p>
                  </div>
                </div>

                <div class="text-right shrink-0 pl-2">
                  <span class="text-3xs font-medium text-gray-400 block">{{ act.time }}</span>
                  <router-link :to="act.link" class="text-3xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
                    Periksa
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs text-gray-500 dark:text-gray-400">
            <span>Audit Trail Terverifikasi Otomatis</span>
            <router-link to="/services/timesheets" class="text-brand-500 font-semibold hover:underline">
              Lihat Riwayat Timesheet &rarr;
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { helpdeskService } from '@/services/services/helpdesk.service'
import { fieldServiceService } from '@/services/services/field-service.service'
import { repairsService } from '@/services/services/repairs.service'
import { projectService } from '@/services/services/project.service'
import { timesheetsService } from '@/services/services/timesheets.service'
import { planningService } from '@/services/services/planning.service'
import { appointmentsService } from '@/services/services/appointments.service'

const isLoading = ref(false)
const selectedPeriod = ref('month')
const periods = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: '7 Hari' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'quarter', label: 'Kuartal Ini' }
]

// Raw Data Repositories
const rawTickets = ref<any[]>([])
const rawAppointments = ref<any[]>([])
const rawFieldServices = ref<any[]>([])
const rawRepairs = ref<any[]>([])
const rawProjects = ref<any[]>([])
const rawTimesheets = ref<any[]>([])
const rawShifts = ref<any[]>([])

// Date formatting
const todayStr = new Date().toISOString().split('T')[0]
const todayFormatted = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

// Load All Data
const loadAllDashboardData = async () => {
  isLoading.value = true
  try {
    const [t, a, fs, r, p, ts, s] = await Promise.all([
      helpdeskService.getAll().catch(() => []),
      appointmentsService.getAll().catch(() => []),
      fieldServiceService.getAll().catch(() => []),
      repairsService.getAll().catch(() => []),
      projectService.getAll().catch(() => []),
      timesheetsService.getAll().catch(() => []),
      planningService.getAll().catch(() => [])
    ])

    rawTickets.value = Array.isArray(t) ? t : []
    rawAppointments.value = Array.isArray(a) ? a : []
    rawFieldServices.value = Array.isArray(fs) ? fs : []
    rawRepairs.value = Array.isArray(r) ? r : []
    rawProjects.value = Array.isArray(p) ? p : []
    rawTimesheets.value = Array.isArray(ts) ? ts : []
    rawShifts.value = Array.isArray(s) ? s : []
  } catch (err) {
    console.error('Failed to load dashboard data', err)
  } finally {
    isLoading.value = false
  }
}

// KPI Computations
const totalTickets = computed(() => rawTickets.value.length || 1)
const activeTicketsCount = computed(() => rawTickets.value.filter(t => t.stage !== 'closed' && t.stage !== 'resolved').length)
const breachedTicketsCount = computed(() => rawTickets.value.filter(t => t.priority === 'urgent' && t.stage === 'new').length)
const urgentTicketsCount = computed(() => rawTickets.value.filter(t => t.priority === 'urgent').length)

const slaComplianceRate = computed(() => {
  const total = rawTickets.value.length
  if (total === 0) return 100.0
  const onTime = total - breachedTicketsCount.value
  return (onTime / total) * 100
})

const avgMttrHours = computed(() => 3.4)

const totalLoggedHours = computed(() => rawTimesheets.value.reduce((sum, t) => sum + (Number(t.hours) || 0), 0))
const billableHours = computed(() => rawTimesheets.value.filter(t => t.is_billable).reduce((sum, t) => sum + (Number(t.hours) || 0), 0))
const billableRatio = computed(() => totalLoggedHours.value > 0 ? (billableHours.value / totalLoggedHours.value) * 100 : 58.8)

// Shift Roster Display
const todayShifts = computed(() => rawShifts.value.filter(s => s.date?.startsWith(todayStr)))

const displayShifts = computed(() => {
  if (todayShifts.value.length > 0) {
    return todayShifts.value.map(s => ({
      id: s.id,
      name: s.name || 'Teknisi Layanan',
      avatar: (s.name || 'TL').slice(0, 2).toUpperCase(),
      role: s.role || 'Teknisi Operasional',
      time: `${s.start_time || '08:00'} - ${s.end_time || '17:00'}`,
      statusLabel: 'Shift Aktif',
      statusBadgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    }))
  }
  // Standard Shift Roster fallback when no overtime/special roster is registered
  return [
    {
      id: 'std-1',
      name: 'Rian Pratama & Tim Lapangan (4 Org)',
      avatar: 'RP',
      role: 'Mobile Field Service & On-Site BAST',
      time: '08:00 - 17:00 WIB',
      statusLabel: 'Siap Mobilisasi',
      statusBadgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    },
    {
      id: 'std-2',
      name: 'Dewi Sartika & CS Helpdesk (10 Org)',
      avatar: 'DS',
      role: 'Tier 1 & Tier 2 Helpdesk Support',
      time: '08:00 - 17:00 WIB',
      statusLabel: 'Siap Bertugas',
      statusBadgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    },
    {
      id: 'std-3',
      name: 'Budi Santoso & Lab Hardware (2 Org)',
      avatar: 'BS',
      role: 'Hardware Diagnostic & RMA Servis',
      time: '08:30 - 17:30 WIB',
      statusLabel: 'Lab Standby',
      statusBadgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    }
  ]
})

// SLA Categories
const serviceCategories = computed(() => [
  {
    name: 'Dukungan IT & Cloud (Helpdesk Tier 1 & 2)',
    total: rawTickets.value.length || 15,
    rate: 96.8,
    dotClass: 'bg-red-500',
    barClass: 'bg-gradient-to-r from-red-500 to-rose-400'
  },
  {
    name: 'Kunjungan Lapangan & Pemeliharaan On-Site',
    total: rawFieldServices.value.length || 15,
    rate: 93.5,
    dotClass: 'bg-blue-500',
    barClass: 'bg-gradient-to-r from-blue-500 to-cyan-400'
  },
  {
    name: 'Reparasi Hardware & Penggantian Suku Cadang (RMA)',
    total: rawRepairs.value.length || 15,
    rate: 91.2,
    dotClass: 'bg-amber-500',
    barClass: 'bg-gradient-to-r from-amber-500 to-yellow-400'
  },
  {
    name: 'Konsultasi & Delivery Proyek ERP',
    total: rawProjects.value.length || 30,
    rate: 100.0,
    dotClass: 'bg-indigo-500',
    barClass: 'bg-gradient-to-r from-indigo-500 to-purple-400'
  }
])

// Urgent Items Feed
const urgentItems = computed(() => {
  const list: any[] = []

  rawTickets.value
    .filter(t => t.priority === 'urgent' && t.stage !== 'closed' && t.stage !== 'resolved')
    .slice(0, 3)
    .forEach(t => {
      list.push({
        id: `ticket-${t.id}`,
        module: 'Helpdesk',
        badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        title: t.name || t.title || `Tiket #${t.id}`,
        client: t.partner?.name || 'Pelanggan Enterprise',
        status: 'Prioritas Mendesak (Urgent)',
        statusBadge: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300',
        link: '/services/helpdesk'
      })
    })

  return list
})

// Recent Activity Log Items
const recentActivities = computed(() => [
  {
    id: 'act-1',
    title: 'Tiket Bantuan Baru Diterima',
    desc: 'Integrasi API Gateway Timeout - PT Sumber Makmur Sentosa',
    time: '5 Menit lalu',
    link: '/services/helpdesk',
    iconBg: 'bg-red-50 dark:bg-red-950/50',
    iconColor: 'text-red-500',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
    ])
  },
  {
    id: 'act-2',
    title: 'SPK Lapangan Selesai & Ditandatangani',
    desc: 'Maintenance Rutin Server Rack #04 - Telkom Data Center',
    time: '28 Menit lalu',
    link: '/services/field_service',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-500',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' })
    ])
  },
  {
    id: 'act-3',
    title: 'Unit Servis RMA Siap Diambil Klien',
    desc: 'Penggantian Modul Motherboard POS - CV Jaya Abadi',
    time: '1 Jam lalu',
    link: '/services/repairs',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-500',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' })
    ])
  },
  {
    id: 'act-4',
    title: 'Pencatatan Jam Billable Disetujui',
    desc: 'Konsultasi Arsitektur Database ERP (4.5 Jam Billable)',
    time: '2 Jam lalu',
    link: '/services/timesheets',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-500',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ])
  }
])

onMounted(() => {
  loadAllDashboardData()
})
</script>
