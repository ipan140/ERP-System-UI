
<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </span>
            Inventaris & Multi-Gudang
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manajemen stok terintegrasi Odoo 18 / Mekari standard: valuasi real-time, opname fisik, dan transfer antar cabang.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Refresh -->
          <button
            @click="refreshAll"
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

          <!-- Stock Opname Action -->
          <button
            @click="openOpnameModal()"
            class="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition"
          >
            <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="m9 14 2 2 4-4" />
            </svg>
            Stock Opname
          </button>

          <!-- Transfer Antar-Gudang Action -->
          <button
            @click="openTransferModal()"
            class="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 dark:border-purple-700/60 bg-purple-50 dark:bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
          >
            <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
            Transfer Antar-Gudang
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

          <!-- Tambah Produk -->
          <button
            @click="openProductModal('create')"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Produk
          </button>
        </div>
      </div>

      <!-- Executive KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total SKU Master -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total SKU Produk</p>
              <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                {{ formatNumber(summaryData.total_sku) }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">
                Total Fisik: <strong class="text-gray-700 dark:text-gray-300">{{ formatNumber(summaryData.total_on_hand) }}</strong> unit
              </p>
            </div>
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Total Nilai Valuasi Aset -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Nilai Valuasi</p>
              <h3 class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {{ formatRupiah(summaryData.total_valuation) }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Metode: Standar HPP / Costing</p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Stok Kritis / Menipis -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stok Kritis / Kosong</p>
              <div class="flex items-baseline gap-2 mt-1">
                <h3 class="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                  {{ summaryData.out_of_stock_count }}
                </h3>
                <span class="text-xs font-medium text-amber-600 dark:text-amber-400">
                  + {{ summaryData.low_stock_count }} menipis
                </span>
              </div>
              <p class="text-2xs text-gray-400 mt-1">Perlu re-order ke supplier</p>
            </div>
            <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: Stok Terkunci (Reserved SO) -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stok Terkunci (SO)</p>
              <h3 class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {{ formatNumber(summaryData.total_reserved) }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Siap dikirim ke pelanggan</p>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Table Container -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
        
        <!-- Filter & Search Toolbar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50/50 dark:bg-gray-900/30">
          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <!-- Search Input -->
            <div class="relative flex-1 sm:w-72">
              <input
                v-model="searchQuery"
                @keyup.enter="handleFilterChange"
                type="text"
                placeholder="Cari SKU, Barcode, atau Produk..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>

            <!-- Warehouse Selector -->
            <select
              v-model="selectedWarehouse"
              @change="handleFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option :value="0">🏢 Semua Gudang Cabang</option>
              <option v-for="wh in warehouseList" :key="wh.id" :value="wh.id">
                {{ wh.name }} ({{ wh.code }})
              </option>
            </select>

            <!-- Category Filter -->
            <select
              v-model="selectedCategory"
              @change="handleFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option :value="0">🏷️ Semua Kategori</option>
              <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>

            <!-- Stock Status Filter -->
            <select
              v-model="selectedStatus"
              @change="handleFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">📦 Semua Status Stok</option>
              <option value="in_stock">Stok Aman (> 10)</option>
              <option value="low_stock">Stok Menipis (1 - 10)</option>
              <option value="out_of_stock">Stok Kosong (0)</option>
            </select>

            <button
              v-if="searchQuery || selectedWarehouse || selectedCategory || selectedStatus"
              @click="resetFilters"
              class="text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1"
            >
              Reset
            </button>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400 self-end md:self-center">
            Total: <strong class="text-gray-800 dark:text-gray-200">{{ pagination.total_items }}</strong> entri
          </div>
        </div>

        <!-- Table -->
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50/75 dark:bg-gray-900/50">
              <tr>
                <th class="px-4 py-3.5 text-left text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">SKU / Barcode</th>
                <th class="px-4 py-3.5 text-left text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Produk & Kategori</th>
                <th class="px-4 py-3.5 text-center text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Satuan</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">On Hand (Fisik)</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reserved</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Available</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">HPP / Biaya</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Valuasi</th>
                <th class="px-4 py-3.5 text-center text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent">
              <tr v-if="isLoading">
                <td colspan="10" class="py-12 text-center">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Memuat stok inventaris...</p>
                </td>
              </tr>
              <tr v-else-if="error">
                <td colspan="10" class="p-6">
                  <Alert variant="error" title="Gagal Memuat Data" :message="error" />
                </td>
              </tr>
              <tr v-else-if="products.length === 0">
                <td colspan="10" class="py-12 text-center text-gray-500 dark:text-gray-400 text-xs">
                  Tidak ada produk yang cocok dengan pencarian atau filter saat ini.
                </td>
              </tr>
              <tr
                v-for="item in products"
                :key="item.id"
                class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
              >
                <!-- SKU & Barcode -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <div class="font-mono text-xs font-bold text-gray-900 dark:text-white">
                    {{ item.default_code || '-' }}
                  </div>
                  <div class="text-2xs text-gray-400 font-mono mt-0.5">
                    {{ item.barcode ? 'BC: ' + item.barcode : 'No Barcode' }}
                  </div>
                </td>

                <!-- Name & Category -->
                <td class="px-4 py-3.5">
                  <div class="font-semibold text-xs text-gray-800 dark:text-gray-100 line-clamp-1 max-w-xs" :title="getProductName(item)">
                    {{ getProductName(item) }}
                  </div>
                  <div class="text-2xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                    {{ getProductCategory(item) }}
                  </div>
                </td>

                <!-- UoM -->
                <td class="px-4 py-3.5 text-center whitespace-nowrap">
                  <span class="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-2xs font-medium text-gray-600 dark:text-gray-300">
                    {{ getProductUoM(item) }}
                  </span>
                </td>

                <!-- On Hand Qty -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                  <span class="font-bold text-xs" :class="(item.stock_qty || 0) <= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'">
                    {{ formatNumber(item.stock_qty) }}
                  </span>
                </td>

                <!-- Reserved Qty -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                  <span class="text-xs font-medium" :class="(item.reserved_qty || 0) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'">
                    {{ formatNumber(item.reserved_qty || 0) }}
                  </span>
                </td>

                <!-- Available (Free to Use) -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                  <span class="font-bold text-xs" :class="getAvailableQty(item) <= 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'">
                    {{ formatNumber(getAvailableQty(item)) }}
                  </span>
                </td>

                <!-- HPP (Standard Cost) -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                  {{ formatRupiah(getProductUnitCost(item)) }}
                </td>

                <!-- Total Valuation -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap text-xs font-semibold text-gray-900 dark:text-white">
                  {{ formatRupiah((item.stock_qty || 0) * getProductUnitCost(item)) }}
                </td>

                <!-- Status Badge -->
                <td class="px-4 py-3.5 text-center whitespace-nowrap">
                  <span
                    v-if="(item.stock_qty || 0) <= 0"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                  >
                    Habis
                  </span>
                  <span
                    v-else-if="(item.stock_qty || 0) <= 10"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  >
                    Menipis
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    Aman
                  </span>
                </td>

                <!-- Table Actions (Icon-Only with Tooltips) -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <!-- Quick Stock Opname -->
                    <button
                      type="button"
                      @click="openOpnameModal(item)"
                      class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                      title="Stock Opname Produk Ini"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="m9 14 2 2 4-4" />
                      </svg>
                    </button>

                    <!-- Quick Internal Transfer -->
                    <button
                      type="button"
                      @click="openTransferModal(item)"
                      class="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
                      title="Transfer Antar-Gudang"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="17 1 21 5 17 9"></polyline>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                        <polyline points="7 23 3 19 7 15"></polyline>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                      </svg>
                    </button>

                    <!-- Detail Modal -->
                    <button
                      type="button"
                      @click="openDetailModal(item)"
                      class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                      title="Lihat Detail Produk"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <!-- Edit Modal -->
                    <button
                      type="button"
                      @click="openProductModal('edit', item)"
                      class="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                      title="Edit Produk"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <!-- Delete -->
                    <button
                      type="button"
                      @click="deleteProduct(item)"
                      class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Hapus Produk"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <PaginationBar
          :pagination="pagination"
          @change="onPageChange"
        />
      </div>
    </div>

    <!-- Modal 1: Tambah / Edit Produk -->
    <Teleport to="body">
      <div v-if="isProductModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ productModalMode === 'create' ? 'Tambah Master Produk Baru' : 'Edit Data Produk' }}
            </h3>
            <button @click="isProductModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="saveProduct" class="mt-4 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">SKU / Kode Unik *</label>
                <input
                  v-model="productForm.default_code"
                  type="text"
                  required
                  placeholder="Contoh: INV-2026-001"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white font-mono"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Barcode / EAN-13</label>
                <input
                  v-model="productForm.barcode"
                  type="text"
                  placeholder="Contoh: 8991234567890"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Produk *</label>
              <input
                v-model="productForm.name"
                type="text"
                required
                placeholder="Contoh: Mesin Inverter Solar 5kW"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori Produk</label>
                <select
                  v-model="productForm.category_id"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="0">Pilih Kategori...</option>
                  <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Satuan Dasar (UoM)</label>
                <select
                  v-model="productForm.uom_id"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="0">Pilih Satuan...</option>
                  <option v-for="u in uomList" :key="u.id" :value="u.id">
                    {{ u.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Harga Beli / HPP (Rp)</label>
                <input
                  v-model.number="productForm.standard_price"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Harga Jual (Rp)</label>
                <input
                  v-model.number="productForm.list_price"
                  type="number"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stok Awal Fisik</label>
                <input
                  v-model.number="productForm.stock_qty"
                  type="number"
                  min="0"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isProductModalOpen = false"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSavingProduct"
                class="rounded-lg bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {{ isSavingProduct ? 'Menyimpan...' : 'Simpan Produk' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 2: Stock Opname (Penyesuaian Stok Fisik) -->
    <Teleport to="body">
      <div v-if="isOpnameModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <span class="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="m9 14 2 2 4-4" />
                </svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Stock Opname Fisik</h3>
                <p class="text-2xs text-gray-500">Penyesuaian kuantitas fisik dan audit layer valuasi HPP</p>
              </div>
            </div>
            <button @click="isOpnameModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="submitStockOpname" class="mt-4 space-y-4">
            <!-- Product Select / Locked -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Produk Target *</label>
              <select
                v-model="opnameForm.product_id"
                @change="onOpnameProductChange"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                <option :value="0" disabled>Pilih Produk untuk Opname...</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  [{{ p.default_code }}] {{ getProductName(p) }} (Stok Sistem: {{ p.stock_qty || 0 }})
                </option>
              </select>
            </div>

            <!-- Comparison Grid -->
            <div class="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-center">
              <div>
                <span class="block text-2xs text-gray-500 dark:text-gray-400">Stok Sistem</span>
                <span class="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {{ formatNumber(opnameForm.theoretical_qty) }}
                </span>
              </div>
              <div>
                <span class="block text-2xs text-gray-500 dark:text-gray-400">Hasil Hitung Fisik</span>
                <input
                  v-model.number="opnameForm.counted_qty"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full mt-1 text-center font-bold text-sm text-brand-600 rounded-md border border-brand-300 dark:border-brand-600 bg-white dark:bg-gray-800 py-1 focus:outline-none"
                />
              </div>
              <div>
                <span class="block text-2xs text-gray-500 dark:text-gray-400">Selisih (+/-)</span>
                <span
                  class="text-sm font-extrabold"
                  :class="opnameDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                >
                  {{ opnameDiff >= 0 ? '+' : '' }}{{ formatNumber(opnameDiff) }}
                </span>
              </div>
            </div>

            <!-- Reason / Notes -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Alasan Penyesuaian / No. Berita Acara *</label>
              <input
                v-model="opnameForm.reason"
                type="text"
                required
                placeholder="Contoh: Audit Rutin Akhir Bulan / Barang Rusak Pecah di Rak B2"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isOpnameModalOpen = false"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmittingOpname || opnameForm.product_id === 0"
                class="rounded-lg bg-amber-600 hover:bg-amber-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {{ isSubmittingOpname ? 'Memproses Opname...' : 'Konfirmasi Penyesuaian Stok' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 3: Transfer Antar-Gudang -->
    <Teleport to="body">
      <div v-if="isTransferModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <span class="p-2 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Transfer Stok Antar-Gudang</h3>
                <p class="text-2xs text-gray-500">Mutasi internal & penerbitan dokumen picking WH/INT</p>
              </div>
            </div>
            <button @click="isTransferModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="submitTransfer" class="mt-4 space-y-4">
            <!-- Product Select -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pilih Produk *</label>
              <select
                v-model="transferForm.product_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                <option :value="0" disabled>Pilih Produk yang akan ditransfer...</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  [{{ p.default_code }}] {{ getProductName(p) }} (Tersedia: {{ p.stock_qty || 0 }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gudang Asal *</label>
                <select
                  v-model="transferForm.source_warehouse_id"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="0">Gudang Utama (Pusat)</option>
                  <option v-for="wh in warehouseList" :key="wh.id" :value="wh.id">
                    {{ wh.name }} ({{ wh.code }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gudang Tujuan *</label>
                <select
                  v-model="transferForm.dest_warehouse_id"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="0" disabled>Pilih Gudang Penerima...</option>
                  <option v-for="wh in warehouseList" :key="wh.id" :value="wh.id">
                    {{ wh.name }} ({{ wh.code }})
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Jumlah Unit Ditransfer *</label>
              <input
                v-model.number="transferForm.quantity"
                type="number"
                min="1"
                step="1"
                required
                placeholder="Jumlah unit"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white font-bold"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Pengiriman / Ekspedisi</label>
              <input
                v-model="transferForm.notes"
                type="text"
                placeholder="Contoh: Dikirim via Truk Internal Armada 02 / Resi JNE TRUCKING"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isTransferModalOpen = false"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmittingTransfer || transferForm.product_id === 0 || transferForm.dest_warehouse_id === 0"
                class="rounded-lg bg-purple-600 hover:bg-purple-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {{ isSubmittingTransfer ? 'Memproses Transfer...' : 'Kirim Transfer Internal' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 4: Detail Produk -->
    <Teleport to="body">
      <div v-if="isDetailModalOpen && selectedProduct" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <span class="inline-block px-2 py-0.5 rounded text-2xs font-mono font-bold bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                {{ selectedProduct.default_code || 'NO SKU' }}
              </span>
              <h3 class="text-base font-bold text-gray-900 dark:text-white mt-1">
                {{ getProductName(selectedProduct) }}
              </h3>
            </div>
            <button @click="isDetailModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">Kategori</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ getProductCategory(selectedProduct) }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">Barcode</span>
                <span class="font-semibold font-mono text-gray-800 dark:text-white">{{ selectedProduct.barcode || '-' }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">Satuan Dasar</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ getProductUoM(selectedProduct) }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">HPP (Standar Biaya)</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ formatRupiah(getProductUnitCost(selectedProduct)) }}</span>
              </div>
            </div>

            <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-emerald-50/50 dark:bg-emerald-950/20">
              <h4 class="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
                Status Stok Real-Time (Odoo Architecture)
              </h4>
              <div class="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span class="block text-2xs text-gray-500">On Hand (Fisik)</span>
                  <span class="text-base font-extrabold text-gray-900 dark:text-white">
                    {{ formatNumber(selectedProduct.stock_qty) }}
                  </span>
                </div>
                <div>
                  <span class="block text-2xs text-gray-500">Terkunci (SO)</span>
                  <span class="text-base font-extrabold text-amber-600 dark:text-amber-400">
                    {{ formatNumber(selectedProduct.reserved_qty || 0) }}
                  </span>
                </div>
                <div>
                  <span class="block text-2xs text-gray-500">Bebas Pakai</span>
                  <span class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {{ formatNumber(getAvailableQty(selectedProduct)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              @click="isDetailModalOpen = false"
              class="rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import Alert from '@/components/ui/Alert.vue'
import type { IPaginationMeta } from '@/types'
import type {
  IProductDto,
  IInventorySummaryDto,
  IStockWarehouseDto,
  IProductCategoryDto,
  IUoMDto,
  IStockAdjustmentPayload,
  IInternalTransferPayload
} from '@/types/supply-chain/inventory.dto'
import { inventoryService } from '@/services/supply-chain/inventory.service'

// State
const products = ref<IProductDto[]>([])
const warehouseList = ref<IStockWarehouseDto[]>([])
const categoryList = ref<IProductCategoryDto[]>([])
const uomList = ref<IUoMDto[]>([])

const isLoading = ref(false)
const error = ref<string | null>(null)

// Summary Data
const summaryData = ref<IInventorySummaryDto>({
  total_sku: 0,
  total_valuation: 0,
  low_stock_count: 0,
  out_of_stock_count: 0,
  total_reserved: 0,
  total_on_hand: 0
})

// Pagination
const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

// Filters
const searchQuery = ref('')
const selectedWarehouse = ref<number>(0)
const selectedCategory = ref<number>(0)
const selectedStatus = ref<string>('')

// Modal: Product Create / Edit
const isProductModalOpen = ref(false)
const productModalMode = ref<'create' | 'edit'>('create')
const isSavingProduct = ref(false)
const productForm = ref({
  id: 0,
  default_code: '',
  barcode: '',
  name: '',
  category_id: 0,
  uom_id: 0,
  list_price: 0,
  standard_price: 0,
  stock_qty: 0
})

// Modal: Stock Opname
const isOpnameModalOpen = ref(false)
const isSubmittingOpname = ref(false)
const opnameForm = ref<IStockAdjustmentPayload>({
  product_id: 0,
  theoretical_qty: 0,
  counted_qty: 0,
  reason: ''
})

const opnameDiff = computed(() => {
  return (opnameForm.value.counted_qty || 0) - (opnameForm.value.theoretical_qty || 0)
})

// Modal: Transfer
const isTransferModalOpen = ref(false)
const isSubmittingTransfer = ref(false)
const transferForm = ref<IInternalTransferPayload>({
  product_id: 0,
  source_warehouse_id: 0,
  dest_warehouse_id: 0,
  quantity: 1,
  notes: ''
})

// Modal: Detail
const isDetailModalOpen = ref(false)
const selectedProduct = ref<IProductDto | null>(null)

// Helpers
const getProductName = (item: IProductDto): string => {
  return item.ProductTemplate?.name || item.productTemplate?.name || (item as any).name || 'Produk Tanpa Nama'
}

const getProductCategory = (item: IProductDto): string => {
  const pt = item.ProductTemplate || item.productTemplate
  return pt?.category?.name || 'Umum'
}

const getProductUoM = (item: IProductDto): string => {
  const pt = item.ProductTemplate || item.productTemplate
  return pt?.uoM?.name || pt?.uompo?.name || 'Unit'
}

const getProductUnitCost = (item: IProductDto): number => {
  const pt = item.ProductTemplate || item.productTemplate
  if (pt?.standard_price && pt.standard_price > 0) return pt.standard_price
  if (pt?.list_price && pt.list_price > 0) return pt.list_price
  return 0
}

const getAvailableQty = (item: IProductDto): number => {
  return (item.stock_qty || 0) - (item.reserved_qty || 0)
}

const formatRupiah = (val?: number): string => {
  if (val === undefined || val === null || isNaN(val)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

const formatNumber = (val?: number): string => {
  if (val === undefined || val === null || isNaN(val)) return '0'
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(val)
}

// Data Fetching
const fetchSummary = async () => {
  try {
    const res = await inventoryService.getSummary()
    if (res) summaryData.value = res
  } catch (e) {
    console.error('Failed to load inventory summary', e)
  }
}

const fetchMasterData = async () => {
  try {
    const [whs, cats, uoms] = await Promise.all([
      inventoryService.getWarehouses(),
      inventoryService.getCategories(),
      inventoryService.getUoMs()
    ])
    warehouseList.value = whs
    categoryList.value = cats
    uomList.value = uoms
  } catch (e) {
    console.error('Failed to load master filters', e)
  }
}

const fetchProducts = async () => {
  isLoading.value = true
  error.value = null
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedWarehouse.value > 0) params.warehouse_id = selectedWarehouse.value
    if (selectedCategory.value > 0) params.category_id = selectedCategory.value
    if (selectedStatus.value) params.stock_status = selectedStatus.value

    const res = await inventoryService.getAll(params)
    products.value = res.data || []
    if (res.pagination) {
      pagination.value = {
        current_page: res.pagination.current_page || res.pagination.page || 1,
        per_page: res.pagination.per_page || res.pagination.limit || 10,
        total_items: res.pagination.total_items || 0,
        total_pages: res.pagination.total_pages || 1,
        has_next: res.pagination.has_next || false,
        has_prev: res.pagination.has_prev || false
      }
    }
  } catch (err: any) {
    error.value = 'Gagal memuat inventaris: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const refreshAll = () => {
  fetchProducts()
  fetchSummary()
}

const handleFilterChange = () => {
  pagination.value.current_page = 1
  fetchProducts()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedWarehouse.value = 0
  selectedCategory.value = 0
  selectedStatus.value = ''
  pagination.value.current_page = 1
  fetchProducts()
}

const onPageChange = ({ page, limit }: { page: number; limit: number }) => {
  pagination.value.current_page = page
  pagination.value.per_page = limit
  fetchProducts()
}

// Product Modal Handlers
const openProductModal = (mode: 'create' | 'edit', item?: IProductDto) => {
  productModalMode.value = mode
  if (mode === 'edit' && item) {
    const pt = item.ProductTemplate || item.productTemplate
    productForm.value = {
      id: item.id || 0,
      default_code: item.default_code || '',
      barcode: item.barcode || '',
      name: pt?.name || '',
      category_id: pt?.category_id || 0,
      uom_id: pt?.uom_id || 0,
      list_price: pt?.list_price || 0,
      standard_price: pt?.standard_price || 0,
      stock_qty: item.stock_qty || 0
    }
  } else {
    productForm.value = {
      id: 0,
      default_code: 'SKU-' + Date.now().toString().slice(-6),
      barcode: '',
      name: '',
      category_id: categoryList.value[0]?.id || 0,
      uom_id: uomList.value[0]?.id || 0,
      list_price: 0,
      standard_price: 0,
      stock_qty: 0
    }
  }
  isProductModalOpen.value = true
}

const saveProduct = async () => {
  isSavingProduct.value = true
  try {
    const payload = {
      default_code: productForm.value.default_code,
      barcode: productForm.value.barcode,
      stock_qty: productForm.value.stock_qty,
      ProductTemplate: {
        name: productForm.value.name,
        category_id: productForm.value.category_id || undefined,
        uom_id: productForm.value.uom_id || undefined,
        list_price: productForm.value.list_price,
        standard_price: productForm.value.standard_price,
        type: 'product'
      }
    }

    if (productModalMode.value === 'edit' && productForm.value.id) {
      await inventoryService.update(productForm.value.id, payload)
    } else {
      await inventoryService.create(payload)
    }
    isProductModalOpen.value = false
    refreshAll()
  } catch (err: any) {
    alert('Gagal menyimpan produk: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingProduct.value = false
  }
}

const deleteProduct = async (item: IProductDto) => {
  if (!item.id) return
  if (!confirm(`Hapus produk "${getProductName(item)}" (${item.default_code}) dari sistem?`)) return
  try {
    await inventoryService.delete(item.id)
    refreshAll()
  } catch (err: any) {
    alert('Gagal menghapus produk: ' + (err.response?.data?.message || err.message))
  }
}

// Opname Handlers
const openOpnameModal = (item?: IProductDto) => {
  if (item) {
    opnameForm.value = {
      product_id: item.id || 0,
      theoretical_qty: item.stock_qty || 0,
      counted_qty: item.stock_qty || 0,
      reason: ''
    }
  } else if (products.value.length > 0) {
    const first = products.value[0]
    opnameForm.value = {
      product_id: first.id || 0,
      theoretical_qty: first.stock_qty || 0,
      counted_qty: first.stock_qty || 0,
      reason: ''
    }
  }
  isOpnameModalOpen.value = true
}

const onOpnameProductChange = () => {
  const p = products.value.find(x => x.id === opnameForm.value.product_id)
  if (p) {
    opnameForm.value.theoretical_qty = p.stock_qty || 0
    opnameForm.value.counted_qty = p.stock_qty || 0
  }
}

const submitStockOpname = async () => {
  if (!opnameForm.value.product_id) return
  isSubmittingOpname.value = true
  try {
    await inventoryService.adjustStock(opnameForm.value)
    alert('Penyesuaian stok opname berhasil dicatat ke sistem!')
    isOpnameModalOpen.value = false
    refreshAll()
  } catch (err: any) {
    alert('Gagal penyesuaian opname: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmittingOpname.value = false
  }
}

// Transfer Handlers
const openTransferModal = (item?: IProductDto) => {
  transferForm.value = {
    product_id: item?.id || (products.value[0]?.id || 0),
    source_warehouse_id: warehouseList.value[0]?.id || 0,
    dest_warehouse_id: warehouseList.value[1]?.id || (warehouseList.value[0]?.id || 0),
    quantity: 1,
    notes: ''
  }
  isTransferModalOpen.value = true
}

const submitTransfer = async () => {
  if (!transferForm.value.product_id || !transferForm.value.dest_warehouse_id) return
  isSubmittingTransfer.value = true
  try {
    await inventoryService.transferStock(transferForm.value)
    alert('Transfer stok antar-gudang berhasil diproses!')
    isTransferModalOpen.value = false
    refreshAll()
  } catch (err: any) {
    alert('Gagal memproses transfer: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmittingTransfer.value = false
  }
}

// Detail Handlers
const openDetailModal = (item: IProductDto) => {
  selectedProduct.value = item
  isDetailModalOpen.value = true
}

// Export CSV
const exportCsv = () => {
  if (products.value.length === 0) return
  const headers = ['ID', 'SKU', 'Barcode', 'Nama Produk', 'Kategori', 'Satuan', 'On Hand', 'Reserved', 'Free to Use', 'HPP', 'Total Valuasi']
  const rows = products.value.map(p => [
    p.id,
    p.default_code || '',
    p.barcode || '',
    `"${getProductName(p).replace(/"/g, '""')}"`,
    `"${getProductCategory(p)}"`,
    getProductUoM(p),
    p.stock_qty || 0,
    p.reserved_qty || 0,
    getAvailableQty(p),
    getProductUnitCost(p),
    (p.stock_qty || 0) * getProductUnitCost(p)
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `inventaris_stok_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchMasterData()
  refreshAll()
})
</script>
