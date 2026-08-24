<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto" @click.self="$emit('close')">
      <slot name="body"></slot>
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup>
</script>
