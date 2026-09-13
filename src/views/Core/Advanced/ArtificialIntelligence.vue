<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Enterprise AI Assistant & Prompt Hub" />
        
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="activeView = 'library'"
            :class="activeView === 'library' ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
            class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
          >
            Prompt Engineering Library
          </button>
          <button
            @click="activeView = 'simulator'"
            :class="activeView === 'simulator' ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
            class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>✨</span> AI Playground & Simulator
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Model AI Terintegrasi</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">Gemini 1.5 Pro</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10 text-xl font-bold">
              ✨
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Kapasitas 1M Token Context Window</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Prompt Presets Siap Pakai</p>
              <h4 class="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{{ prompts.length }} Template</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-success-50 text-success-500 dark:bg-success-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">HR, Finance, Supply Chain, & Sales CRM</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Penggunaan Token Bulan Ini</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">128.4 K Token</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Estimasi biaya: $0.42 / bulan</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Tingkat Akurasi Rekomendasi</p>
              <h4 class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">98.4%</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Zero data leakage (Enterprise Isolated)</p>
        </div>
      </div>

      <!-- VIEW 1: Prompt Library -->
      <div v-if="activeView === 'library'" class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-bold text-gray-800 dark:text-white text-base">Koleksi Template AI Prompt Korporat</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Prompt terstruktur dengan variabel dinamis untuk otomasi operasional bisnis</p>
            </div>
            <button
              @click="openModal('create')"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Prompt Baru
            </button>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="p in prompts"
              :key="p.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors gap-4"
            >
              <div class="flex items-start gap-4">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 text-xl">
                  {{ p.icon }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ p.title }}</h4>
                    <span :class="getCategoryBadgeClass(p.module)" class="rounded px-2 py-0.5 text-2xs font-semibold">
                      {{ p.module }}
                    </span>
                    <span class="rounded bg-gray-100 px-2 py-0.5 text-2xs font-mono font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {{ p.model }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ p.description }}</p>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span v-for="tag in p.tags" :key="tag" class="rounded bg-gray-50 border border-gray-200 px-1.5 py-0.2 text-2xs font-mono text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      &#123;&#123; {{ tag }} &#125;&#125;
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center">
                <button
                  @click="runInSimulator(p)"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                >
                  <span>✨</span> Jalankan di Simulator
                </button>
                <button
                  @click="openModal('edit', p)"
                  class="rounded-lg border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  title="Edit Prompt"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: AI Playground & Simulator -->
      <div v-if="activeView === 'simulator'" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Input Simulator -->
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-sm">Input Variabel Simulasi AI</h3>
                <p class="text-xs text-gray-400">Pilih template dan sesuaikan data parameter kasus</p>
              </div>
              <select
                v-model="selectedPromptId"
                @change="onPromptSelected"
                class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 font-medium"
              >
                <option v-for="p in prompts" :key="p.id" :value="p.id">
                  {{ p.title }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Instruksi Sistem (System Prompt)</label>
              <textarea
                v-model="simSystemPrompt"
                rows="3"
                class="w-full font-mono text-xs rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Data Kasus / Input Transaksi</label>
              <textarea
                v-model="simUserInput"
                rows="5"
                class="w-full text-xs rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-2xs text-gray-400">Engine: Google Gemini 1.5 Pro • Temp: 0.2</span>
              <button
                @click="executeAiSimulation"
                :disabled="isGenerating"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-xs font-bold text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                <svg v-if="isGenerating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span v-else>✨</span>
                {{ isGenerating ? 'Menganalisis Data...' : 'Jalankan Analisis AI' }}
              </button>
            </div>
          </div>

          <!-- Output Simulator -->
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800 mb-4">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900 dark:text-white text-sm">Hasil Generatif AI ERP</h3>
                  <span v-if="simResult" class="rounded bg-success-50 text-success-600 px-2 py-0.5 text-2xs font-semibold">
                    Generated (1.2s)
                  </span>
                </div>
                <button
                  v-if="simResult"
                  @click="copySimResult"
                  class="text-xs text-brand-500 hover:text-brand-600 font-medium"
                >
                  Salin Teks
                </button>
              </div>

              <div v-if="isGenerating" class="py-16 text-center">
                <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Gemini sedang memproses analisis parameter...</p>
              </div>

              <div
                v-else-if="simResult"
                class="rounded-xl bg-gray-50 p-4 border border-gray-100 dark:border-gray-800 dark:bg-gray-800/50 text-xs text-gray-800 dark:text-gray-200 leading-relaxed space-y-3 font-sans"
                v-html="simResult"
              ></div>

              <div v-else class="py-16 text-center text-gray-400 text-xs">
                Tekan tombol "Jalankan Analisis AI" untuk melihat hasil rekomendasi cerdas secara interaktif.
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-2xs text-gray-400">
              Keluaran AI diverifikasi sesuai regulasi ketenagakerjaan dan standar akuntansi keuangan (SAK Indonesia).
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tambah / Edit Prompt -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Prompt Preset Baru' : 'Edit Prompt Preset' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePrompt" class="space-y-4 my-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Prompt</label>
            <input
              v-model="formData.title"
              type="text"
              required
              placeholder="Contoh: Analisis Kinerja Karyawan Tahunan"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Modul Terkait</label>
              <select
                v-model="formData.module"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="HR & Payroll">HR & Payroll</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Sales & CRM">Sales & CRM</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target AI Model</label>
              <select
                v-model="formData.model"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
            <input
              v-model="formData.description"
              type="text"
              placeholder="Kegunaan prompt ini..."
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Instruksi Prompt</label>
            <textarea
              v-model="formData.prompt"
              rows="4"
              required
              placeholder="Tuliskan prompt AI dengan variabel {{nama_variabel}}..."
              class="w-full font-mono text-xs rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600"
            >
              Simpan Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const activeView = ref<'library' | 'simulator'>('library')

const prompts = ref([
  {
    id: 1,
    title: 'Analisis 360° Evaluasi Kinerja & Deteksi Burnout Karyawan',
    module: 'HR & Payroll',
    model: 'Gemini 1.5 Pro',
    description: 'Menganalisis ulasan peer review, tingkat absensi, dan jam lembur untuk mendeteksi risiko kejenuhan kerja serta rekomendasi pengembangan.',
    tags: ['employee_name', 'review_scores', 'overtime_hours'],
    system: 'Anda adalah Senior People & Culture Director berpengalaman 15 tahun di perusahaan enterprise multinasional.',
    sampleInput: 'Nama: Ahmad Fauzi (Software Engineer)\nNilai Kinerja: 88/100\nTotal Lembur Bulan Ini: 38 Jam\nFeedback Rekan: "Sering merespons tiket larut malam, hasil kode berkualitas tinggi namun terlihat kelelahan."',
    sampleOutput: `
      <h4 class="font-bold text-gray-900 dark:text-white mb-1">📋 Hasil Analisis People & Culture:</h4>
      <p><strong>1. Evaluasi Kinerja:</strong> Karyawan menunjukkan komitmen dan hasil teknis luar biasa (Skor 88/100, Tier: Exceeding Expectation).</p>
      <p><strong>2. Risiko Burnout (Waspada Tinggi):</strong> Lembur 38 jam sebulan melampaui batas wajar kesehatan kerja (maksimal anjuran 14 jam/minggu). Pola kerja larut malam berpotensi menurunkan produktivitas dalam 2-3 bulan ke depan.</p>
      <p><strong>3. Rekomendasi Otoritas HR:</strong></p>
      <ul class="list-disc list-inside space-y-1 mt-1 text-gray-600 dark:text-gray-300">
        <li>Berikan dispensasi cuti pemulihan (wellness day) 1-2 hari.</li>
        <li>Tinjau ulang alokasi backlog sprint tim untuk re-distribusi beban tiket support.</li>
        <li>Usulkan promosi jenjang Technical Specialist pada review Q4.</li>
      </ul>
    `,
    icon: '👥'
  },
  {
    id: 2,
    title: 'Deteksi Anomali & Indikasi Fraud Klaim Biaya Reimbursement',
    module: 'Finance & Accounting',
    model: 'Gemini 1.5 Pro',
    description: 'Pemeriksaan silang nota pengeluaran dengan histori transaksi, kesesuaian plafon divisi, dan duplikasi kwitansi vendor.',
    tags: ['receipt_total', 'vendor_npwp', 'employee_role'],
    system: 'Anda adalah Corporate Forensic Auditor bersertifikasi CFE (Certified Fraud Examiner).',
    sampleInput: 'Divisi: Sales Enterprise\nKlaim: Jamuan Klien Rp 4.850.000\nVendor: Restoran Bintang 5 Sudirman\nTanggal: Sabtu malam pukul 22:30 WIB\nKwitansi: Tidak ada rincian item (hanya nominal total).',
    sampleOutput: `
      <h4 class="font-bold text-gray-900 dark:text-white mb-1">🚨 Analisis Audit Kepatuhan Pengeluaran:</h4>
      <p><strong>Status: PERLU INVESTIGASI LANJUTAN (Flagged Anomaly)</strong></p>
      <p><strong>Faktor Risiko:</strong></p>
      <ul class="list-disc list-inside space-y-1 mt-1 text-gray-600 dark:text-gray-300">
        <li>Kwitansi tanpa rincian pesanan (itemized receipt) melanggar SOP Finance Pasal 8 Ayat 2.</li>
        <li>Transaksi pada Sabtu malam di luar hari kerja operasional tanpa surat penugasan resmi (ST).</li>
        <li>Nominal Rp 4.850.000 mendekati plafon maksimal per event (Rp 5.000.000).</li>
      </ul>
      <p class="mt-2"><strong>Instruksi ke Finance Officer:</strong> Minta bukti daftar hadir klien (attendees list) dan invoice terperinci sebelum pembayaran diproses.</p>
    `,
    icon: '🔍'
  },
  {
    id: 3,
    title: 'Prediksi Kebutuhan Safety Stock Menghadapi Tren Musiman',
    module: 'Supply Chain',
    model: 'Gemini 1.5 Pro',
    description: 'Menghitung buffer stock gudang, lead time vendor, dan reorder point optimal menjelang puncak permintaan kuartal.',
    tags: ['sku_code', 'lead_time_days', 'sales_growth_pct'],
    system: 'Anda adalah Kepala Perencanaan Logistik & Supply Chain Terpadu.',
    sampleInput: 'SKU: MAT-STEEL-01 (Bahan Baku Utama)\nStok Saat Ini: 420 Unit\nKonsumsi Rata-rata: 50 Unit / Hari\nLead Time Pengiriman Vendor: 14 Hari\nProyeksi Kenaikan Order Q4: +35%',
    sampleOutput: `
      <h4 class="font-bold text-gray-900 dark:text-white mb-1">📦 Rekomendasi Pengadaan Persediaan (SCM):</h4>
      <p><strong>1. Estimasi Kebutuhan Harian Baru:</strong> 50 unit x 1.35 = <strong>67.5 Unit / Hari</strong>.</p>
      <p><strong>2. Lead Time Demand:</strong> 67.5 x 14 hari = <strong>945 Unit</strong>.</p>
      <p><strong>3. Status Stok Kritis:</strong> Stok saat ini (420 unit) hanya cukup untuk <strong>6.2 hari ke depan</strong>. Risiko <em>stockout</em> dalam 8 hari ke depan!</p>
      <p><strong>4. Tindakan Segera:</strong> Rilis Purchase Order (PO) Darurat minimal <strong>1.200 Unit</strong> ke vendor rekanan terverifikasi hari ini.</p>
    `,
    icon: '📦'
  },
  {
    id: 4,
    title: 'Strategi Negosiasi & Closing Deals Penjualan B2B Nilai Tinggi',
    module: 'Sales & CRM',
    model: 'Gemini 1.5 Pro',
    description: 'Menyusun naskah penawaran win-win, mengatasi keberatan diskon harga, dan menyusun klausul kontrak tahunan.',
    tags: ['deal_size', 'client_industry', 'objection_reason'],
    system: 'Anda adalah VP of Enterprise Sales berpengalaman menutup kontrak B2B multi-miliar.',
    sampleInput: 'Klien: PT Manufaktur Logam Prima\nNilai Deal: Rp 1.2 Miliar / Tahun\nKeberatan: "Kompetitor menawarkan harga 15% lebih murah, anggaran kami terbatas kuartal ini."',
    sampleOutput: `
      <h4 class="font-bold text-gray-900 dark:text-white mb-1">💼 Strategi Negosiasi B2B:</h4>
      <p><strong>Taktik: Jangan Menurunkan Harga Pokok, Ubah Struktur Nilai (Value Restructuring)</strong></p>
      <p><strong>Draf Respon ke Klien:</strong></p>
      <blockquote class="border-l-2 border-brand-500 pl-3 italic text-gray-600 dark:text-gray-300 mt-1">
        "Kami sangat memahami pertimbangan anggaran PT Manufaktur Logam Prima. Solusi kami mencakup garansi SLA 99.9% dan dukungan onsite engineer 24/7 yang rata-rata menghemat downtime senilai Rp 300 Juta/tahun dibandingkan opsi lain. Sebagai solusi kuartal ini, kami tawarkan skema pembayaran kuartalan (Rp 300 Juta x 4 termin) ditambah bonus gratis modul IoT Biometrik."
      </blockquote>
    `,
    icon: '🎯'
  }
])

// Simulator state
const selectedPromptId = ref<number>(1)
const simSystemPrompt = ref<string>('')
const simUserInput = ref<string>('')
const simResult = ref<string>('')
const isGenerating = ref<boolean>(false)

// Modal state
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formData = ref<any>({
  title: '',
  module: 'HR & Payroll',
  model: 'Gemini 1.5 Pro',
  description: '',
  prompt: ''
})

const getCategoryBadgeClass = (module: string) => {
  switch (module) {
    case 'HR & Payroll': return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
    case 'Finance & Accounting': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
    case 'Supply Chain': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
    case 'Sales & CRM': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
  }
}

const onPromptSelected = () => {
  const p = prompts.value.find(item => item.id === selectedPromptId.value)
  if (p) {
    simSystemPrompt.value = p.system
    simUserInput.value = p.sampleInput
    simResult.value = p.sampleOutput
  }
}

const runInSimulator = (p: any) => {
  selectedPromptId.value = p.id
  simSystemPrompt.value = p.system
  simUserInput.value = p.sampleInput
  simResult.value = p.sampleOutput
  activeView.value = 'simulator'
}

const executeAiSimulation = () => {
  isGenerating.value = true
  const currentPrompt = prompts.value.find(item => item.id === selectedPromptId.value)
  setTimeout(() => {
    isGenerating.value = false
    simResult.value = currentPrompt ? currentPrompt.sampleOutput : '<p>Analisis AI berhasil diproses.</p>'
  }, 1000)
}

const copySimResult = () => {
  alert('Rangkuman AI berhasil disalin ke papan klip.')
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data, prompt: data.system || '' }
  } else {
    formData.value = {
      title: '',
      module: 'HR & Payroll',
      model: 'Gemini 1.5 Pro',
      description: '',
      prompt: ''
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const savePrompt = () => {
  if (modalMode.value === 'edit') {
    const idx = prompts.value.findIndex(p => p.id === formData.value.id)
    if (idx !== -1) {
      prompts.value[idx] = { ...prompts.value[idx], ...formData.value }
    }
  } else {
    prompts.value.unshift({
      id: Date.now(),
      title: formData.value.title,
      module: formData.value.module,
      model: formData.value.model,
      description: formData.value.description,
      tags: ['data_input', 'parameter'],
      system: formData.value.prompt,
      sampleInput: 'Input kasus pengujian...',
      sampleOutput: '<p>Hasil analisis generatif AI telah siap.</p>',
      icon: '✨'
    })
  }
  closeModal()
}

// Initial simulator setup
onPromptSelected()
</script>
