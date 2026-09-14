<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Persetujuan Berjenjang Keuangan (Approvals)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Matriks Otorisasi Pengeluaran Dana & Pembelian Skala 100–1.000 Karyawan (Dept Head &rarr; Finance &rarr; CFO)
          </p>
        </div>
        
        <div class="flex gap-2">
          <button @click="openModal" class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            + Ajukan Permohonan Baru
          </button>
        </div>
      </div>

      <!-- APPROVAL METRICS -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Pengajuan Masuk</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ records.length }} <span class="text-sm font-normal text-gray-400">Tiket</span></h3>
          <p class="text-xs text-gray-400 mt-1">Total Nilai: {{ formatCurrency(totalReqAmount) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Menunggu Otorisasi</p>
          <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{{ pendingCount }} <span class="text-sm font-normal text-gray-400">Tertunda</span></h3>
          <p class="text-xs text-amber-500 mt-1">Butuh Review & Sign-Off</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Telah Disetujui (Approved)</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ approvedCount }} <span class="text-sm font-normal text-gray-400">Tiket</span></h3>
          <p class="text-xs text-emerald-500 mt-1">Siap Dieksekusi / Dicairkan</p>
        </div>
      </div>

      <!-- FILTER & SEARCH -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="relative flex-1 w-full sm:w-auto">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari permohonan atau pemohon..." 
            class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div class="w-full sm:w-48">
          <select 
            v-model="statusFilter" 
            class="w-full py-2 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <!-- TABEL DAFTAR PERSETUJUAN -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Permohonan / Keperluan</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Pemohon (Requester)</th>
                <th class="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Tahap Jenjang (Stage)</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Nominal Permohonan</th>
                <th class="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Aksi Otorisasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-if="isLoading">
                <td colspan="6" class="py-12 text-center text-gray-500">
                  <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-xs">Memuat permohonan persetujuan...</p>
                </td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Tidak ada permohonan persetujuan yang tertunda.
                </td>
              </tr>
              <tr v-for="rec in records" :key="rec.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900 dark:text-white text-sm">{{ rec.name }}</div>
                  <span class="text-xs text-gray-400">Jenis: {{ rec.type || 'Pengeluaran Kas' }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-800 dark:text-white text-sm">{{ rec.requester_name || 'Staff Pemohon' }}</div>
                  <span class="text-xs text-gray-400">{{ formatDate(rec.created_at) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    {{ rec.stage || 'Manager Dept' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap font-mono font-bold text-sm text-gray-900 dark:text-white">
                  {{ formatCurrency(rec.amount) }}
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span :class="getStatusBadge(rec.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ rec.status || 'PENDING' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      v-if="rec.status === 'pending' || !rec.status" 
                      @click="processApproval(rec, 'approved')" 
                      class="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors" 
                      title="Setujui Permohonan (Approve)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button 
                      v-if="rec.status === 'pending' || !rec.status" 
                      @click="processApproval(rec, 'rejected')" 
                      class="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" 
                      title="Tolak Permohonan (Reject)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button 
                      @click="deleteRequest(rec.id)" 
                      class="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors" 
                      title="Hapus"
                    >
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

    <!-- MODAL PENGAJUAN APPROVAL -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
          <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Pengajuan Otorisasi Anggaran</h3>
            <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="saveRequest" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Judul / Keperluan Pengeluaran</label>
              <input v-model="formData.name" type="text" placeholder="Pengadaan Server Database Baru" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Pemohon</label>
                <input v-model="formData.requester_name" type="text" placeholder="Budi Santoso (IT Manager)" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nominal Anggaran (Rp)</label>
                <input v-model.number="formData.amount" type="number" min="1000" step="any" required placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Tahap Otorisasi (Level Approval)</label>
              <select v-model="formData.stage" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500">
                <option value="Manager Dept">Tahap 1: Manager Departemen (s/d Rp 10 Jt)</option>
                <option value="Finance Head">Tahap 2: Finance & Accounting Head (s/d Rp 50 Jt)</option>
                <option value="CFO / Direktur">Tahap 3: Chief Financial Officer / Direktur (> Rp 50 Jt)</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                {{ isSaving ? 'Mengirim...' : 'Kirim Permohonan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { IApprovalDto as IApproval } from '@/types/finance'
import type { IPaginationMeta } from '@/types'

const records = ref<IApproval[]>([])
const allRecords = ref<IApproval[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const isModalOpen = ref(false)

const searchQuery = ref('')
const statusFilter = ref('all')

const pagination = ref<IPaginationMeta>({
  current_page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const formData = ref({
  name: '',
  type: 'Pengeluaran Kas / PO',
  amount: 0,
  requester_name: '',
  stage: 'Manager Dept',
  status: 'pending'
})

onMounted(() => {
  fetchAllMetrics()
  fetchApprovals()
})

const fetchAllMetrics = async () => {
  try {
    const res = await http.get('/finance/approvals', { params: { all: 'true' } })
    allRecords.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Failed to load all approvals for metrics', err)
  }
}

const fetchApprovals = async () => {
  isLoading.value = true
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (statusFilter.value && statusFilter.value !== 'all') params.status = statusFilter.value

    const res = await http.get('/finance/approvals', { params })
    if (res.data?.pagination) {
      records.value = res.data.data || []
      pagination.value = res.data.pagination
    } else {
      records.value = res.data?.data || res.data || []
    }
  } catch (err) {
    console.error('Failed to load approvals', err)
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (page: number) => {
  pagination.value.current_page = page
  fetchApprovals()
}

let searchDebounceTimer: any = null
watch([searchQuery, statusFilter], () => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchApprovals()
  }, 300)
})

const totalReqAmount = computed(() => allRecords.value.reduce((acc, c) => acc + (c.amount || 0), 0))
const pendingCount = computed(() => allRecords.value.filter(r => r.status === 'pending' || !r.status).length)
const approvedCount = computed(() => allRecords.value.filter(r => r.status === 'approved').length)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const formatDate = (d: string) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusBadge = (status: string) => {
  const s = (status || 'pending').toLowerCase()
  if (s === 'approved') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
  if (s === 'rejected') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
}

const openModal = () => {
  formData.value = {
    name: '',
    type: 'Pengeluaran Kas / PO',
    amount: 0,
    requester_name: '',
    stage: 'Manager Dept',
    status: 'pending'
  }
  isModalOpen.value = true
}

const saveRequest = async () => {
  isSaving.value = true
  try {
    await http.post('/finance/approvals', formData.value)
    isModalOpen.value = false
    await fetchApprovals()
    await fetchAllMetrics()
  } catch (err: any) {
    alert('Gagal mengirim permohonan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const processApproval = async (item: IApproval, newStatus: 'approved' | 'rejected') => {
  const actionText = newStatus === 'approved' ? 'menyetujui' : 'menolak'
  if (!confirm(`Apakah Anda yakin ingin ${actionText} permohonan "${item.name}"?`)) return
  try {
    item.status = newStatus
    item.approver_name = 'CFO / Authorized Signer'
    await http.put(`/finance/approvals/${item.id}`, item)
    await fetchApprovals()
    await fetchAllMetrics()
    alert(`Permohonan berhasil di-${newStatus}!`)
  } catch (err: any) {
    alert('Gagal memproses permohonan: ' + (err.response?.data?.message || err.message))
  }
}

const deleteRequest = async (id: number) => {
  if (!confirm('Hapus tiket permohonan ini?')) return
  try {
    await http.delete(`/finance/approvals/${id}`)
    await fetchApprovals()
    await fetchAllMetrics()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}
</script>
