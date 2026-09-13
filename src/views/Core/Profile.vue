<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <PageBreadcrumb pageTitle="User Profile" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kelola data identitas pengguna, hak akses peran, alamat, NPWP perpajakan, dan keamanan akun enterprise.
          </p>
        </div>

        <!-- Success notification banner -->
        <div v-if="successMessage" class="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
          <span>✓</span>
          <span>{{ successMessage }}</span>
        </div>
      </div>

      <!-- 1. MY PROFILE -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <span>👤</span>
            <span>Profil Pengguna (My Profile)</span>
          </h3>
          <button
            @click="openEditProfileModal"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Profil
          </button>
        </div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 overflow-hidden shadow-md flex items-center justify-center text-white font-black text-2xl">
            <img v-if="profileData.avatar" :src="profileData.avatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ userInitials }}</span>
            <span class="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900"></span>
          </div>

          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="text-xl font-extrabold text-gray-900 dark:text-white">{{ profileData.name }}</h4>
              <span class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {{ profileData.role }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ profileData.department }} <span class="mx-1.5">•</span> {{ profileData.company }} <span class="mx-1.5">•</span> {{ profileData.location }}
            </p>
            <p class="text-xs text-gray-400 mt-1">Sesi Terakhir: {{ profileData.lastLogin }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Nama Depan</p>
            <p class="font-bold text-sm text-gray-800 dark:text-white/90">{{ profileData.firstName }}</p>
          </div>
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Nama Belakang</p>
            <p class="font-bold text-sm text-gray-800 dark:text-white/90">{{ profileData.lastName }}</p>
          </div>
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Alamat Email</p>
            <p class="font-bold text-sm text-gray-800 dark:text-white/90 font-mono">{{ profileData.email }}</p>
          </div>
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Nomor Telepon / WhatsApp</p>
            <p class="font-bold text-sm text-gray-800 dark:text-white/90 font-mono">{{ profileData.phone }}</p>
          </div>
          <div class="sm:col-span-2 bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Bio & Peran Jabatan</p>
            <p class="font-medium text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{{ profileData.bio }}</p>
          </div>
          <div class="sm:col-span-2 bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Koneksi Sosial & Korporat</p>
            <div class="flex items-center gap-3 mt-1 text-xs">
              <a :href="profileData.socialLinks.linkedin" target="_blank" class="font-bold text-brand-600 hover:underline flex items-center gap-1">
                <span>🔗</span> LinkedIn
              </a>
              <span class="text-gray-300">•</span>
              <a :href="profileData.socialLinks.x" target="_blank" class="font-bold text-gray-800 dark:text-gray-200 hover:underline flex items-center gap-1">
                <span>✖</span> Twitter/X
              </a>
              <span class="text-gray-300">•</span>
              <span class="text-gray-500">🏢 PT Nusantara Prima Solusindo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. ADDRESS & TAX ID (NPWP) -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <span>📍</span>
            <span>Domisili & NPWP Perpajakan (Address & Tax ID)</span>
          </h3>
          <button
            @click="openEditAddressModal"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Alamat & NPWP
          </button>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Negara Domisili</p>
            <p class="font-bold text-sm text-gray-800 dark:text-white/90">{{ profileData.country }}</p>
          </div>
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Provinsi & Kota</p>
            <p class="font-bold text-sm text-gray-800 dark:text-white/90">{{ profileData.cityState }}</p>
          </div>
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Kode Pos</p>
            <p class="font-bold text-sm text-gray-800 dark:text-white/90 font-mono">{{ profileData.postalCode }}</p>
          </div>
          <div class="bg-gray-50/50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">NPWP 16 Digit (Tax ID DJP)</p>
            <p class="font-bold text-sm text-brand-600 dark:text-brand-400 font-mono">{{ profileData.taxId }}</p>
          </div>
        </div>
      </div>

      <!-- 3. SECURITY & 2FA -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
        <h3 class="text-base font-bold text-gray-800 dark:text-white/90 mb-6 flex items-center gap-2">
          <span>🔒</span>
          <span>Keamanan & Autentikasi (Security)</span>
        </h3>
        
        <!-- Change Password Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800 mb-6 gap-3">
          <div>
            <h4 class="font-bold text-sm text-gray-900 dark:text-white">Kata Sandi Akun (Password)</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Ganti kata sandi secara berkala untuk menjaga keamanan akses ke modul sensitif ERP.
            </p>
          </div>
          <button
            @click="openChangePasswordModal"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Ganti Kata Sandi
          </button>
        </div>

        <!-- 2FA Row -->
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-gray-900 dark:text-white">Autentikasi Dua Faktor (2FA TOTP)</h4>
              <span
                :class="profileData.is2FAEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                class="rounded-full px-2 py-0.5 text-[10px] font-bold border"
              >
                {{ profileData.is2FAEnabled ? '● Aktif (Google Authenticator)' : '○ Nonaktif' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Wajibkan verifikasi OTP 6-digit saat masuk ke akun dari perangkat baru.
            </p>
          </div>
          
          <!-- Interactive Toggle -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="profileData.is2FAEnabled"
              @change="handle2FAToggle"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
          </label>
        </div>
      </div>

      <!-- 4. DANGER ZONE -->
      <div class="rounded-xl border border-rose-200 bg-rose-50/20 p-6 dark:border-rose-900/40 dark:bg-rose-950/10 shadow-xs space-y-5">
        <h3 class="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>Zona Tindakan Kritis (Danger Zone)</span>
        </h3>
        
        <!-- Logout all devices -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-rose-100 dark:border-rose-900/30 gap-3">
          <div>
            <h4 class="font-bold text-sm text-gray-900 dark:text-white">Keluarkan Semua Sesi Aktif (Logout All Devices)</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Putuskan seluruh sesi login dari {{ profileData.activeSessionsCount }} perangkat aktif lain dan mewajibkan masuk ulang.
            </p>
          </div>
          <button
            @click="logoutAllDevices"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout Semua Sesi
          </button>
        </div>

        <!-- Delete account -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 class="font-bold text-sm text-rose-700 dark:text-rose-400">Nonaktifkan / Hapus Akun</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Menghapus hak akses akun secara permanen. Hanya Superadmin yang berwenang menghapus akun.
            </p>
          </div>
          <button
            @click="handleDeleteAccount"
            class="inline-flex items-center gap-1.5 rounded-lg border border-rose-500 text-rose-600 bg-white dark:bg-gray-900 px-4 py-2 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"></path></svg>
            Hapus Akun Pengguna
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL EDIT PROFILE                                                        -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isEditProfileOpen" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div class="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4 my-8 border border-gray-100 dark:border-gray-800">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <span>👤</span>
              <span>Edit Informasi Profil Pengguna</span>
            </h3>
            <button @click="isEditProfileOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="saveProfile" class="space-y-3.5 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Depan</label>
                <input v-model="editProfileForm.firstName" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500 font-medium" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Belakang</label>
                <input v-model="editProfileForm.lastName" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500 font-medium" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Alamat Email</label>
                <input v-model="editProfileForm.email" type="email" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nomor WhatsApp / HP</label>
                <input v-model="editProfileForm.phone" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Peran Akses (Role)</label>
                <input v-model="editProfileForm.role" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Departemen / Divisi</label>
                <input v-model="editProfileForm.department" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Bio Singkat</label>
              <textarea v-model="editProfileForm.bio" rows="2" class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500 leading-relaxed"></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button type="button" @click="isEditProfileOpen = false" class="px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 rounded-xl dark:hover:bg-gray-800">
                Batal
              </button>
              <button type="submit" class="px-5 py-2 font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition shadow-xs">
                Simpan Profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL EDIT ADDRESS & TAX ID                                               -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isEditAddressOpen" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div class="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4 my-8 border border-gray-100 dark:border-gray-800">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <span>📍</span>
              <span>Edit Alamat Domisili & NPWP</span>
            </h3>
            <button @click="isEditAddressOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="saveAddress" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Negara</label>
              <input v-model="editAddressForm.country" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Provinsi & Kota</label>
              <input v-model="editAddressForm.cityState" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kode Pos</label>
                <input v-model="editAddressForm.postalCode" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500 font-mono" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">NPWP 16 Digit</label>
                <input v-model="editAddressForm.taxId" type="text" required class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500 font-mono font-bold" />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button type="button" @click="isEditAddressOpen = false" class="px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 rounded-xl dark:hover:bg-gray-800">
                Batal
              </button>
              <button type="submit" class="px-5 py-2 font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition shadow-xs">
                Simpan Alamat
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- MODAL CHANGE PASSWORD                                                     -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div v-if="isChangePasswordOpen" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div class="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4 my-8 border border-gray-100 dark:border-gray-800">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <span>🔒</span>
              <span>Ganti Kata Sandi Akun</span>
            </h3>
            <button @click="isChangePasswordOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <form @submit.prevent="savePassword" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kata Sandi Saat Ini</label>
              <input v-model="passwordForm.currentPassword" type="password" required placeholder="••••••••" class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kata Sandi Baru (Min. 8 Karakter)</label>
              <input v-model="passwordForm.newPassword" type="password" required minlength="8" placeholder="••••••••" class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Konfirmasi Kata Sandi Baru</label>
              <input v-model="passwordForm.confirmPassword" type="password" required minlength="8" placeholder="••••••••" class="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-brand-500" />
            </div>

            <!-- Password Match Status -->
            <p v-if="passwordMismatch" class="text-[11px] text-rose-500 font-semibold">
              ⚠️ Konfirmasi kata sandi tidak cocok dengan kata sandi baru.
            </p>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button type="button" @click="isChangePasswordOpen = false" class="px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 rounded-xl dark:hover:bg-gray-800">
                Batal
              </button>
              <button type="submit" :disabled="passwordMismatch" class="px-5 py-2 font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition shadow-xs disabled:opacity-50">
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const successMessage = ref('')

const profileData = ref({
  name: 'Super Admin',
  firstName: 'Super',
  lastName: 'Admin',
  email: 'admin@nusantaraprima.co.id',
  phone: '+62 812-9900-8800',
  role: 'Super Administrator',
  department: 'Information Technology & Systems',
  company: 'PT. Nusantara Prima Solusindo',
  location: 'DKI Jakarta, Indonesia',
  country: 'Indonesia',
  cityState: 'Jakarta Selatan, DKI Jakarta',
  postalCode: '12950',
  taxId: '01.345.678.9-012.000',
  bio: 'Chief Technology Officer & Administrator Sistem Inti ERP Enterprise. Mengelola otomasi sistem multi-divisi dan tata kelola keamanan RBAC.',
  avatar: '',
  socialLinks: {
    linkedin: 'https://linkedin.com',
    x: 'https://x.com',
    facebook: 'https://facebook.com'
  },
  is2FAEnabled: true,
  activeSessionsCount: 3,
  lastLogin: 'Hari ini, 21:40 WIB'
})

const userInitials = computed(() => {
  const parts = profileData.value.name.split(' ')
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return (profileData.value.name[0] || 'U').toUpperCase()
})

// Modals State
const isEditProfileOpen = ref(false)
const isEditAddressOpen = ref(false)
const isChangePasswordOpen = ref(false)

const editProfileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  bio: ''
})

const editAddressForm = ref({
  country: '',
  cityState: '',
  postalCode: '',
  taxId: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordMismatch = computed(() => {
  return passwordForm.value.newPassword && passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword
})

const showToast = (msg: string) => {
  successMessage.value = msg
  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const syncWithLocalStorage = () => {
  const updatedUser = {
    name: profileData.value.name,
    email: profileData.value.email,
    role: profileData.value.role,
    avatar: profileData.value.avatar,
    phone: profileData.value.phone,
    country: profileData.value.country,
    cityState: profileData.value.cityState,
    postalCode: profileData.value.postalCode,
    taxId: profileData.value.taxId,
    bio: profileData.value.bio,
    department: profileData.value.department
  }
  localStorage.setItem('user', JSON.stringify(updatedUser))
  window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedUser }))
}

const openEditProfileModal = () => {
  editProfileForm.value = {
    firstName: profileData.value.firstName,
    lastName: profileData.value.lastName,
    email: profileData.value.email,
    phone: profileData.value.phone,
    role: profileData.value.role,
    department: profileData.value.department,
    bio: profileData.value.bio
  }
  isEditProfileOpen.value = true
}

const saveProfile = () => {
  profileData.value.firstName = editProfileForm.value.firstName
  profileData.value.lastName = editProfileForm.value.lastName
  profileData.value.name = `${editProfileForm.value.firstName} ${editProfileForm.value.lastName}`.trim()
  profileData.value.email = editProfileForm.value.email
  profileData.value.phone = editProfileForm.value.phone
  profileData.value.role = editProfileForm.value.role
  profileData.value.department = editProfileForm.value.department
  profileData.value.bio = editProfileForm.value.bio
  profileData.value.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.value.name)}&background=random`

  syncWithLocalStorage()
  isEditProfileOpen.value = false
  showToast('Informasi profil berhasil diperbarui!')
}

const openEditAddressModal = () => {
  editAddressForm.value = {
    country: profileData.value.country,
    cityState: profileData.value.cityState,
    postalCode: profileData.value.postalCode,
    taxId: profileData.value.taxId
  }
  isEditAddressOpen.value = true
}

const saveAddress = () => {
  profileData.value.country = editAddressForm.value.country
  profileData.value.cityState = editAddressForm.value.cityState
  profileData.value.postalCode = editAddressForm.value.postalCode
  profileData.value.taxId = editAddressForm.value.taxId

  syncWithLocalStorage()
  isEditAddressOpen.value = false
  showToast('Alamat dan NPWP berhasil diperbarui!')
}

const openChangePasswordModal = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  isChangePasswordOpen.value = true
}

const savePassword = () => {
  if (passwordMismatch.value) return
  isChangePasswordOpen.value = false
  showToast('Kata sandi berhasil diperbarui secara aman!')
}

const handle2FAToggle = () => {
  showToast(
    profileData.value.is2FAEnabled
      ? '2FA Google Authenticator berhasil diaktifkan!'
      : '2FA dinonaktifkan sementara.'
  )
}

const logoutAllDevices = () => {
  if (confirm('Apakah Anda yakin ingin mengeluarkan seluruh sesi login dari perangkat lain?')) {
    profileData.value.activeSessionsCount = 1
    showToast('Seluruh sesi di perangkat lain telah berhasil di-logout!')
  }
}

const handleDeleteAccount = () => {
  alert('Permintaan penghapusan akun memerlukan konfirmasi dari Dewan Direksi dan Superadministrator utama.')
}

onMounted(() => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.name) {
        profileData.value.name = user.name
        const parts = user.name.split(' ')
        profileData.value.firstName = parts[0]
        profileData.value.lastName = parts.slice(1).join(' ') || parts[0]
      }
      if (user.email) profileData.value.email = user.email
      if (user.role) profileData.value.role = user.role
      if (user.phone) profileData.value.phone = user.phone
      if (user.country) profileData.value.country = user.country
      if (user.cityState) profileData.value.cityState = user.cityState
      if (user.postalCode) profileData.value.postalCode = user.postalCode
      if (user.taxId) profileData.value.taxId = user.taxId
      if (user.department) profileData.value.department = user.department
      if (user.bio) profileData.value.bio = user.bio
      profileData.value.avatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.value.name)}&background=random`
    }
  } catch (e) {
    console.error('Failed to parse user from storage', e)
  }
})
</script>

