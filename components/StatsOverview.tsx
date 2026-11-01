'use client';

import React from 'react';
import { Building2, CheckCircle2, AlertTriangle, PhoneCall, MapPin } from 'lucide-react';
import { CompanyStats } from '@/lib/types';

interface StatsOverviewProps {
  stats: CompanyStats | null;
  loading: boolean;
  onFilterByStatus?: (status: string) => void;
  onFilterByPhone?: () => void;
}

export function StatsOverview({ stats, loading, onFilterByStatus, onFilterByPhone }: StatsOverviewProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200/70 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const activePercent = stats.total > 0 ? ((stats.activeCount / stats.total) * 100).toFixed(1) : '0';
  const phonePercent = stats.total > 0 ? ((stats.hasPhoneCount / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Doanh Nghiệp</span>
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {stats.total.toLocaleString('vi-VN')}
          </span>
          <span className="text-xs text-slate-400">công ty</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span>Toàn quốc 63 tỉnh/thành</span>
        </div>
      </div>

      {/* Active */}
      <div 
        onClick={() => onFilterByStatus?.('Đang hoạt động')}
        className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Đang hoạt động</span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-emerald-600 tracking-tight">
            {stats.activeCount.toLocaleString('vi-VN')}
          </span>
          <span className="text-xs font-medium text-emerald-600/80 bg-emerald-50 px-1.5 py-0.5 rounded">
            {activePercent}%
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Click để lọc danh sách đang HĐ
        </div>
      </div>

      {/* Inactive / Closed */}
      <div 
        onClick={() => onFilterByStatus?.('Ngừng hoạt động và đã hoàn thành thủ tục chấm dứt hiệu lực MST')}
        className="bg-white rounded-xl p-4 border border-rose-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-rose-300 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Ngừng / Chấm dứt MST</span>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-rose-600 tracking-tight">
            {stats.inactiveCount.toLocaleString('vi-VN')}
          </span>
          <span className="text-xs text-slate-400">công ty</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Chấm dứt hiệu lực hoặc tạm dừng
        </div>
      </div>

      {/* Has Phone */}
      <div 
        onClick={() => onFilterByPhone?.()}
        className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Có Số Điện Thoại</span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-blue-600 tracking-tight">
            {stats.hasPhoneCount.toLocaleString('vi-VN')}
          </span>
          <span className="text-xs font-medium text-blue-600/80 bg-blue-50 px-1.5 py-0.5 rounded">
            {phonePercent}%
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Dễ dàng liên hệ & telesales
        </div>
      </div>
    </div>
  );
}
