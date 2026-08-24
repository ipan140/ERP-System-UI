<template>
  <div class="flex flex-col gap-1">
    <h2 class="text-title-md2 text-[26px] font-bold text-gray-800 dark:text-white/90">
      {{ pageTitle }}
    </h2>
    <nav>
      <ol class="flex items-center gap-1.5">
        <li>
          <router-link
            class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400"
            to="/"
          >
            <HomeIcon class="w-4 h-4" />
            Home
            <svg
              class="stroke-current"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </li>
        <li class="text-sm font-medium text-gray-800 dark:text-white/90">
          {{ pageTitle }}
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon } from '@/icons'

interface BreadcrumbProps {
  pageTitle: string
}

defineProps<BreadcrumbProps>()
</script>
