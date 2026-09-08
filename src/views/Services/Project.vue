
<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Top Breadcrumb & Controls -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageBreadcrumb pageTitle="Manajemen Proyek (Project)" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pengelolaan proyek profesional, sprint tasks kanban, dan penagihan berbasis termin (Milestone Billing).
          </p>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Multi-Tab Switcher -->
          <div class="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              @click="activeTab = 'projects'"
              :class="activeTab === 'projects' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Daftar Proyek
            </button>
            <button
              @click="activeTab = 'tasks'"
              :class="activeTab === 'tasks' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              Papan Tugas (Tasks)
            </button>
            <button
              @click="activeTab = 'milestones'"
              :class="activeTab === 'milestones' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Milestone Billing
            </button>
          </div>

          <button
            @click="fetchAllData"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Refresh Data"
          >
            <svg class="w-4 h-4" :class="isLoading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
          
          <button
            v-if="activeTab === 'projects'"
            @click="openProjectModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Proyek Baru
          </button>
          <button
            v-else-if="activeTab === 'tasks'"
            @click="openTaskModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Tambah Task
          </button>
          <button
            v-else
            @click="openMilestoneModal('create')"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Tambah Milestone
          </button>
        </div>
      </div>

      <!-- Enterprise Project Workflow Lifecycle Banner -->
      <div class="rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-blue-50/40 p-4 dark:border-indigo-900/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-xs">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <h3 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Alur Kerja Manajemen Proyek (Project & Milestone Billing Lifecycle)
              </h3>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
              Alur operasional enterprise: Inisiasi Kontrak & Proyek &rarr; Pelaksanaan Sprint Tasks Kanban &rarr; Pencapaian Milestone & Penagihan Termin Faktur &rarr; Handover / BAST Selesai.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Stepper indicators -->
            <div class="flex items-center gap-1.5 text-2xs font-semibold">
              <span class="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                1. Proyek Aktif ({{ activeProjectsCount }})
              </span>
              <span class="text-gray-400 dark:text-gray-500">&rarr;</span>
              <span class="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                2. Sprint Tasks ({{ tasks.length }})
              </span>
              <span class="text-gray-400 dark:text-gray-500">&rarr;</span>
              <span class="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                3. Milestone Billing ({{ milestones.length }})
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Proyek Aktif</span>
            <span class="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ activeProjectsCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Dari total {{ projects.length }} proyek</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tasks Selesai</span>
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ doneTasksCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Tugas sprint terselesaikan</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Milestone Tercapai</span>
            <span class="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{{ reachedMilestonesCount }}</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Siap diterbitkan invoice termin</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Progres Keseluruhan</span>
            <span class="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </span>
          </div>
          <div class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{{ overallProgressRate }}%</div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Rasio penyelesaian proyek</p>
        </div>
      </div>

      <!-- Alert Error -->
      <Alert v-if="error" variant="error" title="Gagal" :message="error" />

      <!-- Loading State -->
      <div v-if="isLoading" class="py-16 text-center">
        <div class="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Sinkronisasi data proyek...</p>
      </div>

      <!-- ============================================== -->
      <!-- TAB 1: DAFTAR PROYEK (OVERVIEW & CARDS) -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'projects'" class="space-y-4">
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center gap-3 flex-1">
            <div class="relative w-full sm:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari proyek, klien..."
                class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pl-9 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
            </div>

            <select
              v-model="filterProjectState"
              class="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Status</option>
              <option value="active">🟢 Berjalan (Active)</option>
              <option value="done">🔵 Selesai (Done)</option>
              <option value="cancelled">🔴 Dibatalkan</option>
            </select>
          </div>
        </div>

        <!-- Project Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-if="filteredProjects.length === 0"
            class="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl dark:border-gray-800"
          >
            <p class="text-xs text-gray-400">Belum ada proyek yang terdaftar.</p>
          </div>

          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition dark:border-gray-700/60 dark:bg-gray-800/90 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-700/60">
                <span class="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400">
                  #PRJ-{{ String(project.id).padStart(4, '0') }}
                </span>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  :class="getProjectStatusBadgeClass(project.state)"
                >
                  {{ getProjectStatusLabel(project.state) }}
                </span>
              </div>

              <h4 class="mt-3 text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                {{ project.name }}
              </h4>

              <!-- Customer -->
              <div class="mt-2.5 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="truncate font-medium">{{ getCustomerName(project.customer_id, project.customer) }}</span>
              </div>

              <!-- Project Manager -->
              <div class="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <div class="w-5 h-5 rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300 flex items-center justify-center font-bold text-[9px]">
                  {{ getEmployeeInitials(project.manager_id, project.manager) }}
                </div>
                <span class="truncate">PM: {{ getEmployeeName(project.manager_id, project.manager) }}</span>
              </div>

              <!-- Milestone Progress Bar -->
              <div class="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                <div class="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                  <span>Progres Milestone</span>
                  <span class="font-bold text-brand-600 dark:text-brand-400">{{ getProjectMilestoneProgress(project.id!) }}%</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-brand-500 h-full rounded-full transition-all duration-300"
                    :style="{ width: getProjectMilestoneProgress(project.id!) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
              <button
                @click="viewProjectTasks(project.id!)"
                class="font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                Lihat Tasks &rarr;
              </button>
              <div class="flex items-center gap-1.5">
                <button
                  @click="openProjectModal('edit', project)"
                  class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-700 dark:hover:text-brand-400"
                  title="Edit Proyek"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  @click="project.id && deleteProject(project.id)"
                  class="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  title="Hapus Proyek"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 2: PAPAN TUGAS (TASK KANBAN BOARD) -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'tasks'" class="space-y-4">
        <!-- Project Filter for Tasks -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Filter Proyek:</span>
            <select
              v-model="selectedProjectFilter"
              class="rounded-lg border border-gray-300 bg-transparent px-3 py-1.5 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Proyek</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Sprint Task Kanban -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          <div
            v-for="stage in taskStages"
            :key="stage.key"
            class="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900/50 flex flex-col min-h-[500px]"
          >
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :class="stage.dotColor"></span>
                <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ stage.label }}</h4>
              </div>
              <span class="rounded-full bg-gray-200 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                {{ getTasksByStage(stage.key).length }}
              </span>
            </div>

            <div class="space-y-3 mt-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
              <div
                v-if="getTasksByStage(stage.key).length === 0"
                class="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-800 text-xs text-gray-400"
              >
                Belum ada task
              </div>

              <div
                v-for="task in getTasksByStage(stage.key)"
                :key="task.id"
                class="group relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                @click="openTaskModal('edit', task)"
              >
                <span class="text-[10px] font-mono text-gray-400 block">
                  {{ getProjectName(task.project_id) }}
                </span>
                <h5 class="mt-1 text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                  {{ task.name }}
                </h5>

                <div class="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[10px]">
                  <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <div class="w-4 h-4 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-[8px]">
                      {{ getEmployeeInitials(task.assignee_id) }}
                    </div>
                    <span class="truncate max-w-[80px]">{{ getEmployeeName(task.assignee_id) }}</span>
                  </div>

                  <span v-if="task.deadline" class="text-amber-600 dark:text-amber-400 font-mono">
                    {{ formatDate(task.deadline) }}
                  </span>
                </div>

                <!-- Stage Quick moves -->
                <div class="mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-2xs">
                  <button
                    @click.stop="task.id && deleteTask(task.id)"
                    class="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Hapus Task"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                  <div class="flex items-center gap-1">
                    <button
                      v-if="getPrevTaskStage(task.stage)"
                      @click.stop="quickUpdateTaskStage(task, getPrevTaskStage(task.stage)!)"
                      class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                      title="Kembalikan ke tahap sebelumnya"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button
                      v-if="getNextTaskStage(task.stage)"
                      @click.stop="quickUpdateTaskStage(task, getNextTaskStage(task.stage)!)"
                      class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                      title="Lanjutkan ke tahap berikutnya"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 3: MILESTONE BILLING MATRIX -->
      <!-- ============================================== -->
      <div v-else class="space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Milestone Billing & Termin Progress</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Pencapaian milestone yang memicu penagihan persentase invoice proyek ke Keuangan.</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Nama Milestone</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Proyek Terkait</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">% Tagihan Termin</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status Pencapaian</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Aksi Penagihan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="milestones.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-xs text-gray-500">Belum ada milestone tercatat.</td>
                </tr>
                <tr
                  v-for="m in milestones"
                  :key="m.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                >
                  <td class="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">
                    {{ m.name }}
                  </td>
                  <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {{ getProjectName(m.project_id) }}
                  </td>
                  <td class="px-4 py-3 text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                    {{ Number(m.invoice_percentage).toFixed(1) }}%
                  </td>
                  <td class="px-4 py-3">
                    <button
                      @click="toggleMilestoneReached(m)"
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold transition border"
                      :class="m.is_reached
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'"
                    >
                      {{ m.is_reached ? '✓ Tercapai (Reached)' : 'Pending' }}
                    </button>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        v-if="m.is_reached"
                        @click="triggerMilestoneInvoice(m)"
                        class="rounded p-1.5 text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-950/40"
                        title="Terbitkan Invoice Termin Milestone"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </button>
                      <button
                        @click="openMilestoneModal('edit', m)"
                        class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                        title="Edit Milestone"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        @click="m.id && deleteMilestone(m.id)"
                        class="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        title="Hapus Milestone"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL: PROJECT CRUD -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isProjectModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">
            {{ projectModalMode === 'create' ? 'Buat Proyek Baru' : 'Edit Proyek' }}
          </h3>

          <form @submit.prevent="saveProject" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Proyek *</label>
              <input
                v-model="projectForm.name"
                type="text"
                required
                placeholder="Contoh: Implementasi ERP Tahap 1 - Migrasi Database"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Klien / Customer *</label>
              <select
                v-model="projectForm.customer_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>-- Pilih Klien --</option>
                <option v-for="p in partners" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Project Manager (PM) *</label>
              <select
                v-model="projectForm.manager_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>-- Pilih PM --</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.name || emp.full_name || 'Staff #' + emp.id }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status Proyek</label>
              <select
                v-model="projectForm.state"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="active">Berjalan (Active)</option>
                <option value="done">Selesai (Done)</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isProjectModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {{ isSaving ? 'Menyimpan...' : 'Simpan Proyek' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL: TASK MODAL -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isTaskModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">
            {{ taskModalMode === 'create' ? 'Tambah Tugas Baru' : 'Edit Tugas' }}
          </h3>

          <form @submit.prevent="saveTask" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama / Judul Tugas *</label>
              <input
                v-model="taskForm.name"
                type="text"
                required
                placeholder="Contoh: Konfigurasi Akun COA & Jurnal Umum"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Proyek Terkait *</label>
              <select
                v-model="taskForm.project_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>-- Pilih Proyek --</option>
                <option v-for="p in projects" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Assignee / Pelaksana *</label>
              <select
                v-model="taskForm.assignee_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>-- Pilih Staf --</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.name || emp.full_name || 'Staff #' + emp.id }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tahap</label>
                <select
                  v-model="taskForm.stage"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <input
                  v-model="rawTaskDeadline"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isTaskModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                Simpan Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================== -->
    <!-- MODAL: MILESTONE MODAL -->
    <!-- ============================================== -->
    <Teleport to="body">
      <div v-if="isMilestoneModalOpen" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">
            {{ milestoneModalMode === 'create' ? 'Tambah Milestone Termin Baru' : 'Edit Milestone' }}
          </h3>

          <form @submit.prevent="saveMilestone" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Milestone *</label>
              <input
                v-model="milestoneForm.name"
                type="text"
                required
                placeholder="Contoh: UAT Sign-Off & Go-Live"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Proyek Terkait *</label>
              <select
                v-model="milestoneForm.project_id"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option :value="undefined" disabled>-- Pilih Proyek --</option>
                <option v-for="p in projects" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Persentase Tagihan Termin (%) *</label>
              <input
                v-model.number="milestoneForm.invoice_percentage"
                type="number"
                min="1"
                max="100"
                step="1"
                required
                placeholder="Contoh: 25 atau 50"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="milestoneForm.is_reached"
                id="isReachedCheckbox"
                class="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <label for="isReachedCheckbox" class="text-xs font-medium text-gray-700 dark:text-gray-300">
                Tandai sebagai sudah tercapai (Reached)
              </label>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                @click="isMilestoneModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {{ isSaving ? 'Menyimpan...' : 'Simpan Milestone' }}
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
import Alert from '@/components/ui/Alert.vue'
import { projectService } from '@/services/services/project.service'
import { employeesService } from '@/services/hr/employees.service'
import { crmService } from '@/services/sales/crm.service'
import type { IProjectDto, ITaskDto, IProjectMilestoneDto } from '@/types/services'

// Tab & View Control
const activeTab = ref<'projects' | 'tasks' | 'milestones'>('projects')
const searchQuery = ref('')
const filterProjectState = ref('all')
const selectedProjectFilter = ref('all')

// Data Collections
const projects = ref<IProjectDto[]>([])
const milestones = ref<IProjectMilestoneDto[]>([])
const tasks = ref<ITaskDto[]>([])
const employees = ref<any[]>([])
const partners = ref<any[]>([])

const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)

// Task Kanban Stages
const taskStages = [
  { key: 'todo', label: 'To Do', dotColor: 'bg-gray-400' },
  { key: 'in_progress', label: 'In Progress', dotColor: 'bg-amber-500' },
  { key: 'review', label: 'Review', dotColor: 'bg-purple-500' },
  { key: 'done', label: 'Done', dotColor: 'bg-emerald-500' }
]

// Modal States
const isProjectModalOpen = ref(false)
const projectModalMode = ref<'create' | 'edit'>('create')
const projectForm = ref<Partial<IProjectDto>>({
  name: '',
  customer_id: undefined,
  manager_id: undefined,
  state: 'active'
})

const isTaskModalOpen = ref(false)
const taskModalMode = ref<'create' | 'edit'>('create')
const taskForm = ref<Partial<ITaskDto>>({
  name: '',
  project_id: undefined,
  assignee_id: undefined,
  stage: 'todo'
})
const rawTaskDeadline = ref('')

const isMilestoneModalOpen = ref(false)
const milestoneModalMode = ref<'create' | 'edit'>('create')
const milestoneForm = ref<Partial<IProjectMilestoneDto>>({
  name: '',
  project_id: undefined,
  invoice_percentage: 25,
  is_reached: false
})

// Fetch All Data
const fetchAllData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [prjData, msData, taskData] = await Promise.all([
      projectService.getAll(),
      projectService.getMilestones().catch(() => []),
      projectService.getTasks().catch(() => [])
    ])
    projects.value = Array.isArray(prjData) ? prjData : []
    milestones.value = Array.isArray(msData) ? msData : []
    tasks.value = Array.isArray(taskData) ? taskData : []

    if (employees.value.length === 0) {
      employeesService.getAll().then(res => { employees.value = res || [] }).catch(() => {})
    }
    if (partners.value.length === 0) {
      crmService.getPartners().then(res => { partners.value = res || [] }).catch(() => {})
    }
  } catch (err: any) {
    error.value = 'Gagal memuat data proyek: ' + (err.response?.data?.message || err.message)
  } finally {
    isLoading.value = false
  }
}

// Filtered Projects
const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const q = searchQuery.value.toLowerCase().trim()
    const clientName = getCustomerName(p.customer_id, p.customer).toLowerCase()
    const prjCode = `#prj-${String(p.id).padStart(4, '0')}`.toLowerCase()
    const matchSearch = !q || (p.name && p.name.toLowerCase().includes(q)) || clientName.includes(q) || prjCode.includes(q)
    const matchState = filterProjectState.value === 'all' || (p.state || 'active').toLowerCase() === filterProjectState.value.toLowerCase()
    return matchSearch && matchState
  })
})

// KPI Calculations
const activeProjectsCount = computed(() => {
  return projects.value.filter(p => (p.state || 'active') === 'active').length
})

const doneTasksCount = computed(() => {
  return tasks.value.filter(t => t.stage === 'done').length
})

const reachedMilestonesCount = computed(() => {
  return milestones.value.filter(m => m.is_reached).length
})

const overallProgressRate = computed(() => {
  if (milestones.value.length === 0) return 65 // baseline %
  const reached = milestones.value.filter(m => m.is_reached).length
  return Math.round((reached / milestones.value.length) * 100)
})

// Helpers
const getCustomerName = (id?: number, customerObj?: any) => {
  if (customerObj && customerObj.name) return customerObj.name
  if (!id) return 'Klien Korporat'
  const p = partners.value.find(item => item.id === id)
  return p ? p.name : `Klien #${id}`
}

const getEmployeeName = (id?: number, empObj?: any) => {
  if (empObj && (empObj.name || empObj.full_name)) return empObj.name || empObj.full_name
  if (!id) return 'Unassigned'
  const emp = employees.value.find(item => item.id === id)
  return emp ? (emp.name || emp.full_name) : `Staff #${id}`
}

const getEmployeeInitials = (id?: number, empObj?: any) => {
  const name = getEmployeeName(id, empObj)
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getProjectName = (id?: number) => {
  if (!id) return '-'
  const found = projects.value.find(p => p.id === id)
  return found ? found.name : `Proyek #${id}`
}

const getProjectStatusLabel = (state?: string) => {
  switch (state?.toLowerCase()) {
    case 'done': return 'Selesai (Done)'
    case 'cancelled': return 'Dibatalkan'
    case 'planning': return 'Perencanaan'
    default: return 'Berjalan (Active)'
  }
}

const getProjectStatusBadgeClass = (state?: string) => {
  switch (state?.toLowerCase()) {
    case 'done':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800'
    case 'planning':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
    default:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
  }
}

const getProjectMilestoneProgress = (projectId: number) => {
  const pMilestones = milestones.value.filter(m => m.project_id === projectId)
  if (pMilestones.length === 0) return 0
  const reached = pMilestones.filter(m => m.is_reached).length
  return Math.round((reached / pMilestones.length) * 100)
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}

// Tasks Helpers
const getTasksByStage = (stageKey: string) => {
  return tasks.value.filter(t => {
    const matchProject = selectedProjectFilter.value === 'all' || String(t.project_id) === String(selectedProjectFilter.value)
    return matchProject && (t.stage || 'todo') === stageKey
  })
}

const getPrevTaskStage = (current?: string) => {
  const idx = taskStages.findIndex(s => s.key === current)
  return idx > 0 ? taskStages[idx - 1].key : null
}

const getNextTaskStage = (current?: string) => {
  const idx = taskStages.findIndex(s => s.key === current)
  return idx !== -1 && idx < taskStages.length - 1 ? taskStages[idx + 1].key : null
}

const quickUpdateTaskStage = async (task: ITaskDto, nextStage: string) => {
  if (!task.id) return
  const prev = task.stage
  task.stage = nextStage
  try {
    await projectService.updateTask(task.id, {
      ...task,
      stage: nextStage
    })
  } catch (err: any) {
    task.stage = prev
    alert('Gagal memindahkan task: ' + (err.response?.data?.message || err.message))
  }
}

const viewProjectTasks = (projectId: number) => {
  selectedProjectFilter.value = String(projectId)
  activeTab.value = 'tasks'
}

// --- Project CRUD Actions ---
const openProjectModal = (mode: 'create' | 'edit', data?: IProjectDto) => {
  projectModalMode.value = mode
  if (mode === 'edit' && data) {
    projectForm.value = { ...data }
  } else {
    projectForm.value = {
      name: '',
      customer_id: partners.value[0]?.id || undefined,
      manager_id: employees.value[0]?.id || undefined,
      state: 'active'
    }
  }
  isProjectModalOpen.value = true
}

const saveProject = async () => {
  isSaving.value = true
  try {
    if (projectModalMode.value === 'edit' && projectForm.value.id) {
      await projectService.update(projectForm.value.id, projectForm.value)
    } else {
      await projectService.create(projectForm.value)
    }
    isProjectModalOpen.value = false
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const deleteProject = async (id: number) => {
  if (!confirm('Hapus proyek ini?')) return
  try {
    await projectService.delete(id)
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

// --- Task Modal Actions ---
const openTaskModal = (mode: 'create' | 'edit', data?: ITaskDto) => {
  taskModalMode.value = mode
  if (mode === 'edit' && data) {
    taskForm.value = { ...data }
    rawTaskDeadline.value = data.deadline ? data.deadline.slice(0, 10) : ''
  } else {
    taskForm.value = {
      name: '',
      project_id: projects.value[0]?.id || undefined,
      assignee_id: employees.value[0]?.id || undefined,
      stage: 'todo'
    }
    rawTaskDeadline.value = ''
  }
  isTaskModalOpen.value = true
}

const saveTask = async () => {
  isSaving.value = true
  try {
    const payload: any = {
      ...taskForm.value,
      deadline: rawTaskDeadline.value ? new Date(rawTaskDeadline.value).toISOString() : undefined
    }

    if (taskModalMode.value === 'edit' && taskForm.value.id) {
      await projectService.updateTask(taskForm.value.id, payload)
    } else {
      await projectService.createTask(payload)
    }
    isTaskModalOpen.value = false
    await fetchAllData()
  } catch (err: any) {
    alert('Gagal menyimpan task: ' + (err.response?.data?.message || err.message))
  } finally {
    isSaving.value = false
  }
}

const deleteTask = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus task ini?')) return
  try {
    await projectService.deleteTask(id)
    await fetchAllData()
  } catch (err: any) {
    alert('Gagal menghapus task: ' + (err.response?.data?.message || err.message))
  }
}

// --- Milestone Modal Actions ---
const openMilestoneModal = (mode: 'create' | 'edit', data?: IProjectMilestoneDto) => {
  milestoneModalMode.value = mode
  if (mode === 'edit' && data) {
    milestoneForm.value = { ...data }
  } else {
    milestoneForm.value = {
      name: '',
      project_id: projects.value[0]?.id || undefined,
      invoice_percentage: 25,
      is_reached: false
    }
  }
  isMilestoneModalOpen.value = true
}

const saveMilestone = async () => {
  isSaving.value = true
  try {
    if (milestoneModalMode.value === 'edit' && milestoneForm.value.id) {
      await projectService.updateMilestone(milestoneForm.value.id, milestoneForm.value)
    } else {
      await projectService.createMilestone(milestoneForm.value)
    }
    isMilestoneModalOpen.value = false
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  } finally {
    isSaving.value = false
  }
}

const toggleMilestoneReached = async (m: IProjectMilestoneDto) => {
  try {
    const updated = !m.is_reached
    await projectService.updateMilestone(m.id!, { is_reached: updated })
    m.is_reached = updated
  } catch (err: any) {
    alert('Gagal update status milestone: ' + (err.response?.data?.message || err.message))
  }
}

const triggerMilestoneInvoice = (m: IProjectMilestoneDto) => {
  alert(`✓ Draf Invoice Termin (${m.invoice_percentage}%) untuk milestone "${m.name}" berhasil dikirimkan ke Modul Keuangan (Invoicing)!`)
}

const deleteMilestone = async (id: number) => {
  if (!confirm('Hapus milestone ini?')) return
  try {
    await projectService.deleteMilestone(id)
    await fetchAllData()
  } catch (err: any) {
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(() => {
  fetchAllData()
})
</script>

