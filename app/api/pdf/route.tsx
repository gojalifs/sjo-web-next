import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { MyDocument, InvoiceData } from '@/app/templates/MyDocument';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import React from 'react'; // JSX needs React
import { z } from 'zod';

// Define Zod schema for validation
const invoiceSchema = z.object({
  transactionNo: z.string().min(1, 'Receipt number is required'),
  receivedFrom: z.string().min(1, 'Received from is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  optometrist: z.string().min(1, 'Optometrist is required'),
  frameType: z.string().min(1, 'Frame type is required'),
  framePrice: z.number().min(0, 'Frame price must be positive'),
  lensType: z.string().min(1, 'Lens type is required'),
  lensPrice: z.number().min(0, 'Lens price must be positive'),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  amountInWords: z.string().min(1, 'Amount in words is required'),
});

import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Query from database
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.receiptNo, id))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = result[0];

    // Map DB result to InvoiceData type
    const data: InvoiceData = {
      transactionNo: invoice.receiptNo,
      receivedFrom: invoice.receivedFrom,
      patientName: invoice.patientName,
      optometrist: invoice.optometrist,
      frameType: invoice.frameType,
      framePrice: invoice.framePrice,
      lensType: invoice.lensType,
      lensPrice: invoice.lensPrice,
      totalAmount: invoice.totalAmount,
      amountInWords: invoice.amountInWords,
      location: invoice.location,
      receiver: invoice.receiver,
      date: invoice.date,
    };

    // Render to stream
    // eslint-disable-next-line react-hooks/error-boundaries
    const stream = await renderToStream(<MyDocument data={data} />);

    // Return response
    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
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

    // Validate request body
    const validation = invoiceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validation.data as InvoiceData;

    try {
      // Save to database
      await db.insert(invoices).values({
        receiptNo: data.transactionNo,
        receivedFrom: data.receivedFrom,
        patientName: data.patientName,
        optometrist: data.optometrist,
        frameType: data.frameType,
        framePrice: data.framePrice,
        lensType: data.lensType,
        lensPrice: data.lensPrice,
        totalAmount: data.totalAmount,
        amountInWords: data.amountInWords,
        location: 'Bekasi',
        receiver: 'Kholidin, A.Md.RO',
        date: data.date ?? new Date().toISOString(),
      });
      console.log('Invoice saved to database:', data.transactionNo);
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      // We continue to generate PDF even if DB save fails, or we could error out.
      // For now, let's just log it so the user still gets their PDF.
    }

    // Render to stream
    // eslint-disable-next-line react-hooks/error-boundaries
    const stream = await renderToStream(<MyDocument data={data} />);

    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${data.transactionNo}.pdf"`,
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
