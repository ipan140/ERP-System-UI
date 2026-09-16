<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </span>
            SMS & WhatsApp Broadcast Marketing
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Enterprise: Siaran pesan massal multi-channel (SMS & WhatsApp Bisnis), simulasi tampilan chat HP interaktif, dan estimasi kuota broadcast.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="openWaConfigModal" class="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-theme-xs hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition">
            <span>⚙️</span>
            Pengaturan WABA
          </button>
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-emerald-700 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Buat Siaran Baru
          </button>
        </div>
      </div>

      <!-- KPI Metrics -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Pesan Terkirim</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ totalSent.toLocaleString('id-ID') }}</h3>
          <p class="mt-1 text-xs text-emerald-600 font-medium">Gateway SMS & WhatsApp Cloud API</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tingkat Terkirim (Delivery)</p>
          <h3 class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ records.length > 0 ? '99.4%' : '0%' }}</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">Koneksi operator langsung</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Sisa Kuota Kredit Siaran</p>
          <h3 class="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ remainingCredits.toLocaleString('id-ID') }}</h3>
          <p class="mt-1 text-xs text-blue-600 font-medium">SMS & WhatsApp Terpadu</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kampanye Aktif</p>
          <h3 class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ records.length }}</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">Total kampanye broadcast</p>
        </div>
      </div>

      <!-- Main Layout: Table on Left, Smartphone Simulator on Right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Table List (8 Cols) -->
        <div class="lg:col-span-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Siaran Pesan Broadcast</h3>
            <span class="text-xs text-gray-500 dark:text-gray-400">Klik baris untuk pratinjau simulator HP</span>
          </div>
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Kampanye</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kanal</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Target Audiens</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Terkirim</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="isLoading"><td colspan="6" class="px-5 py-8 text-center text-gray-500">Memuat data siaran...</td></tr>
                <tr v-else-if="error"><td colspan="6" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
                <tr v-else-if="records.length === 0"><td colspan="6" class="px-5 py-8 text-center text-gray-500">Belum ada siaran broadcast yang dibuat.</td></tr>
                <tr
                  v-for="record in records"
                  :key="record.id"
                  @click="selectPreviewRecord(record)"
                  class="cursor-pointer transition hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10"
                  :class="{ 'bg-emerald-50/60 dark:bg-emerald-900/20': selectedPreviewSms?.id === record.id }"
                >
                  <td class="px-5 py-4 max-w-xs">
                    <p class="font-semibold text-gray-900 dark:text-white capitalize">{{ record.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ record.content || '-' }}</p>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span
                      v-if="(record.channel || 'SMS') === 'WhatsApp'"
                      class="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-xs font-bold"
                    >
                      <span>💬</span> WhatsApp
                    </span>
                    <span
                      v-else-if="(record.channel || 'SMS') === 'SMS & WhatsApp'"
                      class="inline-flex items-center gap-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-2 py-0.5 text-xs font-bold"
                    >
                      <span>⚡</span> SMS + WA
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-xs font-bold"
                    >
                      <span>📱</span> SMS
                    </span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span class="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {{ record.target_audience || 'Semua Pelanggan' }}
                    </span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        record.status === 'Sent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        record.status === 'In-Queue' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' :
                        'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border'
                      ]"
                    >
                      ● {{ record.status || 'Draft' }}
                    </span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {{ (record.sent_count || 0).toLocaleString('id-ID') }} Penerima
                  </td>
                  <td class="px-5 py-4 text-right" @click.stop>
                    <div class="inline-flex items-center gap-1.5 justify-end">
                      <!-- Tombol Eksekusi Siar Nyata -->
                      <button
                        v-if="record.status !== 'Sent'"
                        type="button"
                        @click="executeBroadcast(record)"
                        :disabled="isBroadcasting"
                        class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-2.5 py-1.5 shadow-xs transition"
                        title="Kirim siaran pesan massal sekarang ke seluruh audiens"
                      >
                        <span>🚀</span>
                        <span>Kirim Siar</span>
                      </button>
                      <button
                        v-else
                        type="button"
                        @click="executeBroadcast(record)"
                        :disabled="isBroadcasting"
                        class="inline-flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-1.5 transition"
                        title="Kirim ulang siaran ini"
                      >
                        <span>🔄</span>
                        <span>Siar Ulang</span>
                      </button>

                      <!-- Tombol Tes Kirim ke HP/WA Pengguna -->
                      <button
                        type="button"
                        @click="openTestModal(record)"
                        class="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-semibold px-2.5 py-1.5 transition"
                        title="Tes kirim pesan siaran ini langsung ke nomor WhatsApp/HP Anda"
                      >
                        <span>📲</span>
                        <span>Tes HP</span>
                      </button>

                      <!-- Edit & Hapus -->
                      <button
                        type="button"
                        @click="openModal('edit', record)"
                        class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 transition"
                        title="Edit Kampanye"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button
                        type="button"
                        @click="deleteRecord(record.id)"
                        class="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 transition"
                        title="Hapus Kampanye"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <PaginationBar :pagination="pagination" @change="onPaginationChange" />
        </div>

        <!-- Smartphone Device Simulator (4 Cols) -->
        <div class="lg:col-span-4 flex flex-col items-center space-y-3">
          <!-- Switcher Tampilan Simulator (SMS vs WhatsApp) -->
          <div class="inline-flex rounded-xl bg-gray-200 dark:bg-gray-800 p-1 text-xs font-semibold shadow-inner">
            <button
              type="button"
              @click="activeSimulatorMode = 'sms'"
              :class="activeSimulatorMode === 'sms' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <span>📱</span> SMS View
            </button>
            <button
              type="button"
              @click="activeSimulatorMode = 'wa'"
              :class="activeSimulatorMode === 'wa' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <span>💬</span> WhatsApp View
            </button>
          </div>

          <div class="w-full max-w-xs rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 p-3 shadow-2xl">
            <!-- Speaker notch -->
            <div class="mx-auto h-4 w-28 rounded-full bg-gray-800 mb-2"></div>

            <!-- Screen Area: MODE SMS -->
            <div
              v-if="activeSimulatorMode === 'sms'"
              class="rounded-[2rem] bg-gray-100 dark:bg-gray-950 p-4 min-h-[440px] flex flex-col justify-between"
            >
              <div>
                <div class="text-center pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div class="mx-auto h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-1 shadow">
                    SMS
                  </div>
                  <p class="text-xs font-bold text-gray-800 dark:text-white">ERP-OFFICIAL</p>
                  <p class="text-[10px] text-gray-400">Pengirim Resmi SMS Terverifikasi</p>
                </div>

                <!-- Chat Bubble SMS -->
                <div class="mt-4 flex flex-col space-y-2">
                  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm leading-relaxed whitespace-pre-line border border-gray-200/50 dark:border-gray-700/50">
                    {{ previewContentText }}
                  </div>
                  <span class="text-[9px] text-gray-400 self-start pl-1">Baru saja • Terkirim</span>
                </div>
              </div>

              <!-- Input footer mockup SMS -->
              <div class="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-gray-400 text-xs">
                <span>Pesan Teks (SMS)</span>
                <span class="text-blue-500 font-bold">● Aktif</span>
              </div>
            </div>

            <!-- Screen Area: MODE WHATSAPP -->
            <div
              v-else
              class="rounded-[2rem] bg-[#efeae2] dark:bg-[#0b141a] p-4 min-h-[440px] flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <!-- Header WhatsApp -->
                <div class="bg-[#075e54] dark:bg-[#202c33] -mx-4 -mt-4 p-3 text-white flex items-center gap-2.5 shadow-sm">
                  <div class="h-8 w-8 rounded-full bg-emerald-400 text-[#075e54] font-black text-xs flex items-center justify-center shrink-0">
                    WA
                  </div>
                  <div class="overflow-hidden">
                    <p class="text-xs font-bold truncate flex items-center gap-1">
                      <span>ERP Corporation</span>
                      <span class="text-[10px] text-emerald-300">✓</span>
                    </p>
                    <p class="text-[9px] text-emerald-100/80">Akun Bisnis Resmi</p>
                  </div>
                </div>

                <!-- Chat Bubble WhatsApp -->
                <div class="mt-4 flex flex-col items-end">
                  <div class="bg-[#dcf8c6] dark:bg-[#005c4b] text-gray-900 dark:text-white p-3 rounded-2xl rounded-tr-none text-xs shadow-sm leading-relaxed whitespace-pre-line max-w-[92%] border border-black/5">
                    {{ previewContentText }}
                    <div class="flex items-center justify-end gap-1 text-[9px] text-gray-500 dark:text-emerald-200/70 mt-1">
                      <span>12:00</span>
                      <span class="text-blue-500 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Input footer mockup WhatsApp -->
              <div class="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
                <span class="truncate text-[11px]">Ketik pesan...</span>
                <span class="text-emerald-600 font-bold text-[11px]">WhatsApp Bisnis</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Bar pada Layar HP -->
          <div class="w-full max-w-xs flex gap-2">
            <button
              v-if="selectedPreviewSms"
              type="button"
              @click="openTestModal(selectedPreviewSms)"
              class="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>📲</span> Tes Kirim ke WhatsApp/HP Saya
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tes Pengiriman ke Nomor Pengguna Langsung -->
  <Teleport to="body">
    <div v-if="isTestModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📲</span> Tes Kirim Pesan Siaran Langsung
          </h3>
          <button @click="isTestModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
  
        <div class="mt-4 space-y-4">
          <div class="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-900 dark:text-blue-200">
            <p class="font-bold mb-1">Pesan yang akan dikirim:</p>
            <p class="italic text-gray-700 dark:text-gray-300">"{{ activeTestCampaign?.content }}"</p>
          </div>
  
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Nomor WhatsApp / HP Tujuan Tes
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-sm text-gray-400 font-bold">+62</span>
              <input
                v-model="testPhone"
                type="text"
                placeholder="81234567890"
                class="w-full rounded-lg border border-gray-300 pl-12 pr-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Masukkan nomor WhatsApp aktif Anda untuk menerima simulasi pesan ini.</p>
          </div>
  
          <!-- Tombol Aksi Tes -->
          <div class="space-y-2 pt-2">
            <button
              type="button"
              @click="submitSendTest"
              :disabled="isSendingTest"
              class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <span>💬</span> Buka Chat WhatsApp Langsung (Direct Link)
            </button>
            <button
              type="button"
              @click="isTestModalOpen = false"
              class="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-750 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal Konfirmasi Eksekusi Siar Broadcast Massal -->
  <Teleport to="body">
    <div v-if="isBroadcastResultModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span>✅</span> Laporan Eksekusi Siaran Berhasil
          </h3>
          <button @click="isBroadcastResultModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
  
        <div class="mt-4 space-y-3" v-if="broadcastResultData">
          <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
            <p><strong class="font-bold">Kampanye:</strong> {{ broadcastResultData.campaign_name }}</p>
            <p><strong class="font-bold">Kanal Siaran:</strong> {{ broadcastResultData.channel }}</p>
            <p><strong class="font-bold">Total Target Kontak:</strong> {{ broadcastResultData.total_target }} Nomor Pelanggan</p>
            <p><strong class="font-bold">Terkirim (Sent):</strong> {{ broadcastResultData.sent_count }} Pesan (Delivery: {{ broadcastResultData.delivered_count }})</p>
            <p><strong class="font-bold">Waktu Eksekusi:</strong> {{ broadcastResultData.execution_time }}</p>
          </div>
  
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Daftar Kontak Penerima Siaran:
            </label>
            <div class="max-h-36 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50 text-xs space-y-1">
              <div
                v-for="(rec, idx) in broadcastResultData.recipients"
                :key="idx"
                class="flex items-center justify-between py-0.5 text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-800 last:border-none"
              >
                <span>{{ rec }}</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">Terkirim ✓</span>
              </div>
            </div>
          </div>
  
          <div class="pt-2 flex justify-end">
            <button
              type="button"
              @click="isBroadcastResultModalOpen = false"
              class="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal Tambah/Edit Siaran Broadcast -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📢</span> {{ modalMode === 'create' ? 'Buat Siaran Broadcast Baru' : 'Edit Siaran Broadcast' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
  
        <form @submit.prevent="saveRecord" class="mt-4 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Nama Kampanye Siaran</label>
            <input v-model="formData.name" type="text" placeholder="Misal: Flash Sale Gajian Broadcast" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
  
          <!-- Pemilihan Kanal Siaran -->
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Kanal Distribusi Pesan</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="formData.channel = 'SMS'"
                :class="formData.channel === 'SMS' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'"
                class="px-3 py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>📱</span> SMS GSM
              </button>
              <button
                type="button"
                @click="formData.channel = 'WhatsApp'"
                :class="formData.channel === 'WhatsApp' ? 'bg-emerald-600 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'"
                class="px-3 py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>💬</span> WhatsApp
              </button>
              <button
                type="button"
                @click="formData.channel = 'SMS & WhatsApp'"
                :class="formData.channel === 'SMS & WhatsApp' ? 'bg-purple-600 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'"
                class="px-3 py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>⚡</span> Keduanya
              </button>
            </div>
          </div>
  
          <div v-if="formData.channel === 'SMS' || formData.channel === 'SMS & WhatsApp'">
            <div class="flex justify-between items-center mb-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Isi Konten Pesan (SMS)</label>
              <span class="text-xs" :class="charCount > 160 ? 'text-amber-600 font-bold' : 'text-gray-400'">
                {{ charCount }} karakter ({{ smsCount }} SMS)
              </span>
            </div>
            <textarea v-model="formData.content" rows="4" placeholder="Ketik pesan promosi siaran Anda..." :required="formData.channel === 'SMS' || formData.channel === 'SMS & WhatsApp'" class="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
          </div>

          <div v-if="formData.channel === 'WhatsApp' || formData.channel === 'SMS & WhatsApp'">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Pilih Template WhatsApp (WABA)</label>
            <select v-model="selectedWaTemplateId" @change="onWaTemplateChange" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" :required="formData.channel === 'WhatsApp' || formData.channel === 'SMS & WhatsApp'">
              <option value="" disabled>-- Pilih Template Meta --</option>
              <option v-for="tpl in waTemplates" :key="tpl.id" :value="tpl.id">{{ tpl.name }} ({{ tpl.status }})</option>
            </select>
            <div v-if="selectedWaTemplateContent" class="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line border border-gray-200 dark:border-gray-700">
              {{ selectedWaTemplateContent }}
            </div>
            <div v-if="waTemplates.length === 0" class="mt-1 text-[11px] text-amber-600">Belum ada template WABA. Silakan sinkronkan di Pengaturan WABA.</div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Target Segmentasi Audiens</label>
              <select v-model="formData.target_audience" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Semua Pelanggan Terdaftar">Semua Pelanggan Terdaftar</option>
                <option value="Pelanggan Loyal VIP">Pelanggan Loyal VIP</option>
                <option value="Leads CRM Baru">Leads CRM Baru</option>
                <option value="Pelanggan Belum Bayar Invoice">Pelanggan Belum Bayar Invoice</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status</label>
              <select v-model="formData.status" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Draft">Draft</option>
                <option value="In-Queue">In-Queue (Antrean Siar)</option>
                <option value="Sent">Sent (Sudah Terkirim)</option>
              </select>
            </div>
          </div>
  
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Jumlah Penerima / Kuota</label>
            <input v-model.number="formData.sent_count" type="number" min="0" placeholder="0" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
  
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Siaran' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Pengaturan WABA -->
  <Teleport to="body">
    <div v-if="isWaConfigModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Pengaturan WhatsApp Business API (WABA)
          </h3>
          <button @click="isWaConfigModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <form @submit.prevent="saveWaConfig" class="mt-4 space-y-4">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-xl">
            <p>Konfigurasi ini diperlukan untuk menghubungkan modul marketing dengan API Resmi Meta Cloud.</p>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">WABA ID</label>
            <input v-model="waConfig.waba_id" type="text" placeholder="Masukkan WhatsApp Business Account ID" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Phone Number ID</label>
            <input v-model="waConfig.phone_number_id" type="text" placeholder="Masukkan Phone Number ID" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Permanent Access Token</label>
            <textarea v-model="waConfig.access_token" rows="3" placeholder="Masukkan token akses Meta..." required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="fetchWaTemplates" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              <span>🔄</span> Sinkronkan Template
            </button>
            <div class="flex gap-2">
              <button type="button" @click="isWaConfigModalOpen = false" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
              <button type="submit" :disabled="isSavingWaConfig" class="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                {{ isSavingWaConfig ? 'Menyimpan...' : 'Simpan Konfigurasi' }}
              </button>
            </div>
          </div>
        </form>

        <div v-if="waTemplates.length > 0" class="mt-6">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Template Tersinkronisasi ({{ waTemplates.length }})</h4>
          <div class="max-h-40 overflow-y-auto custom-scrollbar border border-gray-200 dark:border-gray-700 rounded-lg">
            <div v-for="tpl in waTemplates" :key="tpl.id" class="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 text-xs">
              <div class="flex justify-between">
                <span class="font-bold">{{ tpl.name }}</span>
                <span class="text-emerald-600">{{ tpl.status }}</span>
              </div>
              <p class="text-gray-500 mt-1 truncate">{{ tpl.content }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { IPaginationMeta } from '@/types'
import { smsMarketingService } from '@/services/marketing/sms.service'
import type { ISmsCampaignDto } from '@/types/marketing/sms_marketing.dto'

const records = ref<ISmsCampaignDto[]>([])
const selectedPreviewSms = ref<ISmsCampaignDto | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

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

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const activeSimulatorMode = ref<'sms' | 'wa'>('sms')

// --- WABA Properties ---
const isWaConfigModalOpen = ref(false)
const isSavingWaConfig = ref(false)
const waConfig = ref({
  waba_id: '',
  phone_number_id: '',
  access_token: ''
})
const waTemplates = ref<any[]>([])
const selectedWaTemplateId = ref('')
const selectedWaTemplateContent = computed(() => {
  const tpl = waTemplates.value.find(t => t.id === selectedWaTemplateId.value)
  return tpl ? tpl.content : ''
})

const onWaTemplateChange = () => {
  if (formData.value.channel === 'WhatsApp' || formData.value.channel === 'SMS & WhatsApp') {
    formData.value.content = selectedWaTemplateContent.value;
  }
}

const openWaConfigModal = async () => {
  isWaConfigModalOpen.value = true
  try {
    const data = await smsMarketingService.getConfig()
    if (data) {
      waConfig.value = {
        waba_id: data.waba_id || '',
        phone_number_id: data.phone_number_id || '',
        access_token: data.access_token || ''
      }
    }
  } catch (e) {
    console.error("No WA Config found")
  }
}

const saveWaConfig = async () => {
  isSavingWaConfig.value = true
  try {
    await smsMarketingService.saveConfig(waConfig.value)
    alert('Konfigurasi WABA berhasil disimpan!')
    isWaConfigModalOpen.value = false
  } catch (err: any) {
    alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingWaConfig.value = false
  }
}

const fetchWaTemplates = async () => {
  try {
    const data = await smsMarketingService.getTemplates()
    waTemplates.value = data || []
  } catch (err: any) {
    console.error("Gagal load template:", err)
  }
}


const formData = ref<{
  id: number | null
  name: string
  channel: 'SMS' | 'WhatsApp' | 'SMS & WhatsApp'
  content: string
  target_audience: string
  status: 'Draft' | 'In-Queue' | 'Sent'
  sent_count: number
}>({
  id: null,
  name: '',
  channel: 'SMS',
  content: '',
  target_audience: 'Semua Pelanggan Terdaftar',
  status: 'Draft',
  sent_count: 0
})

// Calculations
const charCount = computed(() => formData.value.content?.length || 0)
const smsCount = computed(() => Math.max(1, Math.ceil(charCount.value / 160)))
const totalSent = computed(() => records.value.reduce((acc, curr) => acc + (curr.sent_count || 0), 0))
// Sisa kredit broadcast terpadu (awal 50.000 dikurangi total terkirim)
const remainingCredits = computed(() => Math.max(0, 50000 - totalSent.value))

const previewContentText = computed(() => {
  return selectedPreviewSms.value?.content || records.value[0]?.content || 'Ketikkan pesan promosi broadcast Anda di formulir kampanye...'
})

const selectPreviewRecord = (record: ISmsCampaignDto) => {
  selectedPreviewSms.value = record
  // Sesuaikan tampilan simulator ke kanal yang digunakan record
  if (record.channel === 'WhatsApp') {
    activeSimulatorMode.value = 'wa'
  } else {
    activeSimulatorMode.value = 'sms'
  }
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await smsMarketingService.getAll({
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    })
    if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
      records.value = (res as any).data
      if ((res as any).pagination) pagination.value = (res as any).pagination
    } else if (Array.isArray(res)) {
      records.value = res
    } else {
      records.value = []
    }
    if (records.value.length > 0 && !selectedPreviewSms.value) {
      selectPreviewRecord(records.value[0])
    }
    await fetchWaTemplates()
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: ISmsCampaignDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = {
      id: data.id || null,
      name: data.name || '',
      channel: (data.channel as any) || 'SMS',
      content: data.content || '',
      target_audience: data.target_audience || 'Semua Pelanggan Terdaftar',
      status: data.status || 'Draft',
      sent_count: data.sent_count || 0
    }
  } else {
    formData.value = {
      id: null,
      name: '',
      channel: 'SMS',
      content: '',
      target_audience: 'Semua Pelanggan Terdaftar',
      status: 'Draft',
      sent_count: 0
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveRecord = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'edit' && formData.value.id) {
      await smsMarketingService.update(formData.value.id, formData.value)
    } else {
      await smsMarketingService.create(formData.value)
    }
    closeModal()
    await fetchData()
    if (formData.value.id) {
      const updated = records.value.find(r => r.id === formData.value.id)
      if (updated) selectPreviewRecord(updated)
    } else if (records.value.length > 0) {
      selectPreviewRecord(records.value[records.value.length - 1])
    }
  } catch (err: any) {
    alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus kampanye siaran ini?')) return
  try {
    await smsMarketingService.delete(id)
    if (selectedPreviewSms.value?.id === id) {
      selectedPreviewSms.value = null
    }
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

const isBroadcasting = ref(false)
const isBroadcastResultModalOpen = ref(false)
const broadcastResultData = ref<any>(null)

const isTestModalOpen = ref(false)
const activeTestCampaign = ref<ISmsCampaignDto | null>(null)
const testPhone = ref('')
const isSendingTest = ref(false)

// Eksekusi siaran broadcast nyata ke seluruh kontak audiens
const executeBroadcast = async (record: ISmsCampaignDto) => {
  if (!record.id) return
  const confirmMsg = `Kirim siaran "${record.name}" sekarang melalui ${record.channel || 'SMS'} ke seluruh audiens (${record.target_audience})?`
  if (!confirm(confirmMsg)) return

  isBroadcasting.value = true
  try {
    const res = await smsMarketingService.broadcast(record.id)
    broadcastResultData.value = res
    isBroadcastResultModalOpen.value = true
    await fetchData()
    // Update selected preview
    const updated = records.value.find(r => r.id === record.id)
    if (updated) selectPreviewRecord(updated)
  } catch (err: any) {
    alert('Gagal mengeksekusi siaran: ' + (err.response?.data?.message || err.message))
  } finally {
    isBroadcasting.value = false
  }
}

// Buka modal tes kirim langsung ke HP/WA pengguna
const openTestModal = (record: ISmsCampaignDto) => {
  activeTestCampaign.value = record
  testPhone.value = ''
  isTestModalOpen.value = true
}

// Kirim tes pesan langsung via WhatsApp Direct Link & API
const submitSendTest = async () => {
  if (!activeTestCampaign.value?.id) return
  const phone = testPhone.value.trim()
  if (!phone) {
    alert('Silakan masukkan nomor HP / WhatsApp Anda!')
    return
  }

  isSendingTest.value = true
  try {
    const res = await smsMarketingService.sendTest(activeTestCampaign.value.id, {
      target_phone: phone,
      channel: activeTestCampaign.value.channel || 'WhatsApp'
    })

    // Jika memiliki tautan langsung WhatsApp, buka di tab baru
    if (res.wa_direct_url) {
      window.open(res.wa_direct_url, '_blank')
    } else {
      alert(res.message || 'Pesan tes berhasil dikirimkan!')
    }
    isTestModalOpen.value = false
  } catch (err: any) {
    alert('Gagal mengirim pesan tes: ' + (err.response?.data?.message || err.message))
  } finally {
    isSendingTest.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
