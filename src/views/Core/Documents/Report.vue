<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Report Designer & Template Layout" />
        
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="activeTab = 'templates'"
            :class="activeTab === 'templates' ? 'bg-brand-500 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'"
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Template Cetak Dokumen
          </button>
          <button
            @click="activeTab = 'exports'"
            :class="activeTab === 'exports' ? 'bg-brand-500 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'"
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Pusat Ekspor Laporan Berkala
          </button>
        </div>
      </div>

      <!-- Overview Cards -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Template Layout Aktif</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{{ printTemplates.length }} Template</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Standard A4 & Continuous Form</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Engine Renderer</p>
              <h4 class="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">HTML5 to PDF</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-success-50 text-success-500 dark:bg-success-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Chromium Headless / Puppeteer Core</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Variabel Dinamis</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">48 Token</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Tagging Mustache/Handlebars Engine</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Format Ekspor</p>
              <h4 class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">PDF, XLSX, CSV</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Kompatibel Microsoft Excel & LibreOffice</p>
        </div>
      </div>

      <!-- TAB 1: Print Templates -->
      <div v-if="activeTab === 'templates'" class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-bold text-gray-800 dark:text-white text-base">Template Tata Letak Cetak Resmi</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Format cetak untuk faktur, slip gaji, surat jalan, dan pesanan pembelian</p>
            </div>
            <button
              @click="openAddTemplateModal"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Template Baru
            </button>
          </div>

          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Template</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Modul ERP</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ukuran Kertas</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Kop Surat</th>
                  <th class="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                <tr
                  v-for="tpl in printTemplates"
                  :key="tpl.id"
                  class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-base dark:bg-gray-800">
                        {{ tpl.icon }}
                      </div>
                      <div>
                        <span class="font-medium text-gray-900 dark:text-white text-sm block">{{ tpl.name }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ tpl.code }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {{ tpl.module }}
                    </span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-400">
                    {{ tpl.paper_size }} ({{ tpl.orientation }})
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300">
                    <span v-if="tpl.has_header" class="inline-flex items-center gap-1 text-success-600 font-medium">
                      ✓ Termasuk Logo & Alamat
                    </span>
                    <span v-else class="text-gray-400">Polos / Kertas Kop Sendiri</span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span
                      :class="tpl.is_default ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {{ tpl.is_default ? 'Default Aktif' : 'Alternatif' }}
                    </span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="previewTemplate(tpl)"
                        class="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        Pratinjau
                      </button>
                      <button
                        @click="customizeTemplate(tpl)"
                        class="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400"
                      >
                        Desain Variabel
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: Scheduled Exports -->
      <div v-if="activeTab === 'exports'" class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-bold text-gray-800 dark:text-white text-base">Pusat Unduhan & Laporan Eksekutif Berkala</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Generate data massal teragregasi untuk rapat pimpinan, perpajakan, dan audit</p>
            </div>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="rep in exportReports"
              :key="rep.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors gap-4"
            >
              <div class="flex items-start gap-3.5">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-lg">
                  {{ rep.icon }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ rep.title }}</h4>
                    <span class="rounded bg-gray-100 px-2 py-0.5 text-2xs font-mono font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {{ rep.frequency }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ rep.description }}</p>
                  <p class="text-2xs text-gray-400 mt-1">Terakhir diperbarui: {{ rep.last_run }} • Ukuran file rata-rata: {{ rep.size }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center">
                <button
                  @click="triggerExport(rep, 'XLSX')"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Unduh Excel (.xlsx)
                </button>
                <button
                  @click="triggerExport(rep, 'PDF')"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-500/10 dark:text-red-400"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Unduh PDF (.pdf)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Preview Template -->
  <Teleport to="body">
    <div v-if="previewingTemplate" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ previewingTemplate.name }}</h3>
            <p class="text-xs text-gray-500">Pratinjau Resolusi Cetak Standar A4</p>
          </div>
          <button @click="previewingTemplate = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Simulated Paper Sheet -->
        <div class="my-6 rounded-lg bg-white p-8 text-gray-800 shadow-lg border border-gray-200 mx-auto max-w-2xl font-sans text-xs">
          <!-- Kop Surat -->
          <div class="flex items-center justify-between border-b-2 border-gray-900 pb-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded bg-brand-500 flex items-center justify-center text-white font-bold text-xl">
                ERP
              </div>
              <div>
                <h2 class="text-base font-extrabold uppercase tracking-wide">PT NUSA MAJU BERSAMA</h2>
                <p class="text-2xs text-gray-500">Gedung Enterprise Tower Lt. 18, Jl. Sudirman Kav. 21, Jakarta Selatan</p>
                <p class="text-2xs text-gray-500">NPWP: 01.234.567.8-012.000 • Telp: (021) 555-0199 • support@company.com</p>
              </div>
            </div>
            <div class="text-right">
              <span class="inline-block rounded bg-gray-100 px-2 py-1 font-mono font-bold text-xs">
                {{ previewingTemplate.code }}
              </span>
            </div>
          </div>

          <!-- Content Mock -->
          <div class="space-y-4 py-2">
            <div class="flex justify-between">
              <div>
                <p class="font-bold text-gray-600">DITUJUKAN KEPADA:</p>
                <p class="font-semibold text-gray-900 mt-0.5">PT Mitra Logistik Nusantara</p>
                <p class="text-gray-500">Kawasan Industri MM2100, Cikarang Barat</p>
              </div>
              <div class="text-right">
                <p><span class="text-gray-500">Nomor Dokumen:</span> <span class="font-mono font-bold">DOC-2025-00892</span></p>
                <p><span class="text-gray-500">Tanggal:</span> <span>13 September 2025</span></p>
                <p><span class="text-gray-500">Status Pembayaran:</span> <span class="font-bold text-success-600">LUNAS</span></p>
              </div>
            </div>

            <!-- Table of items -->
            <table class="w-full border-collapse border border-gray-200 mt-4 text-xs">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-200 p-2 text-left">Deskripsi / Komponen</th>
                  <th class="border border-gray-200 p-2 text-center">Qty / Satuan</th>
                  <th class="border border-gray-200 p-2 text-right">Tarif Satuan</th>
                  <th class="border border-gray-200 p-2 text-right">Total (IDR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-200 p-2 font-medium">Layanan Pengadaan Material SCM Batch A-2</td>
                  <td class="border border-gray-200 p-2 text-center">10 Box</td>
                  <td class="border border-gray-200 p-2 text-right">Rp 2.500.000</td>
                  <td class="border border-gray-200 p-2 text-right">Rp 25.000.000</td>
                </tr>
                <tr>
                  <td class="border border-gray-200 p-2 font-medium">Jasa Distribusi Multi-Gudang Cikarang ke Surabaya</td>
                  <td class="border border-gray-200 p-2 text-center">1 Trip</td>
                  <td class="border border-gray-200 p-2 text-right">Rp 4.500.000</td>
                  <td class="border border-gray-200 p-2 text-right">Rp 4.500.000</td>
                </tr>
                <tr class="bg-gray-50 font-bold">
                  <td colspan="3" class="border border-gray-200 p-2 text-right">Subtotal DPP</td>
                  <td class="border border-gray-200 p-2 text-right">Rp 29.500.000</td>
                </tr>
                <tr class="bg-gray-50 font-bold">
                  <td colspan="3" class="border border-gray-200 p-2 text-right">PPN 11%</td>
                  <td class="border border-gray-200 p-2 text-right">Rp 3.245.000</td>
                </tr>
                <tr class="bg-gray-100 font-extrabold text-sm">
                  <td colspan="3" class="border border-gray-200 p-2 text-right">TOTAL TAGIHAN</td>
                  <td class="border border-gray-200 p-2 text-right text-brand-600">Rp 32.745.000</td>
                </tr>
              </tbody>
            </table>

            <!-- Signatures -->
            <div class="flex justify-between pt-8 text-center text-xs">
              <div>
                <p class="text-gray-500">Diterima & Disetujui,</p>
                <div class="h-16"></div>
                <p class="font-bold border-t border-gray-400 pt-1 px-4">( Bagian Purchasing )</p>
              </div>
              <div>
                <p class="text-gray-500">PT Nusa Maju Bersama,</p>
                <div class="h-16 flex items-center justify-center">
                  <span class="rounded border border-brand-500/30 px-2 py-0.5 text-2xs text-brand-600 font-mono">DIGITALLY SIGNED</span>
                </div>
                <p class="font-bold border-t border-gray-400 pt-1 px-4">Budi Santoso, SE, Ak</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            @click="previewingTemplate = null"
            class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Tutup
          </button>
          <button
            @click="printSimulation"
            class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Uji Cetak PDF
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal Desain Variabel -->
  <Teleport to="body">
    <div v-if="customizingTpl" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">
            Konfigurasi Variabel Dinamis: {{ customizingTpl.name }}
          </h3>
          <button @click="customizingTpl = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4 my-4">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Variabel di bawah ini dapat dimasukkan ke dalam kode template HTML dengan sintaks kurung kurawal ganda <code class="text-brand-500 font-mono font-bold">&#123;&#123; variabel &#125;&#125;</code>:
          </p>

          <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50 space-y-2">
            <div v-for="tag in availableTags" :key="tag.token" class="flex items-center justify-between text-xs py-1 border-b border-gray-200/60 dark:border-gray-700/60 last:border-b-0">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400">&#123;&#123; {{ tag.token }} &#125;&#125;</span>
              <span class="text-gray-600 dark:text-gray-300">{{ tag.label }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            @click="customizingTpl = null"
            class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600"
          >
            Tutup & Simpan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const activeTab = ref<'templates' | 'exports'>('templates')

const printTemplates = ref([
  { id: 1, name: 'Faktur Penjualan (Commercial Invoice A4)', code: 'TPL-INV-01', module: 'Finance & Sales', paper_size: 'A4', orientation: 'Portrait', has_header: true, is_default: true, icon: '🧾' },
  { id: 2, name: 'Slip Gaji Karyawan TER 2024 (Payslip)', code: 'TPL-PAY-02', module: 'HRD & Payroll', paper_size: 'A4 / Half', orientation: 'Portrait', has_header: true, is_default: true, icon: '💵' },
  { id: 3, name: 'Pesanan Pembelian Vendor (Purchase Order PO)', code: 'TPL-PO-03', module: 'Procurement SCM', paper_size: 'A4', orientation: 'Portrait', has_header: true, is_default: true, icon: '📋' },
  { id: 4, name: 'Surat Jalan / Bukti Pengiriman Barang (Delivery Order)', code: 'TPL-DO-04', module: 'Warehouse SCM', paper_size: 'Continuous 9.5x11"', orientation: 'Landscape', has_header: false, is_default: true, icon: '🚚' },
  { id: 5, name: 'Bukti Kas Keluar / Payment Voucher', code: 'TPL-VCH-05', module: 'Finance Cash', paper_size: 'A5', orientation: 'Landscape', has_header: true, is_default: true, icon: '🎫' },
  { id: 6, name: 'Form Penawaran Resmi (Quotation Letter)', code: 'TPL-QUO-06', module: 'Sales CRM', paper_size: 'A4', orientation: 'Portrait', has_header: true, is_default: true, icon: '💼' }
])

const exportReports = ref([
  {
    id: 1,
    title: 'Laporan Laba Rugi & Neraca Konsolidasi SAK',
    frequency: 'Bulanan / Kuartalan',
    description: 'Neraca lajur, arus kas operasional, dan performa profitabilitas bulanan.',
    last_run: '31 Agustus 2025',
    size: '1.4 MB',
    icon: '📈'
  },
  {
    id: 2,
    title: 'Rekapitulasi Absensi, Lembur & Potongan PPh 21 Karyawan',
    frequency: 'Bulanan (Periode 25-25)',
    description: 'Detail 248 pegawai aktif dengan tarif TER 2024, iuran BPJS TK & BPJS Kesehatan.',
    last_run: '01 September 2025',
    size: '890 KB',
    icon: '👥'
  },
  {
    id: 3,
    title: 'Laporan Mutasi Persediaan & Nilai Valuasi FIFO Gudang',
    frequency: 'Mingguan',
    description: 'Daftar pergerakan SKU keluar-masuk, safety stock, dan dead stock gudang Cikarang & Surabaya.',
    last_run: '08 September 2025',
    size: '2.8 MB',
    icon: '📦'
  },
  {
    id: 4,
    title: 'Ringkasan Pipeline Penjualan & Realisasi Omzet per Sales Rep',
    frequency: 'Mingguan',
    description: 'Konversi leads, win rate deal, dan target kuota revenue kuartal berjalan.',
    last_run: '12 September 2025',
    size: '620 KB',
    icon: '🎯'
  }
])

const availableTags = [
  { token: 'company_name', label: 'Nama Resmi Perusahaan (PT Nusa Maju Bersama)' },
  { token: 'company_address', label: 'Alamat Kantor Pusat & NPWP' },
  { token: 'invoice_number', label: 'Nomor Urut Faktur / Dokumen Unik' },
  { token: 'client_name', label: 'Nama Pelanggan / Rekanan Vendor' },
  { token: 'employee_name', label: 'Nama Lengkap Karyawan' },
  { token: 'employee_nik', label: 'Nomor Induk Karyawan (NIK)' },
  { token: 'total_amount', label: 'Total Nominal Bersih (Take Home Pay / DPP)' },
  { token: 'tax_amount', label: 'Nilai Pajak (PPN 11% / PPh 21 TER)' },
  { token: 'digital_signature', label: 'QR Code / Stempel Verifikasi Digital' }
]

const previewingTemplate = ref<any>(null)
const customizingTpl = ref<any>(null)

const openAddTemplateModal = () => {
  alert('Form Tambah Template Layout Baru siap dikonfigurasi.')
}

const previewTemplate = (tpl: any) => {
  previewingTemplate.value = tpl
}

const customizeTemplate = (tpl: any) => {
  customizingTpl.value = tpl
}

const printSimulation = () => {
  window.print()
}

const triggerExport = (rep: any, format: string) => {
  alert(`Memproses pembuatan laporan "${rep.title}" dalam format ${format}. Berkas akan otomatis terunduh...`)
}
</script>

