<template>
  <AdminLayout>
    <div class="space-y-6 pb-8">
      <!-- Top Breadcrumb & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Pemesanan Jadwal (Appointments)" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pusat penjadwalan janji temu, integrasi penerbitan SPK lapangan on-site, dan pelaporan jam kerja billable.
          </p>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="fetchData"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
            title="Refresh Data"
          >
            <svg class="w-4 h-4" :class="isLoading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
          
          <button
            @click="openModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Buat Janji Temu
          </button>
        </div>
      </div>

      <!-- Panduan Alur Layanan Terintegrasi (Enterprise Workflow Stepper) -->
      <div class="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-brand-500"></span>
            <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Alur Kerja Terintegrasi (Cross-Module Service Flow)
            </h4>
          </div>
          <span class="text-2xs text-gray-400">Standar Odoo 18 / Mekari Enterprise</span>
        </div>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Step 1 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs">
              01
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Reservasi / Draf</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Pilih Klien & Tautkan Tiket Helpdesk</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
              02
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Konfirmasi Jadwal</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Kunci Waktu Teknisi di Kalender</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/40 p-3 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
              03
            </div>
            <div>
              <p class="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                Terbitkan SPK Lapangan
                <span class="text-3xs bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.2 rounded font-semibold">1-Klik</span>
              </p>
              <p class="text-2xs text-blue-700/80 dark:text-blue-300/80">Kirim Tugas On-Site & e-BAST</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
              04
            </div>
            <div>
              <p class="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                Selesai & Timesheet
                <span class="text-3xs bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold">Billable</span>
              </p>
              <p class="text-2xs text-emerald-700/80 dark:text-emerald-300/80">Catat Jam Kerja Tertagih ke Klien</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Notification Toast / Banner for Cross-Module Actions -->
      <div
        v-if="actionSuccessMessage"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-sm animate-fade-in"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <p class="text-xs font-bold">{{ actionSuccessMessage.title }}</p>
            <p class="text-2xs text-emerald-700 dark:text-emerald-300">{{ actionSuccessMessage.description }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <router-link
            :to="actionSuccessMessage.link"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            {{ actionSuccessMessage.linkLabel }} &rarr;
          </router-link>
          <button
            @click="actionSuccessMessage = null"
            class="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 p-1"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Janji Temu</span>
            <span class="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ appointments.length }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Keseluruhan agenda tercatat</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Agenda Hari Ini</span>
            <span class="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ todayAppointmentsCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Jadwal tanggal hari ini</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Terkonfirmasi</span>
            <span class="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ confirmedAppointmentsCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Siap dikunjungi / buat SPK</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Selesai Terlaksana</span>
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ doneAppointmentsCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Layanan berhasil diselesaikan</p>
        </div>
      </div>

      <!-- Filters & Toolbar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari janji temu, nama klien..."
              class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>

          <!-- Status Filter -->
          <select
            v-model="filterStatus"
            class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua Status ({{ appointments.length }})</option>
            <option value="draft">Draft / Menunggu Konfirmasi</option>
            <option value="confirmed">Terkonfirmasi (Confirmed)</option>
            <option value="done">Selesai (Done)</option>
            <option value="cancelled">Dibatalkan (Cancelled)</option>
          </select>

          <!-- Staff/Employee Filter -->
          <select
            v-model="filterStaff"
            class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua Staff/Teknisi</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.name || emp.full_name || 'Staff #' + emp.id }}
            </option>
          </select>
        </div>

        <!-- View Switcher -->
        <div class="flex items-center gap-1 border border-gray-200 rounded-lg p-1 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 self-end md:self-auto">
          <button
            @click="viewMode = 'agenda'"
            :class="viewMode === 'agenda' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
            class="p-1.5 rounded-md text-xs font-medium transition flex items-center gap-1"
            title="Tampilan Agenda Kartu"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Agenda
          </button>
          <button
            @click="viewMode = 'table'"
            :class="viewMode === 'table' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
            class="p-1.5 rounded-md text-xs font-medium transition flex items-center gap-1"
            title="Tampilan Tabel Rinci"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            Tabel
          </button>
        </div>
      </div>

      <!-- Alert Error -->
      <Alert v-if="error" variant="error" title="Gagal" :message="error" />

      <!-- Loading State -->
      <div v-if="isLoading" class="py-16 text-center">
        <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat data jadwal...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredAppointments.length === 0"
        class="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl dark:border-gray-800"
      >
        <div class="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 dark:bg-gray-800">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <h4 class="mt-3 text-sm font-bold text-gray-800 dark:text-white">Tidak ada jadwal janji temu</h4>
        <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Belum ada jadwal yang cocok dengan filter, atau klik tombol di bawah untuk membuat janji temu baru.
        </p>
        <button
          @click="openModal('create')"
          class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white hover:bg-brand-600 shadow-sm"
        >
          + Buat Janji Temu Pertama
        </button>
      </div>

      <!-- VIEW 1: AGENDA CARD VIEW -->
      <div v-else-if="viewMode === 'agenda'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="apt in filteredAppointments"
          :key="apt.id"
          class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs hover:shadow-md transition-all dark:border-gray-800 dark:bg-white/[0.03] flex flex-col justify-between"
        >
          <div>
            <!-- Header: Date / Time + Status Badge -->
            <div class="flex items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div class="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{{ formatDateTime(apt.date) }}</span>
              </div>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="getStatusBadgeClass(apt.state)"
              >
                {{ getStatusLabel(apt.state) }}
              </span>
            </div>

            <!-- Subject / Title -->
            <h4 class="mt-3 text-sm font-bold text-gray-900 dark:text-white">
              {{ apt.name }}
            </h4>

            <!-- Client / Partner info -->
            <div class="mt-2.5 flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {{ getCustomerName(apt.partner_id, apt.partner).charAt(0).toUpperCase() }}
              </div>
              <div class="truncate">
                <span class="block text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {{ getCustomerName(apt.partner_id, apt.partner) }}
                </span>
                <span class="block text-[10px] text-gray-400">Pelanggan / Klien</span>
              </div>
            </div>

            <!-- Assigned Staff -->
            <div class="mt-2 flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div class="truncate">
                <span class="block text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {{ getEmployeeName(apt.employee_id, apt.employee) }}
                </span>
                <span class="block text-[10px] text-gray-400">Staff / Teknisi Bertugas</span>
              </div>
            </div>

            <!-- Notes -->
            <p v-if="apt.notes" class="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg line-clamp-2">
              {{ apt.notes }}
            </p>

            <!-- Cross-Module Quick Actions Bar (Jika Terkonfirmasi atau Selesai) -->
            <div class="mt-3 pt-2.5 border-t border-dashed border-gray-200 dark:border-gray-800 flex flex-wrap gap-2">
              <!-- 1-Click SPK Lapangan untuk status Confirmed -->
              <button
                v-if="apt.state === 'confirmed'"
                @click="openGenerateFieldServiceModal(apt)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 text-2xs font-bold border border-blue-200 dark:border-blue-800 transition"
              >
                <svg class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                + Terbitkan SPK Lapangan
              </button>

              <!-- 1-Click Timesheet untuk status Done -->
              <button
                v-if="apt.state === 'done'"
                @click="openLogTimesheetModal(apt)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 text-2xs font-bold border border-emerald-200 dark:border-emerald-800 transition"
              >
                <svg class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                + Catat Jam ke Timesheet
              </button>
            </div>
          </div>

          <!-- Bottom Action Buttons (Status Lifecycle) -->
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <button
                v-if="apt.state === 'draft'"
                @click="quickUpdateStatus(apt, 'confirmed')"
                class="px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-xs"
              >
                Konfirmasi
              </button>
              <button
                v-if="apt.state === 'confirmed'"
                @click="quickUpdateStatus(apt, 'done')"
                class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-xs"
              >
                Tandai Selesai
              </button>
              <button
                v-if="apt.state !== 'cancelled' && apt.state !== 'done'"
                @click="quickUpdateStatus(apt, 'cancelled')"
                class="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 dark:hover:bg-gray-800 text-xs"
                title="Batalkan Jadwal"
              >
                Batal
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="openModal('edit', apt)"
                class="text-xs font-semibold text-brand-500 hover:text-brand-600"
              >
                Edit
              </button>
              <button
                @click="apt.id && deleteAppointment(apt.id)"
                class="text-gray-400 hover:text-red-500"
                title="Hapus"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: TABLE VIEW -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Subjek Layanan</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Klien / Pelanggan</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Staff / Teknisi</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Waktu Jadwal</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Aksi Lintas Modul</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="apt in filteredAppointments"
                :key="apt.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
              >
                <td class="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">
                  {{ apt.name }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {{ getCustomerName(apt.partner_id, apt.partner) }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                  {{ getEmployeeName(apt.employee_id, apt.employee) }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-mono">
                  {{ formatDateTime(apt.date) }}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="getStatusBadgeClass(apt.state)">
                    {{ getStatusLabel(apt.state) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button
                    v-if="apt.state === 'confirmed'"
                    @click="openGenerateFieldServiceModal(apt)"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 text-2xs font-semibold border border-blue-200 dark:border-blue-800"
                  >
                    + SPK Lapangan
                  </button>
                  <button
                    v-else-if="apt.state === 'done'"
                    @click="openLogTimesheetModal(apt)"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 text-2xs font-semibold border border-emerald-200 dark:border-emerald-800"
                  >
                    + Log Timesheet
                  </button>
                  <span v-else class="text-2xs text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      v-if="apt.state === 'draft'"
                      @click="quickUpdateStatus(apt, 'confirmed')"
                      class="rounded p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/40"
                      title="Konfirmasi Janji Temu"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button
                      v-if="apt.state === 'confirmed'"
                      @click="quickUpdateStatus(apt, 'done')"
                      class="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      title="Tandai Selesai Layanan"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </button>
                    <button
                      @click="openModal('edit', apt)"
                      class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                      title="Edit Janji Temu"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      @click="apt.id && deleteAppointment(apt.id)"
                      class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      title="Hapus Janji Temu"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL 1: BUAT / EDIT APPOINTMENT               -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              {{ modalMode === 'create' ? 'Buat Jadwal Janji Temu Baru' : 'Edit Janji Temu' }}
            </h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form @submit.prevent="saveAppointment" class="space-y-4 mt-4">
            <!-- Rujukan Tiket Helpdesk (Opsional) -->
            <div v-if="modalMode === 'create' && helpdeskTickets.length > 0" class="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <label class="block text-2xs font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                Tautkan dari Tiket Helpdesk (Opsional)
              </label>
              <select
                v-model="selectedHelpdeskTicketId"
                @change="handleHelpdeskTicketSelected"
                class="w-full rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs text-gray-800 focus:border-brand-500 focus:outline-none dark:border-blue-800 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined">-- Bukan Berasal dari Tiket (Reservasi Mandiri) --</option>
                <option v-for="t in helpdeskTickets" :key="t.id" :value="t.id">
                  Tiket #{{ t.id }} - {{ t.name || t.title }} ({{ t.partner?.name || 'Klien' }})
                </option>
              </select>
            </div>

            <!-- Subject / Service Title -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subjek / Judul Janji Temu *</label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="Contoh: Kunjungan On-Site Servis Genset / Konsultasi Sistem"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Client (Partner) Dropdown -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Klien / Pelanggan *</label>
              <select
                v-model="formData.partner_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>-- Pilih Klien --</option>
                <option v-for="p in partners" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <!-- Employee / Technician Dropdown -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Staff / Teknisi Bertugas *</label>
              <select
                v-model="formData.employee_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>-- Pilih Staff / Teknisi --</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.name || emp.full_name || 'Staff #' + emp.id }}
                </option>
              </select>
            </div>

            <!-- Date & Time Picker & Status -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tanggal & Waktu *</label>
                <input
                  v-model="rawDateTime"
                  type="datetime-local"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status Alur</label>
                <select
                  v-model="formData.state"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="draft">Draft (Menunggu Konfirmasi)</option>
                  <option value="confirmed">Terkonfirmasi (Confirmed)</option>
                  <option value="done">Selesai (Done)</option>
                  <option value="cancelled">Dibatalkan (Cancelled)</option>
                </select>
              </div>
            </div>

            <!-- Notes / Alamat -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Tambahan / Lokasi Kunjungan</label>
              <textarea
                v-model="formData.notes"
                rows="3"
                placeholder="Rincian alamat atau hal yang perlu dipersiapkan teknisi saat kunjungan..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 shadow-sm"
              >
                {{ isSaving ? 'Menyimpan...' : 'Simpan Jadwal' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 2: TERBITKAN SPK LAPANGAN (1-CLICK)      -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isFieldServiceModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Terbitkan SPK Layanan Lapangan</h3>
                <p class="text-2xs text-gray-400">Generate Surat Perintah Kerja teknisi dari janji temu</p>
              </div>
            </div>
            <button @click="isFieldServiceModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form @submit.prevent="generateFieldServiceTask" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor / Judul SPK Lapangan *</label>
              <input
                v-model="fsFormData.name"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-medium"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Klien Dituju</label>
                <input
                  :value="getCustomerName(fsFormData.partner_id)"
                  disabled
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 font-medium"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Teknisi Bertugas</label>
                <input
                  :value="getEmployeeName(fsFormData.employee_id)"
                  disabled
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 font-medium"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Prioritas Pengerjaan</label>
                <select
                  v-model="fsFormData.priority"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="low">Rendah (Low)</option>
                  <option value="medium">Normal / Sedang</option>
                  <option value="high">Tinggi (High)</option>
                  <option value="urgent">Mendesak (Urgent - SLA 4 Jam)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tahap Awal SPK</label>
                <select
                  v-model="fsFormData.state"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="assigned">Teknisi Ditugaskan (Assigned)</option>
                  <option value="draft">Draft SPK</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap / Catatan Kunjungan *</label>
              <textarea
                v-model="fsFormData.address"
                rows="3"
                required
                placeholder="Alamat lokasi onsite klien, PIC yang dapat dihubungi, dan instruksi..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isFieldServiceModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isGeneratingFS"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm flex items-center gap-1.5"
              >
                <svg v-if="isGeneratingFS" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                {{ isGeneratingFS ? 'Menerbitkan...' : 'Terbitkan SPK Sekarang' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL 3: CATAT JAM KE TIMESHEET (1-CLICK)     -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isTimesheetModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Pencatatan Jam Kerja (Timesheets)</h3>
                <p class="text-2xs text-gray-400">Log jam kerja tertagih (billable) atas janji temu yang telah selesai</p>
              </div>
            </div>
            <button @click="isTimesheetModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form @submit.prevent="saveTimesheetLog" class="space-y-4 mt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Staff / Karyawan</label>
                <input
                  :value="getEmployeeName(tsFormData.employee_id)"
                  disabled
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 font-medium"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tanggal Pelaksanaan *</label>
                <input
                  v-model="tsFormData.date"
                  type="date"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Durasi Jam Kerja *</label>
                <div class="relative">
                  <input
                    v-model.number="tsFormData.hours"
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-semibold text-gray-400">Jam</span>
                </div>
              </div>

              <div class="flex items-center pt-6">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="tsFormData.is_billable"
                    class="h-4 w-4 rounded text-brand-500 border-gray-300 dark:border-gray-700 focus:ring-brand-400"
                  />
                  <span class="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Billable (Ditagih ke Klien)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Uraian Pekerjaan / Layanan *</label>
              <textarea
                v-model="tsFormData.description"
                rows="3"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isTimesheetModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSavingTimesheet"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm flex items-center gap-1.5"
              >
                <svg v-if="isSavingTimesheet" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                {{ isSavingTimesheet ? 'Menyimpan...' : 'Simpan ke Timesheet' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import { appointmentsService } from '@/services/services/appointments.service'
import { fieldServiceService } from '@/services/services/field-service.service'
import { timesheetsService } from '@/services/services/timesheets.service'
import { helpdeskService } from '@/services/services/helpdesk.service'
import { employeesService } from '@/services/hr/employees.service'
import { crmService } from '@/services/sales/crm.service'
import type { IAppointmentDto } from '@/types/services'

// View & Filter States
const viewMode = ref<'agenda' | 'table'>('agenda')
const searchQuery = ref('')
const filterStatus = ref('all')
const filterStaff = ref('all')

// Data Collections
const appointments = ref<IAppointmentDto[]>([])
const employees = ref<any[]>([])
const partners = ref<any[]>([])
const helpdeskTickets = ref<any[]>([])

const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)

// Action Success Notification Toast
const actionSuccessMessage = ref<{
  title: string
  description: string
  link: string
  linkLabel: string
} | null>(null)

// Modal 1: Buat / Edit Appointment
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formData = ref<Partial<IAppointmentDto>>({
  name: '',
  partner_id: undefined,
  employee_id: undefined,
  state: 'draft',
  notes: ''
})
const rawDateTime = ref('')
const selectedHelpdeskTicketId = ref<number | undefined>(undefined)

// Modal 2: 1-Click Generate SPK Lapangan
const isFieldServiceModalOpen = ref(false)
const isGeneratingFS = ref(false)
const fsFormData = ref({
  appointment_id: 0,
  name: '',
  partner_id: undefined as number | undefined,
  employee_id: undefined as number | undefined,
  address: '',
  priority: 'medium',
  state: 'assigned'
})

// Modal 3: 1-Click Log Timesheet
const isTimesheetModalOpen = ref(false)
const isSavingTimesheet = ref(false)
const tsFormData = ref({
  appointment_id: 0,
  employee_id: undefined as number | undefined,
  date: '',
  hours: 2.0,
  is_billable: true,
  description: ''
})

// Load All Relevant Data
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await appointmentsService.getAll()
    appointments.value = data || []

    // Concurrently load employees, partners, and helpdesk tickets
    if (employees.value.length === 0) {
      employeesService.getAll().then(res => { employees.value = res || [] }).catch(() => {})
    }
    if (partners.value.length === 0) {
      crmService.getPartners().then(res => { partners.value = res || [] }).catch(() => {})
    }
    if (helpdeskTickets.value.length === 0) {
      helpdeskService.getAll().then(res => {
        // Only active/open tickets
        helpdeskTickets.value = (res || []).filter((t: any) => t.stage !== 'closed' && t.stage !== 'resolved')
      }).catch(() => {})
    }
  } catch (err: any) {
    error.value = 'Gagal memuat janji temu: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

// Filtered Appointments
const filteredAppointments = computed(() => {
  return appointments.value.filter(apt => {
    // Search match
    const q = searchQuery.value.toLowerCase().trim()
    const clientName = getCustomerName(apt.partner_id, apt.partner).toLowerCase()
    const matchSearch = !q || (apt.name && apt.name.toLowerCase().includes(q)) ||
      (apt.notes && apt.notes.toLowerCase().includes(q)) ||
      clientName.includes(q)

    // Status match
    const matchStatus = filterStatus.value === 'all' || (apt.state || 'draft').toLowerCase() === filterStatus.value.toLowerCase()

    // Staff match
    const matchStaff = filterStaff.value === 'all' || String(apt.employee_id) === String(filterStaff.value)

    return matchSearch && matchStatus && matchStaff
  })
})

// KPI Counters
const todayAppointmentsCount = computed(() => {
  const todayStr = new Date().toISOString().slice(0, 10)
  return appointments.value.filter(apt => apt.date && apt.date.startsWith(todayStr)).length
})

const confirmedAppointmentsCount = computed(() => {
  return appointments.value.filter(apt => apt.state === 'confirmed').length
})

const doneAppointmentsCount = computed(() => {
  return appointments.value.filter(apt => apt.state === 'done').length
})

// Helpers
const getCustomerName = (id?: number, partnerObj?: any) => {
  if (partnerObj && partnerObj.name) return partnerObj.name
  if (!id) return 'Pelanggan Walk-in'
  const found = partners.value.find(p => p.id === id)
  return found ? found.name : `Klien #${id}`
}

const getEmployeeName = (id?: number, employeeObj?: any) => {
  if (employeeObj && (employeeObj.name || employeeObj.full_name)) {
    return employeeObj.name || employeeObj.full_name
  }
  if (!id) return 'Belum Ditugaskan'
  const found = employees.value.find(e => e.id === id)
  return found ? (found.name || found.full_name) : `Staff #${id}`
}

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const getStatusBadgeClass = (state?: string) => {
  switch (state) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    case 'done':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    case 'draft':
    default:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  }
}

const getStatusLabel = (state?: string) => {
  switch (state) {
    case 'confirmed': return 'Terkonfirmasi'
    case 'done': return 'Selesai'
    case 'cancelled': return 'Dibatalkan'
    case 'draft':
    default:
      return 'Draft'
  }
}

// Open Modal Buat / Edit Appointment
const openModal = (mode: 'create' | 'edit', apt?: IAppointmentDto) => {
  modalMode.value = mode
  selectedHelpdeskTicketId.value = undefined
  if (mode === 'create') {
    formData.value = {
      name: '',
      partner_id: undefined,
      employee_id: undefined,
      state: 'draft',
      notes: ''
    }
    const now = new Date()
    now.setMinutes(0, 0, 0)
    rawDateTime.value = now.toISOString().slice(0, 16)
  } else if (apt) {
    formData.value = {
      id: apt.id,
      name: apt.name,
      partner_id: apt.partner_id,
      employee_id: apt.employee_id,
      state: apt.state || 'draft',
      notes: apt.notes || ''
    }
    if (apt.date) {
      try {
        const d = new Date(apt.date)
        rawDateTime.value = d.toISOString().slice(0, 16)
      } catch {
        rawDateTime.value = ''
      }
    }
  }
  isModalOpen.value = true
}

// Handler saat tiket helpdesk dipilih
const handleHelpdeskTicketSelected = () => {
  if (!selectedHelpdeskTicketId.value) return
  const ticket = helpdeskTickets.value.find(t => t.id === selectedHelpdeskTicketId.value)
  if (ticket) {
    formData.value.name = `Kunjungan Tindak Lanjut: ${ticket.name || ticket.title}`
    if (ticket.partner_id) {
      formData.value.partner_id = ticket.partner_id
    }
    if (ticket.description) {
      formData.value.notes = `Rujukan Tiket #${ticket.id}: ${ticket.description}`
    }
  }
}

// Simpan Janji Temu
const saveAppointment = async () => {
  isSaving.value = true
  error.value = null
  try {
    const payload = {
      ...formData.value,
      date: new Date(rawDateTime.value).toISOString()
    }
    if (modalMode.value === 'create') {
      await appointmentsService.create(payload)
      actionSuccessMessage.value = {
        title: 'Jadwal Janji Temu Berhasil Dibuat',
        description: `Jadwal "${payload.name}" telah tersimpan di kalender layanan.`,
        link: '/services/appointments',
        linkLabel: 'Lihat Jadwal'
      }
    } else if (formData.value.id) {
      await appointmentsService.update(formData.value.id, payload)
    }
    isModalOpen.value = false
    await fetchData()
  } catch (err: any) {
    error.value = 'Gagal menyimpan janji temu: ' + (err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

// Quick Update Status
const quickUpdateStatus = async (apt: IAppointmentDto, newState: string) => {
  if (!apt.id) return
  try {
    await appointmentsService.update(apt.id, {
      ...apt,
      state: newState
    })
    apt.state = newState

    // Jika ditandai selesai, tawarkan otomatis untuk catat jam kerja
    if (newState === 'done') {
      actionSuccessMessage.value = {
        title: 'Layanan Ditandai Selesai!',
        description: `Janji temu "${apt.name}" telah selesai. Apakah ingin mencatat jam kerja ke Timesheet?`,
        link: '/services/timesheets',
        linkLabel: 'Buka Timesheet'
      }
    }
  } catch (err: any) {
    alert('Gagal mengubah status: ' + (err.response?.data?.message || err.message))
  }
}

// Delete Appointment
const deleteAppointment = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return
  try {
    await appointmentsService.delete(id)
    appointments.value = appointments.value.filter(a => a.id !== id)
  } catch (err: any) {
    alert('Gagal menghapus janji temu: ' + (err.response?.data?.message || err.message))
  }
}

// =========================================================
// CROSS-MODULE ACTION 1: GENERATE SPK LAPANGAN (1-CLICK)
// =========================================================
const openGenerateFieldServiceModal = (apt: IAppointmentDto) => {
  fsFormData.value = {
    appointment_id: apt.id || 0,
    name: `SPK Lapangan: ${apt.name}`,
    partner_id: apt.partner_id,
    employee_id: apt.employee_id,
    address: apt.notes || 'Alamat kantor / pabrik klien',
    priority: 'medium',
    state: 'assigned'
  }
  isFieldServiceModalOpen.value = true
}

const generateFieldServiceTask = async () => {
  isGeneratingFS.value = true
  try {
    await fieldServiceService.create({
      name: fsFormData.value.name,
      partner_id: fsFormData.value.partner_id,
      employee_id: fsFormData.value.employee_id,
      address: fsFormData.value.address,
      priority: fsFormData.value.priority,
      state: fsFormData.value.state,
      notes: `Diterbitkan otomatis dari Janji Temu #${fsFormData.value.appointment_id}`
    })

    isFieldServiceModalOpen.value = false
    actionSuccessMessage.value = {
      title: 'SPK Lapangan Berhasil Diterbitkan!',
      description: `Surat Perintah Kerja untuk teknisi telah dibuat di modul Layanan Lapangan (Field Service).`,
      link: '/services/field_service',
      linkLabel: 'Buka Layanan Lapangan'
    }
  } catch (err: any) {
    alert('Gagal menerbitkan SPK: ' + (err.response?.data?.message || err.message))
  } finally {
    isGeneratingFS.value = false
  }
}

// =========================================================
// CROSS-MODULE ACTION 2: LOG TIMESHEET (1-CLICK)
// =========================================================
const openLogTimesheetModal = (apt: IAppointmentDto) => {
  const dateOnly = apt.date ? apt.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  tsFormData.value = {
    appointment_id: apt.id || 0,
    employee_id: apt.employee_id,
    date: dateOnly,
    hours: 2.0,
    is_billable: true,
    description: `Layanan Janji Temu: ${apt.name} (${getCustomerName(apt.partner_id, apt.partner)})`
  }
  isTimesheetModalOpen.value = true
}

const saveTimesheetLog = async () => {
  isSavingTimesheet.value = true
  try {
    await timesheetsService.create({
      employee_id: tsFormData.value.employee_id,
      date: new Date(tsFormData.value.date).toISOString(),
      hours: Number(tsFormData.value.hours) || 2,
      is_billable: tsFormData.value.is_billable,
      description: tsFormData.value.description
    })

    isTimesheetModalOpen.value = false
    actionSuccessMessage.value = {
      title: 'Jam Kerja Berhasil Dicatat ke Timesheet!',
      description: `${tsFormData.value.hours} jam kerja (${tsFormData.value.is_billable ? 'Billable' : 'Internal'}) telah ditambahkan ke laporan utilisasi.`,
      link: '/services/timesheets',
      linkLabel: 'Lihat di Timesheet'
    }
  } catch (err: any) {
    alert('Gagal mencatat jam kerja: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingTimesheet.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
