<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              🎯
            </span>
            CRM Pipeline & Lead Scoring Engine
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Enterprise: Skor kelayakan prospek otomatis (Hot/Warm/Cold), atribusi sumber kampanye UTM, dan tracking mitra afiliasi.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            + Tambah Prospek Baru
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Pipeline Leads</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }} Prospek</h3>
          <p class="mt-1 text-xs text-blue-600 font-medium">Dalam penanganan sales</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Hot Leads (Siap Beli 🔥)</p>
          <h3 class="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{{ hotLeadsCount }}</h3>
          <p class="mt-1 text-xs text-rose-600 font-medium">Skor >= 75 Poin (Prioritas)</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Prospek Afiliasi</p>
          <h3 class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ affiliateCount }} Mitra</h3>
          <p class="mt-1 text-xs text-amber-600 font-medium">Melalui kode referral</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Potensi Nilai Penjualan</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rp {{ totalRevenue.toLocaleString('id-ID') }}</h3>
          <p class="mt-1 text-xs text-emerald-600 font-medium">Expected revenue total</p>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Prospek Penjualan & Kualifikasi</h3>
          <span class="text-xs text-gray-500 dark:text-gray-400">Skor dihitung otomatis dari firmografis & sumber</span>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Prospek / Kontak</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Skor AI (Lead Score)</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sumber / Afiliasi</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ekspektasi Revenue</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tahapan</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="isLoading"><td colspan="6" class="px-5 py-8 text-center text-gray-500">Memuat data pipeline...</td></tr>
              <tr v-else-if="error"><td colspan="6" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
              <tr v-else-if="records.length === 0"><td colspan="6" class="px-5 py-8 text-center text-gray-500">Belum ada data prospek.</td></tr>
              <tr v-for="record in records" :key="record.id" class="transition hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                <td class="px-5 py-4">
                  <p class="font-bold text-gray-900 dark:text-white capitalize">{{ record.name || (record as any).lead_name || '-' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ record.email || '-' }} <span v-if="record.phone">• {{ record.phone }}</span>
                  </p>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        (record.lead_score || 0) >= 75 ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' :
                        (record.lead_score || 0) >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border'
                      ]"
                    >
                      <span>{{ record.score_grade || ((record.lead_score || 0) >= 75 ? 'Hot 🔥' : (record.lead_score || 0) >= 40 ? 'Warm ⚡' : 'Cold ❄️') }}</span>
                      <span class="opacity-75">({{ record.lead_score || 0 }} Pts)</span>
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div v-if="record.referral_code || record.affiliate_name" class="text-xs">
                    <span class="inline-flex items-center gap-1 rounded bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 font-bold">
                      🤝 {{ record.affiliate_name || record.referral_code }}
                    </span>
                    <p class="text-[10px] text-gray-400 mt-0.5">Kode: {{ record.referral_code }}</p>
                  </div>
                  <div v-else-if="record.utm_source" class="text-xs">
                    <span class="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 font-medium">
                      🌐 {{ record.utm_source }}
                    </span>
                  </div>
                  <span v-else class="text-xs text-gray-400">Organik / Manual</span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-xs font-bold text-gray-900 dark:text-white">
                  Rp {{ (Number(record.expected_revenue) || 0).toLocaleString('id-ID') }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span class="rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {{ (record as any).stage?.name || (record as any).stage || 'New' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openModal('edit', record)" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 transition" title="Edit Data">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button @click="record.id && deleteRecord(record.id)" class="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 transition" title="Hapus Data">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal CRUD Prospek Enterprise -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎯</span> {{ modalMode === 'create' ? 'Tambah Prospek Penjualan Baru' : 'Edit Prospek Penjualan' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <form @submit.prevent="saveRecord" class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Peluang / Perusahaan</label>
            <input v-model="formData.name" type="text" placeholder="Misal: Pengadaan Server Cloud PT ABC" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Email Kontak</label>
              <input v-model="formData.email" type="email" placeholder="kontak@perusahaan.com" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nomor Telepon / WA</label>
              <input v-model="formData.phone" type="text" placeholder="+62 812-xxxx-xxxx" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Ekspektasi Pendapatan (Rp)</label>
              <input v-model.number="formData.expected_revenue" type="number" min="0" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Sumber Saluran (UTM)</label>
              <select v-model="formData.utm_source" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="organik">Organik / Langsung</option>
                <option value="wa_blast">WhatsApp Broadcast</option>
                <option value="meta">Meta Ads (FB/IG)</option>
                <option value="google">Google Ads</option>
                <option value="affiliate">Mitra Afiliasi</option>
              </select>
            </div>
          </div>

          <div class="p-3.5 bg-purple-50/70 border border-purple-200 dark:bg-purple-950/30 dark:border-purple-800 rounded-xl space-y-3">
            <h4 class="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🤝</span> Kemitraan & Afiliasi (Referral Attribution)
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Kode Referral Afiliasi</label>
                <input v-model="formData.referral_code" type="text" placeholder="Misal: REF-PARTNER-88" class="w-full rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs focus:border-purple-500 focus:outline-none dark:border-purple-800 dark:bg-gray-800 dark:text-white" />
              </div>
              <div>
                <label class="mb-1 block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Nama Mitra Afiliasi</label>
                <input v-model="formData.affiliate_name" type="text" placeholder="Misal: PT Solusi Digital" class="w-full rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs focus:border-purple-500 focus:outline-none dark:border-purple-800 dark:bg-gray-800 dark:text-white" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : 'Simpan & Kalkulasi Skor' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { crmService } from '@/services/sales/crm.service'

const records = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref({
  id: null as number | null,
  name: '',
  email: '',
  phone: '',
  expected_revenue: 0,
  utm_source: 'organik',
  referral_code: '',
  affiliate_name: ''
})

const hotLeadsCount = computed(() => records.value.filter(r => (r.lead_score || 0) >= 75).length)
const affiliateCount = computed(() => records.value.filter(r => r.referral_code || r.affiliate_name).length)
const totalRevenue = computed(() => records.value.reduce((acc, curr) => acc + (Number(curr.expected_revenue) || 0), 0))

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await crmService.getAll()
    records.value = data || []
  } catch (err: any) {
    error.value = 'Gagal memuat pipeline: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id,
      name: data.name || data.lead_name || '',
      email: data.email || '',
      phone: data.phone || '',
      expected_revenue: data.expected_revenue || 0,
      utm_source: data.utm_source || 'organik',
      referral_code: data.referral_code || '',
      affiliate_name: data.affiliate_name || ''
    }
  } else {
    formData.value = {
      id: null,
      name: '',
      email: '',
      phone: '',
      expected_revenue: 0,
      utm_source: 'organik',
      referral_code: '',
      affiliate_name: ''
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      await crmService.update(formData.value.id, formData.value)
    } else {
      await crmService.create(formData.value)
    }
    closeModal()
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus data prospek ini?')) return
  try {
    await crmService.delete(id)
    await fetchData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>
