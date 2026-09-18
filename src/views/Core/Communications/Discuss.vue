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
                  @click="selectChannel(ch)"
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
                  @click="selectChannel(dm)"
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
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { discussService } from '@/services/core/discuss.service'

interface IChannelItem {
  id: number | string
  code: string
  name: string
  members?: string
  topic?: string
  unread?: number
  type?: string
  online?: boolean
}

const channelSearch = ref('')
const newMessage = ref('')
const isSending = ref(false)

const allChannels = ref<IChannelItem[]>([])
const messages = ref<any[]>([])

const publicChannels = computed(() => {
  return allChannels.value.filter(c => c.type !== 'DIRECT')
})

const directMessages = computed(() => {
  return allChannels.value.filter(c => c.type === 'DIRECT')
})

const activeChannel = ref<IChannelItem>({
  id: 'ch_general',
  code: 'ch_general',
  name: 'general',
  members: '248 Anggota',
  topic: 'Pengumuman umum seluruh karyawan perusahaan',
  unread: 0
})

const getChannelKey = (ch: IChannelItem) => {
  return ch.code || String(ch.id)
}

const selectChannel = (ch: IChannelItem) => {
  activeChannel.value = ch
  fetchMessages(getChannelKey(ch))
}

const fetchChannels = async () => {
  try {
    const res = await discussService.getChannels()
    const list = Array.isArray(res) ? res : (res as any)?.data || []
    if (list.length > 0) {
      allChannels.value = list.map((item: any) => ({
        id: item.id,
        code: item.code || `ch_${item.id}`,
        name: item.name,
        members: item.members || '248 Anggota',
        topic: item.topic || 'Forum diskusi resmi',
        unread: item.unread || 0,
        type: item.type || 'PUBLIC',
        online: item.online || false
      }))
      const firstPublic = allChannels.value.find(c => c.type !== 'DIRECT')
      if (firstPublic) {
        activeChannel.value = firstPublic
        await fetchMessages(getChannelKey(firstPublic))
      }
    }
  } catch (err) {
    console.error('Error fetching channels:', err)
  }
}

const fetchMessages = async (channelKey: string) => {
  try {
    const res = await discussService.getMessages(channelKey)
    const list = Array.isArray(res) ? res : (res as any)?.data || []
    messages.value = list.map((m: any) => ({
      id: m.id,
      sender: m.sender || 'System',
      text: m.text || m.message || '',
      time: m.created_at ? new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Sekarang',
      isMe: m.is_me ?? false
    }))
  } catch (err) {
    console.error('Error fetching messages:', err)
  }
}

const activeMessages = computed(() => {
  if (messages.value.length === 0) {
    return [
      { id: 0, sender: 'Sistem', text: 'Belum ada riwayat pesan di saluran ini. Mulailah menyapa!', time: 'Sekarang', isMe: false }
    ]
  }
  return messages.value
})

const sendMessage = async () => {
  const text = newMessage.value.trim()
  if (!text || isSending.value) return
  isSending.value = true
  try {
    const key = getChannelKey(activeChannel.value)
    await discussService.sendMessage(key, text, 'Saya (Superadmin)')
    newMessage.value = ''
    await fetchMessages(key)
  } catch (err: any) {
    alert('Gagal mengirim pesan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSending.value = false
  }
}

onMounted(() => {
  fetchChannels()
})
</script>
