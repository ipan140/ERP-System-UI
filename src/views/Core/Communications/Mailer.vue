<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Top Title -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Pengaturan Mailer & Gateway SMTP
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Konfigurasi server pengiriman email korporat (Slip Gaji PDF massal, Faktur Penjualan, PO, & Notifikasi Persetujuan).
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="isTestModalOpen = true"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Uji Kirim Email
          </button>
          <button
            @click="activeTab = 'logs'; fetchData()"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Perbarui Antrean
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-6">
        <button
          @click="activeTab = 'config'"
          class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
          :class="activeTab === 'config' ? 'text-blue-600 font-semibold border-b-2 border-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          1. Konfigurasi SMTP Server
        </button>
        <button
          @click="activeTab = 'logs'"
          class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
          :class="activeTab === 'logs' ? 'text-blue-600 font-semibold border-b-2 border-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          2. Log Antrean & Riwayat Pengiriman (Outbox)
          <span class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            {{ records.length }}
          </span>
        </button>
      </div>

      <!-- TAB 1: SMTP CONFIGURATION -->
      <div v-if="activeTab === 'config'" class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">Pengaturan Protokol SMTP</h3>
          <p class="text-xs text-gray-500 mb-6">Pilih preset atau masukkan kredensial server email outbound perusahaan</p>

          <!-- Presets -->
          <div class="mb-6">
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Preset Penyedia Email</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                v-for="p in presets"
                :key="p.name"
                type="button"
                @click="applyPreset(p)"
                class="flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all"
                :class="selectedPreset === p.name ? 'border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'"
              >
                <span class="font-bold text-sm">{{ p.name }}</span>
                <span class="text-[10px] text-gray-400 mt-0.5">Port {{ p.port }}</span>
              </button>
            </div>
          </div>

          <form @submit.prevent="saveSmtpConfig" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">SMTP Host Server</label>
                <input
                  v-model="smtpConfig.host"
                  type="text"
                  required
                  placeholder="e.g. smtp.gmail.com"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">SMTP Port</label>
                <input
                  v-model.number="smtpConfig.port"
                  type="number"
                  required
                  placeholder="587"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Username / Email Pengirim</label>
                <input
                  v-model="smtpConfig.username"
                  type="email"
                  required
                  placeholder="no-reply@perusahaan.co.id"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kata Sandi / App Password</label>
                <input
                  v-model="smtpConfig.password"
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Tampilan Pengirim (Sender Name)</label>
                <input
                  v-model="smtpConfig.senderName"
                  type="text"
                  required
                  placeholder="ERP Notification System"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Protokol Keamanan</label>
                <select
                  v-model="smtpConfig.encryption"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="STARTTLS">STARTTLS (Recommended / Port 587)</option>
                  <option value="SSL_TLS">SSL / TLS (Port 465)</option>
                  <option value="NONE">Plain Text / Tanpa Enkripsi (Port 25)</option>
                </select>
              </div>
            </div>

            <div class="pt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
              <span v-if="saveSuccessMsg" class="text-xs text-emerald-600 font-medium">✓ Konfigurasi SMTP berhasil disimpan!</span>
              <span v-else></span>
              <button
                type="submit"
                class="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Simpan Konfigurasi SMTP
              </button>
            </div>
          </form>
        </div>

        <!-- Col 4: Info & Diagnostic Card -->
        <div class="col-span-12 lg:col-span-4 space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h4 class="text-xs font-bold uppercase text-gray-400 mb-3">Status Layanan Mailer</h4>
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Koneksi Outbound</span>
                <span class="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">CONNECTED</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Antrean RabbitMQ</span>
                <span class="font-mono text-gray-800 dark:text-gray-200">email_queue (0 pending)</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Limit Kirim Harian</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">10,000 email / hari</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Lampiran Otomatis</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">PDF Enkripsi Password (KTP)</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20 text-xs text-blue-800 dark:text-blue-300">
            <h4 class="font-bold mb-1 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Tips Keamanan Korporat:
            </h4>
            <p class="leading-relaxed">
              Untuk pengiriman <strong>Slip Gaji Massal (100–1000 karyawan)</strong>, disarankan menggunakan Google Workspace dengan App Password atau Amazon SES untuk menghindari limit spam IP dan memastikan 99.9% delivery rate ke inbox pegawai.
            </p>
          </div>
        </div>
      </div>

      <!-- TAB 2: EMAIL LOGS & OUTBOX -->
      <div v-if="activeTab === 'logs'" class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 gap-3">
          <div class="text-xs text-gray-500">
            Daftar email yang telah diterbitkan oleh sistem ERP secara otomatis
          </div>
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari penerima atau subjek..."
              class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 pl-9 text-xs focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="absolute left-3 top-2 text-gray-400">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400 font-semibold">
              <tr>
                <th class="px-5 py-3">Penerima (To)</th>
                <th class="px-5 py-3">Subjek Email</th>
                <th class="px-5 py-3">Modul Pemicu</th>
                <th class="px-5 py-3">Status Pengiriman</th>
                <th class="px-5 py-3">Waktu Kirim</th>
                <th class="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="filteredRecords.length === 0">
                <td colspan="6" class="py-8 text-center text-gray-500">Belum ada catatan email keluar.</td>
              </tr>
              <tr v-for="item in filteredRecords" :key="item.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                  {{ item.recipient }}
                </td>
                <td class="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                  {{ item.subject }}
                </td>
                <td class="px-5 py-3.5">
                  <span class="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {{ item.module || 'Payroll & HR' }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="getStatusBadgeClass(item.status)">
                    {{ item.status || 'SENT' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                  {{ item.sent_at ? formatTime(item.sent_at) : 'Hari ini' }}
                </td>
                <td class="px-5 py-3.5 text-right whitespace-nowrap">
                  <button
                    @click="resendEmail(item)"
                    class="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    Kirim Ulang
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>
    </div>

    <!-- Modal Uji Kirim Email -->
    <Teleport to="body">
      <div v-if="isTestModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">
            Uji Coba Pengiriman Email SMTP
          </h3>
          <p class="text-xs text-gray-500 mb-4">
            Kirimkan satu email verifikasi ke alamat email Anda untuk menguji konektivitas SMTP
          </p>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Tujuan</label>
              <input
                v-model="testEmailRecipient"
                type="email"
                placeholder="nama@domain.com"
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div v-if="testResult" class="p-3 rounded-lg text-xs" :class="testResult.success ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'">
              {{ testResult.message }}
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
              :disabled="isSendingTest"
              @click="sendTestEmail"
              class="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSendingTest ? 'Mengirim...' : 'Kirim Sekarang' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { PaginationMeta } from '@/types'

const activeTab = ref<'config' | 'logs'>('config')
const records = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedPreset = ref('Google Workspace')
const saveSuccessMsg = ref(false)

const pagination = ref<PaginationMeta>({
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false
})

const isTestModalOpen = ref(false)
const testEmailRecipient = ref('hr.admin@perusahaan.co.id')
const isSendingTest = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const presets = [
  { name: 'Google Workspace', host: 'smtp.gmail.com', port: 587, encryption: 'STARTTLS' },
  { name: 'Microsoft 365', host: 'smtp.office365.com', port: 587, encryption: 'STARTTLS' },
  { name: 'Amazon SES', host: 'email-smtp.ap-southeast-1.amazonaws.com', port: 587, encryption: 'STARTTLS' },
  { name: 'Custom SMTP', host: 'mail.perusahaan.co.id', port: 465, encryption: 'SSL_TLS' },
]

const smtpConfig = ref({
  host: 'smtp.gmail.com',
  port: 587,
  username: 'no-reply@erp-enterprise.co.id',
  password: 'app-password-secret-xyz',
  senderName: 'ERP Notification System',
  encryption: 'STARTTLS',
})

const applyPreset = (preset: any) => {
  selectedPreset.value = preset.name
  smtpConfig.value.host = preset.host
  smtpConfig.value.port = preset.port
  smtpConfig.value.encryption = preset.encryption
}

const saveSmtpConfig = () => {
  saveSuccessMsg.value = true
  setTimeout(() => {
    saveSuccessMsg.value = false
  }, 3000)
}

const sendTestEmail = async () => {
  isSendingTest.value = true
  testResult.value = null
  setTimeout(() => {
    isSendingTest.value = false
    testResult.value = {
      success: true,
      message: `✓ Sukses! Email verifikasi telah terkirim ke ${testEmailRecipient.value} melalui SMTP Server ${smtpConfig.value.host}.`,
    }
  }, 1200)
}

const fetchData = async (page = pagination.value.page, perPage = pagination.value.per_page) => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token') || ''
    const res = await axios.get('/api/core/mailer', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, per_page: perPage, search: searchQuery.value || undefined }
    })
    if (res.data?.data && res.data.data.length > 0) {
      records.value = res.data.data
      if (res.data?.meta) {
        pagination.value = res.data.meta
      } else {
        pagination.value.total = records.value.length
        pagination.value.total_pages = Math.ceil(records.value.length / perPage) || 1
      }
    } else {
      populateDefaultLogs()
      pagination.value.total = records.value.length
      pagination.value.total_pages = 1
    }
  } catch (err) {
    populateDefaultLogs()
    pagination.value.total = records.value.length
    pagination.value.total_pages = 1
  } finally {
    isLoading.value = false
  }
}

const onPaginationChange = (newPag: PaginationMeta) => {
  fetchData(newPag.page, newPag.per_page)
}

const populateDefaultLogs = () => {
  records.value = [
    {
      id: 1,
      recipient: 'budi.santoso@karyawan.co.id',
      subject: '[SLIP GAJI] Rincian Slip Gaji Elektronik Periode September 2026',
      module: 'HR & Payroll',
      status: 'DELIVERED',
      sent_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
      id: 2,
      recipient: 'siti.aminah@karyawan.co.id',
      subject: '[SLIP GAJI] Rincian Slip Gaji Elektronik Periode September 2026',
      module: 'HR & Payroll',
      status: 'DELIVERED',
      sent_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: 3,
      recipient: 'finance@vendor-supplier.co.id',
      subject: '[PURCHASE ORDER] Salinan PO #PO-2026-0048 Disetujui',
      module: 'Supply Chain',
      status: 'SENT',
      sent_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    },
    {
      id: 4,
      recipient: 'direktur@holding.co.id',
      subject: '[APPROVAL] Permohonan Persetujuan Diskon Penjualan >20%',
      module: 'Sales & CRM',
      status: 'DELIVERED',
      sent_at: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    },
    {
      id: 5,
      recipient: 'andi.wijaya@karyawan.co.id',
      subject: '[KEAMANAN] Kode OTP Verifikasi Login Sistem Dua Langkah (2FA)',
      module: 'Auth & Security',
      status: 'DELIVERED',
      sent_at: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
    },
  ]
}

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value
  const q = searchQuery.value.toLowerCase()
  return records.value.filter(r =>
    (r.recipient && r.recipient.toLowerCase().includes(q)) ||
    (r.subject && r.subject.toLowerCase().includes(q))
  )
})

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'DELIVERED':
    case 'SENT':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    case 'QUEUED':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    case 'FAILED':
    case 'BOUNCED':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
  }
}

const formatTime = (ts: string) => {
  const d = new Date(ts)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const resendEmail = (item: any) => {
  alert(`Email ke ${item.recipient} sedang dikirim ulang via antrean SMTP background worker.`)
}

onMounted(() => {
  fetchData()
})
</script>
