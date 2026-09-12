<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            Kendali Mutu (Quality Control)
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo 18 Quality & Mekari SCM: Titik kendali mutu produk (*Quality Points*), lembar inspeksi penerimaan PO & produksi SPK, serta toleransi pengukuran (*Pass/Fail*).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Refresh Button -->
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
            v-if="activeTab === 'checks'"
            @click="openCreateCheckModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Pemeriksaan QC
          </button>

          <button
            v-else-if="activeTab === 'points'"
            @click="openCreatePointModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Titik Mutu Baru
          </button>
        </div>
      </div>

      <!-- Executive KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total QC Checks -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Lembar QC</p>
              <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                {{ summaryData.total_checks_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">
                {{ summaryData.total_points_count }} Titik Mutu Aktif
              </p>
            </div>
            <div class="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Menunggu Inspeksi -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Menunggu Inspeksi</p>
              <h3 class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {{ summaryData.pending_checks_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Antrean Receiving / SPK</p>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Lolos Standar Mutu -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lolos Standar (Pass)</p>
              <h3 class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {{ summaryData.passed_checks_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Memenuhi Spesifikasi & Norm</p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: Gagal / Reject -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gagal / Ditolak (Fail)</p>
              <h3 class="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {{ summaryData.failed_checks_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Toleransi Tidak Sesuai</p>
            </div>
            <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-6">
          <button
            @click="switchTab('checks')"
            :class="[
              'py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition',
              activeTab === 'checks'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lembar Pemeriksaan QC
            <span class="ml-1.5 px-2 py-0.5 text-2xs rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
              {{ paginationChecks.total_items }}
            </span>
          </button>

          <button
            @click="switchTab('points')"
            :class="[
              'py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition',
              activeTab === 'points'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Titik Kendali Mutu (Quality Points)
            <span class="ml-1.5 px-2 py-0.5 text-2xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              {{ paginationPoints.total_items }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Main Content Card -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-xs overflow-hidden">
        <!-- Filter & Search Toolbar -->
        <div class="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3 w-full sm:w-auto flex-1">
            <!-- Search Input -->
            <div class="relative w-full sm:w-80">
              <input
                type="text"
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="Cari kode, nama produk, atau catatan..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 pl-10 text-xs text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
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

            <!-- Status Filter for Quality Checks -->
            <div v-if="activeTab === 'checks'" class="flex items-center gap-2">
              <select
                v-model="selectedStatus"
                @change="handleStatusFilter"
                class="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 focus:border-teal-500 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu (Pending)</option>
                <option value="pass">Lolos (Pass)</option>
                <option value="fail">Gagal (Fail)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Alert Notification -->
        <div v-if="error" class="p-4">
          <Alert variant="error" title="Terjadi Kesalahan" :message="error" />
        </div>

        <!-- TAB 1: Quality Checks Table -->
        <div v-if="activeTab === 'checks'" class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left text-xs">
            <thead class="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">ID & Kode</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Produk yang Diperiksa</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Titik Uji (Point)</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Asal Dokumen</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Nilai Ukur</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-center">Status Mutu</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Tanggal</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="8" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-7 h-7 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat data pemeriksaan mutu...</p>
                </td>
              </tr>
              <tr v-else-if="qualityChecks.length === 0">
                <td colspan="8" class="py-12 text-center text-gray-400">
                  Belum ada data pemeriksaan mutu yang sesuai dengan filter.
                </td>
              </tr>
              <tr
                v-for="check in qualityChecks"
                :key="check.id"
                class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
              >
                <!-- Code & ID -->
                <td class="px-4 py-3.5 font-mono text-gray-900 dark:text-white font-semibold">
                  <div class="flex items-center gap-1.5">
                    <span>{{ check.name || `QC-${String(check.id).padStart(4, '0')}` }}</span>
                  </div>
                  <span class="text-3xs text-gray-400">#{{ check.id }}</span>
                </td>

                <!-- Product -->
                <td class="px-4 py-3.5">
                  <div class="font-medium text-gray-800 dark:text-gray-200">
                    {{ check.product?.ProductTemplate?.name || check.product?.default_code || `Produk #${check.product_id}` }}
                  </div>
                  <span class="text-3xs text-gray-400 font-mono">
                    {{ check.product?.default_code || '-' }}
                  </span>
                </td>

                <!-- Quality Point -->
                <td class="px-4 py-3.5">
                  <div class="text-gray-700 dark:text-gray-300 font-medium">
                    {{ check.point?.name || 'Inspeksi Umum' }}
                  </div>
                  <span v-if="check.point?.test_type === 'measure'" class="text-3xs text-teal-600 dark:text-teal-400 font-mono">
                    Standar: {{ check.point.norm }} ± {{ check.point.tolerance }}
                  </span>
                  <span v-else class="text-3xs text-gray-400">
                    Uji Lolos / Gagal (Pass-Fail)
                  </span>
                </td>

                <!-- Source Document -->
                <td class="px-4 py-3.5">
                  <span v-if="check.picking_id" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-3xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    Penerimaan PO #{{ check.picking_id }}
                  </span>
                  <span v-else-if="check.production_id" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-3xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /></svg>
                    SPK MO #{{ check.production_id }}
                  </span>
                  <span v-else class="text-gray-400 text-3xs italic">
                    Inspeksi Lepas / Mandiri
                  </span>
                </td>

                <!-- Measure Value -->
                <td class="px-4 py-3.5 font-mono text-gray-800 dark:text-gray-200">
                  <span v-if="check.measure_value !== undefined && check.measure_value !== null && check.measure_value > 0" class="font-bold">
                    {{ check.measure_value }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>

                <!-- Status Badge -->
                <td class="px-4 py-3.5 text-center">
                  <span
                    v-if="check.result === 'pass'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                    PASS
                  </span>
                  <span
                    v-else-if="check.result === 'fail'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    FAIL
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  >
                    <svg class="w-3 h-3 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /></svg>
                    PENDING
                  </span>
                </td>

                <!-- Date -->
                <td class="px-4 py-3.5 text-gray-500 dark:text-gray-400">
                  {{ formatDate(check.created_at) }}
                </td>

                <!-- Actions: Icon only with tooltips -->
                <td class="px-4 py-3.5 text-right">
                  <div class="inline-flex items-center gap-1 justify-end">
                    <!-- Process / Evaluate Action -->
                    <button
                      @click="openProcessModal(check)"
                      class="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40 transition"
                      title="Evaluasi / Proses QC (Pass/Fail)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <!-- Detail Action -->
                    <button
                      @click="openDetailModal(check)"
                      class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"
                      title="Lihat Detail Inspeksi"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <!-- Delete Action -->
                    <button
                      @click="confirmDeleteCheck(check)"
                      class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                      title="Hapus Lembar QC"
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

          <!-- Pagination Bar for Checks -->
          <PaginationBar
            :pagination="paginationChecks"
            @change="handlePaginationChecksChange"
          />
        </div>

        <!-- TAB 2: Quality Points Table -->
        <div v-else-if="activeTab === 'points'" class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left text-xs">
            <thead class="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Nama Titik Kontrol Mutu</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Produk yang Diawasi</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Tipe Pengujian</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Nilai Acuan (Norm)</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300">Batas Toleransi (±)</th>
                <th class="px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="7" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-7 h-7 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat data titik kendali mutu...</p>
                </td>
              </tr>
              <tr v-else-if="qualityPoints.length === 0">
                <td colspan="7" class="py-12 text-center text-gray-400">
                  Belum ada titik kendali mutu (quality points) terdaftar.
                </td>
              </tr>
              <tr
                v-for="point in qualityPoints"
                :key="point.id"
                class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
              >
                <td class="px-4 py-3.5 font-mono text-gray-500 dark:text-gray-400">
                  #{{ point.id }}
                </td>
                <td class="px-4 py-3.5 font-semibold text-gray-900 dark:text-white">
                  {{ point.name }}
                </td>
                <td class="px-4 py-3.5">
                  <span class="text-gray-800 dark:text-gray-200 font-medium">
                    {{ point.product?.ProductTemplate?.name || point.product?.default_code || `Produk #${point.product_id}` }}
                  </span>
                </td>
                <td class="px-4 py-3.5">
                  <span
                    v-if="point.test_type === 'measure'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                  >
                    Pengukuran Nilai (Measure)
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    Lolos / Gagal (Pass-Fail)
                  </span>
                </td>
                <td class="px-4 py-3.5 font-mono text-gray-800 dark:text-gray-200">
                  {{ point.norm !== undefined && point.norm !== null ? point.norm : '-' }}
                </td>
                <td class="px-4 py-3.5 font-mono text-gray-800 dark:text-gray-200">
                  {{ point.tolerance ? `± ${point.tolerance}` : '-' }}
                </td>
                <td class="px-4 py-3.5 text-right">
                  <button
                    @click="confirmDeletePoint(point)"
                    class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                    title="Hapus Titik Mutu"
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

          <!-- Pagination Bar for Points -->
          <PaginationBar
            :pagination="paginationPoints"
            @change="handlePaginationPointsChange"
          />
        </div>
      </div>

      <!-- MODAL 1: Buat Pemeriksaan QC Baru -->
      <Teleport to="body">
      <div
        v-if="isCreateCheckModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm backdrop-blur-xs overflow-y-auto"
      >
        <div class="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              Buat Lembar Pemeriksaan QC
            </h3>
            <button @click="isCreateCheckModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <form @submit.prevent="submitCreateCheck" class="space-y-4">
            <!-- Product Selection -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Pilih Produk yang Diinspeksi <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="createCheckForm.product_id"
                required
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
              >
                <option value="0" disabled>-- Pilih Produk --</option>
                <option v-for="prod in productList" :key="prod.id" :value="prod.id">
                  {{ prod.ProductTemplate?.name || prod.default_code }} (ID: {{ prod.id }})
                </option>
              </select>
            </div>

            <!-- Optional Quality Point Selection -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Titik Kendali Mutu (Quality Point Acuan)
              </label>
              <select
                v-model="createCheckForm.point_id"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
              >
                <option :value="undefined">-- Tanpa Titik Khusus (Inspeksi Umum) --</option>
                <option v-for="point in qualityPoints" :key="point.id" :value="point.id">
                  {{ point.name }} ({{ point.test_type === 'measure' ? `Norm: ${point.norm} ±${point.tolerance}` : 'Pass/Fail' }})
                </option>
              </select>
            </div>

            <!-- Source Document (Optional Picking ID or Production ID) -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No. Penerimaan PO (Picking ID)
                </label>
                <input
                  type="number"
                  v-model.number="createCheckForm.picking_id"
                  placeholder="Contoh: 12"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No. SPK MO (Production ID)
                </label>
                <input
                  type="number"
                  v-model.number="createCheckForm.production_id"
                  placeholder="Contoh: 5"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Pemeriksaan</label>
              <textarea
                v-model="createCheckForm.notes"
                rows="2"
                placeholder="Catatan kondisi awal material atau instruksi QC..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateCheckModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Lembar QC' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

      <!-- MODAL 2: Proses / Evaluasi QC (Pass/Fail) -->
      <Teleport to="body">
      <div
        v-if="isProcessModalOpen && activeCheck"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm backdrop-blur-xs overflow-y-auto"
      >
        <div class="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              Evaluasi Hasil Uji Mutu (QC)
            </h3>
            <button @click="isProcessModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-1.5 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-500">Lembar QC:</span>
              <span class="font-mono font-bold text-gray-900 dark:text-white">{{ activeCheck.name || `QC-${activeCheck.id}` }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Produk:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ activeCheck.product?.ProductTemplate?.name || `Produk #${activeCheck.product_id}` }}</span>
            </div>
            <div v-if="activeCheck.point" class="flex justify-between">
              <span class="text-gray-500">Acuan Uji:</span>
              <span class="text-teal-600 dark:text-teal-400 font-medium">
                {{ activeCheck.point.name }} (Norm: {{ activeCheck.point.norm }} ± {{ activeCheck.point.tolerance }})
              </span>
            </div>
          </div>

          <form @submit.prevent="submitProcessCheck" class="space-y-4">
            <!-- Keputusan Status Hasil -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Keputusan Evaluasi <span class="text-rose-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="processForm.result = 'pass'"
                  :class="[
                    'py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition',
                    processForm.result === 'pass'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                  ]"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                  LOLOS (PASS)
                </button>

                <button
                  type="button"
                  @click="processForm.result = 'fail'"
                  :class="[
                    'py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition',
                    processForm.result === 'fail'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  ]"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  GAGAL (FAIL)
                </button>
              </div>
            </div>

            <!-- Nilai Ukur Aktual -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nilai Ukur Aktual
              </label>
              <input
                type="number"
                step="0.01"
                v-model.number="processForm.measure_value"
                placeholder="0.00"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
              />
              <p v-if="activeCheck.point && activeCheck.point.test_type === 'measure'" class="text-3xs text-gray-400 mt-1">
                Rentang diterima: {{ (activeCheck.point.norm || 0) - (activeCheck.point.tolerance || 0) }} s/d {{ (activeCheck.point.norm || 0) + (activeCheck.point.tolerance || 0) }}
              </p>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan / Justifikasi Evaluator</label>
              <textarea
                v-model="processForm.notes"
                rows="2"
                placeholder="Hasil visual, ketebalan, atau deviasi toleransi..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isProcessModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Konfirmasi Hasil Mutu' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

      <!-- MODAL 3: Buat Titik Mutu Baru (Quality Point) -->
      <Teleport to="body">
      <div
        v-if="isCreatePointModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm backdrop-blur-xs overflow-y-auto"
      >
        <div class="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              </span>
              Tambah Titik Kendali Mutu
            </h3>
            <button @click="isCreatePointModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <form @submit.prevent="submitCreatePoint" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nama Titik Kendali <span class="text-rose-500">*</span>
              </label>
              <input
                type="text"
                v-model="createPointForm.name"
                required
                placeholder="Contoh: Cek Ketebalan Pelat Baja"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Produk Target <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="createPointForm.product_id"
                required
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="0" disabled>-- Pilih Produk --</option>
                <option v-for="prod in productList" :key="prod.id" :value="prod.id">
                  {{ prod.ProductTemplate?.name || prod.default_code }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Jenis Pengujian <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="createPointForm.test_type"
                required
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="passfail">Lolos / Gagal (Pass-Fail)</option>
                <option value="measure">Pengukuran Nilai dengan Toleransi (Measure)</option>
              </select>
            </div>

            <div v-if="createPointForm.test_type === 'measure'" class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nilai Standar (Norm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  v-model.number="createPointForm.norm"
                  placeholder="100.0"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Toleransi (±)
                </label>
                <input
                  type="number"
                  step="0.01"
                  v-model.number="createPointForm.tolerance"
                  placeholder="0.5"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isCreatePointModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Titik Mutu' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

      <!-- MODAL 4: Detail Pemeriksaan QC -->
      <Teleport to="body">
      <div
        v-if="isDetailModalOpen && activeCheck"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm backdrop-blur-xs overflow-y-auto"
      >
        <div class="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </span>
              Rincian Dokumen Mutu #{{ activeCheck.id }}
            </h3>
            <button @click="isDetailModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Kode Dokumen</span>
                <strong class="text-gray-900 dark:text-white font-mono">{{ activeCheck.name || `QC-${activeCheck.id}` }}</strong>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Status Keputusan</span>
                <span
                  v-if="activeCheck.result === 'pass'"
                  class="font-bold text-emerald-600 dark:text-emerald-400"
                >Lolos (PASS)</span>
                <span
                  v-else-if="activeCheck.result === 'fail'"
                  class="font-bold text-rose-600 dark:text-rose-400"
                >Gagal (FAIL)</span>
                <span v-else class="font-bold text-amber-600 dark:text-amber-400">Menunggu (PENDING)</span>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Produk Diperiksa</span>
                <strong class="text-gray-900 dark:text-white">{{ activeCheck.product?.ProductTemplate?.name || `Produk #${activeCheck.product_id}` }}</strong>
              </div>
              <div>
                <span class="text-3xs text-gray-400 uppercase tracking-wider block">Nilai Ukur</span>
                <strong class="text-gray-900 dark:text-white font-mono">{{ activeCheck.measure_value || '-' }}</strong>
              </div>
            </div>

            <div v-if="activeCheck.point" class="p-3 rounded-xl border border-gray-200 dark:border-gray-700">
              <span class="text-3xs text-gray-400 uppercase tracking-wider block mb-1">Titik Kontrol Mutu</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ activeCheck.point.name }}</p>
              <p class="text-2xs text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                Norm: {{ activeCheck.point.norm }} | Toleransi: ± {{ activeCheck.point.tolerance }}
              </p>
            </div>

            <div v-if="activeCheck.notes" class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/30">
              <span class="text-3xs text-gray-400 uppercase tracking-wider block mb-1">Catatan Pemeriksaan</span>
              <p class="text-gray-700 dark:text-gray-300 italic">{{ activeCheck.notes }}</p>
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
  IQualityCheckDto,
  IQualityPointDto,
  IQualitySummary,
  ICreateQualityCheckPayload,
  IProcessQualityCheckPayload,
  ICreateQualityPointPayload,
} from '@/types/supply-chain/quality.dto'
import { qualityService } from '@/services/supply-chain/quality.service'
import { purchaseService } from '@/services/supply-chain/purchase.service'

// Tab state
const activeTab = ref<'checks' | 'points'>('checks')

// Loading & Error States
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Data state
const qualityChecks = ref<IQualityCheckDto[]>([])
const qualityPoints = ref<IQualityPointDto[]>([])
const productList = ref<any[]>([])

// Summary Data
const summaryData = ref<IQualitySummary>({
  total_checks_count: 0,
  pending_checks_count: 0,
  passed_checks_count: 0,
  failed_checks_count: 0,
  total_points_count: 0,
})

// Pagination
const paginationChecks = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false,
})

const paginationPoints = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false,
})

// Filters
const searchQuery = ref('')
const selectedStatus = ref('all')

// Modals
const isCreateCheckModalOpen = ref(false)
const isProcessModalOpen = ref(false)
const isCreatePointModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const activeCheck = ref<IQualityCheckDto | null>(null)

// Forms
const createCheckForm = ref<ICreateQualityCheckPayload>({
  product_id: 0,
  point_id: undefined,
  picking_id: undefined,
  production_id: undefined,
  measure_value: 0,
  notes: '',
})

const processForm = ref<IProcessQualityCheckPayload>({
  result: 'pass',
  measure_value: 0,
  notes: '',
})

const createPointForm = ref<ICreateQualityPointPayload>({
  name: '',
  product_id: 0,
  test_type: 'passfail',
  norm: 0,
  tolerance: 0,
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchSummary(),
    fetchChecks(),
    fetchPoints(),
    fetchProducts(),
  ])
})

// Methods
const fetchSummary = async () => {
  try {
    const res = await qualityService.getSummary()
    if (res) summaryData.value = res
  } catch (e) {
    console.error('Failed to load QC summary', e)
  }
}

const fetchChecks = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await qualityService.getAll({
      page: paginationChecks.value.current_page,
      limit: paginationChecks.value.per_page,
      search: searchQuery.value,
      status: selectedStatus.value,
    })
    qualityChecks.value = res.data
    if (res.pagination) {
      paginationChecks.value = res.pagination
    }
  } catch (e: any) {
    error.value = e?.message || 'Gagal memuat daftar pemeriksaan QC'
  } finally {
    isLoading.value = false
  }
}

const fetchPoints = async () => {
  try {
    const res = await qualityService.getPoints({
      page: paginationPoints.value.current_page,
      limit: paginationPoints.value.per_page,
      search: searchQuery.value,
    })
    qualityPoints.value = res.data
    if (res.pagination) {
      paginationPoints.value = res.pagination
    }
  } catch (e) {
    console.error('Failed to load quality points', e)
  }
}

const fetchProducts = async () => {
  try {
    const prods = await purchaseService.getProducts()
    productList.value = prods
    if (prods.length > 0) {
      createCheckForm.value.product_id = prods[0].id
      createPointForm.value.product_id = prods[0].id
    }
  } catch (e) {
    console.error('Failed to load products', e)
  }
}

const switchTab = (tab: 'checks' | 'points') => {
  activeTab.value = tab
  searchQuery.value = ''
  if (tab === 'checks') fetchChecks()
  else fetchPoints()
}

const refreshCurrentTab = () => {
  fetchSummary()
  if (activeTab.value === 'checks') fetchChecks()
  else fetchPoints()
}

const handleSearch = () => {
  if (activeTab.value === 'checks') {
    paginationChecks.value.current_page = 1
    fetchChecks()
  } else {
    paginationPoints.value.current_page = 1
    fetchPoints()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const handleStatusFilter = () => {
  paginationChecks.value.current_page = 1
  fetchChecks()
}

const handlePaginationChecksChange = (payload: { page: number; limit: number }) => {
  paginationChecks.value.current_page = payload.page
  paginationChecks.value.per_page = payload.limit
  fetchChecks()
}

const handlePaginationPointsChange = (payload: { page: number; limit: number }) => {
  paginationPoints.value.current_page = payload.page
  paginationPoints.value.per_page = payload.limit
  fetchPoints()
}

// Modal actions
const openCreateCheckModal = () => {
  createCheckForm.value = {
    product_id: productList.value[0]?.id || 0,
    point_id: undefined,
    picking_id: undefined,
    production_id: undefined,
    measure_value: 0,
    notes: '',
  }
  isCreateCheckModalOpen.value = true
}

const submitCreateCheck = async () => {
  isSubmitting.value = true
  try {
    await qualityService.create(createCheckForm.value)
    isCreateCheckModalOpen.value = false
    await Promise.all([fetchSummary(), fetchChecks()])
  } catch (e: any) {
    alert('Gagal membuat lembar QC: ' + (e?.message || 'Error'))
  } finally {
    isSubmitting.value = false
  }
}

const openProcessModal = (check: IQualityCheckDto) => {
  activeCheck.value = check
  processForm.value = {
    result: (check.result === 'pass' || check.result === 'fail') ? check.result : 'pass',
    measure_value: check.measure_value || 0,
    notes: check.notes || '',
  }
  isProcessModalOpen.value = true
}

const submitProcessCheck = async () => {
  if (!activeCheck.value?.id) return
  isSubmitting.value = true
  try {
    await qualityService.processCheck(activeCheck.value.id, processForm.value)
    isProcessModalOpen.value = false
    await Promise.all([fetchSummary(), fetchChecks()])
  } catch (e: any) {
    alert('Gagal memproses hasil QC: ' + (e?.message || 'Error'))
  } finally {
    isSubmitting.value = false
  }
}

const openCreatePointModal = () => {
  createPointForm.value = {
    name: '',
    product_id: productList.value[0]?.id || 0,
    test_type: 'passfail',
    norm: 0,
    tolerance: 0,
  }
  isCreatePointModalOpen.value = true
}

const submitCreatePoint = async () => {
  isSubmitting.value = true
  try {
    await qualityService.createPoint(createPointForm.value)
    isCreatePointModalOpen.value = false
    await Promise.all([fetchSummary(), fetchPoints()])
  } catch (e: any) {
    alert('Gagal membuat titik mutu: ' + (e?.message || 'Error'))
  } finally {
    isSubmitting.value = false
  }
}

const openDetailModal = (check: IQualityCheckDto) => {
  activeCheck.value = check
  isDetailModalOpen.value = true
}

const confirmDeleteCheck = async (check: IQualityCheckDto) => {
  if (!check.id) return
  if (!confirm(`Hapus lembar pemeriksaan QC ${check.name || `#${check.id}`}?`)) return
  try {
    await qualityService.delete(check.id)
    await Promise.all([fetchSummary(), fetchChecks()])
  } catch (e: any) {
    alert('Gagal menghapus: ' + (e?.message || 'Error'))
  }
}

const confirmDeletePoint = async (point: IQualityPointDto) => {
  if (!point.id) return
  if (!confirm(`Hapus titik kendali mutu "${point.name}"?`)) return
  try {
    await qualityService.deletePoint(point.id)
    await Promise.all([fetchSummary(), fetchPoints()])
  } catch (e: any) {
    alert('Gagal menghapus titik mutu: ' + (e?.message || 'Error'))
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

const exportCsv = () => {
  const rows = qualityChecks.value.map(c => ({
    ID: c.id,
    Name: c.name || `QC-${c.id}`,
    Product: c.product?.ProductTemplate?.name || c.product_id,
    Point: c.point?.name || '-',
    Result: c.result || 'pending',
    MeasureValue: c.measure_value || 0,
    CreatedAt: c.created_at,
  }))

  const header = ['ID', 'Name', 'Product', 'Point', 'Result', 'MeasureValue', 'CreatedAt']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [header.join(','), ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `quality_checks_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
