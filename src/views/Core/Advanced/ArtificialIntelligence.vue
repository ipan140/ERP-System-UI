<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Enterprise AI Assistant & Prompt Hub" />
        
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="activeView = 'library'"
            :class="activeView === 'library' ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
            class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>📚</span> Prompt Library
          </button>
          <button
            @click="activeView = 'simulator'"
            :class="activeView === 'simulator' ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
            class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>✨</span> AI Playground & Simulator
          </button>
          <button
            @click="activeView = 'settings'"
            :class="activeView === 'settings' ? 'bg-brand-500 text-white shadow-theme-xs' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'"
            class="rounded-lg px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>⚙️</span> Multi-Provider LLM
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Provider Aktif Utama</p>
              <h4 class="mt-1 text-xl font-bold text-brand-600 dark:text-brand-400">{{ getActiveProviderLabel() }}</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10 text-xl font-bold">
              ✨
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Model: {{ getActiveModelLabel() }}</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Prompt Presets Siap Pakai</p>
              <h4 class="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{{ prompts.length }} Template</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-success-50 text-success-500 dark:bg-success-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">HR, Finance, Supply Chain, & Sales CRM</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Provider Siap Pakai</p>
              <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{{ getConfiguredProvidersCount() }} / 5 Provider</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Gemini, OpenAI, Claude, DeepSeek, Ollama</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Keamanan Kunci API</p>
              <h4 class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">Tersandi</h4>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">Prioritas: Database > File .env</p>
        </div>
      </div>

      <!-- VIEW 1: Prompt Library -->
      <div v-if="activeView === 'library'" class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col gap-3 border-b border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-bold text-gray-800 dark:text-white text-base">Koleksi Template AI Prompt Korporat</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Prompt terstruktur dengan variabel dinamis untuk otomasi operasional bisnis</p>
            </div>
            <button
              @click="openModal('create')"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Prompt Baru
            </button>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="p in prompts"
              :key="p.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors gap-4"
            >
              <div class="flex items-start gap-4">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 text-xl">
                  {{ p.icon }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ p.title }}</h4>
                    <span :class="getCategoryBadgeClass(p.module)" class="rounded px-2 py-0.5 text-2xs font-semibold">
                      {{ p.module }}
                    </span>
                    <span class="rounded bg-gray-100 px-2 py-0.5 text-2xs font-mono font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {{ p.model }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ p.description }}</p>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span v-for="tag in p.tags" :key="tag" class="rounded bg-gray-50 border border-gray-200 px-1.5 py-0.2 text-2xs font-mono text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      &#123;&#123; {{ tag }} &#125;&#125;
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center">
                <button
                  @click="runInSimulator(p)"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                >
                  <span>✨</span> Jalankan di Simulator
                </button>
                <button
                  @click="openModal('edit', p)"
                  class="rounded-lg border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  title="Edit Prompt"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  @click="deletePrompt(p)"
                  class="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                  title="Hapus Prompt"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: AI Playground & Simulator -->
      <div v-if="activeView === 'simulator'" class="space-y-4">
        <!-- Provider & Engine Toolbar -->
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Pilih Provider AI:</span>
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="prov in providerList"
                :key="prov.key"
                @click="simProvider = prov.key; onSimProviderChange()"
                :class="simProvider === prov.key ? 'bg-brand-500 text-white shadow-theme-xs font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
                class="rounded-lg px-3 py-1 text-xs transition-colors flex items-center gap-1.5"
              >
                <span>{{ prov.icon }}</span>
                <span>{{ prov.name }}</span>
                <span v-if="isProviderConfigured(prov.key)" class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Model:</span>
            <select
              v-model="simModel"
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 font-medium"
            >
              <option v-for="m in availableModelsFor(simProvider)" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Input Simulator -->
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-sm">Input Variabel Kasus AI</h3>
                <p class="text-xs text-gray-400">Pilih template dan sesuaikan data parameter kasus</p>
              </div>
              <select
                v-model="selectedPromptId"
                @change="onPromptSelected"
                class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 font-medium max-w-[200px] truncate"
              >
                <option v-for="p in prompts" :key="p.id" :value="p.id">
                  {{ p.title }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Instruksi Sistem (System Prompt)</label>
              <textarea
                v-model="simSystemPrompt"
                rows="3"
                class="w-full font-mono text-xs rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Data Kasus / Input Transaksi</label>
              <textarea
                v-model="simUserInput"
                rows="5"
                class="w-full text-xs rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-2xs text-gray-500">
                Engine: <strong class="text-gray-700 dark:text-gray-300">{{ simProvider }}</strong> ({{ simModel }})
              </span>
              <button
                @click="executeAiSimulation"
                :disabled="isGenerating"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-xs font-bold text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                <svg v-if="isGenerating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span v-else>✨</span>
                {{ isGenerating ? 'Menganalisis Data...' : 'Jalankan Analisis AI' }}
              </button>
            </div>
          </div>

          <!-- Output Simulator -->
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800 mb-4">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900 dark:text-white text-sm">Hasil Generatif AI ERP</h3>
                  <span v-if="simMeta" :class="simMeta.is_live ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'" class="rounded px-2 py-0.5 text-2xs font-semibold">
                    {{ simMeta.is_live ? '🟢 Live LLM' : '🟡 Fallback' }} ({{ simMeta.latency_ms }}ms)
                  </span>
                </div>
                <button
                  v-if="simResult"
                  @click="copySimResult"
                  class="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Salin Teks
                </button>
              </div>

              <div v-if="isGenerating" class="py-16 text-center">
                <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">{{ simProvider }} sedang memproses input analitis...</p>
              </div>

              <div
                v-else-if="simResult"
                class="rounded-xl bg-gray-50 p-4 border border-gray-100 dark:border-gray-800 dark:bg-gray-800/50 text-xs text-gray-800 dark:text-gray-200 leading-relaxed space-y-3 font-sans overflow-auto max-h-[420px]"
                v-html="simResult"
              ></div>

              <div v-else class="py-16 text-center text-gray-400 text-xs">
                Tekan tombol "Jalankan Analisis AI" untuk melihat hasil rekomendasi cerdas secara interaktif.
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-2xs text-gray-400">
              <span>Model Eksekusi: {{ simMeta?.model_version || (simProvider + ' ' + simModel) }}</span>
              <span>Tokens: ~{{ simMeta?.tokens_used || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 3: Multi-Provider LLM Configuration -->
      <div v-if="activeView === 'settings'" class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 dark:border-gray-800 gap-3">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base">Konfigurasi Multi-Provider AI Enterprise</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Konfigurasi API Key untuk Google Gemini, OpenAI, Anthropic Claude, DeepSeek, atau Local Ollama. Prioritas: Database > .env
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="configSaveSuccess" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ✓ Konfigurasi Tersimpan!
              </span>
              <button
                @click="saveAIConfigurations"
                :disabled="isSavingConfig"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-xs font-bold text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                <svg v-if="isSavingConfig" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span v-else>💾</span>
                {{ isSavingConfig ? 'Menyimpan...' : 'Simpan Konfigurasi AI' }}
              </button>
            </div>
          </div>

          <!-- Provider Cards -->
          <div class="mt-6 space-y-6">
            <!-- Active Provider Selector -->
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Pilih Provider Default Sistem (Active Provider)
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div
                  v-for="prov in providerList"
                  :key="prov.key"
                  @click="aiConfig.active_provider = prov.key"
                  :class="aiConfig.active_provider === prov.key ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-500/10 ring-2 ring-brand-500' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800'"
                  class="cursor-pointer rounded-xl border p-4 transition-all relative"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-2xl">{{ prov.icon }}</span>
                    <span
                      v-if="aiConfig.active_provider === prov.key"
                      class="rounded-full bg-brand-500 text-white text-2xs px-2 py-0.5 font-bold"
                    >
                      Aktif
                    </span>
                  </div>
                  <h4 class="mt-2 text-sm font-bold text-gray-900 dark:text-white">{{ prov.name }}</h4>
                  <p class="text-2xs text-gray-500 dark:text-gray-400 mt-0.5">{{ prov.desc }}</p>
                  <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span :class="isProviderConfigured(prov.key) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'" class="text-2xs font-semibold">
                      {{ isProviderConfigured(prov.key) ? '● Siap Digunakan' : '○ Belum Dikonfigurasi' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Provider Detail Forms -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <!-- 1. Google Gemini -->
              <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">✨</span>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900 dark:text-white">Google Gemini</h4>
                      <p class="text-2xs text-gray-500">Google AI Studio REST API</p>
                    </div>
                  </div>
                  <span :class="getProviderStatusBadgeClass('GEMINI')" class="rounded px-2 py-0.5 text-2xs font-semibold">
                    {{ getProviderStatusText('GEMINI') }}
                  </span>
                </div>
                <div>
                  <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Gemini API Key</label>
                  <input
                    v-model="aiConfig.gemini_api_key"
                    type="password"
                    :placeholder="aiConfig.gemini_configured ? '•••••••••••• (Tersimpan)' : 'Masukkan AIzaSy...'"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <p class="text-2xs text-gray-400 mt-1">Dapatkan gratis di Google AI Studio (aistudio.google.com)</p>
                </div>
                <div>
                  <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Model Default</label>
                  <select
                    v-model="aiConfig.gemini_model"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Cepat & Hemat)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Penalaran Kompleks)</option>
                    <option value="gemini-2.0-flash-exp">gemini-2.0-flash-exp (Experimental)</option>
                  </select>
                </div>
              </div>

              <!-- 2. OpenAI GPT -->
              <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🧠</span>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900 dark:text-white">OpenAI GPT</h4>
                      <p class="text-2xs text-gray-500">Official Chat Completions API</p>
                    </div>
                  </div>
                  <span :class="getProviderStatusBadgeClass('OPENAI')" class="rounded px-2 py-0.5 text-2xs font-semibold">
                    {{ getProviderStatusText('OPENAI') }}
                  </span>
                </div>
                <div>
                  <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">OpenAI API Key</label>
                  <input
                    v-model="aiConfig.openai_api_key"
                    type="password"
                    :placeholder="aiConfig.openai_configured ? '•••••••••••• (Tersimpan)' : 'Masukkan sk-proj-...'"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Model Default</label>
                    <select
                      v-model="aiConfig.openai_model"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini</option>
                      <option value="gpt-4o">gpt-4o</option>
                      <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Base URL</label>
                    <input
                      v-model="aiConfig.openai_base_url"
                      type="text"
                      placeholder="https://api.openai.com/v1"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- 3. Anthropic Claude -->
              <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🎭</span>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900 dark:text-white">Anthropic Claude</h4>
                      <p class="text-2xs text-gray-500">Claude 3.5 Sonnet / Haiku</p>
                    </div>
                  </div>
                  <span :class="getProviderStatusBadgeClass('CLAUDE')" class="rounded px-2 py-0.5 text-2xs font-semibold">
                    {{ getProviderStatusText('CLAUDE') }}
                  </span>
                </div>
                <div>
                  <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Anthropic API Key</label>
                  <input
                    v-model="aiConfig.claude_api_key"
                    type="password"
                    :placeholder="aiConfig.claude_configured ? '•••••••••••• (Tersimpan)' : 'Masukkan sk-ant-...'"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Model Default</label>
                  <select
                    v-model="aiConfig.claude_model"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet-20241022</option>
                    <option value="claude-3-haiku-20240307">claude-3-haiku-20240307</option>
                  </select>
                </div>
              </div>

              <!-- 4. DeepSeek -->
              <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-3 bg-gray-50/50 dark:bg-gray-800/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">⚡</span>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900 dark:text-white">DeepSeek</h4>
                      <p class="text-2xs text-gray-500">DeepSeek-V3 / Coder</p>
                    </div>
                  </div>
                  <span :class="getProviderStatusBadgeClass('DEEPSEEK')" class="rounded px-2 py-0.5 text-2xs font-semibold">
                    {{ getProviderStatusText('DEEPSEEK') }}
                  </span>
                </div>
                <div>
                  <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">DeepSeek API Key</label>
                  <input
                    v-model="aiConfig.deepseek_api_key"
                    type="password"
                    :placeholder="aiConfig.deepseek_configured ? '•••••••••••• (Tersimpan)' : 'Masukkan sk-...'"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Model Default</label>
                    <select
                      v-model="aiConfig.deepseek_model"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="deepseek-chat">deepseek-chat</option>
                      <option value="deepseek-coder">deepseek-coder</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Base URL</label>
                    <input
                      v-model="aiConfig.deepseek_base_url"
                      type="text"
                      placeholder="https://api.deepseek.com/v1"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- 5. Ollama (Local AI) -->
              <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-3 bg-gray-50/50 dark:bg-gray-800/30 md:col-span-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🦙</span>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900 dark:text-white">Ollama Local AI (On-Premises / Offline)</h4>
                      <p class="text-2xs text-gray-500">Menjalankan LLM lokal tanpa internet di server perusahaan (Privacy-first)</p>
                    </div>
                  </div>
                  <span class="rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 text-2xs font-semibold">
                    Self-Hosted
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Ollama Base URL</label>
                    <input
                      v-model="aiConfig.ollama_base_url"
                      type="text"
                      placeholder="http://localhost:11434"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                    />
                    <p class="text-2xs text-gray-400 mt-1">Default Ollama lokal: http://localhost:11434</p>
                  </div>
                  <div>
                    <label class="block text-2xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Model Name</label>
                    <input
                      v-model="aiConfig.ollama_model"
                      type="text"
                      placeholder="llama3"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                    />
                    <p class="text-2xs text-gray-400 mt-1">Contoh: llama3, mistral, qwen2.5, deepseek-r1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal Tambah / Edit Prompt -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'create' ? 'Tambah Prompt Preset Baru' : 'Edit Prompt Preset' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePrompt" class="space-y-4 my-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Prompt</label>
            <input
              v-model="formData.title"
              type="text"
              required
              placeholder="Contoh: Analisis Kinerja Karyawan Tahunan"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Modul Terkait</label>
              <select
                v-model="formData.module"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="HR & Payroll">HR & Payroll</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Sales & CRM">Sales & CRM</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target AI Model</label>
              <select
                v-model="formData.model"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
            <input
              v-model="formData.description"
              type="text"
              placeholder="Kegunaan prompt ini..."
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Instruksi Prompt</label>
            <textarea
              v-model="formData.prompt"
              rows="4"
              required
              placeholder="Tuliskan prompt AI dengan variabel {{nama_variabel}}..."
              class="w-full font-mono text-xs rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              class="rounded-lg bg-brand-500 px-5 py-2 text-xs font-medium text-white hover:bg-brand-600"
            >
              Simpan Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { artificialIntelligenceService, type AIConfigData } from '@/services/core/ai.service'

const activeView = ref<'library' | 'simulator' | 'settings'>('library')

const providerList = [
  { key: 'GEMINI', name: 'Google Gemini', icon: '✨', desc: '1M Context, Cepat & Cerdas' },
  { key: 'OPENAI', name: 'OpenAI GPT', icon: '🧠', desc: 'GPT-4o & Mini Standard' },
  { key: 'CLAUDE', name: 'Anthropic Claude', icon: '🎭', desc: 'Penalaran & Analisis Mendalam' },
  { key: 'DEEPSEEK', name: 'DeepSeek', icon: '⚡', desc: 'Performa Tinggi & Hemat' },
  { key: 'OLLAMA', name: 'Ollama Local', icon: '🦙', desc: 'Offline On-Premises Privacy' },
]

const aiConfig = ref<AIConfigData>({
  active_provider: 'GEMINI',
  gemini_api_key: '',
  gemini_model: 'gemini-1.5-flash',
  gemini_configured: false,
  openai_api_key: '',
  openai_model: 'gpt-4o-mini',
  openai_base_url: 'https://api.openai.com/v1',
  openai_configured: false,
  claude_api_key: '',
  claude_model: 'claude-3-5-sonnet-20241022',
  claude_configured: false,
  deepseek_api_key: '',
  deepseek_model: 'deepseek-chat',
  deepseek_base_url: 'https://api.deepseek.com/v1',
  deepseek_configured: false,
  ollama_base_url: 'http://localhost:11434',
  ollama_model: 'llama3',
  ollama_configured: true,
})

const isSavingConfig = ref(false)
const configSaveSuccess = ref(false)

const prompts = ref<any[]>([])
const isLoading = ref(false)

// Simulator state
const selectedPromptId = ref<number>(1)
const simProvider = ref<string>('GEMINI')
const simModel = ref<string>('gemini-1.5-flash')
const simSystemPrompt = ref<string>('')
const simUserInput = ref<string>('')
const simResult = ref<string>('')
const isGenerating = ref<boolean>(false)
const simMeta = ref<{ model_version?: string; latency_ms?: number; tokens_used?: number; is_live?: boolean } | null>(null)

// Modal state
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formData = ref<any>({
  title: '',
  module: 'HR & Payroll',
  model: 'Gemini 1.5 Pro',
  description: '',
  prompt: ''
})

const availableModelsFor = (provider: string): string[] => {
  switch (provider) {
    case 'GEMINI':
      return ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp']
    case 'OPENAI':
      return ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']
    case 'CLAUDE':
      return ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307']
    case 'DEEPSEEK':
      return ['deepseek-chat', 'deepseek-coder']
    case 'OLLAMA':
      return ['llama3', 'mistral', 'qwen2.5', 'deepseek-r1']
    default:
      return ['default-model']
  }
}

const onSimProviderChange = () => {
  const models = availableModelsFor(simProvider.value)
  if (models.length > 0) {
    simModel.value = models[0]
  }
}

const getActiveProviderLabel = (): string => {
  const found = providerList.find(p => p.key === aiConfig.value.active_provider)
  return found ? found.name : aiConfig.value.active_provider
}

const getActiveModelLabel = (): string => {
  switch (aiConfig.value.active_provider) {
    case 'GEMINI': return aiConfig.value.gemini_model || 'gemini-1.5-flash'
    case 'OPENAI': return aiConfig.value.openai_model || 'gpt-4o-mini'
    case 'CLAUDE': return aiConfig.value.claude_model || 'claude-3-5-sonnet'
    case 'DEEPSEEK': return aiConfig.value.deepseek_model || 'deepseek-chat'
    case 'OLLAMA': return aiConfig.value.ollama_model || 'llama3'
    default: return 'Default Model'
  }
}

const isProviderConfigured = (key: string): boolean => {
  switch (key) {
    case 'GEMINI': return !!aiConfig.value.gemini_configured
    case 'OPENAI': return !!aiConfig.value.openai_configured
    case 'CLAUDE': return !!aiConfig.value.claude_configured
    case 'DEEPSEEK': return !!aiConfig.value.deepseek_configured
    case 'OLLAMA': return true
    default: return false
  }
}

const getConfiguredProvidersCount = (): number => {
  let count = 1 // Ollama is always available locally
  if (aiConfig.value.gemini_configured) count++
  if (aiConfig.value.openai_configured) count++
  if (aiConfig.value.claude_configured) count++
  if (aiConfig.value.deepseek_configured) count++
  return count
}

const getProviderStatusBadgeClass = (key: string): string => {
  if (key === 'OLLAMA') return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  if (isProviderConfigured(key)) {
    return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
  }
  return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
}

const getProviderStatusText = (key: string): string => {
  if (key === 'OLLAMA') return 'Siap Digunakan'
  const isEnv = (key === 'GEMINI' && aiConfig.value.gemini_from_env) ||
    (key === 'OPENAI' && aiConfig.value.openai_from_env) ||
    (key === 'CLAUDE' && aiConfig.value.claude_from_env) ||
    (key === 'DEEPSEEK' && aiConfig.value.deepseek_from_env)

  if (isEnv) return 'Terhubung (.env)'
  if (isProviderConfigured(key)) return 'Terhubung (DB)'
  return 'Belum Dikonfigurasi'
}

const getCategoryBadgeClass = (module: string) => {
  switch (module) {
    case 'HR & Payroll': return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
    case 'Finance & Accounting': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
    case 'Supply Chain': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
    case 'Sales & CRM': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
  }
}

const fetchAIConfig = async () => {
  try {
    const data = await artificialIntelligenceService.getConfig()
    if (data) {
      aiConfig.value = {
        ...aiConfig.value,
        ...data,
      }
      simProvider.value = data.active_provider || 'GEMINI'
      onSimProviderChange()
    }
  } catch (err) {
    console.error('Error fetching AI configuration:', err)
  }
}

const saveAIConfigurations = async () => {
  isSavingConfig.value = true
  configSaveSuccess.value = false
  try {
    await artificialIntelligenceService.saveConfig(aiConfig.value)
    configSaveSuccess.value = true
    setTimeout(() => {
      configSaveSuccess.value = false
    }, 4000)
    await fetchAIConfig()
  } catch (err: any) {
    alert('Gagal menyimpan konfigurasi AI: ' + (err.response?.data?.message || err.message))
  } finally {
    isSavingConfig.value = false
  }
}

const fetchPrompts = async () => {
  isLoading.value = true
  try {
    const res = await artificialIntelligenceService.getAll()
    const list = Array.isArray(res) ? res : (res as any)?.data || []
    prompts.value = list.map((item: any) => ({
      id: item.id,
      title: item.title || item.name || 'AI Prompt',
      module: item.module || 'HR & Payroll',
      model: item.model || 'Gemini 1.5 Pro',
      description: item.description || '-',
      tags: ['data_input', 'parameter'],
      system: item.system || item.system_prompt || '',
      sampleInput: item.sampleInput || item.sample_input || 'Input kasus pengujian...',
      sampleOutput: item.sampleOutput || item.sample_output || '<p>Hasil analisis generatif AI telah siap.</p>',
      icon: item.icon || '✨'
    }))
    if (prompts.value.length > 0) {
      selectedPromptId.value = prompts.value[0].id
      onPromptSelected()
    }
  } catch (err) {
    console.error('Error fetching AI prompts:', err)
  } finally {
    isLoading.value = false
  }
}

const onPromptSelected = () => {
  const p = prompts.value.find(item => item.id === selectedPromptId.value)
  if (p) {
    simSystemPrompt.value = p.system
    simUserInput.value = p.sampleInput
    simResult.value = p.sampleOutput
  }
}

const runInSimulator = (p: any) => {
  selectedPromptId.value = p.id
  simSystemPrompt.value = p.system
  simUserInput.value = p.sampleInput
  simResult.value = p.sampleOutput
  activeView.value = 'simulator'
}

const executeAiSimulation = async () => {
  isGenerating.value = true
  simMeta.value = null
  try {
    const res = await artificialIntelligenceService.generate({
      prompt_id: selectedPromptId.value,
      provider: simProvider.value,
      model: simModel.value,
      system: simSystemPrompt.value,
      input: simUserInput.value
    })
    simResult.value = res?.result || '<p>Analisis AI berhasil diproses.</p>'
    simMeta.value = {
      model_version: res?.model_version,
      latency_ms: res?.latency_ms,
      tokens_used: res?.tokens_used,
      is_live: res?.is_live,
    }
  } catch (err: any) {
    alert('Gagal mengeksekusi AI: ' + (err.response?.data?.message || err.message))
  } finally {
    isGenerating.value = false
  }
}

const copySimResult = () => {
  navigator.clipboard.writeText(simResult.value.replace(/<[^>]*>/g, ''))
  alert('Rangkuman AI berhasil disalin ke papan klip.')
}

const openModal = (mode: 'create' | 'edit', data: any = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data, prompt: data.system || '' }
  } else {
    formData.value = {
      title: '',
      module: 'HR & Payroll',
      model: 'Gemini 1.5 Pro',
      description: '',
      prompt: ''
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const deletePrompt = async (p: any) => {
  if (!confirm(`Hapus template prompt "${p.title}"?`)) return
  try {
    await artificialIntelligenceService.delete(p.id)
    await fetchPrompts()
  } catch (err: any) {
    alert('Gagal menghapus prompt: ' + (err.response?.data?.message || err.message))
  }
}

const savePrompt = async () => {
  try {
    if (modalMode.value === 'edit') {
      await artificialIntelligenceService.update(formData.value.id, {
        title: formData.value.title,
        name: formData.value.title,
        module: formData.value.module,
        model: formData.value.model,
        description: formData.value.description,
        system: formData.value.prompt,
        system_prompt: formData.value.prompt
      })
    } else {
      await artificialIntelligenceService.create({
        title: formData.value.title,
        name: formData.value.title,
        module: formData.value.module,
        model: formData.value.model,
        description: formData.value.description,
        system: formData.value.prompt,
        system_prompt: formData.value.prompt,
        sampleInput: 'Input kasus pengujian...',
        sampleOutput: '<p>Hasil analisis generatif AI telah siap.</p>',
        icon: '✨'
      })
    }
    closeModal()
    await fetchPrompts()
  } catch (err: any) {
    alert('Gagal menyimpan prompt: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchAIConfig()
  fetchPrompts()
})
</script>
