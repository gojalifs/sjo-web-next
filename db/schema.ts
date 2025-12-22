import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  receiptNo: text('receipt_no').notNull().unique(),
  receivedFrom: text('received_from').notNull(),
  patientName: text('patient_name').notNull(),
  optometrist: text('optometrist').notNull(),
  frameType: text('frame_type').notNull(),
  framePrice: integer('frame_price').notNull(),
  lensType: text('lens_type').notNull(),
  lensPrice: integer('lens_price').notNull(),
  totalAmount: integer('total_amount').notNull(),
  amountInWords: text('amount_in_words').notNull(),
  location: text('location').notNull(),
  date: text('date').notNull(),
  receiver: text('receiver').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
