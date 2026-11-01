import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const pool = getPool();

    let query = 'SELECT * FROM companies WHERE id = $1';
    let val: any = parseInt(id, 10);

    // If param is not an integer ID, try searching by tax_id
    if (isNaN(val)) {
      query = 'SELECT * FROM companies WHERE tax_id = $1';
      val = id;
    }

    const res = await pool.query(query, [val]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const company = res.rows[0];

    // Fetch related companies (same province or same main industry, excluding current)
    let related: any[] = [];
    if (company.province || company.main_industry_code) {
      const relatedRes = await pool.query(
        `SELECT id, tax_id, company_name, province, status, operating_date, phone, main_industry
         FROM companies
         WHERE id != $1 AND (province = $2 OR main_industry_code = $3)
         ORDER BY id DESC
         LIMIT 5`,
        [company.id, company.province || '', company.main_industry_code || '']
      );
      related = relatedRes.rows;
    }

    return NextResponse.json({ company, related });
  } catch (error: any) {
    console.error('Error fetching company details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company details', details: error.message },
      { status: 500 }
    );
  }
}
