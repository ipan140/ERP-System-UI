<template>
  <div class="org-node-container flex flex-col items-center">
    <!-- The Card -->
    <div class="relative">
      <div class="org-card bg-white dark:bg-gray-800 border-2 border-brand-200 dark:border-brand-800 rounded-xl shadow-sm p-4 w-64 text-center z-10 relative hover:border-brand-500 hover:shadow-md transition-all cursor-pointer">
        <div class="w-12 h-12 mx-auto bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-lg mb-2">
          {{ node.name ? node.name.substring(0,2).toUpperCase() : 'EM' }}
        </div>
        <h4 class="font-bold text-gray-900 dark:text-white truncate">{{ node.name }}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate font-medium">{{ node.job_position?.name || 'Staff' }}</p>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">{{ node.department?.name || '' }}</p>
      </div>
    </div>

    <!-- Children -->
    <div v-if="node.children && node.children.length > 0" class="org-children relative flex justify-center pt-8 mt-4">
      <!-- Connecting line from parent to horizontal bar -->
      <div class="absolute top-0 left-1/2 w-px h-8 bg-brand-300 dark:bg-brand-700 transform -translate-x-1/2 -mt-4"></div>
      
      <!-- Horizontal bar above children -->
      <div class="absolute top-4 left-0 right-0 h-px bg-brand-300 dark:bg-brand-700"
           :style="horizontalBarStyle"></div>

      <div class="flex gap-4 relative z-0">
        <div v-for="(child, index) in node.children" :key="child.id" class="relative pt-4">
          <!-- Connecting line from horizontal bar to child -->
          <div class="absolute top-0 left-1/2 w-px h-4 bg-brand-300 dark:bg-brand-700 transform -translate-x-1/2"></div>
          <OrgNode :node="child" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

// Calculate the horizontal bar width based on children positions
// A simple CSS trick: we just draw the horizontal line from 0 to 100% 
// but we need to inset it based on the first and last child's center.
// Since flex evenly spaces them, we can use CSS padding/margins or just let the bar span the width 
// minus half a child width on each side.
const horizontalBarStyle = computed(() => {
  if (!props.node.children || props.node.children.length <= 1) return { display: 'none' }
  // To keep it simple, we use a CSS hack in the parent `.org-children`
  return {}
})
</script>

<style scoped>
.org-children > .absolute.h-px {
  /* This creates the horizontal connecting bar */
  width: calc(100% - 272px); /* 272px is roughly the width of a card (w-64 = 256px + gap) */
  left: 136px; /* Half of 272px */
}

/* Fallback if only 2 children */
.org-children .flex > div:first-child:last-child::before {
  display: none; /* Hide horizontal bar if only 1 child */
}
</style>
