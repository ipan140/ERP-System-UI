<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            </span>
            Manajemen Acara & Tiket (Events & Barcode Ticketing)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Enterprise: Kelola kuota kapasitas acara, terbitkan e-tiket resmi, dan simulasikan pemindai barcode / check-in di lokasi.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openTicketModal" class="inline-flex items-center gap-2 rounded-lg border border-amber-600 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Terbitkan Tiket Peserta
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Buat Acara Baru
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Acara</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }}</h3>
          <p class="mt-1 text-xs text-amber-600 font-medium">Seminar / Webinar / Workshop</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tiket Diterbitkan</p>
          <h3 class="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ tickets.length }}</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">Peserta terdaftar</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kehadiran (Check-In)</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ scannedCount }}</h3>
          <p class="mt-1 text-xs text-emerald-600 font-medium">Sudah di-scan di lokasi</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rata-rata Keterisian</p>
          <h3 class="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{{ avgCapacityRate }}%</h3>
          <p class="mt-1 text-xs text-purple-600 font-medium">Dari total kapasitas kursi</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'events'"
            :class="[
              activeTab === 'events'
                ? 'border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold flex items-center gap-2'
            ]"
          >
            <span>Daftar Acara & Kapasitas</span>
            <span class="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">{{ records.length }}</span>
          </button>
          <button
            @click="activeTab = 'tickets'"
            :class="[
              activeTab === 'tickets'
                ? 'border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold flex items-center gap-2'
            ]"
          >
            <span>Daftar Tiket & Check-in Scanner</span>
            <span class="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">{{ tickets.length }}</span>
          </button>
        </nav>
      </div>

      <!-- TAB 1: Events Table -->
      <div v-if="activeTab === 'events'" class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Acara</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Lokasi</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kapasitas Kursi</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading"><td colspan="5" class="px-5 py-8 text-center text-gray-500">Memuat data acara...</td></tr>
              <tr v-else-if="error"><td colspan="5" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
              <tr v-else-if="records.length === 0"><td colspan="5" class="px-5 py-8 text-center text-gray-500">Belum ada acara yang dibuat.</td></tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                <td class="px-5 py-4">
                  <div class="font-semibold text-gray-900 dark:text-white">{{ record.event_name || 'Acara Tanpa Nama' }}</div>
                </td>
                <td class="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                  📍 {{ record.location || 'Online Webinar' }}
                </td>
                <td class="px-5 py-4">
                  <div class="space-y-1 min-w-[160px]">
                    <div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                      <span>{{ getRegisteredCount(record.id) }} Terdaftar</span>
                      <span>Maks: {{ record.max_capacity || 100 }}</span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div class="bg-amber-500 h-2 rounded-full" :style="{ width: `${Math.min(100, (getRegisteredCount(record.id) / (record.max_capacity || 100)) * 100)}%` }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span
                    :class="[
                      record.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      record.status === 'Ongoing' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border'
                    ]"
                  >
                    ● {{ record.status || 'Open' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal('edit', record)" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800">
                      Edit
                    </button>
                    <button @click="deleteRecord(record.id)" class="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: Tickets & Check-In Scanner Table -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-3">
          <div class="flex flex-wrap gap-2 justify-between items-center">
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white text-sm">Daftar E-Tiket & Status Presensi</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">Pilih tab acara di bawah untuk memfilter tiket berdasarkan masing-masing acara.</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openScannerModal" class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition">
                <span>📷</span> Buka Pemindai Barcode
              </button>
              <button @click="openTicketModal" class="rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm transition">
                + Tambah Tiket
              </button>
            </div>
          </div>

          <!-- TOOLBAR FILTER & SEARCH (Solusi Skalabilitas jika Banyak Acara) -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <!-- Pilihan Acara (Dropdown Select + Quick Pills) -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>🎯</span> Acara:
              </span>
              <!-- Dropdown Acara (Sangat Praktis & Rapi jika Memiliki Puluhan Acara) -->
              <div class="relative min-w-[200px]">
                <select
                  v-model="selectedEventFilter"
                  class="w-full rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">🌐 Semua Acara (Total {{ tickets.length }} Tiket)</option>
                  <option v-for="ev in records" :key="ev.id" :value="ev.id">
                    {{ ev.event_name }} ({{ getRegisteredCount(ev.id) }} Tiket)
                  </option>
                </select>
              </div>

              <!-- Quick Filter Status Presensi -->
              <div class="inline-flex rounded-lg bg-gray-200/70 p-0.5 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  @click="selectedStatusFilter = 'all'"
                  :class="[
                    selectedStatusFilter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white font-bold'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                    'rounded-md px-2.5 py-1 text-[11px] transition'
                  ]"
                >
                  Semua
                </button>
                <button
                  type="button"
                  @click="selectedStatusFilter = 'scanned'"
                  :class="[
                    selectedStatusFilter === 'scanned'
                      ? 'bg-emerald-600 text-white shadow-sm font-bold'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                    'rounded-md px-2.5 py-1 text-[11px] transition'
                  ]"
                >
                  ✓ Hadir
                </button>
                <button
                  type="button"
                  @click="selectedStatusFilter = 'unscanned'"
                  :class="[
                    selectedStatusFilter === 'unscanned'
                      ? 'bg-amber-500 text-white shadow-sm font-bold'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                    'rounded-md px-2.5 py-1 text-[11px] transition'
                  ]"
                >
                  ⏳ Menunggu
                </button>
              </div>
            </div>

            <!-- Search Box Tiket (Cari Berdasarkan Nama Peserta, Email, atau Barcode) -->
            <div class="relative w-full md:w-64">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                v-model="ticketSearchQuery"
                type="text"
                placeholder="Cari peserta / barcode..."
                class="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-8 py-1.5 text-xs text-gray-800 placeholder-gray-400 shadow-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
              <button
                v-if="ticketSearchQuery"
                @click="ticketSearchQuery = ''"
                class="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">No. Tiket / Barcode</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Acara</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama & Peserta</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Presensi</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="filteredTickets.length === 0">
                <td colspan="5" class="px-5 py-8 text-center text-gray-500">
                  {{ selectedEventFilter === 'all' ? 'Belum ada tiket yang diterbitkan.' : 'Belum ada tiket yang terdaftar untuk acara ini.' }}
                </td>
              </tr>
              <tr v-for="ticket in filteredTickets" :key="ticket.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="viewTicketDetail(ticket)"
                      title="Klik untuk melihat E-Tiket & Barcode visual"
                      class="font-mono text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20"
                    >
                      <span>🎟</span>
                      {{ ticket.barcode || `TCK-${ticket.id}` }}
                    </button>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {{ ticket.event?.event_name || getEventName(ticket.event_id) }}
                </td>
                <td class="px-5 py-4">
                  <div class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ getAttendeeName(ticket) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ getAttendeeEmail(ticket) }}
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span
                    :class="[
                      ticket.is_scanned ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border'
                    ]"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="ticket.is_scanned ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
                    {{ ticket.is_scanned ? 'Hadir (Check-In Valid)' : 'Belum Hadir (Menunggu)' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="viewTicketDetail(ticket)"
                      class="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition"
                    >
                      👁 Lihat Tiket
                    </button>
                    <!-- Scan Button: Jika sudah scanned, tombol disabled dan bertuliskan "Sudah Check-In" -->
                    <button
                      v-if="!ticket.is_scanned"
                      @click="performCheckIn(ticket.barcode || '')"
                      class="rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      📷 Scan Masuk
                    </button>
                    <span
                      v-else
                      class="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      title="Tiket ini sudah pernah di-scan dan tidak dapat di-scan dua kali"
                    >
                      ✓ Terverifikasi
                    </span>
                    <button @click="deleteTicket(ticket.id)" class="text-xs text-red-500 hover:text-red-700 font-medium p-1">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tambah/Edit Acara -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📅</span> {{ modalMode === 'create' ? 'Buat Acara Baru' : 'Edit Acara' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
      </div>

      <form @submit.prevent="saveRecord" class="mt-4 space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Acara</label>
          <input v-model="formData.event_name" type="text" placeholder="Misal: Annual Enterprise ERP Summit 2026" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Lokasi Pelaksanaan</label>
          <input v-model="formData.location" type="text" placeholder="Misal: Grand Ballroom Hotel Indonesia / Zoom Webinar" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Kapasitas Maksimal Kursi</label>
            <input v-model.number="formData.max_capacity" type="number" min="1" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status Acara</label>
            <select v-model="formData.status" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="Open">Open (Pendaftaran Buka)</option>
              <option value="Ongoing">Ongoing (Sedang Berlangsung)</option>
              <option value="Completed">Completed (Selesai)</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Batal</button>
          <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
            {{ isSaving ? 'Menyimpan...' : 'Simpan Acara' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Terbitkan Tiket -->
  <div v-if="isTicketModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 dark:border-gray-700/80 dark:bg-gray-900 my-8 transition-all">
      <!-- Header Modal -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
            🎟
          </span>
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              Terbitkan E-Tiket Baru
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Registrasikan tiket peserta dan generate barcode check-in
            </p>
          </div>
        </div>
        <button
          @click="isTicketModalOpen = false"
          class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition"
        >
          ✕
        </button>
      </div>

      <!-- Overcapacity Warning Banner -->
      <div v-if="isEventFull" class="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-sm text-rose-500 dark:text-rose-400 flex items-start gap-2.5">
        <span class="text-base leading-none">⚠️</span>
        <div>
          <span class="font-bold">Kapasitas Penuh!</span> Kuota kursi acara ini telah mencapai batas maksimal ({{ selectedEventQuota?.max }} kursi). Pendaftaran ditutup.
        </div>
      </div>

      <form @submit.prevent="saveTicket" class="mt-5 space-y-4">
        <!-- Pilihan Acara -->
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Pilih Acara</label>
            <span
              v-if="selectedEventQuota"
              :class="[
                isEventFull
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border'
              ]"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="isEventFull ? 'bg-rose-500' : 'bg-emerald-500'"></span>
              Terisi: {{ selectedEventQuota.registered }}/{{ selectedEventQuota.max }} (Sisa: {{ selectedEventQuota.remaining }})
            </span>
          </div>
          <div class="relative">
            <select
              v-model="ticketFormData.event_id"
              required
              class="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option v-for="ev in records" :key="ev.id" :value="ev.id">
                {{ ev.event_name }} (Kapasitas: {{ ev.max_capacity }} | Terisi: {{ getRegisteredCount(ev.id) }})
              </option>
            </select>
          </div>
        </div>

        <!-- Box Data Peserta -->
        <div class="rounded-xl border border-gray-200/80 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-800/40 space-y-3.5">
          <!-- Segmented Tab / Radio Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Data Peserta</span>
            <div class="inline-flex rounded-lg bg-gray-200/70 p-0.5 dark:bg-gray-700/60">
              <button
                type="button"
                @click="attendeeType = 'partner'"
                :class="[
                  attendeeType === 'partner'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                  'rounded-md px-2.5 py-1 text-xs font-semibold transition'
                ]"
              >
                🏢 Partner CRM
              </button>
              <button
                type="button"
                @click="attendeeType = 'walkin'"
                :class="[
                  attendeeType === 'walkin'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                  'rounded-md px-2.5 py-1 text-xs font-semibold transition'
                ]"
              >
                🚶 Umum / Walk-in
              </button>
            </div>
          </div>

          <!-- Dropdown Partner CRM -->
          <div v-if="attendeeType === 'partner'" class="space-y-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Pilih Partner / Client Terdaftar</label>
            <select
              v-model="ticketFormData.customer_id"
              @change="onSelectPartner"
              class="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option :value="null">-- Pilih Partner / Customer --</option>
              <option v-for="p in partners" :key="p.id" :value="p.id">
                {{ p.name }} {{ p.email ? `(${p.email})` : '' }}
              </option>
            </select>
          </div>

          <!-- Input Nama & Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Nama Lengkap</label>
              <input
                v-model="ticketFormData.attendee_name"
                type="text"
                placeholder="Contoh: Budi Santoso"
                required
                class="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Email Peserta</label>
              <input
                v-model="ticketFormData.attendee_email"
                type="email"
                placeholder="budi@example.com"
                class="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        <!-- Barcode Unik & Generator -->
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Kode Barcode Unik</label>
            <button
              type="button"
              @click="regenerateBarcode"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Generate Barcode Baru
            </button>
          </div>
          <div class="relative flex items-center">
            <input
              v-model="ticketFormData.barcode"
              type="text"
              required
              placeholder="Contoh: PASS-89X4K2"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-mono text-sm font-bold tracking-wider text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-amber-400"
            />
            <span class="absolute right-3 text-xs font-semibold text-gray-400">Acak / Custom</span>
          </div>
        </div>

        <!-- Modal Actions Footer -->
        <div class="flex justify-end items-center gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            @click="isTicketModalOpen = false"
            class="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSaving || isEventFull"
            class="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span v-if="!isSaving">🎟 Terbitkan Tiket</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              Menerbitkan...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL 1: VIEW E-TIKET & VISUAL BARCODE -->
  <div v-if="isPreviewTicketModalOpen && selectedPreviewTicket" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
    <div class="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-100 dark:border-gray-700/70 dark:bg-gray-900 my-8 overflow-hidden transition-all">
      <!-- Header E-Ticket Card -->
      <div class="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white text-center relative">
        <button
          @click="isPreviewTicketModalOpen = false"
          class="absolute top-4 right-4 text-white/80 hover:text-white rounded-full bg-black/20 p-1.5 transition"
        >
          ✕
        </button>
        <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
          Official Event Pass
        </span>
        <h3 class="text-xl font-extrabold tracking-tight">
          {{ selectedPreviewTicket.event?.event_name || getEventName(selectedPreviewTicket.event_id) }}
        </h3>
        <p class="text-xs text-white/80 mt-1 flex items-center justify-center gap-1">
          📍 {{ selectedPreviewTicket.event?.location || getEventLocation(selectedPreviewTicket.event_id) }}
        </p>
      </div>

      <!-- Ticket Body -->
      <div class="p-6 space-y-5">
        <!-- Status Presensi Pill -->
        <div class="flex items-center justify-between pb-3 border-b border-dashed border-gray-200 dark:border-gray-800">
          <div>
            <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Nama Peserta</span>
            <span class="text-base font-bold text-gray-900 dark:text-white">
              {{ getAttendeeName(selectedPreviewTicket) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
              {{ getAttendeeEmail(selectedPreviewTicket) }}
            </span>
          </div>
          <div class="text-right">
            <span
              :class="[
                selectedPreviewTicket.is_scanned
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border'
              ]"
            >
              <span class="h-2 w-2 rounded-full" :class="selectedPreviewTicket.is_scanned ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              {{ selectedPreviewTicket.is_scanned ? 'SUDAH HADIR' : 'BELUM SCAN' }}
            </span>
          </div>
        </div>

        <!-- Visual QR Code Container (Bukan Garis-Garis) -->
        <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/80 p-5 border border-gray-200/70 dark:border-gray-700/60 text-center">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Tunjukkan QR Code ini di Meja Registrasi</p>
          
          <!-- Authentic 2D QR Code Container -->
          <div class="bg-white p-4 rounded-2xl inline-flex flex-col items-center justify-center border border-gray-200 shadow-md mx-auto">
            <!-- QR Code Render (High Quality 2D Matrix API with Fallback Matrix) -->
            <div class="relative w-48 h-48 flex items-center justify-center bg-white rounded-lg p-1 overflow-hidden">
              <img
                :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedPreviewTicket.barcode || '')}&margin=0`"
                :alt="selectedPreviewTicket.barcode"
                class="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            
            <div class="mt-2.5 flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Kode Tiket:</span>
              <span class="font-mono text-xs font-extrabold tracking-widest text-gray-900">
                {{ selectedPreviewTicket.barcode }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi di Modal Preview -->
        <div class="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            @click="isPreviewTicketModalOpen = false"
            class="w-1/2 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            Tutup
          </button>
          <button
            v-if="!selectedPreviewTicket.is_scanned"
            type="button"
            @click="performCheckIn(selectedPreviewTicket.barcode || '')"
            class="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-1.5"
          >
            <span>📷</span> Scan Masuk Sekarang
          </button>
          <button
            v-else
            disabled
            type="button"
            class="w-1/2 rounded-xl bg-gray-200 py-2.5 text-sm font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
          >
            ✓ Sudah Digunakan
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL 2: PEMINDAI BARCODE (BARCODE SCANNER SIMULATOR) -->
  <div v-if="isScannerModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
    <div class="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-100 dark:border-gray-700/80 dark:bg-gray-900 my-8 p-6 transition-all">
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
            📷
          </span>
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              Pemindai Tiket Acara
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Scan barcode tiket untuk check-in otomatis
            </p>
          </div>
        </div>
        <button
          @click="isScannerModalOpen = false"
          class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition"
        >
          ✕
        </button>
      </div>

      <!-- Live Scanner Mockup Box with Laser animation -->
      <div class="mt-4 relative rounded-2xl bg-gray-950 p-6 flex flex-col items-center justify-center border border-gray-800 overflow-hidden min-h-[160px]">
        <!-- Laser Scanner Bar Animation -->
        <div class="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse"></div>
        
        <div class="border-2 border-dashed border-emerald-500/50 rounded-xl p-6 w-full max-w-[240px] flex flex-col items-center text-center">
          <span class="text-3xl">📷</span>
          <span class="mt-2 text-xs font-mono text-emerald-400">Arahkan Alat Scan / Ketik Kode</span>
        </div>
      </div>

      <!-- Feedback Alert Banner -->
      <div v-if="scanFeedback" class="mt-4 rounded-xl p-3.5 text-sm flex items-start gap-2.5 transition-all" :class="scanFeedback.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'">
        <span class="text-base leading-none">{{ scanFeedback.success ? '✅' : '❌' }}</span>
        <div>
          <p class="font-bold">{{ scanFeedback.title }}</p>
          <p class="text-xs mt-0.5 opacity-90">{{ scanFeedback.message }}</p>
        </div>
      </div>

      <!-- Input Manual / Scanner Gun Input -->
      <form @submit.prevent="submitBarcodeScan" class="mt-4 space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
            Input Kode Barcode
          </label>
          <div class="relative flex items-center">
            <input
              ref="scannerInputRef"
              v-model="scannedBarcodeInput"
              type="text"
              placeholder="Misal: TCK-549769"
              required
              autofocus
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-mono text-sm font-bold tracking-wider text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <p class="mt-1 text-[11px] text-gray-400">
            Dapat menerima input otomatis dari Barcode Scanner USB / Gun Scanner
          </p>
        </div>

        <div class="flex justify-end items-center gap-2 pt-2">
          <button
            type="button"
            @click="isScannerModalOpen = false"
            class="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            Selesai
          </button>
          <button
            type="submit"
            :disabled="isScanning"
            class="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            <span>⚡ Verifikasi & Check-In</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { eventsService } from '@/services/marketing/events.service'
import type { IEventDto, IEventTicketDto } from '@/types/marketing/events.dto'

const activeTab = ref<'events' | 'tickets'>('events')
const records = ref<IEventDto[]>([])
const tickets = ref<IEventTicketDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Modal Acara
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<{
  id: number | null
  event_name: string
  location: string
  max_capacity: number
  status: 'Open' | 'Ongoing' | 'Completed'
}>({
  id: null,
  event_name: '',
  location: 'Online Webinar',
  max_capacity: 100,
  status: 'Open'
})

// Modal Tiket
const isTicketModalOpen = ref(false)
const partners = ref<any[]>([])
const attendeeType = ref<'partner' | 'walkin'>('partner')

const ticketFormData = ref<{
  event_id: number | null
  customer_id: number | null
  attendee_name: string
  attendee_email: string
  barcode: string
}>({
  event_id: null,
  customer_id: null,
  attendee_name: '',
  attendee_email: '',
  barcode: ''
})

// Computations
const scannedCount = computed(() => tickets.value.filter(t => t.is_scanned).length)
const avgCapacityRate = computed(() => {
  if (records.value.length === 0) return 0
  const totalCap = records.value.reduce((acc, curr) => acc + (curr.max_capacity || 100), 0)
  if (totalCap === 0) return 0
  return Math.round((tickets.value.length / totalCap) * 100)
})

// Filter & Search pada Tab Tiket
const selectedEventFilter = ref<number | 'all'>('all')
const ticketSearchQuery = ref('')
const selectedStatusFilter = ref<'all' | 'scanned' | 'unscanned'>('all')

const getRegisteredCount = (eventId?: number) => {
  if (!eventId) return 0
  return tickets.value.filter(t => t.event_id === eventId).length
}

const getEventName = (eventId?: number) => {
  if (!eventId) return 'Acara Terpilih'
  const ev = records.value.find(r => r.id === eventId)
  return ev?.event_name || 'Acara Terpilih'
}

const getEventLocation = (eventId?: number) => {
  if (!eventId) return 'Grand Ballroom / Online'
  const ev = records.value.find(r => r.id === eventId)
  return ev?.location || 'Grand Ballroom / Online'
}

const getAttendeeName = (ticket: IEventTicketDto | null) => {
  if (!ticket) return 'Peserta Terdaftar'
  if (ticket.attendee_name && ticket.attendee_name.trim()) return ticket.attendee_name
  if (ticket.customer?.name) return ticket.customer.name
  if (ticket.customer_id) {
    const p = partners.value.find(item => item.id === ticket.customer_id)
    if (p && p.name) return p.name
  }
  return 'Peserta Terdaftar'
}

const getAttendeeEmail = (ticket: IEventTicketDto | null) => {
  if (!ticket) return 'Email belum diisi'
  if (ticket.attendee_email && ticket.attendee_email.trim()) return ticket.attendee_email
  if (ticket.customer?.email) return ticket.customer.email
  if (ticket.customer_id) {
    const p = partners.value.find(item => item.id === ticket.customer_id)
    if (p && p.email) return p.email
  }
  return 'Email belum diisi'
}

// Tiket yang difilter secara fleksibel (Acara + Search + Status Presensi)
const filteredTickets = computed(() => {
  return tickets.value.filter(t => {
    // 1. Filter Acara
    if (selectedEventFilter.value !== 'all' && t.event_id !== selectedEventFilter.value) {
      return false
    }
    // 2. Filter Status Presensi
    if (selectedStatusFilter.value === 'scanned' && !t.is_scanned) return false
    if (selectedStatusFilter.value === 'unscanned' && t.is_scanned) return false

    // 3. Filter Search Box (Nama / Email / Barcode)
    if (ticketSearchQuery.value.trim()) {
      const q = ticketSearchQuery.value.toLowerCase()
      const name = (t.attendee_name || t.customer?.name || '').toLowerCase()
      const email = (t.attendee_email || t.customer?.email || '').toLowerCase()
      const barcode = (t.barcode || '').toLowerCase()
      if (!name.includes(q) && !email.includes(q) && !barcode.includes(q)) {
        return false
      }
    }

    return true
  })
})

// Periksa kuota kapasitas acara terpilih
const selectedEventQuota = computed(() => {
  if (!ticketFormData.value.event_id) return null
  const ev = records.value.find(r => r.id === ticketFormData.value.event_id)
  if (!ev) return null
  const max = ev.max_capacity || 100
  const registered = getRegisteredCount(ev.id)
  const remaining = Math.max(0, max - registered)
  return { max, registered, remaining }
})

const isEventFull = computed(() => {
  if (!selectedEventQuota.value) return false
  return selectedEventQuota.value.remaining <= 0
})

const onSelectPartner = () => {
  if (!ticketFormData.value.customer_id) return
  const p = partners.value.find(item => item.id === ticketFormData.value.customer_id)
  if (p) {
    ticketFormData.value.attendee_name = p.name || ''
    ticketFormData.value.attendee_email = p.email || ''
  }
}

const regenerateBarcode = () => {
  // Generate random prefix bervariasi (EVT, PASS, TCK, VIP, REG, atau kode huruf acak)
  const prefixes = ['EVT', 'PASS', 'VIP', 'REG', 'TCK', 'EXP']
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  
  // Random alphanumeric string 6-8 karakter (angka & huruf besar)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Karakter mudah dibaca tanpa 0/O/1/I
  let randomCode = ''
  for (let i = 0; i < 6; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  ticketFormData.value.barcode = `${randomPrefix}-${randomCode}`
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [events, allTickets, allPartners] = await Promise.all([
      eventsService.getAll(),
      eventsService.getAllTickets(),
      eventsService.getPartners()
    ])
    records.value = events || []
    tickets.value = allTickets || []
    partners.value = allPartners || []
  } catch (err: any) {
    error.value = 'Gagal memuat acara: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: IEventDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id || null,
      event_name: data.event_name || '',
      location: data.location || 'Online Webinar',
      max_capacity: data.max_capacity || 100,
      status: data.status || 'Open'
    }
  } else {
    formData.value = {
      id: null,
      event_name: '',
      location: 'Online Webinar',
      max_capacity: 100,
      status: 'Open'
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      await eventsService.update(formData.value.id, formData.value)
    } else {
      await eventsService.create(formData.value)
    }
    closeModal()
    await fetchData()
  } catch (err: any) {
    alert('Gagal menyimpan acara: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus acara ini?')) return
  try {
    await eventsService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

const openTicketModal = () => {
  if (!ticketFormData.value.event_id && records.value.length > 0) {
    ticketFormData.value.event_id = records.value[0].id || null
  }
  attendeeType.value = 'partner'
  ticketFormData.value.customer_id = null
  ticketFormData.value.attendee_name = ''
  ticketFormData.value.attendee_email = ''
  regenerateBarcode()
  isTicketModalOpen.value = true
}

const saveTicket = async () => {
  if (isEventFull.value) {
    alert('Kapasitas acara sudah penuh!')
    return
  }
  isSaving.value = true
  try {
    const payload = {
      ...ticketFormData.value,
      customer_id: attendeeType.value === 'partner' && ticketFormData.value.customer_id ? ticketFormData.value.customer_id : null
    }
    await eventsService.createTicket(payload)
    isTicketModalOpen.value = false
    await fetchData()
  } catch (err: any) {
    alert('Gagal menerbitkan tiket: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

// Modal Preview Tiket & Barcode
const isPreviewTicketModalOpen = ref(false)
const selectedPreviewTicket = ref<IEventTicketDto | null>(null)

// Modal Scanner Barcode
const isScannerModalOpen = ref(false)
const scannedBarcodeInput = ref('')
const isScanning = ref(false)
const scanFeedback = ref<{ success: boolean; title: string; message: string } | null>(null)
const scannerInputRef = ref<HTMLInputElement | null>(null)

const viewTicketDetail = (ticket: IEventTicketDto) => {
  selectedPreviewTicket.value = ticket
  isPreviewTicketModalOpen.value = true
}

const openScannerModal = () => {
  scannedBarcodeInput.value = ''
  scanFeedback.value = null
  isScannerModalOpen.value = true
  setTimeout(() => {
    scannerInputRef.value?.focus()
  }, 150)
}

// Eksekusi Check-In melalui Barcode (Dengan Proteksi Anti-Duplikasi)
const performCheckIn = async (barcode: string) => {
  if (!barcode) return
  try {
    const result = await eventsService.scanTicket(barcode)
    // Update data tiket lokal jika sedang preview
    if (selectedPreviewTicket.value && selectedPreviewTicket.value.barcode === barcode) {
      selectedPreviewTicket.value.is_scanned = true
    }
    await fetchData()
    alert(`Check-in Berhasil!\nPeserta: ${result.attendee_name || 'Tamu'}\nBarcode: ${barcode}`)
  } catch (err: any) {
    const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal melakukan check-in'
    alert(`⚠️ Presensi Ditolak:\n${msg}`)
  }
}

// Submit dari Pemindai / Barcode Scanner Gun
const submitBarcodeScan = async () => {
  const code = scannedBarcodeInput.value.trim()
  if (!code) return
  isScanning.value = true
  scanFeedback.value = null

  try {
    const result = await eventsService.scanTicket(code)
    scanFeedback.value = {
      success: true,
      title: 'Check-In Sukses!',
      message: `Peserta "${result.attendee_name || 'Tamu'}" resmi tercatat hadir di acara.`
    }
    scannedBarcodeInput.value = ''
    await fetchData()
  } catch (err: any) {
    const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Presensi gagal.'
    scanFeedback.value = {
      success: false,
      title: 'Scan Ditolak (Tidak Valid / Sudah Digunakan)',
      message: errMsg
    }
  } finally {
    isScanning.value = false
    setTimeout(() => {
      scannerInputRef.value?.focus()
    }, 100)
  }
}

const toggleScanTicket = async (ticket: IEventTicketDto) => {
  if (!ticket.id || !ticket.barcode) return
  // Jika belum scanned, lakukan check in resmi via scanTicket
  if (!ticket.is_scanned) {
    await performCheckIn(ticket.barcode)
  } else {
    alert('Tiket ini sudah terverifikasi dan tidak dapat di-scan ulang!')
  }
}

const deleteTicket = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus tiket ini?')) return
  try {
    await eventsService.deleteTicket(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus tiket: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchData()
})
</script>
