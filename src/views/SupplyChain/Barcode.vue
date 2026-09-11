<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Supply Chain" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 5v14M8 5v14M12 5v14M17 5v14M21 5v14" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
            </span>
            Sistem Barcode & Scanner Cerdas
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standar Odoo 18 Barcode App & Mekari SCM: Pengecekan stok cepat, pencarian dokumen multi-entitas, cetak label SKU/Lokasi, dan nomenklatur GS1.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="fetchData"
            :disabled="isLoading"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            title="Muat Ulang Data"
          >
            <svg :class="['w-4 h-4', { 'animate-spin': isLoading }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>

          <button
            @click="openPrintModal()"
            class="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Cetak Label Barcode
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU Ter-Barcode</p>
              <h3 class="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">{{ summary.total_barcoded_skus }}</h3>
              <p class="text-2xs text-gray-400 mt-1">Produk siap scan di gudang</p>
            </div>
            <div class="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nomenklatur GS1</p>
              <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{{ summary.total_nomenclatures }}</h3>
              <p class="text-2xs text-gray-400 mt-1">Standarisasi format barcode</p>
            </div>
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aturan Pola (Rules)</p>
              <h3 class="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{{ summary.total_rules }}</h3>
              <p class="text-2xs text-gray-400 mt-1">Deteksi Prefix Lokasi/Lot/Item</p>
            </div>
            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Buttons -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 gap-6 text-sm font-semibold">
        <button
          @click="activeTab = 'scanner'"
          :class="['pb-3 transition relative', activeTab === 'scanner' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400']"
        >
          Scanner Interaktif & Cek Stok
        </button>
        <button
          @click="activeTab = 'nomenclatures'"
          :class="['pb-3 transition relative', activeTab === 'nomenclatures' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400']"
        >
          Nomenklatur & Aturan Barcode
        </button>
      </div>

      <!-- Tab 1: Interactive Scanner -->
      <div v-if="activeTab === 'scanner'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Input Scanner Box -->
        <div class="lg:col-span-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
              Pindai / Input Barcode
            </h3>
            <span class="text-2xs text-teal-600 dark:text-teal-400 font-mono font-semibold bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded">
              Ready to Scan
            </span>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            Arahkan scanner genggam USB/Bluetooth ke input di bawah, atau ketikkan Barcode SKU produk / kode lokasi / referensi dokumen lalu tekan Enter.
          </p>

          <form @submit.prevent="executeScan" class="space-y-3">
            <div class="relative">
              <input
                ref="barcodeInputRef"
                v-model="barcodeQuery"
                type="text"
                placeholder="Scan atau ketik kode barcode di sini..."
                class="w-full rounded-xl border-2 border-teal-500 bg-teal-50/20 dark:bg-teal-950/10 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
                autofocus
              />
              <button
                type="submit"
                :disabled="isScanning || !barcodeQuery.trim()"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                {{ isScanning ? 'Mencari...' : 'Scan' }}
              </button>
            </div>
          </form>

          <!-- Quick Samples Helper -->
          <div class="pt-3 border-t border-gray-100 dark:border-gray-700">
            <p class="text-2xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contoh Barcode Cepat (Klik untuk Tes):</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="sample in sampleBarcodes"
                :key="sample.code"
                type="button"
                @click="quickScan(sample.code)"
                class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-2xs hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/50 dark:hover:text-teal-300 transition"
              >
                {{ sample.code }} ({{ sample.label }})
              </button>
            </div>
          </div>
        </div>

        <!-- Scan Result Card -->
        <div class="lg:col-span-7 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-5 shadow-xs">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Hasil Pindaian Terakhir</span>
            <span v-if="lastScanResult" class="text-2xs font-mono font-normal text-gray-400">
              Type: {{ lastScanResult.type.toUpperCase() }}
            </span>
          </h3>

          <div v-if="!lastScanResult" class="py-16 text-center text-gray-400 dark:text-gray-500">
            <svg class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
            <p class="text-xs">Belum ada barcode yang dipindai.</p>
            <p class="text-2xs text-gray-400 mt-1">Gunakan scanner fisik atau klik tombol contoh di sebelah kiri.</p>
          </div>

          <div v-else-if="!lastScanResult.found" class="p-6 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-center">
            <span class="inline-flex p-3 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            <h4 class="text-sm font-bold text-rose-800 dark:text-rose-300">Barcode Tidak Dikenal</h4>
            <p class="text-xs text-rose-600 dark:text-rose-400 mt-1 font-mono font-bold">{{ lastScanResult.barcode }}</p>
            <p class="text-2xs text-gray-500 dark:text-gray-400 mt-2">
              Tidak ditemukan data produk, lokasi rak, SPK produksi, atau dokumen QC yang cocok dengan barcode ini.
            </p>
          </div>

          <!-- Found Result Display -->
          <div v-else class="space-y-4">
            <div class="flex items-start justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-lg bg-emerald-500 text-white font-bold">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <span class="inline-block px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    {{ lastScanResult.type }}
                  </span>
                  <h4 class="text-base font-bold text-gray-900 dark:text-white mt-0.5">{{ lastScanResult.title }}</h4>
                  <p class="text-2xs text-emerald-700 dark:text-emerald-400 font-mono">Barcode: {{ lastScanResult.barcode }}</p>
                </div>
              </div>

              <button
                @click="openPrintModal(lastScanResult.data)"
                class="p-2 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                title="Cetak Label Item Ini"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
            </div>

            <!-- Details Table for Scanned Item -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-xs">
              <div class="p-3 bg-gray-50 dark:bg-gray-700/40 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Informasi Rantai Pasok Terkait
              </div>
              <div class="p-4 space-y-3">
                <div v-if="lastScanResult.type === 'product'" class="grid grid-cols-2 gap-3">
                  <div>
                    <span class="text-gray-400 block text-2xs">Kode SKU</span>
                    <span class="font-mono font-bold text-gray-800 dark:text-white">{{ lastScanResult.data?.default_code || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-2xs">Kuantitas Fisik (On Hand)</span>
                    <span class="font-bold text-teal-600 dark:text-teal-400 text-sm">{{ lastScanResult.data?.qty_available || 0 }} Unit</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-2xs">Harga Jual Satuan</span>
                    <span class="font-semibold text-gray-800 dark:text-white">Rp {{ (lastScanResult.data?.list_price || 0).toLocaleString('id-ID') }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-2xs">Standar HPP</span>
                    <span class="font-semibold text-gray-800 dark:text-white">Rp {{ (lastScanResult.data?.standard_price || 0).toLocaleString('id-ID') }}</span>
                  </div>
                </div>

                <div v-else-if="lastScanResult.type === 'location'" class="space-y-2">
                  <p><strong class="text-gray-500">Nama Lokasi:</strong> {{ lastScanResult.data?.name }}</p>
                  <p><strong class="text-gray-500">Kode Lokasi:</strong> <span class="font-mono">{{ lastScanResult.data?.barcode || lastScanResult.data?.code }}</span></p>
                </div>

                <div v-else-if="lastScanResult.type === 'mo'" class="space-y-2">
                  <p><strong class="text-gray-500">Surat Perintah Kerja (MO):</strong> {{ lastScanResult.data?.name }}</p>
                  <p><strong class="text-gray-500">Status:</strong> {{ lastScanResult.data?.state }}</p>
                  <p><strong class="text-gray-500">Jumlah Rencana:</strong> {{ lastScanResult.data?.product_qty }}</p>
                </div>

                <div v-else-if="lastScanResult.type === 'qc'" class="space-y-2">
                  <p><strong class="text-gray-500">Quality Check:</strong> {{ lastScanResult.data?.name }}</p>
                  <p><strong class="text-gray-500">Hasil:</strong> {{ lastScanResult.data?.quality_state }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Nomenclatures Table -->
      <div v-if="activeTab === 'nomenclatures'" class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-xs overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-800 dark:text-white/90 text-sm">Standar Nomenklatur Barcode Sistem</h3>
            <p class="text-2xs text-gray-400">Aturan konversi GS1, EAN-13, dan penataan pola prefix</p>
          </div>
        </div>

        <div class="overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-xs">
            <thead class="bg-gray-50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              <tr>
                <th class="px-4 py-3">Nama Nomenklatur</th>
                <th class="px-4 py-3">Konversi UPC / EAN</th>
                <th class="px-4 py-3">Jumlah Aturan (Rules)</th>
                <th class="px-4 py-3">Dibuat Pada</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              <tr v-for="nom in nomenclatures" :key="nom.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                <td class="px-4 py-3.5 font-medium text-gray-900 dark:text-white">
                  {{ nom.name }}
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded text-2xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {{ nom.upc_ean_conv || 'always' }}
                  </span>
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap">
                  {{ nom.rules?.length || 0 }} Pola Rule
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap text-gray-400">
                  {{ nom.created_at ? formatDate(nom.created_at) : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Cetak Label Barcode -->
    <Teleport to="body">
      <div v-if="isPrintModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Cetak Label Barcode Standar</h3>
              <p class="text-2xs text-gray-400">Thermal / Sticker Label Printer (50x30mm / 40x25mm)</p>
            </div>
            <button @click="isPrintModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
          </div>

          <div class="mt-4 space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Pilih Produk Sasaran</label>
              <select
                v-model="printTargetSku"
                @change="onProductSelectForPrint"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none"
              >
                <option v-for="p in products" :key="p.id" :value="p.default_code">
                  {{ p.name }} ({{ p.default_code }})
                </option>
              </select>
            </div>

            <!-- Preview Label Card (Printable) -->
            <div id="printable-barcode-label" class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white text-gray-900 text-center space-y-2">
              <p class="text-xs font-bold uppercase tracking-wider truncate">{{ previewLabelName }}</p>
              <div class="py-2 bg-gray-50 rounded flex flex-col items-center justify-center">
                <!-- Barcode visual representation using SVG bars -->
                <div class="flex items-center gap-[3px] h-12">
                  <div class="w-1 h-12 bg-black"></div>
                  <div class="w-0.5 h-12 bg-black"></div>
                  <div class="w-1.5 h-12 bg-black"></div>
                  <div class="w-1 h-12 bg-black"></div>
                  <div class="w-2 h-12 bg-black"></div>
                  <div class="w-0.5 h-12 bg-black"></div>
                  <div class="w-1 h-12 bg-black"></div>
                  <div class="w-1.5 h-12 bg-black"></div>
                  <div class="w-0.5 h-12 bg-black"></div>
                  <div class="w-2 h-12 bg-black"></div>
                  <div class="w-1 h-12 bg-black"></div>
                </div>
                <p class="font-mono text-sm font-bold tracking-widest mt-1">{{ previewBarcodeCode }}</p>
              </div>
              <div class="flex justify-between text-2xs text-gray-500 font-mono">
                <span>SKU: {{ printTargetSku }}</span>
                <span>HARGA: Rp {{ (previewPrice).toLocaleString('id-ID') }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              @click="isPrintModalOpen = false"
              class="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Tutup
            </button>
            <button
              type="button"
              @click="printLabel"
              class="rounded-lg bg-teal-600 hover:bg-teal-700 px-5 py-2 text-xs font-semibold text-white shadow-sm"
            >
              Cetak Sekarang (Print)
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { barcodeService } from '@/services/supply-chain/barcode.service'
import { inventoryService } from '@/services/supply-chain/inventory.service'
import type {
  IBarcodeNomenclatureDto,
  IBarcodeScanResponse,
  IBarcodeSummaryDto,
} from '@/types/supply-chain/barcode.dto'
import type { IProductDto } from '@/types/supply-chain/inventory.dto'

const activeTab = ref<'scanner' | 'nomenclatures'>('scanner')
const barcodeInputRef = ref<HTMLInputElement | null>(null)
const barcodeQuery = ref('')
const isScanning = ref(false)
const isLoading = ref(false)

const lastScanResult = ref<IBarcodeScanResponse | null>(null)
const nomenclatures = ref<IBarcodeNomenclatureDto[]>([])
const products = ref<IProductDto[]>([])

const summary = ref<IBarcodeSummaryDto>({
  total_nomenclatures: 1,
  total_rules: 5,
  total_barcoded_skus: 0,
})

const sampleBarcodes = [
  { code: '899123456701', label: 'SKU Baju' },
  { code: '899123456702', label: 'SKU Celana' },
  { code: 'LOC-WH1-A1', label: 'Rak A1' },
  { code: 'SPK-2026-001', label: 'MO Produksi' },
]

// Modal Print
const isPrintModalOpen = ref(false)
const printTargetSku = ref('')
const previewLabelName = ref('')
const previewBarcodeCode = ref('')
const previewPrice = ref(0)

const executeScan = async () => {
  if (!barcodeQuery.value.trim()) return
  isScanning.value = true
  try {
    const res = await barcodeService.scan(barcodeQuery.value.trim())
    lastScanResult.value = res
  } catch (err: any) {
    lastScanResult.value = {
      type: 'unknown',
      found: false,
      barcode: barcodeQuery.value,
      title: 'Tidak Ditemukan',
      data: null,
    }
  } finally {
    isScanning.value = false
    barcodeQuery.value = ''
    barcodeInputRef.value?.focus()
  }
}

const quickScan = (code: string) => {
  barcodeQuery.value = code
  executeScan()
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const [sumRes, nomRes, prodRes] = await Promise.all([
      barcodeService.getSummary(),
      barcodeService.getAll(),
      inventoryService.getAllProducts({ limit: 100 }),
    ])

    summary.value = sumRes
    nomenclatures.value = nomRes || []
    products.value = prodRes.data || []
  } catch (err) {
    console.error('Failed to load barcode data', err)
  } finally {
    isLoading.value = false
  }
}

const openPrintModal = (data: any = null) => {
  if (data && data.default_code) {
    printTargetSku.value = data.default_code
    previewLabelName.value = data.name
    previewBarcodeCode.value = data.barcode || data.default_code
    previewPrice.value = data.list_price || 0
  } else if (products.value.length > 0) {
    const p = products.value[0]
    printTargetSku.value = p.default_code || ''
    previewLabelName.value = p.name
    previewBarcodeCode.value = p.barcode || p.default_code || '8990000001'
    previewPrice.value = p.list_price || 0
  }
  isPrintModalOpen.value = true
}

const onProductSelectForPrint = () => {
  const p = products.value.find((item) => item.default_code === printTargetSku.value)
  if (p) {
    previewLabelName.value = p.name
    previewBarcodeCode.value = p.barcode || p.default_code || '8990000001'
    previewPrice.value = p.list_price || 0
  }
}

const printLabel = () => {
  window.print()
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(() => {
  fetchData()
})
</script>
