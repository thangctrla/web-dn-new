'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  User, 
  MapPin, 
  Calendar,
  Eye,
  FileText
} from 'lucide-react';
import { Company } from '@/lib/types';
import { formatDate, formatProvince, getStatusBadge } from '@/lib/utils';

interface CompanyTableProps {
  companies: Company[];
  loading: boolean;
  onSelectCompany: (company: Company) => void;
  sortBy?: string;
  sortOrder?: string;
  onSort?: (sortBy: string, sortOrder: string) => void;
}

export function CompanyTable({ 
  companies, 
  loading, 
  onSelectCompany,
  sortBy,
  sortOrder,
  onSort 
}: CompanyTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSortHeader = (column: string) => {
    if (!onSort) return;
    if (sortBy === column) {
      onSort(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column, column === 'operating_date' || column === 'id' ? 'desc' : 'asc');
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return (
      <span className="text-indigo-600 font-bold ml-1 text-xs">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 flex gap-4 items-center">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/6"></div>
              <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          Không tìm thấy doanh nghiệp nào
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Không có kết quả nào phù hợp với điều kiện tìm kiếm. Hãy thử từ khóa khác hoặc điều chỉnh lại bộ lọc tỉnh thành, trạng thái.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider select-none">
              <th 
                className={`py-3 px-4 w-36 ${onSort ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors' : ''}`}
                onClick={() => handleSortHeader('tax_id')}
                title="Sắp xếp theo Mã số thuế"
              >
                <div className="flex items-center">
                  <span>Mã số thuế</span>
                  {renderSortIcon('tax_id')}
                </div>
              </th>
              <th 
                className={`py-3 px-4 min-w-[280px] ${onSort ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors' : ''}`}
                onClick={() => handleSortHeader('company_name')}
                title="Sắp xếp theo Tên doanh nghiệp"
              >
                <div className="flex items-center">
                  <span>Tên Doanh Nghiệp</span>
                  {renderSortIcon('company_name')}
                </div>
              </th>
              <th className="py-3 px-4 min-w-[190px]">Người đại diện / SĐT</th>
              <th className="py-3 px-4 min-w-[200px]">Ngành nghề & Địa chỉ</th>
              <th 
                className={`py-3 px-4 w-32 ${onSort ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors' : ''}`}
                onClick={() => handleSortHeader('operating_date')}
                title="Sắp xếp theo Ngày hoạt động"
              >
                <div className="flex items-center">
                  <span>Ngày HĐ</span>
                  {renderSortIcon('operating_date')}
                </div>
              </th>
              <th className="py-3 px-4 min-w-[150px]">Trạng thái</th>
              <th className="py-3 px-4 w-28 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {companies.map((company) => {
              const statusStyle = getStatusBadge(company.status);
              const isCopied = copiedId === company.tax_id;

              return (
                <tr 
                  key={company.id} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectCompany(company)}
                >
                  {/* Tax ID */}
                  <td className="py-3 px-4 align-top" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 font-mono font-medium text-indigo-600">
                      <span>{company.tax_id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(company.tax_id, company.tax_id)}
                        className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
                        title="Sao chép MST"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {company.province && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 font-normal">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[110px]">{formatProvince(company.province)}</span>
                      </div>
                    )}
                  </td>

                  {/* Company Name */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {company.company_name}
                    </div>
                    {company.international_name && (
                      <div className="text-xs text-slate-400 font-normal line-clamp-1 mt-0.5">
                        {company.international_name}
                      </div>
                    )}
                    {company.company_type && (
                      <div className="mt-1 inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {company.company_type}
                      </div>
                    )}
                  </td>

                  {/* Representative & Phone */}
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{company.legal_representative || '—'}</span>
                    </div>
                    {company.phone ? (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium" onClick={(e) => e.stopPropagation()}>
                        <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <a href={`tel:${company.phone}`} className="hover:underline">
                          {company.phone}
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 mt-1 block">Chưa có SĐT</span>
                    )}
                  </td>

                  {/* Industry & Address */}
                  <td className="py-3 px-4 align-top text-xs">
                    {company.main_industry ? (
                      <div className="text-slate-800 font-medium line-clamp-1" title={company.main_industry}>
                        {company.main_industry_code && (
                          <span className="font-mono text-indigo-600 font-semibold mr-1">
                            [{company.main_industry_code}]
                          </span>
                        )}
                        {company.main_industry}
                      </div>
                    ) : (
                      <span className="text-slate-400">Chưa cập nhật ngành</span>
                    )}
                    <div className="text-slate-500 mt-1 line-clamp-2" title={company.address || company.tax_address || ''}>
                      {company.address || company.tax_address || '—'}
                    </div>
                  </td>

                  {/* Operating Date */}
                  <td className="py-3 px-4 align-top text-xs text-slate-600 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(company.operating_date)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.border}`}>
                      <span className="line-clamp-1">{statusStyle.label}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectCompany(company)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
