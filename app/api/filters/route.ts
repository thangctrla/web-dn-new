import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

let cachedFilters: {
  timestamp: number;
  data: {
    provinces: { value: string; count: number }[];
    statuses: { value: string; count: number }[];
    companyTypes: { value: string; count: number }[];
  };
} | null = null;

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    if (cachedFilters && Date.now() - cachedFilters.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json(cachedFilters.data);
    }

    const pool = getPool();

    const [provincesRes, statusesRes, companyTypesRes] = await Promise.all([
      pool.query(`
        SELECT province AS value, COUNT(*)::int AS count 
        FROM companies 
        WHERE province IS NOT NULL AND TRIM(province) != ''
        GROUP BY province 
        ORDER BY count DESC, province ASC
      `),
      pool.query(`
        SELECT status AS value, COUNT(*)::int AS count 
        FROM companies 
        WHERE status IS NOT NULL AND TRIM(status) != ''
        GROUP BY status 
        ORDER BY count DESC
      `),
      pool.query(`
        SELECT company_type AS value, COUNT(*)::int AS count 
        FROM companies 
        WHERE company_type IS NOT NULL AND TRIM(company_type) != ''
        GROUP BY company_type 
        ORDER BY count DESC
        LIMIT 30
      `),
    ]);

    const data = {
      provinces: provincesRes.rows,
      statuses: statusesRes.rows,
      companyTypes: companyTypesRes.rows,
    };

    cachedFilters = {
      timestamp: Date.now(),
      data,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters', details: error.message },
      { status: 500 }
    );
  }
}
