<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Layanan Lapangan (Field Service)" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manajemen Surat Perintah Kerja (SPK), penugasan teknisi lapangan, SOP checklist, dan e-BAST digital.
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
            + Buat Work Order (SPK)
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Work Orders</span>
            <span class="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ tasks.length }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Seluruh pesanan layanan lapangan</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Teknisi Ditugaskan</span>
            <span class="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{{ assignedCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Siap berangkat / menuju lokasi</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Sedang Dikerjakan</span>
            <span class="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ inProgressCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Instalasi / reparasi di lokasi</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">BAST Selesai Terbit</span>
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="9 15 11 17 15 13"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ completedCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Ditandatangani klien digital</p>
        </div>
      </div>

      <!-- Filters & Toolbar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari no. SPK, pekerjaan, alamat..."
              class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>

          <!-- Priority Filter -->
          <select
            v-model="filterPriority"
            class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua Prioritas</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <!-- Technician Filter -->
          <select
            v-model="filterTechnician"
            class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua Teknisi</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.name || emp.full_name || 'Teknisi #' + emp.id }}
            </option>
          </select>
        </div>

        <!-- View Switcher -->
        <div class="flex items-center gap-1 border border-gray-200 rounded-lg p-1 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 self-end md:self-auto">
          <button
            @click="viewMode = 'kanban'"
            :class="viewMode === 'kanban' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'"
            class="p-1.5 rounded-md text-xs font-medium transition flex items-center gap-1"
            title="Tampilan Dispatch Kanban"
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
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Memuat data pesanan lapangan...</p>
      </div>

      <!-- KANBAN BOARD VIEW -->
      <div v-else-if="viewMode === 'kanban'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
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
              {{ getTasksByStage(col.key).length }}
            </span>
          </div>

          <!-- Cards Column -->
          <div class="space-y-3 mt-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
            <div
              v-if="getTasksByStage(col.key).length === 0"
              class="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-800 text-xs text-gray-400"
            >
              Tidak ada penugasan
            </div>

            <div
              v-for="task in getTasksByStage(col.key)"
              :key="task.id"
              class="group relative rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
              @click="openModal('edit', task)"
            >
              <!-- SPK ID & Priority Badge -->
              <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400">
                  #WO-{{ String(task.id).padStart(4, '0') }}
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="getPriorityBadgeClass(task.priority)"
                >
                  {{ task.priority || 'low' }}
                </span>
              </div>

              <!-- Title -->
              <h5 class="mt-2 text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                {{ task.name }}
              </h5>

              <!-- Client info -->
              <div class="mt-2 flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="truncate font-medium">{{ getCustomerName(task.partner_id, task.partner) }}</span>
              </div>

              <!-- Address / Location -->
              <div v-if="task.address" class="mt-1 flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                <svg class="w-3 h-3 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span class="truncate">{{ task.address }}</span>
              </div>

              <!-- SOP Checklist Progress -->
              <div class="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                  <span>SOP Checklist</span>
                  <span class="font-bold">{{ getChecklistProgress(task) }}</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-brand-500 h-full rounded-full transition-all duration-300"
                    :style="{ width: getChecklistPercentage(task) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Bottom: Technician + E-Sign Badge -->
              <div class="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 flex items-center justify-center font-bold text-[9px]">
                    {{ getEmployeeInitials(task.employee_id, task.employee) }}
                  </div>
                  <span class="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                    {{ getEmployeeName(task.employee_id, task.employee) }}
                  </span>
                </div>

                <!-- Signature Badge -->
                <span
                  v-if="task.signature"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold"
                  title="BAST telah ditandatangani klien"
                >
                  <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  e-BAST
                </span>
                <span
                  v-else
                  class="text-[9px] text-gray-400"
                >
                  Belum TTD
                </span>
              </div>

              <!-- Stage Quick Moves -->
              <div class="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  v-if="getPrevStage(task.state)"
                  @click.stop="quickUpdateStage(task, getPrevStage(task.state)!)"
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  title="Kembalikan ke tahap sebelumnya"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button
                  v-if="getNextStage(task.state)"
                  @click.stop="quickUpdateStage(task, getNextStage(task.state)!)"
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  title="Lanjutkan ke tahap berikutnya"
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
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">No. SPK</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Uraian Tugas</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Klien & Lokasi</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Teknisi Bertugas</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Prioritas</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">e-BAST</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="filteredTasks.length === 0">
                <td colspan="8" class="px-4 py-8 text-center text-xs text-gray-500">Tidak ada data penugasan lapangan.</td>
              </tr>
              <tr
                v-for="task in filteredTasks"
                :key="task.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
              >
                <td class="px-4 py-3 text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                  #WO-{{ String(task.id).padStart(4, '0') }}
                </td>
                <td class="px-4 py-3">
                  <span class="block text-xs font-bold text-gray-900 dark:text-white">{{ task.name }}</span>
                  <span class="block text-[11px] text-gray-500 truncate max-w-xs">{{ task.notes || '-' }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="block text-xs font-semibold text-gray-800 dark:text-gray-200">{{ getCustomerName(task.partner_id, task.partner) }}</span>
                  <span class="block text-[10px] text-gray-400 truncate max-w-xs">{{ task.address || '-' }}</span>
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {{ getEmployeeName(task.employee_id, task.employee) }}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="getPriorityBadgeClass(task.priority)">
                    {{ task.priority || 'low' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="getStatusBadgeClass(task.state)">
                    {{ getStatusLabel(task.state) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    v-if="task.signature"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold"
                  >
                    ✓ Ditandatangani
                  </span>
                  <span v-else class="text-xs text-gray-400">Pending</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      @click="openModal('edit', task)"
                      class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                      title="Detail & Tanda Tangan (e-BAST)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      @click="task.id && deleteTask(task.id)"
                      class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      title="Hapus Penugasan"
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
    <!-- MODAL: WORK ORDER & E-SIGNATURE PAD -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ modalMode === 'create' ? 'Buat Work Order (SPK) Baru' : 'Eksekusi Work Order & e-BAST' }}
              </h3>
              <p v-if="formData.id" class="text-xs font-mono text-brand-600 dark:text-brand-400">
                #WO-{{ String(formData.id).padStart(4, '0') }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form @submit.prevent="saveTask" class="space-y-4 mt-4">
            <!-- Task Title -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul / Uraian Tugas Lapangan *</label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="Contoh: Instalasi Rack Server & Penarikan Kabel FO Cabang Bandung"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Customer & Technician Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pelanggan / Klien *</label>
                <select
                  v-model="formData.partner_id"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option :value="undefined" disabled>-- Pilih Klien --</option>
                  <option v-for="p in partners" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Teknisi / Dispatch Bertugas *</label>
                <select
                  v-model="formData.employee_id"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option :value="undefined" disabled>-- Pilih Teknisi --</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.name || emp.full_name || 'Teknisi #' + emp.id }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Address Location -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap Lokasi Lapangan</label>
              <input
                v-model="formData.address"
                type="text"
                placeholder="Contoh: Jl. Gatot Subroto Kav. 52, Lantai 4, Jakarta Selatan"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Priority & State -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tingkat Prioritas</label>
                <select
                  v-model="formData.priority"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent (Emergency Call)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status Pengerjaan</label>
                <select
                  v-model="formData.state"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="draft">Draft SPK</option>
                  <option value="assigned">Teknisi Ditugaskan (Assigned)</option>
                  <option value="in_progress">Sedang Dikerjakan (In Progress)</option>
                  <option value="completed">Selesai (Completed / BAST Signed)</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            <!-- SOP Checklist Section -->
            <div class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-gray-800 dark:text-gray-200">SOP Checklist Teknisi</span>
                <button
                  type="button"
                  @click="addChecklistItem"
                  class="text-[11px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  + Tambah Item SOP
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(item, idx) in checklistItems"
                  :key="idx"
                  class="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    v-model="item.done"
                    class="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    v-model="item.title"
                    placeholder="Nama item checklist..."
                    class="flex-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    @click="removeChecklistItem(idx)"
                    class="text-gray-400 hover:text-red-500 text-xs px-1"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>

            <!-- DIGITAL SIGNATURE CANVAS PAD -->
            <div class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <span class="text-xs font-bold text-gray-800 dark:text-gray-200">Tanda Tangan Digital Klien (e-BAST)</span>
                  <p class="text-[10px] text-gray-400">Tanda tangan langsung pada area kanvas di bawah menggunakan mouse atau layar sentuh.</p>
                </div>
                <button
                  type="button"
                  @click="clearSignature"
                  class="text-[11px] font-medium text-red-500 hover:text-red-600"
                >
                  Hapus / Reset
                </button>
              </div>

              <!-- Canvas Container -->
              <div class="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 overflow-hidden relative">
                <canvas
                  ref="signatureCanvasRef"
                  width="600"
                  height="140"
                  class="w-full h-[140px] cursor-crosshair touch-none"
                  @mousedown="startDrawing"
                  @mousemove="draw"
                  @mouseup="stopDrawing"
                  @mouseleave="stopDrawing"
                  @touchstart.passive="handleTouchStart"
                  @touchmove.prevent="handleTouchMove"
                  @touchend="stopDrawing"
                ></canvas>

                <!-- Indicator if existing signature loaded -->
                <div v-if="formData.signature && !isCanvasTouched" class="absolute bottom-2 right-2">
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                    ✓ Tanda Tangan Tersimpan
                  </span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Pengerjaan / Material Digunakan</label>
              <textarea
                v-model="formData.notes"
                rows="2"
                placeholder="Rincian suku cadang pengganti yang dipakai atau rekomendasi untuk klien..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
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
                {{ isSaving ? 'Menyimpan...' : 'Simpan Work Order' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import { fieldServiceService } from '@/services/services/field-service.service'
import { employeesService } from '@/services/hr/employees.service'
import { crmService } from '@/services/sales/crm.service'
import type { IFieldServiceTaskDto, IChecklistItem } from '@/types/services'

// View & Filter States
const viewMode = ref<'kanban' | 'table'>('kanban')
const searchQuery = ref('')
const filterPriority = ref('all')
const filterTechnician = ref('all')

// Data Collections
const tasks = ref<IFieldServiceTaskDto[]>([])
const employees = ref<any[]>([])
const partners = ref<any[]>([])

const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)

// Kanban Column Definitions
const kanbanColumns = [
  { key: 'draft', label: 'Draft SPK', dotColor: 'bg-gray-400' },
  { key: 'assigned', label: 'Teknisi Ditugaskan', dotColor: 'bg-purple-500' },
  { key: 'in_progress', label: 'Sedang Dikerjakan', dotColor: 'bg-amber-500' },
  { key: 'completed', label: 'Selesai & BAST', dotColor: 'bg-emerald-500' }
]

// Modal & Form States
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formData = ref<Partial<IFieldServiceTaskDto>>({
  name: '',
  partner_id: undefined,
  employee_id: undefined,
  address: '',
  priority: 'low',
  state: 'draft',
  notes: '',
  signature: ''
})

// SOP Checklist items state
const checklistItems = ref<IChecklistItem[]>([
  { title: 'Inspeksi & asesmen kondisi fisik unit di lokasi', done: false },
  { title: 'Pemasangan perangkat & penarikan kabel/jalur koneksi', done: false },
  { title: 'Pengujian performa & quality check bersama klien', done: false },
  { title: 'Serah terima pekerjaan & edukasi user', done: false }
])

// Canvas Signature Pad State
const signatureCanvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const isCanvasTouched = ref(false)

// Fetch Data
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await fieldServiceService.getAll()
    tasks.value = data || []

    // Concurrently load employees and partners
    if (employees.value.length === 0) {
      employeesService.getAll().then(res => { employees.value = res || [] }).catch(() => {})
    }
    if (partners.value.length === 0) {
      crmService.getPartners().then(res => { partners.value = res || [] }).catch(() => {})
    }
  } catch (err: any) {
    error.value = 'Gagal memuat data lapangan: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

// Filtered Tasks
const filteredTasks = computed(() => {
  return tasks.value.filter(t => {
    const q = searchQuery.value.toLowerCase().trim()
    const clientName = getCustomerName(t.partner_id, t.partner).toLowerCase()
    const woCode = `#wo-${String(t.id).padStart(4, '0')}`.toLowerCase()
    const matchSearch = !q || (t.name && t.name.toLowerCase().includes(q)) ||
      (t.address && t.address.toLowerCase().includes(q)) ||
      clientName.includes(q) || woCode.includes(q)

    const matchPriority = filterPriority.value === 'all' || (t.priority || 'low').toLowerCase() === filterPriority.value.toLowerCase()
    const matchTech = filterTechnician.value === 'all' || String(t.employee_id) === String(filterTechnician.value)

    return matchSearch && matchPriority && matchTech
  })
})

const getTasksByStage = (stageKey: string) => {
  return filteredTasks.value.filter(t => (t.state || 'draft').toLowerCase() === stageKey.toLowerCase())
}

// KPI Counters
const assignedCount = computed(() => {
  return tasks.value.filter(t => t.state === 'assigned').length
})

const inProgressCount = computed(() => {
  return tasks.value.filter(t => t.state === 'in_progress').length
})

const completedCount = computed(() => {
  return tasks.value.filter(t => t.state === 'completed').length
})

// Helpers
const getCustomerName = (id?: number, partnerObj?: any) => {
  if (partnerObj && partnerObj.name) return partnerObj.name
  if (!id) return 'Pelanggan Walk-in'
  const p = partners.value.find(item => item.id === id)
  return p ? p.name : `Klien #${id}`
}

const getEmployeeName = (id?: number, empObj?: any) => {
  if (empObj && (empObj.name || empObj.full_name)) return empObj.name || empObj.full_name
  if (!id) return 'Belum Ditugaskan'
  const emp = employees.value.find(item => item.id === id)
  return emp ? (emp.name || emp.full_name) : `Teknisi #${id}`
}

const getEmployeeInitials = (id?: number, empObj?: any) => {
  const name = getEmployeeName(id, empObj)
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getPriorityBadgeClass = (priority?: string) => {
  switch ((priority || '').toLowerCase()) {
    case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
    case 'high': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
    case 'medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getStatusLabel = (state?: string) => {
  switch (state) {
    case 'assigned': return 'Ditugaskan'
    case 'in_progress': return 'Pengerjaan'
    case 'completed': return 'Selesai'
    case 'cancelled': return 'Batal'
    default: return 'Draft SPK'
  }
}

const getStatusBadgeClass = (state?: string) => {
  switch (state) {
    case 'assigned': return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
    case 'in_progress': return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
    case 'completed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
    case 'cancelled': return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

// Checklist Helpers
const getChecklistProgress = (task: IFieldServiceTaskDto) => {
  const items = task.checklist && task.checklist.length > 0 ? task.checklist : []
  if (items.length === 0) return '0/4'
  const done = items.filter(i => i.done).length
  return `${done}/${items.length}`
}

const getChecklistPercentage = (task: IFieldServiceTaskDto) => {
  const items = task.checklist && task.checklist.length > 0 ? task.checklist : []
  if (items.length === 0) return 0
  const done = items.filter(i => i.done).length
  return Math.round((done / items.length) * 100)
}

const addChecklistItem = () => {
  checklistItems.value.push({ title: 'Item pemeriksaan baru', done: false })
}

const removeChecklistItem = (idx: number) => {
  checklistItems.value.splice(idx, 1)
}

// Stage Transitions
const getPrevStage = (current?: string) => {
  const cur = (current || 'draft').toLowerCase()
  const index = kanbanColumns.findIndex(c => c.key === cur)
  return index > 0 ? kanbanColumns[index - 1].key : null
}

const getNextStage = (current?: string) => {
  const cur = (current || 'draft').toLowerCase()
  const index = kanbanColumns.findIndex(c => c.key === cur)
  return index !== -1 && index < kanbanColumns.length - 1 ? kanbanColumns[index + 1].key : null
}

const quickUpdateStage = async (task: IFieldServiceTaskDto, nextStage: string) => {
  try {
    await fieldServiceService.update(task.id!, {
      ...task,
      state: nextStage
    })
    task.state = nextStage
    await fetchData()
  } catch (err: any) {
    alert('Gagal memindahkan tahap: ' + (err.response?.data?.message || err.message))
  }
}

// --- Canvas E-Signature Logic ---
const initCanvas = () => {
  nextTick(() => {
    const canvas = signatureCanvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e293b'

    // If existing signature exists, draw it onto canvas
    if (formData.value.signature) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = formData.value.signature
    }
    isCanvasTouched.value = false
  })
}

const getCanvasPos = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  }
}

const startDrawing = (e: MouseEvent) => {
  const canvas = signatureCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  isDrawing.value = true
  isCanvasTouched.value = true
  const pos = getCanvasPos(canvas, e.clientX, e.clientY)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value) return
  const canvas = signatureCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const pos = getCanvasPos(canvas, e.clientX, e.clientY)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

const stopDrawing = () => {
  if (isDrawing.value) {
    isDrawing.value = false
    const canvas = signatureCanvasRef.value
    if (canvas) {
      formData.value.signature = canvas.toDataURL('image/png')
    }
  }
}

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  const canvas = signatureCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  isDrawing.value = true
  isCanvasTouched.value = true
  const pos = getCanvasPos(canvas, touch.clientX, touch.clientY)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDrawing.value) return
  const touch = e.touches[0]
  const canvas = signatureCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const pos = getCanvasPos(canvas, touch.clientX, touch.clientY)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

const clearSignature = () => {
  const canvas = signatureCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  formData.value.signature = ''
  isCanvasTouched.value = true
}

// Modal Form Actions
const openModal = (mode: 'create' | 'edit', data?: IFieldServiceTaskDto) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id,
      name: data.name || '',
      partner_id: data.partner_id || (partners.value[0]?.id || undefined),
      employee_id: data.employee_id || (employees.value[0]?.id || undefined),
      address: data.address || '',
      priority: data.priority || 'medium',
      state: data.state || 'draft',
      notes: data.notes || '',
      signature: data.signature || ''
    }
    checklistItems.value = data.checklist && data.checklist.length > 0 ? [...data.checklist] : [
      { title: 'Inspeksi & asesmen kondisi fisik unit di lokasi', done: false },
      { title: 'Pemasangan perangkat & penarikan kabel/jalur koneksi', done: false },
      { title: 'Pengujian performa & quality check bersama klien', done: false },
      { title: 'Serah terima pekerjaan & edukasi user', done: false }
    ]
  } else {
    formData.value = {
      name: '',
      partner_id: partners.value[0]?.id || undefined,
      employee_id: employees.value[0]?.id || undefined,
      address: '',
      priority: 'medium',
      state: 'draft',
      notes: '',
      signature: ''
    }
    checklistItems.value = [
      { title: 'Inspeksi & asesmen kondisi fisik unit di lokasi', done: false },
      { title: 'Pemasangan perangkat & penarikan kabel/jalur koneksi', done: false },
      { title: 'Pengujian performa & quality check bersama klien', done: false },
      { title: 'Serah terima pekerjaan & edukasi user', done: false }
    ]
  }
  isModalOpen.value = true
  initCanvas()
}

const saveTask = async () => {
  isSaving.value = true
  try {
    const payload: any = {
      name: formData.value.name,
      partner_id: formData.value.partner_id ? Number(formData.value.partner_id) : null,
      employee_id: formData.value.employee_id ? Number(formData.value.employee_id) : null,
      address: formData.value.address || '',
      priority: formData.value.priority || 'medium',
      state: formData.value.state || 'draft',
      notes: formData.value.notes || '',
      signature: formData.value.signature || '',
      checklist: checklistItems.value
    }

    if (modalMode.value === 'edit' && formData.value.id) {
      await fieldServiceService.update(formData.value.id, payload)
    } else {
      await fieldServiceService.create(payload)
    }
    isModalOpen.value = false
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteTask = async (id: number) => {
  if (!confirm('Hapus surat perintah kerja (SPK) ini?')) return
  try {
    await fieldServiceService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>
