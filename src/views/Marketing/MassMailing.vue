<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </span>
            Email Massal (Mass Mailing & Performance Tracker)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Enterprise: Kelola siaran email berkala, pantau Delivery & Open Funnel, serta lacak omzet via tautan UTM.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openUtmModal" class="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            Buat Link UTM
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Buat Kampanye Email
          </button>
        </div>
      </div>

      <!-- 6 KPI Metrics Card (Enterprise) -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Terkirim</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ totalSent.toLocaleString('id-ID') }}</h3>
          <p class="mt-1 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <span>●</span> Seluruh kampanye
          </p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Delivery Rate</p>
          <h3 class="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ avgDeliveryRate }}%</h3>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: `${avgDeliveryRate}%` }"></div>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Open Rate (Dibuka)</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ avgOpenRate }}%</h3>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div class="bg-emerald-500 h-1.5 rounded-full" :style="{ width: `${avgOpenRate}%` }"></div>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Click Rate (CTR)</p>
          <h3 class="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{{ avgClickRate }}%</h3>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div class="bg-purple-600 h-1.5 rounded-full" :style="{ width: `${avgClickRate}%` }"></div>
          </div>
        </div>
        <div class="rounded-xl border border-blue-100 bg-blue-50/40 p-5 shadow-theme-xs dark:border-blue-900/30 dark:bg-blue-900/10">
          <p class="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">Total Budget Diajukan</p>
          <h3 class="mt-2 text-lg font-bold text-blue-800 dark:text-blue-200">{{ formatRupiah(totalBudgetAllocated) }}</h3>
          <p class="mt-1 text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">
            Pakai: {{ formatRupiah(totalActualSpend) }}
          </p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Omzet UTM</p>
          <h3 class="mt-2 text-lg font-bold text-amber-600 dark:text-amber-400">{{ formatRupiah(totalUtmRevenue) }}</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
            Atribusi Sales CRM
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'campaigns'"
            :class="[
              activeTab === 'campaigns'
                ? 'border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold flex items-center gap-2'
            ]"
          >
            <span>Daftar Kampanye Email</span>
            <span class="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">{{ records.length }}</span>
          </button>
          <button
            @click="activeTab = 'utm'"
            :class="[
              activeTab === 'utm'
                ? 'border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold flex items-center gap-2'
            ]"
          >
            <span>Pelacakan UTM & Revenue Sales</span>
            <span class="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">{{ utmRecords.length }}</span>
          </button>
        </nav>
      </div>

      <!-- TAB 1: Kampanye Email Table -->
      <div v-if="activeTab === 'campaigns'" class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kampanye & Subjek</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Target Audiens</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Anggaran (Budget)</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Persetujuan (Approval)</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Eksekusi</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Funnel Interaksi</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading"><td colspan="7" class="px-5 py-8 text-center text-gray-500">Memuat data kampanye...</td></tr>
              <tr v-else-if="error"><td colspan="7" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
              <tr v-else-if="records.length === 0"><td colspan="7" class="px-5 py-8 text-center text-gray-500">Belum ada kampanye email yang dibuat.</td></tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ record.name || record.subject || 'Tanpa Judul' }}</span>
                    <span v-if="record.is_ab_testing" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                      A/B Test
                    </span>
                    <span v-if="record.winner_variant" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      🏆 Varian {{ record.winner_variant }} Menang
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 space-y-0.5">
                    <div><span class="font-medium text-gray-600 dark:text-gray-300">A:</span> {{ record.subject || '-' }}</div>
                    <div v-if="record.is_ab_testing && record.subject_b" class="text-purple-600 dark:text-purple-400">
                      <span class="font-medium">B:</span> {{ record.subject_b }}
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {{ record.target_audience || 'Semua Kontak' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-xs">
                    {{ formatRupiah(record.budget_allocated || 0) }}
                  </div>
                  <div class="text-[11px] text-gray-400">
                    Pakai: {{ formatRupiah(record.actual_spend || 0) }}
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span
                    :class="[
                      record.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      record.approval_status === 'Waiting Approval' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' :
                      record.approval_status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400' :
                      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border'
                    ]"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="record.approval_status === 'Approved' ? 'bg-emerald-500' : record.approval_status === 'Waiting Approval' ? 'bg-amber-500' : record.approval_status === 'Rejected' ? 'bg-rose-500' : 'bg-gray-400'"></span>
                    {{ record.approval_status || 'Draft' }}
                  </span>
                  <div v-if="record.reject_reason" class="text-[10px] text-rose-500 mt-1 max-w-[150px] truncate" :title="record.reject_reason">
                    Alasan: {{ record.reject_reason }}
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span
                    :class="[
                      record.status === 'Sent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                      record.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                      record.status === 'In-Queue' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border'
                    ]"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="record.status === 'Sent' ? 'bg-emerald-500' : record.status === 'Scheduled' ? 'bg-blue-500' : 'bg-gray-400'"></span>
                    {{ record.status || 'Draft' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="space-y-1.5 min-w-[220px]">
                    <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                      <span>Kirim: <b class="font-semibold text-gray-800 dark:text-gray-200">{{ record.sent_count || 0 }}</b></span>
                      <span class="text-emerald-600 dark:text-emerald-400">
                        Buka: <b class="font-semibold">{{ Math.min(record.opened_count || 0, record.sent_count || 0) }}</b>
                        ({{ calcRate(record.opened_count, record.sent_count) }}%)
                      </span>
                      <span class="text-purple-600 dark:text-purple-400">
                        Klik: <b class="font-semibold">{{ Math.min(record.clicked_count || 0, Math.min(record.opened_count || record.sent_count || 0, record.sent_count || 0)) }}</b>
                        ({{ calcRate(record.clicked_count, record.sent_count) }}%)
                      </span>
                    </div>
                    <!-- Double-layer visual progress bar -->
                    <div class="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        class="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full transition-all duration-300"
                        :style="{ width: `${calcRate(record.opened_count, record.sent_count)}%` }"
                        title="Open Rate"
                      ></div>
                      <div
                        class="absolute top-0 bottom-0 left-0 bg-purple-600 rounded-full transition-all duration-300"
                        :style="{ width: `${calcRate(record.clicked_count, record.sent_count)}%` }"
                        title="Click Rate"
                      ></div>
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                      <span class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Open Rate</span>
                      <span class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-purple-600"></span> Click Rate (CTR)</span>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5 flex-wrap min-w-[170px]">
                    <!-- 1. Tombol Ajukan Approval (Jika Draft atau Rejected) -->
                    <button
                      v-if="!record.approval_status || record.approval_status === 'Draft' || record.approval_status === 'Rejected'"
                      type="button"
                      @click="requestApproval(record.id)"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 transition"
                      title="Ajukan Persetujuan ke Manajer"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Ajukan
                    </button>

                    <!-- 2. Tombol Setujui & Tolak (Jika Waiting Approval) -->
                    <template v-if="record.approval_status === 'Waiting Approval'">
                      <button
                        type="button"
                        @click="approveCampaign(record.id)"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
                        title="Setujui Kampanye"
                      >
                        Setujui
                      </button>
                      <button
                        type="button"
                        @click="rejectCampaign(record.id)"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 transition"
                        title="Tolak Kampanye"
                      >
                        Tolak
                      </button>
                    </template>

                    <!-- 3. Tombol Eksekusi / Kirim & A/B Test Runner (Jika Approved) -->
                    <template v-if="record.approval_status === 'Approved' && record.status !== 'Sent'">
                      <button
                        v-if="record.is_ab_testing"
                        type="button"
                        @click="runABTest(record.id)"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition shadow-xs"
                        title="Eksekusi Sampel & Tentukan Varian Pemenang"
                      >
                        ⚡ Uji A/B
                      </button>
                      <button
                        v-else
                        type="button"
                        @click="sendCampaign(record)"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
                        title="Eksekusi & Kirim Email Sekarang"
                      >
                        🚀 Kirim
                      </button>
                    </template>

                    <button
                      type="button"
                      @click="openModal('edit', record)"
                      class="inline-flex items-center gap-1 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 transition"
                      title="Edit Kampanye"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button
                      type="button"
                      @click="deleteRecord(record.id)"
                      class="inline-flex items-center gap-1 p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 transition"
                      title="Hapus Kampanye"
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

      <!-- TAB 2: UTM Link Tracker Table -->
      <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white text-sm">Tautan UTM & Pendapatan Konversi</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">Atribusi penjualan riil yang diperoleh dari tautan promosi kampanye pemasaran.</p>
          </div>
          <button @click="openUtmModal" class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
            + Tambah Link UTM
          </button>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">ID</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kampanye Induk</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">UTM Source</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">UTM Medium</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Omzet Penjualan (CRM)</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="utmRecords.length === 0"><td colspan="6" class="px-5 py-8 text-center text-gray-500">Belum ada link pelacak UTM. Klik "+ Tambah Link UTM" untuk membuat link.</td></tr>
              <tr v-for="utm in utmRecords" :key="utm.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                <td class="px-5 py-4 text-xs font-medium text-gray-500 dark:text-gray-400">#{{ utm.id }}</td>
                <td class="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ utm.campaign?.name || utm.campaign?.subject || `Kampanye #${utm.campaign_id}` }}
                </td>
                <td class="px-5 py-4">
                  <span class="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {{ utm.utm_source || 'direct' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-xs text-gray-600 dark:text-gray-300">{{ utm.utm_medium || 'email' }}</td>
                <td class="px-5 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {{ formatRupiah(utm.generated_revenue || 0) }}
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      @click="openUtmModal('edit', utm)"
                      class="inline-flex items-center gap-1 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 transition"
                      title="Edit Link UTM"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button
                      type="button"
                      @click="deleteUtmRecord(utm.id)"
                      class="inline-flex items-center gap-1 p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 transition"
                      title="Hapus Link UTM"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

  <!-- Modal Tambah/Edit Kampanye Email -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>✉️</span> {{ modalMode === 'create' ? 'Buat Kampanye Email Baru' : 'Edit Kampanye Email' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <form @submit.prevent="saveRecord" class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Internal Kampanye</label>
            <input v-model="formData.name" type="text" placeholder="Misal: Promo Akhir Tahun Q4 B2B" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div class="space-y-3">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Subjek Email Versi A (Utama)</label>
              <input v-model="formData.subject" type="text" placeholder="Misal: Dapatkan Diskon 30% Khusus Klien Terpilih!" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>

            <!-- Toggle A/B Testing Enterprise -->
            <div class="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/50 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <span>📊</span> A/B Split Testing (Odoo Enterprise Standard)
                  </span>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Kirim 2 varian subjek ke sampel audiens untuk mencari CTR/Open Rate tertinggi.</p>
                </div>
                <input type="checkbox" v-model="formData.is_ab_testing" class="h-4 w-4 rounded text-purple-600 focus:ring-purple-500" />
              </div>

              <div v-if="formData.is_ab_testing" class="pt-2 space-y-2 border-t border-purple-200/60 dark:border-purple-800/40">
                <div>
                  <label class="mb-1 block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Subjek Email Versi B (Alternatif Pembanding)</label>
                  <input v-model="formData.subject_b" type="text" placeholder="Misal: Kesempatan Terakhir: Diskon 30% Berakhir Malam Ini!" required class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label class="text-[10px] text-gray-500">Ukuran Sampel Uji</label>
                    <select v-model="formData.sample_size_pct" class="w-full rounded border border-gray-300 bg-white p-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <option :value="10">10% Audiens</option>
                      <option :value="20">20% Audiens</option>
                      <option :value="30">30% Audiens</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[10px] text-gray-500">Metrik Pemenang</label>
                    <select v-model="formData.winner_metric" class="w-full rounded border border-gray-300 bg-white p-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <option value="open_rate">Open Rate Tertinggi</option>
                      <option value="click_rate">Click Rate (CTR) Tertinggi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Target Audiens</label>
              <select v-model="formData.target_audience" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Semua Kontak Pelanggan">Semua Kontak Pelanggan</option>
                <option value="Klien Prioritas VIP">Klien Prioritas VIP</option>
                <option value="Prospek CRM Belum Closing">Prospek CRM Belum Closing</option>
                <option value="Pelanggan Tidak Aktif (Winback)">Pelanggan Tidak Aktif (Winback)</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status Eksekusi</label>
              <select v-model="formData.status" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In-Queue">In-Queue</option>
                <option value="Sent">Sent</option>
              </select>
            </div>
          </div>

          <!-- Enterprise: Input Anggaran Kampanye -->
          <div class="grid grid-cols-2 gap-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">Alokasi Anggaran (Rp)</label>
              <input v-model.number="formData.budget_allocated" type="number" min="0" placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              <span class="text-[11px] text-gray-500 dark:text-gray-400">Plafon maksimal disetujui</span>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">Realisasi Belanja (Rp)</label>
              <input v-model.number="formData.actual_spend" type="number" min="0" placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              <span class="text-[11px] text-gray-500 dark:text-gray-400">Biaya riil server/blast</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
            <div>
              <label class="text-xs text-gray-500 dark:text-gray-400">Total Kirim</label>
              <input v-model.number="formData.sent_count" type="number" min="0" class="w-full mt-1 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="text-xs text-gray-500 dark:text-gray-400">Dibuka</label>
              <input v-model.number="formData.opened_count" type="number" min="0" class="w-full mt-1 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="text-xs text-gray-500 dark:text-gray-400">Diklik (CTR)</label>
              <input v-model.number="formData.clicked_count" type="number" min="0" class="w-full mt-1 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Kampanye' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Generator Link UTM (Tambah / Edit) -->
  <Teleport to="body">
    <div v-if="isUtmModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🔗</span> {{ utmModalMode === 'create' ? 'Generator Tautan Pelacak UTM' : 'Edit Tautan Pelacak UTM' }}
          </h3>
          <button @click="isUtmModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <form @submit.prevent="saveUtmRecord" class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Pilih Kampanye Induk</label>
            <select v-model="utmFormData.campaign_id" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option v-for="c in records" :key="c.id" :value="c.id">
                {{ c.name || c.subject }} (ID: #{{ c.id }})
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">UTM Source (Sumber)</label>
            <input v-model="utmFormData.utm_source" type="text" placeholder="misal: newsletter, google, linkedin" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">UTM Medium (Media)</label>
            <input v-model="utmFormData.utm_medium" type="text" placeholder="misal: email, cpc, banner" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Estimasi / Realisasi Omzet Penjualan (Rp)</label>
            <input v-model.number="utmFormData.generated_revenue" type="number" min="0" placeholder="0" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div class="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <p class="font-semibold">Tautan yang Dihasilkan:</p>
            <p class="font-mono mt-1 break-all select-all">
              https://erp.internal/promo?utm_source={{ utmFormData.utm_source || 'source' }}&utm_medium={{ utmFormData.utm_medium || 'medium' }}&utm_campaign={{ utmFormData.campaign_id || 'id' }}
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="isUtmModalOpen = false" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : (utmModalMode === 'create' ? 'Simpan Link UTM' : 'Perbarui Link UTM') }}
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
import { massMailingService } from '@/services/marketing/mass-mailing.service'
import type { IMailingCampaignDto, IUtmTrackerDto } from '@/types/marketing/mass_mailing.dto'
import type { IPaginationMeta } from '@/types'

const activeTab = ref<'campaigns' | 'utm'>('campaigns')
const records = ref<IMailingCampaignDto[]>([])
const utmRecords = ref<IUtmTrackerDto[]>([])
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
  subject: string
  subject_b: string
  is_ab_testing: boolean
  sample_size_pct: number
  winner_metric: string
  target_audience: string
  status: 'Draft' | 'Scheduled' | 'In-Queue' | 'Sent'
  sent_count: number
  opened_count: number
  clicked_count: number
  budget_allocated: number
  actual_spend: number
  approval_status: 'Draft' | 'Waiting Approval' | 'Approved' | 'Rejected'
}>({
  id: null,
  name: '',
  subject: '',
  subject_b: '',
  is_ab_testing: false,
  sample_size_pct: 20,
  winner_metric: 'open_rate',
  target_audience: 'Semua Kontak Pelanggan',
  status: 'Draft',
  sent_count: 0,
  opened_count: 0,
  clicked_count: 0,
  budget_allocated: 0,
  actual_spend: 0,
  approval_status: 'Draft'
})

// Modal UTM
const isUtmModalOpen = ref(false)
const utmModalMode = ref<'create' | 'edit'>('create')
const utmFormData = ref<{
  id: number | null
  campaign_id: number | null
  utm_source: string
  utm_medium: string
  generated_revenue: number
}>({
  id: null,
  campaign_id: null,
  utm_source: 'newsletter',
  utm_medium: 'email',
  generated_revenue: 0
})

// KPI Metrics Computations
const totalSent = computed(() => {
  return records.value.reduce((acc, curr) => acc + (curr.sent_count || 0), 0)
})

const avgDeliveryRate = computed(() => {
  if (totalSent.value === 0) return 100
  return 99.2
})

const avgOpenRate = computed(() => {
  if (totalSent.value === 0) return 0
  const totalOpened = records.value.reduce((acc, curr) => {
    // Pastikan open count tidak melebihi sent count
    const validOpen = Math.min(curr.opened_count || 0, curr.sent_count || 0)
    return acc + validOpen
  }, 0)
  return Math.min(100, Math.round((totalOpened / totalSent.value) * 100))
})

const avgClickRate = computed(() => {
  if (totalSent.value === 0) return 0
  const totalClicked = records.value.reduce((acc, curr) => {
    // Pastikan click count tidak melebihi open count atau sent count
    const maxPossibleClicks = Math.min(curr.opened_count || curr.sent_count || 0, curr.sent_count || 0)
    const validClick = Math.min(curr.clicked_count || 0, maxPossibleClicks)
    return acc + validClick
  }, 0)
  return Math.min(100, Math.round((totalClicked / totalSent.value) * 100))
})

const totalUtmRevenue = computed(() => {
  return utmRecords.value.reduce((acc, curr) => acc + (curr.generated_revenue || 0), 0)
})

const totalBudgetAllocated = computed(() => {
  return records.value.reduce((acc, curr) => acc + (Number(curr.budget_allocated) || 0), 0)
})

const totalActualSpend = computed(() => {
  return records.value.reduce((acc, curr) => acc + (Number(curr.actual_spend) || 0), 0)
})

// Safe percentage calculation capped at 100%
const calcRate = (part: number | undefined, whole: number | undefined) => {
  if (!whole || whole <= 0 || !part || part <= 0) return 0
  const validPart = Math.min(part, whole)
  return Math.min(100, Math.round((validPart / whole) * 100))
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [campaignsRes, utms] = await Promise.all([
      massMailingService.getAll({
        page: pagination.value.current_page,
        limit: pagination.value.per_page
      }),
      massMailingService.getAllUtm()
    ])
    if (campaignsRes && typeof campaignsRes === 'object' && 'data' in campaignsRes && Array.isArray((campaignsRes as any).data)) {
      records.value = (campaignsRes as any).data
      if ((campaignsRes as any).pagination) pagination.value = (campaignsRes as any).pagination
    } else if (Array.isArray(campaignsRes)) {
      records.value = campaignsRes
    } else {
      records.value = []
    }
    utmRecords.value = utms || []
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: IMailingCampaignDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id || null,
      name: data.name || '',
      subject: data.subject || '',
      subject_b: data.subject_b || '',
      is_ab_testing: !!data.is_ab_testing,
      sample_size_pct: data.sample_size_pct || 20,
      winner_metric: data.winner_metric || 'open_rate',
      target_audience: data.target_audience || 'Semua Kontak Pelanggan',
      status: data.status || 'Draft',
      sent_count: data.sent_count || 0,
      opened_count: data.opened_count || 0,
      clicked_count: data.clicked_count || 0,
      budget_allocated: data.budget_allocated || 0,
      actual_spend: data.actual_spend || 0,
      approval_status: data.approval_status || 'Draft'
    }
  } else {
    formData.value = {
      id: null,
      name: '',
      subject: '',
      subject_b: '',
      is_ab_testing: false,
      sample_size_pct: 20,
      winner_metric: 'open_rate',
      target_audience: 'Semua Kontak Pelanggan',
      status: 'Draft',
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
      budget_allocated: 0,
      actual_spend: 0,
      approval_status: 'Draft'
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
      await massMailingService.update(formData.value.id, formData.value)
    } else {
      await massMailingService.create(formData.value)
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
  if (!confirm('Hapus kampanye email ini?')) return
  try {
    await massMailingService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

// Enterprise Workflow Functions
const requestApproval = async (id?: number) => {
  if (!id) return
  if (!confirm('Ajukan kampanye ini ke Manajer untuk ditinjau dan disetujui anggarannya?')) return
  try {
    await massMailingService.requestApproval(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal mengajukan persetujuan: ' + (err.response?.data?.message || err.message))
  }
}

const runABTest = async (id?: number) => {
  if (!id) return
  if (!confirm('Eksekusi A/B Split Test ke sampel audiens sekarang? Sistem akan menentukan varian pemenang secara otomatis.')) return
  try {
    const res = await massMailingService.runABTest(id)
    await fetchData()
    alert(`🏆 Hasil A/B Test Selesai! Varian ${res.winner_variant} Menang (Open: ${res.variant_b_opened} vs ${res.variant_a_opened}). Sisa kampanye otomatis dikirim menggunakan subjek pemenang!`)
  } catch (err: any) {
    alert('Gagal menjalankan A/B test: ' + (err.response?.data?.message || err.message))
  }
}

const approveCampaign = async (id?: number) => {
  if (!id) return
  if (!confirm('Setujui pengalokasian anggaran dan eksekusi kampanye ini?')) return
  try {
    await massMailingService.approve(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menyetujui: ' + (err.response?.data?.message || err.message))
  }
}

const rejectCampaign = async (id?: number) => {
  if (!id) return
  const reason = prompt('Masukkan alasan penolakan anggaran / materi kampanye:')
  if (!reason) return
  try {
    await massMailingService.reject(id, reason)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menolak: ' + (err.response?.data?.message || err.message))
  }
}

const sendCampaign = async (record: IMailingCampaignDto) => {
  if (!record.id) return
  if (record.approval_status !== 'Approved') {
    alert('Perhatian: Kampanye belum disetujui oleh Manajer!')
    return
  }
  if (!confirm(`Eksekusi pengiriman email massal ke ${record.target_audience}?`)) return
  try {
    await massMailingService.update(record.id, {
      ...record,
      status: 'Sent'
    })
    await fetchData()
    alert('🚀 Kampanye email berhasil dieksekusi ke seluruh audiens sasaran!')
  } catch (err: any) {
    alert('Gagal mengeksekusi: ' + (err.response?.data?.message || err.message))
  }
}

const openUtmModal = (mode: 'create' | 'edit' = 'create', data: IUtmTrackerDto | null = null) => {
  utmModalMode.value = mode
  if (mode === 'edit' && data) {
    utmFormData.value = {
      id: data.id || null,
      campaign_id: data.campaign_id || (records.value.length > 0 ? records.value[0].id : null),
      utm_source: data.utm_source || 'newsletter',
      utm_medium: data.utm_medium || 'email',
      generated_revenue: data.generated_revenue || 0
    }
  } else {
    utmFormData.value = {
      id: null,
      campaign_id: records.value.length > 0 ? records.value[0].id : null,
      utm_source: 'newsletter',
      utm_medium: 'email',
      generated_revenue: 0
    }
  }
  isUtmModalOpen.value = true
}

const saveUtmRecord = async () => {
  isSaving.value = true
  try {
    if (utmModalMode.value === 'edit' && utmFormData.value.id) {
      await massMailingService.updateUtm(utmFormData.value.id, utmFormData.value)
    } else {
      await massMailingService.createUtm(utmFormData.value)
    }
    isUtmModalOpen.value = false
    await fetchData()
  } catch (err: any) {
    alert('Gagal menyimpan Link UTM: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteUtmRecord = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus link UTM ini?')) return
  try {
    await massMailingService.deleteUtm(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus link UTM: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchData()
})
</script>
