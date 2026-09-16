<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Corporate e-Learning & LMS Karyawan" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Platform Pelatihan Wajib Kepatuhan & Pengembangan Kompetensi (Skala 100 - 1000 Karyawan)
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="showAddCourseModal = true"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            + Buat Kursus Baru
          </button>
          <router-link
            to="/hr/employees"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-300 py-2 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Data Karyawan &rarr;
          </router-link>
        </div>
      </div>

      <!-- Overview Stats Banner -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl font-bold">
            🎓
          </div>
          <div>
            <span class="text-xs text-gray-500">Kursus Kepatuhan Wajib</span>
            <h4 class="text-2xl font-bold text-gray-900 dark:text-white">4 Modul</h4>
            <p class="text-[11px] text-emerald-600">Standar ISO & Depnaker</p>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">
            👥
          </div>
          <div>
            <span class="text-xs text-gray-500">Karyawan Terdaftar</span>
            <h4 class="text-2xl font-bold text-gray-900 dark:text-white">105 Peserta</h4>
            <p class="text-[11px] text-blue-600">Tersinkronisasi HRD</p>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl font-bold">
            📜
          </div>
          <div>
            <span class="text-xs text-gray-500">Tingkat Penyelesaian</span>
            <h4 class="text-2xl font-bold text-gray-900 dark:text-white">88.4%</h4>
            <p class="text-[11px] text-purple-600">Sertifikat Digital Otomatis</p>
          </div>
        </div>
      </div>

      <!-- Filters & Category Navigation -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <div
            v-for="cat in allCategoriesList"
            :key="cat"
            class="inline-flex items-center"
          >
            <button
              @click="selectedCategory = cat"
              :class="[
                'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5',
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              ]"
            >
              <span>{{ cat }}</span>
              <span
                v-if="customCategories.includes(cat)"
                @click.stop="removeCategory(cat)"
                title="Hapus Kategori"
                class="ml-1 text-[11px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-4 h-4 inline-flex items-center justify-center dark:hover:bg-red-900/40"
              >
                ×
              </span>
            </button>
          </div>
          <button
            @click="showAddCatModal = true"
            class="rounded-xl border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:bg-brand-900/20"
          >
            + Tambah Kategori
          </button>
        </div>

        <div class="relative w-full md:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari materi pelatihan..."
            class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 pl-9 pr-3 text-xs focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <svg class="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Course Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-800 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between">
              <span
                :class="[
                  'rounded-lg px-2.5 py-1 text-[11px] font-bold',
                  course.is_mandatory
                    ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                ]"
              >
                {{ course.is_mandatory ? 'Wajib Kepatuhan' : 'Pengembangan Diri' }}
              </span>
              <span class="text-xs text-gray-400">{{ course.duration }}</span>
            </div>

            <h3 class="mt-3 text-lg font-bold text-gray-900 dark:text-white">
              {{ course.title }}
            </h3>

            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ course.description }}
            </p>

            <!-- Progress & Stats -->
            <div class="mt-5 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Progres Karyawan Korporat</span>
                <span class="font-bold text-brand-600 dark:text-brand-400">{{ course.progress }}%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  class="h-full rounded-full bg-brand-500 transition-all duration-500"
                  :style="{ width: `${course.progress}%` }"
                ></div>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span>{{ course.enrolled }} Karyawan Terdaftar</span>
              <span>{{ course.modules }} Modul Materi</span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sertifikat Tersedia
            </span>
            <div class="flex items-center gap-2">
              <button
                @click="startTraining(course)"
                class="rounded-xl bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
              >
                Mulai Belajar &rarr;
              </button>
              <button
                @click="deleteCourse(course.id)"
                title="Hapus Kursus"
                class="rounded-lg p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaginationBar :pagination="pagination" @change="onPaginationChange" />

      <!-- Modal Tambah Kursus -->
      <div v-if="showAddCourseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showAddCourseModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Buat Program Pelatihan Baru</h3>

          <form @submit.prevent="createCourse" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Kursus / Pelatihan *</label>
              <input v-model="newCourse.title" required type="text" placeholder="Contoh: Standar Operasional Prosedur Pengadaan Barang" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                <select v-model="newCourse.category" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option v-for="cat in availableCategories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimasi Durasi *</label>
                <input v-model="newCourse.duration" required type="text" placeholder="Contoh: 2 Jam (4 Modul)" class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ringkasan Materi *</label>
              <textarea v-model="newCourse.description" required rows="3" placeholder="Jelaskan tujuan dan silabus kursus..." class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"></textarea>
            </div>

            <div class="flex items-center gap-2">
              <input v-model="newCourse.is_mandatory" type="checkbox" id="mandCheck" class="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
              <label for="mandCheck" class="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Wajib Diselesaikan Seluruh Karyawan (Compliance Requirement)
              </label>
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="showAddCourseModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600">Simpan Kursus</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Tambah Kategori Elearning -->
      <div v-if="showAddCatModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-800">
          <button @click="showAddCatModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>📁</span> Tambah Kategori Pelatihan
          </h3>
          <p class="text-xs text-gray-500 mb-4">Tambahkan segmen kategori baru untuk materi pembelajaran LMS.</p>

          <form @submit.prevent="addCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Kategori *</label>
              <input
                v-model="newCatName"
                required
                type="text"
                placeholder="Contoh: Digital Marketing, HSE Level 2"
                class="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="showAddCatModal = false" class="rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">Simpan Kategori</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Kuis Evaluasi Kepatuhan & Kelulusan -->
      <div v-if="showQuizModal && selectedTrainingCourse" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="relative w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-gray-800 my-8">
          <button @click="showQuizModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div class="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 flex items-center justify-center text-lg font-bold">
              📝
            </div>
            <div>
              <span class="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 uppercase">
                Evaluasi Kepatuhan & Sertifikasi
              </span>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                Kuis Kelulusan: {{ selectedTrainingCourse.title }}
              </h3>
            </div>
          </div>

          <div class="my-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>Syarat Kelulusan Kepatuhan Korporat: Nilai minimal <strong>80%</strong> untuk menerbitkan sertifikat resmi bertanda tangan direksi.</span>
          </div>

          <!-- Questions List -->
          <form @submit.prevent="submitQuiz" class="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar my-4">
            <div
              v-for="(q, qIdx) in quizQuestions"
              :key="qIdx"
              class="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 space-y-3"
            >
              <div class="flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {{ qIdx + 1 }}
                </span>
                <p class="text-xs font-bold text-gray-900 dark:text-white">
                  {{ q.question }}
                </p>
              </div>

              <div class="space-y-2 pl-7">
                <label
                  v-for="(opt, oIdx) in q.options"
                  :key="oIdx"
                  :class="[
                    'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all',
                    userAnswers[qIdx] === oIdx
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-semibold'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  <input
                    type="radio"
                    :name="'q_' + qIdx"
                    :value="oIdx"
                    v-model="userAnswers[qIdx]"
                    required
                    class="text-brand-600 focus:ring-brand-500"
                  />
                  <span>{{ opt }}</span>
                </label>
              </div>
            </div>

            <div class="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" @click="showQuizModal = false" class="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
              <button type="submit" class="rounded-xl bg-brand-500 px-6 py-2 text-xs font-bold text-white hover:bg-brand-600 shadow flex items-center gap-1.5">
                <span>Kirim Jawaban & Evaluasi</span>
                &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Tampilan Cetak Sertifikat Digital Resmi (Certificate Generator) -->
      <div v-if="showCertModal && activeCertificate" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="relative w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 my-6">
          <button @click="showCertModal = false" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <!-- Certificate Paper Wrapper (Border Ornate) -->
          <div class="p-8 border-4 border-double border-indigo-200 dark:border-indigo-900/60 rounded-3xl bg-gradient-to-br from-indigo-50/20 via-white to-amber-50/20 dark:from-gray-900 dark:to-gray-800 text-center relative overflow-hidden">
            <!-- Watermark / Background stamp -->
            <div class="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-9xl font-black text-indigo-900">
              PASSED
            </div>

            <!-- Header Kop Surat -->
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                N
              </div>
              <div class="text-left">
                <h4 class="text-sm font-extrabold tracking-wider text-gray-900 dark:text-white uppercase">PT. Nusantara Prima Solusindo</h4>
                <p class="text-[10px] text-gray-500">Corporate Compliance & People Development Directorate</p>
              </div>
            </div>

            <span class="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold uppercase tracking-widest border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 mb-2">
              CERTIFICATE OF COMPLETION & COMPLIANCE
            </span>

            <p class="text-xs text-gray-500 mt-2">Diberikan secara sah kepada:</p>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white my-1 tracking-tight border-b-2 border-brand-500 inline-block px-6 pb-1">
              {{ activeCertificate.employee_name }}
            </h2>

            <p class="text-xs text-gray-600 dark:text-gray-300 max-w-lg mx-auto mt-4 leading-relaxed">
              Atas kelulusan evaluasi uji kompetensi kepatuhan korporat dengan nilai memuaskan (<strong>{{ activeCertificate.score }}%</strong>) pada modul pelatihan wajib:
            </p>

            <h3 class="text-lg font-bold text-brand-600 dark:text-brand-400 mt-2">
              "{{ activeCertificate.course_title }}"
            </h3>

            <!-- Certificate Meta Footer -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 items-center text-xs text-gray-600 dark:text-gray-300">
              <div class="text-left">
                <span class="text-[10px] text-gray-400 block">Nomor Seri Registrasi:</span>
                <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ activeCertificate.cert_code }}</span>
                <span class="text-[10px] text-gray-400 block mt-1">Tanggal Terbit: {{ activeCertificate.date }}</span>
              </div>

              <!-- QR Code Seal -->
              <div class="flex flex-col items-center">
                <div class="w-14 h-14 rounded-xl border border-gray-300 dark:border-gray-600 bg-white p-1 flex items-center justify-center shadow-inner">
                  <div class="w-full h-full bg-indigo-900 text-[9px] text-white flex items-center justify-center font-mono rounded">
                    VERIFIED
                  </div>
                </div>
                <span class="text-[9px] text-gray-400 mt-1">Validasi QR Resmi</span>
              </div>

              <div class="text-right">
                <span class="text-[10px] text-gray-400 block">Pejabat Pengesah:</span>
                <span class="font-bold text-gray-900 dark:text-white block mt-1">Dr. Hendra Pratama</span>
                <span class="text-[10px] text-gray-500">Chief Executive Officer</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex items-center justify-between">
            <span class="text-xs text-gray-400">Sertifikat ini telah tercatat di basis data modul HRD Kepegawaian.</span>
            <div class="flex gap-2">
              <button
                @click="printCertificate"
                class="rounded-xl bg-brand-500 px-5 py-2 text-xs font-bold text-white shadow hover:bg-brand-600 transition-all flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                <span>Cetak / Unduh PDF</span>
              </button>
              <button
                @click="showCertModal = false"
                class="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Tutup
              </button>
            </div>
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
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { IPaginationMeta } from '@/types'
import { elearningService } from '@/services/website/elearning.service'

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

const showAddCourseModal = ref(false)
const showAddCatModal = ref(false)
const newCatName = ref('')
const selectedCategory = ref('Semua')
const searchQuery = ref('')

const baseCategories = [
  'Kepatuhan & Regulasi',
  'Onboarding Karyawan',
  'Technical & IT',
  'Leadership & Management',
]
const customCategories = ref<string[]>([])

const availableCategories = computed(() => {
  return [...baseCategories, ...customCategories.value]
})

const allCategoriesList = computed(() => {
  return ['Semua', ...availableCategories.value]
})

function addCategory() {
  const trimmed = newCatName.value.trim()
  if (trimmed && !availableCategories.value.includes(trimmed)) {
    customCategories.value.push(trimmed)
    selectedCategory.value = trimmed
    newCatName.value = ''
    showAddCatModal.value = false
  }
}

function removeCategory(cat: string) {
  customCategories.value = customCategories.value.filter((c) => c !== cat)
  if (selectedCategory.value === cat) {
    selectedCategory.value = 'Semua'
  }
}

function deleteCourse(id: number) {
  courses.value = courses.value.filter((c) => c.id !== id)
}

const courses = ref([
  {
    id: 1,
    title: 'Orientasi & Onboarding Karyawan Baru (2026)',
    category: 'Onboarding Karyawan',
    description: 'Pengenalan budaya perusahaan, struktur organisasi korporat, fasilitas kantor, hak cuti, dan tunjangan BPJS.',
    duration: '3 Jam',
    modules: 5,
    enrolled: 105,
    progress: 95,
    is_mandatory: true,
  },
  {
    id: 2,
    title: 'Keselamatan & Kesehatan Kerja (K3) Tingkat Korporat',
    category: 'Kepatuhan & Regulasi',
    description: 'Pedoman mitigasi bahaya, jalur evakuasi darurat gedung bertingkat, dan pertolongan pertama pada kecelakaan kerja (P3K).',
    duration: '2.5 Jam',
    modules: 4,
    enrolled: 105,
    progress: 91,
    is_mandatory: true,
  },
  {
    id: 3,
    title: 'Keamanan Siber & Kepatuhan Perlindungan Data (UU PDP)',
    category: 'Kepatuhan & Regulasi',
    description: 'Sosialisasi pencegahan phishing, manajemen kata sandi enterprise, dan regulasi privasi data pelanggan.',
    duration: '2 Jam',
    modules: 4,
    enrolled: 105,
    progress: 84,
    is_mandatory: true,
  },
  {
    id: 4,
    title: 'Mastering Go & Clean Architecture untuk ERP Enterprise',
    category: 'Technical & IT',
    description: 'Standar penulisan kode backend performa tinggi dengan Echo framework, database migration, dan RabbitMQ messaging.',
    duration: '6 Jam',
    modules: 8,
    enrolled: 24,
    progress: 72,
    is_mandatory: false,
  },
  {
    id: 5,
    title: 'People Management & Feedback Berkelanjutan (Mekari Method)',
    category: 'Leadership & Management',
    description: 'Panduan manajer dalam melakukan 1-on-1 coaching, penilaian KPI karyawan berkala, dan evaluasi performa kerja.',
    duration: '4 Jam',
    modules: 6,
    enrolled: 18,
    progress: 80,
    is_mandatory: false,
  },
])

const newCourse = ref({
  title: '',
  category: 'Kepatuhan & Regulasi',
  duration: '2 Jam',
  description: '',
  is_mandatory: true,
})

const filteredCourses = computed(() => {
  return courses.value.filter((c) => {
    const matchesCategory = selectedCategory.value === 'Semua' || c.category === selectedCategory.value
    const matchesSearch = !searchQuery.value || c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const selectedTrainingCourse = ref<any>(null)
const showQuizModal = ref(false)
const showCertModal = ref(false)
const activeCertificate = ref<any>(null)
const userAnswers = ref<number[]>([])

const quizQuestions = ref([
  {
    question: 'Kapan batas maksimal pelaporan insiden kecelakaan kerja berat (K3) ke Disnaker menurut regulasi?',
    options: [
      'Maksimal 2x24 jam sejak terjadinya insiden',
      'Maksimal 7 hari kerja',
      'Hanya dilaporkan jika ada tuntutan hukum',
      'Cukup dicatat di buku harian sekuriti',
    ],
    correctIndex: 0,
  },
  {
    question: 'Berdasarkan UU Perlindungan Data Pribadi (UU PDP), apa kewajiban korporat jika terjadi kegagalan/kebocoran data?',
    options: [
      'Menghapus database cadangan secara diam-diam',
      'Memberitahukan secara tertulis maksimal 3x24 jam kepada subjek data & lembaga terkait',
      'Mengabaikan selama tidak diketahui oleh publik',
      'Menyalahkan penyedia hosting server eksternal',
    ],
    correctIndex: 1,
  },
  {
    question: 'Dalam SOP Pengadaan Barang & Jasa (Procurement), apa fungsi utama verifikasi faktur pajak sebelum pencairan dana?',
    options: [
      'Memastikan nominal PPN 11% sesuai faktur e-Faktur DJP dan barang telah diterima gudang',
      'Sebagai formalitas tanpa perlu dicek',
      'Menunda pembayaran kepada rekanan vendor',
      'Mengurangi jatah laba bersih operasional',
    ],
    correctIndex: 0,
  },
])

function startTraining(course: any) {
  selectedTrainingCourse.value = course
  userAnswers.value = []
  showQuizModal.value = true
}

function submitQuiz() {
  let correctCount = 0
  quizQuestions.value.forEach((q, idx) => {
    if (userAnswers.value[idx] === q.correctIndex) {
      correctCount++
    }
  })

  const score = Math.round((correctCount / quizQuestions.value.length) * 100)
  if (score >= 60) {
    if (selectedTrainingCourse.value) {
      selectedTrainingCourse.value.progress = 100
    }
    showQuizModal.value = false
    activeCertificate.value = {
      cert_code: `CERT-LMS-${Date.now().toString().slice(-6)}`,
      employee_name: 'Budi Santoso, S.Kom',
      course_title: selectedTrainingCourse.value?.title,
      score,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
    showCertModal.value = true
  } else {
    alert(`Hasil kuis Anda: ${score}%. Skor minimal kelulusan kepatuhan adalah 60%. Silakan tinjau kembali modul materi dan coba lagi.`)
  }
}

function printCertificate() {
  window.print()
}

function createCourse() {
  courses.value.unshift({
    id: Date.now(),
    title: newCourse.value.title,
    category: newCourse.value.category,
    description: newCourse.value.description,
    duration: newCourse.value.duration,
    modules: 4,
    enrolled: 105,
    progress: 0,
    is_mandatory: newCourse.value.is_mandatory,
  })
  showAddCourseModal.value = false
  newCourse.value = {
    title: '',
    category: 'Kepatuhan & Regulasi',
    duration: '2 Jam',
    description: '',
    is_mandatory: true,
  }
}

async function fetchData() {
  try {
    const res = await elearningService.getAll({
      page: pagination.value.current_page,
      limit: pagination.value.per_page
    })
    let items: any[] = []
    if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
      items = (res as any).data
      if ((res as any).pagination) pagination.value = (res as any).pagination
    } else if (Array.isArray(res)) {
      items = res
    }
    if (items.length > 0) {
      courses.value = items.map((c: any) => ({
        id: c.id,
        title: c.title || 'Materi Pelatihan',
        category: c.category || 'Kepatuhan & Regulasi',
        description: c.description || '',
        duration: c.duration || '2 Jam',
        modules: c.modules || 4,
        enrolled: c.enrolled || 100,
        progress: c.progress || 0,
        is_mandatory: c.is_mandatory ?? true,
      }))
    }
  } catch (err) {
    console.error('Error fetching elearning courses:', err)
  }
}

onMounted(() => {
  fetchData()
})
</script>
