<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Aset Tetap & Depresiasi (Fixed Assets & Depreciation)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pencatatan Nilai Kapitalisasi, Masa Manfaat, Kategori Aset & Posting Jurnal Amortisasi Otomatis
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <!-- Tombol Pengaturan Master Kategori Aset -->
          <button @click="openCategoryModal" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span>Master Kategori Aset</span>
          </button>

          <button @click="openModal" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <span>Daftarkan Aset Baru</span>
          </button>
          
          <button @click="postDepreciation" :disabled="isPosting" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            <span>{{ isPosting ? 'Memproses...' : 'Posting Depresiasi Bulan Ini' }}</span>
          </button>
        </div>
      </div>

      <!-- METRIKS ASET -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Nilai Perolehan Aset</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ formatCurrency(summary.total_acquisition) }}</h3>
          <p class="text-xs text-gray-400 mt-1">Historical Acquisition Cost</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Akumulasi Penyusutan</p>
          <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{{ formatCurrency(summary.total_accumulated) }}</h3>
          <p class="text-xs text-rose-500 mt-1">Total Amortisasi s/d Hari Ini</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nilai Buku Bersih (Net Book Value)</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ formatCurrency(summary.total_net_book_val) }}</h3>
          <p class="text-xs text-emerald-500 mt-1">Nilai Aktiva Tercatat di Neraca</p>
        </div>
      </div>

      <!-- TABEL INVENTARIS ASET -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="p-4 border-b border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Inventaris Aktiva Tetap Perusahaan</h3>
            <p class="text-xs text-gray-400">Total {{ pagination.total_items || assets.length }} Aset Terdaftar</p>
          </div>
          <div class="relative w-full sm:w-64">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari nama atau kode aset..." 
              class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2 pl-10 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left text-xs">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold uppercase">
                <th class="px-5 py-3.5">Kode & Nama Aset</th>
                <th class="px-5 py-3.5">Kategori</th>
                <th class="px-5 py-3.5 text-right">Harga Perolehan</th>
                <th class="px-5 py-3.5 text-center">Masa Manfaat</th>
                <th class="px-5 py-3.5 text-right">Penyusutan / Bulan</th>
                <th class="px-5 py-3.5 text-right">Nilai Buku (NBV)</th>
                <th class="px-5 py-3.5 text-center">Status</th>
                <th class="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700 font-mono">
              <tr v-for="a in assets" :key="a.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-5 py-4 font-sans">
                  <div class="font-bold text-gray-900 dark:text-white">{{ a.name }}</div>
                  <span class="text-[11px] text-brand-600 dark:text-brand-400 font-mono font-medium">{{ a.code }}</span>
                </td>
                <td class="px-5 py-4 font-sans text-gray-600 dark:text-gray-300">
                  <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-[11px]">
                    {{ a.category }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(a.acquisition_cost) }}
                </td>
                <td class="px-5 py-4 text-center font-sans text-gray-700 dark:text-gray-300">
                  {{ a.useful_life_months }} Bulan
                </td>
                <td class="px-5 py-4 text-right text-rose-600 dark:text-rose-400">
                  -{{ formatCurrency(a.monthly_depreciation) }}
                </td>
                <td class="px-5 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(a.net_book_value) }}
                </td>
                <td class="px-5 py-4 text-center font-sans">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {{ a.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right whitespace-nowrap font-sans">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      @click="openEditModal(a)" 
                      class="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" 
                      title="Edit Aset"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button 
                      @click="deleteRecord(a.id)" 
                      class="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" 
                      title="Hapus Aset"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Server-side Pagination Bar -->
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>

      <!-- MODAL INPUT / EDIT ASET (KATEGORI DINAMIS DARI DATABASE) -->
      <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editId ? 'Edit Data Aset Tetap' : 'Daftarkan Aset Tetap Baru' }}</h3>
              <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form @submit.prevent="saveAsset" class="space-y-4 mt-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Kode Unik Aset</label>
                <input v-model="formData.code" type="text" placeholder="AST-IT-004" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Barang / Aset</label>
                <input v-model="formData.name" type="text" placeholder="Laptop Lenovo ThinkPad P1 Gen 6" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              
              <!-- Pilihan Kategori dari Database -->
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300">Kategori Aset</label>
                  <button type="button" @click="openCategoryModal" class="text-xs text-brand-500 hover:underline">
                    + Kelola Kategori
                  </button>
                </div>
                <select 
                  v-model="formData.category" 
                  @change="handleCategoryChange"
                  required 
                  class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500"
                >
                  <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                    {{ cat.name }} (Default: {{ cat.default_useful_life }} Bulan)
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Harga Perolehan</label>
                  <input v-model.number="formData.acquisition_cost" type="number" placeholder="25000000" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Masa Manfaat (Bulan)</label>
                  <input v-model.number="formData.useful_life_months" type="number" placeholder="48" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
                <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                  {{ isSaving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Daftarkan Aset') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- MODAL MASTER KATEGORI ASET (ADMIN CRUD KATEGORI) -->
      <Teleport to="body">
        <div v-if="isCategoryModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Master Kategori Aset Tetap</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Kelola jenis golongan aset dan default masa manfaat amortisasi</p>
              </div>
              <button @click="isCategoryModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Form Tambah / Edit Kategori -->
            <form @submit.prevent="saveCategory" class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-900/80 rounded-xl mt-4 border border-gray-200 dark:border-gray-700/80 shadow-inner">
              <div>
                <label class="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Kode Kategori</label>
                <input v-model="categoryForm.code" type="text" placeholder="BUILDING" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none uppercase font-mono focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Nama Kategori</label>
                <input v-model="categoryForm.name" type="text" placeholder="Gedung & Bangunan" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Masa Manfaat (Bulan)</label>
                <div class="flex gap-2">
                  <input v-model.number="categoryForm.default_useful_life" type="number" placeholder="240" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none font-mono focus:border-brand-500" />
                  <button type="submit" class="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shadow-sm">
                    {{ categoryEditId ? 'Simpan' : '+ Tambah' }}
                  </button>
                </div>
              </div>
            </form>

            <!-- Tabel Kategori Terdaftar -->
            <div class="mt-4 flex-1 overflow-y-auto custom-scrollbar border rounded-xl border-gray-200 dark:border-gray-700">
              <table class="min-w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold uppercase">
                    <th class="px-4 py-2.5">Kode</th>
                    <th class="px-4 py-2.5">Nama Kategori</th>
                    <th class="px-4 py-2.5 text-center">Masa Manfaat</th>
                    <th class="px-4 py-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr v-for="c in categories" :key="c.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                    <td class="px-4 py-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {{ c.code }}
                    </td>
                    <td class="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      {{ c.name }}
                    </td>
                    <td class="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-mono">
                      {{ c.default_useful_life }} Bulan ({{ (c.default_useful_life / 12).toFixed(0) }} Tahun)
                    </td>
                    <td class="px-4 py-3 text-right whitespace-nowrap">
                      <button @click="editCategory(c)" class="p-1 text-gray-400 hover:text-amber-500 mr-1" title="Edit">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button @click="deleteCategory(c.id)" class="p-1 text-gray-400 hover:text-rose-500" title="Hapus">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button @click="isCategoryModalOpen = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { IFixedAssetDto, IAssetCategoryDto } from '@/types/finance'
import type { IPaginationMeta } from '@/types'

const assets = ref<IFixedAssetDto[]>([])
const categories = ref<IAssetCategoryDto[]>([])
const summary = ref({
  total_acquisition: 0,
  total_accumulated: 0,
  total_net_book_val: 0
})
const isPosting = ref(false)
const isModalOpen = ref(false)
const isSaving = ref(false)
const editId = ref<number | null>(null)

const searchQuery = ref('')

// Server-side Pagination State
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
  fetchAssets()
}

let searchTimer: any = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchAssets()
  }, 300)
})

// State Modal Master Kategori
const isCategoryModalOpen = ref(false)
const categoryEditId = ref<number | null>(null)
const categoryForm = ref({
  code: '',
  name: '',
  default_useful_life: 48
})

const formData = ref({
  code: '',
  name: '',
  category: '',
  acquisition_cost: 0,
  useful_life_months: 48,
  residual_value: 0
})

onMounted(async () => {
  await fetchCategories()
  await fetchAssets()
})

const fetchCategories = async () => {
  try {
    const res = await http.get('/finance/assets/categories')
    categories.value = res.data?.data || []
    if (categories.value.length > 0 && !formData.value.category) {
      formData.value.category = categories.value[0].name
      formData.value.useful_life_months = categories.value[0].default_useful_life
    }
  } catch (err) {
    console.error(err)
  }
}

const fetchAssets = async () => {
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()

    const res = await http.get('/finance/assets', { params })
    assets.value = res.data?.data?.items || res.data?.data || []
    summary.value = {
      total_acquisition: res.data?.data?.total_acquisition || 0,
      total_accumulated: res.data?.data?.total_accumulated || 0,
      total_net_book_val: res.data?.data?.total_net_book_val || 0
    }
    if (res.data?.pagination) {
      pagination.value = res.data.pagination
    }
  } catch (err) {
    console.error(err)
  }
}

const handleCategoryChange = () => {
  const cat = categories.value.find(c => c.name === formData.value.category)
  if (cat && cat.default_useful_life) {
    formData.value.useful_life_months = cat.default_useful_life
  }
}

const openModal = () => {
  editId.value = null
  const defaultCat = categories.value[0]
  formData.value = {
    code: 'AST-IT-' + Math.floor(100 + Math.random() * 900),
    name: '',
    category: defaultCat ? defaultCat.name : 'Peralatan IT & Komputer',
    acquisition_cost: 25000000,
    useful_life_months: defaultCat ? defaultCat.default_useful_life : 48,
    residual_value: 0
  }
  isModalOpen.value = true
}

const openEditModal = (item: any) => {
  editId.value = item.id
  formData.value = {
    code: item.code,
    name: item.name,
    category: item.category,
    acquisition_cost: item.acquisition_cost,
    useful_life_months: item.useful_life_months,
    residual_value: item.residual_value
  }
  isModalOpen.value = true
}

const saveAsset = async () => {
  isSaving.value = true
  try {
    if (editId.value) {
      await http.put(`/finance/assets/${editId.value}`, formData.value)
    } else {
      await http.post('/finance/assets', formData.value)
    }
    isModalOpen.value = false
    await fetchAssets()
  } catch (err: any) {
    alert('Gagal menyimpan: ' + err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus aset tetap ini?')) return
  try {
    await http.delete(`/finance/assets/${id}`)
    await fetchAssets()
  } catch (err: any) {
    alert('Gagal menghapus: ' + err.message)
  }
}

const postDepreciation = async () => {
  isPosting.value = true
  try {
    const res = await http.post('/finance/assets/depreciate')
    alert(`Sukses! ${res.data?.message}\nDebit: ${res.data?.data?.gl_account_debit}\nKredit: ${res.data?.data?.gl_account_credit}`)
    await fetchAssets()
  } catch (err: any) {
    alert('Gagal posting: ' + err.message)
  } finally {
    isPosting.value = false
  }
}

// Master Kategori Methods
const openCategoryModal = () => {
  categoryEditId.value = null
  categoryForm.value = {
    code: '',
    name: '',
    default_useful_life: 48
  }
  isCategoryModalOpen.value = true
}

const editCategory = (cat: any) => {
  categoryEditId.value = cat.id
  categoryForm.value = {
    code: cat.code,
    name: cat.name,
    default_useful_life: cat.default_useful_life
  }
}

const saveCategory = async () => {
  try {
    if (categoryEditId.value) {
      await http.put(`/finance/assets/categories/${categoryEditId.value}`, categoryForm.value)
    } else {
      await http.post('/finance/assets/categories', categoryForm.value)
    }
    categoryEditId.value = null
    categoryForm.value = { code: '', name: '', default_useful_life: 48 }
    await fetchCategories()
  } catch (err: any) {
    alert('Gagal menyimpan kategori: ' + err.message)
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('Hapus kategori aset ini?')) return
  try {
    await http.delete(`/finance/assets/categories/${id}`)
    await fetchCategories()
  } catch (err: any) {
    alert('Gagal: ' + err.message)
  }
}

const formatCurrency = (v: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}
</script>
