import { http } from './http';
import type { ICalendarDto, ICalendarPayloadDto } from '@/types/core/calendar.dto';
import type { IResponse } from '@/types';

export const fetchEvents = async (resModel: string): Promise<ICalendarDto[]> => {
  const { data } = await http.get<ICalendarDto[]>(`/calendar/events?res_model=${resModel}`);
  return data;
};

export const createEvent = async (eventData: ICalendarPayloadDto): Promise<IResponse<ICalendarDto>> => {
  const { data } = await http.post<IResponse<ICalendarDto>>('/calendar/events', eventData);
  return data;
};

export const updateEvent = async (id: string | number, eventData: ICalendarPayloadDto): Promise<IResponse<ICalendarDto>> => {
  const { data } = await http.put<IResponse<ICalendarDto>>(`/calendar/events/${id}`, eventData);
  return data;
};

export const deleteEvent = async (id: string | number): Promise<IResponse<void>> => {
  const { data } = await http.delete<IResponse<void>>(`/calendar/events/${id}`);
  return data;
};

export interface ICalendarCategory {
  id: number | string;
  module: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
}

export const fetchCategories = async (module: string): Promise<ICalendarCategory[]> => {
  try {
    const { data } = await http.get<ICalendarCategory[]>(`/calendar/categories?module=${module}`);
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(`calendar_categories_${module}`, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn(`[CalendarService] Failed to fetch categories from API for ${module}, checking fallback`, err);
  }

  // Fallback to local storage or module defaults
  const cached = localStorage.getItem(`calendar_categories_${module}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_) {}
  }

  const defaults = getDefaultCategories(module);
  localStorage.setItem(`calendar_categories_${module}`, JSON.stringify(defaults));
  return defaults;
};

export const createCategory = async (catData: Partial<ICalendarCategory>): Promise<ICalendarCategory> => {
  try {
    const { data } = await http.post<ICalendarCategory>('/calendar/categories', catData);
    if (data && data.id) {
      return data;
    }
  } catch (err) {
    console.warn('[CalendarService] Backend save category failed, fallback to local', err);
  }

  const mod = catData.module || 'General';
  const current = await fetchCategories(mod);
  const newCat: ICalendarCategory = {
    id: 'cat_' + Date.now(),
    module: mod,
    name: catData.name || 'Kategori Baru',
    color: catData.color || 'primary',
    icon: catData.icon || '📌',
    description: catData.description || ''
  };
  current.push(newCat);
  localStorage.setItem(`calendar_categories_${mod}`, JSON.stringify(current));
  return newCat;
};

export const updateCategory = async (id: string | number, catData: Partial<ICalendarCategory>): Promise<ICalendarCategory> => {
  try {
    const { data } = await http.put<ICalendarCategory>(`/calendar/categories/${id}`, catData);
    if (data) {
      return data;
    }
  } catch (err) {
    console.warn('[CalendarService] Backend update category failed, fallback to local', err);
  }

  const mod = catData.module || 'General';
  const current = await fetchCategories(mod);
  const idx = current.findIndex(c => c.id.toString() === id.toString());
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...catData };
    localStorage.setItem(`calendar_categories_${mod}`, JSON.stringify(current));
    return current[idx];
  }
  return catData as ICalendarCategory;
};

export const deleteCategory = async (id: string | number, moduleName?: string): Promise<void> => {
  try {
    await http.delete(`/calendar/categories/${id}`);
  } catch (err) {
    console.warn('[CalendarService] Backend delete category failed, fallback to local', err);
  }

  if (moduleName) {
    const current = await fetchCategories(moduleName);
    const filtered = current.filter(c => c.id.toString() !== id.toString());
    localStorage.setItem(`calendar_categories_${moduleName}`, JSON.stringify(filtered));
  }
};

export const getDefaultCategories = (module: string): ICalendarCategory[] => {
  switch (module) {
    case 'HR':
      return [
        { id: 'hr-1', module: 'HR', name: 'Cuti Staf', color: 'primary', icon: '🏖️', description: 'Pengajuan cuti staf' },
        { id: 'hr-2', module: 'HR', name: 'Cut-off Payroll', color: 'danger', icon: '💰', description: 'Batas akhir rekap gaji' },
        { id: 'hr-3', module: 'HR', name: 'Wawancara', color: 'warning', icon: '📋', description: 'Jadwal wawancara kandidat' },
        { id: 'hr-4', module: 'HR', name: 'Ulang Tahun', color: 'success', icon: '🎂', description: 'Ulang tahun karyawan' },
      ];
    case 'Finance':
      return [
        { id: 'fin-1', module: 'Finance', name: 'Pajak PPh / PPN', color: 'danger', icon: '🧾', description: 'Batas lapor pajak DJP' },
        { id: 'fin-2', module: 'Finance', name: 'Jatuh Tempo Piutang (AR)', color: 'primary', icon: '🏦', description: 'Penagihan piutang customer' },
        { id: 'fin-3', module: 'Finance', name: 'Hutang Vendor (AP)', color: 'warning', icon: '💸', description: 'Pembayaran tagihan supplier' },
        { id: 'fin-4', module: 'Finance', name: 'Tutup Buku & Rekonsiliasi', color: 'purple', icon: '📊', description: 'Closing buku bulanan' },
      ];
    case 'SupplyChain':
      return [
        { id: 'scm-1', module: 'SupplyChain', name: 'ETA Supplier (PO)', color: 'warning', icon: '🚚', description: 'Kedatangan bahan baku supplier' },
        { id: 'scm-2', module: 'SupplyChain', name: 'Pengiriman (DO)', color: 'primary', icon: '📦', description: 'Jadwal dispatch pesanan DO' },
        { id: 'scm-3', module: 'SupplyChain', name: 'Stock Opname Gudang', color: 'danger', icon: '🔍', description: 'Penghitungan fisik inventaris' },
        { id: 'scm-4', module: 'SupplyChain', name: 'Perawatan Mesin', color: 'success', icon: '🛠️', description: 'Servis preventif mesin produksi' },
      ];
    case 'Sales':
      return [
        { id: 'sls-1', module: 'Sales', name: 'Demo Presentasi B2B', color: 'primary', icon: '🤝', description: 'Presentasi prospek B2B' },
        { id: 'sls-2', module: 'Sales', name: 'Follow-up Quotation', color: 'warning', icon: '📞', description: 'Follow-up proposal harga' },
        { id: 'sls-3', module: 'Sales', name: 'Signing Kontrak MOU', color: 'success', icon: '✍️', description: 'Penandatanganan kerja sama' },
        { id: 'sls-4', module: 'Sales', name: 'Review Target Kuota', color: 'danger', icon: '🎯', description: 'Evaluasi kuota sales bulanan' },
      ];
    case 'Marketing':
      return [
        { id: 'mkt-1', module: 'Marketing', name: 'Email Newsletter Blast', color: 'primary', icon: '📧', description: 'Siaran email massal ke subscriber' },
        { id: 'mkt-2', module: 'Marketing', name: 'Konten Media Sosial', color: 'purple', icon: '📱', description: 'Jadwal tayang konten medsos' },
        { id: 'mkt-3', module: 'Marketing', name: 'Webinar Edukasi', color: 'warning', icon: '🎪', description: 'Webinar bisnis dan demo' },
        { id: 'mkt-4', module: 'Marketing', name: 'Promo & Diskon', color: 'danger', icon: '🏷️', description: 'Kampanye voucher diskon' },
      ];
    case 'Services':
      return [
        { id: 'srv-1', module: 'Services', name: 'Kunjungan Lapangan', color: 'warning', icon: '🛠️', description: 'Kunjungan teknisi lapangan on-site' },
        { id: 'srv-2', module: 'Services', name: 'Sprint Planning', color: 'primary', icon: '⏳', description: 'Sesi perencanaan sprint kerja' },
        { id: 'srv-3', module: 'Services', name: 'Milestone & Delivery', color: 'success', icon: '🎯', description: 'Target penyelesaian milestone' },
        { id: 'srv-4', module: 'Services', name: 'Evaluasi Tiket SLA', color: 'danger', icon: '🎫', description: 'Peninjauan tiket SLA kritis' },
      ];
    case 'Website':
      return [
        { id: 'web-1', module: 'Website', name: 'Artikel Blog SEO', color: 'primary', icon: '📝', description: 'Jadwal publikasi artikel blog' },
        { id: 'web-2', module: 'Website', name: 'Mentoring Live LMS', color: 'purple', icon: '🎓', description: 'Kelas live interaktif kursus' },
        { id: 'web-3', module: 'Website', name: 'Demo Konsultasi B2B', color: 'success', icon: '🤝', description: 'Appointment reservasi mandiri' },
        { id: 'web-4', module: 'Website', name: 'Rilis Fitur Web', color: 'danger', icon: '🚀', description: 'Pembaruan portal web ke live' },
      ];
    default:
      return [
        { id: 'gen-1', module, name: 'Umum', color: 'primary', icon: '📌', description: 'Kategori agenda umum' }
      ];
  }
};

