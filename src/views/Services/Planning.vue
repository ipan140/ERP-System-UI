
<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Top Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageBreadcrumb pageTitle="Perencanaan Shift & Sumber Daya (Planning)" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Alokasi shift teknisi & konsultan layanan, kalender rotasi kerja, dan deteksi konflik jadwal (overbooking)
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- View Switcher -->
          <div class="flex items-center rounded-lg border border-gray-300 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800">
            <button
              @click="activeView = 'roster'"
              :class="activeView === 'roster' ? 'bg-brand-500 text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              Roster Grid
            </button>
            <button
              @click="activeView = 'table'"
              :class="activeView === 'table' ? 'bg-brand-500 text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Tabel Jadwal
            </button>
          </div>

          <button
            @click="fetchData"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            Refresh
          </button>

          <button
            @click="openModal('create')"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Jadwalkan Shift
          </button>
        </div>
      </div>

      <!-- Workflow Alur Perencanaan Banner -->
      <div class="rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/40 p-4 dark:border-blue-900/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <h3 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Alur Perencanaan & Manajemen Shift (Planning Lifecycle)
              </h3>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
              Alur baku operasional: susun jadwal tim (<strong>Draf</strong>) &rarr; verifikasi anti-overbooking jadwal &rarr; <strong>Publikasikan</strong> ke personil &rarr; pelaksanaan shift & tandai <strong>Selesai</strong>.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Stepper indicators -->
            <div class="flex items-center gap-1.5 text-2xs font-semibold">
              <span class="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                1. Draf ({{ draftCount }})
              </span>
              <span class="text-gray-400 dark:text-gray-500">&rarr;</span>
              <span class="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                2. Dikonfirmasi ({{ publishedCount }})
              </span>
              <span class="text-gray-400 dark:text-gray-500">&rarr;</span>
              <span class="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                3. Selesai ({{ completedCount }})
              </span>
            </div>

            <!-- 1-Click Bulk Action -->
            <button
              v-if="draftCount > 0"
              @click="publishAllDrafts"
              :disabled="isPublishingAll"
              class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
            >
              <svg v-if="isPublishingAll" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Publikasikan Semua Draf ({{ draftCount }})
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Shift Terjadwal -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Shift Terjadwal</span>
            <div class="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Shift</span>
          </div>
          <p class="mt-1 text-2xs text-gray-400">Total jam terencana: {{ totalPlannedHours.toFixed(1) }} Jam</p>
        </div>

        <!-- Shift Hari Ini -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Shift Hari Ini</span>
            <div class="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ todayShifts.length }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Shift Aktif</span>
          </div>
          <p class="mt-1 text-2xs text-gray-400">{{ todayShifts.filter(s => s.state === 'published').length }} dikonfirmasi berjalan</p>
        </div>

        <!-- Staf Teralokasi -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Staf / Teknisi Terjadwal</span>
            <div class="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ allocatedStaffCount }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Karyawan</span>
          </div>
          <p class="mt-1 text-2xs text-gray-400">Dari total {{ employeesList.length }} personel terdaftar</p>
        </div>

        <!-- Deteksi Konflik Jadwal -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Deteksi Konflik Jadwal</span>
            <div
              class="rounded-lg p-2"
              :class="conflicts.length > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="conflicts.length > 0" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" />
                <polyline v-else points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span
              class="text-2xl font-bold"
              :class="conflicts.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'"
            >
              {{ conflicts.length }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Konflik</span>
          </div>
          <p class="mt-1 text-2xs" :class="conflicts.length > 0 ? 'text-red-500 font-semibold' : 'text-gray-400'">
            {{ conflicts.length > 0 ? 'Perlu penyesuaian jadwal segera!' : 'Jadwal bersih tanpa overbooking' }}
          </p>
        </div>
      </div>

      <!-- Overbooking Warning Banner -->
      <div
        v-if="conflicts.length > 0"
        class="rounded-xl border border-red-200 bg-red-50/80 p-4 dark:border-red-900/50 dark:bg-red-950/30"
      >
        <div class="flex items-start gap-3">
          <div class="rounded-full bg-red-100 p-1.5 text-red-600 dark:bg-red-900/50 dark:text-red-300">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-xs font-bold text-red-800 dark:text-red-200">
              Peringatan Overbooking: Ditemukan {{ conflicts.length }} Tumpang Tindih Shift
            </h4>
            <p class="text-2xs text-red-700 dark:text-red-300 mt-0.5">
              Staf berikut dijadwalkan pada jam yang bersamaan di tanggal yang sama:
            </p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="(c, idx) in conflicts"
                :key="idx"
                class="inline-flex items-center gap-1 rounded-md bg-white/80 dark:bg-red-900/40 px-2 py-1 text-2xs font-semibold text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              >
                {{ c.employeeName }} ({{ formatDate(c.date) }}: {{ c.timeRange1 }} & {{ c.timeRange2 }})
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search -->
          <div class="relative flex-1 max-w-sm">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama shift, peran, atau karyawan..."
              class="w-full rounded-lg border border-gray-300 bg-transparent px-3.5 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>

          <!-- Status Tabs & Filters -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Status Tabs -->
            <div class="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
              <button
                @click="selectedStateFilter = 'all'"
                :class="selectedStateFilter === 'all' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all"
              >
                Semua ({{ records.length }})
              </button>
              <button
                @click="selectedStateFilter = 'draft'"
                :class="selectedStateFilter === 'draft' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all"
              >
                Draf ({{ draftCount }})
              </button>
              <button
                @click="selectedStateFilter = 'published'"
                :class="selectedStateFilter === 'published' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all"
              >
                Dikonfirmasi ({{ publishedCount }})
              </button>
              <button
                @click="selectedStateFilter = 'completed'"
                :class="selectedStateFilter === 'completed' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                class="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all"
              >
                Selesai ({{ completedCount }})
              </button>
            </div>

            <!-- Filter Karyawan -->
            <select
              v-model="selectedEmployeeFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="">Semua Karyawan</option>
              <option v-for="emp in employeesList" :key="emp.id" :value="emp.id">
                {{ emp.name || emp.full_name || 'Karyawan #' + emp.id }}
              </option>
            </select>

            <!-- Quick Filter Tanggal -->
            <button
              @click="toggleOnlyToday"
              class="px-3 py-2 rounded-lg text-xs font-semibold border transition-all"
              :class="onlyToday
                ? 'bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'"
            >
              Hanya Hari Ini
            </button>
          </div>
        </div>
      </div>

      <!-- VIEW MODE 1: ROSTER GRID -->
      <div v-if="activeView === 'roster'" class="space-y-4">
        <div v-if="isLoading" class="p-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Menyusun roster shift...</p>
        </div>

        <div v-else-if="groupedByDate.length === 0" class="p-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div class="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 dark:bg-gray-800 mb-3">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">Belum ada roster shift yang sesuai</p>
          <p class="text-xs text-gray-400 mt-0.5">Coba sesuaikan filter atau klik "+ Jadwalkan Shift" untuk menambah jadwal baru.</p>
        </div>

        <!-- Date Groups -->
        <div v-else class="space-y-4">
          <div
            v-for="group in groupedByDate"
            :key="group.date"
            class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-sm"
          >
            <!-- Date Group Header -->
            <div class="flex items-center justify-between px-4 py-3 bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span class="text-xs font-bold text-gray-900 dark:text-white">
                  {{ formatDateLong(group.date) }}
                </span>
                <span
                  v-if="isDateToday(group.date)"
                  class="rounded-full bg-amber-100 px-2 py-0.5 text-2xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                >
                  Hari Ini
                </span>
              </div>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ group.shifts.length }} Shift Terjadwal ({{ group.totalHours.toFixed(1) }} Jam)
              </span>
            </div>

            <!-- Shifts Grid in this Date -->
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="shift in group.shifts"
                :key="shift.id"
                class="rounded-xl border p-3.5 transition-all hover:shadow-md relative flex flex-col justify-between"
                :class="getShiftCardClass(shift)"
              >
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span class="text-xs font-bold text-gray-900 dark:text-white block">
                        {{ shift.name || 'Shift Layanan' }}
                      </span>
                      <span class="inline-block mt-0.5 rounded px-2 py-0.5 text-2xs font-semibold bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200">
                        {{ shift.role || 'Teknisi' }}
                      </span>
                    </div>

                    <!-- State Badge -->
                    <span
                      class="rounded-full px-2 py-0.5 text-2xs font-bold whitespace-nowrap border"
                      :class="getStateBadgeClass(shift.state)"
                    >
                      {{ getStateLabel(shift.state) }}
                    </span>
                  </div>

                  <!-- Employee Assigned -->
                  <div class="flex items-center gap-2.5 my-2.5">
                    <div class="h-7 w-7 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center text-xs shrink-0">
                      {{ getInitials(getEmployeeName(shift)) }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {{ getEmployeeName(shift) }}
                      </p>
                      <p class="text-2xs text-gray-400 dark:text-gray-400">
                        {{ shift.start_time || '08:00' }} - {{ shift.end_time || '17:00' }} ({{ (shift.hours || 0).toFixed(1) }}h)
                      </p>
                    </div>
                  </div>

                  <!-- Notes -->
                  <p v-if="shift.notes" class="text-2xs text-gray-600 dark:text-gray-300 line-clamp-2 italic bg-gray-50 dark:bg-gray-700/40 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    "{{ shift.notes }}"
                  </p>
                </div>

                <!-- Footer Quick Actions -->
                <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-2xs">
                  <div class="flex items-center gap-1.5">
                    <button
                      v-if="(shift.state || 'draft') === 'draft'"
                      @click="quickUpdateState(shift, 'published')"
                      class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Terbitkan
                    </button>
                    <button
                      v-if="shift.state === 'published'"
                      @click="quickUpdateState(shift, 'completed')"
                      class="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Selesaikan
                    </button>
                    <button
                      v-if="shift.state === 'published'"
                      @click="quickUpdateState(shift, 'draft')"
                      class="text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
                      title="Kembalikan status ke draf"
                    >
                      Drafkan
                    </button>
                    <button
                      v-if="shift.state === 'completed'"
                      @click="quickUpdateState(shift, 'published')"
                      class="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                      title="Buka kembali shift"
                    >
                      Buka Kembali
                    </button>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      @click="openModal('edit', shift)"
                      class="p-1 rounded text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-brand-400"
                      title="Edit Shift"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      @click="shift.id && deleteRecord(shift.id)"
                      class="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      title="Hapus Shift"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW MODE 2: TABLE VIEW -->
      <div v-else class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50 text-2xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
                <th class="py-3 px-4">Tanggal</th>
                <th class="py-3 px-4">Nama Shift & Peran</th>
                <th class="py-3 px-4">Karyawan Ditugaskan</th>
                <th class="py-3 px-4">Jam Kerja</th>
                <th class="py-3 px-4 text-center">Durasi</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4">Catatan / Area</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-xs dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="8" class="py-12 text-center">
                  <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Memuat jadwal shift...</p>
                </td>
              </tr>

              <tr v-else-if="filteredRecords.length === 0">
                <td colspan="8" class="py-12 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada jadwal shift yang cocok dengan filter.
                </td>
              </tr>

              <tr
                v-for="record in filteredRecords"
                :key="record.id"
                class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
              >
                <!-- Tanggal -->
                <td class="py-3.5 px-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {{ formatDate(record.date) }}
                </td>

                <!-- Nama & Peran -->
                <td class="py-3.5 px-4">
                  <span class="font-bold text-gray-900 dark:text-white block">{{ record.name }}</span>
                  <span class="text-2xs text-brand-600 dark:text-brand-400 font-medium">{{ record.role || 'Teknisi' }}</span>
                </td>

                <!-- Karyawan -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="h-6 w-6 rounded-full bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-2xs">
                      {{ getInitials(getEmployeeName(record)) }}
                    </div>
                    <span class="font-medium text-gray-800 dark:text-gray-200">{{ getEmployeeName(record) }}</span>
                  </div>
                </td>

                <!-- Jam Kerja -->
                <td class="py-3.5 px-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {{ record.start_time || '08:00' }} - {{ record.end_time || '17:00' }}
                </td>

                <!-- Durasi -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ (record.hours || 0).toFixed(1) }} Jam</span>
                </td>

                <!-- Status & Dropdown Quick Switch -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <select
                    :value="record.state || 'draft'"
                    @change="onStateDropdownChange(record, $event)"
                    class="rounded-full px-2.5 py-1 text-2xs font-bold border cursor-pointer focus:outline-none"
                    :class="getStateBadgeClass(record.state)"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Dikonfirmasi</option>
                    <option value="completed">Selesai</option>
                  </select>
                </td>

                <!-- Catatan -->
                <td class="py-3.5 px-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {{ record.notes || '-' }}
                </td>

                <!-- Aksi -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      @click="openModal('edit', record)"
                      class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                      title="Edit Shift"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      @click="record.id && deleteRecord(record.id)"
                      class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      title="Hapus Shift"
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
  </AdminLayout>

  <!-- Modal Atur Shift (Create / Edit) -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              {{ modalMode === 'create' ? 'Jadwalkan Shift Baru' : 'Perbarui Jadwal Shift' }}
            </h3>
            <p class="text-xs text-gray-400">Atur alokasi waktu dan peran teknisi/konsultan</p>
          </div>
          <button @click="closeModal" class="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form @submit.prevent="saveRecord" class="space-y-4 pt-4">
          <!-- Nama Shift & Peran -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Nama Shift / Penugasan <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="cth: Shift Pagi On-Site"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Peran / Bidang Tugas
              </label>
              <select
                v-model="formData.role"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Lead Technician">Lead Technician</option>
                <option value="Service Engineer">Service Engineer</option>
                <option value="Helpdesk Support">Helpdesk Support</option>
                <option value="ERP Consultant">ERP Consultant</option>
                <option value="Field Support Specialist">Field Support Specialist</option>
              </select>
            </div>
          </div>

          <!-- Karyawan & Tanggal -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Karyawan / Personel <span class="text-red-500">*</span>
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
                Tanggal Shift <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <!-- Jam Mulai, Jam Selesai & Durasi -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Jam Mulai <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.start_time"
                type="time"
                required
                @change="calculateHoursFromTimes"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Jam Selesai <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.end_time"
                type="time"
                required
                @change="calculateHoursFromTimes"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Total Jam
              </label>
              <input
                v-model.number="formData.hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-semibold"
              />
            </div>
          </div>

          <!-- Status Shift -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Status Shift
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="formData.state = 'draft'"
                class="py-2 text-xs font-semibold rounded-lg border transition-all"
                :class="formData.state === 'draft' ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'"
              >
                Draft (Rancangan)
              </button>
              <button
                type="button"
                @click="formData.state = 'published'"
                class="py-2 text-xs font-semibold rounded-lg border transition-all"
                :class="formData.state === 'published' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'"
              >
                Dikonfirmasi
              </button>
              <button
                type="button"
                @click="formData.state = 'completed'"
                class="py-2 text-xs font-semibold rounded-lg border transition-all"
                :class="formData.state === 'completed' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'"
              >
                Selesai
              </button>
            </div>
          </div>

          <!-- Real-Time In-Modal Conflict Check -->
          <div
            v-if="modalConflictWarning"
            class="p-2.5 rounded-lg bg-red-50 border border-red-200 text-2xs text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300 flex items-center gap-2"
          >
            <svg class="w-4 h-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <span>{{ modalConflictWarning }}</span>
          </div>

          <!-- Catatan / Keterangan Penugasan -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Catatan / Lokasi / Penugasan Khusus
            </label>
            <textarea
              v-model="formData.notes"
              rows="2.5"
              placeholder="cth: Standby di Ruang Server Kantor Pusat, bawa perkakas lengkap..."
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
              {{ isSaving ? 'Menyimpan...' : 'Simpan Shift' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { planningService } from '@/services/services/planning.service'
import { employeesService } from '@/services/hr/employees.service'
import type { IShiftDto } from '@/types/services'

// UI View Switcher
const activeView = ref<'roster' | 'table'>('roster')

// Data States
const records = ref<IShiftDto[]>([])
const employeesList = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Filters
const searchQuery = ref('')
const selectedEmployeeFilter = ref<number | string>('')
const selectedStateFilter = ref<'all' | 'draft' | 'published' | 'completed'>('all')
const onlyToday = ref(false)

// Modal State
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<IShiftDto>({
  name: '',
  role: 'Service Engineer',
  employee_id: undefined,
  date: new Date().toISOString().split('T')[0],
  start_time: '08:00',
  end_time: '17:00',
  hours: 8,
  state: 'published',
  notes: ''
})

// Fetch all dependencies
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [shiftsData, employeesData] = await Promise.all([
      planningService.getAll().catch(() => []),
      employeesService.getAll().catch(() => [])
    ])

    records.value = Array.isArray(shiftsData) ? shiftsData : []
    employeesList.value = Array.isArray(employeesData) ? employeesData : []
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

// Helpers & Lookups
const getEmployeeName = (shift: IShiftDto) => {
  if (shift.employee?.name) return shift.employee.name
  if (shift.employee?.full_name) return shift.employee.full_name
  const found = employeesList.value.find(e => e.id === shift.employee_id)
  return found?.name || found?.full_name || `Karyawan #${shift.employee_id || '?'}`
}

const getInitials = (name: string) => {
  if (!name) return 'SH'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const formatDate = (dateStr?: string) => {
  if (!dateStr || dateStr === '-' || dateStr === 'Tanpa Tanggal') return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const formatDateLong = (dateStr?: string) => {
  if (!dateStr || dateStr === '-' || dateStr === 'Tanpa Tanggal') return 'Tanpa Tanggal / Draf Bebas'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const isDateToday = (dateStr?: string) => {
  if (!dateStr) return false
  const today = new Date().toISOString().split('T')[0]
  return dateStr.startsWith(today)
}

const getStateLabel = (state?: string) => {
  switch (state) {
    case 'published': return 'Dikonfirmasi'
    case 'completed': return 'Selesai'
    default: return 'Draft'
  }
}

const getStateBadgeClass = (state?: string) => {
  switch (state) {
    case 'published':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700'
    default:
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700'
  }
}

const getShiftCardClass = (shift: IShiftDto) => {
  // If in conflict, highlight with red outline
  const isConflicted = conflicts.value.some(c => c.shiftId1 === shift.id || c.shiftId2 === shift.id)
  if (isConflicted) {
    return 'border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20'
  }
  return 'border-gray-200 bg-white dark:border-gray-700/60 dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-500'
}

// KPI Computations
const totalPlannedHours = computed(() => records.value.reduce((sum, r) => sum + (Number(r.hours) || 0), 0))
const todayDateStr = new Date().toISOString().split('T')[0]
const todayShifts = computed(() => records.value.filter(r => r.date?.startsWith(todayDateStr)))
const allocatedStaffCount = computed(() => {
  const staffIds = new Set(records.value.map(r => r.employee_id).filter(Boolean))
  return staffIds.size
})

// Lifecycle stage counters
const draftCount = computed(() => records.value.filter(r => (r.state || 'draft') === 'draft').length)
const publishedCount = computed(() => records.value.filter(r => r.state === 'published').length)
const completedCount = computed(() => records.value.filter(r => r.state === 'completed').length)

// Bulk publish action
const isPublishingAll = ref(false)
const publishAllDrafts = async () => {
  const drafts = records.value.filter(s => (s.state || 'draft') === 'draft')
  if (drafts.length === 0) return
  if (!confirm(`Publikasikan sekaligus ${drafts.length} shift yang berstatus draf? Jadwal akan aktif untuk seluruh personil/teknisi.`)) return

  isPublishingAll.value = true
  try {
    await Promise.all(
      drafts.map(d =>
        planningService.update(d.id!, {
          ...d,
          state: 'published'
        })
      )
    )
    await fetchData()
  } catch (err: any) {
    alert('Gagal mempublikasikan draf: ' + (err.response?.data?.message || err.message))
  } finally {
    isPublishingAll.value = false
  }
}

// Overbooking Conflict Detection Algorithm
interface IConflict {
  employeeName: string
  date: string
  timeRange1: string
  timeRange2: string
  shiftId1?: number
  shiftId2?: number
}

const conflicts = computed<IConflict[]>(() => {
  const conflictList: IConflict[] = []
  const items = records.value

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i]
      const b = items[j]

      // Same employee and same date
      if (a.employee_id && b.employee_id && a.employee_id === b.employee_id && a.date === b.date) {
        // Check time overlap
        const startA = a.start_time || '08:00'
        const endA = a.end_time || '17:00'
        const startB = b.start_time || '08:00'
        const endB = b.end_time || '17:00'

        // Overlaps if startA < endB and startB < endA
        if (startA < endB && startB < endA) {
          conflictList.push({
            employeeName: getEmployeeName(a),
            date: a.date || '',
            timeRange1: `${startA}-${endA}`,
            timeRange2: `${startB}-${endB}`,
            shiftId1: a.id,
            shiftId2: b.id
          })
        }
      }
    }
  }

  return conflictList
})

// In-Modal conflict warning
const modalConflictWarning = computed(() => {
  if (!formData.value.employee_id || !formData.value.date) return null
  const start = formData.value.start_time || '08:00'
  const end = formData.value.end_time || '17:00'

  const clash = records.value.find(r => {
    if (formData.value.id && r.id === formData.value.id) return false
    if (r.employee_id === formData.value.employee_id && r.date === formData.value.date) {
      const s = r.start_time || '08:00'
      const e = r.end_time || '17:00'
      return start < e && s < end
    }
    return false
  })

  if (clash) {
    return `Perhatian: ${getEmployeeName(formData.value)} sudah memiliki jadwal pada ${formData.value.date} (${clash.start_time}-${clash.end_time}).`
  }
  return null
})

// Filtered Records
const filteredRecords = computed(() => {
  return records.value.filter(shift => {
    if (onlyToday.value && !shift.date?.startsWith(todayDateStr)) return false
    if (selectedEmployeeFilter.value && shift.employee_id != selectedEmployeeFilter.value) return false
    if (selectedStateFilter.value !== 'all' && (shift.state || 'draft') !== selectedStateFilter.value) return false

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const name = (shift.name || '').toLowerCase()
      const role = (shift.role || '').toLowerCase()
      const emp = getEmployeeName(shift).toLowerCase()
      const notes = (shift.notes || '').toLowerCase()
      return name.includes(q) || role.includes(q) || emp.includes(q) || notes.includes(q)
    }

    return true
  })
})

// Grouped by Date for Roster View
const groupedByDate = computed(() => {
  const groups: { [key: string]: IShiftDto[] } = {}

  filteredRecords.value.forEach(shift => {
    let dateKey = shift.date ? shift.date.split('T')[0] : 'Tanpa Tanggal'
    if (!dateKey || dateKey.trim() === '' || dateKey === '-') dateKey = 'Tanpa Tanggal'
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(shift)
  })

  return Object.keys(groups)
    .sort((a, b) => {
      if (a === 'Tanpa Tanggal') return 1
      if (b === 'Tanpa Tanggal') return -1
      return a.localeCompare(b)
    })
    .map(date => {
      const shifts = groups[date]
      return {
        date,
        shifts,
        totalHours: shifts.reduce((sum, s) => sum + (Number(s.hours) || 0), 0)
      }
    })
})

// Toggle Today filter
const toggleOnlyToday = () => {
  onlyToday.value = !onlyToday.value
}

// Calculate hours automatically
const calculateHoursFromTimes = () => {
  if (!formData.value.start_time || !formData.value.end_time) return
  const [h1, m1] = formData.value.start_time.split(':').map(Number)
  const [h2, m2] = formData.value.end_time.split(':').map(Number)
  const diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (diffMinutes > 0) {
    formData.value.hours = Math.round((diffMinutes / 60) * 10) / 10
  }
}

// Modal Actions
const openModal = (mode: 'create' | 'edit', data: IShiftDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id,
      name: data.name || '',
      role: data.role || 'Service Engineer',
      employee_id: data.employee_id,
      date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
      start_time: data.start_time || '08:00',
      end_time: data.end_time || '17:00',
      hours: data.hours || 8,
      state: data.state || 'published',
      notes: data.notes || ''
    }
  } else {
    formData.value = {
      id: undefined,
      name: '',
      role: 'Service Engineer',
      employee_id: employeesList.value[0]?.id || undefined,
      date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      end_time: '17:00',
      hours: 8,
      state: 'published',
      notes: ''
    }
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
      hours: Number(formData.value.hours) || 8
    }

    if (modalMode.value === 'edit' && formData.value.id) {
      await planningService.update(formData.value.id, payload)
    } else {
      await planningService.create(payload)
    }
    closeModal()
    fetchData()
  } catch (err: any) {
    alert('Gagal menyimpan shift: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

// Quick State Updates
const quickUpdateState = async (shift: IShiftDto, newState: string) => {
  if (!shift.id) return
  try {
    shift.state = newState
    await planningService.update(shift.id, {
      ...shift,
      state: newState
    })
  } catch (err: any) {
    alert('Gagal memperbarui status: ' + (err.response?.data?.message || err.message))
  }
}

const onStateDropdownChange = async (shift: IShiftDto, event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target && shift.id) {
    await quickUpdateState(shift, target.value)
  }
}

// Delete Record
const deleteRecord = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus jadwal shift ini?')) return
  try {
    await planningService.delete(id)
    fetchData()
  } catch (err: any) {
    alert('Gagal menghapus shift: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchData()
})
</script>

