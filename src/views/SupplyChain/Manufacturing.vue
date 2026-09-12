<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </span>
            Manufaktur & MRP (Produksi)
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo 18 Manufacturing & Mekari SCM: Surat Perintah Kerja (SPK/MO), formula resep BOM, dan konsumsi bahan baku otomatis (*backflush*).
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
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>

          <!-- Action depending on active tab -->
          <button
            v-if="activeTab === 'orders'"
            @click="openCreateMOModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat SPK / MO Baru
          </button>

          <button
            v-else-if="activeTab === 'boms'"
            @click="openCreateBomModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Formula BOM Baru
          </button>

          <button
            v-else-if="activeTab === 'workcenters'"
            @click="openCreateWorkcenterModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Pusat Kerja
          </button>
        </div>
      </div>

      <!-- Executive KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total SPK/MO -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Perintah Manufaktur</p>
              <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                {{ summaryData.total_mo_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Surat Perintah Kerja (SPK)</p>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Sedang Dikerjakan -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sedang Dikerjakan</p>
              <h3 class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {{ summaryData.mo_in_progress }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Status Confirmed & In Progress</p>
            </div>
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Selesai Sempurna -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produksi Selesai (Done)</p>
              <h3 class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {{ summaryData.mo_done_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Stok produk jadi telah masuk</p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: Master BOM & Pusat Kerja -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Formula & Pusat Kerja</p>
              <h3 class="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {{ summaryData.total_boms }} / {{ summaryData.total_workcenters }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Total BOM Aktif / Work Centers</p>
            </div>
            <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'orders'"
          :class="[
            'pb-3 pt-2 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
            activeTab === 'orders'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Perintah Manufaktur (MO)
          <span class="px-2 py-0.5 rounded-full text-2xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {{ moPagination.total_items || 0 }}
          </span>
        </button>

        <button
          @click="activeTab = 'boms'"
          :class="[
            'pb-3 pt-2 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
            activeTab === 'boms'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          Formula Resep (Bill of Materials)
          <span class="px-2 py-0.5 rounded-full text-2xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {{ bomPagination.total_items || boms.length }}
          </span>
        </button>

        <button
          @click="activeTab = 'workcenters'"
          :class="[
            'pb-3 pt-2 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
            activeTab === 'workcenters'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Pusat Kerja & Mesin
          <span class="px-2 py-0.5 rounded-full text-2xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {{ workcenters.length }}
          </span>
        </button>
      </div>

        <!-- NEW FASE 9: MPS & Forecasting -->
        <button
          @click="activeTab = 'mps'"
          :class="[
            'pb-3 pt-2 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
            activeTab === 'mps'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          MPS & Forecasting
        </button>

        <!-- NEW FASE 9: OEE & Workorders -->
        <button
          @click="activeTab = 'oee'"
          :class="[
            'pb-3 pt-2 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2',
            activeTab === 'oee'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          OEE & Tracking Pabrik
        </button>
</div>

      <!-- TAB 1: MANUFACTURING ORDERS (MO) -->
      <div v-if="activeTab === 'orders'" class="space-y-4">
        <!-- Filter Toolbar -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-4 shadow-xs">
          <div class="flex flex-col sm:flex-row items-center gap-3">
            <div class="relative w-full sm:w-80">
              <input
                v-model="moFilters.search"
                @input="debounceFetchMOs"
                type="text"
                placeholder="Cari No SPK (WH/MO/...) atau Produk..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3.5 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>

            <div class="w-full sm:w-56">
              <select
                v-model="moFilters.state"
                @change="fetchMOs(1)"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:text-white"
              >
                <option value="all">Semua Status Produksi</option>
                <option value="draft">Draft (Rencana)</option>
                <option value="confirmed">Confirmed (Bahan Terjadwal)</option>
                <option value="progress">In Progress (Pabrik Jalan)</option>
                <option value="done">Done (Selesai & Masuk Stok)</option>
                <option value="cancel">Dibatalkan</option>
              </select>
            </div>

            <button
              v-if="moFilters.search || moFilters.state !== 'all'"
              @click="resetMOFilters"
              class="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium ml-auto"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Reset Filter
            </button>
          </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-xs">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full text-left text-xs">
              <thead class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <tr>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">No. SPK / MO</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Produk Jadi Target</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Kuantitas</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Resep BOM</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Gudang</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Jadwal Rencana</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Status</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="isLoading">
                  <td colspan="8" class="py-12 text-center text-gray-500">
                    <div class="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p class="text-xs">Memuat data perintah produksi...</p>
                  </td>
                </tr>

                <tr v-else-if="productions.length === 0">
                  <td colspan="8" class="py-10 text-center text-gray-400">
                    Belum ada data perintah manufaktur yang sesuai dengan filter.
                  </td>
                </tr>

                <tr
                  v-for="mo in productions"
                  :key="mo.id"
                  class="hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <!-- No MO -->
                  <td class="px-4 py-3.5 font-bold text-brand-600 dark:text-brand-400">
                    {{ mo.name || `WH/MO/${mo.id}` }}
                  </td>

                  <!-- Product -->
                  <td class="px-4 py-3.5">
                    <div class="font-semibold text-gray-900 dark:text-white">
                      {{ mo.product?.ProductTemplate?.name || mo.product?.default_code || `Product #${mo.product_id}` }}
                    </div>
                    <div class="text-2xs text-gray-400">
                      SKU: {{ mo.product?.default_code || '-' }}
                    </div>
                  </td>

                  <!-- Qty -->
                  <td class="px-4 py-3.5 text-center font-bold text-gray-900 dark:text-white">
                    {{ mo.product_qty }} Unit
                  </td>

                  <!-- BOM -->
                  <td class="px-4 py-3.5">
                    <span v-if="mo.bom" class="inline-flex items-center gap-1 text-2xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/60 px-2 py-0.5 rounded">
                      {{ mo.bom.code || `BOM #${mo.bom.id}` }} ({{ mo.bom.bom_lines?.length || 0 }} Komponen)
                    </span>
                    <span v-else class="text-2xs text-gray-400 italic">Tanpa BOM</span>
                  </td>

                  <!-- Warehouse -->
                  <td class="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                    {{ mo.warehouse?.name || 'Gudang Utama' }}
                  </td>

                  <!-- Date -->
                  <td class="px-4 py-3.5 text-gray-500 dark:text-gray-400">
                    {{ formatDate(mo.date_planned || mo.created_at || '') }}
                  </td>

                  <!-- Status Badge -->
                  <td class="px-4 py-3.5 text-center">
                    <span :class="['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold', getStatusBadgeClass(mo.state || '')]">
                      <span v-if="mo.state === 'progress'" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                      {{ getStatusLabel(mo.state || '') }}
                    </span>
                  </td>

                  <!-- Actions (Icon-only with tooltips) -->
                  <td class="px-4 py-3.5 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <!-- Detail MO -->
                      <button
                        @click="openDetailMOModal(mo)"
                        class="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition"
                        title="Lihat Detail & Bahan Baku"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      <!-- Confirm (Draft -> Confirmed) -->
                      <button
                        v-if="mo.state === 'draft'"
                        @click="confirmMO(mo)"
                        class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="Konfirmasi Jadwal & Alokasi Bahan"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>

                      <!-- Start (Confirmed -> Progress) -->
                      <button
                        v-if="mo.state === 'confirmed'"
                        @click="startMO(mo)"
                        class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                        title="Mulai Pengerjaan Pabrik"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </button>

                      <!-- Finish (Progress / Confirmed -> Done) -->
                      <button
                        v-if="mo.state === 'progress' || mo.state === 'confirmed'"
                        @click="finishMO(mo)"
                        class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
                        title="Selesaikan Produksi & Tambah Stok Jadi"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </button>

                      <!-- Cancel (if not done/cancelled) -->
                      <button
                        v-if="mo.state !== 'done' && mo.state !== 'cancel'"
                        @click="cancelMO(mo)"
                        class="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        title="Batalkan Perintah Produksi"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                      </button>

                      <!-- Delete (only draft) -->
                      <button
                        v-if="mo.state === 'draft'"
                        @click="deleteMO(mo)"
                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                        title="Hapus SPK Draft"
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

          <!-- Pagination -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <PaginationBar
              :current-page="moPagination.page"
              :total-pages="moPagination.total_pages"
              :total-items="moPagination.total_items"
              :limit="moPagination.limit"
              @page-change="fetchMOs"
              @limit-change="handleMOLimitChange"
            />
          </div>
        </div>
      </div>

      <!-- TAB 2: BILL OF MATERIALS (BOM) -->
      <div v-else-if="activeTab === 'boms'" class="space-y-4">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-4 shadow-xs flex items-center justify-between">
          <div class="relative w-full sm:w-80">
            <input
              v-model="bomSearch"
              @input="debounceFetchBOMs"
              type="text"
              placeholder="Cari Formula Resep / Kode BOM..."
              class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3.5 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:bg-gray-900 dark:text-white"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          <button
            @click="openCreateBomModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Buat BOM Baru
          </button>
        </div>

        <!-- BOM Table -->
        <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-xs">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full text-left text-xs">
              <thead class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <tr>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Kode BOM</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Produk Jadi</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Batch Target</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Tipe Resep</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Komponen Bahan Baku</th>
                  <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="isLoading">
                  <td colspan="6" class="py-12 text-center text-gray-500">
                    <div class="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p class="text-xs">Memuat data BOM...</p>
                  </td>
                </tr>

                <tr v-else-if="boms.length === 0">
                  <td colspan="6" class="py-10 text-center text-gray-400">
                    Belum ada data Formula Resep (BOM).
                  </td>
                </tr>

                <tr
                  v-for="bom in boms"
                  :key="bom.id"
                  class="hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td class="px-4 py-3.5 font-bold text-amber-600 dark:text-amber-400">
                    {{ bom.code || `BOM/${bom.id}` }}
                  </td>

                  <td class="px-4 py-3.5">
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ bom.product?.ProductTemplate?.name || bom.product?.default_code || `Product #${bom.product_id}` }}
                    </span>
                  </td>

                  <td class="px-4 py-3.5 text-center font-bold text-gray-800 dark:text-gray-200">
                    {{ bom.quantity }} Unit
                  </td>

                  <td class="px-4 py-3.5">
                    <span class="px-2 py-0.5 rounded text-2xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 uppercase">
                      {{ bom.type || 'normal' }}
                    </span>
                  </td>

                  <td class="px-4 py-3.5">
                    <div v-if="bom.bom_lines && bom.bom_lines.length > 0" class="flex flex-wrap gap-1.5">
                      <span
                        v-for="line in bom.bom_lines"
                        :key="line.id"
                        class="inline-flex items-center gap-1 text-2xs bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md"
                      >
                        {{ line.product?.ProductTemplate?.name || line.product?.default_code || `Item #${line.product_id}` }}:
                        <strong>{{ line.quantity }}</strong>
                      </span>
                    </div>
                    <span v-else class="text-2xs text-gray-400 italic">Belum ada rincian komponen</span>
                  </td>

                  <td class="px-4 py-3.5 text-right">
                    <button
                      @click="deleteBom(bom)"
                      class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                      title="Hapus Formula BOM"
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
          </div>
        </div>
      </div>

      <!-- TAB 3: WORK CENTERS -->
      <div v-else-if="activeTab === 'workcenters'" class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Pusat kerja merepresentasikan mesin, stasiun perakitan, dan operator di lantai produksi pabrik.
          </p>
          <button
            @click="openCreateWorkcenterModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Tambah Pusat Kerja
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="wc in workcenters"
            :key="wc.id"
            class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 rounded text-2xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {{ wc.code || `WC-${wc.id}` }}
                </span>
                <button
                  @click="deleteWorkcenter(wc)"
                  class="text-gray-400 hover:text-red-500 transition"
                  title="Hapus Workcenter"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <h4 class="font-bold text-base text-gray-900 dark:text-white">{{ wc.name }}</h4>
              <p class="text-2xs text-gray-400 mt-0.5">Stasiun Produksi & Perakitan</p>

              <div class="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700/60 pt-3">
                <div>
                  <span class="text-3xs uppercase tracking-wider text-gray-400 block">Kapasitas</span>
                  <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ wc.capacity || 1 }} Unit</span>
                </div>
                <div>
                  <span class="text-3xs uppercase tracking-wider text-gray-400 block">Efisiensi</span>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">{{ wc.time_efficiency || 100 }}%</span>
                </div>
                <div>
                  <span class="text-3xs uppercase tracking-wider text-gray-400 block">Tarif/Jam</span>
                  <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ formatRupiah(wc.costs_hour || 0) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: MPS & FORECASTING -->
      <div v-else-if="activeTab === 'mps'" class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Master Production Schedule (MPS) memprediksi produksi bulan depan dan menghasilkan MO otomatis.
          </p>
          <button
            @click="openCreateMPSModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            + Buat Jadwal Produksi (MPS)
          </button>
        </div>
        <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-xs">
          <table class="min-w-full text-left text-xs">
            <thead class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Bulan & Tahun</th>
                <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Produk Target</th>
                <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Forecast Qty</th>
                <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Actual (MO Created)</th>
                <th class="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="mpsList.length === 0">
                <td colspan="5" class="py-10 text-center text-gray-400">Belum ada MPS terjadwal.</td>
              </tr>
              <tr v-for="mps in mpsList" :key="mps.id">
                <td class="px-4 py-3.5 font-bold">{{ formatDate(mps.date_planned) }}</td>
                <td class="px-4 py-3.5">{{ mps.product?.ProductTemplate?.name || mps.product_id }}</td>
                <td class="px-4 py-3.5 text-center font-bold text-gray-800 dark:text-white">{{ mps.forecast_qty }} Unit</td>
                <td class="px-4 py-3.5 text-center font-bold text-emerald-600">{{ mps.actual_qty }} Unit</td>
                <td class="px-4 py-3.5 text-right">
                  <button @click="generateMOFromMPS(mps.id)" class="px-2 py-1 bg-brand-100 text-brand-700 rounded hover:bg-brand-200 text-2xs font-semibold">Generate MO</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 5: OEE DASHBOARD -->
      <div v-else-if="activeTab === 'oee'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="wc in workcenters" :key="wc.id" class="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <h4 class="font-bold mb-2">{{ wc.name }} - OEE</h4>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-3xl font-extrabold text-emerald-500">{{ wc.oeeSummary?.oee?.toFixed(1) || '0.0' }}%</span>
                </div>
                <div class="space-y-2">
                    <div class="flex justify-between text-xs"><span>Ketersediaan (A)</span> <strong>{{ wc.oeeSummary?.availability?.toFixed(1) || '0.0' }}%</strong></div>
                    <div class="flex justify-between text-xs"><span>Kinerja (P)</span> <strong>{{ wc.oeeSummary?.performance?.toFixed(1) || '0.0' }}%</strong></div>
                    <div class="flex justify-between text-xs"><span>Kualitas (Q)</span> <strong>{{ wc.oeeSummary?.quality?.toFixed(1) || '0.0' }}%</strong></div>
                </div>
                <div class="mt-4 flex gap-2">
                    <button @click="openLogOEEModal(wc.id, 'productive')" class="flex-1 py-1.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">Uptime</button>
                    <button @click="openLogOEEModal(wc.id, 'availability')" class="flex-1 py-1.5 bg-red-100 text-red-700 rounded text-xs font-semibold">Downtime</button>
                </div>
            </div>
        </div>
      </div>

      <!-- MODAL 1: CREATE MO (SURAT PERINTAH KERJA PRODUKSI) -->
      <div
        v-if="isCreateMOModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto backdrop-blur-xs p-4"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              Buat Surat Perintah Kerja (SPK / MO) Baru
            </h3>
            <button @click="isCreateMOModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitCreateMO" class="p-6 space-y-4">
            <!-- Row 1: Produk Jadi & Target Qty -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Produk Jadi Target *</label>
                <select
                  v-model="moForm.product_id"
                  @change="handleMOProductSelect"
                  required
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs focus:border-brand-500 dark:text-white"
                >
                  <option value="" disabled>Pilih Produk Jadi</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.ProductTemplate?.name || p.default_code }} (Stok: {{ p.stock_qty }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Jumlah Produksi *</label>
                <div class="relative">
                  <input
                    v-model.number="moForm.product_qty"
                    type="number"
                    min="1"
                    step="any"
                    required
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:border-brand-500"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-gray-400">Unit</span>
                </div>
              </div>
            </div>

            <!-- Row 2: BOM Formula & Gudang -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Formula Resep (BOM)</label>
                <select
                  v-model="moForm.bom_id"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs focus:border-brand-500 dark:text-white"
                >
                  <option :value="undefined">Otomatis / Tanpa BOM</option>
                  <option v-for="b in filteredBOMsForProduct" :key="b.id" :value="b.id">
                    {{ b.code || `BOM #${b.id}` }} (Per {{ b.quantity }} unit)
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gudang Hasil Produksi</label>
                <select
                  v-model="moForm.warehouse_id"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs focus:border-brand-500 dark:text-white"
                >
                  <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                    {{ wh.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Preview Raw Material Consumption -->
            <div v-if="selectedBOMForMO && selectedBOMForMO.bom_lines?.length" class="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3.5">
              <span class="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-2">
                Estimasi Konsumsi Bahan Baku (Backflush Material):
              </span>
              <div class="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                <div
                  v-for="comp in selectedBOMForMO.bom_lines"
                  :key="comp.id"
                  class="flex items-center justify-between text-2xs"
                >
                  <span class="text-gray-700 dark:text-gray-300">
                    • {{ comp.product?.ProductTemplate?.name || comp.product?.default_code || `Bahan #${comp.product_id}` }}
                  </span>
                  <span class="font-bold text-amber-700 dark:text-amber-400">
                    {{ calculateRequiredCompQty(comp.quantity || 1, selectedBOMForMO.quantity || 1, moForm.product_qty || 1) }} Unit
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 3: Tanggal Rencana & Catatan -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tanggal Rencana Produksi</label>
              <input
                v-model="moForm.date_planned"
                type="date"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Instruksi Khusus</label>
              <textarea
                v-model="moForm.notes"
                rows="2"
                placeholder="Petunjuk pengerjaan di lantai pabrik..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs focus:border-brand-500 dark:text-white"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateMOModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Terbitkan SPK / MO
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL 2: CREATE BOM (FORMULA RESEP) -->
      <div
        v-if="isCreateBomModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto backdrop-blur-xs p-4"
      >
        <div class="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </span>
              Buat Formula Resep Baru (Bill of Materials)
            </h3>
            <button @click="isCreateBomModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitCreateBOM" class="p-6 space-y-4">
            <!-- Produk Target & Qty Jadi -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Produk Jadi yang Dihasilkan *</label>
                <select
                  v-model="bomForm.product_id"
                  required
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs focus:border-brand-500 dark:text-white"
                >
                  <option value="" disabled>Pilih Produk Jadi</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.ProductTemplate?.name || p.default_code }} (ID: {{ p.id }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kuantitas Jadi *</label>
                <div class="relative">
                  <input
                    v-model.number="bomForm.quantity"
                    type="number"
                    min="1"
                    step="any"
                    required
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-gray-400">Unit</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kode Referensi BOM</label>
                <input
                  v-model="bomForm.code"
                  type="text"
                  placeholder="Contoh: BOM-INVERTER-01"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tipe Resep</label>
                <select
                  v-model="bomForm.type"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
                >
                  <option value="normal">Normal (Diproduksi Jadi Produk)</option>
                  <option value="phantom">Kit / Phantom (Perakitan Langsung Saat Jual)</option>
                </select>
              </div>
            </div>

            <!-- Dynamic Component Lines -->
            <div class="pt-2">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-gray-800 dark:text-white">Komponen Bahan Baku Mentah:</span>
                <button
                  type="button"
                  @click="addBomLine"
                  class="inline-flex items-center gap-1 text-2xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  + Tambah Baris Bahan Baku
                </button>
              </div>

              <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                <div
                  v-for="(line, idx) in bomForm.lines"
                  :key="idx"
                  class="flex items-center gap-3"
                >
                  <div class="flex-1">
                    <select
                      v-model="line.product_id"
                      required
                      class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-xs dark:text-white"
                    >
                      <option value="" disabled>Pilih Komponen Bahan Baku</option>
                      <option v-for="p in products" :key="p.id" :value="p.id">
                        {{ p.ProductTemplate?.name || p.default_code }} (Stok Fisik: {{ p.stock_qty }})
                      </option>
                    </select>
                  </div>

                  <div class="w-28">
                    <input
                      v-model.number="line.quantity"
                      type="number"
                      min="0.01"
                      step="any"
                      placeholder="Qty"
                      required
                      class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white text-center"
                    />
                  </div>

                  <button
                    type="button"
                    @click="removeBomLine(idx)"
                    :disabled="bomForm.lines.length <= 1"
                    class="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateBomModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-5 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
              >
                Simpan Formula Resep
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL 3: CREATE WORK CENTER -->
      <div
        v-if="isCreateWorkcenterModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto backdrop-blur-xs p-4"
      >
        <div class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Tambah Pusat Kerja Baru</h3>
            <button @click="isCreateWorkcenterModalOpen = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitCreateWorkcenter" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Pusat Kerja / Mesin *</label>
              <input
                v-model="wcForm.name"
                type="text"
                placeholder="Contoh: Line Perakitan PCB & Solder"
                required
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kode Mesin</label>
                <input
                  v-model="wcForm.code"
                  type="text"
                  placeholder="WC-01"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kapasitas Batch</label>
                <input
                  v-model.number="wcForm.capacity"
                  type="number"
                  min="1"
                  step="any"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Efisiensi (%)</label>
                <input
                  v-model.number="wcForm.time_efficiency"
                  type="number"
                  min="1"
                  max="200"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Biaya per Jam (Rp)</label>
                <input
                  v-model.number="wcForm.costs_hour"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-xs dark:text-white"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateWorkcenterModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                class="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-semibold text-white shadow-sm transition"
              >
                Simpan Pusat Kerja
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL 4: DETAIL SPK / MO -->
      <div
        v-if="isDetailMOModalOpen && activeMO"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto backdrop-blur-xs p-4"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <div>
              <span class="text-2xs font-semibold text-gray-400 uppercase tracking-wider">Rincian Dokumen Produksi</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {{ activeMO.name }}
                <span :class="['text-2xs px-2.5 py-0.5 rounded-full font-bold', getStatusBadgeClass(activeMO.state || '')]">
                  {{ getStatusLabel(activeMO.state || '') }}
                </span>
              </h3>
            </div>
            <button @click="isDetailMOModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <!-- Info Header Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 text-xs">
              <div>
                <span class="text-3xs uppercase tracking-wider text-gray-400 block">Produk Jadi</span>
                <strong class="text-gray-900 dark:text-white">{{ activeMO.product?.ProductTemplate?.name || activeMO.product?.default_code }}</strong>
              </div>
              <div>
                <span class="text-3xs uppercase tracking-wider text-gray-400 block">Target Selesai</span>
                <strong class="text-gray-900 dark:text-white">{{ activeMO.product_qty }} Unit</strong>
              </div>
              <div>
                <span class="text-3xs uppercase tracking-wider text-gray-400 block">Formula BOM</span>
                <strong class="text-gray-900 dark:text-white">{{ activeMO.bom?.code || 'Tanpa BOM' }}</strong>
              </div>
              <div>
                <span class="text-3xs uppercase tracking-wider text-gray-400 block">Gudang Penyimpanan</span>
                <strong class="text-gray-900 dark:text-white">{{ activeMO.warehouse?.name || 'Gudang Utama' }}</strong>
              </div>
            </div>

            <!-- Material Breakdown -->
            <div>
              <h4 class="text-xs font-bold text-gray-800 dark:text-white mb-2">
                Alokasi Bahan Baku yang Digunakan (*Backflushed Components*):
              </h4>

              <div v-if="activeMO.bom?.bom_lines && activeMO.bom.bom_lines.length > 0" class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <table class="min-w-full text-left text-2xs">
                  <thead class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th class="px-3 py-2 text-gray-500">Komponen Bahan Baku</th>
                      <th class="px-3 py-2 text-center text-gray-500">Kebutuhan per Unit</th>
                      <th class="px-3 py-2 text-right text-gray-500">Total Dikonsumsi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="line in activeMO.bom.bom_lines" :key="line.id">
                      <td class="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">
                        {{ line.product?.ProductTemplate?.name || line.product?.default_code || `Bahan #${line.product_id}` }}
                      </td>
                      <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                        {{ line.quantity }} / batch
                      </td>
                      <td class="px-3 py-2 text-right font-bold text-amber-600 dark:text-amber-400">
                        {{ calculateRequiredCompQty(line.quantity || 1, activeMO.bom?.quantity || 1, activeMO.product_qty || 1) }} Unit
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-2xs text-gray-400 italic p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                SPK ini tidak memiliki formula BOM. Stok bahan baku tidak dikurangkan secara otomatis.
              </div>
            </div>

            <!-- Notes -->
            <div v-if="activeMO.notes">
              <span class="text-2xs font-semibold text-gray-400 uppercase tracking-wider block">Catatan SPK</span>
              <p class="text-xs text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-900/30 p-2.5 rounded-lg">
                {{ activeMO.notes }}
              </p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="isDetailMOModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 rounded-lg transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- MODAL: CREATE MPS -->
      <div v-if="isCreateMPSModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div class="flex items-center gap-3">
              <span class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Buat Jadwal MPS Baru</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Master Production Schedule untuk perencanaan perakitan produk jadi</p>
              </div>
            </div>
            <button @click="isCreateMPSModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Produk Target <span class="text-rose-500">*</span></label>
              <div class="relative">
                <select v-model="mpsForm.product_id" class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option v-for="p in products" :key="p.id" :value="p.id">{{ p.ProductTemplate?.name || p.default_code }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Rencana Mulai <span class="text-rose-500">*</span></label>
              <input type="date" v-model="mpsForm.date_planned" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Kuantitas Forecast (Unit) <span class="text-rose-500">*</span></label>
              <input type="number" v-model="mpsForm.forecast_qty" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 -mx-6 -mb-6 mt-6 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
              <button @click="isCreateMPSModalOpen = false" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition">Batal</button>
              <button @click="submitCreateMPS" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition">Simpan Jadwal MPS</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: LOG OEE -->
      <div v-if="isLogOEEModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div class="flex items-center gap-3">
              <span class="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Log Efisiensi Waktu Mesin (OEE)</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pencatatan aktual durasi kerja untuk kalkulasi Overall Equipment Effectiveness</p>
              </div>
            </div>
            <button @click="isLogOEEModalOpen = false" class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 transition">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Durasi Pengerjaan Aktual (Menit) <span class="text-rose-500">*</span></label>
              <input type="number" v-model="oeeForm.duration" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="cth. 120" />
            </div>
            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 -mx-6 -mb-6 mt-6 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
              <button @click="isLogOEEModalOpen = false" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition">Batal</button>
              <button @click="submitLogOEE" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition">Kirim Log OEE</button>
            </div>
          </div>
        </div>
      </div>
      </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

import { manufacturingService } from '@/services/supply-chain/manufacturing.service'
import { http as api } from '@/services/http'
import type {
  IMrpSummaryDto,
  IMrpProductionDto,
  IMrpBomDto,
  IMrpWorkcenterDto,
  ICreateMORequest,
  ICreateBomRequest
} from '@/types/supply-chain/manufacturing.dto'

// Tabs
const activeTab = ref<'orders' | 'boms' | 'workcenters' | 'mps' | 'oee'>('orders')

// MPS & OEE States
const mpsList = ref<any[]>([])
const isCreateMPSModalOpen = ref(false)
const mpsForm = ref({
  product_id: 1,
  warehouse_id: 1,
  date_planned: new Date().toISOString().slice(0, 10),
  forecast_qty: 100
})
const isLogOEEModalOpen = ref(false)
const oeeForm = ref({
  workcenter_id: 1,
  loss_type: 'productive',
  duration: 60
})

// Global State
const isLoading = ref(false)
const isSubmitting = ref(false)
const summaryData = ref<IMrpSummaryDto>({
  total_mo_count: 0,
  mo_in_progress: 0,
  mo_done_count: 0,
  total_boms: 0,
  total_workcenters: 0
})

// Data
const productions = ref<IMrpProductionDto[]>([])
const boms = ref<IMrpBomDto[]>([])
const workcenters = ref<IMrpWorkcenterDto[]>([])
const products = ref<any[]>([])
const warehouses = ref<any[]>([])

// Pagination & Filters
const moPagination = ref({ page: 1, limit: 10, total_pages: 0, total_items: 0 })
const bomPagination = ref({ page: 1, limit: 10, total_pages: 0, total_items: 0 })
const moFilters = ref({ search: '', state: 'all' })
const bomSearch = ref('')

// Modals
const isCreateMOModalOpen = ref(false)
const isCreateBomModalOpen = ref(false)
const isCreateWorkcenterModalOpen = ref(false)
const isDetailMOModalOpen = ref(false)

const activeMO = ref<IMrpProductionDto | null>(null)

// Forms
const moForm = ref<ICreateMORequest>({
  product_id: 0,
  product_qty: 1,
  bom_id: undefined,
  warehouse_id: undefined,
  date_planned: '',
  notes: ''
})

const bomForm = ref<ICreateBomRequest>({
  product_id: 0,
  quantity: 1,
  code: '',
  type: 'normal',
  lines: [{ product_id: 0, quantity: 1 }]
})

const wcForm = ref<Partial<IMrpWorkcenterDto>>({
  name: '',
  code: '',
  capacity: 1,
  time_efficiency: 100,
  costs_hour: 0
})

// Computed
const filteredBOMsForProduct = computed(() => {
  return boms.value.filter(b => b.product_id === moForm.value.product_id)
})
const selectedBOMForMO = computed(() => {
  return boms.value.find(b => b.id === moForm.value.bom_id)
})

// Fetch Data
const fetchSummary = async () => {
  try {
    summaryData.value = await manufacturingService.getSummary()
  } catch (err) {
    console.error('Failed to fetch summary', err)
  }
}

const fetchMOs = async (page = 1) => {
  isLoading.value = true
  try {
    const res = await manufacturingService.getAllProductions({
      page,
      limit: moPagination.value.limit,
      search: moFilters.value.search || undefined,
      state: moFilters.value.state !== 'all' ? moFilters.value.state : undefined
    })
    productions.value = res.data
    if (res.pagination) {
      moPagination.value = res.pagination
    }
  } catch (err) {
    console.error('Failed to fetch MOs', err)
  } finally {
    isLoading.value = false
  }
}

const fetchBOMs = async (page = 1) => {
  isLoading.value = true
  try {
    const res = await manufacturingService.getAllBoms({
      page,
      limit: bomPagination.value.limit,
      search: bomSearch.value || undefined
    })
    boms.value = res.data
    if (res.pagination) {
      bomPagination.value = res.pagination
    }
  } catch (err) {
    console.error('Failed to fetch BOMs', err)
  } finally {
    isLoading.value = false
  }
}

const fetchWorkcenters = async () => {
  isLoading.value = true
  try {
    const list = await manufacturingService.getWorkcenters()
    for (const wc of list) {
      try {
        const res = await api.get(`/supply_chain/manufacturing/workcenter/${wc.id}/oee`)
        wc.oeeSummary = res.data.data
      } catch (e) {}
    }
    workcenters.value = list
  } catch (err) {
    console.error('Failed to fetch Workcenters', err)
  } finally {
    isLoading.value = false
  }
}

const fetchMPS = async () => {
  try {
    const { data } = await api.get('/supply_chain/manufacturing/mps')
    mpsList.value = data.data || []
  } catch (err) {}
}

const openCreateMPSModal = () => {
  mpsForm.value = {
    product_id: products.value[0]?.id || 1,
    warehouse_id: warehouses.value[0]?.id || 1,
    date_planned: new Date().toISOString().slice(0, 10),
    forecast_qty: 100
  }
  isCreateMPSModalOpen.value = true
}

const submitCreateMPS = async () => {
  try {
    await api.post('/supply_chain/manufacturing/mps', mpsForm.value)
    alert('Jadwal MPS berhasil disimpan!')
    isCreateMPSModalOpen.value = false
    await fetchMPS()
  } catch (err: any) {
    alert('Gagal membuat MPS: ' + (err.response?.data?.message || err.message))
  }
}

const generateMOFromMPS = async (id: number | string) => {
  try {
    await api.post(`/supply_chain/manufacturing/mps/${id}/generate-mo`)
    alert('Surat Perintah Kerja (MO) berhasil di-generate dari jadwal MPS!')
    await fetchMPS()
    await fetchMOs(moPagination.value.page)
  } catch (err: any) {
    alert('Gagal generate MO dari MPS: ' + (err.response?.data?.message || err.message))
  }
}

const openLogOEEModal = (wcId: any, lossType: string = 'productive') => {
  oeeForm.value = { workcenter_id: wcId, loss_type: lossType, duration: 60 }
  isLogOEEModalOpen.value = true
}

const submitLogOEE = async () => {
  try {
    await api.post('/supply_chain/manufacturing/workorder/log-time', oeeForm.value)
    alert('Log efisiensi waktu OEE berhasil dikirim!')
    isLogOEEModalOpen.value = false
    await fetchWorkcenters()
  } catch (err: any) {
    alert('Gagal mengirim log OEE: ' + (err.response?.data?.message || err.message))
  }
}

const fetchProductsAndWarehouses = async () => {
  try {
    products.value = await manufacturingService.getProducts()
    warehouses.value = await manufacturingService.getWarehouses()
  } catch (err) {
    console.error('Failed to fetch master data', err)
  }
}

// Actions
const refreshCurrentTab = () => {
  fetchSummary()
  if (activeTab.value === 'orders') fetchMOs(moPagination.value.page)
  else if (activeTab.value === 'boms') fetchBOMs(bomPagination.value.page)
  else if (activeTab.value === 'workcenters') fetchWorkcenters()
  else if (activeTab.value === 'mps') fetchMPS()
  else if (activeTab.value === 'oee') fetchWorkcenters()
}

const exportCsv = () => {
  alert('Fitur Export CSV segera hadir!')
}

let moSearchTimeout: any
const debounceFetchMOs = () => {
  clearTimeout(moSearchTimeout)
  moSearchTimeout = setTimeout(() => fetchMOs(1), 500)
}

const resetMOFilters = () => {
  moFilters.value = { search: '', state: 'all' }
  fetchMOs(1)
}

let bomSearchTimeout: any
const debounceFetchBOMs = () => {
  clearTimeout(bomSearchTimeout)
  bomSearchTimeout = setTimeout(() => fetchBOMs(1), 500)
}

const handleMOLimitChange = (limit: number) => {
  moPagination.value.limit = limit
  fetchMOs(1)
}

const handleMOProductSelect = () => {
  if (filteredBOMsForProduct.value.length > 0) {
    moForm.value.bom_id = filteredBOMsForProduct.value[0].id
  } else {
    moForm.value.bom_id = undefined
  }
}

const calculateRequiredCompQty = (bomLineQty: number, bomQty: number, moQty: number) => {
  return parseFloat(((bomLineQty / bomQty) * moQty).toFixed(2))
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

const getStatusBadgeClass = (state: string) => {
  switch (state) {
    case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    case 'confirmed': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'progress': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'done': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'cancel': return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

const getStatusLabel = (state: string) => {
  switch (state) {
    case 'draft': return 'Draft'
    case 'confirmed': return 'Confirmed'
    case 'progress': return 'In Progress'
    case 'done': return 'Done'
    case 'cancel': return 'Cancelled'
    default: return state
  }
}

// MO Actions
const openDetailMOModal = (mo: IMrpProductionDto) => {
  activeMO.value = mo
  isDetailMOModalOpen.value = true
}

const confirmMO = async (mo: IMrpProductionDto) => {
  if (!confirm('Konfirmasi MO ini?')) return
  try {
    await manufacturingService.confirmProduction(mo.id!)
    refreshCurrentTab()
  } catch (err: any) { alert(err.response?.data?.message || err.message) }
}

const startMO = async (mo: IMrpProductionDto) => {
  if (!confirm('Mulai produksi MO ini?')) return
  try {
    await manufacturingService.startProduction(mo.id!)
    refreshCurrentTab()
  } catch (err: any) { alert(err.response?.data?.message || err.message) }
}

const finishMO = async (mo: IMrpProductionDto) => {
  if (!confirm('Selesaikan produksi MO ini?')) return
  try {
    await manufacturingService.finishProduction(mo.id!)
    refreshCurrentTab()
  } catch (err: any) { alert(err.response?.data?.message || err.message) }
}

const cancelMO = async (mo: IMrpProductionDto) => {
  if (!confirm('Batalkan MO ini?')) return
  try {
    await manufacturingService.cancelProduction(mo.id!)
    refreshCurrentTab()
  } catch (err: any) { alert(err.response?.data?.message || err.message) }
}

const deleteMO = async (mo: IMrpProductionDto) => {
  if (!confirm('Hapus MO ini?')) return
  try {
    await manufacturingService.deleteProduction(mo.id!)
    refreshCurrentTab()
  } catch (err: any) { alert(err.response?.data?.message || err.message) }
}

const deleteBom = async (bom: IMrpBomDto) => {
  if (!confirm('Hapus BOM ini?')) return
  try {
    await manufacturingService.deleteBom(bom.id!)
    refreshCurrentTab()
  } catch (err: any) { alert(err.response?.data?.message || err.message) }
}

const deleteWorkcenter = async (wc: IMrpWorkcenterDto) => {
  if (!confirm('Hapus Pusat Kerja ini?')) return
  try {
    await manufacturingService.deleteWorkcenter(wc.id!)
    refreshCurrentTab()
  } catch (err: any) { alert(err.response?.data?.message || err.message) }
}

// Modals
const openCreateMOModal = () => {
  moForm.value = {
    product_id: 0,
    product_qty: 1,
    bom_id: undefined,
    warehouse_id: undefined,
    date_planned: new Date().toISOString().split('T')[0],
    notes: ''
  }
  isCreateMOModalOpen.value = true
}

const openCreateBomModal = () => {
  bomForm.value = {
    product_id: 0,
    quantity: 1,
    code: '',
    type: 'normal',
    lines: [{ product_id: 0, quantity: 1 }]
  }
  isCreateBomModalOpen.value = true
}

const openCreateWorkcenterModal = () => {
  wcForm.value = {
    name: '',
    code: '',
    capacity: 1,
    time_efficiency: 100,
    costs_hour: 0
  }
  isCreateWorkcenterModalOpen.value = true
}

// Forms Submission
const submitCreateMO = async () => {
  isSubmitting.value = true
  try {
    await manufacturingService.createProduction(moForm.value)
    isCreateMOModalOpen.value = false
    refreshCurrentTab()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSubmitting.value = false
  }
}

const addBomLine = () => {
  bomForm.value.lines.push({ product_id: 0, quantity: 1 })
}

const removeBomLine = (idx: number) => {
  if (bomForm.value.lines.length > 1) {
    bomForm.value.lines.splice(idx, 1)
  }
}

const submitCreateBOM = async () => {
  isSubmitting.value = true
  try {
    await manufacturingService.createBom(bomForm.value)
    isCreateBomModalOpen.value = false
    refreshCurrentTab()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSubmitting.value = false
  }
}

const submitCreateWorkcenter = async () => {
  isSubmitting.value = true
  try {
    await manufacturingService.createWorkcenter(wcForm.value)
    isCreateWorkcenterModalOpen.value = false
    refreshCurrentTab()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchProductsAndWarehouses()
  refreshCurrentTab()
  fetchMPS()
})
</script>
