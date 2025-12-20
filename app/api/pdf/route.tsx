import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { MyDocument, InvoiceData } from '@/app/templates/MyDocument';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import React from 'react'; // JSX needs React

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id') || 'INV-001';

    // Example data based on query params
    const data: InvoiceData = {
      receiptNo: id,
      receivedFrom: 'Fajar',
      patientName: 'Sidik',
      optometrist: 'Prasetio',
      items: [
        { label: 'Jenis Frame', details: 'sjfksfjefsk', amount: 130000 },
        { label: 'Jenis Lensa', details: 'fuoiejnskj', amount: 350000 },
      ],
      totalAmount: 480000,
      amountInWords: 'Empat Ratus Delapan Puluh Ribu RUpiah',
      location: 'Bekasi',
      date: '1 Agustus 2025',
      receiver: 'Nursafaat, Amd.RO',
    };

    // Render to stream
    const stream = await renderToStream(<MyDocument data={data} />);

    // Return response
    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-${id}.pdf"`, // inline = preview, attachment = force download
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = body as InvoiceData;

    if (!data) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    try {
      // Save to database
      await db.insert(invoices).values({
        receiptNo: data.receiptNo,
        receivedFrom: data.receivedFrom,
        patientName: data.patientName,
        optometrist: data.optometrist,
        items: data.items,
        totalAmount: data.totalAmount,
        amountInWords: data.amountInWords,
        location: data.location,
        date: data.date,
        receiver: data.receiver,
      });
      console.log('Invoice saved to database:', data.receiptNo);
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      // We continue to generate PDF even if DB save fails, or we could error out.
      // For now, let's just log it so the user still gets their PDF.
    }

    // Render to stream
    const stream = await renderToStream(<MyDocument data={data} />);

    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${data.receiptNo}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate PDF from POST data' },
      { status: 500 }
    );
  }
}
