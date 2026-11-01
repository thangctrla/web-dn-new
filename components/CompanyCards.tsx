'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Phone, 
  User, 
  Copy, 
  Check, 
  Eye, 
  FileText,
  Briefcase
} from 'lucide-react';
import { Company } from '@/lib/types';
import { formatDate, formatProvince, getStatusBadge } from '@/lib/utils';

interface CompanyCardsProps {
  companies: Company[];
  loading: boolean;
  onSelectCompany: (company: Company) => void;
}

export function CompanyCards({ companies, loading, onSelectCompany }: CompanyCardsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-slate-200/70 rounded-xl"></div>
        ))}
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
          Không có kết quả nào phù hợp với bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => {
        const statusStyle = getStatusBadge(company.status);
        const isCopied = copiedId === company.tax_id;

        return (
          <div
            key={company.id}
            onClick={() => onSelectCompany(company)}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Top row: Tax ID & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div 
                  className="flex items-center gap-1.5 font-mono text-xs font-semibold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>MST: {company.tax_id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(company.tax_id, company.tax_id)}
                    className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
                    title="Sao chép MST"
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border truncate max-w-[150px] ${statusStyle.bg} ${statusStyle.border}`}>
                  {statusStyle.label}
                </span>
              </div>

              {/* Company Name */}
              <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm leading-snug">
                {company.company_name}
              </h4>
              {company.international_name && (
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {company.international_name}
                </p>
              )}

              {/* Meta details */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">
                    {company.legal_representative || 'Chưa cập nhật'}
                  </span>
                </div>

                {company.phone && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium" onClick={(e) => e.stopPropagation()}>
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <a href={`tel:${company.phone}`} className="hover:underline">
                      {company.phone}
                    </a>
                  </div>
                )}

                {company.main_industry && (
                  <div className="flex items-start gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 text-slate-700" title={company.main_industry}>
                      {company.main_industry_code && `[${company.main_industry_code}] `}
                      {company.main_industry}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-slate-500">
                    {company.address || company.tax_address || formatProvince(company.province)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row: Operating Date & Action */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(company.operating_date)}</span>
              </div>

              <span className="inline-flex items-center gap-1 text-indigo-600 font-medium group-hover:translate-x-0.5 transition-transform">
                <Eye className="w-3.5 h-3.5" />
                <span>Xem chi tiết</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
