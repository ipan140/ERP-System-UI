<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col justify-between font-sans">
    <!-- Top Public Header -->
    <header class="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div>
            <h1 class="text-sm font-bold tracking-tight">Portal Servis Pelanggan</h1>
            <p class="text-[10px] text-gray-400">Pusat Informasi & Pelacakan Reparasi Unit Resmi</p>
          </div>
        </div>

        <router-link
          to="/login"
          class="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
        >
          Masuk Staff
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </router-link>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
      <!-- Hero Search Section -->
      <div class="text-center mb-8">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          🔍 Customer Self-Service Tracking
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
          Lacak Status Reparasi Unit Anda
        </h2>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-lg mx-auto">
          Cek progres perbaikan secara transparan, lihat rincian estimasi biaya, dan berikan persetujuan perbaikan secara online.
        </p>

        <!-- Search Card -->
        <form @submit.prevent="searchTracking" class="mt-6 max-w-xl mx-auto p-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col sm:flex-row gap-2">
          <div class="flex-1 relative">
            <input
              v-model="rmaInput"
              type="text"
              required
              placeholder="No. RMA / Order (cth: #RO-0001 atau 1)"
              class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-transparent border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-500 dark:text-white"
            />
          </div>
          <div class="flex-1 relative">
            <input
              v-model="snInput"
              type="text"
              placeholder="No. Seri Unit (Opsional)"
              class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-transparent border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-500 dark:text-white"
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span v-else>Lacak Unit</span>
          </button>
        </form>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs text-center max-w-lg mx-auto">
        {{ error }}
      </div>

      <!-- Tracking Results Card -->
      <div v-if="orderData" class="space-y-6">
        <!-- Top Status Overview -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 dark:border-gray-800 gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-sm">
                  #RO-{{ String(orderData.id).padStart(4, '0') }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase" :class="getStageBadgeClass(orderData.state)">
                  {{ getStageLabel(orderData.state) }}
                </span>
              </div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white mt-1">
                {{ orderData.name }}
              </h3>
              <p class="text-xs text-gray-400">
                No. Seri: <span class="font-mono font-medium text-gray-700 dark:text-gray-300">{{ orderData.serial_number || '-' }}</span>
              </p>
            </div>

            <!-- Warranty Badge -->
            <div class="text-left sm:text-right">
              <span class="text-2xs text-gray-400 block mb-1">Status Garansi Resmi:</span>
              <span class="px-3 py-1 rounded-lg text-xs font-bold" :class="getWarrantyBadgeClass(orderData.warranty_status)">
                {{ getWarrantyLabel(orderData.warranty_status) }}
              </span>
            </div>
          </div>

          <!-- Live Progress Stepper -->
          <div class="py-6">
            <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-4">Tahapan Pengerjaan Reparasi:</h4>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
              <div
                v-for="(step, idx) in steps"
                :key="step.key"
                class="flex flex-col items-center text-center p-2 rounded-xl transition"
                :class="isStepActive(step.key) ? 'bg-brand-50/70 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300' : 'text-gray-400'"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all"
                  :class="isStepCompleted(step.key)
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : isStepActive(step.key)
                      ? 'bg-brand-500 text-white ring-4 ring-brand-500/20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'"
                >
                  <span v-if="isStepCompleted(step.key)">✓</span>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <span class="text-[11px] font-bold">{{ step.label }}</span>
                <span class="text-[9px] text-gray-400 mt-0.5">{{ step.desc }}</span>
              </div>
            </div>
          </div>

          <!-- QC Passed Indicator -->
          <div v-if="orderData.qc_passed" class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div class="flex items-center gap-2">
              <span class="text-base">🛡️</span>
              <div>
                <span class="font-bold">Lulus Uji Kontrol Kualitas (QC Passed)</span>
                <p class="text-2xs text-emerald-600 dark:text-emerald-400">Unit telah melalui pengujian standar kelayakan dan siap diserahkan.</p>
              </div>
            </div>
            <span class="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60">
              Terverifikasi
            </span>
          </div>
        </div>

        <!-- Cost Breakdown & Approval Box -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h4 class="text-xs font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
            Rincian Estimasi Biaya Reparasi
          </h4>

          <div class="py-4 space-y-2.5 text-xs">
            <div class="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Biaya Penggantian Komponen / Spareparts</span>
              <span class="font-mono font-semibold">{{ formatCurrency(orderData.parts_cost || 0) }}</span>
            </div>
            <div class="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Ongkos Jasa Perbaikan & Kalibrasi</span>
              <span class="font-mono font-semibold">{{ formatCurrency(orderData.labor_cost || 0) }}</span>
            </div>
            <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between font-bold text-sm">
              <span class="text-gray-900 dark:text-white">Total Tagihan:</span>
              <span
                class="font-mono text-base"
                :class="orderData.warranty_status === 'under_warranty' ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-600 dark:text-brand-400'"
              >
                {{ orderData.warranty_status === 'under_warranty' ? 'Rp 0 (Covered by Warranty)' : formatCurrency(orderData.total_cost || 0) }}
              </span>
            </div>
          </div>

          <!-- Customer Digital Approval Box -->
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div v-if="orderData.customer_approved_at" class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
              <div>
                <span class="font-bold">✓ Estimasi Biaya Telah Disetujui</span>
                <p class="text-2xs text-blue-600 dark:text-blue-400 mt-0.5">
                  Disetujui pada: {{ formatDate(orderData.customer_approved_at) }}
                  <span v-if="orderData.customer_approval_note"> - "{{ orderData.customer_approval_note }}"</span>
                </p>
              </div>
              <span class="px-2 py-0.5 rounded text-2xs font-bold bg-blue-100 dark:bg-blue-900">ACC</span>
            </div>

            <div v-else-if="orderData.state === 'diagnosis' || orderData.state === 'draft'" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 class="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Menunggu Persetujuan Estimasi Biaya
                  </h5>
                  <p class="text-2xs text-amber-700 dark:text-amber-400 mt-0.5">
                    Teknisi kami memerlukan persetujuan Anda sebelum pengerjaan penggantian komponen dimulai.
                  </p>
                </div>
                <button
                  type="button"
                  @click="openApprovalModal = true"
                  class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Setujui Biaya Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Persetujuan Digital Pelanggan -->
    <div v-if="openApprovalModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          Persetujuan Pengerjaan & Estimasi Biaya
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 py-3">
          Dengan menekan tombol Setuju, Anda mengonfirmasi persetujuan estimasi biaya reparasi unit
          <span class="font-bold text-gray-900 dark:text-white">{{ orderData?.name }}</span>
          sebesar <span class="font-mono font-bold text-brand-600">{{ formatCurrency(orderData?.total_cost || 0) }}</span>.
        </p>

        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Tambahan untuk Teknisi (Opsional)</label>
          <textarea
            v-model="customerApprovalNote"
            rows="2"
            placeholder="cth: Mohon konfirmasi via WA jika ada komponen lain yang perlu diganti..."
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            @click="openApprovalModal = false"
            class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmApproveEstimate"
            :disabled="isSubmittingApproval"
            class="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <svg v-if="isSubmittingApproval" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Setujui Perbaikan
          </button>
        </div>
      </div>
    </div>

    <!-- Public Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 py-4 text-center text-2xs text-gray-400">
      &copy; {{ new Date().getFullYear() }} Sistem Layanan Pelanggan Terpadu &bull; ISO 9001 Quality Certified
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { repairsService } from '@/services/services/repairs.service'
import type { IRepairOrderDto } from '@/types/services'

const route = useRoute()
const rmaInput = ref('')
const snInput = ref('')
const orderData = ref<IRepairOrderDto | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Customer Approval Dialog State
const openApprovalModal = ref(false)
const customerApprovalNote = ref('')
const isSubmittingApproval = ref(false)

const steps = [
  { key: 'draft', label: 'Unit Diterima', desc: 'Registrasi & Cek Awal' },
  { key: 'diagnosis', label: 'Diagnosa & Estimasi', desc: 'Analisa Kerusakan' },
  { key: 'under_repair', label: 'Dalam Pengerjaan', desc: 'Perbaikan Komponen' },
  { key: 'ready', label: 'Selesai QC', desc: 'Siap Diambil' },
  { key: 'done', label: 'Selesai / Diambil', desc: 'Serah Terima Unit' }
]

const searchTracking = async () => {
  if (!rmaInput.value.trim()) return
  isLoading.value = true
  error.value = null
  orderData.value = null
  try {
    const res = await repairsService.trackPublic(rmaInput.value.trim(), snInput.value.trim() || undefined)
    orderData.value = res
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Nomor perbaikan tidak ditemukan. Periksa kembali No. RMA Anda.'
  } finally {
    isLoading.value = false
  }
}

const confirmApproveEstimate = async () => {
  if (!orderData.value?.id) return
  isSubmittingApproval.value = true
  try {
    const res = await repairsService.approveEstimate({
      id: orderData.value.id,
      note: customerApprovalNote.value.trim()
    })
    orderData.value = res
    openApprovalModal.value = false
    alert('Terima kasih! Estimasi biaya telah Anda setujui. Teknisi kami akan segera memproses perbaikan unit.')
  } catch (err: any) {
    alert('Gagal menyetujui estimasi: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmittingApproval.value = false
  }
}

const getStageIndex = (stage?: string) => {
  const s = (stage || 'draft').toLowerCase()
  const idx = steps.findIndex(st => st.key === s)
  return idx !== -1 ? idx : 0
}

const isStepCompleted = (stepKey: string) => {
  if (!orderData.value) return false
  const currentIdx = getStageIndex(orderData.value.state)
  const thisIdx = steps.findIndex(st => st.key === stepKey)
  return thisIdx < currentIdx
}

const isStepActive = (stepKey: string) => {
  if (!orderData.value) return false
  const currentIdx = getStageIndex(orderData.value.state)
  const thisIdx = steps.findIndex(st => st.key === stepKey)
  return thisIdx === currentIdx
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

const getStageLabel = (state?: string) => {
  const s = (state || 'draft').toLowerCase()
  const found = steps.find(st => st.key === s)
  return found ? found.label : state || 'Diterima'
}

const getStageBadgeClass = (state?: string) => {
  const s = (state || 'draft').toLowerCase()
  switch (s) {
    case 'diagnosis': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    case 'under_repair': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
    case 'ready': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    case 'done': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getWarrantyLabel = (status?: string) => {
  switch (status) {
    case 'under_warranty': return 'Garansi Resmi Aktif'
    case 'expired': return 'Garansi Habis'
    default: return 'Non-Garansi'
  }
}

const getWarrantyBadgeClass = (status?: string) => {
  switch (status) {
    case 'under_warranty': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    case 'expired': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

onMounted(() => {
  if (route.query.rma) {
    rmaInput.value = String(route.query.rma)
    if (route.query.sn) snInput.value = String(route.query.sn)
    searchTracking()
  }
})
</script>
