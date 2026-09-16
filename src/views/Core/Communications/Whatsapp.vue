<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Top Title -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            WhatsApp Business Gateway & Broadcast
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gateway resmi pengiriman pesan otomatis (Notifikasi Slip Gaji, Tagihan Invoice, Approval Cuti & OTP 2FA).
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="isTestModalOpen = true"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Kirim Uji Coba WA
          </button>
          <button
            @click="activeTab = 'templates'"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Template
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-6">
        <button
          @click="activeTab = 'config'"
          class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
          :class="activeTab === 'config' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
        >
          1. Konfigurasi API Gateway
        </button>
        <button
          @click="activeTab = 'templates'"
          class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
          :class="activeTab === 'templates' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
        >
          2. Template Pesan Otomatis (HSM)
          <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {{ templates.length }}
          </span>
        </button>
        <button
          @click="activeTab = 'logs'"
          class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
          :class="activeTab === 'logs' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
        >
          3. Riwayat Pesan Terkirim
        </button>
      </div>

      <!-- TAB 1: GATEWAY CONFIG -->
      <div v-if="activeTab === 'config'" class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">Pengaturan WhatsApp Gateway Provider</h3>
          <p class="text-xs text-gray-500 mb-6">Hubungkan kredensial API WhatsApp Official Cloud API atau Gateway Korporat</p>

          <form @submit.prevent="saveGatewayConfig" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Penyedia Gateway (Provider)</label>
                <select
                  v-model="gwConfig.provider"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="WABA_CLOUD">WhatsApp Cloud API (Meta Official)</option>
                  <option value="FONNTE">Fonnte Enterprise API Gateway</option>
                  <option value="WABLAS">Wablas Enterprise Gateway</option>
                  <option value="TWILIO">Twilio Messaging API</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">API Token / Secret Key</label>
                <input
                  v-model="gwConfig.apiToken"
                  type="password"
                  required
                  placeholder="EAAG... (Bearer Token)"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sender Phone Number ID</label>
                <input
                  v-model="gwConfig.phoneId"
                  type="text"
                  required
                  placeholder="e.g. 1092837465019"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook Endpoint (Inbound & Status Read)</label>
                <input
                  v-model="gwConfig.webhookUrl"
                  type="text"
                  readonly
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 font-mono text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                />
              </div>
            </div>

            <div class="pt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
              <span v-if="saveSuccessMsg" class="text-xs text-emerald-600 font-medium">✓ Konfigurasi WhatsApp Gateway berhasil disimpan!</span>
              <span v-else></span>
              <button
                type="submit"
                class="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Simpan Kredensial Gateway
              </button>
            </div>
          </form>
        </div>

        <div class="col-span-12 lg:col-span-4 space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h4 class="text-xs font-bold uppercase text-gray-400 mb-3">Status WhatsApp Engine</h4>
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Status Gateway</span>
                <span class="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">CONNECTED & VERIFIED</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Tier Limit Akun</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">10,000 nomor unik / hari</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Quality Rating</span>
                <span class="font-semibold text-emerald-600">HIGH (Green Badge)</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Nomor Pengirim</span>
                <span class="font-mono text-gray-800 dark:text-gray-200">+62 811-9022-XXXX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: TEMPLATES -->
      <div v-if="activeTab === 'templates'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tpl in templates"
          :key="tpl.id"
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {{ tpl.category }}
              </span>
              <span class="text-[10px] font-mono text-gray-400">ID: {{ tpl.id }}</span>
            </div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-2">{{ tpl.name }}</h4>
            <div class="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {{ tpl.content }}
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span class="text-[11px] text-gray-400 font-medium">Meta Verified Template ✓</span>
            <button
              @click="testTemplate(tpl)"
              class="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Uji Template Ini &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 3: LOGS -->
      <div v-if="activeTab === 'logs'" class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500">
          Riwayat broadcast pesan WhatsApp otomatis kepada karyawan dan mitra
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400 font-semibold">
              <tr>
                <th class="px-5 py-3">Nomor Tujuan (WhatsApp)</th>
                <th class="px-5 py-3">Nama Pegawai / Mitra</th>
                <th class="px-5 py-3">Template</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Waktu Terkirim</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="log in waLogs" :key="log.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-5 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-medium">{{ log.phone }}</td>
                <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{{ log.name }}</td>
                <td class="px-5 py-3.5 text-gray-600 dark:text-gray-300">{{ log.template }}</td>
                <td class="px-5 py-3.5">
                  <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {{ log.status }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-gray-400">{{ log.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>
    </div>

    <!-- Modal Uji Kirim WA -->
    <Teleport to="body">
      <div v-if="isTestModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">
            Uji Coba Kirim WhatsApp Gateway
          </h3>
          <p class="text-xs text-gray-500 mb-4">
            Kirim pesan simulasi ke nomor telepon WhatsApp Anda
          </p>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor WhatsApp (Kode Negara 62)</label>
              <input
                v-model="testPhone"
                type="text"
                placeholder="6281234567890"
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Template Pesan</label>
              <select
                v-model="selectedTestTemplateId"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>

            <div v-if="testResult" class="p-3 rounded-lg text-xs bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              {{ testResult }}
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              @click="isTestModalOpen = false; testResult = null"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Tutup
            </button>
            <button
              type="button"
              :disabled="isSending"
              @click="sendTestWA"
              class="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {{ isSending ? 'Mengirim...' : 'Kirim Pesan WA' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { PaginationMeta } from '@/types'

const activeTab = ref<'config' | 'templates' | 'logs'>('config')
const saveSuccessMsg = ref(false)
const isTestModalOpen = ref(false)
const testPhone = ref('6281298765432')
const selectedTestTemplateId = ref('TPL_PAYROLL_01')
const isSending = ref(false)
const testResult = ref<string | null>(null)

const pagination = ref<PaginationMeta>({
  page: 1,
  per_page: 10,
  total: 4,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const onPaginationChange = (newPag: PaginationMeta) => {
  pagination.value = newPag
}

const gwConfig = ref({
  provider: 'WABA_CLOUD',
  apiToken: 'EAAG12348765SECRETTOKENERP...',
  phoneId: '1092837465019',
  webhookUrl: 'https://erp.perusahaan.co.id/api/whatsapp/webhook',
})

const templates = ref([
  {
    id: 'TPL_PAYROLL_01',
    category: 'Payroll & HRIS',
    name: 'Notifikasi Slip Gaji Karyawan',
    content: `Halo {{1}}, Slip Gaji Elektronik Anda untuk periode {{2}} telah terbit.\nTotal Gaji Bersih: {{3}}.\nSilakan unduh dokumen terlampir pada portal ERP ESS. Terima kasih.`,
  },
  {
    id: 'TPL_LEAVE_APPROVAL',
    category: 'HR Attendance',
    name: 'Persetujuan Pengajuan Cuti',
    content: `Yth {{1}}, permohonan {{2}} Anda selama {{3}} hari telah DISETUJUI oleh atasan langsung.\nSisa cuti tahunan Anda: {{4}} hari.`,
  },
  {
    id: 'TPL_INVOICE_BILLING',
    category: 'Finance & Accounting',
    name: 'Tagihan Faktur Penjualan',
    content: `Yth. Pelanggan {{1}}, Invoice {{2}} senilai {{3}} telah jatuh tempo pada {{4}}.\nSilakan lakukan pembayaran ke rekening Virtual Account BCA / Mandiri terlampir.`,
  },
  {
    id: 'TPL_AUTH_OTP',
    category: 'Security & Auth',
    name: 'Kode OTP Verifikasi Login',
    content: `KODE KEAMANAN ERP: {{1}} adalah kode rahasia verifikasi login sistem Anda. Jangan berikan kepada siapapun termasuk staf IT. Berlaku 5 menit.`,
  },
])

const waLogs = ref([
  { id: 1, phone: '+62 812-8812-9901', name: 'Budi Santoso (Staff HR)', template: 'Notifikasi Slip Gaji Karyawan', status: 'READ ✓✓', time: '10:14 WIB' },
  { id: 2, phone: '+62 813-7721-4452', name: 'Siti Aminah (Finance AP)', template: 'Notifikasi Slip Gaji Karyawan', status: 'READ ✓✓', time: '10:14 WIB' },
  { id: 3, phone: '+62 821-3344-5566', name: 'PT Surya Prima (Vendor)', template: 'Tagihan Faktur Penjualan', status: 'DELIVERED ✓', time: '09:30 WIB' },
  { id: 4, phone: '+62 811-9988-1122', name: 'Direktur Operasional', template: 'Persetujuan Pengajuan Cuti', status: 'READ ✓✓', time: 'Kemarin 16:45' },
])

const saveGatewayConfig = () => {
  saveSuccessMsg.value = true
  setTimeout(() => { saveSuccessMsg.value = false }, 3000)
}

const testTemplate = (tpl: any) => {
  selectedTestTemplateId.value = tpl.id
  isTestModalOpen.value = true
}

const sendTestWA = () => {
  isSending.value = true
  testResult.value = null
  setTimeout(() => {
    isSending.value = false
    testResult.value = `✓ Berhasil! Pesan template WhatsApp telah terkirim ke nomor ${testPhone.value} dengan status DELIVERED.`
  }, 1000)
}
</script>
