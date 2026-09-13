<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header / Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Forum Komunitas & Kolaborasi Karyawan" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Wadah Diskusi Terbuka, Tanya Jawab Solusi Teknis, dan Berbagi Pengetahuan (Standar Odoo Forum)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="openNewThreadModal"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-500 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            + Mulai Diskusi Baru
          </button>
        </div>
      </div>

      <!-- Overview Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <span class="text-xs font-semibold text-gray-500">Total Topik Diskusi</span>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ threads.length }}</span>
            <span class="text-xs text-blue-600 font-semibold">Aktif</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Lintas Divisi & Departemen</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <span class="text-xs font-semibold text-gray-500">Terselesaikan (Solved)</span>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">92%</span>
            <span class="text-xs text-emerald-600 font-semibold">High Resolution</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Solusi Terverifikasi</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <span class="text-xs font-semibold text-gray-500">Total Jawaban & Solusi</span>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">48</span>
            <span class="text-xs text-purple-600 font-semibold">Kontribusi Tim</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Kolaborasi Pengetahuan</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <span class="text-xs font-semibold text-gray-500">Personil Berpartisipasi</span>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-gray-900 dark:text-white">65</span>
            <span class="text-xs text-amber-600 font-semibold">Karyawan</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Dari 100+ Total Personil</p>
        </div>
      </div>

      <!-- Filters & Category Navigation -->
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
            placeholder="Cari topik diskusi..."
            class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 pl-9 pr-3 text-xs focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <svg class="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Thread List -->
      <div class="space-y-4">
        <div
          v-for="thread in filteredThreads"
          :key="thread.id"
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-brand-300 transition-all dark:border-gray-800 dark:bg-gray-800"
        >
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div class="flex items-start gap-4">
              <!-- Upvote counter -->
              <div class="flex flex-col items-center justify-center rounded-xl bg-gray-50 px-3 py-2 border border-gray-200 dark:bg-gray-700/50 dark:border-gray-700 text-center min-w-[50px]">
                <button @click="upvote(thread)" class="text-gray-400 hover:text-brand-500">
                  ▲
                </button>
                <span class="text-xs font-bold text-gray-800 dark:text-white">{{ thread.votes }}</span>
                <span class="text-[10px] text-gray-400">Vote</span>
              </div>

              <div>
                <div class="flex items-center gap-2">
                  <span
                    v-if="thread.is_solved"
                    class="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center gap-1"
                  >
                    ✓ Solved
                  </span>
                  <span class="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {{ thread.category }}
                  </span>
                </div>

                <h3
                  @click="openThreadDetail(thread)"
                  class="mt-2 text-base font-bold text-gray-900 dark:text-white hover:text-brand-600 transition-colors cursor-pointer"
                >
                  {{ thread.title }}
                </h3>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ thread.content }}
                </p>

                <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                    <div class="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center">
                      {{ thread.author.charAt(0) }}
                    </div>
                    <span>{{ thread.author }}</span>
                  </div>
                  <span>&bull;</span>
                  <span>{{ thread.timeAgo }}</span>
                  <span>&bull;</span>
                  <span>💬 {{ thread.replies.length }} tanggapan</span>
                </div>
              </div>
            </div>

            <button
              @click="openThreadDetail(thread)"
              class="rounded-xl border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 self-start sm:self-center"
            >
              Lihat Diskusi &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Detail Diskusi & Balasan -->
      <div v-if="selectedThread" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="relative w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-gray-800 my-8">
          <button @click="selectedThread = null" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div class="flex items-center gap-2">
            <span class="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              {{ selectedThread.category }}
            </span>
            <span v-if="selectedThread.is_solved" class="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              ✓ Solved
            </span>
          </div>

          <h2 class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ selectedThread.title }}
          </h2>

          <div class="mt-1 flex items-center gap-2 text-xs text-gray-400 pb-3 border-b border-gray-100 dark:border-gray-700">
            <span>Ditanyakan oleh <strong>{{ selectedThread.author }}</strong></span>
            <span>&bull;</span>
            <span>{{ selectedThread.timeAgo }}</span>
          </div>

          <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ selectedThread.content }}
          </p>

          <!-- Replies Section -->
          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h4 class="font-bold text-sm text-gray-900 dark:text-white mb-3">
              Tanggapan & Solusi ({{ selectedThread.replies.length }})
            </h4>

            <div class="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <div
                v-for="(rep, idx) in selectedThread.replies"
                :key="idx"
                class="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-3.5 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-bold text-gray-800 dark:text-white">{{ rep.author }}</span>
                  <span class="text-gray-400">{{ rep.time }}</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300">{{ rep.text }}</p>
              </div>
            </div>

            <!-- Submit Reply Form -->
            <form @submit.prevent="submitReply" class="mt-4 flex gap-2">
              <input
                v-model="replyText"
                required
                type="text"
                placeholder="Tuliskan jawaban atau solusi Anda..."
                class="flex-1 rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="submit"
                class="rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Mulai Diskusi Baru -->
      <div v-if="showNewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showNewModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Mulai Topik Diskusi Baru</h3>

          <form @submit.prevent="createThread" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Topik *</label>
              <input v-model="newThread.title" required type="text" placeholder="Contoh: Cara Integrasi Pembayaran Midtrans pada Modul Invoice" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                <select v-model="newThread.category" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option v-for="cat in availableCategories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Anda *</label>
                <input v-model="newThread.author" required type="text" placeholder="Contoh: Aris Nugroho" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Detail Pertanyaan / Topik *</label>
              <textarea v-model="newThread.content" required rows="4" placeholder="Jelaskan kendala, pertanyaan, atau ide Anda secara rinci..." class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"></textarea>
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="showNewModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600">Terbitkan Diskusi</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Tambah Kategori Forum -->
      <div v-if="showAddCatModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showAddCatModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>📁</span> Tambah Kategori Forum
          </h3>
          <p class="text-xs text-gray-500 mb-4">Tambahkan segmen topik diskusi baru untuk komunitas karyawan.</p>

          <form @submit.prevent="addCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Kategori *</label>
              <input
                v-model="newCatName"
                required
                type="text"
                placeholder="Contoh: Diskusi Karir & Pelatihan, Saran Logistik"
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

interface Reply {
  author: string
  time: string
  text: string
}

interface Thread {
  id: number
  title: string
  category: string
  author: string
  timeAgo: string
  votes: number
  is_solved: boolean
  content: string
  replies: Reply[]
}

const showNewModal = ref(false)
const showAddCatModal = ref(false)
const newCatName = ref('')
const selectedThread = ref<Thread | null>(null)
const selectedCategory = ref('Semua')
const searchQuery = ref('')
const replyText = ref('')

const baseCategories = [
  'Tanya Jawab Teknis ERP',
  'Kebijakan & Fasilitas HR',
  'Operasional & IT Support',
  'Inovasi & Saran',
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

function deleteThread(id: number) {
  threads.value = threads.value.filter((t) => t.id !== id)
  if (selectedThread.value?.id === id) {
    selectedThread.value = null
  }
}

const threads = ref<Thread[]>([
  {
    id: 1,
    title: 'Bagaimana cara setup shift kerja malam pada Modul Presensi Karyawan?',
    category: 'Kebijakan & Fasilitas HR',
    author: 'Rina Sulistyowati (HR)',
    timeAgo: '2 jam lalu',
    votes: 8,
    is_solved: true,
    content: 'Apakah shift kerja yang melewati jam 00:00 (misal 22:00 s/d 06:00) sudah dihitung secara akurat dalam perhitungan lembur overtime?',
    replies: [
      {
        author: 'Aris Nugroho (IT)',
        time: '1 jam lalu',
        text: 'Sudah support! Pada menu /hr/working-schedules, pilih template shift "Night Shift (Cross-day)", sistem otomatis mengakumulasi jam lembur sesuai regulasi Depnaker.',
      },
    ],
  },
  {
    id: 2,
    title: 'Integrasi Barcode Scanner pada Modul Inventory untuk Stok Gudang Surabaya',
    category: 'Operasional & IT Support',
    author: 'Ir. Surya Darmawan (Supply Chain)',
    timeAgo: '5 jam lalu',
    votes: 12,
    is_solved: true,
    content: 'Kami baru saja menerima 5 unit scanner Honeywell wireless. Bagaimana cara pairing dan konfigurasinya dengan modul Barcode Nomenclature?',
    replies: [
      {
        author: 'Kevin Sanjaya (IT)',
        time: '3 jam lalu',
        text: 'Scanner mendukung standar EAN-13 / Code128. Cukup buka halaman /supply_chain/barcode lalu scan kode produk, sistem otomatis melakukan auto-pick & packing.',
      },
    ],
  },
  {
    id: 3,
    title: 'Usulan Penambahan Fitur Multi-Currency untuk Transaksi Ekspor B2B',
    category: 'Inovasi & Saran',
    author: 'Doni Firmansyah (Sales)',
    timeAgo: '1 hari lalu',
    votes: 15,
    is_solved: false,
    content: 'Untuk memperluas pasar ke Asia Tenggara, kami menyarankan penambahan opsi mata uang USD dan SGD dengan kurs konversi real-time di modul Invoicing.',
    replies: [
      {
        author: 'Dewi Sartika (CFO)',
        time: '18 jam lalu',
        text: 'Ide yang sangat baik. Kami akan jadwalkan penambahan rate table Bank Indonesia di sprint update berikutnya.',
      },
    ],
  },
])

const newThread = ref({
  title: '',
  category: 'Tanya Jawab Teknis ERP',
  author: '',
  content: '',
})

const filteredThreads = computed(() => {
  return threads.value.filter((t) => {
    const matchesCategory = selectedCategory.value === 'Semua' || t.category === selectedCategory.value
    const matchesSearch =
      !searchQuery.value ||
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

function upvote(t: Thread) {
  t.votes++
}

function openThreadDetail(t: Thread) {
  selectedThread.value = t
  replyText.value = ''
}

function openNewThreadModal() {
  newThread.value = {
    title: '',
    category: 'Tanya Jawab Teknis ERP',
    author: '',
    content: '',
  }
  showNewModal.value = true
}

function createThread() {
  threads.value.unshift({
    id: Date.now(),
    title: newThread.value.title,
    category: newThread.value.category,
    author: newThread.value.author,
    timeAgo: 'Baru saja',
    votes: 1,
    is_solved: false,
    content: newThread.value.content,
    replies: [],
  })
  showNewModal.value = false
}

function submitReply() {
  if (!selectedThread.value || !replyText.value.trim()) return
  selectedThread.value.replies.push({
    author: 'Anda (Karyawan)',
    time: 'Baru saja',
    text: replyText.value,
  })
  replyText.value = ''
}
</script>
