<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Knowledge Base & SOP Perusahaan" />
        
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="openCreateModal"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-center text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tulis Artikel / SOP Baru
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total SOP & Panduan</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{{ articles.length }} Dokumen</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Tersedia untuk seluruh unit bisnis</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Pembaca Aktif</p>
              <h4 class="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">248 Pegawai</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-success-50 text-success-500 dark:bg-success-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Tingkat kepatuhan SOP 94.2%</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Rata-rata Waktu Baca</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">6 Menit</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Ringkas, padat & mudah dipahami</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status Pengesahan</p>
              <h4 class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">Sah Direksi 2025</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Sesuai Regulasi Kemenaker & ISO</p>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Category Badges -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in ['Semua', 'HR & Kepegawaian', 'Finance & Pajak', 'SCM & Gudang', 'IT & Keamanan']"
            :key="cat"
            @click="selectedCategory = cat"
            :class="selectedCategory === cat ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
            class="rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Search input -->
        <div class="relative w-full sm:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari SOP, kebijakan, pedoman cuti..."
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      <!-- Article Grid -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs hover:border-brand-300 hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 cursor-pointer"
          @click="readArticle(article)"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span
                :class="getCategoryBadgeClass(article.category)"
                class="rounded-md px-2.5 py-0.5 text-2xs font-semibold"
              >
                {{ article.category }}
              </span>
              <span class="text-2xs text-gray-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ article.reading_time }}
              </span>
            </div>

            <h3 class="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 hover:text-brand-500 transition-colors">
              {{ article.title }}
            </h3>

            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {{ article.summary }}
            </p>
          </div>

          <div class="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800 text-xs text-gray-400">
            <span class="flex items-center gap-1.5">
              <span>👤</span> {{ article.author }}
            </span>
            <span class="flex items-center gap-1 text-brand-500 font-medium">
              Baca SOP &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Baca Artikel Lengkap -->
  <Teleport to="body">
    <div v-if="activeArticle" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <span :class="getCategoryBadgeClass(activeArticle.category)" class="rounded-md px-2.5 py-0.5 text-2xs font-semibold mb-2 inline-block">
              {{ activeArticle.category }}
            </span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ activeArticle.title }}</h2>
            <p class="text-xs text-gray-400 mt-1">
              Disusun oleh {{ activeArticle.author }} • Diperbarui {{ activeArticle.updated_at }} • Estimasi baca {{ activeArticle.reading_time }}
            </p>
          </div>
          <button @click="activeArticle = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Article Content -->
        <div class="my-6 space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
          <div class="rounded-xl bg-brand-50/60 p-4 border border-brand-100 text-brand-900 dark:bg-brand-500/10 dark:border-brand-800 dark:text-brand-300 text-xs">
            <strong>Ringkasan Kebijakan:</strong> {{ activeArticle.summary }}
          </div>

          <div class="space-y-3 pt-2" v-html="activeArticle.content"></div>
        </div>

        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <span class="text-xs text-gray-400">Dokumen Resmi PT Nusa Maju Bersama</span>
          <div class="flex gap-2">
            <button
              @click="activeArticle = null"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Tutup
            </button>
            <button
              @click="printArticle"
              class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Dokumen SOP
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal Tulis SOP Baru -->
  <Teleport to="body">
    <div v-if="isCreateModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Buat Artikel / SOP Baru</h3>
          <button @click="isCreateModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveArticle" class="space-y-4 my-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Dokumen SOP</label>
            <input
              v-model="newArticle.title"
              type="text"
              required
              placeholder="Contoh: Prosedur Pengajuan Lembur & Approval Manager"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori Departemen</label>
              <select
                v-model="newArticle.category"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="HR & Kepegawaian">HR & Kepegawaian</option>
                <option value="Finance & Pajak">Finance & Pajak</option>
                <option value="SCM & Gudang">SCM & Gudang</option>
                <option value="IT & Keamanan">IT & Keamanan</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimasi Waktu Baca</label>
              <input
                v-model="newArticle.reading_time"
                type="text"
                placeholder="5 Menit"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ringkasan Eksekutif</label>
            <textarea
              v-model="newArticle.summary"
              rows="2"
              required
              placeholder="Uraikan intisari prosedur ini..."
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Isi Lengkap Dokumen (Mendukung Teks Rinci)</label>
            <textarea
              v-model="newArticle.content"
              rows="5"
              required
              placeholder="1. Tujuan Prosedur...&#10;2. Pihak Terlibat...&#10;3. Langkah-langkah..."
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono text-xs"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="isCreateModalOpen = false"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600"
            >
              Publikasikan ke Wiki
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

interface IArticle {
  id: number
  title: string
  category: 'HR & Kepegawaian' | 'Finance & Pajak' | 'SCM & Gudang' | 'IT & Keamanan'
  summary: string
  content: string
  author: string
  reading_time: string
  updated_at: string
}

const articles = ref<IArticle[]>([
  {
    id: 1,
    title: 'Buku Panduan Karyawan Baru (Employee Handbook 2025)',
    category: 'HR & Kepegawaian',
    summary: 'Pedoman lengkap orientasi dan budaya korporat bagi 100-1000 karyawan: jam kerja, dress code, tunjangan BPJS, dan hak asuransi.',
    content: `
      <h4 class="font-bold text-gray-900 dark:text-white">1. Jam Kerja & Presensi</h4>
      <p>Jam kerja reguler adalah Senin s.d. Jumat pukul 08.30 - 17.30 WIB dengan istirahat 1 jam. Presensi wajib dilakukan melalui mesin biometrik atau mobile GPS portal sebelum pukul 08.45 WIB.</p>
      <h4 class="font-bold text-gray-900 dark:text-white mt-3">2. Tunjangan & Asuransi</h4>
      <p>Seluruh pegawai tetap dan PKWT didaftarkan pada BPJS Ketenagakerjaan (JKK, JKM, JHT, JP) dan BPJS Kesehatan sejak hari pertama kerja. Plafon rawat inap tambahan berlaku setelah masa percobaan 3 bulan.</p>
    `,
    author: 'HR People & Culture Lead',
    reading_time: '12 Menit',
    updated_at: '10 September 2025'
  },
  {
    id: 2,
    title: 'SOP Pengajuan Cuti Tahunan, Izin Sakit & Cuti Melahirkan',
    category: 'HR & Kepegawaian',
    summary: 'Mekanisme mandiri pengajuan kuota 12 hari cuti tahunan, dispensasi khusus berbayar, dan SLA persetujuan atasan langsung.',
    content: `
      <h4 class="font-bold text-gray-900 dark:text-white">1. Prosedur Cuti Tahunan</h4>
      <p>Pengajuan wajib diajukan minimal 3 hari kerja sebelum tanggal pelaksanaan melalui menu Self-Service Portal Karyawan.</p>
      <h4 class="font-bold text-gray-900 dark:text-white mt-3">2. Izin Sakit</h4>
      <p>Izin sakit lebih dari 1 (satu) hari kalender wajib melampirkan Surat Keterangan Dokter berizin resmi dengan diagnosa medis.</p>
    `,
    author: 'HR Operations',
    reading_time: '5 Menit',
    updated_at: '08 September 2025'
  },
  {
    id: 3,
    title: 'Pedoman Klaim Reimbursement Rawat Jalan & Perjalanan Dinas',
    category: 'Finance & Pajak',
    summary: 'Ketentuan nota kuitansi bermeterai, plafon kacamata tahunan Rp 1.500.000, serta uang saku perjalanan dinas luar kota.',
    content: `
      <h4 class="font-bold text-gray-900 dark:text-white">1. Nota & Bukti Pembayaran</h4>
      <p>Semua kuitansi rawat jalan wajib mencantumkan nama pegawai dan cap stempel klinik/rumah sakit. Batas pengajuan adalah tanggal 20 setiap bulannya.</p>
      <h4 class="font-bold text-gray-900 dark:text-white mt-3">2. Perjalanan Dinas</h4>
      <p>Tiket transportasi dan hotel bintang 3/4 dipesan terpusat oleh General Affairs. Uang saku harian ditransfer via Payroll pada hari kepulangan.</p>
    `,
    author: 'Finance & Accounting Lead',
    reading_time: '7 Menit',
    updated_at: '02 September 2025'
  },
  {
    id: 4,
    title: 'SOP Pengadaan Barang & Approval Purchase Order (PO) > Rp 50 Juta',
    category: 'SCM & Gudang',
    summary: 'Kebijakan 3 vendor pembanding (tender komparatif) dan matriks tanda tangan otorisasi berjenjang untuk integritas pengeluaran.',
    content: `
      <h4 class="font-bold text-gray-900 dark:text-white">1. Batas Nominal & Matriks Approval</h4>
      <p>Nilai pengadaan Rp 1 - 50 Juta disetujui Department Head. Nilai > Rp 50 Juta wajib melampirkan minimal 3 penawaran vendor dan disetujui oleh Direktur Keuangan.</p>
    `,
    author: 'Procurement Specialist',
    reading_time: '8 Menit',
    updated_at: '25 Agustus 2025'
  },
  {
    id: 5,
    title: 'Standar K3, APD, dan Keselamatan Gudang Distribusi Cikarang',
    category: 'SCM & Gudang',
    summary: 'Prosedur keselamatan kerja area bongkar muat, kewajiban sepatu safety boot, helm pelindung, dan batas kecepatan forklift 10 km/jam.',
    content: `
      <h4 class="font-bold text-gray-900 dark:text-white">1. Alat Pelindung Diri (APD)</h4>
      <p>Setiap orang yang memasuki zona gudang wajib mengenakan helm keselamatan, rompi high-visibility, dan sepatu boot berujung baja (steel-toe).</p>
    `,
    author: 'Warehouse HSE Officer',
    reading_time: '10 Menit',
    updated_at: '15 Agustus 2025'
  },
  {
    id: 6,
    title: 'Protokol Keamanan Password, Otentikasi 2FA, & Anti-Phishing',
    category: 'IT & Keamanan',
    summary: 'Standar kata sandi minimum 12 karakter alfanumerik, aktivasi TOTP authenticator untuk hak akses ERP, dan cara lapor insiden siber.',
    content: `
      <h4 class="font-bold text-gray-900 dark:text-white">1. Kebijakan Kredensial</h4>
      <p>Kata sandi akun ERP kedaluwarsa otomatis setiap 90 hari. Dilarang menggunakan password berulang atau membagikan akun kepada rekan kerja.</p>
    `,
    author: 'Chief Information Security Officer',
    reading_time: '6 Menit',
    updated_at: '11 September 2025'
  }
])

const searchQuery = ref('')
const selectedCategory = ref('Semua')
const activeArticle = ref<IArticle | null>(null)

// Create modal
const isCreateModalOpen = ref(false)
const newArticle = ref<Partial<IArticle>>({
  title: '',
  category: 'HR & Kepegawaian',
  summary: '',
  content: '',
  reading_time: '5 Menit'
})

const filteredArticles = computed(() => {
  return articles.value.filter(art => {
    const matchesCategory = selectedCategory.value === 'Semua' || art.category === selectedCategory.value
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'HR & Kepegawaian': return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
    case 'Finance & Pajak': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
    case 'SCM & Gudang': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
    case 'IT & Keamanan': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
  }
}

const readArticle = (art: IArticle) => {
  activeArticle.value = art
}

const openCreateModal = () => {
  newArticle.value = {
    title: '',
    category: 'HR & Kepegawaian',
    summary: '',
    content: '',
    reading_time: '5 Menit'
  }
  isCreateModalOpen.value = true
}

const saveArticle = () => {
  const item: IArticle = {
    id: Date.now(),
    title: newArticle.value.title || 'SOP Baru',
    category: newArticle.value.category as any,
    summary: newArticle.value.summary || '-',
    content: `<p>${newArticle.value.content?.replace(/\n/g, '<br/>') || ''}</p>`,
    author: 'Superadmin',
    reading_time: newArticle.value.reading_time || '5 Menit',
    updated_at: 'Hari ini'
  }
  articles.value.unshift(item)
  isCreateModalOpen.value = false
}

const printArticle = () => {
  window.print()
}
</script>

