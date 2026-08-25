import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Sign In' },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Sign Up' },
    },
    { path: '/profile', name: 'Profile', component: () => import('../views/Core/Profile.vue'), meta: { title: 'User Profile' } },
    {
      path: '/',
      redirect: '/core/dashboard'
    },
    {
      path: '/core/countries',
      name: 'Countries',
      component: () => import('../views/Core/MasterData/Countries.vue'),
      meta: { title: 'Countries' },
    },
    {
      path: '/core/currencies',
      name: 'Currencies',
      component: () => import('../views/Core/MasterData/Currencies.vue'),
      meta: { title: 'Currencies' },
    },
    {
      path: '/core/user-roles',
      name: 'UserRoles',
      component: () => import('../views/Core/Access/UserRoles.vue'),
      meta: { title: 'User Roles' },
    },
    {
      path: '/core/permissions',
      name: 'Permissions',
      component: () => import('../views/Core/Access/Permissions.vue'),
      meta: { title: 'Permissions' },
    },
    {
      path: '/core/discuss',
      name: 'Discuss',
      component: () => import('../views/Core/Communications/Discuss.vue'),
      meta: { title: 'Discuss' },
    },
    {
      path: '/core/mailer',
      name: 'Mailer',
      component: () => import('../views/Core/Communications/Mailer.vue'),
      meta: { title: 'Mailer' },
    },
    {
      path: '/core/voip',
      name: 'Voip',
      component: () => import('../views/Core/Communications/Voip.vue'),
      meta: { title: 'VoIP' },
    },
    {
      path: '/core/whatsapp',
      name: 'Whatsapp',
      component: () => import('../views/Core/Communications/Whatsapp.vue'),
      meta: { title: 'WhatsApp' },
    },
    {
      path: '/core/storage',
      name: 'Storage',
      component: () => import('../views/Core/Documents/Storage.vue'),
      meta: { title: 'Storage' },
    },
    {
      path: '/core/documents',
      name: 'Documents',
      component: () => import('../views/Core/Documents/Documents.vue'),
      meta: { title: 'Documents' },
    },
    {
      path: '/core/report',
      name: 'Report',
      component: () => import('../views/Core/Documents/Report.vue'),
      meta: { title: 'Report' },
    },
    {
      path: '/core/knowledge',
      name: 'Knowledge',
      component: () => import('../views/Core/Advanced/Knowledge.vue'),
      meta: { title: 'Knowledge' },
    },
    {
      path: '/core/iot',
      name: 'Iot',
      component: () => import('../views/Core/Advanced/Iot.vue'),
      meta: { title: 'IoT' },
    },
    {
      path: '/core/ai',
      name: 'ArtificialIntelligence',
      component: () => import('../views/Core/Advanced/ArtificialIntelligence.vue'),
      meta: { title: 'Artificial Intelligence' },
    },
    // FASE 2 ROUTES (HRD)
    {
      path: '/hr/employees',
      name: 'Employees',
      component: () => import('../views/HR/Employees.vue'),
      meta: { title: 'Employees' },
    },
    {
      path: '/hr/recruitment',
      name: 'Recruitment',
      component: () => import('../views/HR/Recruitment.vue'),
      meta: { title: 'Recruitment' },
    },
    {
      path: '/hr/attendances',
      name: 'Attendances',
      component: () => import('../views/HR/Attendances.vue'),
      meta: { title: 'Attendances' },
    },
    {
      path: '/hr/time-off',
      name: 'TimeOff',
      component: () => import('../views/HR/TimeOff.vue'),
      meta: { title: 'Time Off' },
    },
    {
      path: '/hr/appraisals',
      name: 'Appraisals',
      component: () => import('../views/HR/Appraisals.vue'),
      meta: { title: 'Appraisals' },
    },
    {
      path: '/hr/referrals',
      name: 'Referrals',
      component: () => import('../views/HR/Referrals.vue'),
      meta: { title: 'Referrals' },
    },
    {
      path: '/hr/payroll',
      name: 'Payroll',
      component: () => import('../views/HR/Payroll.vue'),
      meta: { title: 'Payroll' },
    },
    {
      path: '/hr/lunch',
      name: 'Lunch',
      component: () => import('../views/HR/Lunch.vue'),
      meta: { title: 'Lunch' },
    },
    {
      path: '/hr/fleet',
      name: 'Fleet',
      component: () => import('../views/HR/Fleet.vue'),
      meta: { title: 'Fleet' },
    },
    // FASE 3 ROUTES (SALES & MARKETING)
    {
      path: '/sales/core',
      name: 'SalesCore',
      component: () => import('../views/Sales/SalesCore.vue'),
      meta: { title: 'Pesanan Penjualan' },
    },
    {
      path: '/sales/pos',
      name: 'SalesPOS',
      component: () => import('../views/Sales/PointOfSale.vue'),
      meta: { title: 'Point of Sale' },
    },
    {
      path: '/sales/subscriptions',
      name: 'SalesSubscriptions',
      component: () => import('../views/Sales/Subscriptions.vue'),
      meta: { title: 'Langganan' },
    },
    {
      path: '/sales/rental',
      name: 'SalesRental',
      component: () => import('../views/Sales/Rental.vue'),
      meta: { title: 'Penyewaan' },
    },
    {
      path: '/marketing/automation',
      name: 'MarketingAutomation',
      component: () => import('../views/Marketing/MarketingAutomation.vue'),
      meta: { title: 'Otomatisasi Pemasaran' },
    },
    {
      path: '/marketing/mass-mailing',
      name: 'MarketingMassMailing',
      component: () => import('../views/Marketing/MassMailing.vue'),
      meta: { title: 'Email Massal' },
    },
    {
      path: '/marketing/sms-marketing',
      name: 'MarketingSms',
      component: () => import('../views/Marketing/SmsMarketing.vue'),
      meta: { title: 'Pemasaran SMS' },
    },
    {
      path: '/marketing/social-marketing',
      name: 'MarketingSocial',
      component: () => import('../views/Marketing/SocialMarketing.vue'),
      meta: { title: 'Media Sosial' },
    },
    {
      path: '/marketing/events',
      name: 'MarketingEvents',
      component: () => import('../views/Marketing/Events.vue'),
      meta: { title: 'Manajemen Acara' },
    },
    {
      path: '/marketing/surveys',
      name: 'MarketingSurveys',
      component: () => import('../views/Marketing/Surveys.vue'),
      meta: { title: 'Survei' },
    },
    // FASE 4 ROUTES (SERVICES)
    {
      path: '/services/appointments',
      name: 'ServicesAppointments',
      component: () => import('../views/Services/Appointments.vue'),
      meta: { title: 'Pemesanan Jadwal' },
    },
    {
      path: '/services/field_service',
      name: 'ServicesFieldService',
      component: () => import('../views/Services/FieldService.vue'),
      meta: { title: 'Layanan Lapangan' },
    },
    {
      path: '/services/helpdesk',
      name: 'ServicesHelpdesk',
      component: () => import('../views/Services/Helpdesk.vue'),
      meta: { title: 'Helpdesk' },
    },
    {
      path: '/services/planning',
      name: 'ServicesPlanning',
      component: () => import('../views/Services/Planning.vue'),
      meta: { title: 'Perencanaan' },
    },
    {
      path: '/services/project',
      name: 'ServicesProject',
      component: () => import('../views/Services/Project.vue'),
      meta: { title: 'Manajemen Proyek' },
    },
    {
      path: '/services/repairs',
      name: 'ServicesRepairs',
      component: () => import('../views/Services/Repairs.vue'),
      meta: { title: 'Reparasi' },
    },
    {
      path: '/services/timesheets',
      name: 'ServicesTimesheets',
      component: () => import('../views/Services/Timesheets.vue'),
      meta: { title: 'Timesheets' },
    },
    // FASE 5 ROUTES (SUPPLY CHAIN)
    {
      path: '/supply_chain/barcode',
      name: 'SupplyChainBarcode',
      component: () => import('../views/SupplyChain/Barcode.vue'),
      meta: { title: 'Barcode' },
    },
    {
      path: '/supply_chain/inventory',
      name: 'SupplyChainInventory',
      component: () => import('../views/SupplyChain/Inventory.vue'),
      meta: { title: 'Gudang & Stok' },
    },
    {
      path: '/supply_chain/maintenance',
      name: 'SupplyChainMaintenance',
      component: () => import('../views/SupplyChain/Maintenance.vue'),
      meta: { title: 'Pemeliharaan' },
    },
    {
      path: '/supply_chain/manufacturing',
      name: 'SupplyChainManufacturing',
      component: () => import('../views/SupplyChain/Manufacturing.vue'),
      meta: { title: 'Produksi' },
    },
    {
      path: '/supply_chain/plm',
      name: 'SupplyChainPlm',
      component: () => import('../views/SupplyChain/Plm.vue'),
      meta: { title: 'PLM' },
    },
    {
      path: '/supply_chain/purchase',
      name: 'SupplyChainPurchase',
      component: () => import('../views/SupplyChain/Purchase.vue'),
      meta: { title: 'Pembelian (PO)' },
    },
    {
      path: '/supply_chain/quality',
      name: 'SupplyChainQuality',
      component: () => import('../views/SupplyChain/Quality.vue'),
      meta: { title: 'Kontrol Kualitas' },
    },
    // FASE 6 ROUTES (FINANCE)
    {
      path: '/finance/invoicing',
      name: 'FinanceInvoicing',
      component: () => import('../views/Finance/Invoicing.vue'),
      meta: { title: 'Faktur & Tagihan' },
    },
    {
      path: '/finance/expenses',
      name: 'FinanceExpenses',
      component: () => import('../views/Finance/Expenses.vue'),
      meta: { title: 'Klaim Pengeluaran' },
    },
    {
      path: '/finance/accounting',
      name: 'FinanceAccounting',
      component: () => import('../views/Finance/Accounting.vue'),
      meta: { title: 'Akuntansi & Buku Besar' },
    },
    {
      path: '/finance/approvals',
      name: 'FinanceApprovals',
      component: () => import('../views/Finance/Approvals.vue'),
      meta: { title: 'Persetujuan Berjenjang' },
    },
    {
      path: '/finance/sign',
      name: 'FinanceSign',
      component: () => import('../views/Finance/Sign.vue'),
      meta: { title: 'Tanda Tangan Digital' },
    },
    {
      path: '/finance/consolidation',
      name: 'FinanceConsolidation',
      component: () => import('../views/Finance/Consolidation.vue'),
      meta: { title: 'Konsolidasi' },
    },
    {
      path: '/finance/spreadsheet_bi',
      name: 'FinanceSpreadsheetBi',
      component: () => import('../views/Finance/SpreadsheetBi.vue'),
      meta: { title: 'Business Intelligence' },
    },
    {
      path: '/finance/documents',
      name: 'FinanceDocuments',
      component: () => import('../views/Finance/Documents.vue'),
      meta: { title: 'Dokumen Keuangan' },
    },
    // FASE 7 ROUTES (WEBSITE)
    {
      path: '/website/ecommerce',
      name: 'WebsiteEcommerce',
      component: () => import('../views/Website/Ecommerce.vue'),
      meta: { title: 'Toko Online (eCommerce)' },
    },
    {
      path: '/website/blog',
      name: 'WebsiteBlog',
      component: () => import('../views/Website/Blog.vue'),
      meta: { title: 'Artikel & Blog' },
    },
    {
      path: '/website/website_builder',
      name: 'WebsiteBuilder',
      component: () => import('../views/Website/WebsiteBuilder.vue'),
      meta: { title: 'Pembuat Web' },
    },
    {
      path: '/website/elearning',
      name: 'WebsiteElearning',
      component: () => import('../views/Website/Elearning.vue'),
      meta: { title: 'e-Learning' },
    },
    {
      path: '/website/forum',
      name: 'WebsiteForum',
      component: () => import('../views/Website/Forum.vue'),
      meta: { title: 'Forum Komunitas' },
    },
    {
      path: '/website/live_chat',
      name: 'WebsiteLiveChat',
      component: () => import('../views/Website/LiveChat.vue'),
      meta: { title: 'Live Chat' },
    },

    // DASHBOARDS
    { path: '/core/dashboard', name: 'CoreDashboard', component: () => import('../views/Core/Dashboard.vue'), meta: { title: 'Dashboard Pengaturan' } },
    { path: '/hr/dashboard', name: 'HRDashboard', component: () => import('../views/HR/Dashboard.vue'), meta: { title: 'Dashboard HRD' } },
    { path: '/sales/dashboard', name: 'SalesDashboard', component: () => import('../views/Sales/Dashboard.vue'), meta: { title: 'Dashboard Penjualan' } },
    { path: '/marketing/dashboard', name: 'MarketingDashboard', component: () => import('../views/Marketing/Dashboard.vue'), meta: { title: 'Dashboard Pemasaran' } },
    { path: '/services/dashboard', name: 'ServicesDashboard', component: () => import('../views/Services/Dashboard.vue'), meta: { title: 'Dashboard Layanan' } },
    { path: '/supply_chain/dashboard', name: 'SupplyChainDashboard', component: () => import('../views/SupplyChain/Dashboard.vue'), meta: { title: 'Dashboard Rantai Pasok' } },
    { path: '/finance/dashboard', name: 'FinanceDashboard', component: () => import('../views/Finance/Dashboard.vue'), meta: { title: 'Dashboard Keuangan' } },
    { path: '/website/dashboard', name: 'WebsiteDashboard', component: () => import('../views/Website/Dashboard.vue'), meta: { title: 'Dashboard Website' } },

    // CALENDARS
    { path: '/hr/calendar', name: 'HRCalendar', component: () => import('../views/HR/Calendar.vue'), meta: { title: 'Kalender HRD' } },
    { path: '/sales/calendar', name: 'SalesCalendar', component: () => import('../views/Sales/Calendar.vue'), meta: { title: 'Kalender Penjualan' } },
    { path: '/marketing/calendar', name: 'MarketingCalendar', component: () => import('../views/Marketing/Calendar.vue'), meta: { title: 'Kalender Pemasaran' } },
    { path: '/services/calendar', name: 'ServicesCalendar', component: () => import('../views/Services/Calendar.vue'), meta: { title: 'Kalender Layanan' } },
    { path: '/supply_chain/calendar', name: 'SupplyChainCalendar', component: () => import('../views/SupplyChain/Calendar.vue'), meta: { title: 'Kalender Rantai Pasok' } },
    { path: '/finance/calendar', name: 'FinanceCalendar', component: () => import('../views/Finance/Calendar.vue'), meta: { title: 'Kalender Keuangan' } },
    { path: '/website/calendar', name: 'WebsiteCalendar', component: () => import('../views/Website/Calendar.vue'), meta: { title: 'Kalender Website' } },
  ],
})



export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'App'} | ERP-System`
  
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.name !== 'Signin' && to.name !== 'Signup' && !isAuthenticated) {
    next({ name: 'Signin' })
  } else if ((to.name === 'Signin' || to.name === 'Signup') && isAuthenticated) {
    next({ path: '/' })
  } else {
    next()
  }
})
