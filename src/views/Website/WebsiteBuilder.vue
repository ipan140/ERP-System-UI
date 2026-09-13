<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Website Builder & Corporate CMS" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pengelolaan Halaman Web Korporat, Pengumuman Intranet, dan Konfigurasi Portal
          </p>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="openCreateAnnouncementModal"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-500 py-2 px-4 text-sm font-semibold text-white hover:bg-brand-600 transition-all shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            + Siarkan Pengumuman
          </button>
          <router-link
            to="/website/careers"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-300 py-2 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Preview Portal Karir &rarr;
          </router-link>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'announcements'"
          :class="[
            'py-3 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'announcements'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/40 dark:bg-brand-900/10 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <span>📢 Pengumuman & Berita Intranet</span>
          <span class="rounded-full bg-brand-100 text-brand-700 px-2 py-0.5 text-[10px] font-bold dark:bg-brand-900/40 dark:text-brand-300">
            {{ announcements.length }}
          </span>
        </button>

        <button
          @click="activeTab = 'pages'"
          :class="[
            'py-3 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'pages'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/40 dark:bg-brand-900/10 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <span>📄 Halaman Publik & Konten CMS</span>
        </button>

        <button
          @click="activeTab = 'settings'"
          :class="[
            'py-3 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'settings'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/40 dark:bg-brand-900/10 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <span>⚙️ Konfigurasi Integrasi Odoo/Mekari</span>
        </button>
      </div>

      <!-- TAB 1: PENGUMUMAN INTRANET -->
      <div v-if="activeTab === 'announcements'" class="space-y-4">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-gray-800 dark:text-white text-base">Daftar Pengumuman Resmi Perusahaan</h3>
              <p class="text-xs text-gray-500">Pengumuman ini ditampilkan di Dashboard Karyawan, Portal ESS, dan Intranet.</p>
            </div>
            <button
              @click="fetchAnnouncements"
              class="text-xs text-brand-600 font-semibold hover:underline"
            >
              Segarkan Data
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-900/40 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th class="py-3 px-4">Judul Pengumuman</th>
                  <th class="py-3 px-4">Kategori</th>
                  <th class="py-3 px-4">Penerbit</th>
                  <th class="py-3 px-4">Status Pin</th>
                  <th class="py-3 px-4">Tanggal Rilis</th>
                  <th class="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="isLoading">
                  <td colspan="6" class="py-8 text-center text-gray-500">Memuat pengumuman...</td>
                </tr>
                <tr v-for="item in announcements" :key="item.id" class="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                  <td class="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                    <div class="flex items-center gap-2">
                      <span v-if="item.is_pinned" class="text-red-500" title="Disematkan">📌</span>
                      <span>{{ item.title }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {{ item.category }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-300">{{ item.author }}</td>
                  <td class="py-3.5 px-4 text-xs">
                    <span :class="item.is_pinned ? 'text-emerald-600 font-bold' : 'text-gray-400'">
                      {{ item.is_pinned ? 'Highlight' : 'Normal' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-xs text-gray-500">{{ formatDate(item.created_at) }}</td>
                  <td class="py-3.5 px-4 text-right">
                    <button @click="viewAnnouncement(item)" class="text-xs text-brand-600 font-semibold hover:text-brand-700 mr-2">
                      Baca
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: HALAMAN PUBLIK & CMS -->
      <div v-else-if="activeTab === 'pages'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(page, idx) in cmsPages"
          :key="idx"
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Aktif Publik
              </span>
              <span class="text-xs text-gray-400">{{ page.slug }}</span>
            </div>
            <h4 class="mt-3 text-lg font-bold text-gray-900 dark:text-white">{{ page.title }}</h4>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ page.description }}</p>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span class="text-xs text-gray-400">{{ page.views }} pengunjung</span>
            <router-link
              :to="page.link"
              class="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Buka Halaman &rarr;
            </router-link>
          </div>
        </div>
      </div>

      <!-- TAB 3: KONFIGURASI INTEGRASI ENTERPRISE -->
      <div v-else class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 max-w-3xl space-y-6">
        <h3 class="font-bold text-gray-900 dark:text-white text-lg">
          Parameter Skala Enterprise (100 - 1000 Karyawan)
        </h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/60 dark:border-gray-700 dark:bg-gray-900/30">
            <div>
              <h5 class="text-sm font-bold text-gray-800 dark:text-white">Sinkronisasi Lowongan Kerja Otomatis</h5>
              <p class="text-xs text-gray-500">Mempublikasikan posisi pekerjaan berstatus "recruit" dari modul HR langsung ke Website Karir.</p>
            </div>
            <input type="checkbox" checked class="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" />
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/60 dark:border-gray-700 dark:bg-gray-900/30">
            <div>
              <h5 class="text-sm font-bold text-gray-800 dark:text-white">Integrasi Pelamar ke HR Kanban Recruitment</h5>
              <p class="text-xs text-gray-500">Pelamar yang mengisi formulir karir langsung dimasukkan ke database pelamar HRD tanpa perantara.</p>
            </div>
            <input type="checkbox" checked class="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" />
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/60 dark:border-gray-700 dark:bg-gray-900/30">
            <div>
              <h5 class="text-sm font-bold text-gray-800 dark:text-white">Notifikasi Town Hall & Kebijakan ke Seluruh Karyawan</h5>
              <p class="text-xs text-gray-500">Menampilkan banner pengumuman darurat atau kebijakan baru pada sesi login karyawan.</p>
            </div>
            <input type="checkbox" checked class="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" />
          </div>
        </div>
      </div>

      <!-- Modal Tambah Pengumuman -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Siarkan Pengumuman Korporat Baru</h3>

          <form @submit.prevent="submitAnnouncement" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Pengumuman *</label>
              <input v-model="form.title" required type="text" placeholder="Contoh: Jadwal Libur Nasional & Kebijakan Cuti Bersama 2026" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                <select v-model="form.category" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option value="Corporate">Corporate & Direksi</option>
                  <option value="HR Policy">HR Policy & BPJS</option>
                  <option value="Training & Compliance">Pelatihan & Kepatuhan</option>
                  <option value="Recognition">Prestasi & Penghargaan</option>
                  <option value="General">Umum</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Penerbit (Author) *</label>
                <input v-model="form.author" required type="text" placeholder="Contoh: Divisi HRD" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Isi Lengkap Pengumuman *</label>
              <textarea v-model="form.content" required rows="4" placeholder="Tuliskan detail pengumuman resmi..." class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"></textarea>
            </div>

            <div class="flex items-center gap-2">
              <input v-model="form.is_pinned" type="checkbox" id="pinnedCheck" class="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
              <label for="pinnedCheck" class="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Sematkan sebagai Berita Prioritas (Pinned / Highlight)
              </label>
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="showModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600">Publikasikan Pengumuman</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const activeTab = ref<'announcements' | 'pages' | 'settings'>('announcements')
const showModal = ref(false)
const isLoading = ref(false)

const announcements = ref<any[]>([])

const cmsPages = ref([
  {
    title: 'Portal Karir & Rekrutmen Terpadu',
    slug: '/website/careers',
    description: 'Halaman publik lowongan kerja dengan formulir lamaran langsung terhubung ke database HR.',
    views: '1,420',
    link: '/website/careers',
  },
  {
    title: 'Employee Self Service (ESS)',
    slug: '/hr/employee-portal',
    description: 'Portal mandiri bagi 100+ karyawan untuk cek slip gaji, riwayat SP, dan absensi.',
    views: '3,890',
    link: '/hr/employee-portal',
  },
  {
    title: 'Corporate e-Learning & Training',
    slug: '/website/elearning',
    description: 'LMS pelatihan wajib keselamatan kerja (K3), kepatuhan IT, dan orientasi onboarding.',
    views: '950',
    link: '/website/elearning',
  },
])

const form = ref({
  title: '',
  category: 'Corporate',
  author: 'Divisi HR & Direksi',
  content: '',
  is_pinned: false,
})

function formatDate(iso: string) {
  if (!iso) return 'Hari ini'
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '-'
  }
}

function openCreateAnnouncementModal() {
  form.value = {
    title: '',
    category: 'Corporate',
    author: 'Divisi HR & Direksi',
    content: '',
    is_pinned: false,
  }
  showModal.value = true
}

function viewAnnouncement(item: any) {
  alert(`📢 ${item.title}\n\nPenerbit: ${item.author} (${item.category})\n\n${item.content}`)
}

async function fetchAnnouncements() {
  isLoading.value = true
  try {
    const res = await fetch('http://localhost:7070/api/website/announcements')
    if (res.ok) {
      const json = await res.json()
      if (json.data) announcements.value = json.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function submitAnnouncement() {
  try {
    const token = localStorage.getItem('token') || ''
    const res = await fetch('http://localhost:7070/api/website/website_builder/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(form.value),
    })
    if (res.ok) {
      showModal.value = false
      fetchAnnouncements()
    } else {
      // Fallback local add
      announcements.value.unshift({
        ...form.value,
        id: Date.now(),
        created_at: new Date().toISOString(),
      })
      showModal.value = false
    }
  } catch {
    showModal.value = false
  }
}

onMounted(() => {
  fetchAnnouncements()
})
</script>
