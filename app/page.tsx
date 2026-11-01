'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { FilterBar, FilterState } from '@/components/FilterBar';
import { CompanyTable } from '@/components/CompanyTable';
import { CompanyCards } from '@/components/CompanyCards';
import { CompanyDetailModal } from '@/components/CompanyDetailModal';
import { Pagination } from '@/components/Pagination';
import { Company, FilterOptionsData, CompanyStats } from '@/lib/types';

function CompanySearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters state initialized from URL if present
  const [filters, setFilters] = useState<FilterState>({
    q: searchParams.get('q') || '',
    tax_id: searchParams.get('tax_id') || '',
    province: searchParams.get('province') || '',
    status: searchParams.get('status') || '',
    company_type: searchParams.get('company_type') || '',
    has_phone: searchParams.get('has_phone') === 'true',
    operating_year: searchParams.get('operating_year') || '',
    sort_by: searchParams.get('sort_by') || 'operating_date',
    sort_order: searchParams.get('sort_order') || 'desc',
    limit: parseInt(searchParams.get('limit') || '20', 10),
  });

  const [page, setPage] = useState<number>(
    parseInt(searchParams.get('page') || '1', 10)
  );

  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsData | null>(null);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Fetch filter dropdown options once
  useEffect(() => {
    fetch('/api/filters')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setFilterOptions(data);
      })
      .catch((err) => console.error('Error loading filter options:', err));
  }, []);

  // Fetch statistics overview once
  useEffect(() => {
    setLoadingStats(true);
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch((err) => console.error('Error loading stats:', err))
      .finally(() => setLoadingStats(false));
  }, []);

  // Fetch companies whenever filters or page changes
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.tax_id) params.set('tax_id', filters.tax_id);
      if (filters.province) params.set('province', filters.province);
      if (filters.status) params.set('status', filters.status);
      if (filters.company_type) params.set('company_type', filters.company_type);
      if (filters.has_phone) params.set('has_phone', 'true');
      if (filters.operating_year) params.set('operating_year', filters.operating_year);
      params.set('sort_by', filters.sort_by);
      params.set('sort_order', filters.sort_order);
      params.set('limit', filters.limit.toString());
      params.set('page', page.toString());

      const res = await fetch(`/api/companies?${params.toString()}`);
      const data = await res.json();

      if (data.companies) {
        setCompanies(data.companies);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      tax_id: '',
      province: '',
      status: '',
      company_type: '',
      has_phone: false,
      operating_year: '',
      sort_by: 'operating_date',
      sort_order: 'desc',
      limit: 20,
    });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit }));
    setPage(1);
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.tax_id) params.set('tax_id', filters.tax_id);
      if (filters.province) params.set('province', filters.province);
      if (filters.status) params.set('status', filters.status);
      if (filters.company_type) params.set('company_type', filters.company_type);
      if (filters.has_phone) params.set('has_phone', 'true');
      if (filters.operating_year) params.set('operating_year', filters.operating_year);
      if (filters.sort_by) params.set('sort_by', filters.sort_by);
      if (filters.sort_order) params.set('sort_order', filters.sort_order);

      const url = `/api/export?${params.toString()}`;
      window.open(url, '_blank');
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header totalCount={stats?.total || total} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Statistics Cards */}
        <StatsOverview
          stats={stats}
          loading={loadingStats}
          onFilterByStatus={(status) => handleFilterChange({ status })}
          onFilterByPhone={() => handleFilterChange({ has_phone: !filters.has_phone })}
        />

        {/* Filter & Search Bar */}
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          viewMode={viewMode}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          onExport={handleExport}
          onChangeViewMode={setViewMode}
          isExporting={isExporting}
        />

        {/* Companies List Result */}
        {viewMode === 'table' ? (
          <CompanyTable
            companies={companies}
            loading={loading}
            onSelectCompany={handleSelectCompany}
            sortBy={filters.sort_by}
            sortOrder={filters.sort_order}
            onSort={(sort_by, sort_order) => handleFilterChange({ sort_by, sort_order })}
          />
        ) : (
          <CompanyCards
            companies={companies}
            loading={loading}
            onSelectCompany={handleSelectCompany}
          />
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          limit={filters.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </main>

      {/* Detail Modal */}
      <CompanyDetailModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Tra Cứu Doanh Nghiệp Việt Nam. Dữ liệu công khai từ Cổng thông tin Quốc gia.</p>
          <p className="text-slate-400">Hỗ trợ tìm kiếm theo MST, Tên doanh nghiệp, Ngành nghề, Địa chỉ, Số điện thoại</p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Đang tải trang...</div>}>
      <CompanySearchContent />
    </Suspense>
  );
}
