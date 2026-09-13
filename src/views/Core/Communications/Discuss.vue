<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 h-[calc(100vh-100px)] flex flex-col">
      <!-- Top Title -->
      <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            Enterprise Discuss (Saluran Komunikasi Internal)
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Kolaborasi pesan instan terpusat antar departemen (100–1000 Karyawan) berstandar Odoo Discuss.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            WebSocket Online
          </span>
        </div>
      </div>

      <!-- Main Chat Layout: Left Channels + Right Message Stream -->
      <div class="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 flex">
        <!-- Sidebar Channels -->
        <div class="w-64 sm:w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
          <div class="p-4 border-b border-gray-200 dark:border-gray-800">
            <input
              v-model="channelSearch"
              type="text"
              placeholder="Cari saluran / karyawan..."
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
            <!-- Public Channels -->
            <div>
              <p class="text-[11px] font-bold uppercase text-gray-400 px-2 mb-1.5">Saluran Publik (#)</p>
              <div class="space-y-1">
                <button
                  v-for="ch in publicChannels"
                  :key="ch.id"
                  @click="activeChannel = ch"
                  class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left"
                  :class="activeChannel.id === ch.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
                >
                  <span class="truncate font-semibold"># {{ ch.name }}</span>
                  <span v-if="ch.unread" class="h-5 w-5 rounded-full bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold">
                    {{ ch.unread }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Direct Messages -->
            <div>
              <p class="text-[11px] font-bold uppercase text-gray-400 px-2 mb-1.5">Pesan Langsung (@)</p>
              <div class="space-y-1">
                <button
                  v-for="dm in directMessages"
                  :key="dm.id"
                  @click="activeChannel = dm"
                  class="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left"
                  :class="activeChannel.id === dm.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
                >
                  <span class="relative flex h-2 w-2">
                    <span :class="dm.online ? 'bg-emerald-500' : 'bg-gray-400'" class="h-2 w-2 rounded-full"></span>
                  </span>
                  <span class="truncate">{{ dm.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col bg-white dark:bg-gray-900">
          <!-- Active Channel Header -->
          <div class="px-6 py-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <span>{{ activeChannel.name.startsWith('#') ? activeChannel.name : '@ ' + activeChannel.name }}</span>
                <span class="text-[11px] font-normal text-gray-400">• {{ activeChannel.members || '248 Anggota' }}</span>
              </h3>
              <p class="text-[11px] text-gray-500">{{ activeChannel.topic || 'Forum diskusi resmi korporat' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400 font-mono">Enkripsi E2E Aktif</span>
            </div>
          </div>

          <!-- Messages Stream -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <div
              v-for="msg in activeMessages"
              :key="msg.id"
              class="flex items-start gap-3 group"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0" :class="msg.isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">
                {{ msg.sender.substring(0, 2).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-xs font-bold text-gray-900 dark:text-white">{{ msg.sender }}</span>
                  <span class="text-[10px] text-gray-400">{{ msg.time }}</span>
                </div>
                <div class="mt-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl rounded-tl-none inline-block max-w-xl leading-relaxed">
                  {{ msg.text }}
                </div>
              </div>
            </div>
          </div>

          <!-- Send Input Bar -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <form @submit.prevent="sendMessage" class="flex items-center gap-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Tulis pesan ke saluran ini..."
                class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                :disabled="!newMessage.trim()"
                class="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const channelSearch = ref('')
const newMessage = ref('')

const publicChannels = ref([
  { id: 'ch_general', name: 'general', members: '248 Anggota', topic: 'Pengumuman umum seluruh karyawan perusahaan', unread: 0 },
  { id: 'ch_hr', name: 'pengumuman-hrd', members: '248 Anggota', topic: 'Informasi cuti bersama, benefit BPJS, dan slip gaji', unread: 2 },
  { id: 'ch_finance', name: 'finance-budgeting', members: '18 Anggota', topic: 'Koordinasi penutupan buku akhir bulan & perpajakan', unread: 0 },
  { id: 'ch_warehouse', name: 'warehouse-cikarang', members: '34 Anggota', topic: 'Laporan barang masuk inbound & mutasi rak', unread: 0 },
  { id: 'ch_sales', name: 'sales-champions', members: '52 Anggota', topic: 'Target closing kuartal III & diskon approval', unread: 1 },
])

const directMessages = ref([
  { id: 'dm_hr_lead', name: 'Siti Aminah (HR Specialist)', online: true, members: 'Direct Message', topic: 'Obrolan pribadi' },
  { id: 'dm_finance_head', name: 'Budi Santoso (Finance Manager)', online: true, members: 'Direct Message', topic: 'Obrolan pribadi' },
  { id: 'dm_director', name: 'Ahmad Fauzi (Direktur)', online: false, members: 'Direct Message', topic: 'Obrolan pribadi' },
])

const activeChannel = ref(publicChannels.value[0])

const messagesMap = ref<Record<string, any[]>>({
  ch_general: [
    { id: 1, sender: 'Ahmad Fauzi (Direktur)', text: 'Selamat pagi rekan-rekan. Terima kasih atas kerja keras seluruh tim pada kuartal ini.', time: '08:30 WIB', isMe: false },
    { id: 2, sender: 'HR Specialist', text: 'Pengingat: Batas akhir klaim pengobatan bulan September adalah besok pukul 17:00 WIB.', time: '09:15 WIB', isMe: false },
    { id: 3, sender: 'Saya (Superadmin)', text: 'Server sistem ERP telah diperbarui ke versi Enterprise v2.5.0. Semua modul normal.', time: '10:00 WIB', isMe: true },
  ],
  ch_hr: [
    { id: 1, sender: 'HR Specialist', text: 'Batch slip gaji periode September 2026 telah diposting dan dikirimkan via email/WhatsApp.', time: '10:05 WIB', isMe: false },
  ],
  ch_finance: [
    { id: 1, sender: 'Finance Manager', text: 'Rekonsiliasi bank BCA dan Mandiri sudah sinkron 100%. File e-Faktur PPN siap lapor.', time: '11:20 WIB', isMe: false },
  ],
})

const activeMessages = computed(() => {
  return messagesMap.value[activeChannel.value.id] || [
    { id: 1, sender: 'Sistem', text: 'Belum ada riwayat pesan di percakapan ini. Mulailah menyapa!', time: 'Sekarang', isMe: false },
  ]
})

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  if (!messagesMap.value[activeChannel.value.id]) {
    messagesMap.value[activeChannel.value.id] = []
  }
  const now = new Date()
  messagesMap.value[activeChannel.value.id].push({
    id: Date.now(),
    sender: 'Saya (Superadmin)',
    text: newMessage.value.trim(),
    time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    isMe: true,
  })
  newMessage.value = ''
}
</script>
