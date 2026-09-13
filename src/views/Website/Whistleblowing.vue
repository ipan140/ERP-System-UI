<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Whistleblowing System (WBS)" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kanal Pengaduan Pelanggaran Etika & Kepatuhan Korporat (Anonim, Terenkripsi & Terlindungi)
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Kerahasiaan Pelapor 100% Dijamin
          </span>
        </div>
      </div>

      <!-- Compliance Hero Notice -->
      <div class="rounded-3xl bg-gradient-to-r from-red-900 via-slate-900 to-gray-900 p-6 text-white shadow-xl">
        <div class="max-w-3xl">
          <span class="rounded-md bg-red-500/30 border border-red-400/40 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-red-200">
            Sistem Kepatuhan Good Corporate Governance (GCG)
          </span>
          <h2 class="mt-2 text-2xl font-extrabold sm:text-3xl">
            Saluran Pengaduan Dugaan Pelanggaran & Fraud
          </h2>
          <p class="mt-1 text-xs sm:text-sm text-gray-300 leading-relaxed">
            PT. Nusantara Prima Solusindo berkomitmen menegakkan integritas tertinggi. Jika Anda mengetahui adanya indikasi kecurangan keuangan (*fraud*), gratifikasi, pelecehan, pelanggaran K3, atau penyalahgunaan wewenang, laporkan secara aman di sini.
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'report'"
          :class="[
            'py-3 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'report'
              ? 'border-red-500 text-red-600 dark:text-red-400 bg-red-50/40 dark:bg-red-900/10 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <span>📝 Buat Laporan Pengaduan Baru</span>
        </button>

        <button
          @click="activeTab = 'track'"
          :class="[
            'py-3 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'track'
              ? 'border-red-500 text-red-600 dark:text-red-400 bg-red-50/40 dark:bg-red-900/10 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <span>🔍 Lacak Status Tiket Pengaduan</span>
        </button>
      </div>

      <!-- TAB 1: FORMULIR PENGADUAN -->
      <div v-if="activeTab === 'report'" class="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800 max-w-3xl">
        <div v-if="submittedTicket" class="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center dark:bg-emerald-900/20 dark:border-emerald-800">
          <div class="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 text-xl font-bold mb-2">
            ✓
          </div>
          <h3 class="text-lg font-bold text-emerald-900 dark:text-emerald-200">Laporan Pengaduan Berhasil Dikirimkan!</h3>
          <p class="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            Simpan nomor tiket berikut untuk memantau perkembangan tindak lanjut tanpa perlu mengungkapkan identitas Anda:
          </p>
          <div class="my-4 inline-block rounded-xl bg-white px-6 py-2 text-xl font-mono font-extrabold text-red-600 border border-emerald-300 shadow-sm">
            {{ submittedTicket }}
          </div>
          <div>
            <button
              @click="activeTab = 'track'; trackTicketCode = submittedTicket; submittedTicket = ''"
              class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600"
            >
              Langsung Lacak Tiket Ini &rarr;
            </button>
          </div>
        </div>

        <form v-else @submit.prevent="submitReport" class="space-y-4">
          <div class="rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
            🔒 <strong>Perlindungan Kerahasiaan:</strong> Laporan ini tidak merekam nama akun atau alamat IP Anda. Seluruh berkas hanya dapat diakses oleh Komite Audit Independen & Direksi Utama.
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Kategori Dugaan Pelanggaran *
              </label>
              <select
                v-model="wbsForm.category"
                required
                class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="Kecurangan Keuangan & Fraud">Kecurangan Keuangan & Fraud</option>
                <option value="Gratifikasi / Suap">Penerimaan Gratifikasi / Suap</option>
                <option value="Pelecehan & Diskriminasi">Pelecehan & Diskriminasi di Tempat Kerja</option>
                <option value="Pelanggaran K3 & Lingkungan">Pelanggaran K3 & Keselamatan Kerja</option>
                <option value="Benturan Kepentingan">Benturan Kepentingan (Conflict of Interest)</option>
                <option value="Lainnya">Pelanggaran SOP Lainnya</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Perkiraan Tanggal Kejadian *
              </label>
              <input
                v-model="wbsForm.incident_date"
                required
                type="text"
                placeholder="Contoh: Awal September 2026 / Berulang"
                class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Subjek Singkat Laporan *
            </label>
            <input
              v-model="wbsForm.subject"
              required
              type="text"
              placeholder="Contoh: Dugaan manipulasi faktur pengadaan barang di gudang"
              class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Lokasi / Cabang Terkait
            </label>
            <input
              v-model="wbsForm.location"
              type="text"
              placeholder="Contoh: Kantor Cabang Surabaya / Lantai 3 Gedung Pusat"
              class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Uraian Lengkap Kronologi Kejadian (5W + 1H) *
            </label>
            <textarea
              v-model="wbsForm.description"
              required
              rows="5"
              placeholder="Jelaskan secara runtut apa yang terjadi, siapa pihak terkait (jika diketahui), bagaimana modus dilakukan, dan dampak bagi perusahaan..."
              class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Tautan Bukti / Dokumen Pendukung (Cloud Storage / Google Drive / URL)
            </label>
            <input
              v-model="wbsForm.evidence_url"
              type="text"
              placeholder="https://drive.google.com/... atau tautan berkas pendukung"
              class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="pt-3 flex justify-end">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-red-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Pengaduan Rahasia' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 2: PELACAKAN STATUS TIKET -->
      <div v-else class="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800 max-w-2xl">
        <h3 class="font-bold text-base text-gray-900 dark:text-white mb-2">
          Pantau Progres Penyelidikan Pengaduan
        </h3>
        <p class="text-xs text-gray-500 mb-5">
          Masukkan nomor tiket pengaduan rahasia Anda (contoh: <code>WBS-2026-4512</code>) untuk memeriksa tanggapan tim audit.
        </p>

        <form @submit.prevent="checkTicketStatus" class="flex gap-3 mb-6">
          <input
            v-model="trackTicketCode"
            required
            type="text"
            placeholder="Masukkan Nomor Tiket: WBS-2026-XXXX"
            class="flex-1 rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm font-mono focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <button
            type="submit"
            class="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            Cek Status
          </button>
        </form>

        <div v-if="ticketResult" class="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-700 dark:bg-gray-900/30 space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
            <span class="font-mono font-bold text-sm text-gray-900 dark:text-white">{{ ticketResult.ticket_code }}</span>
            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {{ ticketResult.status }}
            </span>
          </div>

          <div class="text-xs space-y-1">
            <p><strong>Kategori:</strong> {{ ticketResult.category }}</p>
            <p><strong>Subjek:</strong> {{ ticketResult.subject }}</p>
            <p><strong>Tanggal Masuk:</strong> {{ formatDate(ticketResult.created_at) }}</p>
          </div>

          <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h5 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Tanggapan Resmi Komite Audit / Etik:</h5>
            <p class="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
              {{ ticketResult.resolution || 'Laporan telah diterima dan sedang dilakukan verifikasi bukti dokumen oleh tim pemeriksa independen.' }}
            </p>
          </div>
        </div>

        <div v-else-if="ticketNotFound" class="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          Nomor tiket tidak ditemukan dalam basis data sistem pengaduan. Harap periksa kembali nomor tiket Anda.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const activeTab = ref<'report' | 'track'>('report')
const isSubmitting = ref(false)
const submittedTicket = ref('')
const trackTicketCode = ref('')
const ticketResult = ref<any>(null)
const ticketNotFound = ref(false)

const wbsForm = ref({
  category: 'Kecurangan Keuangan & Fraud',
  subject: '',
  description: '',
  location: '',
  incident_date: '',
  evidence_url: '',
})

function formatDate(iso: string): string {
  if (!iso) return 'Hari ini'
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '-'
  }
}

async function submitReport() {
  isSubmitting.value = true
  try {
    const res = await fetch('http://localhost:7070/api/website/whistleblowing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wbsForm.value),
    })
    const json = await res.json()
    if (res.ok && json.data?.ticket_code) {
      submittedTicket.value = json.data.ticket_code
      wbsForm.value = {
        category: 'Kecurangan Keuangan & Fraud',
        subject: '',
        description: '',
        location: '',
        incident_date: '',
        evidence_url: '',
      }
    }
  } catch (err) {
    console.error('Failed to submit WBS report:', err)
  } finally {
    isSubmitting.value = false
  }
}

async function checkTicketStatus() {
  ticketResult.value = null
  ticketNotFound.value = false
  if (!trackTicketCode.value.trim()) return

  try {
    const res = await fetch(`http://localhost:7070/api/website/whistleblowing/${encodeURIComponent(trackTicketCode.value.trim())}`)
    if (res.ok) {
      const json = await res.json()
      if (json.data) ticketResult.value = json.data
      else ticketNotFound.value = true
    } else {
      ticketNotFound.value = true
    }
  } catch (err) {
    ticketNotFound.value = true
  }
}
</script>
