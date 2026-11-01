import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

let cachedStats: {
  timestamp: number;
  data: any;
} | null = null;

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  try {
    if (cachedStats && Date.now() - cachedStats.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json(cachedStats.data);
    }

    const pool = getPool();

    const statsRes = await pool.query(`
      SELECT 
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status ILIKE '%đang hoạt động%' THEN 1 END)::int AS active_count,
        COUNT(CASE WHEN status ILIKE '%ngừng hoạt động%' OR status ILIKE '%không hoạt động%' THEN 1 END)::int AS inactive_count,
        COUNT(CASE WHEN phone IS NOT NULL AND TRIM(phone) != '' THEN 1 END)::int AS has_phone_count
      FROM companies
    `);

    const topProvincesRes = await pool.query(`
      SELECT province, COUNT(*)::int AS count
      FROM companies
      WHERE province IS NOT NULL AND TRIM(province) != ''
      GROUP BY province
      ORDER BY count DESC
      LIMIT 6
    `);

    const data = {
      total: statsRes.rows[0].total,
      activeCount: statsRes.rows[0].active_count,
      inactiveCount: statsRes.rows[0].inactive_count,
      hasPhoneCount: statsRes.rows[0].has_phone_count,
      topProvinces: topProvincesRes.rows,
    };

    cachedStats = {
      timestamp: Date.now(),
      data,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}
