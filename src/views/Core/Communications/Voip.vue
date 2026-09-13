<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Top Title -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            VoIP & IP-PBX Telephony System
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manajemen ekstensi telepon kantor internal, SIP Server trunk, dan integrasi panggilan pelanggan.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="isDialerOpen = true"
            class="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Buka Softphone Dialer
          </button>
        </div>
      </div>

      <!-- PBX Server Info Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500">SIP Trunk Server</span>
          <h4 class="text-lg font-bold text-gray-900 dark:text-white mt-1">sip.company.local</h4>
          <p class="text-xs text-emerald-600 font-semibold mt-1">✓ REGISTERED (Port 5060 UDP/TLS)</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500">Ekstensi Aktif</span>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ extensions.length }} Unit</h4>
          <p class="text-xs text-teal-600 mt-1">Multi-Line SIP Phone</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500">Protokol Audio WebRTC</span>
          <h4 class="text-lg font-bold text-gray-900 dark:text-white mt-1">Opus & G.711a</h4>
          <p class="text-xs text-emerald-600 font-semibold mt-1">HD Voice Encryption</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500">Perekam Panggilan Otomatis</span>
          <h4 class="text-lg font-bold text-gray-900 dark:text-white mt-1">Aktif (100%)</h4>
          <p class="text-xs text-gray-400 mt-1">Disimpan di Storage DMS</p>
        </div>
      </div>

      <!-- Extension Directory Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 mb-6">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white">Daftar Ekstensi Internal Kantor</h3>
          <span class="text-xs text-gray-400">100–1000 Pegawai Ready</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400 font-semibold">
              <tr>
                <th class="px-5 py-3">Ekstensi</th>
                <th class="px-5 py-3">Departemen / Pengguna</th>
                <th class="px-5 py-3">Tipe Perangkat</th>
                <th class="px-5 py-3">IP Address Perangkat</th>
                <th class="px-5 py-3">Status Saluran</th>
                <th class="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="ext in extensions" :key="ext.ext" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-5 py-3.5 font-mono text-base font-bold text-teal-600 dark:text-teal-400">{{ ext.ext }}</td>
                <td class="px-5 py-3.5">
                  <div class="font-medium text-gray-900 dark:text-white text-xs">{{ ext.user }}</div>
                  <div class="text-[11px] text-gray-400">{{ ext.dept }}</div>
                </td>
                <td class="px-5 py-3.5 text-gray-600 dark:text-gray-300">{{ ext.device }}</td>
                <td class="px-5 py-3.5 font-mono text-gray-500">{{ ext.ip }}</td>
                <td class="px-5 py-3.5">
                  <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold" :class="ext.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'">
                    {{ ext.status }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right whitespace-nowrap">
                  <button
                    @click="callExtension(ext.ext)"
                    class="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300"
                  >
                    Hubungi 📞
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Softphone Dialer Modal -->
    <Teleport to="body">
      <div v-if="isDialerOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">WebRTC Dialer</h3>
            <button @click="isDialerOpen = false" class="text-gray-400 hover:text-gray-600">&times;</button>
          </div>

          <div class="mb-4 rounded-xl bg-gray-100 p-3 dark:bg-gray-800">
            <p class="text-xs text-gray-400">Nomor Tujuan</p>
            <h2 class="text-2xl font-mono font-bold text-gray-900 dark:text-white mt-1">{{ dialNumber || '...' }}</h2>
            <p class="text-[11px] text-teal-600 font-medium mt-1">{{ callStatus }}</p>
          </div>

          <!-- Keypad -->
          <div class="grid grid-cols-3 gap-2 mb-4">
            <button v-for="n in ['1','2','3','4','5','6','7','8','9','*','0','#']" :key="n" @click="dialNumber += n" class="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 font-bold text-base text-gray-800 dark:text-gray-200">
              {{ n }}
            </button>
          </div>

          <div class="flex gap-2">
            <button @click="dialNumber = ''" class="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
              Hapus
            </button>
            <button @click="startCall" class="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-700">
              Panggil
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

const isDialerOpen = ref(false)
const dialNumber = ref('')
const callStatus = ref('Siap Melakukan Panggilan')

const extensions = ref([
  { ext: '101', user: 'Siti Aminah', dept: 'Human Resources & General Affairs', device: 'Yealink T46U SIP', ip: '192.168.10.101', status: 'AVAILABLE' },
  { ext: '102', user: 'Budi Santoso', dept: 'Finance & Accounting', device: 'Grandstream GXP2170', ip: '192.168.10.102', status: 'AVAILABLE' },
  { ext: '103', user: 'Joko Prabowo', dept: 'Supply Chain & Warehouse Cikarang', device: 'Fanvil X4U Industrial', ip: '192.168.20.103', status: 'ON CALL' },
  { ext: '104', user: 'Rina Kusuma', dept: 'Sales & Marketing Enterprise', device: 'WebRTC Softphone Desktop', ip: '192.168.10.104', status: 'AVAILABLE' },
  { ext: '201', user: 'Helpdesk Support Tier-1', dept: 'Customer Service & IT Support', device: 'Call Center Queue SIP', ip: '192.168.10.201', status: 'AVAILABLE' },
])

const callExtension = (ext: string) => {
  dialNumber.value = ext
  isDialerOpen.value = true
}

const startCall = () => {
  if (!dialNumber.value) return
  callStatus.value = `Menghubungi Ekstensi ${dialNumber.value}...`
  setTimeout(() => {
    callStatus.value = `Tersambung (00:03) - Audio HD Clear`
  }, 1500)
}
</script>
