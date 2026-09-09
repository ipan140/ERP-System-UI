
<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Top Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageBreadcrumb pageTitle="Pencatatan Waktu (Timesheets)" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Pelacakan jam kerja teknisi & konsultan, rasio billable ke klien, dan kalkulasi HPP tenaga kerja
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="fetchData"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            Refresh
          </button>

          <button
            @click="exportCsv"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Ekspor CSV
          </button>

          <button
            @click="openModal('create')"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Catat Jam Kerja
          </button>
        </div>
      </div>

      <!-- Panduan Alur Pencatatan Waktu (Enterprise Timesheet Lifecycle Stepper) -->
      <div class="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-brand-500"></span>
            <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Alur Tata Kelola Pencatatan Waktu & Utilisasi SDM (Timesheet Lifecycle)
            </h4>
          </div>
          <span class="text-2xs text-gray-400">Standar Odoo 18 / Mekari Enterprise Timesheet</span>
        </div>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Step 1 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs">
              01
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Alokasi & Penugasan</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Tautkan ke Proyek & Task</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
              02
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Input Log Jam Kerja</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Pilah Billable vs Internal</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-xs">
              03
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Kalkulasi HPP & Review</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Durasi &times; Tarif Pokok SDM</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
              04
            </div>
            <div>
              <p class="text-xs font-bold text-emerald-900 dark:text-emerald-200">Klaim Termin Faktur</p>
              <p class="text-2xs text-emerald-700/80 dark:text-emerald-300/80">Tagihkan ke Invoice Proyek</p>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Jam Tercatat -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Jam Tercatat</span>
            <div class="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalHours.toFixed(1) }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Jam Total</span>
          </div>
          <p class="mt-1 text-2xs text-gray-400">{{ filteredRecords.length }} entri log jam kerja</p>
        </div>

        <!-- Jam Billable -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Jam Billable (Klien)</span>
            <div class="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ billableHours.toFixed(1) }}</span>
            <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Jam ({{ billableRatio.toFixed(1) }}%)</span>
          </div>
          <p class="mt-1 text-2xs text-gray-400">Siap ditagihkan ke invoice termin</p>
        </div>

        <!-- Jam Non-Billable -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Jam Non-Billable (Internal)</span>
            <div class="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-700 dark:text-gray-300">{{ nonBillableHours.toFixed(1) }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Jam ({{ (100 - billableRatio).toFixed(1) }}%)</span>
          </div>
          <p class="mt-1 text-2xs text-gray-400">Overhead internal, training, riset</p>
        </div>

        <!-- Estimasi Biaya Tenaga Kerja -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Beban HPP Tenaga Kerja</span>
            <div class="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatRupiah(totalLaborCost) }}</span>
          </div>
          <p class="mt-1 text-2xs text-gray-400">Kalkulasi: Durasi × Tarif Pokok Tenaga Kerja</p>
        </div>
      </div>

      <!-- Billable vs Non-Billable Visual Progress Bar -->
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-gray-800 dark:text-white">Efisiensi Utilisasi Billable</span>
            <span class="text-2xs px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              Target Enterprise: &ge; 75%
            </span>
          </div>
          <div class="flex items-center gap-4 text-2xs">
            <span class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Billable ({{ billableHours.toFixed(1) }}h)
            </span>
            <span class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <span class="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></span> Internal ({{ nonBillableHours.toFixed(1) }}h)
            </span>
          </div>
        </div>

        <div class="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 flex">
          <div
            class="h-full bg-emerald-500 transition-all duration-500"
            :style="{ width: `${totalHours > 0 ? (billableHours / totalHours) * 100 : 0}%` }"
            :title="`Billable: ${billableHours.toFixed(1)} Jam`"
          ></div>
          <div
            class="h-full bg-gray-300 dark:bg-gray-600 transition-all duration-500"
            :style="{ width: `${totalHours > 0 ? (nonBillableHours / totalHours) * 100 : 0}%` }"
            :title="`Non-Billable: ${nonBillableHours.toFixed(1)} Jam`"
          ></div>
        </div>
      </div>

      <!-- Main Filter and Table Card -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <!-- Fase 2: Approval Workflow Tabs & Bulk Action Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 px-4 pt-3 pb-0 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 gap-2">
          <div class="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              @click="activeApprovalTab = 'all'; onApprovalTabChange()"
              class="px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              :class="activeApprovalTab === 'all'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
            >
              Semua Log Kerja
            </button>
            <button
              type="button"
              @click="activeApprovalTab = 'pending'; onApprovalTabChange()"
              class="px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              :class="activeApprovalTab === 'pending'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
            >
              Menunggu Approval
              <span v-if="pendingCount > 0" class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {{ pendingCount }}
              </span>
            </button>
            <button
              type="button"
              @click="activeApprovalTab = 'approved'; onApprovalTabChange()"
              class="px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              :class="activeApprovalTab === 'approved'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
            >
              Telah Disetujui
            </button>
          </div>

          <!-- Bulk Approve Action Button -->
          <div v-if="selectedIds.length > 0" class="flex items-center gap-2 pb-2 self-end sm:self-auto">
            <span class="text-xs text-gray-500 font-medium">{{ selectedIds.length }} dipilih</span>
            <button
              type="button"
              @click="bulkApprove"
              :disabled="isProcessingApproval"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Setujui Terpilih
            </button>
          </div>
        </div>

        <!-- Toolbar & Filter Bar -->
        <div class="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search -->
          <div class="relative flex-1 max-w-sm">
            <input
              v-model="searchQuery"
              @input="onFilterChange"
              type="text"
              placeholder="Cari karyawan, proyek, atau uraian kerja..."
              class="w-full rounded-lg border border-gray-300 bg-transparent px-3.5 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>

          <!-- Select Filters & RBAC Switcher -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- RBAC View Switcher: Semua Tim vs Tugas Saya -->
            <button
              type="button"
              @click="myTasksOnly = !myTasksOnly; onFilterChange()"
              class="rounded-lg border px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
              :class="myTasksOnly
                ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-600'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'"
              :title="myTasksOnly ? 'Tampilkan seluruh tim' : 'Hanya tampilkan log tugas saya'"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {{ myTasksOnly ? 'Log Saya' : 'Semua Tim' }}
            </button>

            <!-- Filter Proyek -->
            <select
              v-model="selectedProjectFilter"
              @change="onFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="">Semua Proyek</option>
              <option v-for="proj in projectsList" :key="proj.id" :value="proj.id">
                {{ proj.name || 'Proyek #' + proj.id }}
              </option>
            </select>

            <!-- Filter Karyawan -->
            <select
              v-model="selectedEmployeeFilter"
              @change="onFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="">Semua Karyawan</option>
              <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">
                {{ emp.name || emp.full_name || 'Karyawan #' + emp.id }}
              </option>
            </select>

            <!-- Filter Status Penagihan -->
            <select
              v-model="selectedBillableFilter"
              @change="onFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="all">Semua Tipe Penagihan</option>
              <option value="billable">Hanya Billable (Dapat Ditagih)</option>
              <option value="non_billable">Hanya Non-Billable (Internal)</option>
            </select>
          </div>
        </div>

        <!-- Alert Notification -->
        <div v-if="error" class="p-4">
          <Alert variant="error" title="Gagal Memuat Data" :message="error" />
        </div>

        <!-- Timesheet Data Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50 text-2xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
                <th class="py-3 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-brand-500 focus:ring-brand-400 dark:border-gray-700"
                  />
                </th>
                <th class="py-3 px-4">Tanggal</th>
                <th class="py-3 px-4">Karyawan</th>
                <th class="py-3 px-4">Proyek & Tugas</th>
                <th class="py-3 px-4">Uraian Pekerjaan</th>
                <th class="py-3 px-4 text-center">Durasi (Jam)</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4 text-center">Tipe Penagihan</th>
                <th class="py-3 px-4 text-right">HPP Tenaga Kerja</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-xs dark:divide-gray-800">
              <!-- Loading Skeleton -->
              <tr v-if="isLoading">
                <td colspan="10" class="py-12 text-center">
                  <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Memuat log jam kerja...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="filteredRecords.length === 0">
                <td colspan="10" class="py-12 text-center">
                  <div class="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 dark:bg-gray-800 mb-3">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">Belum ada catatan jam kerja</p>
                  <p class="text-xs text-gray-400 mt-0.5">Klik "+ Catat Jam Kerja" untuk memasukkan log pekerjaan tim.</p>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="record in filteredRecords"
                :key="record.id"
                class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                :class="{ 'bg-amber-50/40 dark:bg-amber-950/20': record.status === 'submitted' }"
              >
                <!-- Checkbox -->
                <td class="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    :value="record.id"
                    v-model="selectedIds"
                    class="rounded border-gray-300 text-brand-500 focus:ring-brand-400 dark:border-gray-700"
                  />
                </td>

                <!-- Tanggal -->
                <td class="py-3.5 px-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {{ formatDate(record.date) }}
                </td>

                <!-- Karyawan -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-2.5">
                    <div class="h-8 w-8 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 font-bold flex items-center justify-center text-xs">
                      {{ getInitials(getEmployeeName(record)) }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white text-xs">
                        {{ getEmployeeName(record) }}
                      </p>
                      <p class="text-2xs text-gray-400">
                        {{ record.employee?.department?.name || record.employee?.position || 'Staff' }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Proyek & Tugas -->
                <td class="py-3.5 px-4 max-w-xs">
                  <div class="flex flex-col gap-0.5">
                    <span class="inline-flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                      <span class="w-2 h-2 rounded-full bg-brand-500"></span>
                      {{ getProjectName(record) }}
                    </span>
                    <span class="text-2xs text-gray-500 dark:text-gray-400 pl-3">
                      Task: {{ record.task?.name || record.task?.title || 'Tugas Umum' }}
                    </span>
                  </div>
                </td>

                <!-- Uraian Pekerjaan -->
                <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300 max-w-sm">
                  <p class="line-clamp-2" :title="record.description || '-'">
                    {{ record.description || '-' }}
                  </p>
                </td>

                <!-- Durasi Jam -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {{ (record.hours || 0).toFixed(1) }} Jam
                  </span>
                </td>

                <!-- Status Approval -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    v-if="record.status === 'submitted'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    title="Menunggu persetujuan Project Manager"
                  >
                    ⏳ Menunggu Review
                  </span>
                  <span
                    v-else-if="record.status === 'approved'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    title="Disetujui dan siap ditagihkan"
                  >
                    ✓ Disetujui
                  </span>
                  <span
                    v-else-if="record.status === 'rejected'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 cursor-help"
                    :title="record.rejection_reason ? `Ditolak: ${record.rejection_reason}` : 'Ditolak - Perlu revisi'"
                  >
                    ✕ Ditolak
                  </span>
                  <span
                    v-else-if="record.status === 'invoiced'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    title="Sudah ditagihkan ke klien (Terkunci)"
                  >
                    🔒 Invoiced
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  >
                    Draft
                  </span>
                </td>

                <!-- Tipe Penagihan & Quick Toggle -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <button
                    @click="toggleBillable(record)"
                    :title="record.is_billable ? 'Klik untuk ubah jadi Non-Billable' : 'Klik untuk ubah jadi Billable'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold cursor-pointer transition-all hover:scale-105"
                    :class="record.is_billable
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="record.is_billable ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                    {{ record.is_billable ? 'Billable (Ditagih)' : 'Internal (Non-Billable)' }}
                  </button>
                </td>

                <!-- HPP Tenaga Kerja -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ formatRupiah((record.hours || 0) * (record.cost || 0)) }}
                  </span>
                  <p class="text-2xs text-gray-400">
                    @ {{ formatRupiah(record.cost || 0) }}/jam
                  </p>
                </td>

                <!-- Aksi -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Quick Approve / Reject for Submitted records -->
                    <template v-if="record.status === 'submitted'">
                      <button
                        @click="record.id && approveRecord(record.id)"
                        class="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                        title="Setujui Jam Kerja"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                      <button
                        @click="record.id && openRejectModal(record.id)"
                        class="rounded p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                        title="Tolak Jam Kerja"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </template>

                    <!-- Submit action for Draft records -->
                    <button
                      v-if="record.status === 'draft' || record.status === 'rejected'"
                      @click="record.id && submitRecord(record.id)"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      title="Ajukan untuk Review"
                    >
                      Ajukan
                    </button>

                    <!-- Edit (Lock if approved/invoiced) -->
                    <button
                      v-if="record.status !== 'approved' && record.status !== 'invoiced'"
                      @click="openModal('edit', record)"
                      class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                      title="Edit Log"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <!-- Delete (Lock if approved/invoiced) -->
                    <button
                      v-if="record.status !== 'approved' && record.status !== 'invoiced'"
                      @click="record.id && deleteRecord(record.id)"
                      class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      title="Hapus Log"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>

                    <!-- Locked icon if approved/invoiced -->
                    <span
                      v-if="record.status === 'approved' || record.status === 'invoiced'"
                      class="p-1 text-gray-400"
                      title="Terkunci - Hubungi Admin/PM untuk revisi"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Log Jam Kerja (Create/Edit) -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              {{ modalMode === 'create' ? 'Catat Jam Kerja Baru' : 'Perbarui Log Jam Kerja' }}
            </h3>
            <p class="text-xs text-gray-400">Pastikan jam kerja dan penagihan tercatat dengan akurat</p>
          </div>
          <button @click="closeModal" class="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form @submit.prevent="saveRecord" class="space-y-4 pt-4">
          <!-- Karyawan & Tanggal -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Karyawan <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.employee_id"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>Pilih Karyawan</option>
                <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">
                  {{ emp.name || emp.full_name || 'Karyawan #' + emp.id }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Pekerjaan <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <!-- Proyek & Tugas -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Proyek Layanan <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.project_id"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>Pilih Proyek</option>
                <option v-for="proj in projectsList" :key="proj.id" :value="proj.id">
                  {{ proj.name || 'Proyek #' + proj.id }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Tugas / Aktivitas
              </label>
              <input
                v-model="formTaskName"
                type="text"
                placeholder="cth: Perbaikan Bug, Setup DB, UAT"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <!-- Durasi Jam & Quick Presets -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Durasi Jam Kerja <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="formData.hours = 1"
                  class="px-2 py-0.5 text-2xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600"
                >1h</button>
                <button
                  type="button"
                  @click="formData.hours = 2"
                  class="px-2 py-0.5 text-2xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600"
                >2h</button>
                <button
                  type="button"
                  @click="formData.hours = 4"
                  class="px-2 py-0.5 text-2xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600"
                >4h</button>
                <button
                  type="button"
                  @click="formData.hours = 8"
                  class="px-2 py-0.5 text-2xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 hover:text-brand-600"
                >8h (Full)</button>
              </div>
            </div>
            <input
              v-model.number="formData.hours"
              type="number"
              step="0.25"
              min="0.25"
              max="24"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-semibold"
            />
          </div>

          <!-- Tarif Pokok Tenaga Kerja / Jam -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Tarif Pokok Tenaga Kerja / Jam (HPP Rp)
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">Rp</span>
              <input
                v-model.number="formData.cost"
                type="number"
                step="1000"
                min="0"
                placeholder="100000"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <p class="text-2xs text-gray-400 mt-1">
              Subtotal Biaya: {{ formatRupiah((formData.hours || 0) * (formData.cost || 0)) }}
            </p>
          </div>

          <!-- Billable Toggle -->
          <div class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <div>
              <p class="text-xs font-bold text-gray-800 dark:text-white">Dapat Ditagihkan ke Klien (Billable)</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Centang jika jam ini akan diklaim pada invoice proyek</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="formData.is_billable" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <!-- Deskripsi Pekerjaan -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Uraian Rinci Pekerjaan
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Jelaskan progres kerja yang dikerjakan selama jam tersebut..."
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg v-if="isSaving" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Log Jam' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Alasan Penolakan Timesheet -->
  <Teleport to="body">
    <div v-if="isRejectModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-1 rounded bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">✕</span>
            Tolak Log Jam Kerja
          </h3>
          <button @click="isRejectModalOpen = false" class="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div class="py-4">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Alasan Penolakan <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="rejectReason"
            rows="3"
            placeholder="Berikan catatan alasan penolakan (cth: Jam lembur belum dilampirkan bukti lembur, dll)..."
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-rose-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          ></textarea>
        </div>
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            @click="isRejectModalOpen = false"
            class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmReject"
            :disabled="isProcessingApproval"
            class="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            <svg v-if="isProcessingApproval" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Tolak Log
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { timesheetsService } from '@/services/services/timesheets.service'
import { projectService } from '@/services/services/project.service'
import { employeesService } from '@/services/hr/employees.service'
import type { ITimesheetDto } from '@/types/services'
import type { IPaginationMeta } from '@/types'

// Data States
const records = ref<ITimesheetDto[]>([])
const projectsList = ref<any[]>([])
const employeesList = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Server-side Pagination & RBAC State
const myTasksOnly = ref(false)
const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

// Fase 2: Approval & Selection State
const activeApprovalTab = ref<'all' | 'pending' | 'approved'>('all')
const selectedIds = ref<number[]>([])
const isProcessingApproval = ref(false)
const isRejectModalOpen = ref(false)
const rejectTargetId = ref<number | null>(null)
const rejectReason = ref('')

const isAllSelected = computed(() => {
  return filteredRecords.value.length > 0 && selectedIds.value.length === filteredRecords.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredRecords.value.map(r => r.id!).filter(Boolean)
  }
}

const pendingCount = computed(() => {
  return records.value.filter(r => r.status === 'submitted').length
})

const onApprovalTabChange = () => {
  selectedIds.value = []
  pagination.value.current_page = 1
  fetchData()
}

// Filters
const searchQuery = ref('')
const selectedProjectFilter = ref<number | string>('')
const selectedEmployeeFilter = ref<number | string>('')
const selectedBillableFilter = ref<'all' | 'billable' | 'non_billable'>('all')

// Modal State
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formTaskName = ref('')
const formData = ref<ITimesheetDto>({
  employee_id: undefined,
  project_id: undefined,
  date: new Date().toISOString().split('T')[0],
  hours: 4,
  cost: 100000,
  is_billable: true,
  description: ''
})

// Fetch all dependencies with pagination & filters
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const params: any = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedProjectFilter.value) params.project_id = selectedProjectFilter.value
    if (selectedEmployeeFilter.value) params.employee_id = selectedEmployeeFilter.value
    if (selectedBillableFilter.value !== 'all') {
      params.is_billable = selectedBillableFilter.value === 'billable'
    }
    if (myTasksOnly.value) {
      params.my_only = true
    }
    if (activeApprovalTab.value === 'pending') {
      params.status = 'submitted'
    } else if (activeApprovalTab.value === 'approved') {
      params.status = 'approved'
    }

    const [timesheetsRes, projectsData, employeesData] = await Promise.all([
      timesheetsService.getAll(params).catch(() => ({ data: [], pagination: undefined })),
      projectService.getAll().catch(() => []),
      employeesService.getAll().catch(() => [])
    ])

    if (timesheetsRes && 'pagination' in (timesheetsRes as any) && (timesheetsRes as any).pagination) {
      records.value = (timesheetsRes as any).data || []
      pagination.value = (timesheetsRes as any).pagination
    } else if (Array.isArray(timesheetsRes)) {
      records.value = timesheetsRes
      pagination.value.total_items = timesheetsRes.length
      pagination.value.total_pages = 1
    } else if (timesheetsRes && 'data' in (timesheetsRes as any) && Array.isArray((timesheetsRes as any).data)) {
      records.value = (timesheetsRes as any).data
      if ((timesheetsRes as any).pagination) pagination.value = (timesheetsRes as any).pagination
    } else {
      records.value = []
    }

    projectsList.value = Array.isArray(projectsData) ? projectsData : []
    employeesList.value = Array.isArray(employeesData) ? employeesData : []
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (payloadOrPage: { page: number; limit?: number } | number, maybeLimit?: number) => {
  if (typeof payloadOrPage === 'object') {
    pagination.value.current_page = payloadOrPage.page
    if (payloadOrPage.limit) {
      pagination.value.per_page = payloadOrPage.limit
    }
  } else {
    pagination.value.current_page = payloadOrPage
    if (maybeLimit) {
      pagination.value.per_page = maybeLimit
    }
  }
  fetchData()
}

const onFilterChange = () => {
  pagination.value.current_page = 1
  fetchData()
}

// Formatters & Lookups
const getEmployeeName = (record: ITimesheetDto) => {
  if (record.employee?.name) return record.employee.name
  if (record.employee?.full_name) return record.employee.full_name
  const found = employeesList.value.find(e => e.id === record.employee_id)
  return found?.name || found?.full_name || `Karyawan #${record.employee_id || '?'}`
}

const getProjectName = (record: ITimesheetDto) => {
  if (record.project?.name) return record.project.name
  const found = projectsList.value.find(p => p.id === record.project_id)
  return found?.name || `Proyek #${record.project_id || '?'}`
}

const getInitials = (name: string) => {
  if (!name) return 'EM'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const formatRupiah = (val?: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val || 0)
}

// Filtered Records (Server-side handled)
const filteredRecords = computed(() => records.value)

// KPI Computations
const totalHours = computed(() => records.value.reduce((sum, r) => sum + (Number(r.hours) || 0), 0))
const billableHours = computed(() => records.value.filter(r => r.is_billable).reduce((sum, r) => sum + (Number(r.hours) || 0), 0))
const nonBillableHours = computed(() => records.value.filter(r => !r.is_billable).reduce((sum, r) => sum + (Number(r.hours) || 0), 0))
const billableRatio = computed(() => (totalHours.value > 0 ? (billableHours.value / totalHours.value) * 100 : 0))
const totalLaborCost = computed(() => records.value.reduce((sum, r) => sum + ((Number(r.hours) || 0) * (Number(r.cost) || 0)), 0))

// Filtered Footer Stats
const totalFilteredHours = computed(() => filteredRecords.value.reduce((sum, r) => sum + (Number(r.hours) || 0), 0))
const totalFilteredLaborCost = computed(() => filteredRecords.value.reduce((sum, r) => sum + ((Number(r.hours) || 0) * (Number(r.cost) || 0)), 0))

// Modal Actions
const openModal = (mode: 'create' | 'edit', data: ITimesheetDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id,
      employee_id: data.employee_id,
      project_id: data.project_id,
      date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
      hours: data.hours || 1,
      cost: data.cost || 100000,
      is_billable: data.is_billable ?? true,
      description: data.description || ''
    }
    formTaskName.value = data.task?.name || ''
  } else {
    formData.value = {
      id: undefined,
      employee_id: employeesList.value[0]?.id || undefined,
      project_id: projectsList.value[0]?.id || undefined,
      date: new Date().toISOString().split('T')[0],
      hours: 4,
      cost: 100000,
      is_billable: true,
      description: ''
    }
    formTaskName.value = ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    const payload: any = {
      ...formData.value,
      hours: Number(formData.value.hours) || 0,
      cost: Number(formData.value.cost) || 0
    }

    if (modalMode.value === 'edit' && formData.value.id) {
      await timesheetsService.update(formData.value.id, payload)
    } else {
      await timesheetsService.create(payload)
    }
    closeModal()
    fetchData()
  } catch (err: any) {
    alert('Gagal menyimpan timesheet: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

// Toggle Billable Quick Action
const toggleBillable = async (record: ITimesheetDto) => {
  if (!record.id) return
  const newStatus = !record.is_billable
  try {
    record.is_billable = newStatus
    await timesheetsService.update(record.id, {
      ...record,
      is_billable: newStatus
    })
  } catch (err: any) {
    record.is_billable = !newStatus
    alert('Gagal mengubah status penagihan: ' + (err.response?.data?.message || err.message))
  }
}

// Delete Record
const deleteRecord = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus catatan jam kerja ini?')) return
  try {
    await timesheetsService.delete(id)
    fetchData()
  } catch (err: any) {
    alert('Gagal menghapus timesheet: ' + (err.response?.data?.message || err.message))
  }
}

// Fase 2: Approval Actions
const submitRecord = async (id: number) => {
  try {
    await timesheetsService.submit(id)
    fetchData()
  } catch (err: any) {
    alert('Gagal mengajukan timesheet: ' + (err.response?.data?.message || err.message))
  }
}

const approveRecord = async (id: number) => {
  try {
    await timesheetsService.approve(id)
    fetchData()
  } catch (err: any) {
    alert('Gagal menyetujui timesheet: ' + (err.response?.data?.message || err.message))
  }
}

const openRejectModal = (id: number) => {
  rejectTargetId.value = id
  rejectReason.value = ''
  isRejectModalOpen.value = true
}

const confirmReject = async () => {
  if (!rejectTargetId.value) return
  if (!rejectReason.value.trim()) {
    alert('Mohon isi alasan penolakan.')
    return
  }
  isProcessingApproval.value = true
  try {
    await timesheetsService.reject(rejectTargetId.value, rejectReason.value.trim())
    isRejectModalOpen.value = false
    rejectTargetId.value = null
    fetchData()
  } catch (err: any) {
    alert('Gagal menolak timesheet: ' + (err.response?.data?.message || err.message))
  } finally {
    isProcessingApproval.value = false
  }
}

const bulkApprove = async () => {
  if (selectedIds.value.length === 0) return
  if (!confirm(`Setujui ${selectedIds.value.length} catatan jam kerja yang dipilih?`)) return
  isProcessingApproval.value = true
  try {
    await timesheetsService.bulkApprove(selectedIds.value)
    selectedIds.value = []
    fetchData()
  } catch (err: any) {
    alert('Gagal memproses approval massal: ' + (err.response?.data?.message || err.message))
  } finally {
    isProcessingApproval.value = false
  }
}

// Export CSV Action
const exportCsv = () => {
  if (filteredRecords.value.length === 0) {
    alert('Tidak ada data yang dapat diekspor!')
    return
  }

  const headers = ['ID', 'Tanggal', 'Karyawan', 'Proyek', 'Uraian Pekerjaan', 'Jam', 'Billable', 'Tarif Pokok', 'HPP Total']
  const rows = filteredRecords.value.map(r => [
    r.id || '',
    formatDate(r.date),
    `"${getEmployeeName(r)}"`,
    `"${getProjectName(r)}"`,
    `"${(r.description || '').replace(/"/g, '""')}"`,
    r.hours || 0,
    r.is_billable ? 'Billable' : 'Non-Billable',
    r.cost || 0,
    (r.hours || 0) * (r.cost || 0)
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `timesheets_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchData()
})
</script>

