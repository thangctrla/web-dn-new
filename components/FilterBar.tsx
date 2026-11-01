'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  Table as TableIcon, 
  LayoutGrid, 
  ChevronDown, 
  X,
  Phone,
  SlidersHorizontal,
  Building,
  MapPin,
  Calendar
} from 'lucide-react';
import { FilterOptionsData } from '@/lib/types';
import { formatProvince } from '@/lib/utils';

export interface FilterState {
  q: string;
  tax_id: string;
  province: string;
  status: string;
  company_type: string;
  has_phone: boolean;
  operating_year: string;
  sort_by: string;
  sort_order: string;
  limit: number;
}

interface FilterBarProps {
  filters: FilterState;
  filterOptions: FilterOptionsData | null;
  viewMode: 'table' | 'cards';
  onChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  onExport: () => void;
  onChangeViewMode: (mode: 'table' | 'cards') => void;
  isExporting?: boolean;
}

export function FilterBar({
  filters,
  filterOptions,
  viewMode,
  onChange,
  onReset,
  onExport,
  onChangeViewMode,
  isExporting = false,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.q);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync internal search input if parent filters.q changes
  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ q: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onChange({ q: '' });
  };

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    filters.q || 
    filters.province || 
    filters.status || 
    filters.company_type || 
    filters.has_phone || 
    filters.operating_year
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-6">
      {/* Primary search bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên công ty, mã số thuế (MST), người đại diện, số điện thoại, địa chỉ..."
            className="w-full pl-11 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Tìm kiếm</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 shrink-0 ${
              isExpanded || hasActiveFilters
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Bộ lọc</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </button>
        </div>
      </form>

      {/* Filter controls row */}
      <div className={`mt-4 pt-4 border-t border-slate-100 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Province Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Tỉnh / Thành phố
            </label>
            <select
              value={filters.province}
              onChange={(e) => onChange({ province: e.target.value })}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả tỉnh thành ({filterOptions?.provinces.length || 0})</option>
              {filterOptions?.provinces.map((p) => (
                <option key={p.value} value={p.value}>
                  {formatProvince(p.value)} ({p.count.toLocaleString('vi-VN')})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Trạng thái hoạt động
            </label>
            <select
              value={filters.status}
              onChange={(e) => onChange({ status: e.target.value })}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
            >
              <option value="">Tất cả trạng thái</option>
              {filterOptions?.statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.value} ({s.count.toLocaleString('vi-VN')})
                </option>
              ))}
            </select>
          </div>

          {/* Company Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Loại hình doanh nghiệp
            </label>
            <select
              value={filters.company_type}
              onChange={(e) => onChange({ company_type: e.target.value })}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
            >
              <option value="">Tất cả loại hình</option>
              {filterOptions?.companyTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.value} ({t.count.toLocaleString('vi-VN')})
                </option>
              ))}
            </select>
          </div>

          {/* Year of Operation */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Năm thành lập / Hoạt động
            </label>
            <select
              value={filters.operating_year}
              onChange={(e) => onChange({ operating_year: e.target.value })}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả các năm</option>
              <option value="2026">Năm 2026</option>
              <option value="2025">Năm 2025</option>
              <option value="2024">Năm 2024</option>
              <option value="2023">Năm 2023</option>
              <option value="2022">Năm 2022</option>
              <option value="2021">Năm 2021</option>
              <option value="2020">Năm 2020</option>
              <option value="2019">Năm 2019</option>
              <option value="2018">Năm 2018</option>
              <option value="2017">Năm 2017</option>
            </select>
          </div>
        </div>

        {/* Second controls line: phone checkbox, sorting, view mode, reset, export */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Quick toggle: Has Phone */}
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.has_phone}
                onChange={(e) => onChange({ has_phone: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                Chỉ hiện DN có số điện thoại
              </span>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>

          {/* Right controls: Sort, View Switch, Export */}
          <div className="flex items-center gap-2.5">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 hidden sm:inline">Sắp xếp:</span>
              <select
                value={`${filters.sort_by}:${filters.sort_order}`}
                onChange={(e) => {
                  const val = e.target.value;
                  const idx = val.lastIndexOf(':') !== -1 ? val.lastIndexOf(':') : val.lastIndexOf('_');
                  const by = val.substring(0, idx);
                  const order = val.substring(idx + 1);
                  onChange({ sort_by: by, sort_order: order });
                }}
                className="py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="operating_date:desc">Ngày hoạt động mới nhất</option>
                <option value="operating_date:asc">Ngày hoạt động cũ nhất</option>
                <option value="id:desc">Mới nhất (ID giảm dần)</option>
                <option value="id:asc">Cũ nhất (ID tăng dần)</option>
                <option value="company_name:asc">Tên công ty (A - Z)</option>
                <option value="company_name:desc">Tên công ty (Z - A)</option>
                <option value="tax_id:asc">Mã số thuế tăng dần</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => onChangeViewMode('table')}
                title="Xem dạng Bảng"
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('cards')}
                title="Xem dạng Thẻ"
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Export CSV button */}
            <button
              type="button"
              onClick={onExport}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Đang xuất...' : 'Xuất CSV'}</span>
            </button>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50">
            <span className="text-xs text-slate-400">Đang lọc:</span>
            {filters.q && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                Từ khóa: &quot;{filters.q}&quot;
                <button type="button" onClick={() => onChange({ q: '' })}><X className="w-3 h-3 hover:text-indigo-900" /></button>
              </span>
            )}
            {filters.province && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                Tỉnh: {formatProvince(filters.province)}
                <button type="button" onClick={() => onChange({ province: '' })}><X className="w-3 h-3 hover:text-indigo-900" /></button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                Trạng thái: {filters.status.slice(0, 25)}...
                <button type="button" onClick={() => onChange({ status: '' })}><X className="w-3 h-3 hover:text-indigo-900" /></button>
              </span>
            )}
            {filters.company_type && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                Loại: {filters.company_type.slice(0, 25)}...
                <button type="button" onClick={() => onChange({ company_type: '' })}><X className="w-3 h-3 hover:text-indigo-900" /></button>
              </span>
            )}
            {filters.operating_year && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                Năm: {filters.operating_year}
                <button type="button" onClick={() => onChange({ operating_year: '' })}><X className="w-3 h-3 hover:text-indigo-900" /></button>
              </span>
            )}
            {filters.has_phone && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                Có SĐT
                <button type="button" onClick={() => onChange({ has_phone: false })}><X className="w-3 h-3 hover:text-indigo-900" /></button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
