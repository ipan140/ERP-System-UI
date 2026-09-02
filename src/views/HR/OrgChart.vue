<template>
  <AdminLayout>
    <div class="p-6 h-[calc(100vh-80px)] flex flex-col">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <PageBreadcrumb pageTitle="Org Chart Viewer" />
        </div>
      </div>

      <div class="flex-grow rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden relative">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-10 bg-white/50 dark:bg-gray-800/50">
          <div class="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Alert v-else-if="error" variant="error" title="Gagal Memuat" :message="error" class="m-4" />
        
        <VueFlow v-else :nodes-connectable="false" :nodes="nodes" :edges="edges" :default-viewport="{ zoom: 0.8 }" fit-view-on-init class="vue-flow-wrapper">
          <template #node-custom="props">
            <div :class="[
                'border-2 rounded-xl shadow-sm p-4 w-64 text-center cursor-grab transition-colors relative',
                props.data.isManager 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 hover:border-amber-500' 
                  : 'bg-white dark:bg-gray-800 border-brand-200 dark:border-brand-800 hover:border-brand-500'
              ]">
              <Handle type="target" :position="Position.Top" :class="['!w-3 !h-3 border-2 border-white dark:border-gray-800', props.data.isManager ? '!bg-amber-500' : '!bg-brand-500']" />
              
              <div :class="[
                'w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-lg mb-2 shadow-sm',
                props.data.isManager ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300' : 'bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-300'
              ]">
                {{ props.data.name ? props.data.name.substring(0,2).toUpperCase() : 'EM' }}
              </div>
              
              <h4 class="font-bold text-gray-900 dark:text-white truncate">{{ props.data.name }}</h4>
              
              <div :class="[
                'mt-2 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                props.data.isManager ? 'bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-100' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              ]">
                {{ props.data.position }}
              </div>
              
              <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 truncate">{{ props.data.department }}</p>
              
              <Handle type="source" :position="Position.Bottom" :class="['!w-3 !h-3 border-2 border-white dark:border-gray-800', props.data.isManager ? '!bg-amber-500' : '!bg-brand-500']" />
            </div>
          </template>
          <Background pattern-color="#888" :gap="20" />
          <Controls />
        </VueFlow>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Alert from '@/components/ui/Alert.vue'
import { http } from '@/services/http'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { Handle, Position } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import dagre from 'dagre'

const nodes = ref<any[]>([])
const edges = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const buildGraph = (employees: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 100 })

  const flowNodes: any[] = []
  const flowEdges: any[] = []

  employees.forEach(emp => {
    // Add to dagre for layout
    dagreGraph.setNode(emp.id.toString(), { width: 260, height: 140 })

    
    const posName = (emp.job_position?.name || 'Staff').toLowerCase()
    const isManager = posName.includes('manager') || posName.includes('director') || posName.includes('ceo') || posName.includes('lead') || posName.includes('head') || posName.includes('chief')

    flowNodes.push({
      id: emp.id.toString(),
      type: 'custom',
      data: { 
        name: emp.name, 
        position: emp.job_position?.name || 'Staff',
        department: emp.department?.name || '',
        isManager: isManager
      }
    })

    if (emp.manager_id) {
      dagreGraph.setEdge(emp.manager_id.toString(), emp.id.toString())
      flowEdges.push({
        id: `e${emp.manager_id}-${emp.id}`,
        source: emp.manager_id.toString(),
        target: emp.id.toString(),
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 }
      })
    }
  })

  // Calculate layout
  dagre.layout(dagreGraph)

  // Apply positions
  flowNodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.position = {
      x: nodeWithPosition.x - 130, // center offset
      y: nodeWithPosition.y - 70
    }
  })

  nodes.value = flowNodes
  edges.value = flowEdges
}

const fetchData = async () => {
  try {
    const res = await http.get('/hr/employees')
    const emps = res.data?.data || res.data || []
    buildGraph(emps)
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())
</script>

<style>
.vue-flow-wrapper {
  width: 100%;
  height: 100%;
}
.vue-flow__node-custom {
  /* Prevent default node styling */
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: none;
}
</style>
