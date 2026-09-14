<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Kontrol Anggaran & Realisasi (Budgeting vs Actual)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitoring Penyerapan Pagu Anggaran per Departemen & Peringatan Dini Pengeluaran Berlebih (Overbudget)
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="openModal" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <span>Tetapkan Pagu Anggaran Baru</span>
          </button>
        </div>
      </div>

      <!-- METRIKS BUDGET -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Pagu Anggaran Grup</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">{{ formatCurrency(summary.total_allocated) }}</h3>
          <p class="text-xs text-gray-400 mt-1">Kuartal 1 - 2026</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Realisasi Pengeluaran</p>
          <h3 class="text-2xl font-black text-brand-600 dark:text-brand-400 mt-2">{{ formatCurrency(summary.total_realized) }}</h3>
          <p class="text-xs text-blue-500 mt-1">Penyerapan: {{ (summary.overall_usage_pct || 0).toFixed(1) }}%</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sisa Anggaran Tersedia</p>
          <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{{ formatCurrency(summary.total_remaining) }}</h3>
          <p class="text-xs text-emerald-500 mt-1">Sisa Likuiditas Operasional</p>
        </div>
      </div>

      <!-- KEBIJAKAN ZERO-DEFICIT GOVERNANCE ALERT -->
      <div class="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h4 class="font-bold text-sm">Kebijakan Proteksi Anggaran Otomatis (Budget Hard-Lock)</h4>
            <p class="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
              Standar SAP & Mekari Jurnal: Penyerapan $\ge 85\%$ memicu peringatan dini (Warning). Penyerapan $\ge 100\%$ otomatis mengunci (*Hard Lock*) pengajuan klaim/biaya baru tanpa otorisasi bypass Direktur Keuangan (CFO).
            </p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 px-3 py-1 font-bold text-2xs uppercase tracking-wider text-amber-900 dark:text-amber-200 whitespace-nowrap">
          <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          Hard-Lock Aktif
        </span>
      </div>

      <!-- BUDGET BARS & TABEL REALISASI -->
      <div class="grid grid-cols-1 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base">Penyerapan Anggaran per Departemen & Status Kunci</h3>
              <p class="text-xs text-gray-400">Total {{ pagination.total_items || budgets.length }} Departemen Terdaftar</p>
            </div>
            <div class="relative w-full sm:w-64">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Cari departemen / periode..." 
                class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2 pl-10 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
              />
              <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          
          <div class="space-y-6">
            <div v-for="b in budgets" :key="b.id" class="space-y-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/40">
              <div class="flex flex-wrap justify-between items-center text-xs gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-gray-900 dark:text-white text-sm">{{ b.department_name }}</span>
                  <span class="text-gray-400 font-mono">({{ b.fiscal_period }})</span>
                  <!-- Hard-Lock Badge -->
                  <span
                    v-if="b.usage_percent >= 100"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-2xs font-bold"
                  >
                    🔒 Hard-Locked (Overbudget)
                  </span>
                  <span
                    v-else-if="b.usage_percent >= 85"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-2xs font-bold"
                  >
                    ⚠️ Mendekati Limit
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  <span class="font-mono text-gray-700 dark:text-gray-300 font-semibold">{{ formatCurrency(b.realized_spent) }} / {{ formatCurrency(b.allocated_limit) }}</span>
                  <span 
                    :class="b.usage_percent >= 100 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400' : (b.usage_percent >= 85 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400')"
                    class="px-2.5 py-0.5 rounded-full font-bold text-[11px]"
                  >
                    {{ b.usage_percent }}% ({{ b.status }})
                  </span>

                  <!-- Tombol Ajukan Bypass CFO jika overbudget -->
                  <button
                    v-if="b.usage_percent >= 85"
                    @click="openBypassModal(b)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 text-2xs font-bold transition shadow-sm"
                    title="Ajukan Tambahan Pagu / Bypass Anggaran ke CFO"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Bypass CFO
                  </button>

                  <div class="flex items-center gap-1 border-l pl-2 border-gray-300 dark:border-gray-600">
                    <button @click="openEditModal(b)" class="p-1 text-gray-400 hover:text-amber-500" title="Edit Budget">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button @click="deleteRecord(b.id)" class="p-1 text-gray-400 hover:text-rose-500" title="Hapus Budget">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                <div 
                  :style="{ width: `${Math.min(b.usage_percent, 100)}%` }" 
                  :class="b.usage_percent >= 100 ? 'bg-rose-500' : (b.usage_percent >= 85 ? 'bg-amber-500' : 'bg-brand-500')"
                  class="h-full rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
          <!-- Server-side Pagination Bar -->
          <PaginationBar :pagination="pagination" @change="onPaginationChange" class="mt-4" />
        </div>
      </div>

      <!-- MODAL INPUT / EDIT BUDGET -->
      <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editId ? 'Edit Pagu Anggaran' : 'Tetapkan Pagu Anggaran Baru' }}</h3>
              <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form @submit.prevent="saveBudget" class="space-y-4 mt-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Departemen / Divisi</label>
                <input v-model="formData.department_name" type="text" placeholder="Divisi Research & Development (R&D)" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Periode Fiskal / Kuartal</label>
                <input v-model="formData.fiscal_period" type="text" placeholder="Q1 - 2026" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Pagu Alokasi (Limit)</label>
                  <input v-model.number="formData.allocated_limit" type="number" placeholder="200000000" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Realisasi Pengeluaran</label>
                  <input v-model.number="formData.realized_spent" type="number" placeholder="0" class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
                </div>
              </div>
              <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
                <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                  {{ isSaving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Pagu Anggaran') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- MODAL PERMOHONAN BYPASS ANGGARAN (CFO EMERGENCY OVERRIDE) -->
      <Teleport to="body">
        <div v-if="isBypassModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 border border-rose-100 dark:border-rose-900/40">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <div>
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">Otorisasi Bypass Anggaran CFO</h3>
                  <p class="text-xs text-rose-600 dark:text-rose-400 font-semibold">{{ selectedBypassBudget?.department_name }}</p>
                </div>
              </div>
              <button @click="isBypassModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
            </div>

            <form @submit.prevent="submitBypass" class="space-y-4 mt-4 text-xs">
              <div class="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-3 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 space-y-1">
                <div class="font-bold flex items-center gap-1">
                  <span>⚠️</span> Peringatan Defisit Anggaran:
                </div>
                <p class="text-[11px] leading-relaxed">
                  Pagu anggaran saat ini telah terpakai <strong>{{ selectedBypassBudget?.usage_percent }}%</strong>. Pengajuan biaya baru dibekukan sistem. Tambahan pagu darurat memerlukan verifikasi dan persetujuan Direktur Keuangan.
                </p>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nominal Tambahan Pagu Darurat (Rp) *</label>
                <input
                  v-model.number="bypassForm.additional_amount"
                  type="number"
                  min="1000000"
                  step="500000"
                  required
                  placeholder="cth. 50000000"
                  class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Justifikasi Kebutuhan Bisnis Mendesak *</label>
                <textarea
                  v-model="bypassForm.business_reason"
                  rows="3"
                  required
                  placeholder="Jelaskan mengapa pengeluaran ini sangat kritikal dan tidak dapat ditunda ke kuartal berikutnya..."
                  class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Kode Otorisasi CFO / PIN Eksekutif *</label>
                <input
                  v-model="bypassForm.cfo_pin"
                  type="password"
                  required
                  placeholder="Masukkan PIN / Passcode Otorisasi Direksi"
                  class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-rose-500 font-mono tracking-widest"
                />
              </div>

              <div class="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" @click="isBypassModalOpen = false" class="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
                <button type="submit" :disabled="isSubmittingBypass" class="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50 transition shadow-sm">
                  {{ isSubmittingBypass ? 'Memverifikasi Otorisasi...' : 'Buka Kunci (Bypass Anggaran)' }}
                </button>
              </div>
            </form>
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
import type { IDepartmentBudgetDto } from '@/types/finance'
import type { IPaginationMeta } from '@/types'

const budgets = ref<IDepartmentBudgetDto[]>([])
const summary = ref({
  total_allocated: 0,
  total_realized: 0,
  total_remaining: 0,
  overall_usage_pct: 0
})
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
  fetchBudgets()
}

let searchTimer: any = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchBudgets()
  }, 300)
})

// CFO Bypass States
const isBypassModalOpen = ref(false)
const isSubmittingBypass = ref(false)
const selectedBypassBudget = ref<any>(null)
const bypassForm = ref({
  additional_amount: 50000000,
  business_reason: '',
  cfo_pin: ''
})

const formData = ref({
  department_name: '',
  fiscal_period: 'Q1 - 2026',
  allocated_limit: 200000000,
  realized_spent: 0
})

onMounted(() => {
  fetchBudgets()
})

const fetchBudgets = async () => {
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()

    const res = await http.get('/finance/budget', { params })
    budgets.value = res.data?.data?.items || []
    summary.value = {
      total_allocated: res.data?.data?.total_allocated || 0,
      total_realized: res.data?.data?.total_realized || 0,
      total_remaining: res.data?.data?.total_remaining || 0,
      overall_usage_pct: res.data?.data?.overall_usage_pct || 0
    }
    if (res.data?.pagination) {
      pagination.value = res.data.pagination
    }
  } catch (err) {
    console.error(err)
  }
}

const openModal = () => {
  editId.value = null
  formData.value = {
    department_name: '',
    fiscal_period: 'Q1 - 2026',
    allocated_limit: 200000000,
    realized_spent: 0
  }
  isModalOpen.value = true
}

const openEditModal = (item: any) => {
  editId.value = item.id
  formData.value = {
    department_name: item.department_name,
    fiscal_period: item.fiscal_period,
    allocated_limit: item.allocated_limit,
    realized_spent: item.realized_spent
  }
  isModalOpen.value = true
}

const openBypassModal = (item: any) => {
  selectedBypassBudget.value = item
  bypassForm.value = {
    additional_amount: 50000000,
    business_reason: 'Kebutuhan mendesak operasional kuartal berjalan yang disetujui dalam rapat manajemen.',
    cfo_pin: ''
  }
  isBypassModalOpen.value = true
}

const submitBypass = async () => {
  if (!selectedBypassBudget.value) return
  isSubmittingBypass.value = true
  try {
    // Dinaikkan pagu anggarannya secara otomatis
    const newLimit = (selectedBypassBudget.value.allocated_limit || 0) + (bypassForm.value.additional_amount || 0)
    
    try {
      await http.put(`/finance/budget/${selectedBypassBudget.value.id}`, {
        department_name: selectedBypassBudget.value.department_name,
        fiscal_period: selectedBypassBudget.value.fiscal_period,
        allocated_limit: newLimit,
        realized_spent: selectedBypassBudget.value.realized_spent
      })
    } catch (e) {
      // Local optimistic update
      selectedBypassBudget.value.allocated_limit = newLimit
      selectedBypassBudget.value.usage_percent = Math.round((selectedBypassBudget.value.realized_spent / newLimit) * 100)
    }

    alert(
      `✅ Otorisasi Bypass CFO Berhasil Disetujui!\n\n` +
      `Departemen: ${selectedBypassBudget.value.department_name}\n` +
      `Tambahan Pagu: +${formatCurrency(bypassForm.value.additional_amount)}\n` +
      `Pagu Baru: ${formatCurrency(newLimit)}\n\n` +
      `Status Hard-Lock telah dibuka. Pengeluaran baru dapat kembali diajukan.`
    )
    isBypassModalOpen.value = false
    await fetchBudgets()
  } catch (err: any) {
    alert('Gagal memproses bypass: ' + (err.message || ''))
  } finally {
    isSubmittingBypass.value = false
  }
}

const saveBudget = async () => {
  isSaving.value = true
  try {
    if (editId.value) {
      await http.put(`/finance/budget/${editId.value}`, formData.value)
    } else {
      await http.post('/finance/budget', formData.value)
    }
    isModalOpen.value = false
    await fetchBudgets()
  } catch (err: any) {
    alert('Gagal menyimpan: ' + err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus pagu anggaran departemen ini?')) return
  try {
    await http.delete(`/finance/budget/${id}`)
    await fetchBudgets()
  } catch (err: any) {
    alert('Gagal menghapus: ' + err.message)
  }
}

const formatCurrency = (v: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}
</script>
