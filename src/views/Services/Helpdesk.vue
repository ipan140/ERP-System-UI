
<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Helpdesk & Service Desk" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pusat penanganan tiket keluhan pelanggan, eskalasi penugasan teknisi, dan pemantauan SLA.
          </p>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Switch Active Tab -->
          <div class="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              @click="activeTab = 'tickets'"
              :class="activeTab === 'tickets' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Papan Tiket
            </button>
            <button
              @click="activeTab = 'sla'"
              :class="activeTab === 'sla' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Aturan SLA
            </button>
            <button
              @click="activeTab = 'canned'"
              :class="activeTab === 'canned' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Respon Cepat
            </button>
          </div>

          <button
            @click="runSLAWorker"
            :disabled="isEvaluatingSLA"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50 transition"
            title="Jalankan Pengecekan Mesin Otomasi SLA"
          >
            <svg class="w-4 h-4" :class="isEvaluatingSLA ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Evaluasi SLA
          </button>

          <button
            @click="fetchAllData"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Refresh Data"
          >
            <svg class="w-4 h-4" :class="isLoading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>

          <button
            v-if="activeTab === 'tickets'"
            @click="openTicketModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Buat Tiket
          </button>
          <button
            v-else-if="activeTab === 'sla'"
            @click="openSLAModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Tambah SLA
          </button>
          <button
            v-else
            @click="openCannedModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Tambah Respon
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards (Berlaku untuk Tab Tiket) -->
      <div v-if="activeTab === 'tickets'" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Tiket Aktif</span>
            <span class="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ activeTicketsCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Dari total {{ tickets.length }} tiket keseluruhan</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Urgent & Kritis</span>
            <span class="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{{ urgentTicketsCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Memerlukan penanganan segera</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Dalam Investigasi</span>
            <span class="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ inProgressTicketsCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Sedang dikerjakan teknisi</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">SLA Kepatuhan</span>
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ slaComplianceRate }}%</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Tiket selesai sesuai target SLA</p>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 1: PAPAN TIKET (KANBAN & TABLE VIEW) -->
      <!-- ============================================== -->
      <div v-if="activeTab === 'tickets'" class="space-y-4">
        <!-- Filter & Search Toolbar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex flex-wrap items-center gap-3 flex-1">
            <!-- Search -->
            <div class="relative w-full sm:w-64">
              <input
                v-model="searchQuery"
                @input="onFilterChange"
                type="text"
                placeholder="Cari no. tiket, judul, klien..."
                class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
            </div>

            <!-- RBAC View Switcher: Semua Tiket vs Tiket Saya -->
            <button
              type="button"
              @click="myTasksOnly = !myTasksOnly; onFilterChange()"
              class="rounded-lg border px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
              :class="myTasksOnly
                ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-600'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'"
              :title="myTasksOnly ? 'Tampilkan seluruh antrean tiket' : 'Hanya tampilkan tiket tugas saya'"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {{ myTasksOnly ? 'Tiket Saya' : 'Semua Tiket' }}
            </button>

            <!-- Priority Filter -->
            <select
              v-model="filterPriority"
              @change="onFilterChange"
              class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Prioritas</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            <!-- Assignee Filter -->
            <select
              v-model="filterAssignee"
              @change="onFilterChange"
              class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Teknisi</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.name || emp.full_name || 'Staff #' + emp.id }}
              </option>
            </select>
          </div>

          <!-- View Switcher: Kanban vs Table -->
          <div class="flex items-center gap-1 border border-gray-200 rounded-lg p-1 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 self-end md:self-auto">
            <button
              @click="viewMode = 'kanban'"
              :class="viewMode === 'kanban' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
              class="p-1.5 rounded-md text-xs font-medium transition flex items-center gap-1"
              title="Tampilan Papan Kanban"
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

        <!-- Alert Error if any -->
        <Alert v-if="error" variant="error" title="Gagal" :message="error" />

        <!-- Loading State -->
        <div v-if="isLoading" class="py-16 text-center">
          <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Sinkronisasi data helpdesk...</p>
        </div>

        <!-- KANBAN BOARD VIEW -->
        <div v-else-if="viewMode === 'kanban'" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          <div
            v-for="stage in ticketStages"
            :key="stage.key"
            class="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900/50 flex flex-col min-h-[500px]"
          >
            <!-- Stage Header -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :class="stage.dotColor"></span>
                <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ stage.label }}</h4>
              </div>
              <span class="rounded-full bg-gray-200 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                {{ getTicketsByStage(stage.key).length }}
              </span>
            </div>

            <!-- Ticket Cards Column -->
            <div class="space-y-3 mt-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
              <div
                v-if="getTicketsByStage(stage.key).length === 0"
                class="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-800 text-xs text-gray-400"
              >
                Belum ada tiket
              </div>

              <div
                v-for="ticket in getTicketsByStage(stage.key)"
                :key="ticket.id"
                class="group relative rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                @click="openTicketModal('edit', ticket)"
              >
                <!-- Header: ID + Priority Badge -->
                <div class="flex items-center justify-between gap-2">
                  <span class="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400">
                    #TCK-{{ String(ticket.id).padStart(4, '0') }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    :class="getPriorityBadgeClass(ticket.priority)"
                  >
                    {{ ticket.priority || 'low' }}
                  </span>
                </div>

                <!-- Issue Title -->
                <h5 class="mt-2 text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                  {{ ticket.name }}
                </h5>

                <!-- Customer info -->
                <div class="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span class="truncate font-medium">{{ getCustomerName(ticket.customer_id) }}</span>
                </div>

                <!-- SLA Countdown / Status -->
                <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px]">
                  <div class="flex items-center gap-1" :class="getSLAStatusColor(ticket)">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>{{ getSLAText(ticket) }}</span>
                  </div>

                  <!-- Assignee Avatar -->
                  <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <div class="w-5 h-5 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 flex items-center justify-center font-bold text-[9px]">
                      {{ getAssigneeInitials(ticket.assignee_id) }}
                    </div>
                    <span class="truncate max-w-[70px] text-[10px]">{{ getAssigneeName(ticket.assignee_id) }}</span>
                  </div>
                </div>

                <!-- Quick Stage Move & Escalate Actions -->
                <div class="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="ticket.id && (!ticket.escalation_level || ticket.escalation_level <= 1) && ticket.state !== 'solved' && ticket.state !== 'closed'"
                    @click.stop="escalateTicket(ticket.id)"
                    class="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
                    title="Eskalasi ke Tier-2 (Manajer Operasional)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </button>
                  <button
                    v-if="getPrevStage(ticket.state)"
                    @click.stop="quickUpdateStage(ticket, getPrevStage(ticket.state)!)"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    title="Pindahkan ke status sebelumnya"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button
                    v-if="getNextStage(ticket.state)"
                    @click.stop="quickUpdateStage(ticket, getNextStage(ticket.state)!)"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    title="Pindahkan ke status berikutnya"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
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
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">No. Tiket</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Judul Masalah</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Klien</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Prioritas</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Teknisi (Assignee)</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status SLA</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="filteredTickets.length === 0">
                  <td colspan="8" class="px-4 py-8 text-center text-xs text-gray-500">Tidak ada tiket yang cocok dengan filter.</td>
                </tr>
                <tr
                  v-for="ticket in filteredTickets"
                  :key="ticket.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                >
                  <td class="px-4 py-3 text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
                    #TCK-{{ String(ticket.id).padStart(4, '0') }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="block text-xs font-bold text-gray-900 dark:text-white">{{ ticket.name }}</span>
                    <span class="block text-[11px] text-gray-500 truncate max-w-xs">{{ ticket.issue_description || '-' }}</span>
                  </td>
                  <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {{ getCustomerName(ticket.customer_id) }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="getPriorityBadgeClass(ticket.priority)">
                      {{ ticket.priority || 'low' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                    {{ getAssigneeName(ticket.assignee_id) }}
                  </td>
                  <td class="px-4 py-3 text-xs font-medium" :class="getSLAStatusColor(ticket)">
                    {{ getSLAText(ticket) }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="getStageBadgeClass(ticket.state)">
                      {{ getStageLabel(ticket.state) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        v-if="ticket.id && (!ticket.escalation_level || ticket.escalation_level <= 1) && ticket.state !== 'solved' && ticket.state !== 'closed'"
                        @click="escalateTicket(ticket.id)"
                        class="rounded p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                        title="Eskalasi ke Tier-2 (Manajer Operasional)"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </button>
                      <button
                        @click="openTicketModal('edit', ticket)"
                        class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                        title="Detail & Resolusi Tiket"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        @click="ticket.id && deleteTicket(ticket.id)"
                        class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
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
          </div>

          <!-- Pagination Bar -->
          <PaginationBar :pagination="pagination" @change="onPaginationChange" />
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 2: ATURAN SLA (SLA POLICIES) -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'sla'" class="space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Service Level Agreement (SLA) Matrix</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Aturan batas waktu respon dan resolusi penanganan tiket berdasar tingkat keparahan.</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Nama Kebijakan</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Tingkat Prioritas</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Target Waktu (Jam)</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="slaList.length === 0">
                  <td colspan="4" class="px-4 py-6 text-center text-xs text-gray-500">Belum ada aturan SLA yang dikonfigurasi.</td>
                </tr>
                <tr v-for="sla in slaList" :key="sla.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td class="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">{{ sla.name }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="getPriorityBadgeClass(sla.priority_level)">
                      {{ sla.priority_level }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                    {{ sla.target_hours }} Jam
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openSLAModal('edit', sla)"
                        class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                        title="Edit Aturan SLA"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        @click="sla.id && deleteSLA(sla.id)"
                        class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        title="Hapus Aturan SLA"
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
      <!-- TAB 3: RESPON CEPAT (CANNED RESPONSES) -->
      <!-- ============================================== -->
      <div v-else class="space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Daftar Canned Responses (Jawaban Instan)</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Template teks cepat yang dapat langsung disisipkan agen ke catatan resolusi tiket.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-if="cannedResponses.length === 0" class="col-span-full py-8 text-center text-xs text-gray-500">
              Belum ada template respon cepat.
            </div>
            <div
              v-for="item in cannedResponses"
              :key="item.id"
              class="rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-800/60 relative group"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2 py-0.5 rounded">
                  :{{ item.keyword }}
                </span>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    @click="openCannedModal('edit', item)"
                    class="p-1 rounded text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Edit Respon Cepat"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    @click="item.id && deleteCannedResponse(item.id)"
                    class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Hapus Respon Cepat"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-4">
                {{ item.response }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: BUAT / EDIT TIKET HELPDESK -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isTicketModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ ticketModalMode === 'create' ? 'Buat Tiket Bantuan Baru' : 'Rincian & Resolusi Tiket' }}
              </h3>
              <p v-if="ticketForm.id" class="text-xs font-mono text-brand-600 dark:text-brand-400">
                #TCK-{{ String(ticketForm.id).padStart(4, '0') }}
              </p>
            </div>
            <button @click="isTicketModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <!-- Tab Navigation for Edit Modal -->
          <div v-if="ticketModalMode === 'edit'" class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 mt-3">
            <button
              type="button"
              @click="activeTicketTab = 'details'"
              class="pb-2.5 text-xs font-semibold transition border-b-2"
              :class="activeTicketTab === 'details' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            >
              Rincian Tiket & Resolusi
            </button>
            <button
              type="button"
              @click="activeTicketTab = 'audit'"
              class="pb-2.5 text-xs font-semibold transition border-b-2 flex items-center gap-1.5"
              :class="activeTicketTab === 'audit' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Jejak Audit Aktivitas (ISO 9001)
            </button>
          </div>

          <!-- Tab: Audit Logs -->
          <div v-if="ticketModalMode === 'edit' && activeTicketTab === 'audit'" class="mt-4 max-h-[60vh] overflow-y-auto pr-1">
            <ActivityLogsTab entity-type="tickets" :entity-id="ticketForm.id" />
            <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <button
                type="button"
                @click="isTicketModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>

          <form v-show="ticketModalMode === 'create' || activeTicketTab === 'details'" @submit.prevent="saveTicket" class="space-y-4 mt-4">
            <!-- Tier-2 Escalation Alert Banner -->
            <div v-if="ticketForm.escalation_level && ticketForm.escalation_level > 1" class="p-3 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2.5 text-rose-800 dark:text-rose-300">
                <svg class="w-5 h-5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div>
                  <span class="font-bold">Eskalasi Tier-2 (Manajer Operasional):</span> Tiket telah melampaui SLA dan dieskalasi ke pengawasan manajemen.
                  <p v-if="ticketForm.escalated_at" class="text-2xs text-rose-700 dark:text-rose-400 mt-0.5">Waktu eskalasi: {{ formatDateTime(ticketForm.escalated_at) }}</p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200 shrink-0">Tier-2 Active</span>
            </div>
            <!-- Subject / Title -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul / Subjek Keluhan *</label>
              <input
                v-model="ticketForm.name"
                type="text"
                required
                placeholder="Contoh: Server down di cabang Surabaya / Gangguan koneksi POS"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Customer & Assignee Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pelanggan / Klien (Partner)</label>
                <select
                  v-model="ticketForm.customer_id"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option :value="undefined">-- Pilih Pelanggan --</option>
                  <option v-for="p in partners" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Teknisi / Staff (Assignee)</label>
                <select
                  v-model="ticketForm.assignee_id"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option :value="undefined">-- Belum Ditugaskan --</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.name || emp.full_name || 'Staff #' + emp.id }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Priority & State -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tingkat Prioritas</label>
                <select
                  v-model="ticketForm.priority"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="low">🟢 Low (Reguler)</option>
                  <option value="medium">🟡 Medium (Standar)</option>
                  <option value="high">🟠 High (Prioritas Tinggi)</option>
                  <option value="urgent">🔴 Urgent (Kritis / Escalated)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status Progres</label>
                <select
                  v-model="ticketForm.state"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="new">Baru (New)</option>
                  <option value="in_progress">Dalam Proses (In Progress)</option>
                  <option value="pending_customer">Menunggu Respon Klien</option>
                  <option value="solved">Terselesaikan (Solved)</option>
                  <option value="closed">Ditutup (Closed)</option>
                </select>
              </div>
            </div>

            <!-- Description / Notes with Canned Response Insert -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Deskripsi Masalah / Solusi</label>
                
                <!-- Quick insert canned response -->
                <div v-if="cannedResponses.length > 0" class="flex items-center gap-1">
                  <span class="text-[10px] text-gray-400">Sisipkan template:</span>
                  <select
                    @change="insertCannedResponse(($event.target as HTMLSelectElement).value); ($event.target as HTMLSelectElement).value = ''"
                    class="text-[11px] rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <option value="">Pilih Respon Cepat...</option>
                    <option v-for="c in cannedResponses" :key="c.id" :value="c.response">
                      :{{ c.keyword }}
                    </option>
                  </select>
                </div>
              </div>

              <textarea
                v-model="ticketForm.issue_description"
                rows="4"
                placeholder="Tuliskan kronologi kendala, diagnosa teknisi, atau langkah penyelesaian..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <button
                  v-if="ticketForm.id && (!ticketForm.escalation_level || ticketForm.escalation_level <= 1) && ticketForm.state !== 'solved' && ticketForm.state !== 'closed'"
                  type="button"
                  @click="escalateTicket(ticketForm.id)"
                  :disabled="isEscalating"
                  class="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 flex items-center gap-1.5 transition"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  {{ isEscalating ? 'Mengeskalasi...' : 'Eskalasi ke Tier-2' }}
                </button>
              </div>

              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="isTicketModalOpen = false"
                  class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="isSaving"
                  class="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 shadow-sm"
                >
                  {{ isSaving ? 'Menyimpan...' : 'Simpan Tiket' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL: SLA POLICY -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isSLAModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">
            {{ slaModalMode === 'create' ? 'Tambah Aturan SLA' : 'Edit Aturan SLA' }}
          </h3>

          <form @submit.prevent="saveSLA" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Aturan SLA *</label>
              <input
                v-model="slaForm.name"
                type="text"
                required
                placeholder="Contoh: Tanggap Urgent < 2 Jam"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Berlaku Untuk Prioritas</label>
              <select
                v-model="slaForm.priority_level"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Maksimal (Jam) *</label>
              <input
                v-model.number="slaForm.target_hours"
                type="number"
                step="0.5"
                min="0.5"
                required
                placeholder="Contoh: 2 atau 24"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isSLAModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {{ isSaving ? 'Menyimpan...' : 'Simpan SLA' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL: CANNED RESPONSE -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isCannedModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">
            {{ cannedModalMode === 'create' ? 'Tambah Canned Response' : 'Edit Canned Response' }}
          </h3>

          <form @submit.prevent="saveCannedResponse" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Keyword / Kata Kunci *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-400 text-xs">:</span>
                <input
                  v-model="cannedForm.keyword"
                  type="text"
                  required
                  placeholder="reboot_server / salam_pembuka"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 pl-6 font-mono text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Isi Respon / Template *</label>
              <textarea
                v-model="cannedForm.response"
                rows="4"
                required
                placeholder="Tuliskan template jawaban instan untuk teknisi..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isCannedModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
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
import PaginationBar from '@/components/common/PaginationBar.vue'
import ActivityLogsTab from '@/components/services/ActivityLogsTab.vue'
import { helpdeskService } from '@/services/services/helpdesk.service'
import { employeesService } from '@/services/hr/employees.service'
import { crmService } from '@/services/sales/crm.service'
import type { ITicketDto, IHelpdeskSLADto, IHelpdeskCannedResponseDto } from '@/types/services'
import type { IPaginationMeta } from '@/types'

// Tab & View Control
const activeTab = ref<'tickets' | 'sla' | 'canned'>('tickets')
const viewMode = ref<'kanban' | 'table'>('kanban')
const activeTicketTab = ref<'details' | 'audit'>('details')
const isEvaluatingSLA = ref(false)
const isEscalating = ref(false)

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

// State Data
const tickets = ref<ITicketDto[]>([])
const slaList = ref<IHelpdeskSLADto[]>([])
const cannedResponses = ref<IHelpdeskCannedResponseDto[]>([])
const employees = ref<any[]>([])
const partners = ref<any[]>([])

const isLoading = ref(false)
const error = ref<string | null>(null)
const isSaving = ref(false)

// Filter States
const searchQuery = ref('')
const filterPriority = ref('all')
const filterAssignee = ref('all')

// Kanban Stages Configuration
const ticketStages = [
  { key: 'new', label: 'Tiket Baru', dotColor: 'bg-blue-500' },
  { key: 'in_progress', label: 'Dalam Proses', dotColor: 'bg-amber-500' },
  { key: 'pending_customer', label: 'Menunggu Klien', dotColor: 'bg-purple-500' },
  { key: 'solved', label: 'Terselesaikan', dotColor: 'bg-emerald-500' },
  { key: 'closed', label: 'Ditutup', dotColor: 'bg-gray-400' }
]

// Modal States
const isTicketModalOpen = ref(false)
const ticketModalMode = ref<'create' | 'edit'>('create')
const ticketForm = ref<Partial<ITicketDto>>({
  name: '',
  customer_id: undefined,
  assignee_id: undefined,
  priority: 'low',
  state: 'new',
  issue_description: ''
})

const isSLAModalOpen = ref(false)
const slaModalMode = ref<'create' | 'edit'>('create')
const slaForm = ref<Partial<IHelpdeskSLADto>>({
  name: '',
  priority_level: 'high',
  target_hours: 4
})

const isCannedModalOpen = ref(false)
const cannedModalMode = ref<'create' | 'edit'>('create')
const cannedForm = ref<Partial<IHelpdeskCannedResponseDto>>({
  keyword: '',
  response: ''
})

// Fetch All Data with server-side pagination & filters
const fetchAllData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const params: any = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (filterPriority.value !== 'all') params.priority = filterPriority.value
    if (filterAssignee.value !== 'all') params.assignee_id = filterAssignee.value
    if (myTasksOnly.value) params.my_only = true

    const [ticketsRes, slaData, cannedData] = await Promise.all([
      helpdeskService.getAll(params),
      helpdeskService.getSLAs().catch(() => []),
      helpdeskService.getCannedResponses().catch(() => [])
    ])

    if (ticketsRes && (ticketsRes as any).pagination) {
      tickets.value = (ticketsRes as any).data || []
      pagination.value = (ticketsRes as any).pagination
    } else if (Array.isArray(ticketsRes)) {
      tickets.value = ticketsRes
      pagination.value.total_items = ticketsRes.length
      pagination.value.total_pages = 1
    } else if (ticketsRes && (ticketsRes as any).data && Array.isArray((ticketsRes as any).data)) {
      tickets.value = (ticketsRes as any).data
      if ((ticketsRes as any).pagination) pagination.value = (ticketsRes as any).pagination
    } else {
      tickets.value = []
    }

    slaList.value = slaData || []
    cannedResponses.value = cannedData || []

    // Fetch lookups concurrently if empty
    if (employees.value.length === 0) {
      employeesService.getAll().then(res => { employees.value = res || [] }).catch(() => {})
    }
    if (partners.value.length === 0) {
      crmService.getPartners().then(res => { partners.value = res || [] }).catch(() => {})
    }
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (page: number, limit?: number) => {
  pagination.value.current_page = page
  if (limit) {
    pagination.value.per_page = limit
  }
  fetchAllData()
}

const onFilterChange = () => {
  pagination.value.current_page = 1
  fetchAllData()
}

// Filtered Tickets (Server-side handled)
const filteredTickets = computed(() => tickets.value)

// Get Tickets by Stage
const getTicketsByStage = (stageKey: string) => {
  return filteredTickets.value.filter(t => (t.state || 'new').toLowerCase() === stageKey.toLowerCase())
}

// KPI Calculations
const activeTicketsCount = computed(() => {
  return tickets.value.filter(t => ['new', 'in_progress', 'pending_customer'].includes(t.state || 'new')).length
})

const urgentTicketsCount = computed(() => {
  return tickets.value.filter(t => ['urgent', 'high'].includes((t.priority || '').toLowerCase())).length
})

const inProgressTicketsCount = computed(() => {
  return tickets.value.filter(t => t.state === 'in_progress').length
})

const slaComplianceRate = computed(() => {
  const closedOrSolved = tickets.value.filter(t => ['solved', 'closed'].includes(t.state || ''))
  if (closedOrSolved.length === 0) return 96 // baseline percentage
  const compliant = closedOrSolved.filter(t => !isTicketSLABreached(t)).length
  return Math.round((compliant / closedOrSolved.length) * 100)
})

// Lookups Helper
const getCustomerName = (id?: number) => {
  if (!id) return 'Umum / Walk-in'
  const partner = partners.value.find(p => p.id === id)
  return partner ? partner.name : `Klien #${id}`
}

const getAssigneeName = (id?: number) => {
  if (!id) return 'Unassigned'
  const emp = employees.value.find(e => e.id === id)
  return emp ? (emp.name || emp.full_name) : `Staff #${id}`
}

const getAssigneeInitials = (id?: number) => {
  const name = getAssigneeName(id)
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

// SLA Indicator Logic
const getTargetHoursForPriority = (priority?: string) => {
  const p = (priority || 'low').toLowerCase()
  const matchedRule = slaList.value.find(r => (r.priority_level || '').toLowerCase() === p)
  if (matchedRule && matchedRule.target_hours) return matchedRule.target_hours
  if (p === 'urgent') return 2
  if (p === 'high') return 8
  if (p === 'medium') return 24
  return 48
}

const isTicketSLABreached = (ticket: ITicketDto) => {
  if (!ticket.created_at) return false
  const created = new Date(ticket.created_at).getTime()
  const now = new Date().getTime()
  const hoursPassed = (now - created) / (1000 * 60 * 60)
  const target = getTargetHoursForPriority(ticket.priority)
  return hoursPassed > target
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

const runSLAWorker = async () => {
  isEvaluatingSLA.value = true
  try {
    const res = await helpdeskService.processSla()
    alert(res.message || 'Evaluasi SLA berhasil dijalankan!\nTiket mendekati batas telah diberi peringatan dan tiket terlampaui telah dieskalasi ke Tier-2.')
    await fetchAllData()
  } catch (err: any) {
    alert('Gagal mengevaluasi SLA: ' + (err.response?.data?.message || err.message))
  } finally {
    isEvaluatingSLA.value = false
  }
}

const escalateTicket = async (ticketId?: number) => {
  if (!ticketId) return
  const reason = prompt('Masukkan catatan/alasan eskalasi tiket ke Tier-2 (Manajer Operasional):', 'Waktu penanganan melewati standar SLA ISO 9001')
  if (reason === null) return

  isEscalating.value = true
  try {
    await helpdeskService.escalate(ticketId, reason)
    alert('Tiket berhasil dieskalasi ke Tier-2 (Manajer Operasional)! Status telah dicatat pada Jejak Audit.')
    if (isTicketModalOpen.value && ticketForm.value.id === ticketId) {
      ticketForm.value.escalation_level = 2
      ticketForm.value.sla_status = 'breached'
      ticketForm.value.priority = 'urgent'
    }
    await fetchAllData()
  } catch (err: any) {
    alert('Gagal melakukan eskalasi tiket: ' + (err.response?.data?.message || err.message))
  } finally {
    isEscalating.value = false
  }
}

const getSLAText = (ticket: ITicketDto) => {
  if (ticket.state === 'solved' || ticket.state === 'closed') return 'Lolos SLA'
  if (ticket.escalation_level && ticket.escalation_level > 1) {
    return '🚨 Breached (Tier-2)'
  }
  if (ticket.sla_status === 'breached') {
    return '🚨 SLA Breached'
  }
  if (ticket.sla_status === 'warning') {
    return '⚠️ Mendekati SLA (<20%)'
  }
  if (!ticket.created_at) return 'SLA Aktif'
  const created = new Date(ticket.created_at).getTime()
  const now = new Date().getTime()
  const hoursPassed = (now - created) / (1000 * 60 * 60)
  const target = getTargetHoursForPriority(ticket.priority)
  const remaining = target - hoursPassed

  if (remaining < 0) return `🚨 Breach (${Math.abs(Math.round(remaining))}j lalu)`
  if (remaining <= 2) return `⚠️ Sisa ${remaining.toFixed(1)}j`
  return `${Math.round(remaining)}j tersisa`
}

const getSLAStatusColor = (ticket: ITicketDto) => {
  if (ticket.state === 'solved' || ticket.state === 'closed') return 'text-emerald-600 dark:text-emerald-400 font-semibold'
  if ((ticket.escalation_level && ticket.escalation_level > 1) || ticket.sla_status === 'breached') {
    return 'text-rose-600 font-bold dark:text-rose-400'
  }
  if (ticket.sla_status === 'warning') {
    return 'text-amber-600 font-semibold dark:text-amber-400'
  }
  if (!ticket.created_at) return 'text-gray-500'
  const created = new Date(ticket.created_at).getTime()
  const now = new Date().getTime()
  const hoursPassed = (now - created) / (1000 * 60 * 60)
  const target = getTargetHoursForPriority(ticket.priority)
  const remaining = target - hoursPassed

  if (remaining < 0) return 'text-rose-600 font-bold dark:text-rose-400'
  if (remaining <= 2) return 'text-amber-600 font-semibold dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

// Priority Badges Styling
const getPriorityBadgeClass = (priority?: string) => {
  switch ((priority || '').toLowerCase()) {
    case 'urgent':
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
    case 'high':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
    case 'medium':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

// Stage Badges & Labels
const getStageLabel = (state?: string) => {
  const match = ticketStages.find(s => s.key === state)
  return match ? match.label : state || 'Baru'
}

const getStageBadgeClass = (state?: string) => {
  switch (state) {
    case 'new': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
    case 'in_progress': return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
    case 'pending_customer': return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
    case 'solved': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
    case 'closed': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

// Stage Transitions
const getPrevStage = (current?: string) => {
  const cur = (current || 'new').toLowerCase()
  const index = ticketStages.findIndex(s => s.key === cur)
  return index > 0 ? ticketStages[index - 1].key : null
}

const getNextStage = (current?: string) => {
  const cur = (current || 'new').toLowerCase()
  const index = ticketStages.findIndex(s => s.key === cur)
  return index !== -1 && index < ticketStages.length - 1 ? ticketStages[index + 1].key : null
}

const quickUpdateStage = async (ticket: ITicketDto, nextStage: string) => {
  try {
    await helpdeskService.update(ticket.id!, {
      ...ticket,
      state: nextStage
    })
    ticket.state = nextStage
    await fetchAllData()
  } catch (err: any) {
    alert('Gagal memindahkan stage: ' + (err.response?.data?.message || err.message))
  }
}

// --- Ticket CRUD Modal Actions ---
const openTicketModal = (mode: 'create' | 'edit', data?: ITicketDto) => {
  ticketModalMode.value = mode
  activeTicketTab.value = 'details'
  if (mode === 'edit' && data) {
    ticketForm.value = { ...data }
  } else {
    ticketForm.value = {
      name: '',
      customer_id: undefined,
      assignee_id: undefined,
      priority: 'low',
      state: 'new',
      issue_description: ''
    }
  }
  isTicketModalOpen.value = true
}

const insertCannedResponse = (responseContent: string) => {
  if (!responseContent) return
  if (ticketForm.value.issue_description) {
    ticketForm.value.issue_description += `\n\n${responseContent}`
  } else {
    ticketForm.value.issue_description = responseContent
  }
}

const saveTicket = async () => {
  isSaving.value = true
  try {
    if (ticketModalMode.value === 'edit' && ticketForm.value.id) {
      await helpdeskService.update(ticketForm.value.id, ticketForm.value)
    } else {
      await helpdeskService.create(ticketForm.value)
    }
    isTicketModalOpen.value = false
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteTicket = async (id: number) => {
  if (!confirm('Yakin ingin menghapus tiket ini?')) return
  try {
    await helpdeskService.delete(id)
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

// --- SLA CRUD Modal Actions ---
const openSLAModal = (mode: 'create' | 'edit', data?: IHelpdeskSLADto) => {
  slaModalMode.value = mode
  if (mode === 'edit' && data) {
    slaForm.value = { ...data }
  } else {
    slaForm.value = { name: '', priority_level: 'high', target_hours: 4 }
  }
  isSLAModalOpen.value = true
}

const saveSLA = async () => {
  isSaving.value = true
  try {
    if (slaModalMode.value === 'edit' && slaForm.value.id) {
      await helpdeskService.updateSLA(slaForm.value.id, slaForm.value)
    } else {
      await helpdeskService.createSLA(slaForm.value)
    }
    isSLAModalOpen.value = false
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteSLA = async (id: number) => {
  if (!confirm('Hapus aturan SLA ini?')) return
  try {
    await helpdeskService.deleteSLA(id)
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

// --- Canned Response Modal Actions ---
const openCannedModal = (mode: 'create' | 'edit', data?: IHelpdeskCannedResponseDto) => {
  cannedModalMode.value = mode
  if (mode === 'edit' && data) {
    cannedForm.value = { ...data }
  } else {
    cannedForm.value = { keyword: '', response: '' }
  }
  isCannedModalOpen.value = true
}

const saveCannedResponse = async () => {
  isSaving.value = true
  try {
    if (cannedModalMode.value === 'edit' && cannedForm.value.id) {
      await helpdeskService.updateCannedResponse(cannedForm.value.id, cannedForm.value)
    } else {
      await helpdeskService.createCannedResponse(cannedForm.value)
    }
    isCannedModalOpen.value = false
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteCannedResponse = async (id: number) => {
  if (!confirm('Hapus template respon ini?')) return
  try {
    await helpdeskService.deleteCannedResponse(id)
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  fetchAllData()
})
</script>
