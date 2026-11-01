export interface IndustryCode {
  code: string;
  name: string;
  is_main?: boolean;
}

export interface Company {
  id: number;
  tax_id: string;
  company_name: string;
  international_name?: string | null;
  short_name?: string | null;
  tax_address?: string | null;
  address?: string | null;
  status?: string | null;
  legal_representative?: string | null;
  phone?: string | null;
  operating_date?: string | null;
  license_date?: string | null;
  managed_by?: string | null;
  company_type?: string | null;
  main_industry?: string | null;
  main_industry_code?: string | null;
  source_url?: string | null;
  industry_codes?: IndustryCode[] | null;
  raw_data?: Record<string, any> | null;
  created_at?: string | null;
  updated_at?: string | null;
  province?: string | null;
  source_category?: string | null;
}

export interface FilterOption {
  value: string;
  count: number;
}

export interface FilterOptionsData {
  provinces: FilterOption[];
  statuses: FilterOption[];
  companyTypes: FilterOption[];
}

export interface CompanyStats {
  total: number;
  activeCount: number;
  inactiveCount: number;
  hasPhoneCount: number;
  topProvinces: { province: string; count: number }[];
}

export interface CompanyListResponse {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
