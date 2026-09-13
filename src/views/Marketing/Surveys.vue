<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
            Survei Kepuasan Pelanggan & Net Promoter Score (NPS)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Enterprise: Ukur kepuasan pelanggan secara kuantitatif (NPS -100 s.d. +100), petakan Promoter vs Detractor, dan evaluasi respon.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-teal-700 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Buat Survei Baru
          </button>
        </div>
      </div>

      <!-- NPS Overview Dashboard Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rata-rata Skor NPS</p>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-3xl font-extrabold" :class="avgNpsScore >= 50 ? 'text-teal-600 dark:text-teal-400' : avgNpsScore >= 0 ? 'text-amber-500' : 'text-rose-500'">
              {{ avgNpsScore > 0 ? `+${avgNpsScore}` : avgNpsScore }}
            </h3>
            <span
              :class="[
                avgNpsScore >= 70 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
                avgNpsScore >= 30 ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30' :
                avgNpsScore >= 0 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' :
                'bg-rose-50 text-rose-600 dark:bg-rose-900/30',
                'text-xs font-semibold px-2 py-0.5 rounded-full'
              ]"
            >
              {{ npsBenchmarkLabel }}
            </span>
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Dari {{ totalSurveyWithResponses }} survei dengan respon aktif</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Promoters (Skor 9-10)</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ totalPromoters }} Responden</h3>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div class="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${promoterPercent}%` }"></div>
          </div>
          <p class="mt-1 text-xs text-emerald-600 font-medium">{{ promoterPercent }}% dari seluruh suara</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Passives (Skor 7-8)</p>
          <h3 class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ totalPassives }} Responden</h3>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div class="bg-amber-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${passivePercent}%` }"></div>
          </div>
          <p class="mt-1 text-xs text-amber-600 font-medium">{{ passivePercent }}% netral</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Detractors (Skor 0-6)</p>
          <h3 class="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{{ totalDetractors }} Responden</h3>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div class="bg-rose-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${detractorPercent}%` }"></div>
          </div>
          <p class="mt-1 text-xs text-rose-600 font-medium">{{ detractorPercent }}% perlu ditindaklanjuti</p>
        </div>
      </div>

      <!-- Survey Table with NPS Distribution -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Kuesioner & Evaluasi Kepuasan</h3>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total survei: {{ records.length }}</span>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
              <tr>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Judul Survei</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Skor NPS</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Distribusi Respon (Promoter / Passive / Detractor)</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading"><td colspan="5" class="px-5 py-8 text-center text-gray-500">Memuat data survei...</td></tr>
              <tr v-else-if="error"><td colspan="5" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
              <tr v-else-if="records.length === 0"><td colspan="5" class="px-5 py-8 text-center text-gray-500">Belum ada survei kepuasan yang dibuat.</td></tr>
              <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ record.title || 'Tanpa Judul' }}</span>
                    <span v-if="record.gform_url" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" title="Terkoneksi Google Forms">
                      📋 G-Form
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-sm">{{ record.description || 'Tidak ada deskripsi' }}</div>
                </td>
                <td class="px-5 py-4">
                  <span
                    :class="[
                      normalizeState(record.state) === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      normalizeState(record.state) === 'closed' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400' :
                      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border uppercase text-[11px]'
                    ]"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="normalizeState(record.state) === 'open' ? 'bg-emerald-500' : normalizeState(record.state) === 'closed' ? 'bg-rose-500' : 'bg-gray-400'"></span>
                    {{ normalizeState(record.state) }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span
                    v-if="getRowStats(record).total > 0"
                    class="text-sm font-extrabold"
                    :class="record.nps_score && record.nps_score >= 50 ? 'text-teal-600 dark:text-teal-400' : record.nps_score && record.nps_score >= 0 ? 'text-amber-500' : 'text-rose-500'"
                  >
                    {{ (record.nps_score ?? 0) > 0 ? `+${record.nps_score}` : (record.nps_score ?? 0) }} NPS
                  </span>
                  <span v-else class="text-xs font-medium text-gray-400 italic">
                    Belum ada respon
                  </span>
                </td>
                <td class="px-5 py-4">
                  <!-- Jika sudah ada respon -->
                  <div v-if="getRowStats(record).total > 0" class="space-y-1.5 min-w-[220px]">
                    <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span class="text-emerald-600 font-semibold">{{ record.promoters_count || 0 }} Prom ({{ getRowStats(record).pPct }}%)</span>
                      <span class="text-amber-600 font-semibold">{{ record.passives_count || 0 }} Pas ({{ getRowStats(record).psPct }}%)</span>
                      <span class="text-rose-600 font-semibold">{{ record.detractors_count || 0 }} Det ({{ getRowStats(record).dPct }}%)</span>
                    </div>
                    <div class="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div class="bg-emerald-500 transition-all duration-300" :style="{ width: `${getRowStats(record).pPct}%` }" :title="`Promoters: ${record.promoters_count || 0}`"></div>
                      <div class="bg-amber-400 transition-all duration-300" :style="{ width: `${getRowStats(record).psPct}%` }" :title="`Passives: ${record.passives_count || 0}`"></div>
                      <div class="bg-rose-500 transition-all duration-300" :style="{ width: `${getRowStats(record).dPct}%` }" :title="`Detractors: ${record.detractors_count || 0}`"></div>
                    </div>
                  </div>
                  <!-- Jika masih baru / 0 respon -->
                  <div v-else class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <div class="h-2 w-28 bg-gray-100 dark:bg-gray-800 rounded-full border border-dashed border-gray-300 dark:border-gray-700"></div>
                    <span>0 Responden (Menunggu respon)</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Tombol Buka Link Form Publik -->
                    <a
                      :href="`/survey/${record.id}`"
                      target="_blank"
                      title="Buka Kuesioner Publik (Untuk disebarkan ke pelanggan)"
                      class="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 inline-flex items-center gap-1"
                    >
                      <span>🔗</span> Link Form
                    </a>
                    <!-- Tombol Buka GForm jika ada linknya -->
                    <a
                      v-if="record.gform_url"
                      :href="record.gform_url"
                      target="_blank"
                      title="Buka Google Form"
                      class="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 inline-flex items-center gap-1"
                    >
                      <span>📋</span> G-Form
                    </a>
                    <button
                      @click="showWebhookModal(record)"
                      title="Lihat Petunjuk Webhook Auto-Sync dari Google Form/Sheet"
                      class="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      ⚡ Webhook
                    </button>
                    <button @click="openModal('edit', record)" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800">
                      Edit
                    </button>
                    <button @click="deleteRecord(record.id)" class="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20">
                      Hapus
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

  <!-- Modal Tambah/Edit Survei -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📋</span> {{ modalMode === 'create' ? 'Buat Survei Baru' : 'Edit Survei' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
  
        <form @submit.prevent="saveRecord" class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Judul Survei</label>
            <input v-model="formData.title" type="text" placeholder="Misal: Survei Kepuasan Pengiriman Layanan B2B Q4" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
  
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Deskripsi / Pengantar</label>
            <textarea v-model="formData.description" rows="3" placeholder="Jelaskan tujuan survei kepada responden..." class="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
          </div>
  
          <!-- Integrasi Google Form & Webhook Sync -->
          <div class="rounded-xl border border-dashed border-teal-300 bg-teal-50/50 p-4 dark:border-teal-800 dark:bg-teal-950/20">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <span>🔗</span> Link Google Form (Opsional)
              </label>
              <span class="text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/50 px-2 py-0.5 rounded-full">
                Auto-Sync Ready
              </span>
            </div>
            <input
              v-model="formData.gform_url"
              type="url"
              placeholder="https://docs.google.com/forms/d/e/.../viewform"
              class="w-full rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none dark:border-teal-800 dark:bg-gray-900 dark:text-white"
            />
            <p class="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              💡 <strong>Auto-Sync Google Form:</strong> Tempelkan link form di sini. Responden dapat mengisi lewat Google Forms Anda atau via Form Internal Publik kami. Setiap respon akan otomatis terhitung ke Skor NPS.
            </p>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status Survei</label>
              <select v-model="formData.state" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="draft">Draft (Konsep)</option>
                <option value="open">Open (Menerima Jawaban)</option>
                <option value="closed">Closed (Ditutup)</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Target / Initial Skor NPS</label>
              <input v-model.number="formData.nps_score" type="number" min="-100" max="100" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
  
          <!-- Opsional: Edit jumlah responden jika edit mode -->
          <div v-if="modalMode === 'edit'" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <p class="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Input Respon Responden</p>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="text-[11px] text-emerald-600 font-medium">Promoters (9-10)</label>
                <input v-model.number="formData.promoters_count" type="number" min="0" class="w-full mt-0.5 rounded border border-gray-300 px-2 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label class="text-[11px] text-amber-600 font-medium">Passives (7-8)</label>
                <input v-model.number="formData.passives_count" type="number" min="0" class="w-full mt-0.5 rounded border border-gray-300 px-2 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label class="text-[11px] text-rose-600 font-medium">Detractors (0-6)</label>
                <input v-model.number="formData.detractors_count" type="number" min="0" class="w-full mt-0.5 rounded border border-gray-300 px-2 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
          </div>
  
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Survei' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- MODAL PANDUAN WEBHOOK AUTO-SYNC GOOGLE FORM -->
  <Teleport to="body">
    <div v-if="isWebhookModalOpen && selectedWebhookSurvey" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚡</span> Panduan Auto-Sync Google Form & Webhook
          </h3>
          <button @click="isWebhookModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
  
        <div class="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <div class="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800">
            <p class="font-bold text-teal-800 dark:text-teal-300">Survei: {{ selectedWebhookSurvey.title }}</p>
            <p class="text-xs text-teal-600 dark:text-teal-400 mt-0.5">ID Survei: #{{ selectedWebhookSurvey.id }}</p>
          </div>
  
          <!-- URL Webhook Endpoint -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Endpoint Webhook Auto-Sync (POST):
            </label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                readonly
                :value="webhookUrl"
                class="w-full font-mono text-xs rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-teal-400"
              />
              <button
                @click="copyToClipboard(webhookUrl)"
                class="px-3 py-2 rounded-lg bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition whitespace-nowrap"
              >
                Salin URL
              </button>
            </div>
          </div>
  
          <!-- URL Form Publik -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Link Form Kuesioner Publik (Siap sebar ke pelanggan):
            </label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                readonly
                :value="publicFormUrl"
                class="w-full font-mono text-xs rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-teal-400"
              />
              <button
                @click="copyToClipboard(publicFormUrl)"
                class="px-3 py-2 rounded-lg bg-brand-500 text-white font-semibold text-xs hover:bg-brand-600 transition whitespace-nowrap"
              >
                Salin Link
              </button>
            </div>
          </div>
  
          <!-- Petunjuk 3 Langkah Google Form / Sheets -->
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 space-y-2 text-xs">
            <p class="font-bold text-gray-900 dark:text-white">🚀 Cara Menghubungkan Google Form otomatis:</p>
            <ol class="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-300">
              <li>Buka <strong>Google Form</strong> Anda &rarr; Klik tab <strong>Tanggapan / Responses</strong> &rarr; Klik <strong>Tautkan ke Spreadsheet (Google Sheets)</strong>.</li>
              <li>Di Google Sheets, klik menu <strong>Ekstensi (Extensions)</strong> &rarr; <strong>Apps Script</strong>.</li>
              <li>Paste script otomatis berikut, lalu pasang trigger <em>"On form submit"</em>:</li>
            </ol>
            <pre class="bg-gray-900 text-teal-300 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">function onFormSubmit(e) {
    // Ambil skor NPS (kolom jawaban 0-10)
    var rating = parseInt(e.values[1]); // Sesuaikan index kolom nilai
    var url = "{{ webhookUrl }}";
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ rating: rating })
    });
  }</pre>
          </div>
  
          <div class="flex justify-end pt-2">
            <button
              type="button"
              @click="isWebhookModalOpen = false"
              class="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { surveysService } from '@/services/marketing/surveys.service'
import type { ISurveyDto } from '@/types/marketing/surveys.dto'

const records = ref<ISurveyDto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<{
  id: number | null
  title: string
  description: string
  gform_url: string
  state: 'draft' | 'open' | 'closed'
  nps_score: number
  promoters_count: number
  passives_count: number
  detractors_count: number
}>({
  id: null,
  title: '',
  description: '',
  gform_url: '',
  state: 'draft',
  nps_score: 0,
  promoters_count: 0,
  passives_count: 0,
  detractors_count: 0
})

// Normalisasi state agar tidak menampilkan teks acak dari faker
const normalizeState = (state?: string) => {
  if (!state) return 'draft'
  const lower = state.toLowerCase()
  if (lower === 'open') return 'open'
  if (lower === 'closed') return 'closed'
  return 'draft'
}

// Helper kalkulasi respon per baris tabel
const getRowStats = (record: ISurveyDto) => {
  const p = record.promoters_count || 0
  const ps = record.passives_count || 0
  const d = record.detractors_count || 0
  const total = p + ps + d
  if (total === 0) {
    return { total: 0, pPct: 0, psPct: 0, dPct: 0 }
  }
  return {
    total,
    pPct: Math.round((p / total) * 100),
    psPct: Math.round((ps / total) * 100),
    dPct: Math.round((d / total) * 100)
  }
}

// Computations Dinamis Riil
const totalSurveyWithResponses = computed(() => {
  return records.value.filter(r => (r.promoters_count || 0) + (r.passives_count || 0) + (r.detractors_count || 0) > 0).length
})

const avgNpsScore = computed(() => {
  const activeSurveys = records.value.filter(r => (r.promoters_count || 0) + (r.passives_count || 0) + (r.detractors_count || 0) > 0)
  if (activeSurveys.length === 0) return 0
  const total = activeSurveys.reduce((acc, curr) => acc + (curr.nps_score || 0), 0)
  return Math.round(total / activeSurveys.length)
})

const npsBenchmarkLabel = computed(() => {
  if (avgNpsScore.value >= 70) return 'World Class'
  if (avgNpsScore.value >= 50) return 'Sangat Baik'
  if (avgNpsScore.value >= 0) return 'Cukup Baik'
  return 'Perlu Perbaikan'
})

const totalPromoters = computed(() => {
  return records.value.reduce((acc, curr) => acc + (curr.promoters_count || 0), 0)
})

const totalPassives = computed(() => {
  return records.value.reduce((acc, curr) => acc + (curr.passives_count || 0), 0)
})

const totalDetractors = computed(() => {
  return records.value.reduce((acc, curr) => acc + (curr.detractors_count || 0), 0)
})

const grandTotalResponses = computed(() => totalPromoters.value + totalPassives.value + totalDetractors.value)

const promoterPercent = computed(() => grandTotalResponses.value ? Math.round((totalPromoters.value / grandTotalResponses.value) * 100) : 0)
const passivePercent = computed(() => grandTotalResponses.value ? Math.round((totalPassives.value / grandTotalResponses.value) * 100) : 0)
const detractorPercent = computed(() => grandTotalResponses.value ? Math.round((totalDetractors.value / grandTotalResponses.value) * 100) : 0)

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await surveysService.getAll()
    records.value = data || []
  } catch (err: any) {
    error.value = 'Gagal memuat survei: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: ISurveyDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id || null,
      title: data.title || '',
      description: data.description || '',
      gform_url: data.gform_url || '',
      state: (normalizeState(data.state) as any) || 'draft',
      nps_score: data.nps_score ?? 0,
      promoters_count: data.promoters_count || 0,
      passives_count: data.passives_count || 0,
      detractors_count: data.detractors_count || 0
    }
  } else {
    formData.value = {
      id: null,
      title: '',
      description: '',
      gform_url: '',
      state: 'draft',
      nps_score: 0,
      promoters_count: 0,
      passives_count: 0,
      detractors_count: 0
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
      await surveysService.update(formData.value.id, formData.value)
    } else {
      await surveysService.create(formData.value)
    }
    closeModal()
    await fetchData()
  } catch (err: any) {
    alert('Gagal menyimpan survei: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus survei ini?')) return
  try {
    await surveysService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

// Modal Panduan Webhook Auto-Sync
const isWebhookModalOpen = ref(false)
const selectedWebhookSurvey = ref<ISurveyDto | null>(null)

const showWebhookModal = (survey: ISurveyDto) => {
  selectedWebhookSurvey.value = survey
  isWebhookModalOpen.value = true
}

const webhookUrl = computed(() => {
  if (!selectedWebhookSurvey.value?.id) return ''
  const base = window.location.origin.replace(':5173', ':7070')
  return `${base}/api/public/surveys/${selectedWebhookSurvey.value.id}/webhook-gform`
})

const publicFormUrl = computed(() => {
  if (!selectedWebhookSurvey.value?.id) return ''
  return `${window.location.origin}/survey/${selectedWebhookSurvey.value.id}`
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('✅ Berhasil disalin ke clipboard:\n' + text)
  } catch (e) {
    prompt('Salin manual teks berikut:', text)
  }
}

onMounted(() => {
  fetchData()
})
</script>
