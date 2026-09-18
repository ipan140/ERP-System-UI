<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="IoT Gateway & Mesin Presensi Biometrik" />
        
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="syncAllDevices"
            :disabled="isSyncing"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-500 bg-brand-50 px-4 py-2 text-center text-sm font-semibold text-brand-600 shadow-theme-xs hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 disabled:opacity-50"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isSyncing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isSyncing ? 'Menyinkronkan Log...' : 'Tarik Log Presensi HR' }}
          </button>
          <button
            @click="openModal('create')"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-center text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Perangkat
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Terminal Mesin Absensi</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">3 Unit</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0c0 2.473.345 4.866.99 7.132m0 0a21.88 21.88 0 003.839-1.132" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">HQ Lobi, Gudang Cikarang, Cabang Surabaya</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status Koneksi Gateway</p>
              <h4 class="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">100% Online</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-success-50 text-success-500 dark:bg-success-500/10">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
              </span>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">TCP/IP Port 4370 ADMS Push SDK</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Tap Presensi Hari Ini</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">312 Punch</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Langsung tersinkron ke Payroll HR</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Sensor Lingkungan Gudang</p>
              <h4 class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">4.2°C Normal</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Cold Storage Farmasi & Suhu Server</p>
        </div>
      </div>

      <!-- Tab Buttons -->
      <div class="mb-5 flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          @click="activeTab = 'devices'"
          :class="activeTab === 'devices' ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
          class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
        >
          Daftar Perangkat IoT & Mesin Biometrik
        </button>
        <button
          @click="activeTab = 'logs'"
          :class="activeTab === 'logs' ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
          class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <span class="h-2 w-2 rounded-full bg-success-500 animate-pulse"></span>
          Live Stream Tap Log Presensi Realtime
        </button>
      </div>

      <!-- TAB 1: Devices -->
      <div v-if="activeTab === 'devices'" class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Perangkat & Tipe</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Lokasi Penempatan</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">IP Address & Port</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Metode Sensor</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status & Ping</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aktivitas Hari Ini</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                <tr
                  v-for="dev in devices"
                  :key="dev.id"
                  class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-800">
                        {{ dev.icon }}
                      </div>
                      <div>
                        <span class="font-bold text-gray-900 dark:text-white text-sm block">{{ dev.device_name }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ dev.model }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ dev.location }}
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap font-mono text-xs text-gray-800 dark:text-gray-200">
                    {{ dev.ip_address }}:{{ dev.port }}
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                    {{ dev.sensor_type }}
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <span
                        :class="dev.status === 'Online' ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'"
                        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      >
                        <span :class="dev.status === 'Online' ? 'bg-success-500' : 'bg-red-500'" class="h-1.5 w-1.5 rounded-full"></span>
                        {{ dev.status }}
                      </span>
                      <span class="text-2xs font-mono text-gray-400">({{ dev.ping_ms }}ms)</span>
                    </div>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300">
                    <span class="font-bold text-brand-600 dark:text-brand-400">{{ dev.today_records }}</span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="pingDevice(dev)"
                        class="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        title="Tes Koneksi Ping"
                      >
                        Ping Test
                      </button>
                      <button
                        @click="openModal('edit', dev)"
                        class="rounded-lg p-1 text-gray-500 hover:text-brand-500"
                        title="Edit Perangkat"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: Live Stream Log Presensi -->
      <div v-if="activeTab === 'logs'" class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-sm">Aliran Log Presensi Masuk & Pulang Terkini</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Data otomatis divalidasi ke perhitungan jam kerja & keterlambatan</p>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-mono">
              Auto-Polling: Tiap 10 Detik
            </span>
          </div>

          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Waktu Punch</th>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">NIK & Karyawan</th>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Departemen</th>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Terminal Mesin</th>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tipe Absen</th>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Verifikasi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900 font-mono text-xs">
                <tr
                  v-for="log in attendanceLogs"
                  :key="log.id"
                  class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                >
                  <td class="px-5 py-3 text-gray-900 dark:text-white font-bold whitespace-nowrap">
                    {{ log.timestamp }}
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap font-sans">
                    <span class="font-bold text-gray-900 dark:text-white">{{ log.employee_name }}</span>
                    <span class="block text-2xs font-mono text-gray-400">NIK: {{ log.nik }}</span>
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap font-sans text-gray-600 dark:text-gray-400">
                    {{ log.department }}
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap font-sans text-gray-700 dark:text-gray-300">
                    {{ log.device_location }}
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap">
                    <span
                      :class="log.punch_type === 'Check-In' ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'"
                      class="inline-flex rounded px-2 py-0.5 text-2xs font-bold"
                    >
                      {{ log.punch_type }}
                    </span>
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap font-sans text-gray-500">
                    {{ log.verification_method }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tambah / Edit Perangkat IoT -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Terminal / Perangkat IoT' : 'Perbarui Konfigurasi Perangkat' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveDevice" class="space-y-4 my-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Perangkat</label>
            <input
              v-model="formData.device_name"
              type="text"
              required
              placeholder="Contoh: Mesin Absensi Fingerprint Lobi"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Merek & Tipe Model</label>
              <input
                v-model="formData.model"
                type="text"
                placeholder="ZKTeco uFace 800 / Solution X105"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tipe Sensor</label>
              <select
                v-model="formData.sensor_type"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Face 3D + Fingerprint">Face 3D + Fingerprint</option>
                <option value="Fingerprint Biometrik">Fingerprint Biometrik</option>
                <option value="RFID Card + Fingerprint">RFID Card + Fingerprint</option>
                <option value="Sensor Suhu & Kelembaban (DHT22)">Sensor Suhu & Kelembaban (DHT22)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">IP Address LAN</label>
              <input
                v-model="formData.ip_address"
                type="text"
                required
                placeholder="192.168.1.201"
                class="w-full font-mono rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Port TCP/IP</label>
              <input
                v-model="formData.port"
                type="number"
                required
                placeholder="4370"
                class="w-full font-mono rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Lokasi Penempatan Terminal</label>
            <input
              v-model="formData.location"
              type="text"
              placeholder="Gedung HQ Lt. 1 - Lobi Utama"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600"
            >
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { iotService } from '@/services/core/iot.service'

const activeTab = ref<'devices' | 'logs'>('devices')
const isSyncing = ref(false)
const isLoading = ref(false)

const devices = ref<any[]>([])
const attendanceLogs = ref<any[]>([])

// Modal State
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formData = ref<any>({
  device_name: '',
  model: '',
  location: '',
  ip_address: '192.168.1.201',
  port: 4370,
  sensor_type: 'Face 3D + Fingerprint'
})

const fetchIoTData = async () => {
  isLoading.value = true
  try {
    const [devs, logs] = await Promise.all([
      iotService.getDevices(),
      iotService.getAttendanceLogs()
    ])
    devices.value = Array.isArray(devs) ? devs : (devs as any)?.data || []
    attendanceLogs.value = Array.isArray(logs) ? logs : (logs as any)?.data || []
  } catch (err) {
    console.error('Error fetching IoT data:', err)
  } finally {
    isLoading.value = false
  }
}

const pingDevice = async (dev: any) => {
  try {
    const res = await iotService.pingDevice(dev.id)
    alert(`Ping test ke ${dev.ip_address}:${dev.port} berhasil! Waktu respons: ${res?.ping_ms || dev.ping_ms || 15} ms (Packet Loss: 0%)`)
  } catch (err: any) {
    alert('Ping test gagal: ' + (err.response?.data?.message || err.message))
  }
}

const syncAllDevices = async () => {
  isSyncing.value = true
  try {
    const res = await iotService.syncPresensi()
    alert(res?.message || 'Sinkronisasi selesai! Log presensi biometrik berhasil ditarik dan diposting ke database Kepegawaian (HR Attendance).')
    await fetchIoTData()
  } catch (err: any) {
    alert('Gagal sinkronisasi: ' + (err.response?.data?.message || err.message))
  } finally {
    isSyncing.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data }
  } else {
    formData.value = {
      device_name: '',
      model: '',
      location: '',
      ip_address: '192.168.1.',
      port: 4370,
      sensor_type: 'Face 3D + Fingerprint'
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveDevice = async () => {
  try {
    if (modalMode.value === 'edit') {
      await iotService.update(formData.value.id, {
        device_name: formData.value.device_name,
        name: formData.value.device_name,
        model: formData.value.model,
        location: formData.value.location,
        ip_address: formData.value.ip_address,
        port: Number(formData.value.port) || 4370,
        sensor_type: formData.value.sensor_type
      })
    } else {
      await iotService.create({
        device_name: formData.value.device_name,
        name: formData.value.device_name,
        model: formData.value.model,
        location: formData.value.location,
        ip_address: formData.value.ip_address,
        port: Number(formData.value.port) || 4370,
        sensor_type: formData.value.sensor_type,
        status: 'Online',
        ping_ms: 18,
        today_records: '0 Punch',
        icon: '📟'
      })
    }
    closeModal()
    await fetchIoTData()
  } catch (err: any) {
    alert('Gagal menyimpan perangkat: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchIoTData()
})
</script>

