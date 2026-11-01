import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const q = searchParams.get('q')?.trim() || '';
    const taxId = searchParams.get('tax_id')?.trim() || '';
    const province = searchParams.get('province')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const companyType = searchParams.get('company_type')?.trim() || '';
    const hasPhone = searchParams.get('has_phone') === 'true' || searchParams.get('has_phone') === '1';
    const operatingYear = searchParams.get('operating_year')?.trim() || '';
    const dateFrom = searchParams.get('date_from')?.trim() || '';
    const dateTo = searchParams.get('date_to')?.trim() || '';

    const sortByParam = searchParams.get('sort_by') || 'operating_date';
    const sortOrderParam = (searchParams.get('sort_order') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Validate sort column to avoid SQL injection
    const allowedSortColumns: Record<string, string> = {
      id: 'id',
      company_name: 'company_name',
      operating_date: 'operating_date',
      tax_id: 'tax_id',
      created_at: 'created_at',
    };
    const sortColumn = allowedSortColumns[sortByParam] || 'operating_date';

    let orderClause = `ORDER BY id ${sortOrderParam}`;
    if (sortColumn !== 'id') {
      if (sortColumn === 'operating_date') {
        orderClause = `ORDER BY NULLIF(TRIM(operating_date), '') ${sortOrderParam} NULLS LAST, id ${sortOrderParam}`;
      } else {
        orderClause = `ORDER BY ${sortColumn} ${sortOrderParam} NULLS LAST, id ${sortOrderParam}`;
      }
    }

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (q) {
      conditions.push(`(
        company_name ILIKE $${paramIndex} OR
        tax_id ILIKE $${paramIndex} OR
        legal_representative ILIKE $${paramIndex} OR
        phone ILIKE $${paramIndex} OR
        address ILIKE $${paramIndex} OR
        tax_address ILIKE $${paramIndex}
      )`);
      values.push(`%${q}%`);
      paramIndex++;
    }

    if (taxId) {
      conditions.push(`tax_id ILIKE $${paramIndex}`);
      values.push(`%${taxId}%`);
      paramIndex++;
    }

    if (province) {
      conditions.push(`province = $${paramIndex}`);
      values.push(province);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (companyType) {
      conditions.push(`company_type = $${paramIndex}`);
      values.push(companyType);
      paramIndex++;
    }

    if (hasPhone) {
      conditions.push(`(phone IS NOT NULL AND TRIM(phone) != '')`);
    }

    if (operatingYear) {
      conditions.push(`operating_date LIKE $${paramIndex}`);
      values.push(`${operatingYear}%`);
      paramIndex++;
    }

    if (dateFrom) {
      conditions.push(`operating_date >= $${paramIndex}`);
      values.push(dateFrom);
      paramIndex++;
    }

    if (dateTo) {
      conditions.push(`operating_date <= $${paramIndex}`);
      values.push(dateTo);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const pool = getPool();

    // Count query
    const countQuery = `SELECT COUNT(*)::int AS total FROM companies ${whereClause}`;
    const countRes = await pool.query(countQuery, values);
    const total = countRes.rows[0].total;

    // Data query
    const dataQuery = `
      SELECT 
        id,
        tax_id,
        company_name,
        international_name,
        short_name,
        tax_address,
        address,
        status,
        legal_representative,
        phone,
        operating_date,
        license_date,
        managed_by,
        company_type,
        main_industry,
        main_industry_code,
        source_url,
        province,
        source_category,
        created_at
      FROM companies
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataRes = await pool.query(dataQuery, [...values, limit, offset]);

    return NextResponse.json({
      companies: dataRes.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies', details: error.message },
      { status: 500 }
    );
  }
}
