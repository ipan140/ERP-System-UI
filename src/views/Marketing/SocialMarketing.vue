<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="p-2 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
            </span>
            Media Sosial (Social Marketing Planner & Scheduler)
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Standar Enterprise: Rencanakan posting multi-platform (FB, IG, X, LinkedIn), pratinjau kartu feed langsung, dan jadwalkan konten.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button @click="fetchData" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Refresh
          </button>
          <button @click="openModal('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Buat Postingan Baru
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Konten Terbit</p>
          <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ publishedCount }}</h3>
          <p class="mt-1 text-xs text-emerald-600 font-medium">Postingan aktif di media sosial</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Konten Terjadwal</p>
          <h3 class="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ scheduledCount }}</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">Dalam kalender antrean</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Draf & Ide Konten</p>
          <h3 class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ draftCount }}</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">Menunggu review tim editor</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Estimasi Reach</p>
          <h3 class="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{{ totalReach.toLocaleString('id-ID') }}</h3>
          <p class="mt-1 text-xs text-purple-600 font-medium">Audience impressions</p>
        </div>
      </div>

      <!-- Main Layout: Table on Left, Live Feed Preview on Right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Post List (8 Cols) -->
        <div class="lg:col-span-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Daftar Konten Postingan Sosial</h3>
            <span class="text-xs text-gray-500 dark:text-gray-400">Klik baris untuk pratinjau kartu sosial</span>
          </div>
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Konten Pesan</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kanal Target</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="isLoading"><td colspan="4" class="px-5 py-8 text-center text-gray-500">Memuat data konten...</td></tr>
                <tr v-else-if="error"><td colspan="4" class="px-5 py-8 text-center text-red-500">{{ error }}</td></tr>
                <tr v-else-if="records.length === 0"><td colspan="4" class="px-5 py-8 text-center text-gray-500">Belum ada konten sosial yang dibuat.</td></tr>
                <tr
                  v-for="record in records"
                  :key="record.id"
                  @click="selectPost(record)"
                  class="cursor-pointer transition hover:bg-brand-50/40 dark:hover:bg-brand-900/10"
                  :class="{ 'bg-brand-50/60 dark:bg-brand-900/20': selectedPreviewPost?.id === record.id }"
                >
                  <td class="px-5 py-4 max-w-xs">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{{ record.message || '-' }}</p>
                    <span v-if="record.scheduled_at" class="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                      📅 {{ formatDate(record.scheduled_at) }}
                    </span>
                    <span v-else class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block">
                      Konten Siap Terbit
                    </span>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span
                        v-for="ch in getPostChannels(record)"
                        :key="ch"
                        :class="getChannelBadgeClass(ch)"
                        class="px-2 py-0.5 text-[11px] font-bold rounded-md shadow-2xs inline-flex items-center gap-1"
                      >
                        <span>{{ getChannelIcon(ch) }}</span>
                        <span>{{ ch }}</span>
                      </span>
                      <span v-if="getPostChannels(record).length === 0" class="text-xs text-gray-400 italic">
                        -
                      </span>
                    </div>
                  </td>
                  <td class="px-5 py-4">
                    <span
                      :class="[
                        record.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        record.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400' :
                        record.status === 'In-Review' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400' :
                        'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border'
                      ]"
                    >
                      ● {{ record.status || 'Draft' }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-right" @click.stop>
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openModal('edit', record)" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800">
                        Edit
                      </button>
                      <button @click="deleteRecord(record.id)" class="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Live Feed Card Mockup Preview (4 Cols) -->
        <div class="lg:col-span-4 space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h4 class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <span>📱</span> Pratinjau Feed
              </h4>
              <!-- Tab Switcher Platform Dinamis -->
              <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-lg flex-wrap max-w-full">
                <button
                  v-for="ch in availablePreviewChannels"
                  :key="ch"
                  type="button"
                  @click="activePlatformPreview = ch"
                  :class="activePlatformPreview === ch ? 'bg-brand-500 text-white font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
                  class="px-2 py-0.5 rounded text-[11px] transition flex items-center gap-1"
                >
                  <span>{{ getChannelIcon(ch) }}</span>
                  <span>{{ ch }}</span>
                </button>
              </div>
            </div>

            <div v-if="!selectedPreviewPost && records.length === 0" class="py-12 text-center text-xs text-gray-400">
              Belum ada postingan untuk ditampilkan.
            </div>

            <!-- Feed Preview Card -->
            <div v-else class="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow"
                    :class="getChannelAvatarBg(activePlatformPreview)"
                  >
                    <span>{{ getChannelAvatarText(activePlatformPreview) }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <h5 class="text-sm font-bold text-gray-900 dark:text-white">ERP Corporation Official</h5>
                      <span class="text-blue-500 text-xs">✓</span>
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span>{{ getChannelIcon(activePlatformPreview) }}</span>
                      <span>{{ getChannelSubtitle(activePlatformPreview) }}</span>
                    </p>
                  </div>
                </div>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full uppercase text-[10px]" :class="selectedPreviewPost?.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'">
                  {{ selectedPreviewPost?.status || 'Draft' }}
                </span>
              </div>

              <!-- Konten Teks -->
              <div class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                {{ selectedPreviewPost?.message || (records[0]?.message) || 'Isi konten postingan promosi Anda akan muncul di sini...' }}
              </div>

              <!-- Foto / Banner Promosi (Render Nyata jika ada URL) -->
              <div v-if="selectedPreviewPost?.image_url" class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black/5 relative min-h-[160px] max-h-72 flex items-center justify-center">
                <img
                  :src="selectedPreviewPost.image_url"
                  :key="selectedPreviewPost.image_url"
                  alt="Banner Promosi"
                  class="w-full h-full object-cover max-h-72"
                  @error="onImageError"
                />
                <div v-if="isImageBroken" class="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4 text-center text-xs text-rose-500">
                  <span class="text-xl mb-1">⚠️</span>
                  <span class="font-bold">Gagal memuat gambar dari URL</span>
                  <span class="text-[10px] text-gray-400 mt-1 max-w-xs truncate">Pastikan URL berakhiran .jpg / .png / link gambar langsung (direct image link)</span>
                </div>
              </div>
              <div v-else class="rounded-xl bg-gray-200/70 dark:bg-gray-700/60 h-44 flex flex-col items-center justify-center text-gray-400 text-xs gap-1 border border-dashed border-gray-300 dark:border-gray-600">
                <span class="text-2xl">🖼️</span>
                <span>[ Foto / Gambar Konten Promosi ]</span>
                <span class="text-[10px] text-gray-400">Isi URL Gambar pada tombol Edit untuk menampilkan poster</span>
              </div>

              <!-- Interaksi Media Sosial Dinamis (Dihitung dari Estimasi Reach & Kanal) -->
              <div class="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                  {{ activePlatformPreview.toLowerCase().includes('twitter') || activePlatformPreview.toLowerCase().includes('x') ? `❤️ ${calcEngagement(selectedPreviewPost?.reach_count).likes} Suka` : `👍 ${calcEngagement(selectedPreviewPost?.reach_count).likes} Suka` }}
                </span>
                <span class="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                  💬 {{ calcEngagement(selectedPreviewPost?.reach_count).comments }} Komentar
                </span>
                <span class="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                  {{ activePlatformPreview.toLowerCase().includes('twitter') || activePlatformPreview.toLowerCase().includes('x') ? `🔁 ${calcEngagement(selectedPreviewPost?.reach_count).shares} Repost` : `🔗 ${calcEngagement(selectedPreviewPost?.reach_count).shares} Bagikan` }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tambah/Edit Postingan -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 my-8">
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📢</span> {{ modalMode === 'create' ? 'Buat Postingan Sosial Baru' : 'Edit Postingan Sosial' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
      </div>

      <form @submit.prevent="saveRecord" class="mt-4 space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Konten Pesan / Caption</label>
          <textarea v-model="formData.message" rows="4" placeholder="Tuliskan isi postingan promosi Anda..." required class="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
        </div>

        <!-- Input Banner Promosi: Opsi Upload File Lokal atau URL -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Foto / Banner Konten Promosi
          </label>

          <!-- Tab Pilihan: Upload File vs Tautan URL -->
          <div class="flex items-center gap-2 mb-1">
            <button
              type="button"
              @click="imageInputMode = 'upload'"
              :class="imageInputMode === 'upload' ? 'bg-brand-500 text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'"
              class="px-3 py-1 text-xs rounded-lg transition"
            >
              📁 Upload dari Komputer
            </button>
            <button
              type="button"
              @click="imageInputMode = 'url'"
              :class="imageInputMode === 'url' ? 'bg-brand-500 text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'"
              class="px-3 py-1 text-xs rounded-lg transition"
            >
              🔗 Tautan URL Gambar
            </button>
          </div>

          <!-- Mode 1: Upload File Langsung (Instant DataURL / Local Storage) -->
          <div v-if="imageInputMode === 'upload'" class="space-y-2">
            <div
              @click="triggerFileInput"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-500 dark:hover:border-brand-400 rounded-xl p-4 text-center cursor-pointer bg-gray-50/60 dark:bg-gray-800/60 transition group"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileUpload"
              />
              <div v-if="!formData.image_url" class="py-2 space-y-1">
                <span class="text-3xl block group-hover:scale-110 transition">📤</span>
                <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">Klik untuk memilih foto / banner dari laptop/HP Anda</p>
                <p class="text-[11px] text-gray-400">Mendukung JPG, PNG, WEBP (Otomatis tampil di feed)</p>
              </div>
              <div v-else class="flex items-center justify-between gap-3 bg-white dark:bg-gray-700/70 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                <img :src="formData.image_url" alt="Preview Thumbnail" class="h-12 w-12 object-cover rounded-lg shrink-0 border" />
                <div class="text-left overflow-hidden grow">
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">✓ Gambar Siap Digunakan</span>
                  <span class="text-[11px] text-gray-400 block truncate">Klik untuk mengganti gambar</span>
                </div>
                <button
                  type="button"
                  @click.stop="formData.image_url = ''"
                  class="text-rose-500 hover:text-rose-700 p-1 text-xs font-bold"
                  title="Hapus gambar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Mode 2: Tautan URL Gambar Langsung -->
          <div v-else class="space-y-1">
            <div class="relative flex items-center">
              <input
                v-model="formData.image_url"
                type="url"
                placeholder="https://images.unsplash.com/... atau link gambar langsung"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-8"
              />
              <button
                v-if="formData.image_url"
                type="button"
                @click="formData.image_url = ''"
                class="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
              >
                ✕
              </button>
            </div>
            <p class="text-[11px] text-gray-400">
              💡 <strong>Tips:</strong> Untuk Pinterest/Google, klik kanan gambar &rarr; pilih <em>"Salin Alamat Gambar" (Copy Image Address)</em>, bukan link halaman pin.
            </p>
          </div>
        </div>

        <!-- Pemilih Kanal Dinamis (Multi-Platform Enterprise) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Pilih Kanal Distribusi Media Sosial
            </label>
            <span class="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
              {{ formData.selected_channels.length }} Terpilih
            </span>
          </div>

          <!-- Pilihan Platform Populer & Custom -->
          <div class="flex flex-wrap gap-2">
            <div
              v-for="preset in availablePresetChannels"
              :key="preset"
              class="relative inline-flex items-center group"
            >
              <button
                type="button"
                @click="toggleChannel(preset)"
                :class="formData.selected_channels.includes(preset) ? 'bg-brand-500 text-white border-brand-500 font-bold shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-700/60 dark:text-gray-300 dark:border-gray-600'"
                class="px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>{{ getChannelIcon(preset) }}</span>
                <span>{{ preset }}</span>
                <span v-if="formData.selected_channels.includes(preset)" class="text-[10px] ml-0.5">✓</span>
              </button>

              <!-- Tombol Hapus Silang (✕) Khusus Kanal Custom Tambahan -->
              <button
                v-if="!defaultChannels.includes(preset)"
                type="button"
                @click.stop="removeCustomChannel(preset)"
                class="ml-1 -mr-0.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1 rounded-full text-xs font-bold transition"
                title="Hapus kanal custom ini"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Tambah Kanal Custom Tambahan -->
          <div class="mt-2 flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <input
              v-model="customChannelInput"
              type="text"
              placeholder="+ Ketik nama kanal baru (contoh: TikTok Shop, Threads, Telegram)..."
              @keydown.enter.prevent="addCustomChannel"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-750 dark:text-white"
            />
            <button
              type="button"
              @click.prevent="addCustomChannel"
              class="shrink-0 px-4 py-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1"
            >
              <span>+</span>
              <span>Tambah</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status Postingan</label>
            <select v-model="formData.status" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="Draft">Draft (Ide Awal)</option>
              <option value="In-Review">In-Review (Review Tim)</option>
              <option value="Scheduled">Scheduled (Terjadwal)</option>
              <option value="Published">Published (Sudah Terbit)</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Estimasi Reach</label>
            <input v-model.number="formData.reach_count" type="number" min="0" placeholder="0" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
        </div>

        <!-- Input Waktu Penjadwalan jika status Scheduled -->
        <div v-if="formData.status === 'Scheduled'" class="p-3.5 bg-blue-50/70 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 rounded-xl space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
            ⏰ Waktu Tayang Otomatis (Publish Date & Time)
          </label>
          <input
            v-model="formData.scheduled_at"
            type="datetime-local"
            required
            class="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-blue-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
          <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
            {{ isSaving ? 'Menyimpan...' : 'Simpan Postingan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { socialMarketingService } from '@/services/marketing/social.service'
import type { ISocialPostDto } from '@/types/marketing/social_marketing.dto'

const records = ref<ISocialPostDto[]>([])
const selectedPreviewPost = ref<ISocialPostDto | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const isSaving = ref(false)
const activePlatformPreview = ref<string>('Facebook')
const imageInputMode = ref<'upload' | 'url'>('upload')
const fileInputRef = ref<HTMLInputElement | null>(null)

// Daftar Kanal Default Sistem
const defaultChannels = [
  'Facebook',
  'Instagram',
  'Twitter / X',
  'LinkedIn',
  'TikTok',
  'Pinterest',
  'YouTube',
  'WhatsApp Channel',
  'Threads'
]

// Preset Kanal (Reactive Ref, mencakup default + custom)
const availablePresetChannels = ref<string[]>([...defaultChannels])
const customChannelInput = ref('')

const toggleChannel = (ch: string) => {
  const index = formData.value.selected_channels.indexOf(ch)
  if (index > -1) {
    if (formData.value.selected_channels.length > 1) {
      formData.value.selected_channels.splice(index, 1)
    } else {
      alert('Pilih minimal 1 kanal untuk publikasi!')
    }
  } else {
    formData.value.selected_channels.push(ch)
  }
}

const addCustomChannel = () => {
  const val = customChannelInput.value.trim()
  if (!val) return
  if (!formData.value.selected_channels.includes(val)) {
    formData.value.selected_channels.push(val)
  }
  if (!availablePresetChannels.value.includes(val)) {
    availablePresetChannels.value.push(val)
  }
  customChannelInput.value = ''
}

// Menghapus kanal custom dari daftar preset dan dari kanal terpilih
const removeCustomChannel = (ch: string) => {
  const presetIdx = availablePresetChannels.value.indexOf(ch)
  if (presetIdx > -1) {
    availablePresetChannels.value.splice(presetIdx, 1)
  }
  const selectedIdx = formData.value.selected_channels.indexOf(ch)
  if (selectedIdx > -1) {
    formData.value.selected_channels.splice(selectedIdx, 1)
  }
}

// Helpers untuk Ikon, Subtitle, Warna Badge & Avatar Kanal
const getChannelIcon = (ch?: string) => {
  if (!ch) return '📢'
  const c = ch.toLowerCase()
  if (c.includes('facebook') || c === 'fb') return '📘'
  if (c.includes('instagram') || c === 'ig') return '📸'
  if (c.includes('twitter') || c.includes('x')) return '🐦'
  if (c.includes('linkedin') || c === 'in') return '💼'
  if (c.includes('tiktok')) return '🎵'
  if (c.includes('pinterest')) return '📌'
  if (c.includes('youtube')) return '▶️'
  if (c.includes('whatsapp')) return '💬'
  if (c.includes('threads')) return '🧵'
  if (c.includes('telegram')) return '✈️'
  if (c.includes('discord')) return '🎮'
  return '🌐'
}

const getChannelBadgeClass = (ch?: string) => {
  if (!ch) return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  const c = ch.toLowerCase()
  if (c.includes('facebook') || c === 'fb') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
  if (c.includes('instagram') || c === 'ig') return 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300'
  if (c.includes('twitter') || c.includes('x')) return 'bg-gray-900 text-white dark:bg-gray-700 dark:text-white'
  if (c.includes('linkedin') || c === 'in') return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
  if (c.includes('tiktok')) return 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/40 dark:text-cyan-300'
  if (c.includes('pinterest')) return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
  if (c.includes('youtube')) return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  if (c.includes('whatsapp')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (c.includes('threads')) return 'bg-zinc-800 text-white dark:bg-zinc-700 dark:text-white'
  return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
}

const getChannelAvatarBg = (ch?: string) => {
  if (!ch) return 'bg-brand-500'
  const c = ch.toLowerCase()
  if (c.includes('facebook') || c === 'fb') return 'bg-blue-600'
  if (c.includes('instagram') || c === 'ig') return 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600'
  if (c.includes('twitter') || c.includes('x')) return 'bg-black text-white'
  if (c.includes('linkedin') || c === 'in') return 'bg-indigo-600'
  if (c.includes('tiktok')) return 'bg-black text-cyan-400'
  if (c.includes('pinterest')) return 'bg-rose-600'
  if (c.includes('youtube')) return 'bg-red-600'
  if (c.includes('whatsapp')) return 'bg-emerald-600'
  if (c.includes('threads')) return 'bg-black text-white'
  return 'bg-brand-600'
}

const getChannelAvatarText = (ch?: string) => {
  if (!ch) return 'ERP'
  const c = ch.toLowerCase()
  if (c.includes('facebook') || c === 'fb') return 'fb'
  if (c.includes('instagram') || c === 'ig') return 'IG'
  if (c.includes('twitter') || c.includes('x')) return '𝕏'
  if (c.includes('linkedin') || c === 'in') return 'in'
  if (c.includes('tiktok')) return 'TT'
  if (c.includes('pinterest')) return 'P'
  if (c.includes('youtube')) return 'YT'
  if (c.includes('whatsapp')) return 'WA'
  return ch.substring(0, 3).toUpperCase()
}

const getChannelSubtitle = (ch?: string) => {
  if (!ch) return 'Media Sosial Resmi'
  const c = ch.toLowerCase()
  if (c.includes('facebook') || c === 'fb') return 'Diposting ke Facebook Page'
  if (c.includes('instagram') || c === 'ig') return 'Instagram Feed & Stories'
  if (c.includes('twitter') || c.includes('x')) return '@ERP_Corp • Postingan Resmi'
  if (c.includes('linkedin') || c === 'in') return 'LinkedIn for Business Page'
  if (c.includes('tiktok')) return 'TikTok Video & Carousel Post'
  if (c.includes('pinterest')) return 'Pinterest Board & Idea Pin'
  if (c.includes('youtube')) return 'YouTube Community Post'
  if (c.includes('whatsapp')) return 'Saluran WhatsApp Bisnis'
  if (c.includes('threads')) return '@ERP_Corp di Threads'
  return `Publikasi Kanal ${ch}`
}

// Ekstraksi kanal dari sebuah post record (mendukung channels string atau legacy boolean)
const getPostChannels = (post?: ISocialPostDto | null): string[] => {
  if (!post) return []
  if (post.channels && post.channels.trim() !== '') {
    return post.channels.split(',').map(s => s.trim()).filter(Boolean)
  }
  const result: string[] = []
  if (post.post_to_facebook) result.push('Facebook')
  if (post.post_to_instagram) result.push('Instagram')
  if (post.post_to_twitter) result.push('Twitter / X')
  if (post.post_to_linkedin) result.push('LinkedIn')
  return result.length > 0 ? result : ['Facebook']
}

// Kanal yang dapat dipilih untuk pratinjau kartu sosial saat ini
const availablePreviewChannels = computed(() => {
  if (selectedPreviewPost.value) {
    const list = getPostChannels(selectedPreviewPost.value)
    if (list.length > 0) return list
  }
  return ['Facebook', 'Instagram', 'Twitter / X', 'LinkedIn']
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Harap pilih file gambar (JPG, PNG, WEBP, dll.)')
    return
  }

  // Maksimal ukuran 5MB untuk kenyamanan database & preview
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran gambar maksimal 5MB!')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    formData.value.image_url = (event.target?.result as string) || ''
    isImageBroken.value = false
  }
  reader.readAsDataURL(file)
}

const formData = ref<{
  id: number | null
  message: string
  image_url: string
  selected_channels: string[]
  status: 'Draft' | 'In-Review' | 'Scheduled' | 'Published'
  scheduled_at: string
  reach_count: number
}>({
  id: null,
  message: '',
  image_url: '',
  selected_channels: ['Facebook', 'Instagram'],
  status: 'Draft',
  scheduled_at: '',
  reach_count: 0
})

const isImageBroken = ref(false)

const onImageError = () => {
  isImageBroken.value = true
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
  } catch (e) {
    return dateStr
  }
}

// Menghitung interaksi sosial secara proporsional dari estimasi reach
const calcEngagement = (reach?: number) => {
  const baseReach = reach || 0
  if (baseReach <= 0) {
    return { likes: 0, comments: 0, shares: 0 }
  }
  // Formula interaksi industri rata-rata (3-5% likes, 0.5% komentar, 0.2% share)
  const likes = Math.max(1, Math.round(baseReach * 0.045))
  const comments = Math.max(0, Math.round(baseReach * 0.008))
  const shares = Math.max(0, Math.round(baseReach * 0.003))
  return { likes, comments, shares }
}

// Computations
const publishedCount = computed(() => records.value.filter(r => r.status === 'Published').length)
const scheduledCount = computed(() => records.value.filter(r => r.status === 'Scheduled').length)
const draftCount = computed(() => records.value.filter(r => r.status === 'Draft' || r.status === 'In-Review').length)
const totalReach = computed(() => records.value.reduce((acc, curr) => acc + (curr.reach_count || 0), 0))

const selectPost = (post: ISocialPostDto) => {
  selectedPreviewPost.value = post
  isImageBroken.value = false
  const channels = getPostChannels(post)
  if (channels.length > 0 && !channels.includes(activePlatformPreview.value)) {
    activePlatformPreview.value = channels[0]
  }
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await socialMarketingService.getAll()
    records.value = data || []
    if (records.value.length > 0 && !selectedPreviewPost.value) {
      selectPost(records.value[0])
    }
  } catch (err: any) {
    error.value = 'Gagal memuat data: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode: 'create' | 'edit', data: ISocialPostDto | null = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    const channels = getPostChannels(data)
    channels.forEach(ch => {
      if (!availablePresetChannels.value.includes(ch)) {
        availablePresetChannels.value.push(ch)
      }
    })
    formData.value = {
      id: data.id || null,
      message: data.message || '',
      image_url: data.image_url || '',
      selected_channels: channels.length > 0 ? [...channels] : ['Facebook', 'Instagram'],
      status: data.status || 'Draft',
      scheduled_at: data.scheduled_at ? data.scheduled_at.substring(0, 16) : '',
      reach_count: data.reach_count || 0
    }
  } else {
    formData.value = {
      id: null,
      message: '',
      image_url: '',
      selected_channels: ['Facebook', 'Instagram'],
      status: 'Draft',
      scheduled_at: '',
      reach_count: 0
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
    const channelsStr = formData.value.selected_channels.join(',')
    const payload = {
      id: formData.value.id || undefined,
      message: formData.value.message,
      image_url: formData.value.image_url,
      channels: channelsStr,
      // Backward compatibility flags
      post_to_facebook: formData.value.selected_channels.some(c => c.toLowerCase().includes('facebook')),
      post_to_instagram: formData.value.selected_channels.some(c => c.toLowerCase().includes('instagram')),
      post_to_twitter: formData.value.selected_channels.some(c => c.toLowerCase().includes('twitter') || c.toLowerCase().includes('x')),
      post_to_linkedin: formData.value.selected_channels.some(c => c.toLowerCase().includes('linkedin')),
      status: formData.value.status,
      reach_count: formData.value.reach_count,
      scheduled_at: formData.value.status === 'Scheduled' && formData.value.scheduled_at ? new Date(formData.value.scheduled_at).toISOString() : null
    }

    if (modalMode.value === 'edit' && formData.value.id) {
      await socialMarketingService.update(formData.value.id, payload)
    } else {
      await socialMarketingService.create(payload)
    }
    closeModal()
    await fetchData()
    // Pastikan postingan yang baru disimpan langsung terpilih di pratinjau feed
    if (payload.id) {
      const updated = records.value.find(r => r.id === payload.id)
      if (updated) selectPost(updated)
    } else if (records.value.length > 0) {
      selectPost(records.value[records.value.length - 1])
    }
  } catch (err: any) {
    alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteRecord = async (id?: number) => {
  if (!id) return
  if (!confirm('Hapus postingan sosial ini?')) return
  try {
    await socialMarketingService.delete(id)
    if (selectedPreviewPost.value?.id === id) {
      selectedPreviewPost.value = null
    }
    await fetchData()
  } catch (err: any) {
    alert('Gagal menghapus: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchData()
})
</script>
