<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            Pengadaan & Pembelian (Procurement)
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo 18 Purchase & Mekari SCM: siklus RFQ &rarr; PO, validasi approval bertingkat, dan Three-Way Matching penerimaan gudang.
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

          <!-- Tender Pengadaan Button -->
          <button
            @click="openTenderModal()"
            class="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 dark:border-purple-700/60 bg-purple-50 dark:bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
          >
            <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Tender Pengadaan (RFQ Comparison)
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

          <!-- Buat RFQ / PO Baru -->
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat PO Baru
          </button>
        </div>
      </div>

      <!-- Executive KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Belanja Bulan Ini -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Belanja Bulan Ini</p>
              <h3 class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {{ formatRupiah(summaryData.total_spent_monthly) }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Total PO Sah / Diterima</p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Menunggu Persetujuan Manajer -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Menunggu Persetujuan</p>
              <h3 class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {{ summaryData.to_approve_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Limit belanja &gt; Rp 50 Juta</p>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Menunggu Penerimaan Barang Gudang -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dalam Pengiriman</p>
              <h3 class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {{ summaryData.to_receive_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Menunggu Three-Way Matching</p>
            </div>
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: Vendor / Pemasok Aktif -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor / Pemasok</p>
              <h3 class="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {{ summaryData.active_vendor_count }}
              </h3>
              <p class="text-2xs text-gray-400 mt-1">Total PO Terdaftar: {{ summaryData.total_po_count }}</p>
            </div>
            <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Container: Table & Filters -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
        
        <!-- Filter Toolbar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50/50 dark:bg-gray-900/30">
          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <!-- Search -->
            <div class="relative flex-1 sm:w-72">
              <input
                v-model="searchQuery"
                @keyup.enter="handleFilterChange"
                type="text"
                placeholder="Cari No. PO atau Nama Vendor..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>

            <!-- Status Filter -->
            <select
              v-model="selectedStatus"
              @change="handleFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">Semua Status Pengadaan</option>
              <option value="draft">Draft (RFQ)</option>
              <option value="sent">RFQ Terkirim</option>
              <option value="to_approve">To Approve (Persetujuan)</option>
              <option value="purchase">PO Sah (Dalam Pengiriman)</option>
              <option value="done">Selesai (Barang Diterima)</option>
              <option value="cancel">Dibatalkan</option>
            </select>

            <!-- Vendor Filter -->
            <select
              v-model="selectedVendor"
              @change="handleFilterChange"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option :value="0">Semua Vendor</option>
              <option v-for="v in vendorList" :key="v.id" :value="v.id">
                {{ v.name }}
              </option>
            </select>

            <button
              v-if="searchQuery || selectedStatus || selectedVendor"
              @click="resetFilters"
              class="text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1"
            >
              Reset
            </button>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400 self-end md:self-center">
            Total: <strong class="text-gray-800 dark:text-gray-200">{{ pagination.total_items }}</strong> Purchase Orders
          </div>
        </div>

        <!-- Table -->
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50/75 dark:bg-gray-900/50">
              <tr>
                <th class="px-4 py-3.5 text-left text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">No. PO</th>
                <th class="px-4 py-3.5 text-left text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tanggal Order</th>
                <th class="px-4 py-3.5 text-left text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Vendor / Pemasok</th>
                <th class="px-4 py-3.5 text-center text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Rincian Item</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subtotal</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">PPN (11%)</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Grand Total</th>
                <th class="px-4 py-3.5 text-center text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-4 py-3.5 text-right text-2xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent">
              <tr v-if="isLoading">
                <td colspan="9" class="py-12 text-center">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Memuat data pengadaan...</p>
                </td>
              </tr>
              <tr v-else-if="error">
                <td colspan="9" class="p-6">
                  <Alert variant="error" title="Gagal Memuat Data" :message="error" />
                </td>
              </tr>
              <tr v-else-if="purchaseOrders.length === 0">
                <td colspan="9" class="py-12 text-center text-gray-500 dark:text-gray-400 text-xs">
                  Tidak ada dokumen Purchase Order yang cocok.
                </td>
              </tr>
              <tr
                v-for="po in purchaseOrders"
                :key="po.id"
                class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
              >
                <!-- No PO -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span
                    @click="openDetailModal(po)"
                    class="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    {{ po.name || ('PO-' + po.id) }}
                  </span>
                </td>

                <!-- Date -->
                <td class="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                  {{ formatDate(po.date_order || po.created_at) }}
                </td>

                <!-- Vendor -->
                <td class="px-4 py-3.5">
                  <div class="font-semibold text-xs text-gray-900 dark:text-white">
                    {{ po.partner?.name || 'Vendor #' + po.partner_id }}
                  </div>
                  <div class="text-2xs text-gray-400">
                    {{ po.partner?.city || 'Domestik' }}
                  </div>
                </td>

                <!-- Items Preview -->
                <td class="px-4 py-3.5 text-center whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {{ po.order_lines ? po.order_lines.length : 0 }} Item
                  </span>
                </td>

                <!-- Subtotal -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                  {{ formatRupiah(po.amount_untaxed) }}
                </td>

                <!-- Tax -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {{ formatRupiah(po.amount_tax) }}
                </td>

                <!-- Grand Total -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap font-bold text-xs text-gray-900 dark:text-white">
                  {{ formatRupiah(po.amount_total) }}
                </td>

                <!-- Status Badge -->
                <td class="px-4 py-3.5 text-center whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold"
                    :class="getStatusBadgeClass(po.state)"
                  >
                    {{ getStatusLabel(po.state) }}
                  </span>
                </td>

                <!-- Actions (Icon-Only with Tooltips) -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <!-- Confirm RFQ (for draft / sent) -->
                    <button
                      v-if="po.state === 'draft' || po.state === 'sent'"
                      @click="confirmOrder(po)"
                      class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                      title="Konfirmasi Pesanan (Jadikan PO Sah)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>

                    <!-- Manager Approval (for to_approve) -->
                    <button
                      v-if="po.state === 'to_approve'"
                      @click="approveOrder(po)"
                      class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                      title="Setujui PO (Approval Manajer)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </button>

                    <!-- Receive Goods (for purchase state) -->
                    <button
                      v-if="po.state === 'purchase'"
                      @click="openReceiveModal(po)"
                      class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                      title="Terima Barang Fisik (Three-Way Matching)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </button>

                    <!-- Landed Cost (for done state) -->
                    <button
                      v-if="po.state === 'done'"
                      @click="openLandedCostModal(po)"
                      class="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
                      title="Tambahkan Biaya Ongkir / Cukai (Landed Costs)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </button>

                    <!-- Detail Modal -->
                    <button
                      @click="openDetailModal(po)"
                      class="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Lihat Detail PO"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <!-- Cancel / Delete (if draft) -->
                    <button
                      v-if="po.state === 'draft' || po.state === 'sent'"
                      @click="deleteOrder(po)"
                      class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Batalkan / Hapus PO"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
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

    <!-- Modal 1: Buat PO / RFQ Baru -->
    <Teleport to="body">
      <div v-if="isCreateModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Buat Purchase Order / RFQ Baru</h3>
              <p class="text-2xs text-gray-500">Pemesanan barang ke vendor dengan kalkulasi otomatis PPN 11%</p>
            </div>
            <button @click="isCreateModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="submitCreatePO" class="mt-4 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Vendor / Pemasok *</label>
                <select
                  v-model="createForm.partner_id"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="0" disabled>Pilih Vendor...</option>
                  <option v-for="v in vendorList" :key="v.id" :value="v.id">
                    {{ v.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tanggal Pesanan</label>
                <input
                  v-model="createForm.date_order"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <!-- Items Table Builder -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Daftar Barang yang Dipesan *
                </label>
                <button
                  type="button"
                  @click="addItemRow"
                  class="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  + Tambah Baris Produk
                </button>
              </div>

              <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  <thead class="bg-gray-50 dark:bg-gray-900/60">
                    <tr>
                      <th class="px-3 py-2 text-left text-2xs font-bold text-gray-500">Produk</th>
                      <th class="px-3 py-2 text-center text-2xs font-bold text-gray-500 w-24">Jumlah</th>
                      <th class="px-3 py-2 text-right text-2xs font-bold text-gray-500 w-36">Harga Satuan (Rp)</th>
                      <th class="px-3 py-2 text-right text-2xs font-bold text-gray-500 w-36">Subtotal (Rp)</th>
                      <th class="px-3 py-2 text-center text-2xs font-bold text-gray-500 w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                    <tr v-for="(row, idx) in createForm.lines" :key="idx">
                      <!-- Product Select -->
                      <td class="p-2">
                        <select
                          v-model="row.product_id"
                          @change="onProductSelect(row)"
                          required
                          class="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                          <option :value="0" disabled>Pilih Produk...</option>
                          <option v-for="p in productList" :key="p.id" :value="p.id">
                            [{{ p.default_code }}] {{ getProductName(p) }}
                          </option>
                        </select>
                      </td>

                      <!-- Qty -->
                      <td class="p-2">
                        <input
                          v-model.number="row.quantity"
                          type="number"
                          min="1"
                          step="1"
                          required
                          class="w-full text-center rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold"
                        />
                      </td>

                      <!-- Unit Price -->
                      <td class="p-2">
                        <input
                          v-model.number="row.price_unit"
                          type="number"
                          min="0"
                          step="100"
                          required
                          class="w-full text-right rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </td>

                      <!-- Row Subtotal -->
                      <td class="p-2 text-right font-semibold text-gray-900 dark:text-white">
                        {{ formatRupiah(row.quantity * row.price_unit) }}
                      </td>

                      <!-- Delete Row -->
                      <td class="p-2 text-center">
                        <button
                          type="button"
                          @click="removeItemRow(idx)"
                          :disabled="createForm.lines.length <= 1"
                          class="text-gray-400 hover:text-rose-500 disabled:opacity-20"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Notes & Summary Calculation -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan / Syarat Pembayaran</label>
                <textarea
                  v-model="createForm.notes"
                  rows="3"
                  placeholder="Contoh: Pembayaran tempo 30 hari (Net 30) setelah barang diterima lengkap."
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>

              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs">
                <div class="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <strong class="text-gray-900 dark:text-white">{{ formatRupiah(calculatedSubtotal) }}</strong>
                </div>
                <div class="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>PPN 11%:</span>
                  <strong class="text-gray-900 dark:text-white">{{ formatRupiah(calculatedTax) }}</strong>
                </div>
                <div class="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                  <span>Total Nilai PO:</span>
                  <span class="text-brand-600 dark:text-brand-400 text-base">{{ formatRupiah(calculatedTotal) }}</span>
                </div>
                <p v-if="calculatedTotal > 50000000" class="text-2xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠️ Nilai pesanan &gt; Rp 50 Juta, memerlukan Approval Manajer saat dikonfirmasi.
                </p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateModalOpen = false"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmittingCreate || createForm.partner_id === 0"
                class="rounded-lg bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {{ isSubmittingCreate ? 'Menyimpan...' : 'Simpan Purchase Order' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 2: Penerimaan Barang (Goods Receipt / Three-Way Matching) -->
    <Teleport to="body">
      <div v-if="isReceiveModalOpen && activePO" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <span class="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">
                  Penerimaan Barang Fisik (Goods Receipt)
                </h3>
                <p class="text-2xs text-gray-500 font-mono">
                  Dokumen: {{ activePO.name }} • Vendor: {{ activePO.partner?.name || 'Pemasok' }}
                </p>
              </div>
            </div>
            <button @click="isReceiveModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="submitGoodsReceipt" class="mt-4 space-y-4">
            <!-- Warehouse Select -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gudang Penerima *</label>
              <select
                v-model="receiveForm.warehouse_id"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                <option :value="0">Gudang Utama (Default)</option>
                <option v-for="wh in warehouseList" :key="wh.id" :value="wh.id">
                  {{ wh.name }} ({{ wh.code }})
                </option>
              </select>
            </div>

            <!-- Matching Table -->
            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                <thead class="bg-gray-50 dark:bg-gray-900/60">
                  <tr>
                    <th class="px-3 py-2 text-left text-2xs font-bold text-gray-500">Nama Produk</th>
                    <th class="px-3 py-2 text-center text-2xs font-bold text-gray-500">Dipesan</th>
                    <th class="px-3 py-2 text-center text-2xs font-bold text-gray-500">Sdh Terima</th>
                    <th class="px-3 py-2 text-center text-2xs font-bold text-gray-500">Sisa</th>
                    <th class="px-3 py-2 text-center text-2xs font-bold text-emerald-600 w-28">Terima Saat Ini</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                  <tr v-for="item in receiveForm.items" :key="item.line_id">
                    <td class="p-2 font-medium text-gray-900 dark:text-white">
                      {{ item.name }}
                    </td>
                    <td class="p-2 text-center text-gray-500">
                      {{ item.quantity }}
                    </td>
                    <td class="p-2 text-center text-amber-600 font-semibold">
                      {{ item.qty_received_so_far }}
                    </td>
                    <td class="p-2 text-center text-gray-700 dark:text-gray-300 font-bold">
                      {{ Math.max(0, item.quantity - item.qty_received_so_far) }}
                    </td>
                    <td class="p-2 text-center">
                      <input
                        v-model.number="item.qty_received"
                        type="number"
                        min="0"
                        :max="Math.max(0, item.quantity - item.qty_received_so_far)"
                        step="1"
                        class="w-full text-center font-bold text-emerald-600 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 py-1 focus:outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">No. Surat Jalan Vendor / Resi Ekspedisi</label>
              <input
                v-model="receiveForm.notes"
                type="text"
                placeholder="Contoh: SJ/VND/2026/0912 via Kurir Lalamove"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isReceiveModalOpen = false"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmittingReceive"
                class="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {{ isSubmittingReceive ? 'Memproses Masuk Gudang...' : 'Konfirmasi Masuk Gudang' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 3: Detail Purchase Order -->
    <Teleport to="body">
      <div v-if="isDetailModalOpen && activePO" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-2xs font-semibold" :class="getStatusBadgeClass(activePO.state)">
                {{ getStatusLabel(activePO.state) }}
              </span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {{ activePO.name }}
              </h3>
            </div>
            <button @click="isDetailModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <div class="mt-4 space-y-4 text-xs">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">Vendor</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ activePO.partner?.name || '-' }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">Tanggal Order</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ formatDate(activePO.date_order) }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">Total Nilai</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatRupiah(activePO.amount_total) }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span class="text-gray-400 block text-2xs">Status Approval</span>
                <span class="font-semibold" :class="activePO.approved_at ? 'text-emerald-600' : 'text-gray-500'">
                  {{ activePO.approved_at ? 'Disetujui' : 'Standar' }}
                </span>
              </div>
            </div>

            <!-- Items List -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/60 text-2xs font-bold text-gray-500">
                  <tr>
                    <th class="px-3 py-2 text-left">Produk</th>
                    <th class="px-3 py-2 text-center">Dipesan</th>
                    <th class="px-3 py-2 text-center">Diterima Fisik</th>
                    <th class="px-3 py-2 text-right">Harga Satuan</th>
                    <th class="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                  <tr v-for="l in activePO.order_lines" :key="l.id">
                    <td class="p-2">
                      <div class="font-medium text-gray-900 dark:text-white">{{ l.name || l.product?.default_code }}</div>
                    </td>
                    <td class="p-2 text-center">{{ l.quantity }}</td>
                    <td class="p-2 text-center font-bold" :class="(l.qty_received || 0) >= (l.quantity || 0) ? 'text-emerald-600' : 'text-amber-600'">
                      {{ l.qty_received || 0 }}
                    </td>
                    <td class="p-2 text-right">{{ formatRupiah(l.price_unit) }}</td>
                    <td class="p-2 text-right font-semibold">{{ formatRupiah(l.price_subtotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="activePO.notes" class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300">
              <strong>Catatan:</strong> {{ activePO.notes }}
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
  
    <!-- MODAL TENDER & RFQ COMPARISON -->
    <Teleport to="body">
      <div v-if="isTenderModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div class="flex items-center justify-between border-b pb-3 dark:border-gray-700">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Tender Pengadaan Multi-Vendor & Matriks Komparasi RFQ</h3>
              <p class="text-2xs text-gray-400">Undang beberapa vendor sekaligus, bandingkan penawaran harga, dan tentukan pemenang lelang</p>
            </div>
            <button @click="isTenderModalOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <!-- Active Tenders List -->
          <div class="mt-4">
            <h4 class="text-xs font-bold text-gray-800 dark:text-white mb-2">Daftar Tender Aktif</h4>
            <div class="overflow-x-auto max-h-48 border rounded mb-4">
              <table class="min-w-full text-xs text-left">
                <thead class="bg-gray-50 dark:bg-gray-900 border-b">
                  <tr>
                    <th class="p-2">Kode</th>
                    <th class="p-2">Judul Tender</th>
                    <th class="p-2">Batas Waktu</th>
                    <th class="p-2">Status</th>
                    <th class="p-2 text-right">Penawaran Masuk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="tenders.length === 0"><td colspan="5" class="p-4 text-center text-gray-400">Belum ada tender pengadaan aktif.</td></tr>
                  <tr v-for="t in tenders" :key="t.id" @click="selectTender(t)" class="border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td class="p-2 font-mono font-bold text-purple-600">{{ t.name }}</td>
                    <td class="p-2 font-semibold">{{ t.title }}</td>
                    <td class="p-2">{{ formatDate(t.date_end) }}</td>
                    <td class="p-2"><span class="px-2 py-0.5 rounded text-2xs font-bold bg-purple-100 text-purple-700 uppercase">{{ t.state }}</span></td>
                    <td class="p-2 text-right font-bold">{{ t.orders?.length || 0 }} Vendor</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- RFQ Comparison Matrix if selected -->
            <div v-if="selectedTender" class="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl mb-4">
              <div class="flex justify-between items-center mb-2">
                <h5 class="text-xs font-bold text-purple-900 dark:text-purple-300">
                  Matriks Perbandingan Penawaran: {{ selectedTender.title }} ({{ selectedTender.name }})
                </h5>
                <span class="text-2xs text-gray-400">Pilih penawaran terbaik untuk dijadikan PO Sah</span>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full text-xs text-left bg-white dark:bg-gray-800 border rounded">
                  <thead class="bg-gray-100 dark:bg-gray-900">
                    <tr>
                      <th class="p-2">Vendor Peserta</th>
                      <th class="p-2">No. RFQ</th>
                      <th class="p-2 text-right">Total Penawaran</th>
                      <th class="p-2 text-center">Status</th>
                      <th class="p-2 text-right">Pemenang Tender</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ord in selectedTender.orders" :key="ord.id" class="border-b">
                      <td class="p-2 font-semibold">{{ ord.partner?.name || 'Vendor' }}</td>
                      <td class="p-2 font-mono text-2xs">{{ ord.name }}</td>
                      <td class="p-2 text-right font-bold text-emerald-600">{{ formatRupiah(ord.amount_total) }}</td>
                      <td class="p-2 text-center"><span class="text-2xs uppercase">{{ ord.state }}</span></td>
                      <td class="p-2 text-right">
                        <button
                          v-if="selectedTender.state !== 'done' && ord.state !== 'cancel'"
                          @click="chooseWinner(selectedTender.id, ord.id)"
                          class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-2xs font-bold"
                        >
                          🏆 Pilih Sebagai Pemenang
                        </button>
                        <span v-else-if="selectedTender.winner_po_id === ord.id" class="text-2xs font-bold text-emerald-600">🏆 Pemenang Sah</span>
                        <span v-else class="text-2xs text-gray-400">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Form Create Tender -->
            <form @submit.prevent="submitCreateTender" class="border-t pt-3 space-y-3 dark:border-gray-700">
              <h4 class="text-xs font-bold text-gray-800 dark:text-white">+ Buka Undangan Tender Baru</h4>
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2">
                  <label class="block text-2xs mb-1">Judul Pengadaan / Tender</label>
                  <input type="text" v-model="tenderForm.title" required class="w-full border rounded p-1.5 text-xs dark:bg-gray-900" placeholder="cth. Pengadaan 500 Karung Bahan Baku Plastik PP" />
                </div>
                <div>
                  <label class="block text-2xs mb-1">Pilih Produk</label>
                  <select v-model="tenderForm.product_id" required class="w-full border rounded p-1.5 text-xs dark:bg-gray-900">
                    <option v-for="p in productList" :key="p.id" :value="p.id">{{ p.ProductTemplate?.name || p.default_code }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-2xs mb-1">Jumlah Kebutuhan</label>
                  <input type="number" v-model.number="tenderForm.quantity" required class="w-full border rounded p-1.5 text-xs dark:bg-gray-900" />
                </div>
                <div>
                  <label class="block text-2xs mb-1">Estimasi Harga Satuan (HPS)</label>
                  <input type="number" v-model.number="tenderForm.est_price" required class="w-full border rounded p-1.5 text-xs dark:bg-gray-900" />
                </div>
                <div>
                  <label class="block text-2xs mb-1">Batas Waktu Penawaran</label>
                  <input type="date" v-model="tenderForm.date_end" required class="w-full border rounded p-1.5 text-xs dark:bg-gray-900" />
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="submit" :disabled="isSubmittingTender" class="px-4 py-1.5 bg-purple-600 text-white rounded text-xs font-bold">
                  {{ isSubmittingTender ? 'Menerbitkan...' : 'Kirim Undangan Tender ke Seluruh Vendor' }}
                </button>
              </div>
            </form>
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
  IPurchaseOrderDto,
  IPurchaseSummaryDto,
  ICreatePOPayload
} from '@/types/supply-chain/purchase.dto'
import { purchaseService } from '@/services/supply-chain/purchase.service'

// State
const purchaseOrders = ref<IPurchaseOrderDto[]>([])
const vendorList = ref<any[]>([])
const productList = ref<any[]>([])
const warehouseList = ref<any[]>([])

const isLoading = ref(false)
const error = ref<string | null>(null)

// Summary
const summaryData = ref<IPurchaseSummaryDto>({
  total_spent_monthly: 0,
  to_approve_count: 0,
  to_receive_count: 0,
  active_vendor_count: 0,
  total_po_count: 0
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
const selectedStatus = ref('')
const selectedVendor = ref<number>(0)

// Active PO for Modals
const activePO = ref<IPurchaseOrderDto | null>(null)

// Modal: Create PO
const isCreateModalOpen = ref(false)
const isSubmittingCreate = ref(false)
const createForm = ref<ICreatePOPayload>({
  partner_id: 0,
  date_order: new Date().toISOString().slice(0, 10),
  notes: '',
  lines: [
    { product_id: 0, name: '', quantity: 1, price_unit: 0 }
  ]
})

// Calculations for Create Modal
const calculatedSubtotal = computed(() => {
  return createForm.value.lines.reduce((acc, row) => acc + (row.quantity * row.price_unit), 0)
})

const calculatedTax = computed(() => {
  return calculatedSubtotal.value * 0.11
})

const calculatedTotal = computed(() => {
  return calculatedSubtotal.value + calculatedTax.value
})

// Modal: Receive Goods
const isReceiveModalOpen = ref(false)
const isSubmittingReceive = ref(false)
const receiveForm = ref<{
  warehouse_id: number;
  notes: string;
  items: Array<{
    line_id: number;
    name: string;
    quantity: number;
    qty_received_so_far: number;
    qty_received: number;
  }>;
}>({
  warehouse_id: 0,
  notes: '',
  items: []
})

// Modal: Detail
const isDetailModalOpen = ref(false)

// Formatting Helpers
const formatRupiah = (val?: number) => {
  if (val === undefined || val === null || isNaN(val)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

const formatDate = (val?: string) => {
  if (!val) return '-'
  try {
    return new Date(val).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return val
  }
}

const getStatusLabel = (state?: string) => {
  switch (state) {
    case 'draft': return 'Draft (RFQ)'
    case 'sent': return 'RFQ Terkirim'
    case 'to_approve': return 'To Approve'
    case 'purchase': return 'PO Sah'
    case 'done': return 'Selesai Diterima'
    case 'cancel': return 'Dibatalkan'
    default: return state || 'Draft'
  }
}

const getStatusBadgeClass = (state?: string) => {
  switch (state) {
    case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    case 'to_approve': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    case 'purchase': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
    case 'done': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    case 'cancel': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getProductName = (p: any): string => {
  return p.ProductTemplate?.name || p.productTemplate?.name || p.name || 'Produk'
}

// Data Fetching
const fetchSummary = async () => {
  try {
    const res = await purchaseService.getSummary()
    if (res) summaryData.value = res
  } catch (e) {
    console.error('Failed to load purchase summary', e)
  }
}

const fetchMasterData = async () => {
  try {
    const [vendors, products, whs] = await Promise.all([
      purchaseService.getVendors(),
      purchaseService.getProducts(),
      purchaseService.getWarehouses()
    ])
    vendorList.value = vendors
    productList.value = products
    warehouseList.value = whs
  } catch (e) {
    console.error('Failed to load purchase master data', e)
  }
}

const fetchPurchaseOrders = async () => {
  isLoading.value = true
  error.value = null
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedStatus.value) params.state = selectedStatus.value
    if (selectedVendor.value > 0) params.partner_id = selectedVendor.value

    const res = await purchaseService.getAll(params)
    purchaseOrders.value = res.data || []
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
    error.value = 'Gagal memuat purchase orders: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const refreshAll = () => {
  fetchPurchaseOrders()
  fetchSummary()
}

const handleFilterChange = () => {
  pagination.value.current_page = 1
  fetchPurchaseOrders()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedVendor.value = 0
  pagination.value.current_page = 1
  fetchPurchaseOrders()
}

const onPageChange = ({ page, limit }: { page: number; limit: number }) => {
  pagination.value.current_page = page
  pagination.value.per_page = limit
  fetchPurchaseOrders()
}

// Create PO Handlers
const openCreateModal = () => {
  createForm.value = {
    partner_id: vendorList.value[0]?.id || 0,
    date_order: new Date().toISOString().slice(0, 10),
    notes: '',
    lines: [
      {
        product_id: productList.value[0]?.id || 0,
        name: productList.value[0] ? getProductName(productList.value[0]) : '',
        quantity: 1,
        price_unit: productList.value[0]?.ProductTemplate?.standard_price || 100000
      }
    ]
  }
  isCreateModalOpen.value = true
}

const addItemRow = () => {
  const p = productList.value[0]
  createForm.value.lines.push({
    product_id: p?.id || 0,
    name: p ? getProductName(p) : '',
    quantity: 1,
    price_unit: p?.ProductTemplate?.standard_price || 0
  })
}

const removeItemRow = (idx: number) => {
  if (createForm.value.lines.length > 1) {
    createForm.value.lines.splice(idx, 1)
  }
}

const onProductSelect = (row: any) => {
  const found = productList.value.find(p => p.id === row.product_id)
  if (found) {
    row.name = getProductName(found)
    row.price_unit = found.ProductTemplate?.standard_price || found.ProductTemplate?.list_price || 0
  }
}

const submitCreatePO = async () => {
  if (createForm.value.partner_id === 0) return
  isSubmittingCreate.value = true
  try {
    await purchaseService.create(createForm.value)
    alert('Purchase Order berhasil dibuat!')
    isCreateModalOpen.value = false
    refreshAll()
  } catch (err: any) {
    alert('Gagal membuat PO: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmittingCreate.value = false
  }
}

// Confirmation & Approval Handlers
const confirmOrder = async (po: IPurchaseOrderDto) => {
  if (!po.id) return
  if (!confirm(`Konfirmasi PO "${po.name}" menjadi pesanan sah ke vendor?`)) return
  try {
    await purchaseService.confirm(po.id)
    refreshAll()
  } catch (err: any) {
    alert('Gagal konfirmasi PO: ' + (err.response?.data?.message || err.message))
  }
}

const approveOrder = async (po: IPurchaseOrderDto) => {
  if (!po.id) return
  if (!confirm(`Setujui pengadaan bernilai besar untuk PO "${po.name}"?`)) return
  try {
    await purchaseService.approve(po.id)
    alert('PO berhasil disetujui oleh Manajer!')
    refreshAll()
  } catch (err: any) {
    alert('Gagal menyetujui PO: ' + (err.response?.data?.message || err.message))
  }
}

// Receive Goods Handlers
const openReceiveModal = (po: IPurchaseOrderDto) => {
  activePO.value = po
  receiveForm.value = {
    warehouse_id: warehouseList.value[0]?.id || 0,
    notes: '',
    items: (po.order_lines || []).map(l => {
      const remaining = Math.max(0, (l.quantity || 0) - (l.qty_received || 0))
      return {
        line_id: l.id || 0,
        name: l.name || l.product?.default_code || 'Item',
        quantity: l.quantity || 0,
        qty_received_so_far: l.qty_received || 0,
        qty_received: remaining
      }
    })
  }
  isReceiveModalOpen.value = true
}

const submitGoodsReceipt = async () => {
  if (!activePO.value?.id) return
  isSubmittingReceive.value = true
  try {
    await purchaseService.receiveGoods(activePO.value.id, {
      warehouse_id: receiveForm.value.warehouse_id,
      notes: receiveForm.value.notes,
      items: receiveForm.value.items.map(it => ({
        line_id: it.line_id,
        qty_received: it.qty_received
      }))
    })
    alert('Barang berhasil diterima dan dicatat ke stok fisik gudang!')
    isReceiveModalOpen.value = false
    refreshAll()
  } catch (err: any) {
    alert('Gagal memproses penerimaan barang: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmittingReceive.value = false
  }
}

// Detail Modal
const openDetailModal = (po: IPurchaseOrderDto) => {
  activePO.value = po
  isDetailModalOpen.value = true
}

// Delete PO
const deleteOrder = async (po: IPurchaseOrderDto) => {
  if (!po.id) return
  if (!confirm(`Hapus dokumen PO "${po.name}"?`)) return
  try {
    await purchaseService.delete(po.id)
    refreshAll()
  } catch (err: any) {
    alert('Gagal menghapus PO: ' + (err.response?.data?.message || err.message))
  }
}

// Export CSV

import { http as api } from '@/services/http'
import { useRouter } from 'vue-router'

// Tender States
const isTenderModalOpen = ref(false)
const isSubmittingTender = ref(false)
const router = useRouter()
const tenders = ref<any[]>([])
const selectedTender = ref<any>(null)

const openLandedCostModal = (po?: any) => {
  router.push("/supply_chain/inventory")
}
const tenderForm = ref<{
  title: string
  date_end: string
  product_id: number
  quantity: number
  est_price: number
  vendor_ids: number[]
}>({
  title: '',
  date_end: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  product_id: 1,
  quantity: 100,
  est_price: 50000,
  vendor_ids: []
})

const openTenderModal = async () => {
  isTenderModalOpen.value = true
  await fetchTenders()
}

const fetchTenders = async () => {
  try {
    const { data } = await api.get('/supply_chain/purchase/purchaserequisition')
    tenders.value = data.data || []
    if (tenders.value.length > 0 && !selectedTender.value) {
      selectedTender.value = tenders.value[0]
    }
  } catch (e) {}
}

const selectTender = (t: any) => {
  selectedTender.value = t
}

const submitCreateTender = async () => {
  isSubmittingTender.value = true
  try {
    const vIds = vendorList.value.map(v => v.id).slice(0, 3)
    tenderForm.value.vendor_ids = vIds.length ? vIds : [1]
    await api.post('/supply_chain/purchase/tender', tenderForm.value)
    alert('Tender pengadaan berhasil diterbitkan dan RFQ dikirim ke multi-vendor!')
    await fetchTenders()
    refreshAll()
  } catch (err: any) {
    alert('Gagal membuat tender: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmittingTender.value = false
  }
}

const chooseWinner = async (tenderId: any, poId: any) => {
  if (!confirm('Sahkan vendor ini sebagai pemenang tender lelang?')) return
  try {
    await api.post(`/supply_chain/purchase/tender/${tenderId}/select-winner`, { purchase_order_id: poId })
    alert('Selamat! Vendor terpilih resmi sebagai pemenang tender dan PO disahkan.')
    await fetchTenders()
    refreshAll()
  } catch (err: any) {
    alert('Gagal memilih pemenang: ' + (err.response?.data?.message || err.message))
  }
}

const exportCsv = () => {
  if (purchaseOrders.value.length === 0) return
  const headers = ['No PO', 'Tanggal', 'Vendor', 'Jumlah Item', 'Subtotal', 'PPN', 'Total', 'Status']
  const rows = purchaseOrders.value.map(po => [
    po.name || '',
    formatDate(po.date_order),
    `"${(po.partner?.name || '').replace(/"/g, '""')}"`,
    po.order_lines?.length || 0,
    po.amount_untaxed || 0,
    po.amount_tax || 0,
    po.amount_total || 0,
    getStatusLabel(po.state)
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `purchase_orders_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchMasterData()
  refreshAll()
})
</script>
