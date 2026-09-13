<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header Breadcrumb & Actions -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageBreadcrumb pageTitle="Matriks Hak Akses (Dynamic RBAC)" />
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola izin akses modular granular (Lihat, Ubah, Hapus, Ekspor, & Otorisasi) berstandar Odoo Enterprise & Mekari.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            @click="fetchData"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            Muat Ulang
          </button>
          <button
            @click="openModal('create')"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 py-2 px-5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Tambah Izin Modul
          </button>
        </div>
      </div>

      <!-- Role Selector Banner & Security Policy Alert -->
      <div class="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Role Selector Card -->
        <div class="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Pilih Peran Pengguna (Active Role Context)
            </label>
            <span class="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
              <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              Live Dynamic RBAC
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="role in availableRoles"
              :key="role"
              @click="selectedRole = role"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border',
                selectedRole === role
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <svg v-if="role.includes('Superadmin') || role.includes('Direktur')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg v-else-if="role.includes('Finance') || role.includes('Tax')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <svg v-else-if="role.includes('HR')" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {{ role }}
            </button>
          </div>
        </div>

        <!-- Role Security Intelligence Card -->
        <div class="rounded-xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">Security Governance</h4>
                <p class="text-xs text-blue-700 dark:text-blue-300">Audit Compliance Tier</p>
              </div>
            </div>
            <span :class="roleRiskBadgeClass">
              {{ roleRiskText }}
            </span>
          </div>
          <p class="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            Role <strong>{{ selectedRole }}</strong> memiliki <strong>{{ activeModuleCount }}</strong> modul dengan izin aktif. 
            {{ roleSecurityRecommendation }}
          </p>
        </div>
      </div>

      <!-- Filter Categories & Search Bar -->
      <div class="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Category Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            v-for="cat in moduleCategories"
            :key="cat.key"
            @click="selectedCategory = cat.key"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition',
              selectedCategory === cat.key
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            ]"
          >
            {{ cat.label }} ({{ getCategoryCount(cat.key) }})
          </button>
        </div>

        <!-- Search & Bulk Actions -->
        <div class="flex items-center gap-2.5">
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari modul (cth: payroll, po)..."
              class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          </div>

          <!-- Bulk Actions Dropdown -->
          <div class="relative">
            <button
              @click="showBulkMenu = !showBulkMenu"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition"
            >
              <span>Aksi Massal</span>
              <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>

            <div
              v-if="showBulkMenu"
              class="absolute right-0 mt-1 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg z-30 dark:border-gray-700 dark:bg-gray-800 text-xs"
            >
              <button
                @click="bulkToggle('full')"
                class="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                Beri Semua Akses Penuh
              </button>
              <button
                @click="bulkToggle('read_only')"
                class="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                Mode Lihat Saja (Read-Only)
              </button>
              <button
                @click="bulkToggle('revoke')"
                class="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-red-500"></span>
                Cabut Semua Akses
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Feedback -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="toastMessage" class="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-xs font-medium text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300">
          <svg class="w-4 h-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          {{ toastMessage }}
        </div>
      </transition>

      <!-- Matrix Table Section -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 gap-3">
          <div class="flex items-center gap-2.5">
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">
              Matriks Izin: <span class="text-brand-600 dark:text-brand-400">{{ selectedRole }}</span>
            </h3>
            <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {{ filteredModules.length }} Modul Terfilter
            </span>
          </div>

          <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-green-500"></span> Lihat</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Ubah</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> Hapus</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Ekspor Data</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Otorisasi (Approve)</span>
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-700 dark:text-gray-200">Modul & Lingkup Kerja</th>
                <th class="px-4 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">
                  <div class="flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Lihat (Read)
                  </div>
                </th>
                <th class="px-4 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">
                  <div class="flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Input/Ubah (Write)
                  </div>
                </th>
                <th class="px-4 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">
                  <div class="flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Hapus (Delete)
                  </div>
                </th>
                <th class="px-4 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">
                  <div class="flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Ekspor Data
                  </div>
                </th>
                <th class="px-4 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">
                  <div class="flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Otorisasi (Approve)
                  </div>
                </th>
                <th class="px-4 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">Aksi Cepat</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="7" class="py-12 text-center text-gray-500 dark:text-gray-400">
                  <div class="inline-block w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p>Memuat konfigurasi matriks izin...</p>
                </td>
              </tr>
              <tr v-else-if="filteredModules.length === 0">
                <td colspan="7" class="py-10 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada modul yang cocok dengan kriteria pencarian.
                </td>
              </tr>
              <tr
                v-else
                v-for="mod in filteredModules"
                :key="mod.module"
                class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition"
              >
                <!-- Module Info & Risk Tag -->
                <td class="px-5 py-3.5">
                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 mt-0.5">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-gray-900 dark:text-white capitalize">
                          {{ formatModuleName(mod.module) }}
                        </span>
                        <span
                          v-if="isSensitiveModule(mod.module)"
                          class="rounded-full bg-red-100 px-2 py-0.2 text-[10px] font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-400"
                          title="Modul ini mengelola data sensitif (Keuangan/Payroll/Sistem)"
                        >
                          Sensitif
                        </span>
                      </div>
                      <span class="block text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                        {{ mod.module }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Read Toggle -->
                <td class="px-4 py-3.5 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      :checked="mod.can_read"
                      @change="handleToggle(mod, 'read', $event)"
                    />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                  </label>
                </td>

                <!-- Write Toggle -->
                <td class="px-4 py-3.5 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      :checked="mod.can_write"
                      @change="handleToggle(mod, 'write', $event)"
                    />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
                </td>

                <!-- Delete Toggle -->
                <td class="px-4 py-3.5 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      :checked="mod.can_delete"
                      @change="handleToggle(mod, 'delete', $event)"
                    />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                  </label>
                </td>

                <!-- Export Toggle -->
                <td class="px-4 py-3.5 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      :checked="mod.can_export"
                      @change="handleToggle(mod, 'export', $event)"
                    />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                  </label>
                </td>

                <!-- Approve Toggle -->
                <td class="px-4 py-3.5 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      :checked="mod.can_approve"
                      @change="handleToggle(mod, 'approve', $event)"
                    />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                  </label>
                </td>

                <!-- Quick Module Toggle -->
                <td class="px-4 py-3.5 text-center whitespace-nowrap">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      @click="setModuleAll(mod, true)"
                      class="px-2 py-1 rounded bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-800 text-[10px] font-medium transition dark:bg-gray-800 dark:hover:bg-green-950 dark:text-gray-300 dark:hover:text-green-300"
                      title="Beri Semua Izin pada Modul ini"
                    >
                      Semua
                    </button>
                    <button
                      @click="setModuleAll(mod, false)"
                      class="px-2 py-1 rounded bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-800 text-[10px] font-medium transition dark:bg-gray-800 dark:hover:bg-red-950 dark:text-gray-300 dark:hover:text-red-300"
                      title="Cabut Semua Izin pada Modul ini"
                    >
                      Cabut
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah Hak Akses Modul Kustom -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[999999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Tambah Izin Akses Modul</h4>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form @submit.prevent="saveData">
            <div class="mb-4">
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">Pilih Role Penerima Izin</label>
              <select
                v-model="formData.role_name"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>-- Pilih Role --</option>
                <option v-for="r in availableRoles" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>

            <div class="mb-6">
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">Pilih Modul ERP</label>
              <select
                v-model="formData.module"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>-- Pilih Modul --</option>
                <option v-for="mod in availableModules" :key="mod" :value="mod">{{ formatModuleName(mod) }} ({{ mod }})</option>
              </select>
            </div>

            <div class="flex justify-end gap-2.5">
              <button
                type="button"
                @click="closeModal"
                class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition shadow-sm"
              >
                {{ isSaving ? 'Menyimpan...' : 'Tambahkan Akses' }}
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
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { permissionsService } from '@/services/core/permissions.service'
import { http } from '@/services/http'
import type { IRolePermissionDto } from '@/types/core/permissions.dto'

const route = useRoute()

// Master List of Roles
const availableRoles = ref<string[]>([
  'Superadmin',
  'Direktur / C-Level',
  'HR Manager',
  'HR Specialist (Payroll & Attendance)',
  'Finance & Accounting Manager',
  'Tax & AP/AR Officer',
  'Supply Chain & Warehouse Head',
  'Sales & Marketing Director',
  'General Staff / Employee',
  'Internal Auditor'
])

// Current active role filter
const selectedRole = ref<string>('Superadmin')
const selectedCategory = ref<string>('all')
const searchQuery = ref<string>('')
const showBulkMenu = ref<boolean>(false)
const toastMessage = ref<string | null>(null)

// Raw DB permissions records
const records = ref<IRolePermissionDto[]>([])
const availableModules = ref<string[]>([
  // Core & Systems
  'core/artificial_intelligence', 'core/base', 'core/dashboards', 'core/discuss',
  'core/documents', 'core/iot', 'core/knowledge', 'core/mailer', 'core/permissions',
  'core/report', 'core/storage', 'core/user_roles', 'core/voip', 'core/whatsapp',

  // Finance & Accounting
  'finance/accounting', 'finance/approvals', 'finance/consolidation', 'finance/documents',
  'finance/expenses', 'finance/invoicing', 'finance/sign', 'finance/spreadsheet_bi',

  // HR & People
  'hr/appraisals', 'hr/attendances', 'hr/employees', 'hr/fleet', 'hr/lunch',
  'hr/payroll', 'hr/recruitment', 'hr/referrals', 'hr/time_off',

  // Supply Chain & Manufacturing
  'supply_chain/barcode', 'supply_chain/inventory', 'supply_chain/maintenance',
  'supply_chain/manufacturing', 'supply_chain/plm', 'supply_chain/purchase', 'supply_chain/quality',

  // Sales & CRM
  'sales/crm', 'sales/point_of_sale', 'sales/rental', 'sales/sales_core', 'sales/subscriptions',

  // Marketing
  'marketing/events', 'marketing/marketing_automation', 'marketing/mass_mailing',
  'marketing/sms_marketing', 'marketing/social_marketing', 'marketing/surveys',

  // Services
  'services/appointments', 'services/field_service', 'services/helpdesk', 'services/planning',
  'services/project', 'services/repairs', 'services/timesheets',

  // Website & Portal
  'website/blog', 'website/ecommerce', 'website/elearning', 'website/forum',
  'website/live_chat', 'website/website_builder'
])

const moduleCategories = [
  { key: 'all', label: 'Semua Modul' },
  { key: 'hr', label: '🏢 HR & Kepegawaian' },
  { key: 'finance', label: '💰 Keuangan & Akuntansi' },
  { key: 'supply_chain', label: '📦 Rantai Pasok & Gudang' },
  { key: 'sales', label: '🤝 Penjualan & CRM' },
  { key: 'core', label: '⚙️ Sistem & Pengaturan' },
  { key: 'website', label: '🌐 Website & Portal' }
]

const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const isModalOpen = ref<boolean>(false)
const isSaving = ref<boolean>(false)
const formData = ref<{ role_name: string; module: string }>({ role_name: '', module: '' })

// Helper to trigger brief toast message
const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = null
  }, 3500)
}

// Compute matrix rows for selectedRole
const matrixItems = computed(() => {
  return availableModules.value.map(mod => {
    const existing = records.value.find(
      r => r.role_name?.toLowerCase() === selectedRole.value.toLowerCase() && r.module === mod
    )
    return {
      role_name: selectedRole.value,
      module: mod,
      can_read: existing ? !!existing.can_read : selectedRole.value === 'Superadmin',
      can_write: existing ? !!existing.can_write : selectedRole.value === 'Superadmin',
      can_delete: existing ? !!existing.can_delete : (selectedRole.value === 'Superadmin'),
      can_export: existing ? !!existing.can_export : (selectedRole.value === 'Superadmin' || selectedRole.value.includes('Manager') || selectedRole.value.includes('Auditor')),
      can_approve: existing ? !!existing.can_approve : (selectedRole.value === 'Superadmin' || selectedRole.value.includes('Manager') || selectedRole.value.includes('Direktur'))
    }
  })
})

// Filtered by category & search query
const filteredModules = computed(() => {
  return matrixItems.value.filter(item => {
    // Category match
    if (selectedCategory.value !== 'all') {
      if (!item.module.startsWith(selectedCategory.value + '/')) {
        return false
      }
    }
    // Search query match
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const formatted = formatModuleName(item.module).toLowerCase()
      if (!item.module.toLowerCase().includes(q) && !formatted.includes(q)) {
        return false
      }
    }
    return true
  })
})

const getCategoryCount = (key: string) => {
  if (key === 'all') return availableModules.value.length
  return availableModules.value.filter(m => m.startsWith(key + '/')).length
}

const activeModuleCount = computed(() => {
  return matrixItems.value.filter(m => m.can_read).length
})

// Security Intelligence for selected role
const roleRiskBadgeClass = computed(() => {
  if (selectedRole.value === 'Superadmin' || selectedRole.value.includes('Direktur')) {
    return 'rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400'
  }
  if (selectedRole.value.includes('Manager') || selectedRole.value.includes('Finance') || selectedRole.value.includes('HR')) {
    return 'rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
  }
  return 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400'
})

const roleRiskText = computed(() => {
  if (selectedRole.value === 'Superadmin') return 'Privilege Tertinggi (Wajib 2FA)'
  if (selectedRole.value.includes('Manager') || selectedRole.value.includes('Finance')) return 'Sensitivitas Tinggi (Wajib 2FA)'
  return 'Tingkat Standar'
})

const roleSecurityRecommendation = computed(() => {
  if (selectedRole.value === 'Superadmin') {
    return 'Superadmin memiliki hak bypass seluruh modul. Pastikan akun ini dilindungi otentikasi dua faktor (TOTP).'
  }
  if (selectedRole.value.includes('Finance') || selectedRole.value.includes('HR')) {
    return 'Role ini mengelola aset keuangan dan data PII karyawan. Hak ekspor dan persetujuan harus dibatasi secara berkala.'
  }
  return 'Hak akses operasional standar, pembatasan ekspor massal dianjurkan guna mencegah kebocoran data.'
})

const formatModuleName = (mod: string) => {
  const parts = mod.split('/')
  const name = parts[parts.length - 1]
  return name.replace(/_/g, ' ')
}

const isSensitiveModule = (mod: string) => {
  return (
    mod.includes('payroll') ||
    mod.includes('accounting') ||
    mod.includes('permissions') ||
    mod.includes('user_roles') ||
    mod.includes('consolidation') ||
    mod.includes('storage')
  )
}

// Fetch live RBAC configs
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await permissionsService.getAll()
    records.value = Array.isArray(data) ? data : []

    // Fetch dynamic modules list from API using http service
    try {
      const res = await http.get('/core/permissions/modules')
      if (res.data?.data && Array.isArray(res.data.data)) {
        availableModules.value = res.data.data
      }
    } catch (e) {
      // Fallback already pre-filled
    }

    // Fetch dynamic role constants if available
    try {
      const roleRes = await http.get('/core/user_roles/constants')
      if (roleRes.data?.data && Array.isArray(roleRes.data.data)) {
        availableRoles.value = roleRes.data.data
      }
    } catch (e) {}

  } catch (err: any) {
    error.value = 'Gagal memuat data akses: ' + (err.message || '')
  } finally {
    isLoading.value = false
  }
}

// Toggle granular permissions
const handleToggle = async (item: any, action: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const newValue = target.checked

  // Optimistic UI update in local state
  item[`can_${action}`] = newValue

  try {
    await permissionsService.toggle({
      role_name: selectedRole.value,
      module: item.module,
      action: action,
      value: newValue
    })

    // Update records mirror
    const existing = records.value.find(
      r => r.role_name?.toLowerCase() === selectedRole.value.toLowerCase() && r.module === item.module
    )
    if (existing) {
      (existing as any)[`can_${action}`] = newValue
    } else {
      records.value.push({
        role_name: selectedRole.value,
        module: item.module,
        can_read: item.can_read,
        can_write: item.can_write,
        can_delete: item.can_delete,
        can_export: item.can_export,
        can_approve: item.can_approve
      })
    }

    showToast(`Izin '${action.toUpperCase()}' untuk modul ${formatModuleName(item.module)} berhasil diperbarui.`)
  } catch (err) {
    console.error('Toggle failed', err)
    item[`can_${action}`] = !newValue
    target.checked = !newValue
    alert('Gagal mengubah status izin pada server.')
  }
}

// Set all actions for a single module
const setModuleAll = async (mod: any, enabled: boolean) => {
  const actions = ['read', 'write', 'delete', 'export', 'approve']
  actions.forEach(act => {
    mod[`can_${act}`] = enabled
  })

  try {
    for (const act of actions) {
      await permissionsService.toggle({
        role_name: selectedRole.value,
        module: mod.module,
        action: act,
        value: enabled
      })
    }
    showToast(`Semua izin untuk ${formatModuleName(mod.module)} telah di-${enabled ? 'berikan' : 'cabut'}.`)
  } catch (e) {
    showToast('Sebagian perubahan izin gagal disimpan.')
  }
}

// Bulk toggle for current filtered list
const bulkToggle = async (type: 'full' | 'read_only' | 'revoke') => {
  showBulkMenu.value = false
  const targets = filteredModules.value

  for (const item of targets) {
    if (type === 'full') {
      item.can_read = true
      item.can_write = true
      item.can_delete = true
      item.can_export = true
      item.can_approve = true
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'read', value: true })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'write', value: true })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'delete', value: true })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'export', value: true })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'approve', value: true })
    } else if (type === 'read_only') {
      item.can_read = true
      item.can_write = false
      item.can_delete = false
      item.can_export = false
      item.can_approve = false
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'read', value: true })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'write', value: false })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'delete', value: false })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'export', value: false })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'approve', value: false })
    } else if (type === 'revoke') {
      item.can_read = false
      item.can_write = false
      item.can_delete = false
      item.can_export = false
      item.can_approve = false
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'read', value: false })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'write', value: false })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'delete', value: false })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'export', value: false })
      await permissionsService.toggle({ role_name: selectedRole.value, module: item.module, action: 'approve', value: false })
    }
  }

  showToast(`Aksi massal (${type}) selesai diterapkan untuk ${targets.length} modul.`)
}

// Modal open/close & save
const openModal = (mode: 'create') => {
  formData.value = { role_name: selectedRole.value, module: '' }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveData = async () => {
  isSaving.value = true
  try {
    await permissionsService.toggle({
      role_name: formData.value.role_name,
      module: formData.value.module,
      action: 'read',
      value: true
    })
    closeModal()
    showToast(`Akses baru berhasil ditambahkan untuk ${formData.value.role_name}!`)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menambah akses baru. Pastikan format benar.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  if (route.query.role) {
    selectedRole.value = String(route.query.role)
  }
  fetchData()
})
</script>
