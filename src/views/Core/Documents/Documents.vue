<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Dokumen & Arsip Digital (DMS)" />
        
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Dokumen
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Arsip Dokumen</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{{ documentsList.length }} Berkas</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Tersinkronisasi ke S3 Bucket DMS</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Legal & Perizinan</p>
              <h4 class="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">Tervalidasi</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-success-50 text-success-500 dark:bg-success-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">NIB, NPWP, Akta Notaris & ISO 27001</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Kapasitas Terpakai</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">28.2 MB</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Dari alokasi kuota 100 GB</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Audit Trail Keamanan</p>
              <h4 class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">256-bit AES</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Enkripsi REST & Hak Akses Berbasis Role</p>
        </div>
      </div>

      <!-- Main Layout: Sidebar Categories + Document List -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <!-- Category Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Folder & Klasifikasi
            </h3>
            <div class="space-y-1">
              <button
                v-for="cat in categories"
                :key="cat.name"
                @click="selectedCategory = cat.name"
                :class="selectedCategory === cat.name ? 'bg-brand-50 text-brand-600 font-semibold dark:bg-brand-500/10 dark:text-brand-400' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'"
                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left"
              >
                <div class="flex items-center gap-2.5">
                  <span class="text-base">{{ cat.icon }}</span>
                  <span>{{ cat.name }}</span>
                </div>
                <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {{ cat.count }}
                </span>
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Format Berkas
            </h3>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="fmt in ['Semua', 'PDF', 'DOCX', 'XLSX']"
                :key="fmt"
                @click="selectedFormat = fmt"
                :class="selectedFormat === fmt ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'"
                class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              >
                {{ fmt }}
              </button>
            </div>
          </div>
        </div>

        <!-- Document Table / Grid -->
        <div class="lg:col-span-3">
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <!-- Search bar -->
            <div class="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <div class="relative w-full sm:w-80">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari judul berkas, tag, atau nomor..."
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Menampilkan {{ filteredDocuments.length }} arsip dokumen
              </div>
            </div>

            <!-- Documents Table -->
            <div class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead class="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Dokumen & Versi</th>
                    <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kategori</th>
                    <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ukuran & Format</th>
                    <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hak Akses</th>
                    <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Terakhir Diperbarui</th>
                    <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                  <tr v-if="filteredDocuments.length === 0">
                    <td colspan="6" class="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Tidak ada dokumen yang sesuai dengan filter.
                    </td>
                  </tr>
                  <tr
                    v-for="doc in filteredDocuments"
                    :key="doc.id"
                    class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg" :class="getFileIconBg(doc.file_type)">
                          {{ getFileEmoji(doc.file_type) }}
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-900 dark:text-white text-sm hover:text-brand-500 cursor-pointer" @click="previewDocument(doc)">
                              {{ doc.title }}
                            </span>
                            <span class="rounded bg-gray-100 px-1.5 py-0.2 text-2xs font-mono font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              {{ doc.version }}
                            </span>
                          </div>
                          <span class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ doc.description }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {{ doc.category }}
                      </span>
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap text-xs font-mono text-gray-600 dark:text-gray-400">
                      {{ doc.size }} • {{ doc.file_type }}
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap">
                      <span
                        :class="getClearanceBadgeClass(doc.access_level)"
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      >
                        {{ doc.access_level }}
                      </span>
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      <div>{{ doc.updated_at }}</div>
                      <div class="text-2xs text-gray-400">oleh {{ doc.author }}</div>
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          @click="previewDocument(doc)"
                          class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-gray-800"
                          title="Preview Berkas"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          @click="downloadDocument(doc)"
                          class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-success-600 dark:text-gray-400 dark:hover:bg-gray-800"
                          title="Unduh Berkas"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button
                          @click="deleteDocument(doc.id)"
                          class="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10"
                          title="Hapus Dokumen"
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
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Upload Dokumen Baru -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="mb-5 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Upload Dokumen ke Arsip DMS
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveDocument" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Dokumen</label>
            <input
              v-model="formData.title"
              type="text"
              required
              placeholder="Contoh: Akta Perubahan Notaris 2025"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori / Folder</label>
              <select
                v-model="formData.category"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Legalitas & Perizinan">Legalitas & Perizinan</option>
                <option value="SOP & Kebijakan HR">SOP & Kebijakan HR</option>
                <option value="Kontrak & PKWT">Kontrak & PKWT</option>
                <option value="Finance & Pajak">Finance & Pajak</option>
                <option value="SCM & Logistik">SCM & Logistik</option>
                <option value="Umum">Umum</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Hak Akses</label>
              <select
                v-model="formData.access_level"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Semua Karyawan">Semua Karyawan</option>
                <option value="HR Only">HR Only</option>
                <option value="Finance Only">Finance Only</option>
                <option value="Superadmin Only">Superadmin Only</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Versi Dokumen</label>
              <input
                v-model="formData.version"
                type="text"
                placeholder="v1.0"
                class="w-full font-mono rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tipe Ekstensi</label>
              <select
                v-model="formData.file_type"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
            <textarea
              v-model="formData.description"
              rows="2"
              placeholder="Catatan isi atau tujuan dokumen..."
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

          <!-- Drag and drop zone -->
          <div class="rounded-xl border-2 border-dashed border-gray-300 p-4 text-center dark:border-gray-700 hover:border-brand-400">
            <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-1 text-xs text-gray-600 dark:text-gray-400 font-medium">Klik untuk memilih berkas atau geser berkas ke sini</p>
            <p class="text-2xs text-gray-400">PDF, DOCX, XLSX hingga 25 MB</p>
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
              {{ isSaving ? 'Mengunggah...' : 'Simpan ke DMS' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Preview Dokumen -->
  <Teleport to="body">
    <div v-if="previewDoc" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" :class="getFileIconBg(previewDoc.file_type)">
              {{ getFileEmoji(previewDoc.file_type) }}
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ previewDoc.title }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Versi {{ previewDoc.version }} • {{ previewDoc.size }} • {{ previewDoc.category }}
              </p>
            </div>
          </div>
          <button @click="previewDoc = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="my-6 rounded-xl bg-gray-50 p-6 text-center border border-gray-100 dark:border-gray-800 dark:bg-gray-800/40">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Pratinjau Berkas Terproteksi</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
            Dokumen ini dienkripsi dengan standar AES-256 Cloud Storage. Akses tercatat otomatis di Jejak Audit Sistem.
          </p>
        </div>

        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div class="text-xs text-gray-500">
            Diunggah oleh <span class="font-semibold text-gray-700 dark:text-gray-300">{{ previewDoc.author }}</span> pada {{ previewDoc.updated_at }}
          </div>
          <div class="flex gap-2">
            <button
              @click="previewDoc = null"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Tutup
            </button>
            <button
              @click="downloadDocument(previewDoc)"
              class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Salinan Asli
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { documentsService } from '@/services/core/documents.service'

interface IDocumentRecord {
  id: number
  title: string
  description: string
  category: string
  file_type: 'PDF' | 'DOCX' | 'XLSX'
  size: string
  version: string
  access_level: 'Semua Karyawan' | 'HR Only' | 'Finance Only' | 'Superadmin Only'
  author: string
  updated_at: string
}

const defaultDocuments: IDocumentRecord[] = [
  {
    id: 1,
    title: 'Akta Pendirian & NIB Perusahaan 2024.pdf',
    description: 'Dokumen legalitas resmi perseroan terbatas, NPWP, dan izin operasional BKPM.',
    category: 'Legalitas & Perizinan',
    file_type: 'PDF',
    size: '4.2 MB',
    version: 'v2.0',
    access_level: 'Superadmin Only',
    author: 'Legal Counsel',
    updated_at: '12 Jan 2025'
  },
  {
    id: 2,
    title: 'Perjanjian Kerja Bersama (PKB) & Pedoman Disiplin Pegawai.pdf',
    description: 'Buku saku aturan ketenagakerjaan, jam operasional kantor & pabrik, serta sanksi disipliner.',
    category: 'SOP & Kebijakan HR',
    file_type: 'PDF',
    size: '1.8 MB',
    version: 'v3.1',
    access_level: 'Semua Karyawan',
    author: 'HR Dept',
    updated_at: '02 Feb 2025'
  },
  {
    id: 3,
    title: 'Template Kontrak Kerja Karyawan PKWT Standard 2025.docx',
    description: 'Draft perjanjian kerja waktu tertentu sesuai PP No 35 Tahun 2021 ketenagakerjaan.',
    category: 'Kontrak & PKWT',
    file_type: 'DOCX',
    size: '280 KB',
    version: 'v1.4',
    access_level: 'HR Only',
    author: 'HR People Ops',
    updated_at: '15 Feb 2025'
  },
  {
    id: 4,
    title: 'Kebijakan Reimbursement Rawat Jalan & Dinas Luar Kota.pdf',
    description: 'Petunjuk teknis plafon rawat jalan medis, kacamata, dan uang saku perjalanan dinas.',
    category: 'SOP & Kebijakan HR',
    file_type: 'PDF',
    size: '950 KB',
    version: 'v2.0',
    access_level: 'Semua Karyawan',
    author: 'HR & Finance',
    updated_at: '20 Jan 2025'
  },
  {
    id: 5,
    title: 'Laporan Audit Keuangan Tahunan (KAP Ernst & Tan) 2024.pdf',
    description: 'Opini wajar tanpa pengecualian laporan laba rugi, neraca, dan arus kas konsolidasi.',
    category: 'Finance & Pajak',
    file_type: 'PDF',
    size: '12.5 MB',
    version: 'v1.0',
    access_level: 'Finance Only',
    author: 'Senior Accounting',
    updated_at: '28 Feb 2025'
  },
  {
    id: 6,
    title: 'Master Service Agreement Supplier Logistik Cikarang.pdf',
    description: 'Kontrak jangka panjang penyedia armada ekspedisi gudang bahan baku.',
    category: 'SCM & Logistik',
    file_type: 'PDF',
    size: '3.1 MB',
    version: 'v1.0',
    access_level: 'Superadmin Only',
    author: 'Procurement Lead',
    updated_at: '05 Jan 2025'
  },
  {
    id: 7,
    title: 'Sertifikasi ISO 9001:2015 & ISO 27001 Keamanan Informasi.pdf',
    description: 'Audit sertifikasi sistem manajemen mutu dan keamanan siber ERP tingkat enterprise.',
    category: 'Legalitas & Perizinan',
    file_type: 'PDF',
    size: '5.4 MB',
    version: 'v1.2',
    access_level: 'Semua Karyawan',
    author: 'IT Security Lead',
    updated_at: '10 Feb 2025'
  }
]

const documentsList = ref<IDocumentRecord[]>([...defaultDocuments])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('Semua Dokumen')
const selectedFormat = ref('Semua')

// Modal state
const isModalOpen = ref(false)
const isSaving = ref(false)
const previewDoc = ref<IDocumentRecord | null>(null)
const formData = ref<Partial<IDocumentRecord>>({
  title: '',
  description: '',
  category: 'Legalitas & Perizinan',
  file_type: 'PDF',
  access_level: 'Semua Karyawan',
  version: 'v1.0'
})

const categories = computed(() => [
  { name: 'Semua Dokumen', icon: '📁', count: documentsList.value.length },
  { name: 'Legalitas & Perizinan', icon: '⚖️', count: documentsList.value.filter(d => d.category === 'Legalitas & Perizinan').length },
  { name: 'SOP & Kebijakan HR', icon: '👥', count: documentsList.value.filter(d => d.category === 'SOP & Kebijakan HR').length },
  { name: 'Kontrak & PKWT', icon: '📝', count: documentsList.value.filter(d => d.category === 'Kontrak & PKWT').length },
  { name: 'Finance & Pajak', icon: '📊', count: documentsList.value.filter(d => d.category === 'Finance & Pajak').length },
  { name: 'SCM & Logistik', icon: '📦', count: documentsList.value.filter(d => d.category === 'SCM & Logistik').length }
])

const filteredDocuments = computed(() => {
  return documentsList.value.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCat =
      selectedCategory.value === 'Semua Dokumen' || doc.category === selectedCategory.value
    const matchesFmt =
      selectedFormat.value === 'Semua' || doc.file_type === selectedFormat.value

    return matchesSearch && matchesCat && matchesFmt
  })
})

const getFileEmoji = (type: string) => {
  switch (type) {
    case 'PDF': return '📄'
    case 'DOCX': return '📘'
    case 'XLSX': return '📗'
    default: return '📄'
  }
}

const getFileIconBg = (type: string) => {
  switch (type) {
    case 'PDF': return 'bg-red-50 text-red-500 dark:bg-red-500/10'
    case 'DOCX': return 'bg-blue-50 text-blue-500 dark:bg-blue-500/10'
    case 'XLSX': return 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10'
    default: return 'bg-gray-100 text-gray-500 dark:bg-gray-800'
  }
}

const getClearanceBadgeClass = (level: string) => {
  switch (level) {
    case 'Semua Karyawan': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
    case 'HR Only': return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
    case 'Finance Only': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
    case 'Superadmin Only': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const data = await documentsService.getAll()
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((sDoc: any) => {
        const exists = documentsList.value.some(d => d.id === sDoc.id)
        if (!exists) {
          documentsList.value.unshift({
            id: sDoc.id,
            title: sDoc.title || sDoc.name || 'Dokumen Baru',
            description: sDoc.description || 'Diunggah via DMS',
            category: sDoc.category || 'Umum',
            file_type: 'PDF',
            size: '1.2 MB',
            version: 'v1.0',
            access_level: 'Semua Karyawan',
            author: 'Admin',
            updated_at: 'Baru saja'
          })
        }
      })
    }
  } catch (err: any) {
    console.warn('Using DMS default records:', err.message)
  } finally {
    isLoading.value = false
  }
}

const openModal = (_mode: 'create' | 'edit') => {
  formData.value = {
    title: '',
    description: '',
    category: 'Legalitas & Perizinan',
    file_type: 'PDF',
    access_level: 'Semua Karyawan',
    version: 'v1.0'
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveDocument = async () => {
  isSaving.value = true
  try {
    const newDoc: IDocumentRecord = {
      id: Date.now(),
      title: formData.value.title || 'Dokumen Tanpa Judul',
      description: formData.value.description || '-',
      category: formData.value.category || 'Umum',
      file_type: (formData.value.file_type as any) || 'PDF',
      size: '2.4 MB',
      version: formData.value.version || 'v1.0',
      access_level: (formData.value.access_level as any) || 'Semua Karyawan',
      author: 'Superadmin',
      updated_at: 'Hari ini'
    }
    documentsList.value.unshift(newDoc)
    closeModal()
  } finally {
    isSaving.value = false
  }
}

const previewDocument = (doc: IDocumentRecord) => {
  previewDoc.value = doc
}

const downloadDocument = (doc: IDocumentRecord) => {
  alert(`Mengunduh berkas: ${doc.title} (${doc.size})`)
}

const deleteDocument = (id: number) => {
  if (confirm('Hapus dokumen ini dari arsip digital?')) {
    documentsList.value = documentsList.value.filter(d => d.id !== id)
  }
}

onMounted(() => {
  fetchData()
})
</script>

