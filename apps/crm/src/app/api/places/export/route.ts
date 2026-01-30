import { NextRequest, NextResponse } from 'next/server';
import { getAllPlacesForExport } from '@/app/dashboard/places/actions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { columns, ids } = body as { columns: string[]; ids?: string[] };

        if (!columns || !Array.isArray(columns) || columns.length === 0) {
            return NextResponse.json(
                { error: 'Columns array is required' },
                { status: 400 }
            );
        }

        const { data, error } = await getAllPlacesForExport(columns, ids);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        if (data.length === 0) {
            return NextResponse.json(
                { error: 'No data to export' },
                { status: 404 }
            );
        }

        // Build CSV content
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row =>
                headers.map(h => {
                    const val = row[h];
                    if (val === null || val === undefined) return '';
                    const str = String(val);
                    // Escape quotes and wrap in quotes if contains comma, quote, or newline
                    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                        return `"${str.replace(/"/g, '""')}"`;
                    }
                    return str;
                }).join(',')
            )
        ];

        const csv = csvRows.join('\n');

        // Return as downloadable CSV
        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="activities_export_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export API error:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}
