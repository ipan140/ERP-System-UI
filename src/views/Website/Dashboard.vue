<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header / Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Enterprise & Portal Korporat
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ekosistem Terintegrasi Website, Karir Publik, dan Modul HR Kepegawaian (Standar Odoo & Mekari)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <router-link
            to="/website/careers"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Buka Portal Karir
          </router-link>
          <router-link
            to="/hr/employee-portal"
            class="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Portal Mandiri (ESS)
          </router-link>
        </div>
      </div>

      <!-- Enterprise Metrics KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Metric 1: Total Karyawan -->
        <router-link
          to="/hr/employees"
          class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Karyawan Aktif</span>
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ stats.total_employees || 105 }}</span>
            <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">+12 bulan ini</span>
          </div>
          <p class="mt-1 text-xs text-gray-400">Skala 100 - 1000 Karyawan</p>
        </router-link>

        <!-- Metric 2: Lowongan Karir -->
        <router-link
          to="/website/careers"
          class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Posisi Lowongan Karir</span>
            <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ stats.active_job_positions || 29 }}</span>
            <span class="text-xs font-medium text-purple-600">Lintas 6 Divisi</span>
          </div>
          <p class="mt-1 text-xs text-gray-400">Publikasi Portal Karir</p>
        </router-link>

        <!-- Metric 3: Pelamar Masuk -->
        <router-link
          to="/hr/recruitment"
          class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pelamar Terdaftar</span>
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ stats.total_applicants || 9 }}</span>
            <span class="text-xs font-medium text-amber-600">Pipeline Aktif</span>
          </div>
          <p class="mt-1 text-xs text-gray-400">Terhubung ke Pipeline HRD</p>
        </router-link>

        <!-- Metric 4: Pengumuman & Pelatihan -->
        <router-link
          to="/website/elearning"
          class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">LMS & Pelatihan Wajib</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-gray-900 dark:text-white">4</span>
            <span class="text-xs font-medium text-emerald-600">Modul Kepatuhan</span>
          </div>
          <p class="mt-1 text-xs text-gray-400">K3, Onboarding & Cyber</p>
        </router-link>
      </div>

      <!-- Quick Ecosystem Navigation -->
      <div class="rounded-3xl bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 p-6 text-white shadow-lg">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold">Pusat Integrasi Ekosistem Odoo & Mekari Talenta</h2>
            <p class="text-xs text-gray-300 mt-1">
              Akses cepat ke seluruh sub-sistem utama untuk operasional 100 - 1000 personil perusahaan
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <router-link to="/hr/org-chart" class="rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-medium hover:bg-white/20 transition-all border border-white/10">
              🏢 Struktur Organisasi
            </router-link>
            <router-link to="/hr/attendances" class="rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-medium hover:bg-white/20 transition-all border border-white/10">
              ⏱️ Presensi & Shift
            </router-link>
            <router-link to="/hr/payroll" class="rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-medium hover:bg-white/20 transition-all border border-white/10">
              💰 Penggajian / Payroll
            </router-link>
            <router-link to="/hr/thr-calculator" class="rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-medium hover:bg-white/20 transition-all border border-white/10">
              🎁 Kalkulator THR
            </router-link>
          </div>
        </div>
      </div>

      <!-- Two Column Layout: Announcements & Recent Applicants -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Announcements (7 cols) -->
        <div class="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base">
                Papan Pengumuman Korporat & Intranet
              </h3>
              <p class="text-xs text-gray-500">Berita resmi yang disiarkan oleh Direksi dan HRD</p>
            </div>
            <router-link
              to="/website/website_builder"
              class="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Kelola Pengumuman &rarr;
            </router-link>
          </div>

          <div class="space-y-4">
            <div
              v-for="item in announcements"
              :key="item.id"
              class="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:bg-gray-50 dark:border-gray-700/60 dark:bg-gray-900/40"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2">
                  <span
                    v-if="item.is_pinned"
                    class="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  >
                    Penting
                  </span>
                  <span class="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ item.category }}
                  </span>
                </div>
                <span class="text-[11px] text-gray-400">{{ formatDate(item.created_at) }}</span>
              </div>

              <h4 class="mt-2 text-sm font-bold text-gray-800 dark:text-white">
                {{ item.title }}
              </h4>

              <p class="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                {{ item.content }}
              </p>

              <div class="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-gray-400">
                <span>Penerbit: {{ item.author }}</span>
                <span class="text-brand-600 dark:text-brand-400 font-medium">Internal Korporat</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Applicants (5 cols) -->
        <div class="lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base">
                Pelamar Karir Terbaru
              </h3>
              <p class="text-xs text-gray-500">Masuk dari formulir Website Karir</p>
            </div>
            <router-link
              to="/hr/recruitment"
              class="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Lihat Pipeline &rarr;
            </router-link>
          </div>

          <div class="space-y-3">
            <div
              v-for="(app, idx) in recentApplicants"
              :key="idx"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/30"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center font-bold text-xs text-brand-700 dark:text-brand-300">
                  {{ app.name.charAt(0) }}
                </div>
                <div>
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white">{{ app.name }}</h5>
                  <p class="text-[11px] text-gray-500">{{ app.position }}</p>
                </div>
              </div>
              <span class="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                {{ app.stage }}
              </span>
            </div>
          </div>

          <!-- Direct Links Box -->
          <div class="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <h5 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Panduan Penggunaan:</h5>
            <ul class="text-[11px] space-y-1.5 text-gray-500 dark:text-gray-400">
              <li>&bull; Pelamar di website otomatis mengalir ke Kanban HR Recruitment.</li>
              <li>&bull; Karyawan dapat mengakses slip gaji privat di Portal ESS.</li>
              <li>&bull; Publikasi pengumuman perusahaan dapat dikelola di Website Builder.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

interface Stats {
  total_employees: number
  active_job_positions: number
  total_applicants: number
  total_departments: number
  total_announcements: number
}

interface Announcement {
  id: number
  title: string
  category: string
  content: string
  author: string
  is_pinned: boolean
  created_at: string
}

const stats = ref<Partial<Stats>>({
  total_employees: 105,
  active_job_positions: 29,
  total_applicants: 9,
  total_departments: 6,
  total_announcements: 4,
})

const announcements = ref<Announcement[]>([
  {
    id: 1,
    title: 'Town Hall Q3 2026: Pencapaian Kinerja & Roadmap Digitalisasi ERP',
    category: 'Corporate',
    content: 'Seluruh karyawan diundang untuk menghadiri pertemuan Town Hall pada hari Jumat pukul 14.00 WIB secara hybrid di Auditorium Utama dan Zoom.',
    author: 'Direksi Perusahaan',
    is_pinned: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Pembaruan Kebijakan Klaim Medis & BPJS Ketenagakerjaan 2026',
    category: 'HR Policy',
    content: 'Mulai periode September 2026, integrasi sistem klaim asuransi rawat jalan dapat langsung diajukan melalui Portal Karyawan ESS.',
    author: 'Divisi HR & People Operations',
    is_pinned: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Pelatihan Wajib: Keamanan Siber & Perlindungan Data Pribadi (UU PDP)',
    category: 'Training & Compliance',
    content: 'Diberitahukan kepada seluruh karyawan untuk menyelesaikan modul pelatihan Cyber Security Awareness di menu Website e-Learning sebelum akhir bulan ini.',
    author: 'IT Security & Compliance',
    is_pinned: false,
    created_at: new Date().toISOString(),
  },
])

const recentApplicants = ref([
  { name: 'Guruh Wicaksono', position: 'Senior Backend Go Engineer', stage: 'Tes Teknis & User' },
  { name: 'Nadia Safitri', position: 'Talent Acquisition Lead', stage: 'Wawancara HR' },
  { name: 'Clarissa Amanda', position: 'Senior Tax Specialist', stage: 'Offering Letter' },
  { name: 'Kevin Sanjaya', position: 'B2B Key Account Manager', stage: 'Screening Berkas' },
  { name: 'Farah Diba', position: 'QA Automation Engineer', stage: 'Wawancara HR' },
])

function formatDate(iso: string): string {
  if (!iso) return 'Hari ini'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return 'Baru saja'
  }
}

async function fetchStats() {
  try {
    const res = await fetch('http://localhost:7070/api/website/stats')
    if (res.ok) {
      const json = await res.json()
      if (json.data) {
        stats.value = json.data
      }
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

async function fetchAnnouncements() {
  try {
    const res = await fetch('http://localhost:7070/api/website/announcements')
    if (res.ok) {
      const json = await res.json()
      if (json.data && json.data.length > 0) {
        announcements.value = json.data
      }
    }
  } catch (err) {
    console.error('Failed to fetch announcements:', err)
  }
}

onMounted(() => {
  fetchStats()
  fetchAnnouncements()
})
</script>
