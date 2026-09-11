<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            Product Lifecycle Management (PLM)
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo 18 PLM & Mekari SCM: Engineering Change Orders (ECO), revisi Bill of Materials (BOM), dan kontrol gerbang persetujuan (*approval gates*).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="fetchData"
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

          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat ECO Baru
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total ECO</p>
              <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{{ summary.total_eco }}</h3>
              <p class="text-2xs text-gray-400 mt-1">Perubahan rancangan teknis</p>
            </div>
            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
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

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Draft / Baru</p>
              <h3 class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{{ summary.draft_count }}</h3>
              <p class="text-2xs text-gray-400 mt-1">Menunggu review tim teknik</p>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Disetujui (Approved)</p>
              <h3 class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{{ summary.approved_count }}</h3>
              <p class="text-2xs text-gray-400 mt-1">Siap diterapkan ke lini produksi</p>
            </div>
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selesai (Applied)</p>
              <h3 class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{{ summary.done_count }}</h3>
              <p class="text-2xs text-gray-400 mt-1">BOM aktif diperbarui secara live</p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main ECO Table Card -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-xs overflow-hidden">
        <!-- Filter Toolbar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="font-bold text-gray-800 dark:text-white/90 text-sm sm:text-base">Daftar Engineering Change Orders</h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {{ pagination.total_items }} Dokumen
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Filter Status -->
            <select
              v-model="stateFilter"
              @change="onFilterChange"
              class="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:border-brand-500 focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="progress">Dalam Review (Progress)</option>
              <option value="approved">Approved</option>
              <option value="done">Selesai (Done)</option>
              <option value="cancel">Dibatalkan</option>
            </select>

            <!-- Search -->
            <div class="relative w-full sm:w-60">
              <input
                v-model="searchQuery"
                @input="onSearchInput"
                type="text"
                placeholder="Cari No. ECO, Produk..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 pl-8 text-xs text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:outline-none"
              />
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-xs">
            <thead class="bg-gray-50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              <tr>
                <th class="px-4 py-3">No. Dokumen ECO</th>
                <th class="px-4 py-3">Judul Perubahan</th>
                <th class="px-4 py-3">Tipe ECO</th>
                <th class="px-4 py-3">Produk Terkait</th>
                <th class="px-4 py-3">Target Efektif</th>
                <th class="px-4 py-3 text-center">Status / Gate</th>
                <th class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              <tr v-if="isLoading">
                <td colspan="7" class="py-12 text-center text-gray-400">
                  <div class="inline-block w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat data ECO...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="7" class="py-12 text-center text-gray-400">
                  <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Belum ada dokumen Engineering Change Order.
                </td>
              </tr>
              <tr v-for="eco in records" :key="eco.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-brand-600 dark:text-brand-400">{{ eco.code || ('ECO-' + eco.id) }}</span>
                  </div>
                  <span class="text-2xs text-gray-400 block">{{ formatDate(eco.created_at) }}</span>
                </td>
                <td class="px-4 py-3.5 font-medium text-gray-900 dark:text-white max-w-xs truncate">
                  {{ eco.name }}
                  <p v-if="eco.reason" class="text-2xs text-gray-400 truncate max-w-xs">{{ eco.reason }}</p>
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded text-2xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {{ eco.type?.name || 'Standard ECO' }}
                  </span>
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span class="font-medium text-gray-800 dark:text-gray-200">{{ eco.product?.name || ('Produk #' + eco.product_id) }}</span>
                  <span v-if="eco.product?.default_code" class="text-2xs text-gray-400 block font-mono">SKU: {{ eco.product.default_code }}</span>
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {{ eco.effective_date ? formatDate(eco.effective_date) : 'Segera' }}
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap text-center">
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wide',
                      getStatusClass(eco.state)
                    ]"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ eco.state }}
                  </span>
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Workflow Action: Review / Approve / Apply -->
                    <button
                      v-if="eco.state === 'draft'"
                      @click="updateEcoState(eco, 'progress')"
                      class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                      title="Kirim untuk Review (Start Review)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>

                    <button
                      v-if="eco.state === 'progress'"
                      @click="updateEcoState(eco, 'approved')"
                      class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                      title="Setujui Perubahan (Approve Gate)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>

                    <button
                      v-if="eco.state === 'approved'"
                      @click="updateEcoState(eco, 'done')"
                      class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                      title="Terapkan Revisi BOM (Apply to Live BOM)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </button>

                    <!-- View Detail -->
                    <button
                      @click="openDetailModal(eco)"
                      class="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      title="Lihat Detail ECO"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <!-- Delete (only draft or cancel) -->
                    <button
                      v-if="eco.state === 'draft' || eco.state === 'cancel'"
                      @click="eco.id && deleteRecord(eco.id)"
                      class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Hapus ECO"
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

        <!-- Pagination Bar -->
        <PaginationBar :pagination="pagination" @change="onPageChange" />
      </div>
    </div>

    <!-- Modal Create ECO -->
    <Teleport to="body">
      <div v-if="isCreateModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Buat Engineering Change Order (ECO) Baru</h3>
              <p class="text-2xs text-gray-400">Rencanakan perubahan versi Bill of Materials atau desain komponen</p>
            </div>
            <button @click="isCreateModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
          </div>

          <form @submit.prevent="submitCreateEco" class="mt-4 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Dokumen ECO *</label>
              <input
                v-model="createPayload.name"
                type="text"
                required
                placeholder="cth. Penyesuaian Formula Komponen Casing V2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tipe ECO *</label>
                <select
                  v-model.number="createPayload.type_id"
                  required
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                >
                  <option :value="0" disabled>Pilih Tipe ECO...</option>
                  <option v-for="t in ecoTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Produk Sasaran *</label>
                <select
                  v-model.number="createPayload.product_id"
                  required
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                >
                  <option :value="0" disabled>Pilih Produk...</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ getProductName(p) }} ({{ p.default_code || 'SKU' }})
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Alasan Perubahan (Engineering Rationale)</label>
              <textarea
                v-model="createPayload.reason"
                rows="3"
                placeholder="Tuliskan temuan QC, efisiensi biaya, atau spesifikasi teknis baru..."
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tanggal Efektif Diterapkan</label>
              <input
                v-model="createPayload.effective_date"
                type="date"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="isCreateModalOpen = false"
                class="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || createPayload.type_id === 0 || createPayload.product_id === 0"
                class="rounded-lg bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Dokumen ECO' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Detail ECO -->
    <Teleport to="body">
      <div v-if="isDetailModalOpen && selectedEco" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <span class="inline-block px-2 py-0.5 rounded text-2xs font-mono font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                {{ selectedEco.code || ('ECO-' + selectedEco.id) }}
              </span>
              <h3 class="text-base font-bold text-gray-900 dark:text-white mt-1">{{ selectedEco.name }}</h3>
            </div>
            <button @click="isDetailModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
          </div>

          <div class="mt-4 space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <span class="text-gray-400 block text-2xs">Tipe ECO</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedEco.type?.name || '-' }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <span class="text-gray-400 block text-2xs">Status Gate</span>
                <span :class="['inline-block px-2 py-0.5 rounded font-bold uppercase text-2xs mt-0.5', getStatusClass(selectedEco.state)]">
                  {{ selectedEco.state }}
                </span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <span class="text-gray-400 block text-2xs">Produk</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedEco.product?.name || '-' }}</span>
              </div>
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <span class="text-gray-400 block text-2xs">Target Efektif</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedEco.effective_date ? formatDate(selectedEco.effective_date) : 'Segera' }}</span>
              </div>
            </div>

            <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40">
              <span class="text-gray-400 block text-2xs">Alasan Perubahan</span>
              <p class="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ selectedEco.reason || 'Tidak ada catatan alasan.' }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              @click="isDetailModalOpen = false"
              class="rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { plmService } from '@/services/supply-chain/plm.service'
import { inventoryService } from '@/services/supply-chain/inventory.service'
import type { IPlmEcoDto, IPlmEcoTypeDto, IPlmSummary, ICreateEcoPayload } from '@/types/supply-chain/plm.dto'
import type { IProductDto } from '@/types/supply-chain/inventory.dto'
import type { IPaginationMeta } from '@/types'

const records = ref<IPlmEcoDto[]>([])
const ecoTypes = ref<IPlmEcoTypeDto[]>([])
const products = ref<IProductDto[]>([])
const summary = ref<IPlmSummary>({
  total_eco: 0,
  draft_count: 0,
  progress_count: 0,
  approved_count: 0,
  done_count: 0,
})

const isLoading = ref(false)
const isSubmitting = ref(false)
const searchQuery = ref('')
const stateFilter = ref('')

const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false,
})

const isCreateModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedEco = ref<IPlmEcoDto | null>(null)

const createPayload = ref<ICreateEcoPayload>({
  name: '',
  type_id: 0,
  product_id: 0,
  reason: '',
  effective_date: '',
})

let searchTimeout: any = null
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    fetchData()
  }, 350)
}

const onFilterChange = () => {
  pagination.value.current_page = 1
  fetchData()
}

const onPageChange = ({ page, limit }: { page: number; limit: number }) => {
  pagination.value.current_page = page
  pagination.value.per_page = limit
  fetchData()
}

const getProductName = (item: IProductDto): string => {
  return item.ProductTemplate?.name || item.productTemplate?.name || item.default_code || 'Produk'
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const [summaryRes, ecoRes, typesRes] = await Promise.all([
      plmService.getSummary(),
      plmService.getAll({
        page: pagination.value.current_page,
        limit: pagination.value.per_page,
        search: searchQuery.value || undefined,
        state: stateFilter.value || undefined,
      }),
      plmService.getTypes(),
    ])

    summary.value = summaryRes
    records.value = (ecoRes.data as any) || []
    if (ecoRes.pagination) {
      pagination.value = ecoRes.pagination
    }
    ecoTypes.value = typesRes || []
  } catch (err: any) {
    console.error('Failed to load PLM data', err)
  } finally {
    isLoading.value = false
  }
}

const loadProducts = async () => {
  try {
    const res = await inventoryService.getAll({ limit: 100 })
    products.value = res.data || []
  } catch (e) {
    console.error('Failed to load products for PLM', e)
  }
}

const openCreateModal = () => {
  createPayload.value = {
    name: '',
    type_id: ecoTypes.value[0]?.id || 0,
    product_id: products.value[0]?.id || 0,
    reason: '',
    effective_date: new Date().toISOString().split('T')[0],
  }
  isCreateModalOpen.value = true
}

const submitCreateEco = async () => {
  isSubmitting.value = true
  try {
    await plmService.create(createPayload.value)
    isCreateModalOpen.value = false
    await fetchData()
  } catch (err: any) {
    alert('Gagal membuat ECO: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmitting.value = false
  }
}

const updateEcoState = async (eco: IPlmEcoDto, newState: 'progress' | 'approved' | 'done' | 'cancel') => {
  if (!eco.id) return
  const confirmLabels: Record<string, string> = {
    progress: 'Kirim ECO ini untuk evaluasi dan review teknis?',
    approved: 'Setujui dokumen ECO ini (Approval Gate Passed)?',
    done: 'Terapkan perubahan ECO ini ke Bill of Materials aktif?',
    cancel: 'Batalkan dokumen ECO ini?',
  }
  if (!confirm(confirmLabels[newState] || 'Lanjutkan perubahan status?')) return

  try {
    await plmService.updateState(eco.id, { state: newState })
    await fetchData()
  } catch (err: any) {
    alert('Gagal memperbarui status ECO: ' + (err.response?.data?.message || err.message))
  }
}

const openDetailModal = (eco: IPlmEcoDto) => {
  selectedEco.value = eco
  isDetailModalOpen.value = true
}

const deleteRecord = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus dokumen ECO ini?')) return
  try {
    await plmService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus ECO: ' + (err.response?.data?.message || err.message))
  }
}

const getStatusClass = (state?: string) => {
  switch (state) {
    case 'draft':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    case 'progress':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'approved':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'done':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
    case 'cancel':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(() => {
  fetchData()
  loadProducts()
})
</script>
