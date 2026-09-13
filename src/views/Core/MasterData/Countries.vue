<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Master Data Negara (ISO-3166)" />
        
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="fetchData"
            :disabled="isLoading"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            @click="openModal('create')"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-center text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Negara
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Negara Terdaftar</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{{ countriesList.length }}</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Standar ISO 3166-1 Alpha-2 & Alpha-3</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Negara Domestik Utama</p>
              <h4 class="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">Indonesia (ID)</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-success-50 text-success-500 dark:bg-success-500/10">
              <span class="text-xl">🇮🇩</span>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Pajak Base: PPN 11%, PPh 21/23 TER</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Hub Dagang Internasional</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">6 Negara</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">ASEAN, Amerika Serikat, Jepang, China</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status Kebijakan Valas</p>
              <h4 class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">Multi-Currency</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Terintegrasi otomatis dengan Kurs JISDOR BI</p>
        </div>
      </div>

      <!-- Table & Filter Section -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Region Filter -->
            <select
              v-model="selectedRegion"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="ALL">Semua Kawasan</option>
              <option value="Asia Tenggara">Asia Tenggara (ASEAN)</option>
              <option value="Asia Timur">Asia Timur</option>
              <option value="Amerika">Amerika</option>
              <option value="Eropa">Eropa</option>
              <option value="Timur Tengah">Timur Tengah</option>
            </select>

            <!-- Status Filter -->
            <select
              v-model="selectedStatus"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="ALL">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non-Aktif</option>
            </select>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative w-full sm:w-72">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari negara, kode ISO, valas..."
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Bendera & Negara</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kode ISO</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kode Telepon</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Mata Uang Utama</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kawasan / Region</th>
                <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              <tr v-if="filteredCountries.length === 0">
                <td colspan="7" class="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Tidak ada negara yang sesuai dengan kriteria pencarian.
                </td>
              </tr>
              <tr
                v-for="country in filteredCountries"
                :key="country.id"
                class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{{ country.flag }}</span>
                    <div>
                      <span class="block font-medium text-gray-900 dark:text-white">{{ country.name }}</span>
                      <span v-if="country.is_hq" class="inline-flex items-center gap-1 rounded bg-brand-50 px-1.5 py-0.5 text-2xs font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                        Kantor Pusat Domestik
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {{ country.code }} / {{ country.alpha3 }}
                  </span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap font-mono text-sm text-gray-700 dark:text-gray-300">
                  {{ country.phone_code }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium">
                  {{ country.currency_code }} - {{ country.currency_name }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ country.region }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span
                    :class="country.is_active ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    <span :class="country.is_active ? 'bg-success-500' : 'bg-gray-400'" class="h-1.5 w-1.5 rounded-full"></span>
                    {{ country.is_active ? 'Aktif' : 'Non-Aktif' }}
                  </span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openModal('edit', country)"
                      class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-gray-800"
                      title="Ubah Rincian"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      @click="toggleCountryStatus(country)"
                      class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-warning-500 dark:text-gray-400 dark:hover:bg-gray-800"
                      :title="country.is_active ? 'Non-aktifkan' : 'Aktifkan'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                    <button
                      v-if="!country.is_hq"
                      @click="deleteCountry(country.id)"
                      class="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10"
                      title="Hapus"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between border-t border-gray-200 px-5 py-3.5 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <span>Menampilkan {{ filteredCountries.length }} dari {{ countriesList.length }} negara</span>
          <span>Dukungan Pengiriman Internasional & Valuta Asing Multi-Gudang</span>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tambah / Edit Negara -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="mb-5 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Master Negara Baru' : 'Perbarui Rincian Negara' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveCountry" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 sm:col-span-1">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Negara</label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="Contoh: Indonesia"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="col-span-2 sm:col-span-1">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Emoji Bendera</label>
              <input
                v-model="formData.flag"
                type="text"
                placeholder="🇮🇩 / 🇺🇸"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ISO Alpha-2</label>
              <input
                v-model="formData.code"
                type="text"
                required
                maxlength="2"
                placeholder="ID"
                class="w-full uppercase rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ISO Alpha-3</label>
              <input
                v-model="formData.alpha3"
                type="text"
                maxlength="3"
                placeholder="IDN"
                class="w-full uppercase rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kode Dial</label>
              <input
                v-model="formData.phone_code"
                type="text"
                placeholder="+62"
                class="w-full font-mono rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kode Valas (Mata Uang)</label>
              <input
                v-model="formData.currency_code"
                type="text"
                placeholder="IDR / USD"
                class="w-full uppercase rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kawasan (Region)</label>
              <select
                v-model="formData.region"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Asia Tenggara">Asia Tenggara</option>
                <option value="Asia Timur">Asia Timur</option>
                <option value="Amerika">Amerika</option>
                <option value="Eropa">Eropa</option>
                <option value="Timur Tengah">Timur Tengah</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input
              id="isActiveCheck"
              v-model="formData.is_active"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800"
            />
            <label for="isActiveCheck" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aktifkan untuk transaksi penjualan & pengadaan luar negeri
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {{ isSaving ? 'Menyimpan...' : 'Simpan Data' }}
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
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { API_BASE_URL } from '@/config/api'

interface ICountry {
  id: number
  name: string
  code: string
  alpha3: string
  flag: string
  phone_code: string
  currency_code: string
  currency_name: string
  region: string
  is_active: boolean
  is_hq?: boolean
}

const defaultCountries: ICountry[] = [
  { id: 1, name: 'Indonesia', code: 'ID', alpha3: 'IDN', flag: '🇮🇩', phone_code: '+62', currency_code: 'IDR', currency_name: 'Indonesian Rupiah', region: 'Asia Tenggara', is_active: true, is_hq: true },
  { id: 2, name: 'Singapura', code: 'SG', alpha3: 'SGP', flag: '🇸🇬', phone_code: '+65', currency_code: 'SGD', currency_name: 'Singapore Dollar', region: 'Asia Tenggara', is_active: true },
  { id: 3, name: 'Malaysia', code: 'MY', alpha3: 'MYS', flag: '🇲🇾', phone_code: '+60', currency_code: 'MYR', currency_name: 'Malaysian Ringgit', region: 'Asia Tenggara', is_active: true },
  { id: 4, name: 'Thailand', code: 'TH', alpha3: 'THA', flag: '🇹🇭', phone_code: '+66', currency_code: 'THB', currency_name: 'Thai Baht', region: 'Asia Tenggara', is_active: true },
  { id: 5, name: 'Vietnam', code: 'VN', alpha3: 'VNM', flag: '🇻🇳', phone_code: '+84', currency_code: 'VND', currency_name: 'Vietnamese Dong', region: 'Asia Tenggara', is_active: true },
  { id: 6, name: 'Amerika Serikat', code: 'US', alpha3: 'USA', flag: '🇺🇸', phone_code: '+1', currency_code: 'USD', currency_name: 'US Dollar', region: 'Amerika', is_active: true },
  { id: 7, name: 'Jepang', code: 'JP', alpha3: 'JPN', flag: '🇯🇵', phone_code: '+81', currency_code: 'JPY', currency_name: 'Japanese Yen', region: 'Asia Timur', is_active: true },
  { id: 8, name: 'Tiongkok', code: 'CN', alpha3: 'CHN', flag: '🇨🇳', phone_code: '+86', currency_code: 'CNY', currency_name: 'Chinese Yuan', region: 'Asia Timur', is_active: true },
  { id: 9, name: 'Australia', code: 'AU', alpha3: 'AUS', flag: '🇦🇺', phone_code: '+61', currency_code: 'AUD', currency_name: 'Australian Dollar', region: 'Asia Pasifik', is_active: true },
  { id: 10, name: 'Jerman (Uni Eropa)', code: 'DE', alpha3: 'DEU', flag: '🇩🇪', phone_code: '+49', currency_code: 'EUR', currency_name: 'Euro', region: 'Eropa', is_active: true },
  { id: 11, name: 'Uni Emirat Arab', code: 'AE', alpha3: 'ARE', flag: '🇦🇪', phone_code: '+971', currency_code: 'AED', currency_name: 'UAE Dirham', region: 'Timur Tengah', is_active: true }
]

const countriesList = ref<ICountry[]>([...defaultCountries])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedRegion = ref('ALL')
const selectedStatus = ref('ALL')

// Modal state
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const formData = ref<Partial<ICountry>>({
  name: '',
  code: '',
  alpha3: '',
  flag: '🌐',
  phone_code: '+',
  currency_code: 'USD',
  region: 'Asia Tenggara',
  is_active: true
})

const filteredCountries = computed(() => {
  return countriesList.value.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.currency_code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.phone_code.includes(searchQuery.value)
    const matchesRegion = selectedRegion.value === 'ALL' || item.region === selectedRegion.value
    const matchesStatus =
      selectedStatus.value === 'ALL' ||
      (selectedStatus.value === 'active' && item.is_active) ||
      (selectedStatus.value === 'inactive' && !item.is_active)

    return matchesSearch && matchesRegion && matchesStatus
  })
})

const fetchData = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE_URL}/base/country`, {
      headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      const data = await res.json()
      const serverItems = Array.isArray(data) ? data : data.data || []
      if (serverItems.length > 0) {
        // Merge with our rich presets
        serverItems.forEach((sItem: any) => {
          const idx = countriesList.value.findIndex(c => c.code.toLowerCase() === (sItem.code || '').toLowerCase())
          if (idx >= 0) {
            countriesList.value[idx] = { ...countriesList.value[idx], ...sItem }
          } else {
            countriesList.value.push({
              id: sItem.id || Date.now(),
              name: sItem.name,
              code: sItem.code || 'XX',
              alpha3: sItem.alpha3 || sItem.code || 'XXX',
              flag: '🌐',
              phone_code: sItem.phone_code || '+00',
              currency_code: sItem.currency_code || 'IDR',
              currency_name: sItem.currency_name || 'Currency',
              region: sItem.region || 'Lainnya',
              is_active: true
            })
          }
        })
      }
    }
  } catch (e) {
    console.warn('Using default preloaded country records:', e)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data?: ICountry) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data }
  } else {
    formData.value = {
      name: '',
      code: '',
      alpha3: '',
      flag: '🌐',
      phone_code: '+',
      currency_code: 'USD',
      region: 'Asia Tenggara',
      is_active: true
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCountry = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      const idx = countriesList.value.findIndex(c => c.id === formData.value.id)
      if (idx !== -1) {
        countriesList.value[idx] = { ...(formData.value as ICountry) }
      }
    } else {
      const newCountry: ICountry = {
        ...(formData.value as ICountry),
        id: Date.now(),
        is_active: formData.value.is_active ?? true,
        currency_name: formData.value.currency_name || `${formData.value.currency_code} Standard`
      }
      countriesList.value.unshift(newCountry)
    }
    closeModal()
  } finally {
    isSaving.value = false
  }
}

const toggleCountryStatus = (country: ICountry) => {
  if (country.is_hq) {
    alert('Negara Domestik Kantor Pusat tidak dapat dinon-aktifkan!')
    return
  }
  country.is_active = !country.is_active
}

const deleteCountry = (id: number) => {
  if (confirm('Hapus master data negara ini?')) {
    countriesList.value = countriesList.value.filter(c => c.id !== id)
  }
}

onMounted(() => {
  fetchData()
})
</script>

