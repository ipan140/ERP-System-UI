
<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <module-metrics />
        <monthly-target />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-sale />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ModuleMetrics from '@/components/supply_chain/Supply_chainMetrics.vue'
import MonthlyTarget from '@/components/supply_chain/MonthlySale.vue'
import MonthlySale from '@/components/supply_chain/MonthlyTarget.vue'
import CustomerDemographic from '@/components/supply_chain/CustomerDemographic.vue'
import StatisticsChart from '@/components/supply_chain/StatisticsChart.vue'
import RecentOrders from '@/components/supply_chain/RecentOrders.vue'

export default {
  components: {
    AdminLayout,
    'module-metrics': ModuleMetrics,
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'DashboardSupplyChain',
}
</script>
