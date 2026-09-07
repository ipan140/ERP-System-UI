<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              🎯
            </span>
            CRM Pipeline & Kanban Deals Board
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo Enterprise & HubSpot: Pipeline Kanban multi-tahap (Drag & Drop), Skor AI (Hot/Warm/Cold), dan Atribusi Referral Mitra Afiliasi.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- View Toggle: List vs Kanban -->
          <div class="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800 text-xs font-semibold">
            <button
              @click="activeView = 'kanban'"
              :class="activeView === 'kanban' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
              class="rounded-md px-3 py-1.5 transition flex items-center gap-1.5"
            >
              📊 Kanban Board
            </button>
            <button
              @click="activeView = 'table'"
              :class="activeView === 'table' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
              class="rounded-md px-3 py-1.5 transition flex items-center gap-1.5"
            >
              📋 Tabel Prospek
            </button>
          </div>

          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openStageModal" class="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3.5 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/60 transition shadow-theme-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Tahap
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Prospek Baru
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Pipeline Leads</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }} Prospek</h3>
          <p class="mt-1 text-xs text-blue-600 font-medium">Dalam penanganan sales</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Hot Leads (Siap Beli 🔥)</p>
          <h3 class="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{{ hotLeadsCount }}</h3>
          <p class="mt-1 text-xs text-rose-600 font-medium">Skor >= 75 Poin (Prioritas)</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Prospek Afiliasi</p>
          <h3 class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ affiliateCount }} Mitra</h3>
          <p class="mt-1 text-xs text-amber-600 font-medium">Melalui kode referral</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Potensi Nilai Penjualan</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatCurrency(totalRevenue) }}</h3>
          <p class="mt-1 text-xs text-emerald-600 font-medium">Expected revenue total</p>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- VIEW 1: KANBAN BOARD (ODODO PIPELINE VIEW)                               -->
      <!-- ========================================================================= -->
      <div v-if="activeView === 'kanban'" class="space-y-4">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>💡 Tarik & letakkan (Drag & Drop) atau klik panah untuk memindahkan prospek antar tahapan penjualan.</span>
          <span class="font-medium text-emerald-600 dark:text-emerald-400">Weighted Pipeline Terhitung Realtime</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 items-start pb-4">
          <div
            v-for="(stage, idx) in stages"
            :key="stage.id"
            class="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-800/40 p-3.5 flex flex-col min-h-[500px]"
            @dragover.prevent
            @drop="onDropStage(stage.id)"
          >
            <!-- Stage Header -->
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :class="stage.dotColor || 'bg-blue-500'"></span>
                <h4 class="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">{{ stage.name }}</h4>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  {{ getLeadsByStage(stage.id).length }}
                </span>
                <button
                  v-if="stages.length > 1"
                  @click="deleteStageItem(stage.id)"
                  class="text-gray-400 hover:text-rose-500 text-xs p-0.5 rounded transition"
                  title="Hapus Tahapan Ini"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Stage Revenue Total -->
            <div class="mb-3 px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 text-[11px] flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Total Nilai:</span>
              <span class="font-bold font-mono text-gray-900 dark:text-white">
                Rp {{ formatCurrency(getStageRevenue(stage.id)) }}
              </span>
            </div>

            <!-- Lead Cards Container -->
            <div class="space-y-3 flex-1">
              <div
                v-for="lead in getLeadsByStage(stage.id)"
                :key="lead.id"
                draggable="true"
                @dragstart="onDragStart(lead)"
                class="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing dark:border-gray-700 dark:bg-gray-800 relative group"
              >
                <!-- Card Header -->
                <div class="flex items-start justify-between gap-2">
                  <h5 class="font-bold text-xs text-gray-900 dark:text-white line-clamp-2">{{ lead.name || (lead as any).lead_name || 'Tanpa Judul' }}</h5>
                  <span
                    :class="[
                      (lead.lead_score || 0) >= 75 ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' :
                      (lead.lead_score || 0) >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' :
                      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
                      'text-[10px] px-1.5 py-0.5 rounded font-bold border shrink-0'
                    ]"
                  >
                    {{ lead.score_grade || ((lead.lead_score || 0) >= 75 ? 'Hot 🔥' : (lead.lead_score || 0) >= 40 ? 'Warm ⚡' : 'Cold ❄️') }}
                  </span>
                </div>

                <!-- Customer / Partner Badge if exists -->
                <div v-if="lead.partner || lead.partner_name" class="mt-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                  🏢 {{ lead.partner?.name || lead.partner_name }}
                </div>

                <!-- Contact Info -->
                <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {{ lead.email || '-' }} <span v-if="lead.phone">• {{ lead.phone }}</span>
                </p>

                <!-- Value & Attribution -->
                <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <div class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {{ formatCurrency(lead.expected_revenue) }}
                  </div>
                  <span v-if="lead.referral_code || lead.affiliate_name" class="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.2 rounded truncate max-w-[90px]">
                    🤝 {{ lead.affiliate_name || lead.referral_code }}
                  </span>
                </div>

                <!-- FASE 4: Auto Round-Robin & Territory Badge -->
                <div class="mt-2 flex items-center justify-between text-[10px] bg-gray-50 dark:bg-gray-700/40 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                  <span class="text-gray-500 dark:text-gray-400 font-medium">📍 {{ lead.territory || 'Jakarta' }}</span>
                  <span class="font-bold text-brand-600 dark:text-brand-400 truncate max-w-[120px]" :title="lead.assigned_salesperson_name">
                    👤 {{ lead.assigned_salesperson_name || 'Round-Robin' }}
                  </span>
                </div>

                <!-- Quick Stage Advance / Actions Buttons -->
                <div class="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-1">
                  <div class="flex items-center gap-2">
                    <button
                      @click="openModal('edit', lead)"
                      class="text-[11px] text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 font-medium inline-flex items-center gap-0.5"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      @click="deleteRecord(lead.id)"
                      class="text-[11px] text-gray-400 hover:text-rose-500 transition font-medium inline-flex items-center gap-0.5"
                      title="Hapus Prospek"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      v-if="idx > 0"
                      @click="moveStage(lead, stages[idx - 1].id)"
                      title="Pindahkan ke tahapan sebelumnya"
                      class="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition"
                    >
                      ◀
                    </button>
                    <button
                      v-if="idx < stages.length - 1"
                      @click="moveStage(lead, stages[idx + 1].id)"
                      title="Majukan ke tahapan berikutnya"
                      class="px-1.5 py-0.5 text-[10px] rounded bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/40 dark:hover:bg-brand-900/60 text-brand-600 dark:text-brand-400 font-bold transition"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="getLeadsByStage(stage.id).length === 0" class="h-28 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-400">
                Kosong
              </div>
            </div>
          </div>

          <!-- Add Stage Column Button directly in Kanban -->
          <div class="w-72 shrink-0 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 flex flex-col items-center justify-center min-h-[200px] text-center hover:border-brand-500 transition bg-white/40 dark:bg-gray-800/20">
            <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Butuh tahapan penjualan kustom?</p>
            <button
              @click="openStageModal"
              class="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            >
              ➕ Tambah Tahap Pipeline
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- VIEW 2: TRADITIONAL DATA TABLE                                            -->
      <!-- ========================================================================= -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Prospek Penjualan & Kualifikasi</h3>
          <span class="text-xs text-gray-500 dark:text-gray-400">Skor dihitung otomatis dari firmografis & sumber</span>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Prospek / Kontak</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Wilayah & Salesperson</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Skor AI (Lead Score)</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sumber / Afiliasi</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ekspektasi Revenue</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tahapan Pipeline</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading"><td colspan="7" class="px-5 py-8 text-center text-gray-500">Memuat data pipeline...</td></tr>
              <tr v-else-if="error"><td colspan="7" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
              <tr v-else-if="records.length === 0"><td colspan="7" class="px-5 py-8 text-center text-gray-500">Belum ada data prospek.</td></tr>
              <tr v-for="record in records" :key="record.id" class="transition hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                <td class="px-5 py-4">
                  <p class="font-bold text-gray-900 dark:text-white capitalize">{{ record.name || (record as any).lead_name || '-' }}</p>
                  <p v-if="record.partner" class="text-xs font-semibold text-brand-600 dark:text-brand-400">🏢 {{ record.partner.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ record.email || '-' }} <span v-if="record.phone">• {{ record.phone }}</span>
                  </p>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="text-xs font-bold text-gray-800 dark:text-gray-200">
                    📍 {{ record.territory || 'Jakarta' }}
                  </div>
                  <div class="text-[11px] text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                    👤 {{ record.assigned_salesperson_name || 'Round-Robin' }}
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        (record.lead_score || 0) >= 75 ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' :
                        (record.lead_score || 0) >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border'
                      ]"
                    >
                      <span>{{ record.score_grade || ((record.lead_score || 0) >= 75 ? 'Hot 🔥' : (record.lead_score || 0) >= 40 ? 'Warm ⚡' : 'Cold ❄️') }}</span>
                      <span class="opacity-75">({{ record.lead_score || 0 }} Pts)</span>
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div v-if="record.referral_code || record.affiliate_name" class="text-xs">
                    <span class="inline-flex items-center gap-1 rounded bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 font-bold">
                      🤝 {{ record.affiliate_name || record.referral_code }}
                    </span>
                  </div>
                  <div v-else class="text-xs text-gray-500 capitalize">
                    {{ record.utm_source || 'Organik' }}
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap font-mono font-bold text-sm text-gray-900 dark:text-white">
                  Rp {{ formatCurrency(record.expected_revenue) }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStageById(record.stage_id)?.dotColor || 'bg-gray-400'"></span>
                    {{ getStageById(record.stage_id)?.name || 'Prospek Baru' }}
                  </span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-right text-xs">
                  <button @click="openModal('edit', record)" class="text-brand-500 hover:text-brand-600 font-semibold mr-3">Edit</button>
                  <button @click="deleteRecord(record.id)" class="text-red-500 hover:text-red-600 font-semibold">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Form Lead -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Prospek Pipeline Baru' : 'Ubah Data Prospek' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <form @submit.prevent="saveRecord" class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Peluang / Judul Prospek *</label>
            <input v-model="formData.name" type="text" placeholder="Misal: Pengadaan Server Cloud PT ABC" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <!-- Pelanggan / Partner Picker (Live Database + Add Button) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Pelanggan / Klien Terdaftar</label>
              <button type="button" @click="openPartnerModal" class="text-[11px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                + Tambah Klien Baru
              </button>
            </div>
            <div class="relative">
              <select v-model="formData.partner_id" @change="onPartnerSelected" class="w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-700 pl-3 pr-9 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:text-white">
                <option :value="null">-- Bukan Klien Terdaftar / Prospek Mandiri --</option>
                <option v-for="ptn in partners" :key="ptn.id" :value="ptn.id">
                  {{ ptn.name }} ({{ ptn.email || ptn.phone || 'Terdaftar' }})
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 dark:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Email Kontak</label>
              <input v-model="formData.email" type="email" placeholder="kontak@perusahaan.com" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nomor Telepon / WA</label>
              <input v-model="formData.phone" type="text" placeholder="+62 812-xxxx-xxxx" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Tahapan Pipeline</label>
              <div class="relative">
                <select v-model.number="formData.stage_id" class="w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-700 pl-3 pr-9 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:text-white">
                  <option v-for="stg in stages" :key="stg.id" :value="stg.id">{{ stg.name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 dark:text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Wilayah / Territory</label>
                <button type="button" @click="openTerritoryModal" class="text-[11px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                  ⚙️ Kelola Wilayah
                </button>
              </div>
              <div class="relative">
                <select v-model="formData.territory" class="w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-700 pl-3 pr-9 py-2 text-sm font-semibold focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:text-white">
                  <option v-for="t in territories" :key="t" :value="t">{{ t }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 dark:text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Sumber Saluran (UTM)</label>
              <div class="relative">
                <select v-model="formData.utm_source" class="w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-700 pl-3 pr-9 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:text-white">
                  <option value="organik">Organik / Langsung</option>
                  <option value="wa_blast">WhatsApp Broadcast</option>
                  <option value="meta">Meta Ads (FB/IG)</option>
                  <option value="google">Google Ads</option>
                  <option value="affiliate">Mitra Afiliasi</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 dark:text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Ekspektasi Pendapatan (Rp) *</label>
              <input v-model.number="formData.expected_revenue" type="number" min="0" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="p-3.5 bg-purple-50/70 border border-purple-200 dark:bg-purple-950/30 dark:border-purple-800 rounded-xl space-y-3">
            <h4 class="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🤝</span> Kemitraan & Afiliasi (Referral Attribution)
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Kode Referral Afiliasi</label>
                <input v-model="formData.referral_code" type="text" placeholder="Misal: REF-PARTNER-88" class="w-full rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs focus:border-purple-500 focus:outline-none dark:border-purple-800 dark:bg-gray-800 dark:text-white" />
              </div>
              <div>
                <label class="mb-1 block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Nama Mitra Afiliasi</label>
                <input v-model="formData.affiliate_name" type="text" placeholder="Misal: PT Solusi Digital" class="w-full rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs focus:border-purple-500 focus:outline-none dark:border-purple-800 dark:bg-gray-800 dark:text-white" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : 'Simpan & Kalkulasi Skor' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal CRUD Wilayah / Territory -->
  <Teleport to="body">
    <div v-if="isTerritoryModalOpen" class="fixed inset-0 z-[100001] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📍</span> Kelola Master Wilayah / Territory
          </h3>
          <button @click="isTerritoryModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Tambahkan kota atau hapus wilayah operasional penjualan untuk sistem alokasi otomatis (Round-Robin).
        </p>

        <!-- Form Tambah Territory -->
        <div class="flex gap-2 mb-4">
          <input
            v-model="newTerritoryInput"
            type="text"
            placeholder="Tambah kota / wilayah baru..."
            @keyup.enter="addTerritoryItem"
            class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            @click="addTerritoryItem"
            class="rounded-lg bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition shadow-sm"
          >
            + Tambah
          </button>
        </div>

        <!-- Daftar Territory List with Delete -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
          <div
            v-for="item in territories"
            :key="item"
            class="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-sm"
          >
            <div class="flex items-center gap-2">
              <span class="text-gray-400">📍</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ item }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                v-if="territories.length > 1"
                @click="removeTerritoryItem(item)"
                class="text-xs text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded transition"
                title="Hapus Wilayah"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            @click="isTerritoryModalOpen = false"
            class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal Quick Create Stage -->
  <Teleport to="body">
    <div v-if="isStageModalOpen" class="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎯</span> Tambah Tahap Pipeline Baru
          </h3>
          <button @click="isStageModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <form @submit.prevent="createStageItem" class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Tahap *</label>
            <input
              v-model="newStageName"
              type="text"
              placeholder="Contoh: Demo Produk, Due Diligence, dsb"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="isStageModalOpen = false" class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isCreatingStage" class="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50">
              {{ isCreatingStage ? 'Membuat...' : '+ Tambah Tahap' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Quick Create Customer/Partner -->
  <Teleport to="body">
    <div v-if="isPartnerModalOpen" class="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🏢</span> Tambah Klien / Pelanggan Baru
          </h3>
          <button @click="isPartnerModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <form @submit.prevent="createPartnerItem" class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Perusahaan / Pelanggan *</label>
            <input
              v-model="newPartnerName"
              type="text"
              placeholder="Misal: PT Solusi Sejahtera Nusantara"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="newPartnerEmail"
              type="email"
              placeholder="contact@perusahaan.com"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nomor Telepon</label>
            <input
              v-model="newPartnerPhone"
              type="text"
              placeholder="+62 21 xxxx-xxxx"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="isPartnerModalOpen = false" class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isCreatingPartner" class="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50">
              {{ isCreatingPartner ? 'Menyimpan...' : '+ Simpan Klien' }}
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
import { crmService } from '@/services/sales/crm.service'

const activeView = ref<'kanban' | 'table'>('kanban')
const records = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Pipeline Stages Standard Odoo Enterprise (Dynamic)
const defaultStages = [
  { id: 1, name: 'Prospek Baru', dotColor: 'bg-blue-500' },
  { id: 2, name: 'Kualifikasi', dotColor: 'bg-indigo-500' },
  { id: 3, name: 'Proposal / SPH', dotColor: 'bg-amber-500' },
  { id: 4, name: 'Negosiasi', dotColor: 'bg-purple-500' },
  { id: 5, name: 'Menang (Won)', dotColor: 'bg-emerald-500' },
]

const stageColorPalette = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500'
]

const stages = ref<any[]>([...defaultStages])
const partners = ref<any[]>([])

// Quick Stage creation modal state
const isStageModalOpen = ref(false)
const newStageName = ref('')
const isCreatingStage = ref(false)

// Quick Partner creation modal state
const isPartnerModalOpen = ref(false)
const newPartnerName = ref('')
const newPartnerEmail = ref('')
const newPartnerPhone = ref('')
const isCreatingPartner = ref(false)

// Territory Management state & CRUD (persisted to localStorage)
const defaultTerritories = [
  'Jakarta',
  'Surabaya',
  'Medan',
  'Bandung',
  'Bali',
  'Semarang',
  'Makassar'
]

const loadSavedTerritories = (): string[] => {
  try {
    const saved = localStorage.getItem('erp_crm_territories')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error loading saved territories:', e)
  }
  return [...defaultTerritories]
}

const territories = ref<string[]>(loadSavedTerritories())
const newTerritoryInput = ref('')
const isTerritoryModalOpen = ref(false)

const saveTerritoriesToStorage = () => {
  try {
    localStorage.setItem('erp_crm_territories', JSON.stringify(territories.value))
  } catch (e) {
    console.error('Error saving territories to localStorage:', e)
  }
}

const openTerritoryModal = () => {
  newTerritoryInput.value = ''
  isTerritoryModalOpen.value = true
}

const addTerritoryItem = () => {
  const val = newTerritoryInput.value.trim()
  if (!val) return
  if (!territories.value.includes(val)) {
    territories.value.push(val)
    saveTerritoriesToStorage()
  }
  formData.value.territory = val
  newTerritoryInput.value = ''
}

const removeTerritoryItem = (item: string) => {
  if (territories.value.length <= 1) {
    alert('Minimal harus ada 1 wilayah tersisa.')
    return
  }
  if (!confirm(`Hapus wilayah "${item}" dari daftar pilihan?`)) return
  territories.value = territories.value.filter(t => t !== item)
  saveTerritoriesToStorage()
  if (formData.value.territory === item) {
    formData.value.territory = territories.value[0] || 'Jakarta'
  }
}

const draggedLead = ref<any>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref({
  id: null as number | null,
  name: '',
  partner_id: null as number | null,
  email: '',
  phone: '',
  expected_revenue: 0,
  stage_id: 1,
  utm_source: 'organik',
  territory: 'Jakarta',
  referral_code: '',
  affiliate_name: ''
})

const hotLeadsCount = computed(() => records.value.filter(r => (r.lead_score || 0) >= 75).length)
const affiliateCount = computed(() => records.value.filter(r => r.referral_code || r.affiliate_name).length)
const totalRevenue = computed(() => records.value.reduce((acc, curr) => acc + Math.round(Number(curr.expected_revenue) || 0), 0))

const formatCurrency = (val: number | string) => {
  const num = Math.round(Number(val) || 0)
  return num.toLocaleString('id-ID')
}

const getStageById = (id?: number) => {
  return stages.value.find(s => s.id === (id || 1)) || stages.value[0] || { id: 1, name: 'Tahap', dotColor: 'bg-blue-500' }
}

const getLeadsByStage = (stageId: number) => {
  return records.value.filter(r => (r.stage_id || 1) === stageId)
}

const getStageRevenue = (stageId: number) => {
  return getLeadsByStage(stageId).reduce((sum, item) => sum + Math.round(Number(item.expected_revenue) || 0), 0)
}

// Drag and drop handlers
const onDragStart = (lead: any) => {
  draggedLead.value = lead
}

const onDropStage = async (newStageId: number) => {
  if (!draggedLead.value || (draggedLead.value.stage_id || 1) === newStageId) return
  const lead = draggedLead.value
  draggedLead.value = null
  await moveStage(lead, newStageId)
}

const moveStage = async (lead: any, newStageId: number) => {
  const prevStage = lead.stage_id || 1
  lead.stage_id = newStageId
  try {
    await crmService.update(lead.id, {
      ...lead,
      stage_id: newStageId
    })
  } catch (err: any) {
    lead.stage_id = prevStage
    alert('Gagal memindahkan tahapan pipeline: ' + (err.response?.data?.message || err.message))
  }
}

const onPartnerSelected = () => {
  if (!formData.value.partner_id) return
  const partner = partners.value.find(p => p.id === formData.value.partner_id)
  if (partner) {
    if (!formData.value.name || formData.value.name.trim() === '') {
      formData.value.name = `Prospek - ${partner.name}`
    }
    if (!formData.value.email && partner.email) {
      formData.value.email = partner.email
    }
    if (!formData.value.phone && (partner.phone || partner.mobile)) {
      formData.value.phone = partner.phone || partner.mobile
    }
  }
}


const openStageModal = () => {
  newStageName.value = ''
  isStageModalOpen.value = true
}

const createStageItem = async () => {
  if (!newStageName.value.trim()) return
  isCreatingStage.value = true
  try {
    const res = await crmService.createStage({
      name: newStageName.value.trim(),
      sequence: (stages.value.length + 1) * 10
    })
    const color = stageColorPalette[stages.value.length % stageColorPalette.length]
    stages.value.push({
      id: res.id,
      name: res.name,
      dotColor: color
    })
    // Auto-select in form if modal open
    if (isModalOpen.value) {
      formData.value.stage_id = res.id
    }
    isStageModalOpen.value = false
    newStageName.value = ''
  } catch (err: any) {
    alert('Gagal membuat tahap pipeline: ' + (err.response?.data?.message || err.message))
  } finally {
    isCreatingStage.value = false
  }
}

const deleteStageItem = async (stageId: number) => {
  const leadsInStage = getLeadsByStage(stageId)
  if (leadsInStage.length > 0) {
    alert(`Tidak dapat menghapus tahapan ini karena masih ada ${leadsInStage.length} prospek di dalamnya. Silakan pindahkan prospek terlebih dahulu.`)
    return
  }
  if (!confirm('Apakah Anda yakin ingin menghapus tahapan pipeline ini?')) return
  try {
    await crmService.deleteStage(stageId)
    stages.value = stages.value.filter(s => s.id !== stageId)
  } catch (err: any) {
    // If backend doesn't have it or fails, also remove from UI
    stages.value = stages.value.filter(s => s.id !== stageId)
  }
}

const openPartnerModal = () => {
  newPartnerName.value = ''
  newPartnerEmail.value = ''
  newPartnerPhone.value = ''
  isPartnerModalOpen.value = true
}

const createPartnerItem = async () => {
  if (!newPartnerName.value.trim()) return
  isCreatingPartner.value = true
  try {
    const res = await crmService.createPartner({
      name: newPartnerName.value.trim(),
      email: newPartnerEmail.value.trim(),
      phone: newPartnerPhone.value.trim(),
      is_customer: true
    })
    partners.value.push(res)
    formData.value.partner_id = res.id
    formData.value.name = formData.value.name || `Peluang ${res.name}`
    formData.value.email = formData.value.email || res.email
    formData.value.phone = formData.value.phone || res.phone
    isPartnerModalOpen.value = false
  } catch (err: any) {
    alert('Gagal menambah klien: ' + (err.response?.data?.message || err.message))
  } finally {
    isCreatingPartner.value = false
  }
}

const fetchStagesAndPartners = async () => {
  try {
    const stageData = await crmService.getStages()
    if (stageData && stageData.length > 0) {
      stages.value = stageData.map((stg: any, index: number) => ({
        ...stg,
        dotColor: stageColorPalette[index % stageColorPalette.length]
      }))
    }
  } catch (e) {
    console.warn('Using default pipeline stages:', e)
  }

  try {
    const partnerData = await crmService.getPartners()
    if (partnerData) {
      partners.value = partnerData
    }
  } catch (e) {
    console.warn('Could not load partners:', e)
  }
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await crmService.getAll()
    records.value = (data || []).map((r: any) => ({
      ...r,
      stage_id: r.stage_id || 1
    }))
  } catch (err: any) {
    error.value = 'Gagal memuat pipeline: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    if (data.territory && !territories.value.includes(data.territory)) {
      territories.value.push(data.territory)
    }
    formData.value = {
      id: data.id,
      name: data.name || data.lead_name || '',
      partner_id: data.partner_id || null,
      email: data.email || '',
      phone: data.phone || '',
      expected_revenue: data.expected_revenue || 0,
      stage_id: data.stage_id || 1,
      utm_source: data.utm_source || 'organik',
      territory: data.territory || 'Jakarta',
      referral_code: data.referral_code || '',
      affiliate_name: data.affiliate_name || ''
    }
  } else {
    formData.value = {
      id: null,
      name: '',
      partner_id: null,
      email: '',
      phone: '',
      expected_revenue: 0,
      stage_id: stages.value[0]?.id || 1,
      utm_source: 'organik',
      territory: 'Jakarta',
      referral_code: '',
      affiliate_name: ''
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
      await crmService.update(formData.value.id, formData.value)
    } else {
      await crmService.create(formData.value)
    }
    closeModal()
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus data prospek ini?')) return
  try {
    await crmService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(async () => {
  await fetchStagesAndPartners()
  await fetchData()
})
</script>
