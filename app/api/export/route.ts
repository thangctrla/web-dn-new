import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q')?.trim() || '';
    const taxId = searchParams.get('tax_id')?.trim() || '';
    const province = searchParams.get('province')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const companyType = searchParams.get('company_type')?.trim() || '';
    const hasPhone = searchParams.get('has_phone') === 'true' || searchParams.get('has_phone') === '1';
    const operatingYear = searchParams.get('operating_year')?.trim() || '';

    const sortByParam = searchParams.get('sort_by') || 'operating_date';
    const sortOrderParam = (searchParams.get('sort_order') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';

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
        address ILIKE $${paramIndex}
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

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const pool = getPool();

    // Export up to 2000 rows
    const query = `
      SELECT 
        tax_id,
        company_name,
        legal_representative,
        phone,
        status,
        province,
        address,
        main_industry,
        company_type,
        operating_date
      FROM companies
      ${whereClause}
      ${orderClause}
      LIMIT 2000
    `;

    const res = await pool.query(query, values);

    // Build CSV with UTF-8 BOM
    const headers = [
      'Mã số thuế',
      'Tên công ty',
      'Người đại diện',
      'Số điện thoại',
      'Trạng thái',
      'Tỉnh thành',
      'Địa chỉ',
      'Ngành nghề chính',
      'Loại hình',
      'Ngày hoạt động'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += headers.map(escapeCsv).join(',') + '\r\n';

    for (const row of res.rows) {
      csvContent += [
        row.tax_id,
        row.company_name,
        row.legal_representative,
        row.phone,
        row.status,
        row.province,
        row.address,
        row.main_industry,
        row.company_type,
        row.operating_date,
      ].map(escapeCsv).join(',') + '\r\n';
    }

    const filename = `danh_sach_doanh_nghiep_${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
