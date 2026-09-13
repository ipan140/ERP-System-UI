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
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">14.8 GB</h3>
            <span class="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">14.8%</span>
          </div>
          <div class="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div class="h-2 rounded-full bg-amber-500" style="width: 14.8%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Batas Kuota: 100.0 GB</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Arsip HR & Slip Gaji</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">4.2 GB</h3>
            <span class="text-xs text-gray-500">2,480 Files</span>
          </div>
          <p class="text-xs text-blue-600 mt-2">PDF Slip Gaji, KTP & Kontrak</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Faktur & Keuangan</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">5.8 GB</h3>
            <span class="text-xs text-gray-500">4,120 Files</span>
          </div>
          <p class="text-xs text-emerald-600 mt-2">e-Faktur PPN, Bukti Bayar & PO</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-semibold uppercase text-gray-400">Penyedia Storage</span>
          <div class="mt-2 flex items-baseline justify-between">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">AWS S3 / MinIO</h3>
            <span class="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">ACTIVE</span>
          </div>
          <p class="text-xs text-gray-500 mt-2">Bucket: erp-company-dms</p>
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
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const isCleaning = ref(false)
const saveSuccess = ref(false)
const storageDriver = ref('S3')

const s3Config = ref({
  bucket: 'erp-company-dms',
  region: 'ap-southeast-1',
  accessKey: 'AKIAIOSFODNN7EXAMPLE',
  secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
})

const cleanTempFiles = () => {
  isCleaning.value = true
  setTimeout(() => {
    isCleaning.value = false
    alert('✓ Berhasil! 382 MB file temporary cache & preview PDF berhasil dibersihkan.')
  }, 1000)
}

const saveStorageConfig = () => {
  saveSuccess.value = true
  setTimeout(() => {
    saveSuccess.value = false
  }, 3000)
}
</script>
