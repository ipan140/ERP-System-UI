const fs = require('fs');
const path = require('path');

const template = (title) => `<template>
  <DefaultLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          ${title}
        </h2>
      </div>
      <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <p>Halaman ini sedang dalam tahap pengembangan (Fase 1).</p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>`;

const files = [
  'src/views/Core/MasterData/Countries.vue',
  'src/views/Core/MasterData/Currencies.vue',
  'src/views/Core/Access/UserRoles.vue',
  'src/views/Core/Access/Permissions.vue',
  'src/views/Core/Communications/Discuss.vue',
  'src/views/Core/Communications/Mailer.vue',
  'src/views/Core/Communications/Voip.vue',
  'src/views/Core/Communications/Whatsapp.vue',
  'src/views/Core/Documents/Storage.vue',
  'src/views/Core/Documents/Documents.vue',
  'src/views/Core/Documents/Report.vue',
  'src/views/Core/Advanced/Knowledge.vue',
  'src/views/Core/Advanced/Iot.vue',
  'src/views/Core/Advanced/ArtificialIntelligence.vue'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const title = path.basename(file, '.vue').replace(/([A-Z])/g, ' $1').trim();
  fs.writeFileSync(filePath, template(title));
  console.log(`Created ${file}`);
});
