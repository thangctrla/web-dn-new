import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  // Sometimes dateStr is 'YYYY-MM-DD' or timestamp
  if (dateStr.length >= 10 && dateStr.includes('-')) {
    const parts = dateStr.slice(0, 10).split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateStr;
}

export function formatProvince(province?: string | null): string {
  if (!province) return 'Chưa cập nhật';
  // Some provinces in db have format like 'ha-noi-7', 'tp-ho-chi-minh-1'
  if (province.includes('-')) {
    const clean = province.replace(/-\d+$/, '').replace(/-/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return province;
}

export function getStatusBadge(status?: string | null): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (!status) {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      label: 'Chưa xác định',
    };
  }

  const s = status.toLowerCase();
  if (s.includes('đang hoạt động')) {
    return {
      bg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: status,
    };
  }
  if (s.includes('tạm ngừng') || s.includes('tạm nghỉ') || s.includes('chờ')) {
    return {
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: status,
    };
  }
  if (s.includes('ngừng hoạt động') || s.includes('không hoạt động') || s.includes('chấm dứt') || s.includes('đóng')) {
    return {
      bg: 'bg-rose-50 text-rose-700',
      text: 'text-rose-700',
      border: 'border-rose-200',
      label: status,
    };
  }

  return {
    bg: 'bg-blue-50 text-blue-700',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: status,
  };
}
