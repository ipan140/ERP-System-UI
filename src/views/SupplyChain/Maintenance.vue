<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </span>
            Perawatan Mesin (Maintenance & TPM)
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo 18 Maintenance & Mekari SCM: Manajemen mesin pabrik terhubung Pusat Kerja (Work Centers), tiket servis korektif (rusak), dan jadwal pemeliharaan berkala (*Preventive Maintenance*).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Refresh -->
          <button
            @click="refreshCurrentTab"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            title="Muat Ulang Data"
          >
            <svg :class="['w-4 h-4', { 'animate-spin': isLoading }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>

          <!-- Export CSV -->
          <button
            @click="exportCsv"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            title="Ekspor CSV"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>

          <!-- Action based on Active Tab -->
          <button
            v-if="activeTab === 'requests'"
            @click="openCreateRequestModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Tiket Perawatan
          </button>

          <button
            v-else-if="activeTab === 'equipments'"
            @click="openCreateEquipmentModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Mesin / Aset
          </button>
        </div>
      </div>

      <!-- Executive KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Maintenance Requests -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Tiket Servis</p>
              <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                {{ summaryData.total_requests }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">
                {{ summaryData.total_equipments }} Mesin & Peralatan
              </p>
            </div>
            <div class="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: To Do / Menunggu Servis -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Antrean Servis (To Do)</p>
              <h3 class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {{ summaryData.todo_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Menunggu Jadwal / Teknisi</p>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Sedang Dikerjakan (In Progress) -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sedang Dikerjakan</p>
              <h3 class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {{ summaryData.in_progress_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Dalam Penanganan Teknisi</p>
            </div>
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: Selesai Diperbaiki (Done) -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selesai (Done)</p>
              <h3 class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {{ summaryData.done_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Mesin Kembali Operasional</p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-6">
          <button
            @click="switchTab('requests')"
            :class="[
              'py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition',
              activeTab === 'requests'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            Permintaan & Tiket Servis
            <span class="ml-1.5 px-2 py-0.5 text-2xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
              {{ paginationRequests.total_items }}
            </span>
          </button>

          <button
            @click="switchTab('equipments')"
            :class="[
              'py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition',
              activeTab === 'equipments'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Mesin & Peralatan Pabrik
            <span class="ml-1.5 px-2 py-0.5 text-2xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              {{ paginationEquipments.total_items }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Main Content Card -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-xs overflow-hidden">
        <!-- Filter Toolbar -->
        <div class="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3 w-full sm:w-auto flex-1">
            <!-- Search -->
            <div class="relative w-full sm:w-80">
              <input
                type="text"
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="Cari kode tiket, nama mesin, deskripsi..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 pl-10 text-xs text-gray-800 dark:text-gray-200 focus:border-orange-500 focus:outline-none"
              />
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                &times;
              </button>
            </div>

            <!-- Filters for Requests -->
            <div v-if="activeTab === 'requests'" class="flex items-center gap-2">
              <select
                v-model="selectedState"
                @change="handleFilterChange"
                class="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancel">Cancel</option>
              </select>

              <select
                v-model="selectedType"
                @change="handleFilterChange"
                class="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:outline-none"
              >
                <option value="all">Semua Jenis Servis</option>
                <option value="corrective">Korektif (Perbaikan Rusak)</option>
                <option value="preventive">Preventif (Rutin)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Alert Notification -->
        <div v-if="error" class="p-4">
          <Alert variant="error" title="Terjadi Kesalahan" :message="error" />
        </div>

        <!-- TAB 1: Maintenance Requests Table -->
        <div v-if="activeTab === 'requests'" class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left text-xs">
            <thead class="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">ID & Kode Tiket</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Subjek Perawatan</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Mesin / Peralatan</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Jenis</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Prioritas</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-center">Status Alur Kerja</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Durasi (Jam)</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="8" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-7 h-7 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat data permintaan servis...</p>
                </td>
              </tr>
              <tr v-else-if="maintenanceRequests.length === 0">
                <td colspan="8" class="py-12 text-center text-gray-400">
                  Belum ada tiket servis yang sesuai dengan kriteria filter.
                </td>
              </tr>
              <tr
                v-for="req in maintenanceRequests"
                :key="req.id"
                class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
              >
                <!-- Code & ID -->
                <td class="px-4 py-3.5 font-mono text-gray-900 dark:text-white font-semibold">
                  <div class="flex items-center gap-1.5">
                    <span>{{ req.code || `MR-${String(req.id).padStart(4, '0')}` }}</span>
                  </div>
                  <span class="text-3xs text-gray-400">#{{ req.id }}</span>
                </td>

                <!-- Subject Name -->
                <td class="px-4 py-3.5">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ req.name }}
                  </div>
                  <span v-if="req.notes" class="text-3xs text-gray-400 line-clamp-1">
                    {{ req.notes }}
                  </span>
                </td>

                <!-- Equipment -->
                <td class="px-4 py-3.5">
                  <div class="font-medium text-gray-800 dark:text-gray-200">
                    {{ req.equipment?.name || `Mesin #${req.equipment_id}` }}
                  </div>
                  <span v-if="req.equipment?.category" class="text-3xs text-gray-400">
                    {{ req.equipment.category }}
                  </span>
                </td>

                <!-- Type -->
                <td class="px-4 py-3.5">
                  <span
                    v-if="req.type === 'preventive'"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-3xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Preventif (Rutin)
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-3xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /></svg>
                    Korektif (Rusak)
                  </span>
                </td>

                <!-- Priority -->
                <td class="px-4 py-3.5">
                  <span
                    v-if="req.priority === 'urgent'"
                    class="inline-flex items-center px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300"
                  >
                    Urgent
                  </span>
                  <span
                    v-else-if="req.priority === 'high'"
                    class="inline-flex items-center px-2 py-0.5 rounded text-3xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                  >
                    High
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-0.5 rounded text-3xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    Normal
                  </span>
                </td>

                <!-- Workflow State -->
                <td class="px-4 py-3.5 text-center">
                  <span
                    v-if="req.state === 'done'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                    DONE
                  </span>
                  <span
                    v-else-if="req.state === 'progress'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <svg class="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                    IN PROGRESS
                  </span>
                  <span
                    v-else-if="req.state === 'cancel'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                  >
                    CANCEL
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /></svg>
                    TO DO
                  </span>
                </td>

                <!-- Duration -->
                <td class="px-4 py-3.5 font-mono text-gray-800 dark:text-gray-200">
                  <span v-if="req.duration && req.duration > 0" class="font-bold">
                    {{ req.duration }} Jam
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>

                <!-- Actions: Icon-only with tooltips -->
                <td class="px-4 py-3.5 text-right">
                  <div class="inline-flex items-center gap-1 justify-end">
                    <!-- State Action: Progress (Start repair) -->
                    <button
                      v-if="req.state === 'todo'"
                      @click="quickUpdateState(req, 'progress')"
                      class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40 transition"
                      title="Mulai Perbaikan (In Progress)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>

                    <!-- State Action: Complete (Mark as Done) -->
                    <button
                      v-if="req.state === 'progress'"
                      @click="openCompleteStateModal(req)"
                      class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition"
                      title="Tandai Selesai Diperbaiki (Done)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </button>

                    <!-- Edit / Transition State Modal -->
                    <button
                      @click="openStateModal(req)"
                      class="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/40 transition"
                      title="Ubah Status / Catatan Servis"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <!-- Detail Action -->
                    <button
                      @click="openDetailModal(req)"
                      class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"
                      title="Lihat Detail Tiket"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <!-- Delete Action -->
                    <button
                      @click="confirmDeleteRequest(req)"
                      class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                      title="Hapus Tiket"
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

          <!-- Pagination Bar for Requests -->
          <PaginationBar
            :pagination="paginationRequests"
            @change="handlePaginationRequestsChange"
          />
        </div>

        <!-- TAB 2: Equipments Table -->
        <div v-else-if="activeTab === 'equipments'" class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left text-xs">
            <thead class="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Nama Mesin / Aset</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Kategori</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Pusat Kerja (Work Center)</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Biaya / Nilai Aset</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Jadwal Servis Berikutnya</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="7" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat data mesin & peralatan...</p>
                </td>
              </tr>
              <tr v-else-if="equipments.length === 0">
                <td colspan="7" class="py-12 text-center text-gray-400">
                  Belum ada mesin atau aset terdaftar.
                </td>
              </tr>
              <tr
                v-for="eq in equipments"
                :key="eq.id"
                class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
              >
                <td class="px-4 py-3.5 font-mono text-gray-500 dark:text-gray-400">
                  #{{ eq.id }}
                </td>
                <td class="px-4 py-3.5 font-semibold text-gray-900 dark:text-white">
                  {{ eq.name }}
                </td>
                <td class="px-4 py-3.5 text-gray-700 dark:text-gray-300">
                  {{ eq.category || 'Mesin Umum' }}
                </td>
                <td class="px-4 py-3.5">
                  <span v-if="eq.workcenter" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-3xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ eq.workcenter.name || `Pusat Kerja #${eq.workcenter_id}` }}
                  </span>
                  <span v-else-if="eq.workcenter_id" class="text-3xs text-gray-400">
                    Pusat Kerja #{{ eq.workcenter_id }}
                  </span>
                  <span v-else class="text-3xs text-gray-400 italic">
                    Belum Terpetakan
                  </span>
                </td>
                <td class="px-4 py-3.5 font-mono font-medium text-gray-900 dark:text-white">
                  {{ formatRupiah(eq.cost || 0) }}
                </td>
                <td class="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                  {{ formatDate(eq.next_action_date) }}
                </td>
                <td class="px-4 py-3.5 text-right">
                  <button
                    @click="confirmDeleteEquipment(eq)"
                    class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                    title="Hapus Mesin"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination Bar for Equipments -->
          <PaginationBar
            :pagination="paginationEquipments"
            @change="handlePaginationEquipmentsChange"
          />
        </div>
      </div>

      <!-- MODAL 1: Buat Tiket Perawatan Baru -->
      <Teleport to="body">
      <div
        v-if="isCreateRequestModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      >
        <div class="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Buat Tiket Perawatan Mesin</h3>
                <p class="text-2xs text-gray-400">Jadwalkan perbaikan korektif atau servis preventif berkala</p>
              </div>
            </h3>
            <button @click="isCreateRequestModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <form @submit.prevent="submitCreateRequest" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Subjek / Masalah Perawatan <span class="text-rose-500">*</span>
              </label>
              <input
                type="text"
                v-model="createRequestForm.name"
                required
                placeholder="Contoh: Penggantian Bearing Dinamo Utama"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Pilih Mesin / Peralatan <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="createRequestForm.equipment_id"
                  required
                  class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                <option value="0" disabled>-- Pilih Mesin --</option>
                <option v-for="eq in equipments" :key="eq.id" :value="eq.id">
                  {{ eq.name }} ({{ eq.category || 'Aset Pabrik' }})
                </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Servis <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="createRequestForm.type"
                    required
                    class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                  <option value="corrective">Korektif (Perbaikan Rusak)</option>
                  <option value="preventive">Preventif (Servis Rutin)</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Prioritas
                </label>
                <div class="relative">
                  <select
                    v-model="createRequestForm.priority"
                    class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                  <option value="low">Rendah (Low)</option>
                  <option value="normal">Normal</option>
                  <option value="high">Tinggi (High)</option>
                  <option value="urgent">Mendesak (Urgent)</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Jadwal Servis (Tanggal)
                </label>
                <input
                  type="date"
                  v-model="createRequestForm.schedule_date"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Estimasi Durasi (Jam)
                </label>
                <input
                  type="number"
                  step="0.5"
                  v-model.number="createRequestForm.duration"
                  placeholder="2.0"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Catatan Gejala / Kerusakan
              </label>
              <textarea
                v-model="createRequestForm.notes"
                rows="2"
                placeholder="Deskripsi kerusakan, komponen aus, atau catatan teknis..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-orange-500 focus:outline-none"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateRequestModalOpen = false"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="rounded-lg bg-orange-600 hover:bg-orange-700 px-5 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Tiket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

      <!-- MODAL 2: Update Status Alur Kerja Servis -->
      <Teleport to="body">
      <div
        v-if="isStateModalOpen && activeRequest"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm backdrop-blur-xs overflow-y-auto"
      >
        <div class="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
              </span>
              Perbarui Alur Kerja Servis
            </h3>
            <button @click="isStateModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-1.5 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-500">Tiket:</span>
              <span class="font-mono font-bold text-gray-900 dark:text-white">{{ activeRequest.code || `MR-${activeRequest.id}` }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Mesin:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ activeRequest.equipment?.name || `Mesin #${activeRequest.equipment_id}` }}</span>
            </div>
          </div>

          <form @submit.prevent="submitUpdateState" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Pilih Status Baru <span class="text-rose-500">*</span>
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  @click="stateForm.state = 'todo'"
                  :class="[
                    'py-2 text-2xs font-bold rounded-lg border transition',
                    stateForm.state === 'todo'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  TO DO
                </button>
                <button
                  type="button"
                  @click="stateForm.state = 'progress'"
                  :class="[
                    'py-2 text-2xs font-bold rounded-lg border transition',
                    stateForm.state === 'progress'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  PROGRESS
                </button>
                <button
                  type="button"
                  @click="stateForm.state = 'done'"
                  :class="[
                    'py-2 text-2xs font-bold rounded-lg border transition',
                    stateForm.state === 'done'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  DONE
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Durasi Pengerjaan Aktual (Jam)
              </label>
              <input
                type="number"
                step="0.5"
                v-model.number="stateForm.duration"
                placeholder="2.0"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-200 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Catatan Tindakan Teknisi
              </label>
              <textarea
                v-model="stateForm.notes"
                rows="2"
                placeholder="Tindakan yang telah dilakukan, part pengganti yang dipasang..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-orange-500 focus:outline-none"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isStateModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Perbarui Status' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

      <!-- MODAL 3: Tambah Mesin / Peralatan Pabrik Baru -->
      <Teleport to="body">
      <div
        v-if="isCreateEquipmentModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm backdrop-blur-xs overflow-y-auto"
      >
        <div class="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </span>
              Tambah Mesin / Peralatan Pabrik
            </h3>
            <button @click="isCreateEquipmentModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <form @submit.prevent="submitCreateEquipment" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nama Mesin / Aset <span class="text-rose-500">*</span>
              </label>
              <input
                type="text"
                v-model="createEquipmentForm.name"
                required
                placeholder="Contoh: Mesin CNC Milling Haas VF-2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Kategori Mesin
              </label>
              <input
                type="text"
                v-model="createEquipmentForm.category"
                placeholder="Contoh: Mesin Pemotong, Conveyor, Kompresor"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Pusat Kerja MRP Terhubung (Work Center)
              </label>
              <select
                v-model="createEquipmentForm.workcenter_id"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none"
              >
                <option :value="undefined">-- Tanpa Pusat Kerja Spesifik --</option>
                <option v-for="wc in workcenters" :key="wc.id" :value="wc.id">
                  {{ wc.name }} (ID: {{ wc.id }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nilai Aset / Biaya (Rp)
                </label>
                <input
                  type="number"
                  v-model.number="createEquipmentForm.cost"
                  placeholder="50000000"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Jadwal Servis Pertama
                </label>
                <input
                  type="date"
                  v-model="createEquipmentForm.next_action_date"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateEquipmentModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Mesin' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

      <!-- MODAL 4: Detail Tiket Servis -->
      <Teleport to="body">
      <div
        v-if="isDetailModalOpen && activeRequest"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm backdrop-blur-xs overflow-y-auto"
      >
        <div class="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </span>
              Rincian Tiket Perawatan #{{ activeRequest.id }}
            </h3>
            <button @click="isDetailModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Kode Tiket</span>
                <strong class="text-gray-900 dark:text-white font-mono">{{ activeRequest.code || `MR-${activeRequest.id}` }}</strong>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Status Alur Kerja</span>
                <span
                  v-if="activeRequest.state === 'done'"
                  class="font-bold text-emerald-600 dark:text-emerald-400"
                >DONE (Selesai)</span>
                <span
                  v-else-if="activeRequest.state === 'progress'"
                  class="font-bold text-blue-600 dark:text-blue-400"
                >IN PROGRESS (Sedang Dikerjakan)</span>
                <span v-else class="font-bold text-amber-600 dark:text-amber-400">TO DO (Antrean)</span>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Subjek Permintaan</span>
                <strong class="text-gray-900 dark:text-white">{{ activeRequest.name }}</strong>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Mesin Terkait</span>
                <strong class="text-gray-900 dark:text-white">{{ activeRequest.equipment?.name || `Mesin #${activeRequest.equipment_id}` }}</strong>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Jenis Servis</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ activeRequest.type === 'preventive' ? 'Preventif (Rutin)' : 'Korektif (Rusak)' }}
                </span>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Prioritas</span>
                <span class="font-bold uppercase text-gray-800 dark:text-gray-200">{{ activeRequest.priority || 'Normal' }}</span>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Durasi Pengerjaan</span>
                <span class="font-mono font-bold text-gray-800 dark:text-gray-200">{{ activeRequest.duration || 0 }} Jam</span>
              </div>
            </div>

            <div v-if="activeRequest.notes" class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/30">
              <span class="text-3xs text-gray-400 uppercase tracking-wider block mb-1">Catatan Servis</span>
              <p class="text-gray-700 dark:text-gray-300 italic">{{ activeRequest.notes }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import Alert from '@/components/ui/Alert.vue'
import type { IPaginationMeta } from '@/types'
import type {
  IMaintenanceRequestDto,
  IMaintenanceEquipmentDto,
  IMaintenanceSummary,
  ICreateMaintenanceRequestPayload,
  IUpdateMaintenanceStatePayload,
  ICreateMaintenanceEquipmentPayload,
} from '@/types/supply-chain/maintenance.dto'
import { maintenanceService } from '@/services/supply-chain/maintenance.service'
import { manufacturingService } from '@/services/supply-chain/manufacturing.service'

// Tab state
const activeTab = ref<'requests' | 'equipments'>('requests')

// Loading & Error States
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Data state
const maintenanceRequests = ref<IMaintenanceRequestDto[]>([])
const equipments = ref<IMaintenanceEquipmentDto[]>([])
const workcenters = ref<any[]>([])

// Summary Data
const summaryData = ref<IMaintenanceSummary>({
  total_requests: 0,
  todo_count: 0,
  in_progress_count: 0,
  done_count: 0,
  total_equipments: 0,
})

// Pagination
const paginationRequests = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false,
})

const paginationEquipments = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false,
})

// Filters
const searchQuery = ref('')
const selectedState = ref('all')
const selectedType = ref('all')

// Modals
const isCreateRequestModalOpen = ref(false)
const isStateModalOpen = ref(false)
const isCreateEquipmentModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const activeRequest = ref<IMaintenanceRequestDto | null>(null)

// Forms
const createRequestForm = ref<ICreateMaintenanceRequestPayload>({
  name: '',
  equipment_id: 0,
  type: 'corrective',
  priority: 'normal',
  schedule_date: new Date().toISOString().slice(0, 10),
  duration: 1,
  notes: '',
})

const stateForm = ref<IUpdateMaintenanceStatePayload>({
  state: 'progress',
  duration: 0,
  notes: '',
})

const createEquipmentForm = ref<ICreateMaintenanceEquipmentPayload>({
  name: '',
  category: '',
  workcenter_id: undefined,
  cost: 0,
  next_action_date: new Date().toISOString().slice(0, 10),
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchSummary(),
    fetchRequests(),
    fetchEquipments(),
    fetchWorkcenters(),
  ])
})

// Methods
const fetchSummary = async () => {
  try {
    const res = await maintenanceService.getSummary()
    if (res) summaryData.value = res
  } catch (e) {
    console.error('Failed to load maintenance summary', e)
  }
}

const fetchRequests = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await maintenanceService.getAll({
      page: paginationRequests.value.current_page,
      limit: paginationRequests.value.per_page,
      search: searchQuery.value,
      state: selectedState.value,
      type: selectedType.value,
    })
    maintenanceRequests.value = res.data
    if (res.pagination) {
      paginationRequests.value = res.pagination
    }
  } catch (e: any) {
    error.value = e?.message || 'Gagal memuat daftar tiket servis'
  } finally {
    isLoading.value = false
  }
}

const fetchEquipments = async () => {
  try {
    const res = await maintenanceService.getEquipments({
      page: paginationEquipments.value.current_page,
      limit: paginationEquipments.value.per_page,
      search: searchQuery.value,
    })
    equipments.value = res.data
    if (res.pagination) {
      paginationEquipments.value = res.pagination
    }
    if (res.data.length > 0 && createRequestForm.value.equipment_id === 0) {
      createRequestForm.value.equipment_id = res.data[0].id || 0
    }
  } catch (e) {
    console.error('Failed to load equipments', e)
  }
}

const fetchWorkcenters = async () => {
  try {
    const wcs = await manufacturingService.getWorkcenters()
    workcenters.value = wcs
  } catch (e) {
    console.error('Failed to load workcenters', e)
  }
}

const switchTab = (tab: 'requests' | 'equipments') => {
  activeTab.value = tab
  searchQuery.value = ''
  if (tab === 'requests') fetchRequests()
  else fetchEquipments()
}

const refreshCurrentTab = () => {
  fetchSummary()
  if (activeTab.value === 'requests') fetchRequests()
  else fetchEquipments()
}

const handleSearch = () => {
  if (activeTab.value === 'requests') {
    paginationRequests.value.current_page = 1
    fetchRequests()
  } else {
    paginationEquipments.value.current_page = 1
    fetchEquipments()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const handleFilterChange = () => {
  paginationRequests.value.current_page = 1
  fetchRequests()
}

const handlePaginationRequestsChange = (payload: { page: number; limit: number }) => {
  paginationRequests.value.current_page = payload.page
  paginationRequests.value.per_page = payload.limit
  fetchRequests()
}

const handlePaginationEquipmentsChange = (payload: { page: number; limit: number }) => {
  paginationEquipments.value.current_page = payload.page
  paginationEquipments.value.per_page = payload.limit
  fetchEquipments()
}

// Modal Actions
const openCreateRequestModal = () => {
  createRequestForm.value = {
    name: '',
    equipment_id: equipments.value[0]?.id || 0,
    type: 'corrective',
    priority: 'normal',
    schedule_date: new Date().toISOString().slice(0, 10),
    duration: 1,
    notes: '',
  }
  isCreateRequestModalOpen.value = true
}

const submitCreateRequest = async () => {
  isSubmitting.value = true
  try {
    await maintenanceService.create(createRequestForm.value)
    isCreateRequestModalOpen.value = false
    await Promise.all([fetchSummary(), fetchRequests()])
  } catch (e: any) {
    alert('Gagal membuat tiket: ' + (e?.message || 'Error'))
  } finally {
    isSubmitting.value = false
  }
}

const quickUpdateState = async (req: IMaintenanceRequestDto, state: 'todo' | 'progress' | 'done' | 'cancel') => {
  if (!req.id) return
  try {
    await maintenanceService.updateState(req.id, { state })
    await Promise.all([fetchSummary(), fetchRequests()])
  } catch (e: any) {
    alert('Gagal memperbarui status: ' + (e?.message || 'Error'))
  }
}

const openStateModal = (req: IMaintenanceRequestDto) => {
  activeRequest.value = req
  stateForm.value = {
    state: (req.state as any) || 'progress',
    duration: req.duration || 0,
    notes: req.notes || '',
  }
  isStateModalOpen.value = true
}

const openCompleteStateModal = (req: IMaintenanceRequestDto) => {
  activeRequest.value = req
  stateForm.value = {
    state: 'done',
    duration: req.duration || 1,
    notes: req.notes || 'Perbaikan selesai dilaksanakan. Mesin beroperasi normal.',
  }
  isStateModalOpen.value = true
}

const submitUpdateState = async () => {
  if (!activeRequest.value?.id) return
  isSubmitting.value = true
  try {
    await maintenanceService.updateState(activeRequest.value.id, stateForm.value)
    isStateModalOpen.value = false
    await Promise.all([fetchSummary(), fetchRequests()])
  } catch (e: any) {
    alert('Gagal memperbarui alur servis: ' + (e?.message || 'Error'))
  } finally {
    isSubmitting.value = false
  }
}

const openCreateEquipmentModal = () => {
  createEquipmentForm.value = {
    name: '',
    category: '',
    workcenter_id: undefined,
    cost: 0,
    next_action_date: new Date().toISOString().slice(0, 10),
  }
  isCreateEquipmentModalOpen.value = true
}

const submitCreateEquipment = async () => {
  isSubmitting.value = true
  try {
    await maintenanceService.createEquipment(createEquipmentForm.value)
    isCreateEquipmentModalOpen.value = false
    await Promise.all([fetchSummary(), fetchEquipments()])
  } catch (e: any) {
    alert('Gagal menambahkan mesin: ' + (e?.message || 'Error'))
  } finally {
    isSubmitting.value = false
  }
}

const openDetailModal = (req: IMaintenanceRequestDto) => {
  activeRequest.value = req
  isDetailModalOpen.value = true
}

const confirmDeleteRequest = async (req: IMaintenanceRequestDto) => {
  if (!req.id) return
  if (!confirm(`Hapus tiket servis ${req.code || `#${req.id}`}?`)) return
  try {
    await maintenanceService.delete(req.id)
    await Promise.all([fetchSummary(), fetchRequests()])
  } catch (e: any) {
    alert('Gagal menghapus tiket: ' + (e?.message || 'Error'))
  }
}

const confirmDeleteEquipment = async (eq: IMaintenanceEquipmentDto) => {
  if (!eq.id) return
  if (!confirm(`Hapus mesin/peralatan "${eq.name}"?`)) return
  try {
    await maintenanceService.deleteEquipment(eq.id)
    await Promise.all([fetchSummary(), fetchEquipments()])
  } catch (e: any) {
    alert('Gagal menghapus mesin: ' + (e?.message || 'Error'))
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

const exportCsv = () => {
  const rows = maintenanceRequests.value.map(r => ({
    ID: r.id,
    Code: r.code || `MR-${r.id}`,
    Name: r.name,
    Equipment: r.equipment?.name || r.equipment_id,
    Type: r.type,
    Priority: r.priority,
    State: r.state,
    Duration: r.duration || 0,
    ScheduleDate: r.schedule_date || '',
  }))

  const header = ['ID', 'Code', 'Name', 'Equipment', 'Type', 'Priority', 'State', 'Duration', 'ScheduleDate']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [header.join(','), ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `maintenance_requests_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
