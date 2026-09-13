<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Status Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Live Chat Support & Konsol Bantuan" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Layanan Percakapan Interaktif Real-Time dengan Pengunjung Web, Pelamar Kerja, dan Karyawan (Standar Odoo Live Chat)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-xl bg-white px-3.5 py-1.5 border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <span
              :class="[
                'w-2.5 h-2.5 rounded-full',
                agentStatus === 'online' ? 'bg-emerald-500 animate-pulse' : agentStatus === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
              ]"
            ></span>
            <select
              v-model="agentStatus"
              class="bg-transparent text-xs font-bold text-gray-800 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="online">🟢 Status: Online</option>
              <option value="busy">🟡 Status: Sibuk</option>
              <option value="offline">⚪ Status: Istirahat / Offline</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Live Chat Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold dark:bg-blue-900/20 dark:text-blue-400">
            💬
          </div>
          <div>
            <span class="text-xs text-gray-500">Sesi Aktif Saat Ini</span>
            <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ activeSessions.length }} Percakapan</h4>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold dark:bg-emerald-900/20 dark:text-emerald-400">
            ⚡
          </div>
          <div>
            <span class="text-xs text-gray-500">Rata-rata Respon Pertama</span>
            <h4 class="text-xl font-bold text-gray-900 dark:text-white">45 Detik</h4>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold dark:bg-amber-900/20 dark:text-amber-400">
            ⭐
          </div>
          <div>
            <span class="text-xs text-gray-500">Skor Kepuasan (CSAT)</span>
            <h4 class="text-xl font-bold text-gray-900 dark:text-white">4.9 / 5.0</h4>
          </div>
        </div>
      </div>

      <!-- Live Chat Console Layout -->
      <div class="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        <!-- Left Panel: Chat Sessions List (4 cols) -->
        <div class="md:col-span-4 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 flex items-center justify-between">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Antrean Percakapan</h3>
              <div class="flex items-center gap-1.5">
                <button
                  @click="openNewGuestModal"
                  class="rounded-lg bg-brand-500 text-white px-2 py-1 text-[10px] font-bold hover:bg-brand-600 transition-all"
                >
                  + Sesi Tamu
                </button>
                <span class="rounded-full bg-brand-100 text-brand-700 px-2 py-0.5 text-[11px] font-bold dark:bg-brand-900/40 dark:text-brand-300">
                  {{ activeSessions.length }}
                </span>
              </div>
            </div>

            <div class="divide-y divide-gray-100 dark:divide-gray-700/60 max-h-[460px] overflow-y-auto custom-scrollbar">
              <div
                v-for="session in activeSessions"
                :key="session.id"
                @click="selectedSession = session"
                :class="[
                  'p-4 cursor-pointer transition-colors flex items-start gap-3',
                  selectedSession.id === session.id
                    ? 'bg-brand-50/60 dark:bg-brand-900/20 border-l-4 border-brand-500'
                    : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/30'
                ]"
              >
                <div class="relative">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs dark:bg-indigo-900/40 dark:text-indigo-300">
                    {{ session.name.charAt(0) }}
                  </div>
                  <span
                    v-if="session.unread > 0"
                    class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white"
                  >
                    {{ session.unread }}
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ session.name }}</h4>
                    <span class="text-[10px] text-gray-400">{{ session.time }}</span>
                  </div>
                  <p class="text-[11px] font-semibold text-brand-600 dark:text-brand-400">{{ session.category }}</p>
                  <p class="text-xs text-gray-500 truncate mt-0.5">{{ session.lastMessage }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 text-center text-[11px] text-gray-400">
            Sistem terintegrasi WebSocket & RabbitMQ
          </div>
        </div>

        <!-- Right Panel: Active Chat Stream (8 cols) -->
        <div class="md:col-span-8 flex flex-col justify-between h-full bg-white dark:bg-gray-800">
          <!-- Chat Header -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/20">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                {{ selectedSession.name.charAt(0) }}
              </div>
              <div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {{ selectedSession.name }}
                  <span class="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-900/20">
                    Aktif
                  </span>
                </h4>
                <p class="text-xs text-gray-400">{{ selectedSession.email }} &bull; Topik: {{ selectedSession.category }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="triggerAIBot"
                class="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 flex items-center gap-1.5 transition-all"
              >
                <span>🤖 Bot FAQ</span>
              </button>
              <button
                @click="openHelpdeskModal"
                class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1.5 transition-all"
              >
                <span>🎫 Buat Tiket Helpdesk</span>
              </button>
              <button
                @click="endSession"
                class="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300"
              >
                Selesaikan
              </button>
            </div>
          </div>

          <!-- Messages Stream -->
          <div class="flex-1 p-6 space-y-4 overflow-y-auto max-h-[380px] custom-scrollbar bg-slate-50/30 dark:bg-slate-900/20">
            <div
              v-for="(msg, idx) in selectedSession.messages"
              :key="idx"
              :class="[
                'flex flex-col',
                msg.sender === 'agent' ? 'items-end' : 'items-start'
              ]"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold text-gray-500">
                  {{ msg.sender === 'agent' ? 'Anda (Support Agent)' : selectedSession.name }}
                </span>
                <span class="text-[10px] text-gray-400">{{ msg.time }}</span>
              </div>
              <div
                :class="[
                  'rounded-2xl px-4 py-2.5 text-xs max-w-sm sm:max-w-md shadow-sm',
                  msg.sender === 'agent'
                    ? 'bg-brand-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-bl-none'
                ]"
              >
                {{ msg.text }}
              </div>
            </div>
          </div>

          <!-- Canned Quick Responses -->
          <div class="px-4 py-2 bg-gray-50/80 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 items-center text-[11px]">
            <span class="text-gray-400 font-semibold">Respon Cepat:</span>
            <button
              v-for="(canned, idx) in cannedResponses"
              :key="idx"
              @click="useCanned(canned)"
              class="rounded-lg bg-white px-2.5 py-1 text-gray-600 border border-gray-200 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 transition-colors"
            >
              {{ canned }}
            </button>
          </div>

          <!-- Message Input Bar -->
          <form @submit.prevent="sendMessage" class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="Ketik balasan Anda kepada pengunjung di sini..."
              class="flex-1 rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-4 text-xs focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              class="rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all flex items-center gap-1.5"
            >
              <span>Kirim</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Modal Eskalasi ke Tiket Helpdesk (Fase 8) -->
      <div v-if="showHelpdeskModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showHelpdeskModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
              🎫
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Eskalasi ke Tiket Helpdesk ERP</h3>
              <p class="text-xs text-gray-500">Konversikan percakapan live chat ini menjadi tiket bantuan resmi terpusat.</p>
            </div>
          </div>

          <form @submit.prevent="createHelpdeskTicket" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor Tiket</label>
                <input v-model="helpdeskForm.ticket_no" readonly class="w-full rounded-xl border border-gray-200 bg-gray-100 py-2 px-3 text-xs font-mono font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Prioritas</label>
                <select v-model="helpdeskForm.priority" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option value="Rendah">Rendah (Low)</option>
                  <option value="Sedang">Sedang (Medium)</option>
                  <option value="Tinggi">Tinggi (High SLA 4 Jam)</option>
                  <option value="Kritis">Kritis (Urgent SLA 1 Jam)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pelapor / Pengunjung</label>
              <input v-model="helpdeskForm.reporter" readonly class="w-full rounded-xl border border-gray-200 bg-gray-100 py-2 px-3 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subjek Masalah *</label>
              <input v-model="helpdeskForm.subject" required type="text" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Ringkasan Masalah</label>
              <textarea v-model="helpdeskForm.description" rows="3" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"></textarea>
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="showHelpdeskModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white hover:bg-amber-700">Terbitkan Tiket Helpdesk</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Tambah Sesi Tamu Baru -->
      <div v-if="showNewGuestModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showNewGuestModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Mulai Sesi Chat Tamu Baru</h3>

          <form @submit.prevent="addGuestSession" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Tamu / Perusahaan *</label>
              <input v-model="newGuestForm.name" required type="text" placeholder="Contoh: Ahmad Fauzi (PT. Sentosa)" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input v-model="newGuestForm.email" required type="email" placeholder="ahmad@sentosa.com" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Departemen / Topik *</label>
              <select v-model="newGuestForm.category" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <option value="Rekrutmen & Karir">Rekrutmen & Karir</option>
                <option value="Pertanyaan HR & ESS">Pertanyaan HR & ESS</option>
                <option value="Penjualan & E-Commerce">Penjualan & E-Commerce</option>
                <option value="Kendala Teknis ERP">Kendala Teknis ERP</option>
              </select>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="showNewGuestModal = false" class="rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">Mulai Percakapan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

interface Message {
  sender: 'user' | 'agent'
  text: string
  time: string
}

interface ChatSession {
  id: number
  name: string
  email: string
  category: string
  time: string
  lastMessage: string
  unread: number
  messages: Message[]
}

const agentStatus = ref<'online' | 'busy' | 'offline'>('online')
const inputMessage = ref('')

const cannedResponses = [
  'Halo! Ada yang bisa kami bantu?',
  'Silakan cek menu Portal Karir untuk lowongan resmi.',
  'Terima kasih telah menghubungi PT. Nusantara Prima Solusindo!',
]

const activeSessions = ref<ChatSession[]>([
  {
    id: 1,
    name: 'Clarissa Amanda (Pelamar)',
    email: 'clarissa.amanda@gmail.com',
    category: 'Rekrutmen & Karir',
    time: '2m lalu',
    lastMessage: 'Apakah posisi Senior Tax Specialist masih dibuka untuk cabang Jakarta?',
    unread: 1,
    messages: [
      {
        sender: 'user',
        text: 'Selamat siang min, saya melihat lowongan Senior Tax Specialist di portal karir.',
        time: '14:20',
      },
      {
        sender: 'user',
        text: 'Apakah posisi tersebut masih dibuka untuk cabang Jakarta?',
        time: '14:21',
      },
      {
        sender: 'agent',
        text: 'Selamat siang Ibu Clarissa! Ya, posisi tersebut masih aktif menerima berkas lamaran.',
        time: '14:22',
      },
    ],
  },
  {
    id: 2,
    name: 'Budi Hartono (Karyawan)',
    email: 'budi.hartono@nusantara-erp.id',
    category: 'Pertanyaan HR & ESS',
    time: '10m lalu',
    lastMessage: 'Bagaimana cara download slip gaji bulan lalu di portal ESS?',
    unread: 0,
    messages: [
      {
        sender: 'user',
        text: 'Halo tim HR, bagaimana cara download slip gaji bulan lalu di portal ESS?',
        time: '14:10',
      },
      {
        sender: 'agent',
        text: 'Halo Pak Budi, silakan buka menu Employee Portal (/hr/employee-portal) lalu klik tombol Cetak Slip Gaji.',
        time: '14:12',
      },
    ],
  },
  {
    id: 3,
    name: 'PT. Megah Konstruksi (Klien)',
    email: 'procurement@megah.co.id',
    category: 'Penjualan & E-Commerce',
    time: '25m lalu',
    lastMessage: 'Apakah ada penawaran harga khusus untuk pengadaan 20 unit laptop ThinkPad?',
    unread: 0,
    messages: [
      {
        sender: 'user',
        text: 'Selamat siang, kami bermaksud memesan 20 unit ThinkPad T14 di katalog Toko Online.',
        time: '13:55',
      },
      {
        sender: 'agent',
        text: 'Siang Bapak, pesanan B2B dalam volume besar berhak mendapatkan diskon korporat. Tim Sales Enterprise kami akan segera mengirimkan proposal penawaran resmi.',
        time: '14:00',
      },
    ],
  },
])

const selectedSession = ref<ChatSession>(activeSessions.value[0])

function useCanned(text: string) {
  inputMessage.value = text
}

function sendMessage() {
  if (!inputMessage.value.trim()) return
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  selectedSession.value.messages.push({
    sender: 'agent',
    text: inputMessage.value,
    time: timeStr,
  })
  selectedSession.value.lastMessage = inputMessage.value
  inputMessage.value = ''
}

const showHelpdeskModal = ref(false)
const helpdeskForm = ref({
  ticket_no: '',
  reporter: '',
  priority: 'Sedang',
  subject: '',
  description: '',
})

const showNewGuestModal = ref(false)
const newGuestForm = ref({
  name: '',
  email: '',
  category: 'Rekrutmen & Karir',
})

function openHelpdeskModal() {
  helpdeskForm.value = {
    ticket_no: `TKT-${Date.now().toString().slice(-6)}`,
    reporter: `${selectedSession.value.name} (${selectedSession.value.email})`,
    priority: 'Sedang',
    subject: `[${selectedSession.value.category}] ${selectedSession.value.lastMessage}`,
    description: `Percakapan live chat dialihkan ke Helpdesk terpusat.\n\nRiwayat Pesan Terakhir: "${selectedSession.value.lastMessage}"`,
  }
  showHelpdeskModal.value = true
}

function createHelpdeskTicket() {
  alert(`🎫 Tiket Bantuan "${helpdeskForm.value.ticket_no}" berhasil diterbitkan!\n\nSubjek: ${helpdeskForm.value.subject}\nPrioritas: ${helpdeskForm.value.priority}\n\nTiket telah masuk ke antrean Helpdesk & Services ERP untuk ditindaklanjuti.`)
  showHelpdeskModal.value = false
}

function openNewGuestModal() {
  newGuestForm.value = {
    name: '',
    email: '',
    category: 'Rekrutmen & Karir',
  }
  showNewGuestModal.value = true
}

function addGuestSession() {
  const newSession: ChatSession = {
    id: Date.now(),
    name: newGuestForm.value.name,
    email: newGuestForm.value.email,
    category: newGuestForm.value.category,
    time: 'Baru saja',
    lastMessage: 'Halo, saya ingin menanyakan informasi lebih lanjut.',
    unread: 1,
    messages: [
      {
        sender: 'user',
        text: 'Halo, saya ingin menanyakan informasi terkait ' + newGuestForm.value.category,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  }
  activeSessions.value.unshift(newSession)
  selectedSession.value = newSession
  showNewGuestModal.value = false
}

function triggerAIBot() {
  const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  selectedSession.value.messages.push({
    sender: 'agent',
    text: `🤖 [AI Assistant]: Halo ${selectedSession.value.name}! Ada yang bisa saya bantu? Berikut opsi cepat:\n1. Cek Lowongan: Buka /website/careers\n2. Cek Faktur B2B: Buka /website/partner-portal\n3. Pengaduan Etik: Buka /website/whistleblowing\n\nAtau ketik pesan Anda untuk bantuan agen manusia.`,
    time: now,
  })
}

function endSession() {
  const name = selectedSession.value.name
  activeSessions.value = activeSessions.value.filter((s) => s.id !== selectedSession.value.id)
  if (activeSessions.value.length > 0) {
    selectedSession.value = activeSessions.value[0]
  }
  alert(`Sesi percakapan dengan "${name}" telah ditandai selesai dan diarsipkan.`)
}
</script>
