<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Master Bank & Rekanan Bisnis (Partners)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pusat Data Rekening Bank Operasional, Pelanggan (Customer), Vendor Supplier, dan Instansi Terkait
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="openModal('create')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            + Tambah Bank / Mitra Baru
          </button>
        </div>
      </div>

      <!-- KPI METRICS -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Rekanan Terdaftar</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ records.length }} <span class="text-sm font-normal text-gray-400">Entitas</span></h3>
          <p class="text-xs text-gray-400 mt-1">Master Data Terpusat</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Bank Operasional</p>
          <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{{ bankCount }} <span class="text-sm font-normal text-gray-400">Bank</span></h3>
          <p class="text-xs text-blue-500 mt-1">BCA, Mandiri, BRI, dll.</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pelanggan (Customer)</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ customerCount }} <span class="text-sm font-normal text-gray-400">Klien</span></h3>
          <p class="text-xs text-emerald-500 mt-1">Tujuan Penagihan Invoice</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Vendor & Instansi</p>
          <h3 class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">{{ vendorCount }} <span class="text-sm font-normal text-gray-400">Supplier</span></h3>
          <p class="text-xs text-purple-500 mt-1">Penyedia Jasa & Pajak</p>
        </div>
      </div>

      <!-- FILTER TABS & SEARCH -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button 
            v-for="t in typeTabs" 
            :key="t.value" 
            @click="selectedType = t.value"
            :class="['px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors', selectedType === t.value ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700']"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama bank, vendor, atau NPWP..." 
            class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2 pl-10 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
          />
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <!-- TABEL REKANAN BISNIS & BANK -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Nama Bank / Entitas</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Klasifikasi</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Kontak & Email</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Kota / Alamat</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">NPWP / Tax ID</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="6" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat master bank & rekanan...</p>
                </td>
              </tr>
              <tr v-else-if="filteredRecords.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Tidak ada data yang cocok dengan kriteria filter.
                </td>
              </tr>
              <tr v-for="rec in filteredRecords" :key="rec.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    <span v-if="rec.type === 'bank'" class="text-blue-500">🏦</span>
                    <span v-else-if="rec.is_customer" class="text-emerald-500">🏢</span>
                    <span v-else class="text-purple-500">📦</span>
                    {{ rec.name }}
                  </div>
                  <span class="text-[11px] text-gray-400">Partner ID: #{{ rec.id }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeBadge(rec)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    {{ getTypeText(rec) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-gray-700 dark:text-gray-300">
                  <div>{{ rec.email || '-' }}</div>
                  <div class="text-gray-400 font-mono">{{ rec.phone || rec.mobile || '-' }}</div>
                </td>
                <td class="px-6 py-4 text-xs text-gray-700 dark:text-gray-300">
                  {{ rec.city || rec.street || 'Indonesia' }}
                </td>
                <td class="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {{ rec.vat || '-' }}
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button @click="editRecord(rec)" class="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Edit Data">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deletePartner(rec.id)" class="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" title="Hapus">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>

    </div>

    <!-- MODAL TAMBAH / EDIT BANK & REKANAN -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 my-8">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ isEditing ? 'Edit Informasi Rekanan / Bank' : 'Tambah Bank / Rekanan Baru' }}
            </h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="savePartner" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Bank / Perusahaan / Instansi</label>
              <input v-model="formData.name" type="text" placeholder="Contoh: PT Bank CIMB Niaga Tbk / PT Maju Mundur" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-medium" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Kategori Entitas</label>
                <select v-model="formData.type" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                  <option value="bank">🏦 Bank Rekening Operasional</option>
                  <option value="customer">🏢 Pelanggan (Customer)</option>
                  <option value="vendor">📦 Vendor / Supplier Pengadaan</option>
                  <option value="government">🏛️ Instansi Pajak / Pemerintah</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nomor Telepon / Call Center</label>
                <input v-model="formData.phone" type="text" placeholder="14041 / 021-123456" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Email Resmi</label>
                <input v-model="formData.email" type="email" placeholder="contact@bankcimb.co.id" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">NPWP / Tax ID</label>
                <input v-model="formData.vat" type="text" placeholder="01.234.567.8-091.000" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Kota & Alamat Kantor</label>
              <input v-model="formData.city" type="text" placeholder="Jakarta Pusat, Gedung Menara Mandiri Lt. 12" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Daftarkan Rekanan') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { IPartnerDto as IPartner } from '@/types/core'
import type { PaginationMeta } from '@/types'

const records = ref<IPartner[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedType = ref('all')
const searchQuery = ref('')

const pagination = ref<PaginationMeta>({
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const typeTabs = [
  { label: 'Semua Rekanan', value: 'all' },
  { label: '🏦 Bank Operasional', value: 'bank' },
  { label: '🏢 Pelanggan (Customer)', value: 'customer' },
  { label: '📦 Vendor Supplier', value: 'vendor' },
]

const formData = ref<Partial<IPartner>>({
  name: '',
  type: 'bank',
  email: '',
  phone: '',
  city: '',
  vat: '',
  is_company: true,
  is_customer: false,
  is_vendor: true
})

onMounted(() => {
  fetchPartners()
})

const fetchPartners = async (page = pagination.value.page, perPage = pagination.value.per_page) => {
  isLoading.value = true
  try {
    const res = await http.get('/base/partner', {
      params: {
        page,
        per_page: perPage,
        search: searchQuery.value || undefined
      }
    })
    records.value = res.data?.data || res.data || []
    if (res.data?.meta) {
      pagination.value = res.data.meta
    } else {
      pagination.value.total = records.value.length
      pagination.value.total_pages = Math.ceil(records.value.length / perPage) || 1
    }
  } catch (err) {
    console.error('Failed to load partners', err)
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (newPag: PaginationMeta) => {
  fetchPartners(newPag.page, newPag.per_page)
}

const bankCount = computed(() => records.value.filter(r => r.type === 'bank').length)
const customerCount = computed(() => records.value.filter(r => r.is_customer || r.type === 'customer').length)
const vendorCount = computed(() => records.value.filter(r => r.is_vendor && r.type !== 'bank').length)

const filteredRecords = computed(() => {
  return records.value.filter(r => {
    let matchType = true
    if (selectedType.value === 'bank') matchType = r.type === 'bank'
    else if (selectedType.value === 'customer') matchType = r.is_customer || r.type === 'customer'
    else if (selectedType.value === 'vendor') matchType = (r.is_vendor || r.type === 'vendor') && r.type !== 'bank'

    const matchSearch = (r.name && r.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                        (r.vat && r.vat.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                        (r.city && r.city.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchType && matchSearch
  })
})

const getTypeBadge = (rec: IPartner) => {
  if (rec.type === 'bank') return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
  if (rec.type === 'government') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
  if (rec.is_customer) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
  return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
}

const getTypeText = (rec: IPartner) => {
  if (rec.type === 'bank') return 'Bank Operasional'
  if (rec.type === 'government') return 'Instansi Pemerintah'
  if (rec.is_customer) return 'Pelanggan (AR)'
  return 'Vendor Supplier (AP)'
}

const openModal = (mode: 'create' | 'edit') => {
  isEditing.value = mode === 'edit'
  if (mode === 'create') {
    formData.value = {
      name: '',
      type: 'bank',
      email: '',
      phone: '',
      city: '',
      vat: '',
      is_company: true,
      is_customer: false,
      is_vendor: true
    }
  }
  isModalOpen.value = true
}

const editRecord = (rec: IPartner) => {
  formData.value = { ...rec }
  openModal('edit')
}

const savePartner = async () => {
  isSaving.value = true
  try {
    // Sesuaikan boolean
    if (formData.value.type === 'customer') {
      formData.value.is_customer = true
      formData.value.is_vendor = false
    } else if (formData.value.type === 'vendor' || formData.value.type === 'bank') {
      formData.value.is_customer = false
      formData.value.is_vendor = true
    }

    if (isEditing.value && formData.value.id) {
      await http.put(`/base/partner/${formData.value.id}`, formData.value)
    } else {
      await http.post('/base/partner', formData.value)
    }
    isModalOpen.value = false
    await fetchPartners()
    alert('Data bank/mitra berhasil disimpan!')
  } catch (err: any) {
    alert('Gagal menyimpan rekanan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deletePartner = async (id: number) => {
  if (!confirm('Hapus rekanan bisnis ini?')) return
  try {
    await http.delete(`/base/partner/${id}`)
    await fetchPartners()
  } catch (err: any) {
    const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || ''
    if (errMsg.includes('violates foreign key constraint') || errMsg.includes('purchase_orders') || errMsg.includes('invoices')) {
      alert('⚠️ Rekanan / Bank ini TIDAK BISA DIHAPUS karena masih terhubung dengan dokumen transaksi aktif (seperti Purchase Order / Faktur Tagihan). Ini adalah proteksi integritas database keuangan.')
    } else {
      alert('Gagal menghapus rekanan: ' + errMsg)
    }
  }
}
</script>
