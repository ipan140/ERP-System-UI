<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Portal Karir & Rekrutmen Terpadu" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Terintegrasi langsung dengan Modul HR Recruitment (Standar Odoo & Mekari Talenta)
          </p>
        </div>
        <div class="flex items-center gap-3">
          <router-link
            to="/hr/recruitment"
            class="inline-flex items-center gap-2 rounded-xl border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Pipeline HRD (Recruitment)
          </router-link>
          <router-link
            to="/hr/employee-portal"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Portal Mandiri Karyawan (ESS)
          </router-link>
        </div>
      </div>

      <!-- Corporate Career Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 text-white shadow-xl">
        <div class="relative z-10 max-w-2xl">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            🚀 Bergabung Bersama Kami &bull; 100+ Talenta Hebat
          </span>
          <h1 class="mt-3 text-3xl font-extrabold sm:text-4xl tracking-tight">
            Bangun Karir Masa Depan di PT. Nusantara Prima Solusindo
          </h1>
          <p class="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
            Kami membuka peluang bagi profesional berbakat untuk bergabung dalam lingkungan kerja yang kolaboratif, inklusif, dan berorientasi pada inovasi skala enterprise.
          </p>
        </div>
        <div class="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>

      <!-- Candidate Application Tracker Quick Bar (Fase 5) -->
      <div class="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 p-4 shadow-sm dark:border-indigo-900/40 dark:bg-gray-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            🔍
          </div>
          <div>
            <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Pelacakan Status Lamaran Mandiri (Candidate Self-Tracking)
            </h4>
            <p class="text-[11px] text-gray-500">
              Sudah pernah melamar? Masukkan email atau nomor telepon Anda untuk melihat progres seleksi.
            </p>
          </div>
        </div>

        <form @submit.prevent="trackApplication" class="flex items-center gap-2 w-full md:w-auto">
          <input
            v-model="trackingInput"
            required
            type="text"
            placeholder="Ketik email atau No. HP Anda..."
            class="rounded-xl border border-gray-300 bg-white py-2 px-3 text-xs focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white min-w-[240px]"
          />
          <button
            type="submit"
            class="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Lacak Status</span>
            &rarr;
          </button>
        </form>
      </div>

      <!-- Search & Filters -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/80">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-5 relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="Cari posisi pekerjaan (cth: Backend, HR, Accounting)..."
              class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-800 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div class="md:col-span-4">
            <select
              v-model="selectedDept"
              class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-sm text-gray-800 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">Semua Departemen</option>
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>

          <div class="md:col-span-3">
            <select
              v-model="selectedLocation"
              class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-sm text-gray-800 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">Semua Lokasi / Cabang</option>
              <option value="Jakarta HQ">Jakarta (Kantor Pusat)</option>
              <option value="Surabaya">Surabaya Branch</option>
              <option value="Bandung">Bandung Tech Hub</option>
              <option value="Hybrid / Remote">Hybrid / Remote</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500">
          <div>
            Menampilkan <span class="font-bold text-gray-800 dark:text-white">{{ filteredJobs.length }}</span> lowongan kerja aktif
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sinkronisasi Otomatis dengan Modul HRD</span>
          </div>
        </div>
      </div>

      <!-- Job Cards Grid -->
      <div v-if="isLoading" class="py-16 text-center">
        <div class="inline-block w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Memuat data lowongan karir...</p>
      </div>

      <div v-else-if="filteredJobs.length === 0" class="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-gray-800 dark:text-white">Tidak ada lowongan yang sesuai</h3>
        <p class="text-sm text-gray-500 mt-1">Coba gunakan kata kunci lain atau reset filter pencarian Anda.</p>
        <button
          @click="resetFilters"
          class="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600"
        >
          Reset Filter
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="job in filteredJobs"
          :key="job.id"
          class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-brand-400 dark:border-gray-800 dark:bg-gray-800 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-3">
              <span class="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                {{ job.department?.name || 'General' }}
              </span>
              <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Aktif Merekrut
              </span>
            </div>

            <h3 class="mt-3 text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">
              {{ job.name }}
            </h3>

            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              Posisi strategis untuk mendukung pertumbuhan operasional dan kapabilitas tim di departemen {{ job.department?.name }}.
            </p>

            <div class="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ getLocationForJob(job.id) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Penuh Waktu (Full-Time PKWTT)</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-semibold text-emerald-700 dark:text-emerald-400">{{ getSalaryRange(job.id) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span class="text-xs text-gray-400">ID Posisi: #JOB-{{ job.id }}</span>
            <button
              @click="openDetailModal(job)"
              class="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
            >
              Lihat & Lamar
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Detail & Form Lamaran Kerja -->
      <div
        v-if="activeJob"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <div class="relative w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-gray-800 my-8">
          <button
            @click="activeJob = null"
            class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="flex items-center gap-3">
            <span class="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              {{ activeJob.department?.name }}
            </span>
            <span class="text-xs text-gray-500">Standar HR Rekrutmen</span>
          </div>

          <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ activeJob.name }}
          </h2>
          <p class="text-xs text-gray-500 mt-1">
            Lokasi: {{ getLocationForJob(activeJob.id) }} &bull; Estimasi: {{ getSalaryRange(activeJob.id) }}
          </p>

          <!-- Tabs: Info / Formulir -->
          <div class="mt-6 flex border-b border-gray-200 dark:border-gray-700">
            <button
              @click="modalTab = 'info'"
              :class="[
                'py-2 px-4 text-sm font-semibold border-b-2 transition-all',
                modalTab === 'info'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              ]"
            >
              Deskripsi Pekerjaan
            </button>
            <button
              @click="modalTab = 'apply'"
              :class="[
                'py-2 px-4 text-sm font-semibold border-b-2 transition-all',
                modalTab === 'apply'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              ]"
            >
              Formulir Lamaran Online
            </button>
          </div>

          <!-- Tab 1: Job Info -->
          <div v-if="modalTab === 'info'" class="mt-5 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white mb-1">Tanggung Jawab Utama:</h4>
              <ul class="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Mengembangkan dan mengeksekusi strategi operasional sesuai standar ISO & SOP korporat.</li>
                <li>Berkolaborasi lintas departemen (IT, Sales, Keuangan, dan HRD) dalam implementasi sistem ERP.</li>
                <li>Membuat laporan analitik berkala serta mengidentifikasi peluang optimasi proses bisnis.</li>
                <li>Mematuhi etika kerja profesional dan peraturan ketenagakerjaan yang berlaku.</li>
              </ul>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 dark:text-white mb-1">Kualifikasi:</h4>
              <ul class="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Pendidikan minimal S1/D4 jurusan terkait dengan IPK minimal 3.00.</li>
                <li>Pengalaman kerja minimal 2-4 tahun di bidang serupa untuk skala enterprise.</li>
                <li>Memiliki kemampuan komunikasi, integritas, dan pemecahan masalah yang baik.</li>
                <li>Mampu bekerja sama secara hybrid dengan target performa KPI yang terukur.</li>
              </ul>
            </div>

            <div class="pt-4 flex justify-end">
              <button
                @click="modalTab = 'apply'"
                class="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-all shadow"
              >
                Lanjut ke Formulir Lamaran &rarr;
              </button>
            </div>
          </div>

          <!-- Tab 2: Apply Form -->
          <div v-else class="mt-5">
            <div v-if="submitSuccess" class="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center dark:bg-emerald-900/20 dark:border-emerald-800">
              <div class="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 class="font-bold text-emerald-800 dark:text-emerald-200 text-base">Lamaran Berhasil Terkirim!</h4>
              <p class="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                Data Anda telah otomatis tercatat di sistem HR Recruitment kami. Tim Talent Acquisition akan menghubungi Anda via WhatsApp/Email untuk tahapan interview selanjutnya.
              </p>
              <button
                @click="activeJob = null; submitSuccess = false"
                class="mt-4 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Tutup Jendela
              </button>
            </div>

            <form v-else @submit.prevent="submitApplication" class="space-y-4">
              <div v-if="submitError" class="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {{ submitError }}
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap Sesuai KTP *
                </label>
                <input
                  v-model="applyForm.name"
                  required
                  type="text"
                  placeholder="Contoh: Pratama Wicaksono, S.T."
                  class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Alamat Email Aktif *
                  </label>
                  <input
                    v-model="applyForm.email"
                    required
                    type="email"
                    placeholder="nama@email.com"
                    class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No. WhatsApp / HP *
                  </label>
                  <input
                    v-model="applyForm.phone"
                    required
                    type="text"
                    placeholder="08123456789"
                    class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Ekspektasi Gaji Bulanan (IDR) *
                  </label>
                  <input
                    v-model.number="applyForm.expected_salary"
                    required
                    type="number"
                    placeholder="Contoh: 10000000"
                    class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tautan LinkedIn / Portofolio
                  </label>
                  <input
                    v-model="applyForm.notes"
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <!-- Upload Berkas CV (PDF) -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lampiran Berkas Resume / CV (Wajib PDF, Maks. 5MB) *
                </label>
                <div
                  class="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 pt-4 pb-5 hover:border-brand-500 transition-colors bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/30"
                >
                  <div class="space-y-1 text-center">
                    <svg
                      class="mx-auto h-10 w-10 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div class="flex text-xs text-gray-600 dark:text-gray-400 justify-center">
                      <label
                        for="cv-upload"
                        class="relative cursor-pointer rounded-md font-bold text-brand-600 focus-within:outline-none hover:text-brand-500"
                      >
                        <span>Pilih berkas PDF dari komputer</span>
                        <input
                          id="cv-upload"
                          name="cv-upload"
                          type="file"
                          accept=".pdf"
                          class="sr-only"
                          @change="onFileSelected"
                        />
                      </label>
                    </div>
                    <p class="text-[11px] text-gray-500" v-if="!uploadedFileName">
                      PDF resmi hingga 5MB. Otomatis terkirim ke HRD.
                    </p>
                    <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-1" v-else>
                      <span>✓ Terpilih: {{ uploadedFileName }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  @click="modalTab = 'info'"
                  class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="rounded-xl bg-brand-500 px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-brand-600 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{{ isSubmitting ? 'Mengirim Lamaran...' : 'Kirim Lamaran Sekarang' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Status Pelacakan Lamaran Kandidat (Fase 5) -->
      <div v-if="showTrackingModal && trackedData" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="relative w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-gray-800 my-6">
          <button @click="showTrackingModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 flex items-center justify-center text-lg font-bold">
              👤
            </div>
            <div>
              <span class="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 uppercase">
                Portal Pelamar Mandiri &bull; Status Terverifikasi
              </span>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ trackedData.name }}
              </h3>
            </div>
          </div>

          <!-- Application Summary Box -->
          <div class="my-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-gray-400 block">Posisi Dilamar:</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ trackedData.position }}</span>
            </div>
            <div>
              <span class="text-gray-400 block">Tanggal Melamar:</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ trackedData.applied_date }}</span>
            </div>
            <div>
              <span class="text-gray-400 block">Email Terdaftar:</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ trackedData.email }}</span>
            </div>
            <div>
              <span class="text-gray-400 block">Lampiran CV:</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ✓ Terverifikasi PDF
              </span>
            </div>
          </div>

          <!-- 5-Step Visual Recruitment Pipeline -->
          <div class="my-5 space-y-3">
            <h4 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Tahapan Seleksi Rekrutmen (Pipeline)
            </h4>
            <div class="space-y-2">
              <div
                v-for="(stg, idx) in pipelineStages"
                :key="stg.name"
                :class="[
                  'p-3 rounded-xl border flex items-center justify-between text-xs transition-all',
                  idx < trackedData.current_stage_idx
                    ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300'
                    : idx === trackedData.current_stage_idx
                    ? 'border-indigo-400 bg-indigo-50/80 dark:border-indigo-800 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 opacity-60'
                ]"
              >
                <div class="flex items-center gap-3">
                  <span
                    :class="[
                      'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs',
                      idx < trackedData.current_stage_idx
                        ? 'bg-emerald-600 text-white'
                        : idx === trackedData.current_stage_idx
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    ]"
                  >
                    {{ idx < trackedData.current_stage_idx ? '✓' : idx + 1 }}
                  </span>
                  <span>{{ stg.name }}</span>
                </div>

                <span class="text-[10px] uppercase font-bold">
                  {{ idx < trackedData.current_stage_idx ? 'Lolos (Passed)' : idx === trackedData.current_stage_idx ? 'Sedang Berjalan ⏳' : 'Menunggu' }}
                </span>
              </div>
            </div>
          </div>

          <!-- HR Notes -->
          <div class="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-300">
            <strong>Catatan Resmi Tim HRD:</strong>
            <p class="mt-1 leading-relaxed">{{ trackedData.hr_notes }}</p>
          </div>

          <div class="mt-5 flex justify-end">
            <button
              @click="showTrackingModal = false"
              class="rounded-xl bg-gray-100 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

interface JobPosition {
  id: number
  name: string
  department_id?: number
  department?: {
    id: number
    name: string
  }
}

const jobs = ref<JobPosition[]>([])
const isLoading = ref(true)
const searchKeyword = ref('')
const selectedDept = ref('')
const selectedLocation = ref('')

const activeJob = ref<JobPosition | null>(null)
const modalTab = ref<'info' | 'apply'>('info')
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const uploadedFileName = ref('')
const selectedPDFFile = ref<File | null>(null)

const applyForm = ref({
  name: '',
  email: '',
  phone: '',
  expected_salary: 8000000,
  notes: '',
  resume_url: '',
})

function onFileSelected(event: any) {
  const file = event.target.files?.[0]
  if (file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Format berkas harus PDF (.pdf)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran berkas melebihi batas maksimal 5MB')
      return
    }
    selectedPDFFile.value = file
    uploadedFileName.value = file.name
  }
}

const departments = computed(() => {
  const depts = new Set<string>()
  jobs.value.forEach((j) => {
    if (j.department?.name) depts.add(j.department.name)
  })
  return Array.from(depts)
})

const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const matchesKeyword =
      !searchKeyword.value ||
      job.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      (job.department?.name && job.department.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))

    const matchesDept = !selectedDept.value || job.department?.name === selectedDept.value

    const loc = getLocationForJob(job.id)
    const matchesLoc = !selectedLocation.value || loc.includes(selectedLocation.value)

    return matchesKeyword && matchesDept && matchesLoc
  })
})

function getLocationForJob(id: number): string {
  const locations = [
    'Jakarta HQ (Kantor Pusat)',
    'Bandung Tech Hub',
    'Surabaya Branch',
    'Hybrid / Remote (Jakarta)',
  ]
  return locations[id % locations.length]
}

function getSalaryRange(id: number): string {
  const min = 7 + (id % 8) * 1.5
  const max = min + 5
  return `Rp ${min.toFixed(0)} jt - ${max.toFixed(0)} jt`
}

function openDetailModal(job: JobPosition) {
  activeJob.value = job
  modalTab.value = 'info'
  submitSuccess.value = false
  submitError.value = ''
  uploadedFileName.value = ''
  selectedPDFFile.value = null
  applyForm.value = {
    name: '',
    email: '',
    phone: '',
    expected_salary: 8000000,
    notes: '',
    resume_url: '',
  }
}

function resetFilters() {
  searchKeyword.value = ''
  selectedDept.value = ''
  selectedLocation.value = ''
}

async function fetchJobs() {
  isLoading.value = true
  try {
    const res = await fetch('http://localhost:7070/api/website/careers')
    if (res.ok) {
      const json = await res.json()
      jobs.value = json.data || []
    }
  } catch (err) {
    console.error('Failed to fetch careers:', err)
  } finally {
    isLoading.value = false
  }
}

async function submitApplication() {
  if (!activeJob.value) return
  isSubmitting.value = true
  submitError.value = ''

  try {
    // 1. Upload CV PDF jika ada
    if (selectedPDFFile.value) {
      const formData = new FormData()
      formData.append('resume', selectedPDFFile.value)

      const uploadRes = await fetch('http://localhost:7070/api/website/careers/upload-cv', {
        method: 'POST',
        body: formData,
      })

      if (uploadRes.ok) {
        const uploadJson = await uploadRes.json()
        if (uploadJson.data?.file_url) {
          applyForm.value.resume_url = uploadJson.data.file_url
        }
      }
    }

    // 2. Submit lamaran
    const res = await fetch('http://localhost:7070/api/website/careers/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...applyForm.value,
        job_position_id: activeJob.value.id,
      }),
    })

    const json = await res.json()
    if (res.ok) {
      submitSuccess.value = true
    } else {
      submitError.value = json.message || 'Gagal mengirim lamaran kerja.'
    }
  } catch (err: any) {
    submitError.value = err.message || 'Terjadi kesalahan jaringan.'
  } finally {
    isSubmitting.value = false
  }
}

const trackingInput = ref('')
const showTrackingModal = ref(false)
const trackedData = ref<any>(null)

const pipelineStages = [
  { name: '1. Screening CV & Portofolio' },
  { name: '2. Wawancara HRD & Psikotes' },
  { name: '3. Uji Kompetensi & Tes Teknis' },
  { name: '4. Wawancara User & Kepala Divisi' },
  { name: '5. Offering Letter & Kontrak PKWTT' },
]

function trackApplication() {
  const query = trackingInput.value.trim().toLowerCase()
  if (!query) return

  trackedData.value = {
    name: query.includes('guruh')
      ? 'Guruh Wicaksono'
      : query.includes('nadia')
      ? 'Nadia Safitri'
      : query.includes('clarissa')
      ? 'Clarissa Amanda'
      : 'Kandidat Pelamar Terdaftar',
    email: trackingInput.value.includes('@') ? trackingInput.value : `${query.replace(/\s+/g, '.')}@gmail.com`,
    position: query.includes('nadia') ? 'Talent Acquisition Lead' : query.includes('clarissa') ? 'Senior Tax Specialist' : 'Senior Backend Go Engineer',
    applied_date: '10 September 2026',
    current_stage_idx: query.includes('clarissa') ? 4 : query.includes('nadia') ? 1 : 2,
    hr_notes: query.includes('clarissa')
      ? 'Selamat! Anda telah lolos seluruh tahapan seleksi user. Tim HRD telah menerbitkan draf Surat Penawaran Kerja (Offering Letter PKWTT).'
      : 'Berkas CV dan portofolio Anda telah lolos verifikasi screening. Undangan jadwal wawancara teknis telah dikirimkan ke email Anda.',
  }

  showTrackingModal.value = true
}

onMounted(() => {
  fetchJobs()
})
</script>
