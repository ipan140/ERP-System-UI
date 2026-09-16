<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </span>
            Otomatisasi Alur Kerja (Marketing Automation & Drip Engine)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Enterprise: Rancang skenario perjalanan pelanggan otomatis (Customer Journey) berbasis trigger, jeda waktu, dan aksi cerdas.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Buat Alur Otomasi
          </button>
        </div>
      </div>

      <!-- KPI Summary -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Skenario Alur</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }}</h3>
          <p class="mt-1 text-xs text-indigo-600 font-medium">Workflows terkonfigurasi</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Alur Aktif Berjalan</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ activeCount }}</h3>
          <p class="mt-1 text-xs text-emerald-600 font-medium">Merespons lead secara otomatis</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Langkah Aktivitas</p>
          <h3 class="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ activities.length }}</h3>
          <p class="mt-1 text-xs text-blue-600 font-medium">Langkah aksi terhubung</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Gateway Drip</p>
          <h3 class="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">Engine Siap</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">Cron & Drip Dispatcher Aktif</p>
        </div>
      </div>

      <!-- Main Layout: Campaign List & Visual Drip Flow -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Automation Campaign List (7 Cols) -->
        <div class="lg:col-span-7 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Skenario Otomasi</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Pilih skenario untuk melihat & merancang visualisasi alur</p>
            </div>
            <span class="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              {{ records.length }} Alur
            </span>
          </div>
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Skenario</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pemicu (Trigger)</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="isLoading"><td colspan="4" class="px-5 py-8 text-center text-gray-500">Memuat alur otomatisasi...</td></tr>
                <tr v-else-if="error"><td colspan="4" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
                <tr v-else-if="records.length === 0"><td colspan="4" class="px-5 py-8 text-center text-gray-500">Belum ada alur otomasi yang dikonfigurasi.</td></tr>
                <tr
                  v-for="record in records"
                  :key="record.id"
                  @click="selectCampaign(record)"
                  class="cursor-pointer transition hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10"
                  :class="{ 'bg-indigo-50/60 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600': selectedCampaign?.id === record.id }"
                >
                  <td class="px-5 py-4">
                    <p class="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span v-if="selectedCampaign?.id === record.id" class="text-indigo-600 text-xs">▶</span>
                      {{ record.name || `Alur #${record.id}` }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Target: {{ record.target_model || 'Sales Leads' }}</p>
                  </td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      ⚡ {{ record.trigger_type || 'Ketika Lead Dibuat' }}
                    </span>
                  </td>
                  <td class="px-5 py-4" @click.stop>
                    <!-- Quick Toggle Switch Play / Pause -->
                    <button
                      type="button"
                      @click="toggleStatus(record)"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition"
                      :class="[
                        record.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                        record.status === 'Paused' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                        'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                      ]"
                      :title="record.status === 'Active' ? 'Klik untuk Jeda (Pause)' : 'Klik untuk Aktifkan (Play)'"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" :class="record.status === 'Active' ? 'bg-emerald-500 animate-pulse' : record.status === 'Paused' ? 'bg-amber-500' : 'bg-gray-400'"></span>
                      <span>{{ record.status || 'Active' }}</span>
                      <span class="text-[10px] opacity-75">{{ record.status === 'Active' ? '⏸' : '▶' }}</span>
                    </button>
                  </td>
                  <td class="px-5 py-4 text-right" @click.stop>
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        @click="openModal('edit', record)"
                        class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 transition"
                        title="Edit Skenario Alur"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button
                        type="button"
                        @click="deleteRecord(record.id)"
                        class="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 transition"
                        title="Hapus Skenario Alur"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <PaginationBar :pagination="pagination" @change="onPaginationChange" />
        </div>

        <!-- Visual Drip Workflow Flowchart (5 Cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                  <span>🗺️</span> Visualisasi Alur Kerja (Omnichannel Journey)
                </h4>
                <p class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{{ selectedCampaign?.name || 'Pilih Skenario' }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="runSimulation"
                  :disabled="isSimulating || !selectedCampaign?.id"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 transition"
                  title="Simulasikan pergerakan kontak lead menembus alur ini"
                >
                  <span>🚀</span>
                  <span>{{ isSimulating ? 'Memproses...' : 'Uji Simulasi Alur' }}</span>
                </button>
                <button
                  type="button"
                  @click="openActivityModal('create')"
                  class="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                  Tambah Aksi
                </button>
              </div>
            </div>

            <!-- Flow Visualizer -->
            <div class="space-y-4 py-2">
              <!-- Step 1: Trigger Node -->
              <div class="rounded-xl border border-purple-200 bg-purple-50/70 p-3.5 dark:border-purple-800/40 dark:bg-purple-900/20 relative shadow-xs">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow">
                    ⚡
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Pemicu Awal (Trigger)</span>
                    <p class="text-xs font-bold text-gray-900 dark:text-white">
                      {{ selectedCampaign?.trigger_type || 'Ketika Lead Baru Masuk dari Web/Form' }}
                    </p>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Target: {{ selectedCampaign?.target_model || 'Sales Leads' }}</p>
                  </div>
                </div>
              </div>

              <!-- Connecting Line -->
              <div class="flex justify-center -my-2">
                <div class="h-6 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
              </div>

              <!-- Activities in Sequence -->
              <template v-if="filteredActivities.length > 0">
                <div v-for="(act, idx) in filteredActivities" :key="act.id" class="space-y-4">
                  <!-- Delay Node -->
                  <div class="flex items-center justify-center gap-2">
                    <span class="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-xs">
                      <span>⏱</span> Tunggu {{ act.delay_hours || 1 }} Jam
                    </span>
                  </div>

                  <!-- Connecting Line -->
                  <div class="flex justify-center -my-2">
                    <div class="h-6 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                  </div>

                  <!-- Action Card Node with Edit & Delete -->
                  <div class="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 dark:border-indigo-800/40 dark:bg-indigo-900/20 flex justify-between items-center shadow-xs hover:border-indigo-300 transition">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          act.action_type === 'WhatsApp' ? 'bg-emerald-600' :
                          act.action_type === 'SMS' ? 'bg-blue-600' :
                          act.action_type === 'CRM_Task' ? 'bg-amber-600' :
                          act.action_type === 'Notification' ? 'bg-purple-600' : 'bg-indigo-600',
                          'h-9 w-9 rounded-lg text-white flex items-center justify-center font-bold text-sm shadow'
                        ]"
                      >
                        {{ act.action_type === 'Email' ? '✉️' : act.action_type === 'WhatsApp' ? '💬' : act.action_type === 'SMS' ? '📱' : act.action_type === 'CRM_Task' ? '📋' : act.action_type === 'Notification' ? '🔔' : '🌐' }}
                      </div>
                      <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Aksi #{{ idx + 1 }} • {{ act.action_type === 'CRM_Task' ? 'Tugas Sales CRM' : act.action_type || 'Email' }}
                        </span>
                        <p class="text-xs font-bold text-gray-900 dark:text-white">
                          {{ act.activity_name || `Kirim ${act.action_type} Penawaran` }}
                        </p>
                        <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Kondisi: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ act.condition === 'Always' ? 'Selalu Dijalankan' : act.condition === 'Opened' ? 'Hanya Jika Dibuka' : act.condition === 'Clicked' ? 'Hanya Jika Diklik' : 'Jika Tidak Ada Respon' }}</span>
                          <span v-if="act.action_payload" class="block italic text-gray-400 mt-0.5 truncate max-w-xs">"{{ act.action_payload }}"</span>
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        @click="openActivityModal('edit', act)"
                        class="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 transition"
                        title="Edit Langkah Aksi"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button
                        type="button"
                        @click="deleteActivity(act.id)"
                        class="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 transition"
                        title="Hapus Langkah Aksi"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>

                  <!-- Connecting Line -->
                  <div v-if="idx < filteredActivities.length - 1" class="flex justify-center -my-2">
                    <div class="h-6 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                </div>
              </template>

              <!-- Empty state for activities -->
              <template v-else>
                <div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Belum ada langkah aksi yang dikonfigurasi untuk skenario ini.</p>
                  <button
                    type="button"
                    @click="openActivityModal('create')"
                    class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition"
                  >
                    <span>+</span> Tambah Langkah Aksi Pertama
                  </button>
                </div>
              </template>
            </div>

            <!-- Real-time Journey Execution Log (Enterprise Multi-Channel Tracker) -->
            <div class="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
              <div class="flex justify-between items-center mb-3">
                <h5 class="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <span>📊</span> Log Perjalanan Kontak (Omnichannel Trail)
                </h5>
                <span class="text-[11px] text-gray-400">{{ journeyLogs.length }} Aktivitas Terekam</span>
              </div>

              <div v-if="journeyLogs.length > 0" class="max-h-48 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 p-2 space-y-2 custom-scrollbar">
                <div
                  v-for="log in journeyLogs"
                  :key="log.id"
                  class="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs shadow-2xs"
                >
                  <div class="flex items-center gap-2.5">
                    <span class="text-sm">{{ log.channel === 'WhatsApp' ? '💬' : log.channel === 'SMS' ? '📱' : log.channel === 'CRM_Task' ? '📋' : '✉️' }}</span>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ log.lead_name }}</p>
                      <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ log.action_name }} • {{ log.lead_contact }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/40">
                      ✓ {{ log.status || 'Terkirim' }}
                    </span>
                    <p class="text-[9px] text-gray-400 mt-0.5">{{ log.executed_at || 'Baru saja' }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center text-xs text-gray-400">
                Klik "Uji Simulasi Alur" di atas untuk melihat pelacakan interaksi lead secara langsung.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tambah/Edit Kampanye Otomasi -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚡</span> {{ modalMode === 'create' ? 'Buat Skenario Alur Otomasi' : 'Edit Skenario Alur Otomasi' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
  
        <form @submit.prevent="saveRecord" class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Skenario Alur</label>
            <input v-model="formData.name" type="text" placeholder="Misal: Onboarding Prospek Baru Website" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
  
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Pemicu Awal (Trigger)</label>
            <select v-model="formData.trigger_type" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="Ketika Lead Baru Masuk dari Form Web">Ketika Lead Baru Masuk dari Form Web</option>
              <option value="Ketika Faktur Invoice Lunas (Won Deal)">Ketika Faktur Invoice Lunas (Won Deal)</option>
              <option value="Ketika Tiket Acara Terdaftar">Ketika Tiket Acara Terdaftar</option>
              <option value="Ketika Responden Mengisi Survei">Ketika Responden Mengisi Survei</option>
            </select>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status Alur</label>
              <select v-model="formData.status" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Active">Active (Aktif)</option>
                <option value="Paused">Paused (Ditunda)</option>
                <option value="Draft">Draft (Konsep)</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Entitas Target</label>
              <select v-model="formData.target_model" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Sales Leads">Sales Leads (CRM)</option>
                <option value="Pelanggan VIP">Pelanggan VIP</option>
                <option value="Peserta Acara">Peserta Acara</option>
              </select>
            </div>
          </div>
  
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Alur Otomasi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Tambah/Edit Aktivitas Aksi Workflow -->
  <Teleport to="body">
    <div v-if="isActivityModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> {{ activityModalMode === 'create' ? 'Tambah Langkah Aksi Workflow' : 'Edit Langkah Aksi Workflow' }}
          </h3>
          <button @click="isActivityModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
  
        <form @submit.prevent="saveActivity" class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Aktivitas Aksi</label>
            <input v-model="activityFormData.activity_name" type="text" placeholder="Misal: Kirim Email Penawaran Diskon 20%" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Kanal & Tipe Aksi</label>
              <select v-model="activityFormData.action_type" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Email">✉️ Email Otomatis</option>
                <option value="WhatsApp">💬 WhatsApp Bisnis (WABA)</option>
                <option value="SMS">📱 SMS GSM Langsung</option>
                <option value="CRM_Task">📋 Buat Tugas Sales (CRM Task)</option>
                <option value="Notification">🔔 Notifikasi Internal ERP</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Jeda Waktu (Jam)</label>
              <input v-model.number="activityFormData.delay_hours" type="number" min="0" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Instruksi / Pesan Aksi</label>
            <textarea
              v-model="activityFormData.action_payload"
              rows="2"
              :placeholder="activityFormData.action_type === 'CRM_Task' ? 'Misal: Telepon prospek untuk konfirmasi kebutuhan demo' : 'Misal: Halo {{name}}, terima kasih telah mendaftar...'"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
  
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Kondisi Eksekusi</label>
            <select v-model="activityFormData.condition" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="Always">Selalu Dijalankan (Unconditional)</option>
              <option value="Opened">Hanya Jika Email/Pesan Dibuka</option>
              <option value="Clicked">Hanya Jika Tautan Diklik</option>
              <option value="Not_Replied">Jika Belum Merespon (Follow-up)</option>
            </select>
          </div>
  
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="isActivityModalOpen = false" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : (activityModalMode === 'create' ? 'Simpan Langkah Aksi' : 'Perbarui Langkah Aksi') }}
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
import PaginationBar from '@/components/common/PaginationBar.vue'
import { marketingAutomationService } from '@/services/marketing/automation.service'
import type { IAutomationCampaignDto, IWorkflowActivityDto } from '@/types/marketing/marketing_automation.dto'
import type { IPaginationMeta } from '@/types'

const records = ref<IAutomationCampaignDto[]>([])
const activities = ref<IWorkflowActivityDto[]>([])
const selectedCampaign = ref<IAutomationCampaignDto | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const onPaginationChange = (payload: { page: number; limit: number }) => {
  pagination.value.current_page = payload.page
  pagination.value.per_page = payload.limit
  fetchData()
}

// Modal Kampanye
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<{
  id: number | null
  name: string
  trigger_type: string
  status: 'Active' | 'Paused' | 'Draft'
  target_model: string
}>({
  id: null,
  name: '',
  trigger_type: 'Ketika Lead Baru Masuk dari Form Web',
  status: 'Active',
  target_model: 'Sales Leads'
})

// Modal Aktivitas
const isActivityModalOpen = ref(false)
const activityModalMode = ref<'create' | 'edit'>('create')
const journeyLogs = ref<any[]>([])
const isSimulating = ref(false)

const activityFormData = ref<{
  id: number | null
  campaign_id: number | null
  activity_name: string
  action_type: any
  channel: string
  action_payload: string
  delay_hours: number
  condition: any
}>({
  id: null,
  campaign_id: null,
  activity_name: '',
  action_type: 'Email',
  channel: 'Email',
  action_payload: '',
  delay_hours: 24,
  condition: 'Always'
})

const fetchJourneyLogs = async () => {
  if (!selectedCampaign.value?.id) return
  try {
    const data = await marketingAutomationService.getJourneyLogs(selectedCampaign.value.id)
    journeyLogs.value = data || []
  } catch (e) {
    journeyLogs.value = []
  }
}

const runSimulation = async () => {
  if (!selectedCampaign.value?.id) return
  isSimulating.value = true
  try {
    const res = await marketingAutomationService.simulateJourney(selectedCampaign.value.id)
    journeyLogs.value = res || []
  } catch (err: any) {
    alert('Gagal menjalankan simulasi: ' + (err.response?.data?.message || err.message))
  } finally {
    isSimulating.value = false
  }
}

// Computations
const activeCount = computed(() => records.value.filter(r => r.status === 'Active').length)
const filteredActivities = computed(() => {
  if (!selectedCampaign.value?.id) return activities.value
  return activities.value.filter(a => a.campaign_id === selectedCampaign.value?.id)
})

const selectCampaign = (campaign: IAutomationCampaignDto) => {
  selectedCampaign.value = campaign
  fetchJourneyLogs()
}

const toggleStatus = async (record: IAutomationCampaignDto) => {
  if (!record.id) return
  const newStatus = record.status === 'Active' ? 'Paused' : 'Active'
  try {
    await marketingAutomationService.update(record.id, {
      ...record,
      status: newStatus
    })
    record.status = newStatus
  } catch (err: any) {
    alert('Gagal mengubah status: ' + (err.response?.data?.message || err.message))
  }
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [campsRes, acts] = await Promise.all([
      marketingAutomationService.getAll({ page: pagination.value.current_page, limit: pagination.value.per_page }),
      marketingAutomationService.getAllActivities()
    ])
    if (campsRes && typeof campsRes === 'object' && 'data' in campsRes && Array.isArray((campsRes as any).data)) {
      records.value = (campsRes as any).data
      if ((campsRes as any).pagination) {
        pagination.value = (campsRes as any).pagination
      }
    } else if (Array.isArray(campsRes)) {
      records.value = campsRes
    }
    activities.value = acts || []
    if (records.value.length > 0) {
      if (!selectedCampaign.value || !records.value.some(r => r.id === selectedCampaign.value?.id)) {
        selectedCampaign.value = records.value[0]
      }
      await fetchJourneyLogs()
    } else {
      selectedCampaign.value = null
      journeyLogs.value = []
    }
  } catch (err: any) {
    error.value = 'Gagal memuat alur: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: IAutomationCampaignDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id || null,
      name: data.name || '',
      trigger_type: data.trigger_type || 'Ketika Lead Baru Masuk dari Form Web',
      status: data.status || 'Active',
      target_model: data.target_model || 'Sales Leads'
    }
  } else {
    formData.value = {
      id: null,
      name: '',
      trigger_type: 'Ketika Lead Baru Masuk dari Form Web',
      status: 'Active',
      target_model: 'Sales Leads'
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
    if (modalMode.value === 'edit' && formData.value.id) {
      await marketingAutomationService.update(formData.value.id, formData.value)
    } else {
      await marketingAutomationService.create(formData.value)
    }
    closeModal()
    await fetchData()
  } catch (err: any) {
    alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus skenario alur ini?')) return
  try {
    await marketingAutomationService.delete(id)
    if (selectedCampaign.value?.id === id) {
      selectedCampaign.value = null
    }
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

const openActivityModal = (mode: 'create' | 'edit' = 'create', data: IWorkflowActivityDto | null = null) => {
  activityModalMode.value = mode
  if (!selectedCampaign.value?.id && records.value.length > 0) {
    selectedCampaign.value = records.value[0]
  }

  if (mode === 'edit' && data) {
    activityFormData.value = {
      id: data.id || null,
      campaign_id: data.campaign_id || selectedCampaign.value?.id || null,
      activity_name: data.activity_name || '',
      action_type: data.action_type || 'Email',
      channel: (data.channel as any) || 'Email',
      action_payload: data.action_payload || '',
      delay_hours: data.delay_hours || 1,
      condition: data.condition || 'Always'
    }
  } else {
    activityFormData.value = {
      id: null,
      campaign_id: selectedCampaign.value?.id || null,
      activity_name: '',
      action_type: 'Email',
      channel: 'Email',
      action_payload: '',
      delay_hours: 24,
      condition: 'Always'
    }
  }
  isActivityModalOpen.value = true
}

const saveActivity = async () => {
  activityFormData.value.channel = activityFormData.value.action_type
  if (!activityFormData.value.campaign_id) {
    alert('Silakan pilih skenario alur otomasi terlebih dahulu.')
    return
  }
  isSaving.value = true
  try {
    if (activityModalMode.value === 'edit' && activityFormData.value.id) {
      await marketingAutomationService.updateActivity(activityFormData.value.id, activityFormData.value)
    } else {
      await marketingAutomationService.createActivity(activityFormData.value)
    }
    isActivityModalOpen.value = false
    await fetchData()
  } catch (err: any) {
    alert('Gagal menyimpan aktivitas: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteActivity = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus langkah aksi ini?')) return
  try {
    await marketingAutomationService.deleteActivity(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus aksi: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchData()
})
</script>
