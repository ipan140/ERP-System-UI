
<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Top Breadcrumb & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Reparasi & Garansi (Repairs / RMA)" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pusat manajemen retur unit pelanggan (RMA), validasi garansi, konsumsi suku cadang, dan estimasi biaya servis.
          </p>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="fetchData"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Refresh Data"
          >
            <svg class="w-4 h-4" :class="isLoading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
          
          <button
            @click="openModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Terima Unit Servis (RMA)
          </button>
        </div>
      </div>

      <!-- Panduan Alur Reparasi & Garansi (Enterprise RMA Workflow Stepper) -->
      <div class="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-brand-500"></span>
            <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Alur Standar Operasional Reparasi & Garansi (RMA Lifecycle)
            </h4>
          </div>
          <span class="text-2xs text-gray-400">Standar Odoo 18 RMA / ISO 9001 Service</span>
        </div>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <!-- Step 1 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 font-bold text-xs">
              01
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Penerimaan Unit</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Pencatatan SN & Fisik</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-xs">
              02
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Diagnosa Biaya</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Estimasi Suku Cadang</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 font-bold text-xs">
              03
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Pengerjaan</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Perbaikan oleh Teknisi</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs">
              04
            </div>
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">Siap Diambil</p>
              <p class="text-2xs text-gray-500 dark:text-gray-400">Lolos Uji QC Mesin</p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
              05
            </div>
            <div>
              <p class="text-xs font-bold text-emerald-900 dark:text-emerald-200">Selesai / Lunas</p>
              <p class="text-2xs text-emerald-700/80 dark:text-emerald-300/80">Penyerahan ke Klien</p>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Unit Servis</span>
            <span class="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ repairOrders.length }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Seluruh unit masuk bengkel</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tahap Diagnosa</span>
            <span class="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ diagnosisCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Pemeriksaan & estimasi biaya</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Dalam Perbaikan</span>
            <span class="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{{ underRepairCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Pengerjaan ganti suku cadang</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Siap Diambil / QC</span>
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ readyCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Lulus uji & siap serah terima</p>
        </div>
      </div>

      <!-- Filters & Toolbar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              @input="onFilterChange"
              type="text"
              placeholder="Cari no. reparasi, no seri, klien..."
              class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>

          <!-- RBAC View Switcher: Semua Unit vs Unit Saya -->
          <button
            type="button"
            @click="myTasksOnly = !myTasksOnly; onFilterChange()"
            class="rounded-lg border px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
            :class="myTasksOnly
              ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-600'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'"
            :title="myTasksOnly ? 'Tampilkan seluruh bengkel' : 'Hanya tampilkan unit tugas saya'"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {{ myTasksOnly ? 'Unit Saya' : 'Semua Unit' }}
          </button>

          <!-- Warranty Filter -->
          <select
            v-model="filterWarranty"
            @change="onFilterChange"
            class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua Status Garansi</option>
            <option value="under_warranty">🛡️ Garansi Aktif (Covered)</option>
            <option value="expired">⌛ Garansi Habis (Expired)</option>
            <option value="no_warranty">❌ Non-Garansi</option>
          </select>

          <!-- Stage Filter -->
          <select
            v-model="filterStage"
            @change="onFilterChange"
            class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua Tahap</option>
            <option value="draft">Penerimaan Unit (Draft)</option>
            <option value="diagnosis">Diagnosa & Estimasi</option>
            <option value="under_repair">Dalam Perbaikan</option>
            <option value="ready">Siap Diambil (Ready)</option>
            <option value="done">Selesai (Done)</option>
          </select>
        </div>

        <!-- View Switcher -->
        <div class="flex items-center gap-1 border border-gray-200 rounded-lg p-1 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 self-end md:self-auto">
          <button
            @click="viewMode = 'kanban'"
            :class="viewMode === 'kanban' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
            class="p-1.5 rounded-md text-xs font-medium transition flex items-center gap-1"
            title="Tampilan Kanban RMA"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Kanban
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
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat data reparasi unit...</p>
      </div>

      <!-- KANBAN RMA BOARD -->
      <div v-else-if="viewMode === 'kanban'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        <div
          v-for="col in kanbanColumns"
          :key="col.key"
          class="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900/50 flex flex-col min-h-[500px]"
        >
          <!-- Stage Header -->
          <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" :class="col.dotColor"></span>
              <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ col.label }}</h4>
            </div>
            <span class="rounded-full bg-gray-200 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-300">
              {{ getOrdersByStage(col.key).length }}
            </span>
          </div>

          <!-- Column Cards -->
          <div class="space-y-3 mt-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
            <div
              v-if="getOrdersByStage(col.key).length === 0"
              class="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-800 text-xs text-gray-400"
            >
              Belum ada unit
            </div>

            <div
              v-for="order in getOrdersByStage(col.key)"
              :key="order.id"
              class="group relative rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
              @click="openModal('edit', order)"
            >
              <!-- RMA ID & Warranty Tag -->
              <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400">
                  #RO-{{ String(order.id).padStart(4, '0') }}
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="getWarrantyBadgeClass(order.warranty_status)"
                >
                  {{ getWarrantyLabel(order.warranty_status) }}
                </span>
              </div>

              <!-- Product Name / Title -->
              <h5 class="mt-2 text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                {{ order.name }}
              </h5>

              <!-- Serial Number / IMEI -->
              <div v-if="order.serial_number" class="mt-1.5 flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                <svg class="w-3 h-3 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span>SN: {{ order.serial_number }}</span>
              </div>

              <!-- Client name -->
              <div class="mt-2 flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="truncate font-medium">{{ getCustomerName(order.partner_id, order.partner) }}</span>
              </div>

              <!-- Cost Summary -->
              <div class="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px]">
                <span class="text-gray-400 text-[10px]">Estimasi Biaya:</span>
                <span
                  class="font-mono font-bold"
                  :class="order.warranty_status === 'under_warranty' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'"
                >
                  {{ order.warranty_status === 'under_warranty' ? 'Rp 0 (Garansi)' : formatCurrency(order.total_cost || 0) }}
                </span>
              </div>

              <!-- QC Status in Kanban Card -->
              <div class="mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-2xs">
                <span class="text-gray-400">Inspeksi QC:</span>
                <span
                  v-if="order.qc_passed"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  :title="order.qc_notes ? `QC Notes: ${order.qc_notes}` : 'Lulus QC'"
                >
                  ✓ Lulus QC
                </span>
                <button
                  v-else
                  @click.stop="openQCModal(order)"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  title="Klik untuk verifikasi QC"
                >
                  ⏳ Verifikasi QC
                </button>
              </div>

              <!-- Bottom: Technician Assigned -->
              <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 flex items-center justify-center font-bold text-[9px]">
                    {{ getTechnicianInitials(order.technician_id) }}
                  </div>
                  <span class="text-[10px] font-medium text-gray-600 dark:text-gray-300 truncate max-w-[80px]">
                    {{ getTechnicianName(order.technician_id) }}
                  </span>
                </div>

                <!-- Stage transitions & Actions -->
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="normalizeStage(order.state) === 'ready'"
                    @click.stop="sendWhatsAppReadyNotification(order)"
                    class="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                    title="Kirim Notifikasi WhatsApp (Siap Diambil)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </button>
                  <button
                    v-if="getPrevStage(order.state)"
                    @click.stop="quickUpdateStage(order, getPrevStage(order.state)!)"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    title="Kembalikan tahap"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button
                    v-if="getNextStage(order.state)"
                    @click.stop="quickUpdateStage(order, getNextStage(order.state)!)"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    title="Lanjut tahap berikutnya"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLE VIEW -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">No. RMA</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Unit / Gejala Kerusakan</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">No. Seri / IMEI</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Pelanggan</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status Garansi</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Teknisi</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Estimasi Biaya</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Inspeksi QC</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Tahap</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="filteredOrders.length === 0">
                <td colspan="10" class="px-4 py-8 text-center text-xs text-gray-500">Tidak ada data unit servis.</td>
              </tr>
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
              >
                <td class="px-4 py-3 text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                  #RO-{{ String(order.id).padStart(4, '0') }}
                </td>
                <td class="px-4 py-3">
                  <span class="block text-xs font-bold text-gray-900 dark:text-white">{{ order.name }}</span>
                  <span class="block text-[11px] text-gray-500 truncate max-w-xs">{{ order.diagnosis || '-' }}</span>
                </td>
                <td class="px-4 py-3 text-xs font-mono text-gray-700 dark:text-gray-300">
                  {{ order.serial_number || '-' }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-800 dark:text-gray-200 font-medium">
                  {{ getCustomerName(order.partner_id, order.partner) }}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="getWarrantyBadgeClass(order.warranty_status)">
                    {{ getWarrantyLabel(order.warranty_status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                  {{ getTechnicianName(order.technician_id) }}
                </td>
                <td class="px-4 py-3 text-xs font-mono font-semibold" :class="order.warranty_status === 'under_warranty' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'">
                  {{ order.warranty_status === 'under_warranty' ? 'Rp 0 (Garansi)' : formatCurrency(order.total_cost || 0) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    v-if="order.qc_passed"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    :title="order.qc_notes ? `QC Notes: ${order.qc_notes}` : 'Lulus Inspeksi QC'"
                  >
                    ✓ Lulus QC
                  </span>
                  <button
                    v-else
                    @click="openQCModal(order)"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition"
                    title="Klik untuk Verifikasi Lulus QC"
                  >
                    ⏳ Menunggu QC
                  </button>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="getStageBadgeClass(order.state)">
                    {{ getStageLabel(order.state) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Quick WhatsApp Notification for Ready Stage -->
                    <button
                      v-if="normalizeStage(order.state) === 'ready'"
                      @click="sendWhatsAppReadyNotification(order)"
                      class="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      title="Kirim Notifikasi WhatsApp (Unit Siap Diambil)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </button>
                    <!-- Quick Pass QC Button -->
                    <button
                      v-if="!order.qc_passed"
                      @click="openQCModal(order)"
                      class="rounded p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/40"
                      title="Verifikasi Lulus QC"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    </button>
                    <button
                      @click="openModal('edit', order)"
                      class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                      title="Detail & Edit Order Reparasi"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      @click="order.id && deleteOrder(order.id)"
                      class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      title="Hapus Order"
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
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: TERIMA UNIT / EDIT REPAIR ORDER -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ modalMode === 'create' ? 'Penerimaan Unit Reparasi (RMA Baru)' : 'Rincian & Diagnosa Reparasi Unit' }}
              </h3>
              <p v-if="formData.id" class="text-xs font-mono text-brand-600 dark:text-brand-400">
                #RO-{{ String(formData.id).padStart(4, '0') }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <!-- Tab Navigation for Edit Modal -->
          <div v-if="modalMode === 'edit'" class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 mt-3">
            <button
              type="button"
              @click="activeModalTab = 'details'"
              class="pb-2.5 text-xs font-semibold transition border-b-2"
              :class="activeModalTab === 'details' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            >
              Rincian & Diagnosa
            </button>
            <button
              type="button"
              @click="activeModalTab = 'audit'"
              class="pb-2.5 text-xs font-semibold transition border-b-2 flex items-center gap-1.5"
              :class="activeModalTab === 'audit' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Jejak Audit Aktivitas (ISO 9001)
            </button>
          </div>

          <!-- Tab: Audit Logs -->
          <div v-if="modalMode === 'edit' && activeModalTab === 'audit'" class="mt-4 max-h-[60vh] overflow-y-auto pr-1">
            <ActivityLogsTab entity-type="repair_orders" :entity-id="formData.id" />
            <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <button
                type="button"
                @click="isModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>

          <form v-show="modalMode === 'create' || activeModalTab === 'details'" @submit.prevent="saveOrder" class="space-y-4 mt-4">
            <!-- Customer Digital Approval Info (Fase 4) -->
            <div v-if="formData.customer_approved_at" class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                <svg class="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
                <div>
                  <span class="font-bold">Disetujui Pelanggan via Portal Mandiri:</span> {{ formatDateTime(formData.customer_approved_at) }}
                  <p v-if="formData.customer_approval_note" class="text-2xs text-emerald-700 dark:text-emerald-400 mt-0.5 italic">"{{ formData.customer_approval_note }}"</p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 shrink-0">Disetujui Online</span>
            </div>
            <!-- Unit & Issue Title -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Perangkat & Kendala Kerusakan *</label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="Contoh: Laptop Dell XPS 15 - Mati Total Setelah Kena Lonjakan Listrik"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Customer & Serial Number Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pelanggan / Pemilik Unit *</label>
                <select
                  v-model="formData.partner_id"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option :value="undefined" disabled>-- Pilih Pelanggan --</option>
                  <option v-for="p in partners" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor Seri / IMEI Perangkat</label>
                <input
                  v-model="formData.serial_number"
                  type="text"
                  placeholder="Contoh: SN-88392194012"
                  class="w-full font-mono rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Warranty Status & Technician Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status Garansi Pabrik / Toko</label>
                <select
                  v-model="formData.warranty_status"
                  @change="calculateCosts"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="under_warranty">🛡️ Garansi Aktif (Free Servis)</option>
                  <option value="expired">⌛ Garansi Habis (Berbayar Penuh)</option>
                  <option value="no_warranty">❌ Non-Garansi (Berbayar Penuh)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Teknisi Penanggung Jawab</label>
                <select
                  v-model="formData.technician_id"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option :value="undefined">-- Belum Ditugaskan --</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.name || emp.full_name || 'Teknisi #' + emp.id }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Stage Selection -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tahap Alur Reparasi</label>
              <select
                v-model="formData.state"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="draft">Penerimaan Unit (Draft)</option>
                <option value="diagnosis">Diagnosa & Estimasi Biaya</option>
                <option value="under_repair">Dalam Proses Perbaikan (Under Repair)</option>
                <option value="ready">Selesai QC & Siap Diambil (Ready)</option>
                <option value="done">Selesai & Diserahkan ke Klien (Done)</option>
                <option value="cancelled">Dibatalkan / Tidak Dapat Diperbaiki</option>
              </select>
            </div>

            <!-- Diagnosis & Checklist Notes -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Diagnosa & Kelengkapan Fisik Unit</label>
              <textarea
                v-model="formData.diagnosis"
                rows="3"
                placeholder="Hasil pemeriksaan awal, komponen yang rusak, dan kelengkapan yang dititipkan (e.g. Charger, Tas)..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <!-- Section QC Inspeksi Mutu (Fase 2) -->
            <div v-if="modalMode === 'edit'" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    Quality Control & Inspeksi Mutu
                  </span>
                  <p class="text-2xs text-gray-400">Verifikasi standar pengerjaan sebelum unit diserahkan ke pelanggan</p>
                </div>
                <div v-if="formData.qc_passed" class="flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ LULUS QC
                </div>
                <button
                  v-else-if="formData.id"
                  type="button"
                  @click="verifyQCInModal"
                  class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Tandai Lulus QC
                </button>
              </div>
              <div v-if="formData.qc_notes" class="mt-1 text-2xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800">
                <span class="font-semibold text-gray-700 dark:text-gray-200">Catatan Inspeksi:</span> {{ formData.qc_notes }}
              </div>
            </div>

            <!-- Cost Calculation Box -->
            <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60 space-y-3">
              <span class="block text-xs font-bold text-gray-900 dark:text-white">Estimasi Biaya Suku Cadang & Jasa</span>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">Biaya Suku Cadang / Spareparts (Rp)</label>
                  <input
                    v-model.number="formData.parts_cost"
                    type="number"
                    min="0"
                    step="1000"
                    @input="calculateCosts"
                    class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs font-mono focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">Ongkos Kerja / Jasa Teknisi (Rp)</label>
                  <input
                    v-model.number="formData.labor_cost"
                    type="number"
                    min="0"
                    step="1000"
                    @input="calculateCosts"
                    class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs font-mono focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <!-- Total Breakdown -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Total Biaya yang Ditagihkan:</span>
                <div class="text-right">
                  <span
                    class="text-sm font-mono font-bold"
                    :class="formData.warranty_status === 'under_warranty' ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-600 dark:text-brand-400'"
                  >
                    {{ formData.warranty_status === 'under_warranty' ? 'Rp 0 (Garansi Bebas Biaya)' : formatCurrency(formData.total_cost || 0) }}
                  </span>
                  <p v-if="formData.warranty_status === 'under_warranty'" class="text-[10px] text-gray-400">
                    Nilai riil servis: {{ formatCurrency((formData.parts_cost || 0) + (formData.labor_cost || 0)) }}
                  </p>
                </div>
              </div>
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
                {{ isSaving ? 'Menyimpan...' : 'Simpan Order Reparasi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Verifikasi QC (Fase 2) -->
    <Teleport to="body">
      <div v-if="isQCModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="p-1 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </span>
              Verifikasi Quality Control (QC)
            </h3>
            <button @click="isQCModalOpen = false" class="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div class="py-4 space-y-3">
            <p class="text-xs text-gray-600 dark:text-gray-300">
              Unit <span class="font-bold text-gray-900 dark:text-white">{{ selectedQCOrder?.name }}</span>
              (No. RMA: <span class="font-mono font-bold text-brand-600">#RO-{{ String(selectedQCOrder?.id || '').padStart(4, '0') }}</span>)
              telah diperiksa dan memenuhi seluruh standar mutu servis?
            </p>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Catatan Inspeksi QC (Opsional)
              </label>
              <textarea
                v-model="qcNotesInput"
                rows="3"
                placeholder="cth: Fungsi layar normal, port charger bersih, baut lengkap, segel garansi terpasang..."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="isQCModalOpen = false"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Batal
            </button>
            <button
              type="button"
              @click="submitQCVerification"
              :disabled="isProcessingQC"
              class="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg v-if="isProcessingQC" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Verifikasi Lulus QC
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
import Alert from '@/components/ui/Alert.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import ActivityLogsTab from '@/components/services/ActivityLogsTab.vue'
import { repairsService } from '@/services/services/repairs.service'
import { notificationsService } from '@/services/services/notifications.service'
import { employeesService } from '@/services/hr/employees.service'
import { crmService } from '@/services/sales/crm.service'
import type { IRepairOrderDto } from '@/types/services'
import type { IPaginationMeta } from '@/types'

// View & Filter States
const viewMode = ref<'kanban' | 'table'>('kanban')
const searchQuery = ref('')
const filterWarranty = ref('all')
const filterStage = ref('all')
const activeModalTab = ref<'details' | 'audit'>('details')
const isSendingNotif = ref(false)

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

// Data Collections
const repairOrders = ref<IRepairOrderDto[]>([])
const employees = ref<any[]>([])
const partners = ref<any[]>([])

const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)

// Kanban Column Definitions
const kanbanColumns = [
  { key: 'draft', label: 'Penerimaan Unit', dotColor: 'bg-gray-400' },
  { key: 'diagnosis', label: 'Diagnosa Biaya', dotColor: 'bg-amber-500' },
  { key: 'under_repair', label: 'Dalam Pengerjaan', dotColor: 'bg-purple-500' },
  { key: 'ready', label: 'Siap Diambil', dotColor: 'bg-blue-500' },
  { key: 'done', label: 'Selesai / Lunas', dotColor: 'bg-emerald-500' }
]

// Modal & Form States
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')

// Fase 2: Quality Control (QC) State
const isQCModalOpen = ref(false)
const selectedQCOrder = ref<IRepairOrderDto | null>(null)
const qcNotesInput = ref('')
const isProcessingQC = ref(false)

const formData = ref<Partial<IRepairOrderDto>>({
  name: '',
  partner_id: undefined,
  serial_number: '',
  warranty_status: 'under_warranty',
  technician_id: undefined,
  state: 'draft',
  diagnosis: '',
  parts_cost: 0,
  labor_cost: 0,
  total_cost: 0,
  qc_passed: false,
  qc_notes: ''
})

// Fetch All Data with server-side pagination & filters
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const params: any = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (filterWarranty.value !== 'all') params.warranty_status = filterWarranty.value
    if (filterStage.value !== 'all') params.state = filterStage.value
    if (myTasksOnly.value) params.my_only = true

    const res: any = await repairsService.getAll(params)
    if (res && res.pagination) {
      repairOrders.value = res.data || []
      pagination.value = res.pagination
    } else if (Array.isArray(res)) {
      repairOrders.value = res
      pagination.value.total_items = res.length
      pagination.value.total_pages = 1
    } else if (res && res.data && Array.isArray(res.data)) {
      repairOrders.value = res.data
      if (res.pagination) pagination.value = res.pagination
    } else {
      repairOrders.value = []
    }

    // Concurrently load employees and partners
    if (employees.value.length === 0) {
      employeesService.getAll().then(res => { employees.value = res || [] }).catch(() => {})
    }
    if (partners.value.length === 0) {
      crmService.getPartners().then(res => { partners.value = res || [] }).catch(() => {})
    }
  } catch (err: any) {
    error.value = 'Gagal memuat data reparasi: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (page: number, limit?: number) => {
  pagination.value.current_page = page
  if (limit) {
    pagination.value.per_page = limit
  }
  fetchData()
}

const onFilterChange = () => {
  pagination.value.current_page = 1
  fetchData()
}

// Normalize stage helper for standard RMA lifecycle & backward compatibility
const normalizeStage = (st?: string) => {
  const s = (st || 'draft').toLowerCase()
  if (s === 'confirmed') return 'draft'
  return s
}

// Filtered Orders (Server-side handled)
const filteredOrders = computed(() => repairOrders.value)

const getOrdersByStage = (stageKey: string) => {
  return filteredOrders.value.filter(o => normalizeStage(o.state) === stageKey.toLowerCase())
}

// KPI Counters
const diagnosisCount = computed(() => {
  return repairOrders.value.filter(o => normalizeStage(o.state) === 'diagnosis').length
})

const underRepairCount = computed(() => {
  return repairOrders.value.filter(o => normalizeStage(o.state) === 'under_repair').length
})

const readyCount = computed(() => {
  return repairOrders.value.filter(o => normalizeStage(o.state) === 'ready').length
})

// Cost Calculator
const calculateCosts = () => {
  const parts = Number(formData.value.parts_cost) || 0
  const labor = Number(formData.value.labor_cost) || 0
  if (formData.value.warranty_status === 'under_warranty') {
    formData.value.total_cost = 0
  } else {
    formData.value.total_cost = parts + labor
  }
}

// Helpers
const getCustomerName = (id?: number, partnerObj?: any) => {
  if (partnerObj && partnerObj.name) return partnerObj.name
  if (!id) return 'Pelanggan Umum'
  const found = partners.value.find(p => p.id === id)
  return found ? found.name : `Klien #${id}`
}

const getTechnicianName = (id?: number) => {
  if (!id) return 'Belum Ditugaskan'
  const found = employees.value.find(e => e.id === id)
  return found ? (found.name || found.full_name) : `Teknisi #${id}`
}

const getTechnicianInitials = (id?: number) => {
  const name = getTechnicianName(id)
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const getWarrantyLabel = (status?: string) => {
  switch (status) {
    case 'under_warranty': return 'Garansi Aktif'
    case 'expired': return 'Garansi Habis'
    default: return 'Non-Garansi'
  }
}

const getWarrantyBadgeClass = (status?: string) => {
  switch (status) {
    case 'under_warranty': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    case 'expired': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getStageLabel = (state?: string) => {
  const normalized = normalizeStage(state)
  const col = kanbanColumns.find(c => c.key === normalized)
  return col ? col.label : state || 'Penerimaan'
}

const getStageBadgeClass = (state?: string) => {
  const normalized = normalizeStage(state)
  switch (normalized) {
    case 'diagnosis': return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
    case 'under_repair': return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
    case 'ready': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
    case 'done': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

// Stage Transitions
const getPrevStage = (current?: string) => {
  const normalized = normalizeStage(current)
  const index = kanbanColumns.findIndex(c => c.key === normalized)
  return index > 0 ? kanbanColumns[index - 1].key : null
}

const getNextStage = (current?: string) => {
  const normalized = normalizeStage(current)
  const index = kanbanColumns.findIndex(c => c.key === normalized)
  return index !== -1 && index < kanbanColumns.length - 1 ? kanbanColumns[index + 1].key : null
}

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const sendWhatsAppReadyNotification = async (order: IRepairOrderDto) => {
  const custName = getCustomerName(order.partner_id, (order as any).partner)
  const phone = (order as any).partner?.phone || (order as any).customer_phone || ''
  const targetPhone = prompt(`Kirim Notifikasi WhatsApp Unit Siap Diambil ke nomor:`, phone || '081234567890')
  if (!targetPhone) return

  isSendingNotif.value = true
  try {
    const res = await notificationsService.send({
      entity_type: 'repair_orders',
      entity_id: order.id,
      channel: 'whatsapp',
      recipient: targetPhone,
      title: `Unit Reparasi Siap Diambil (#RO-${String(order.id).padStart(4, '0')})`,
      content: `Halo Sdr/i ${custName},\n\nUnit reparasi Anda "${order.name}" (SN: ${order.serial_number || '-'}) telah lolos pengujian Quality Control dan SIAP DIAMBIL di workshop kami.\nTotal Biaya: ${order.warranty_status === 'under_warranty' ? 'Rp 0 (Garansi Bebas Biaya)' : formatCurrency(order.total_cost || 0)}.\n\nTerima kasih atas kepercayaan Anda!`
    })
    alert('Notifikasi WhatsApp berhasil didaftarkan ke antrean pengiriman gateway!\nID Notifikasi: ' + (res.id || 'Terkirim'))
  } catch (err: any) {
    alert('Gagal mengirim notifikasi WhatsApp: ' + (err.response?.data?.message || err.message))
  } finally {
    isSendingNotif.value = false
  }
}

const quickUpdateStage = async (order: IRepairOrderDto, nextStage: string) => {
  // Fase 2 Validation Gate: Block transitioning to ready or done if not QC passed
  if ((nextStage === 'ready' || nextStage === 'done') && !order.qc_passed) {
    if (confirm('Unit ini belum diverifikasi Lulus QC. Buka form verifikasi QC sekarang?')) {
      openQCModal(order)
    }
    return
  }
  try {
    await repairsService.update(order.id!, { state: nextStage })
    order.state = nextStage
    if (nextStage === 'ready') {
      if (confirm('Unit telah berstatus Siap Diambil. Kirim notifikasi WhatsApp ke pelanggan sekarang?')) {
        sendWhatsAppReadyNotification(order)
      }
    }
  } catch (err: any) {
    alert('Gagal memindahkan tahap: ' + (err.response?.data?.message || err.message))
  }
}

// Fase 2: Quality Control (QC) Actions
const openQCModal = (order: IRepairOrderDto) => {
  selectedQCOrder.value = order
  qcNotesInput.value = order.qc_notes || ''
  isQCModalOpen.value = true
}

const submitQCVerification = async () => {
  if (!selectedQCOrder.value?.id) return
  isProcessingQC.value = true
  try {
    await repairsService.passQC(selectedQCOrder.value.id, qcNotesInput.value.trim())
    isQCModalOpen.value = false
    selectedQCOrder.value = null
    await fetchData()
  } catch (err: any) {
    alert('Gagal memverifikasi QC: ' + (err.response?.data?.message || err.message))
  } finally {
    isProcessingQC.value = false
  }
}

const verifyQCInModal = async () => {
  if (!formData.value.id) return
  const notes = prompt('Masukkan catatan inspeksi QC (opsional):', formData.value.qc_notes || '')
  if (notes === null) return
  try {
    await repairsService.passQC(formData.value.id, notes)
    formData.value.qc_passed = true
    formData.value.qc_notes = notes
    await fetchData()
  } catch (err: any) {
    alert('Gagal memverifikasi QC: ' + (err.response?.data?.message || err.message))
  }
}

// Modal Actions
const openModal = (mode: 'create' | 'edit', data?: IRepairOrderDto) => {
  modalMode.value = mode
  activeModalTab.value = 'details'
  if (mode === 'edit' && data) {
    formData.value = { ...data }
  } else {
    formData.value = {
      name: '',
      partner_id: partners.value[0]?.id || undefined,
      serial_number: '',
      warranty_status: 'under_warranty',
      technician_id: undefined,
      state: 'draft',
      diagnosis: '',
      parts_cost: 0,
      labor_cost: 0,
      total_cost: 0
    }
  }
  calculateCosts()
  isModalOpen.value = true
}

const saveOrder = async () => {
  isSaving.value = true
  try {
    calculateCosts()
    if (modalMode.value === 'edit' && formData.value.id) {
      await repairsService.update(formData.value.id, formData.value)
    } else {
      await repairsService.create(formData.value)
    }
    isModalOpen.value = false
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteOrder = async (id: number) => {
  if (!confirm('Hapus order reparasi ini?')) return
  try {
    await repairsService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>

