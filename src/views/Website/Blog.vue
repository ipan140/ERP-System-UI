<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header / Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Blog & Publikasi Berita Korporat" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Media Publikasi Rilis Pers, Wawasan Industri, dan Berita Transformasi Digital Perusahaan
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="openCreatePostModal"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-500 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            + Tulis Artikel Baru
          </button>
        </div>
      </div>

      <!-- Featured Headline Article Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-950 p-8 text-white shadow-xl">
        <div class="relative z-10 max-w-3xl">
          <div class="flex items-center gap-2 mb-3">
            <span class="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Artikel Pilihan Editor
            </span>
            <span class="text-xs text-gray-300">12 Menit Membaca &bull; 10 September 2026</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Strategi Mengelola 100 - 1000 Karyawan dengan Integrasi ERP Odoo & Mekari Talenta
          </h2>
          <p class="mt-2 text-sm text-gray-300 leading-relaxed">
            Menghadapi kompleksitas operasional di era modern menuntut sinergi antara manajemen keuangan, rantai pasok, dan presensi karyawan otomatis demi pertumbuhan bisnis yang eksponensial.
          </p>
          <div class="mt-5 flex items-center gap-4">
            <div class="flex items-center gap-2 text-xs text-gray-300">
              <div class="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-[10px]">
                HP
              </div>
              <span>Dr. Hendra Pratama (CEO)</span>
            </div>
            <button
              @click="readArticle(articles[0])"
              class="rounded-xl bg-white/20 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/30 backdrop-blur-md transition-all"
            >
              Baca Artikel Lengkap &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Filter & Search -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <div
            v-for="cat in allCategoriesList"
            :key="cat"
            class="inline-flex items-center"
          >
            <button
              @click="selectedCategory = cat"
              :class="[
                'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5',
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              ]"
            >
              <span>{{ cat }}</span>
              <span
                v-if="customCategories.includes(cat)"
                @click.stop="removeCategory(cat)"
                title="Hapus Kategori"
                class="ml-1 text-[11px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-4 h-4 inline-flex items-center justify-center dark:hover:bg-red-900/40"
              >
                ×
              </span>
            </button>
          </div>
          <button
            @click="showAddCatModal = true"
            class="rounded-xl border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:bg-brand-900/20"
          >
            + Tambah Kategori
          </button>
        </div>

        <div class="relative w-full md:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul artikel..."
            class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 pl-9 pr-3 text-xs focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <svg class="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredArticles"
          :key="item.id"
          class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                {{ item.category }}
              </span>
              <span class="text-xs text-gray-400">{{ item.readTime }} baca</span>
            </div>

            <h3 class="mt-3 text-lg font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-brand-600 transition-colors cursor-pointer" @click="readArticle(item)">
              {{ item.title }}
            </h3>

            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {{ item.summary }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center dark:bg-brand-900/30 dark:text-brand-300">
                {{ item.author.charAt(0) }}
              </div>
              <div class="text-[11px]">
                <p class="font-bold text-gray-800 dark:text-white">{{ item.author }}</p>
                <p class="text-gray-400">{{ item.date }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="readArticle(item)"
                class="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400"
              >
                Baca &rarr;
              </button>
              <button
                @click="deleteArticle(item.id)"
                title="Hapus Artikel"
                class="rounded-lg p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Baca Artikel Lengkap -->
      <div v-if="selectedArticle" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="relative w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-gray-800 my-8">
          <button @click="selectedArticle = null" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <span class="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            {{ selectedArticle.category }}
          </span>

          <h2 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {{ selectedArticle.title }}
          </h2>

          <div class="mt-2 flex items-center gap-3 text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-4">
            <span>Penulis: {{ selectedArticle.author }}</span>
            <span>&bull;</span>
            <span>{{ selectedArticle.date }}</span>
            <span>&bull;</span>
            <span>{{ selectedArticle.readTime }} baca</span>
          </div>

          <div class="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            <p>{{ selectedArticle.summary }}</p>
            <p>{{ selectedArticle.content }}</p>
            <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-xs text-gray-500">
              💡 <strong>Catatan Redaksi Korporat:</strong> Opini dan materi dalam artikel ini diterbitkan untuk tujuan edukasi dan transformasi budaya kerja berkelanjutan di lingkungan PT. Nusantara Prima Solusindo.
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <button
              @click="deleteArticle(selectedArticle.id); selectedArticle = null"
              class="text-xs font-semibold text-rose-600 hover:underline"
            >
              Hapus Artikel Ini
            </button>
            <button
              @click="selectedArticle = null"
              class="rounded-xl bg-gray-100 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Tulis Artikel Baru -->
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showCreateModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Tulis Artikel Baru</h3>

          <form @submit.prevent="saveArticle" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Artikel *</label>
              <input v-model="newPost.title" required type="text" placeholder="Contoh: Mengoptimalkan Manajemen Stok dengan Barcode Scanner" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                <select v-model="newPost.category" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option v-for="cat in availableCategories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Penulis *</label>
                <input v-model="newPost.author" required type="text" placeholder="Nama Penulis / Tim Redaksi" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ringkasan Singkat *</label>
              <textarea v-model="newPost.summary" required rows="2" placeholder="Ringkasan 2-3 kalimat mengenai topik..." class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Konten Lengkap *</label>
              <textarea v-model="newPost.content" required rows="4" placeholder="Tuliskan konten artikel secara detail..." class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"></textarea>
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="showCreateModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600">Publikasikan Artikel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Tambah Kategori Baru -->
      <div v-if="showAddCatModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showAddCatModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>📁</span> Tambah Kategori Blog
          </h3>
          <p class="text-xs text-gray-500 mb-4">Tambahkan kategori rubrik baru untuk memilah artikel publikasi.</p>

          <form @submit.prevent="addCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Kategori *</label>
              <input
                v-model="newCatName"
                required
                type="text"
                placeholder="Contoh: CSR & Lingkungan, Finansial & Pajak"
                class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="showAddCatModal = false" class="rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">Simpan Kategori</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

interface Article {
  id: number
  title: string
  category: string
  author: string
  date: string
  readTime: string
  summary: string
  content: string
}

const showCreateModal = ref(false)
const showAddCatModal = ref(false)
const newCatName = ref('')
const selectedArticle = ref<Article | null>(null)
const selectedCategory = ref('Semua')
const searchQuery = ref('')

const baseCategories = [
  'Transformasi Digital',
  'HR & Budaya Kerja',
  'Strategi Bisnis',
  'Teknologi & IT',
]
const customCategories = ref<string[]>([])

const availableCategories = computed(() => {
  return [...baseCategories, ...customCategories.value]
})

const allCategoriesList = computed(() => {
  return ['Semua', ...availableCategories.value]
})

function addCategory() {
  const trimmed = newCatName.value.trim()
  if (trimmed && !availableCategories.value.includes(trimmed)) {
    customCategories.value.push(trimmed)
    selectedCategory.value = trimmed
    newCatName.value = ''
    showAddCatModal.value = false
  }
}

function removeCategory(cat: string) {
  customCategories.value = customCategories.value.filter((c) => c !== cat)
  if (selectedCategory.value === cat) {
    selectedCategory.value = 'Semua'
  }
}

function deleteArticle(id: number) {
  articles.value = articles.value.filter((a) => a.id !== id)
}

const articles = ref<Article[]>([
  {
    id: 1,
    title: 'Strategi Mengelola 100 - 1000 Karyawan dengan Integrasi ERP Odoo & Mekari Talenta',
    category: 'Transformasi Digital',
    author: 'Dr. Hendra Pratama',
    date: '10 Sep 2026',
    readTime: '6 Menit',
    summary: 'Penerapan sistem terpusat memungkinkan monitoring KPI, absensi otomatis, dan pelacakan arus kas secara real-time tanpa friksi manual.',
    content: 'Dalam organisasi dengan ratusan staf, komunikasi terfragmentasi dan birokrasi manual seringkali menjadi penghambat utama pertumbuhan. Dengan mengintegrasikan sistem modular ala Odoo yang mencakup supply chain dan finance, dipadukan dengan portal mandiri karyawan berbasis standar Mekari Talenta, transparansi data dapat dicapai secara instan.',
  },
  {
    id: 2,
    title: 'Pentingnya Kepatuhan UU Perlindungan Data Pribadi (UU PDP) bagi Perusahaan Skala Menengah',
    category: 'Teknologi & IT',
    author: 'Bambang Wicaksono, M.Kom',
    date: '08 Sep 2026',
    readTime: '5 Menit',
    summary: 'Bagaimana enkripsi data karyawan, hak akses berbasis RBAC, dan audit trail melindungi reputasi dan integritas perusahaan.',
    content: 'Kepatuhan terhadap regulasi privasi bukan lagi pilihan opsional. Sistem ERP yang tangguh harus menerapkan arsitektur Role-Based Access Control (RBAC) yang ketat, memastikan hanya pihak berwenang yang dapat mengakses data gaji dan identitas personil.',
  },
  {
    id: 3,
    title: 'Membangun Jalur Karir & Retensi Karyawan Melalui Penilaian Kinerja Transparan',
    category: 'HR & Budaya Kerja',
    author: 'Rina Sulistyowati, S.Psi',
    date: '04 Sep 2026',
    readTime: '4 Menit',
    summary: 'Metodologi evaluasi kinerja berkala yang menumbuhkan motivasi kerja dan mengurangi turnover talenta berharga.',
    content: 'Karyawan ingin mengetahui ke mana arah perkembangan karir mereka. Evaluasi performa bukan sekadar mencari kesalahan, melainkan sarana evaluasi objektif yang terhubung langsung dengan kenaikan jenjang karir dan bonus prestasi.',
  },
  {
    id: 4,
    title: 'Otomatisasi Invoice & Rekonsiliasi Bank: Menghemat 40 Jam Kerja Divisi Finance',
    category: 'Strategi Bisnis',
    author: 'Dewi Sartika, S.E., Ak.',
    date: '01 Sep 2026',
    readTime: '4 Menit',
    summary: 'Studi kasus pemotongan alur birokrasi penagihan dan pencocokan rekening koran secara instan di ERP.',
    content: 'Pencatatan faktur manual rentan terhadap human error dan keterlambatan pembayaran. Dengan fitur rekonsiliasi otomatis dan auto-matching tagihan, cash flow perusahaan menjadi jauh lebih sehat dan terprediksi.',
  },
])

const newPost = ref({
  title: '',
  category: 'Transformasi Digital',
  author: 'Tim Redaksi Korporat',
  summary: '',
  content: '',
})

const filteredArticles = computed(() => {
  return articles.value.filter((a) => {
    const matchesCategory = selectedCategory.value === 'Semua' || a.category === selectedCategory.value
    const matchesSearch =
      !searchQuery.value ||
      a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

function readArticle(item: Article) {
  selectedArticle.value = item
}

function openCreatePostModal() {
  newPost.value = {
    title: '',
    category: 'Transformasi Digital',
    author: 'Tim Redaksi Korporat',
    summary: '',
    content: '',
  }
  showCreateModal.value = true
}

function saveArticle() {
  articles.value.unshift({
    id: Date.now(),
    date: 'Hari ini',
    readTime: '3 Menit',
    ...newPost.value,
  })
  showCreateModal.value = false
}
</script>
