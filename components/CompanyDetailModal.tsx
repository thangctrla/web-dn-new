'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Building2, 
  Copy, 
  Check, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Briefcase, 
  ExternalLink, 
  Landmark, 
  FileCode,
  ShieldCheck,
  Search,
  Globe
} from 'lucide-react';
import { Company, IndustryCode } from '@/lib/types';
import { formatDate, formatProvince, getStatusBadge } from '@/lib/utils';

interface CompanyDetailModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailModal({ company, isOpen, onClose }: CompanyDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [industrySearch, setIndustrySearch] = useState('');
  const [fullCompanyData, setFullCompanyData] = useState<Company | null>(company);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fetch full details if opened
  useEffect(() => {
    if (company && isOpen) {
      setFullCompanyData(company);
      // Fetch full details from API to make sure industry_codes & raw_data are populated
      setLoadingDetail(true);
      fetch(`/api/companies/${company.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.company) {
            setFullCompanyData(data.company);
          }
        })
        .catch((err) => console.error('Failed to load full company info', err))
        .finally(() => setLoadingDetail(false));
    }
  }, [company, isOpen]);

  if (!isOpen || !company) return null;

  const current = fullCompanyData || company;
  const statusStyle = getStatusBadge(current.status);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const industries: IndustryCode[] = Array.isArray(current.industry_codes)
    ? current.industry_codes
    : [];

  const filteredIndustries = industries.filter((item) => {
    if (!industrySearch) return true;
    const term = industrySearch.toLowerCase();
    return (
      item.code.toLowerCase().includes(term) ||
      (item.name && item.name.toLowerCase().includes(term))
    );
  });

  const fullAddress = current.address || current.tax_address || '';
  const googleMapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.border}`}>
                {statusStyle.label}
              </span>
              {current.province && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {formatProvince(current.province)}
                </span>
              )}
              {current.company_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {current.company_type}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {current.company_name}
            </h3>

            {current.international_name && (
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                {current.international_name}
              </p>
            )}

            {current.short_name && (
              <p className="text-xs text-indigo-600 font-medium mt-0.5">
                Tên viết tắt: {current.short_name}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tax ID */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">Mã số thuế</span>
                <button
                  type="button"
                  onClick={() => handleCopy(current.tax_id, 'tax_id')}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                >
                  {copiedField === 'tax_id' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Chép</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">
                {current.tax_id}
              </div>
            </div>

            {/* Representative */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Đại diện pháp luật
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {current.legal_representative || 'Chưa cập nhật'}
              </div>
            </div>

            {/* Phone */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Số điện thoại
                </span>
                {current.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(current.phone!, 'phone')}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900">
                {current.phone ? (
                  <a href={`tel:${current.phone}`} className="text-emerald-600 hover:underline">
                    {current.phone}
                  </a>
                ) : (
                  <span className="text-slate-400 font-normal">Chưa cập nhật</span>
                )}
              </div>
            </div>

            {/* Operating Date */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Ngày bắt đầu hoạt động
              </div>
              <div className="text-sm font-semibold text-slate-900 font-mono">
                {formatDate(current.operating_date)}
              </div>
            </div>

            {/* License Date */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Ngày cấp giấy phép
              </div>
              <div className="text-sm font-semibold text-slate-900 font-mono">
                {formatDate(current.license_date)}
              </div>
            </div>

            {/* Tax Management Authority */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-slate-400" />
                Cơ quan quản lý thuế
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate" title={current.managed_by || ''}>
                {current.managed_by || 'Chưa cập nhật'}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Địa chỉ doanh nghiệp
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 font-semibold block mb-0.5">Địa chỉ trụ sở:</span>
                <div className="text-slate-800 font-medium flex items-start justify-between gap-3">
                  <span>{current.address || 'Chưa cập nhật'}</span>
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200 hover:border-indigo-300 shadow-2xs"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Xem bản đồ</span>
                    </a>
                  )}
                </div>
              </div>

              {current.tax_address && current.tax_address !== current.address && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-500 font-semibold block mb-0.5">Địa chỉ nhận thông báo thuế:</span>
                  <div className="text-slate-700">{current.tax_address}</div>
                </div>
              )}
            </div>
          </div>

          {/* Main Industry */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Ngành nghề kinh doanh chính
            </h4>
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-3">
              {current.main_industry_code && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold shrink-0">
                  {current.main_industry_code}
                </span>
              )}
              <span className="text-sm font-semibold text-slate-900">
                {current.main_industry || 'Chưa cập nhật ngành chính'}
              </span>
            </div>
          </div>

          {/* Industry Codes List */}
          {industries.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  Danh mục toàn bộ ngành nghề đăng ký ({industries.length})
                </h4>

                {industries.length > 5 && (
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={industrySearch}
                      onChange={(e) => setIndustrySearch(e.target.value)}
                      placeholder="Tìm mã hoặc tên ngành..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-24">Mã ngành</th>
                      <th className="py-2.5 px-3">Tên ngành nghề</th>
                      <th className="py-2.5 px-3 w-28 text-right">Loại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredIndustries.map((item, idx) => (
                      <tr key={`${item.code}-${idx}`} className="hover:bg-slate-50/80">
                        <td className="py-2 px-3 font-mono font-semibold text-indigo-600">
                          {item.code}
                        </td>
                        <td className="py-2 px-3 text-slate-800">
                          {item.name}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {item.is_main ? (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Ngành chính
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Bổ sung</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Source Link */}
          {current.source_url && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>Nguồn thông tin tra cứu:</span>
              <a
                href={current.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium hover:underline"
              >
                <span>Xem liên kết gốc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <Link
            href={`/companies/${current.id}`}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <span>Mở trang chi tiết riêng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
