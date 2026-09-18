<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Top Title -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
              </svg>
            </span>
            Kapasitas & Penyimpanan File (Storage DMS)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pengelolaan kuota berkas perusahaan (100–1000 Karyawan), media lampiran, dan konfigurasi Cloud Object Storage (S3 / MinIO).
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="cleanTempFiles"
            :disabled="isCleaning"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <svg :class="{'animate-spin': isCleaning}" class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ isCleaning ? 'Membersihkan...' : 'Bersihkan Cache Temp' }}
          </button>
        </div>
      </div>

      <!-- Capacity Gauge Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Total Terpakai</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatSize(storageStats.total_bytes) }}</h3>
            <span class="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">{{ storageStats.used_percent.toFixed(1) }}%</span>
          </div>
          <div class="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div class="h-2 rounded-full bg-amber-500" :style="{ width: Math.min(storageStats.used_percent, 100) + '%' }"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Batas Kuota: {{ formatSize(storageStats.quota_bytes) }}</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Arsip HR & Slip Gaji</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatSize(storageStats.hr_bytes) }}</h3>
            <span class="text-xs text-gray-500">{{ storageStats.hr_files }} Files</span>
          </div>
          <p class="text-xs text-blue-600 mt-2">PDF Slip Gaji, KTP & Kontrak</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Faktur & Keuangan</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatSize(storageStats.finance_bytes) }}</h3>
            <span class="text-xs text-gray-500">{{ storageStats.finance_files }} Files</span>
          </div>
          <p class="text-xs text-emerald-600 mt-2">e-Faktur PPN, Bukti Bayar & PO</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Penyedia Storage</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ storageDriver === 'S3' ? 'AWS S3 / MinIO' : storageDriver }}</h3>
            <span class="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">ACTIVE</span>
          </div>
          <p class="text-xs text-gray-500 mt-2">Bucket: {{ s3Config.bucket || 'erp-company-dms' }}</p>
        </div>
      </div>

      <!-- Storage Configuration Form -->
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-7 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">Pengaturan Driver Penyimpanan</h3>
          <p class="text-xs text-gray-500 mb-6">Pilih lokasi fisik atau cloud bucket penyimpanan berkas dokumen</p>

          <form @submit.prevent="saveStorageConfig" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe Driver Storage</label>
              <select
                v-model="storageDriver"
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="S3">Amazon S3 / MinIO Compatible Object Storage</option>
                <option value="LOCAL">Local Disk (Storage Volume Server)</option>
                <option value="GCS">Google Cloud Storage</option>
              </select>
            </div>

            <div v-if="storageDriver === 'S3'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Bucket Name</label>
                <input
                  v-model="s3Config.bucket"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
                <input
                  v-model="s3Config.region"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Access Key ID</label>
                <input
                  v-model="s3Config.accessKey"
                  type="password"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Secret Access Key</label>
                <input
                  v-model="s3Config.secretKey"
                  type="password"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div class="pt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
              <span v-if="saveSuccess" class="text-xs text-emerald-600 font-medium">✓ Konfigurasi penyimpanan berhasil disimpan!</span>
              <span v-else></span>
              <button
                type="submit"
                class="rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
              >
                Simpan Konfigurasi Storage
              </button>
            </div>
          </form>
        </div>

        <div class="col-span-12 lg:col-span-5 space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h4 class="text-xs font-bold uppercase text-gray-400 mb-3">Rincian Penggunaan Berdasarkan Format</h4>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Dokumen PDF (Slip Gaji, Invoice, PO)</span>
                  <span class="font-bold text-gray-900 dark:text-white">8.4 GB (56%)</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div class="h-1.5 rounded-full bg-blue-500" style="width: 56%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Gambar & Foto Produk (JPG/PNG)</span>
                  <span class="font-bold text-gray-900 dark:text-white">4.1 GB (28%)</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div class="h-1.5 rounded-full bg-emerald-500" style="width: 28%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Spreadsheet Excel & CSV Laporan</span>
                  <span class="font-bold text-gray-900 dark:text-white">2.3 GB (16%)</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div class="h-1.5 rounded-full bg-purple-500" style="width: 16%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daftar Berkas & Attachment di Storage -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Berkas & Lampiran Storage</h3>
            <p class="text-xs text-gray-500">Log berkas fisik dan lampiran yang tersimpan di driver storage.</p>
          </div>
          <button @click="fetchData" class="text-xs text-brand-600 font-semibold hover:underline">
            Refresh
          </button>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-700 dark:text-gray-200">Nama Berkas</th>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-700 dark:text-gray-200">Tipe Berkas</th>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-700 dark:text-gray-200">Ukuran</th>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-700 dark:text-gray-200">Lokasi / Path</th>
                <th class="px-5 py-3.5 text-left font-semibold text-gray-700 dark:text-gray-200">Diunggah Oleh</th>
                <th class="px-5 py-3.5 text-right font-semibold text-gray-700 dark:text-gray-200">Tanggal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="isLoading">
                <td colspan="6" class="py-8 text-center text-gray-500">Memuat berkas storage...</td>
              </tr>
              <tr v-else-if="records.length === 0">
                <td colspan="6" class="py-8 text-center text-gray-500">Belum ada berkas lampiran yang tercatat.</td>
              </tr>
              <tr v-for="item in records" :key="item.id" class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition">
                <td class="px-5 py-3.5 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>📄</span>
                  <span>{{ item.file_name || 'attachment' }}</span>
                </td>
                <td class="px-5 py-3.5 text-gray-600 dark:text-gray-300">
                  <span class="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-mono">
                    {{ item.file_type || '-' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-gray-600 dark:text-gray-300">{{ formatSize(item.file_size) }}</td>
                <td class="px-5 py-3.5 text-gray-500 dark:text-gray-400 font-mono text-[11px] truncate max-w-xs">{{ item.file_path || '-' }}</td>
                <td class="px-5 py-3.5 text-gray-700 dark:text-gray-300">{{ item.uploadedby?.name || item.uploadedby?.username || 'System' }}</td>
                <td class="px-5 py-3.5 text-right text-gray-500 dark:text-gray-400">{{ formatDate(item.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { IPaginationMeta } from '@/types'
import { storageService } from '@/services/core/storage.service'

const isCleaning = ref(false)
const saveSuccess = ref(false)
const storageDriver = ref('S3')
const isLoading = ref(false)
const records = ref<any[]>([])

const storageStats = ref({
  total_bytes: 0,
  used_percent: 0,
  hr_bytes: 0,
  hr_files: 0,
  finance_bytes: 0,
  finance_files: 0,
  quota_bytes: 100 * 1024 * 1024 * 1024,
  driver: 'S3',
  bucket: ''
})

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
  fetchData()
}

const s3Config = ref({
  bucket: 'erp-company-dms',
  region: 'ap-southeast-1',
  accessKey: '',
  secretKey: ''
})

const cleanTempFiles = async () => {
  isCleaning.value = true
  try {
    const res = await storageService.cleanTemp()
    alert(res?.message || '✓ Berhasil membersihkan temporary cache storage.')
    fetchStats()
  } catch (err: any) {
    alert('Gagal membersihkan temp files: ' + (err.response?.data?.message || err.message))
  } finally {
    isCleaning.value = false
  }
}

const saveStorageConfig = async () => {
  try {
    await storageService.saveConfig({
      driver: storageDriver.value,
      bucket: s3Config.value.bucket,
      region: s3Config.value.region,
      access_key: s3Config.value.accessKey,
      secret_key: s3Config.value.secretKey
    })
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
    fetchStats()
  } catch (err: any) {
    alert('Gagal menyimpan konfigurasi: ' + (err.response?.data?.message || err.message))
  }
}

const formatSize = (bytes?: number) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + (sizes[i] || 'B')
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const fetchStats = async () => {
  try {
    const res = await storageService.getStats()
    if (res) {
      storageStats.value = {
        total_bytes: res.total_bytes || 0,
        used_percent: res.used_percent || 0,
        hr_bytes: res.hr_bytes || 0,
        hr_files: res.hr_files || 0,
        finance_bytes: res.finance_bytes || 0,
        finance_files: res.finance_files || 0,
        quota_bytes: res.quota_bytes || 100 * 1024 * 1024 * 1024,
        driver: res.driver || 'S3',
        bucket: res.bucket || ''
      }
      if (res.driver) storageDriver.value = res.driver
    }
  } catch (err) {
    console.error('Error fetching storage stats:', err)
  }
}

const fetchConfig = async () => {
  try {
    const res = await storageService.getConfig()
    if (res) {
      if (res.driver) storageDriver.value = res.driver
      s3Config.value = {
        bucket: res.bucket || '',
        region: res.region || '',
        accessKey: res.access_key || '',
        secretKey: res.secret_key || ''
      }
    }
  } catch (err) {
    console.error('Error fetching storage config:', err)
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await storageService.getAll({
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    })
    if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
      records.value = (res as any).data
      if ((res as any).pagination) pagination.value = (res as any).pagination
    } else if (Array.isArray(res)) {
      records.value = res
    }
  } catch (err) {
    console.error('Error fetching storage records:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
  fetchStats()
  fetchConfig()
})
</script>
