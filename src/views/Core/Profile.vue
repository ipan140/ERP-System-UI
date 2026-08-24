<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageBreadcrumb pageTitle="User Profile" />
      </div>

      <!-- My Profile -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">My Profile</h3>
          <button class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit
          </button>
        </div>
        
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Musharof+Chowdhury&background=random" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">Musharof Chowdhury</h4>
            <p class="text-sm text-gray-500">Team Manager <span class="mx-2">|</span> Arizona, United States.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">First Name</p>
            <p class="font-medium text-gray-800 dark:text-white/90">Chowdury</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Last Name</p>
            <p class="font-medium text-gray-800 dark:text-white/90">Musharof</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Email address</p>
            <p class="font-medium text-gray-800 dark:text-white/90">randomuser@pimjo.com</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Phone</p>
            <p class="font-medium text-gray-800 dark:text-white/90">+09 363 398 46</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Bio</p>
            <p class="font-medium text-gray-800 dark:text-white/90">Team Manager</p>
          </div>
          <div class="lg:col-span-3">
            <p class="text-sm text-gray-500 mb-1">Social Links</p>
            <div class="flex gap-4">
              <!-- simple social icons -->
              <span class="text-gray-400 hover:text-brand-500 cursor-pointer">FB</span>
              <span class="text-gray-400 hover:text-brand-500 cursor-pointer">X</span>
              <span class="text-gray-400 hover:text-brand-500 cursor-pointer">IN</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Address</h3>
          <button class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit
          </button>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p class="text-sm text-gray-500 mb-1">Country</p>
            <p class="font-medium text-gray-800 dark:text-white/90">United States</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">City/State</p>
            <p class="font-medium text-gray-800 dark:text-white/90">Arizona, United States.</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Postal Code</p>
            <p class="font-medium text-gray-800 dark:text-white/90">ERT 2489</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">TAX ID</p>
            <p class="font-medium text-gray-800 dark:text-white/90">AS4568384</p>
          </div>
        </div>
      </div>

      <!-- Security -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Security</h3>
        
        <div class="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
          <div>
            <h4 class="font-medium text-gray-800 dark:text-white/90">Change Password</h4>
            <p class="text-sm text-gray-500">Receive real-time notifications and team alerts.</p>
          </div>
          <button class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Change Password
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-gray-800 dark:text-white/90">Two-factor authentication (2FA)</h4>
            <p class="text-sm text-gray-500">Keep your account secure by enabling 2FA</p>
          </div>
          <!-- Simple Toggle -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" checked>
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
          </label>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Danger Zone</h3>
        
        <div class="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
          <div>
            <h4 class="font-medium text-gray-800 dark:text-white/90">Logout all devices</h4>
            <p class="text-sm text-gray-500">Sign out from every active session.</p>
          </div>
          <button class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Change Password
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-gray-800 dark:text-white/90">Delete account</h4>
            <p class="text-sm text-gray-500">Sign out from every active session.</p>
          </div>
          <button class="inline-flex items-center gap-2 rounded-lg border border-error-500 text-error-500 px-4 py-2 text-sm font-medium hover:bg-error-50 dark:hover:bg-error-500/10">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"></path></svg>
            Delete account
          </button>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
</script>
