'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
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
  Globe,
  Share2,
  ChevronRight
} from 'lucide-react';
import { Company, IndustryCode } from '@/lib/types';
import { formatDate, formatProvince, getStatusBadge } from '@/lib/utils';
import { Header } from '@/components/Header';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [related, setRelated] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [industrySearch, setIndustrySearch] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/companies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tìm thấy doanh nghiệp');
        return res.json();
      })
      .then((data) => {
        setCompany(data.company);
        setRelated(data.related || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: company?.company_name || 'Thông tin doanh nghiệp',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedField('share_url');
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-slate-200 rounded w-32"></div>
            <div className="h-40 bg-slate-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-slate-200 rounded-xl"></div>
              <div className="h-24 bg-slate-200 rounded-xl"></div>
              <div className="h-24 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Không tìm thấy thông tin doanh nghiệp
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Mã số thuế hoặc định danh doanh nghiệp không tồn tại trong hệ thống.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang tra cứu</span>
          </Link>
        </main>
      </div>
    );
  }

  const statusStyle = getStatusBadge(company.status);
  const industries: IndustryCode[] = Array.isArray(company.industry_codes)
    ? company.industry_codes
    : [];

  const filteredIndustries = industries.filter((item) => {
    if (!industrySearch) return true;
    const term = industrySearch.toLowerCase();
    return (
      item.code.toLowerCase().includes(term) ||
      (item.name && item.name.toLowerCase().includes(term))
    );
  });

  const fullAddress = company.address || company.tax_address || '';
  const googleMapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
          >
            {copiedField === 'share_url' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Đã chép link</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </>
            )}
          </button>
        </div>

        {/* Enterprise Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.border}`}>
              {statusStyle.label}
            </span>
            {company.province && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {formatProvince(company.province)}
              </span>
            )}
            {company.company_type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                {company.company_type}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {company.company_name}
          </h1>

          {company.international_name && (
            <p className="text-sm sm:text-base text-slate-500 font-normal mt-1">
              {company.international_name}
            </p>
          )}

          {company.short_name && (
            <p className="text-xs sm:text-sm text-indigo-600 font-medium mt-1">
              Tên viết tắt: {company.short_name}
            </p>
          )}

          {/* Quick Metrics */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold">MÃ SỐ THUẾ</span>
                <button
                  type="button"
                  onClick={() => handleCopy(company.tax_id, 'tax_id')}
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1"
                >
                  {copiedField === 'tax_id' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Chép</span>
                </button>
              </div>
              <div className="text-lg font-bold font-mono text-indigo-700">
                {company.tax_id}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                ĐẠI DIỆN PHÁP LUẬT
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {company.legal_representative || 'Chưa cập nhật'}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  ĐIỆN THOẠI
                </span>
                {company.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(company.phone!, 'phone')}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1"
                  >
                    {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Chép</span>
                  </button>
                )}
              </div>
              <div className="text-sm font-bold">
                {company.phone ? (
                  <a href={`tel:${company.phone}`} className="text-emerald-600 hover:underline">
                    {company.phone}
                  </a>
                ) : (
                  <span className="text-slate-400 font-normal">Chưa cập nhật</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                NGÀY HOẠT ĐỘNG
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {formatDate(company.operating_date)}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Info Columns (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Thông tin Địa chỉ & Cơ quan quản lý
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Địa chỉ trụ sở:</span>
                  <div className="text-slate-800 font-medium flex items-start justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span>{company.address || 'Chưa cập nhật'}</span>
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 shadow-2xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Bản đồ</span>
                      </a>
                    )}
                  </div>
                </div>

                {company.tax_address && company.tax_address !== company.address && (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-1">Địa chỉ nhận thông báo thuế:</span>
                    <div className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {company.tax_address}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Cơ quan quản lý thuế:</span>
                  <div className="text-slate-800 font-medium flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Landmark className="w-4 h-4 text-slate-400" />
                    <span>{company.managed_by || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Industry codes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  Ngành nghề kinh doanh ({industries.length})
                </h2>

                {industries.length > 5 && (
                  <input
                    type="text"
                    value={industrySearch}
                    onChange={(e) => setIndustrySearch(e.target.value)}
                    placeholder="Tìm mã hoặc tên ngành..."
                    className="w-full sm:w-56 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                )}
              </div>

              {company.main_industry && (
                <div className="mb-4 p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-3">
                  {company.main_industry_code && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold shrink-0">
                      {company.main_industry_code}
                    </span>
                  )}
                  <div>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">Ngành nghề chính:</span>
                    <span className="text-sm font-semibold text-slate-900">{company.main_industry}</span>
                  </div>
                </div>
              )}

              {industries.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3 w-24">Mã ngành</th>
                        <th className="py-2.5 px-3">Tên ngành nghề</th>
                        <th className="py-2.5 px-3 w-28 text-right">Phân loại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredIndustries.map((item, idx) => (
                        <tr key={`${item.code}-${idx}`} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-mono font-semibold text-indigo-600">
                            {item.code}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-right">
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
              ) : (
                <p className="text-xs text-slate-500">Chưa có thông tin danh mục ngành bổ sung.</p>
              )}
            </div>
          </div>

          {/* Right Sidebar: Related Companies & Metadata */}
          <div className="space-y-6">
            {/* Related Companies */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Doanh nghiệp cùng khu vực / ngành
                </h3>
                <div className="divide-y divide-slate-100">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/companies/${rel.id}`}
                      className="py-3 block hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors group"
                    >
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 line-clamp-2">
                        {rel.company_name}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono text-indigo-600">{rel.tax_id}</span>
                        <span>{formatProvince(rel.province)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Source Reference */}
            {company.source_url && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-xs space-y-2">
                <span className="font-semibold text-slate-700 block">Nguồn dữ liệu tham khảo:</span>
                <a
                  href={company.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 font-medium hover:underline break-all"
                >
                  <span>Mã số thuế gốc ({company.tax_id})</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
