<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- HEADER -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Kepatuhan Pajak Lokal Indonesia (Tax Localization)</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pengelolaan SPT Masa PPN, PPh 21 TER, PPh 23, PPh Final 4(2) & Ekspor Skema e-Bupot Unifikasi DJP
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <!-- Tombol Pengaturan Master Regulasi Pajak -->
          <button @click="openConfigModal" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>Master Tarif Pajak</span>
          </button>

          <button @click="openModal" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <span>Catat Pemotongan Pajak</span>
          </button>
          
          <a href="/api/finance/tax/export-ebupot" target="_blank" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Unduh CSV e-Bupot DJP</span>
          </a>
        </div>
      </div>

      <!-- METRIKS PAJAK -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Kewajiban Pajak Masa</p>
          <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{{ formatCurrency(totalTax) }}</h3>
          <p class="text-xs text-gray-400 mt-1">Masa Pajak Maret 2026</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Master Regulasi Terdaftar</p>
          <h3 class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{{ taxConfigs.length }} <span class="text-sm font-normal text-gray-400">Skema Tarif</span></h3>
          <p class="text-xs text-blue-500 mt-1">PPN, PPh 23, PPh 21 TER, PPh 4(2)</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kantor Pelayanan Pajak (KPP)</p>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-2 truncate">KPP Pratama Jaksel</h3>
          <p class="text-xs text-emerald-500 mt-1">Status NPWP Perusahaan: VALID</p>
        </div>
      </div>

      <!-- TABEL REKAPITULASI TRANSAKSI BUKTI POTONG -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm">
        <div class="p-4 border-b border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Pemotongan Pajak Masa Berjalan</h3>
            <span class="text-xs text-gray-400">Total {{ pagination.total_items || taxes.length }} Bukti Potong</span>
          </div>
          <div class="relative w-full sm:w-64">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari lawan transaksi / NPWP..." 
              class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2 pl-10 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
            />
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full text-left text-xs">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold uppercase">
                <th class="px-5 py-3.5">Jenis Pajak & Masa</th>
                <th class="px-5 py-3.5">Nama Wajib Pajak / Lawan Transaksi</th>
                <th class="px-5 py-3.5">NPWP Terdaftar</th>
                <th class="px-5 py-3.5 text-right">DPP (Dasar Pengenaan)</th>
                <th class="px-5 py-3.5 text-center">Tarif</th>
                <th class="px-5 py-3.5 text-right">Pajak Terutang</th>
                <th class="px-5 py-3.5 text-center">Status</th>
                <th class="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700 font-mono">
              <tr v-for="t in taxes" :key="t.id" class="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td class="px-5 py-4 font-sans">
                  <div class="font-bold text-gray-900 dark:text-white text-xs">{{ t.tax_type }}</div>
                  <span class="text-[11px] text-gray-400">{{ t.tax_period }}</span>
                </td>
                <td class="px-5 py-4 font-sans font-medium text-gray-800 dark:text-gray-200">
                  {{ t.partner_name }}
                </td>
                <td class="px-5 py-4 text-gray-500 dark:text-gray-400">
                  {{ t.npwp }}
                </td>
                <td class="px-5 py-4 text-right text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(t.tax_base) }}
                </td>
                <td class="px-5 py-4 text-center text-blue-600 dark:text-blue-400 font-bold">
                  {{ t.tax_rate }}%
                </td>
                <td class="px-5 py-4 text-right font-bold text-rose-600 dark:text-rose-400">
                  {{ formatCurrency(t.tax_amount) }}
                </td>
                <td class="px-5 py-4 text-center font-sans">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {{ t.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right whitespace-nowrap font-sans">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      @click="openEditModal(t)" 
                      class="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" 
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button 
                      @click="deleteRecord(t.id)" 
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
        <!-- Server-side Pagination Bar -->
        <PaginationBar :pagination="pagination" @change="onPaginationChange" />
      </div>

      <!-- MODAL INPUT / EDIT BUKTI POTONG PAJAK -->
      <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editId ? 'Edit Bukti Potong Pajak' : 'Catat Pemotongan Pajak Baru' }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Tarif otomatis dihitung sesuai PMK & UU Perpajakan RI</p>
              </div>
              <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form @submit.prevent="saveTax" class="space-y-4 mt-4">
              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Pilih Jenis Pajak</label>
                <select 
                  v-model="formData.tax_type" 
                  @change="handleTaxTypeChange"
                  required 
                  class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-medium"
                >
                  <option v-for="cfg in taxConfigs" :key="cfg.id" :value="cfg.tax_name">
                    {{ cfg.tax_name }} (Tarif: {{ cfg.rate }}%)
                  </option>
                </select>
                <!-- Keterangan Regulasi Pajak -->
                <p class="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-sans">
                  ℹ️ {{ currentTaxRegulation?.description || currentTaxRegulation?.legal_basis }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">Nama Lawan Transaksi / Wajib Pajak</label>
                <input v-model="formData.partner_name" type="text" placeholder="PT Konsultan Mitra Pratama" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300">NPWP Terdaftar</label>
                  <label class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                    <input type="checkbox" v-model="hasNoNPWP" @change="handleNPWPToggle" class="rounded text-brand-500" />
                    <span>Tidak Ada NPWP (+100% PPh 23)</span>
                  </label>
                </div>
                <input v-model="formData.npwp" :disabled="hasNoNPWP" type="text" placeholder="01.234.567.8-012.000" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono disabled:opacity-50" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">DPP (Nilai Transaksi)</label>
                  <input v-model.number="formData.tax_base" type="number" placeholder="10000000" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm dark:border-gray-600 dark:text-white outline-none focus:border-brand-500 font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300 mb-1">
                    Tarif Terkunci (%)
                  </label>
                  <input v-model.number="formData.tax_rate" type="number" step="0.1" readonly class="w-full rounded-lg border border-gray-200 bg-gray-100 dark:bg-gray-900/60 px-4 py-2.5 text-sm dark:border-gray-700 dark:text-blue-400 font-mono font-bold cursor-not-allowed" />
                </div>
              </div>

              <!-- Estimasi Pajak Terutang Otomatis -->
              <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs flex justify-between items-center">
                <span class="text-blue-700 dark:text-blue-300 font-medium">Potongan Pajak Terutang:</span>
                <span class="font-mono font-bold text-sm text-rose-600 dark:text-rose-400">
                  {{ formatCurrency((formData.tax_base * formData.tax_rate) / 100) }}
                </span>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Batal</button>
                <button type="submit" :disabled="isSaving" class="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50">
                  {{ isSaving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Bukti Potong') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- MODAL PENGATURAN MASTER REGULASI PAJAK (ADMIN CRUD MASTER PAJAK) -->
      <Teleport to="body">
        <div v-if="isConfigModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Master Konfigurasi Tarif Pajak (Admin)</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Tambah / Ubah Persentase Tarif Pajak jika ada perubahan UU/PMK baru (misal PPN 12%)</p>
              </div>
              <button @click="isConfigModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Form Tambah / Edit Master Pajak -->
            <form @submit.prevent="saveTaxConfig" class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-900/80 rounded-xl mt-4 border border-gray-200 dark:border-gray-700/80 shadow-inner">
              <div>
                <label class="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Kode Pajak</label>
                <input v-model="configForm.tax_code" type="text" placeholder="PPN12" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none uppercase font-mono focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Nama Skema Pajak</label>
                <input v-model="configForm.tax_name" type="text" placeholder="PPN Standar 12%" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Tarif Standar (%)</label>
                <div class="flex gap-2">
                  <input v-model.number="configForm.rate" type="number" step="0.1" placeholder="12" required class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-xs dark:border-gray-600 dark:text-white outline-none font-mono focus:border-brand-500" />
                  <button type="submit" class="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shadow-sm">
                    {{ configEditId ? 'Simpan' : '+ Tambah' }}
                  </button>
                </div>
              </div>
            </form>

            <!-- Tabel Master Pajak Terdaftar -->
            <div class="mt-4 flex-1 overflow-y-auto custom-scrollbar border rounded-xl border-gray-200 dark:border-gray-700">
              <table class="min-w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold uppercase">
                    <th class="px-4 py-2.5">Kode & Nama</th>
                    <th class="px-4 py-2.5 text-center">Tarif</th>
                    <th class="px-4 py-2.5">Dasar Hukum</th>
                    <th class="px-4 py-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr v-for="cfg in taxConfigs" :key="cfg.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                    <td class="px-4 py-3">
                      <span class="font-bold text-gray-900 dark:text-white block">{{ cfg.tax_name }}</span>
                      <span class="font-mono text-[11px] text-brand-600 dark:text-brand-400">{{ cfg.tax_code }}</span>
                    </td>
                    <td class="px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {{ cfg.rate }}%
                    </td>
                    <td class="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {{ cfg.legal_basis || '-' }}
                    </td>
                    <td class="px-4 py-3 text-right whitespace-nowrap">
                      <button @click="editTaxConfig(cfg)" class="p-1 text-gray-400 hover:text-amber-500 mr-1" title="Edit Tarif">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button @click="deleteTaxConfig(cfg.id)" class="p-1 text-gray-400 hover:text-rose-500" title="Hapus Skema">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button @click="isConfigModalOpen = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { http } from '@/services/http'
import type { ITaxMasterConfigDto, ITaxReportSummaryDto } from '@/types/finance'
import type { IPaginationMeta } from '@/types'

const taxes = ref<ITaxReportSummaryDto[]>([])
const taxConfigs = ref<ITaxMasterConfigDto[]>([])
const totalTax = ref(0)
const isModalOpen = ref(false)
const isSaving = ref(false)
const editId = ref<number | null>(null)
const hasNoNPWP = ref(false)

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
  fetchTaxes()
}

let searchTimer: any = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchTaxes()
  }, 300)
})

// State Modal Master Config
const isConfigModalOpen = ref(false)
const configEditId = ref<number | null>(null)
const configForm = ref({
  tax_code: '',
  tax_name: '',
  rate: 11.0,
  legal_basis: 'UU Perpajakan',
  description: ''
})

const formData = ref({
  tax_period: 'Maret 2026',
  tax_type: '',
  partner_name: '',
  npwp: '01.234.567.8-012.000',
  tax_base: 10000000,
  tax_rate: 2.0
})

const currentTaxRegulation = computed(() => {
  return taxConfigs.value.find(r => r.tax_name === formData.value.tax_type) || taxConfigs.value[0]
})

onMounted(async () => {
  await fetchTaxConfigs()
  await fetchTaxes()
})

const fetchTaxConfigs = async () => {
  try {
    const res = await http.get('/finance/tax/configs')
    taxConfigs.value = res.data?.data || []
    if (taxConfigs.value.length > 0 && !formData.value.tax_type) {
      formData.value.tax_type = taxConfigs.value[0].tax_name
      formData.value.tax_rate = taxConfigs.value[0].rate
    }
  } catch (err) {
    console.error(err)
  }
}

const fetchTaxes = async () => {
  try {
    const params: Record<string, any> = {
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()

    const res = await http.get('/finance/tax', { params })
    taxes.value = res.data?.data?.items || []
    totalTax.value = res.data?.data?.total_tax_amount || 0
    if (res.data?.pagination) {
      pagination.value = res.data.pagination
    }
  } catch (err) {
    console.error(err)
  }
}

// Otomatis ubah tarif saat Jenis Pajak dipilih dari master config
const handleTaxTypeChange = () => {
  const reg = currentTaxRegulation.value
  if (reg) {
    let rate = reg.rate
    // Bila tidak punya NPWP pada PPh 23, dikenakan tarif 100% lebih tinggi (2x lipat)
    if (hasNoNPWP.value && reg.tax_name.includes('PPh 23')) {
      rate = rate * 2
    }
    formData.value.tax_rate = rate
  }
}

const handleNPWPToggle = () => {
  if (hasNoNPWP.value) {
    formData.value.npwp = '00.000.000.0-000.000 (Non-NPWP)'
  } else {
    formData.value.npwp = '01.234.567.8-012.000'
  }
  handleTaxTypeChange()
}

const openModal = () => {
  editId.value = null
  hasNoNPWP.value = false
  const defaultCfg = taxConfigs.value[0]
  formData.value = {
    tax_period: 'Maret 2026',
    tax_type: defaultCfg ? defaultCfg.tax_name : 'PPh 23 (Jasa / Konsultan / Manajemen)',
    partner_name: '',
    npwp: '01.234.567.8-012.000',
    tax_base: 10000000,
    tax_rate: defaultCfg ? defaultCfg.rate : 2.0
  }
  isModalOpen.value = true
}

const openEditModal = (item: any) => {
  editId.value = item.id
  hasNoNPWP.value = item.npwp && item.npwp.includes('00.000.000.0')
  formData.value = {
    tax_period: item.tax_period,
    tax_type: item.tax_type,
    partner_name: item.partner_name,
    npwp: item.npwp,
    tax_base: item.tax_base,
    tax_rate: item.tax_rate
  }
  isModalOpen.value = true
}

const saveTax = async () => {
  isSaving.value = true
  try {
    if (editId.value) {
      await http.put(`/finance/tax/${editId.value}`, formData.value)
    } else {
      await http.post('/finance/tax', formData.value)
    }
    isModalOpen.value = false
    await fetchTaxes()
  } catch (err: any) {
    alert('Gagal menyimpan: ' + err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id: number) => {
  if (!confirm('Hapus pencatatan pajak ini?')) return
  try {
    await http.delete(`/finance/tax/${id}`)
    await fetchTaxes()
  } catch (err: any) {
    alert('Gagal menghapus: ' + err.message)
  }
}

// Master Config Methods
const openConfigModal = () => {
  configEditId.value = null
  configForm.value = {
    tax_code: '',
    tax_name: '',
    rate: 11.0,
    legal_basis: 'UU Perpajakan',
    description: ''
  }
  isConfigModalOpen.value = true
}

const editTaxConfig = (cfg: any) => {
  configEditId.value = cfg.id
  configForm.value = {
    tax_code: cfg.tax_code,
    tax_name: cfg.tax_name,
    rate: cfg.rate,
    legal_basis: cfg.legal_basis,
    description: cfg.description
  }
}

const saveTaxConfig = async () => {
  try {
    if (configEditId.value) {
      await http.put(`/finance/tax/configs/${configEditId.value}`, configForm.value)
    } else {
      await http.post('/finance/tax/configs', configForm.value)
    }
    configEditId.value = null
    configForm.value = { tax_code: '', tax_name: '', rate: 11.0, legal_basis: 'UU Perpajakan', description: '' }
    await fetchTaxConfigs()
  } catch (err: any) {
    alert('Gagal menyimpan konfigurasi master: ' + err.message)
  }
}

const deleteTaxConfig = async (id: number) => {
  if (!confirm('Hapus skema tarif pajak master ini?')) return
  try {
    await http.delete(`/finance/tax/configs/${id}`)
    await fetchTaxConfigs()
  } catch (err: any) {
    alert('Gagal: ' + err.message)
  }
}

const formatCurrency = (v: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}
</script>
