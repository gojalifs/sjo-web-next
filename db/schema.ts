import {
  pgTable,
  text,
  serial,
  jsonb,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  receiptNo: text('receipt_no').notNull().unique(),
  receivedFrom: text('received_from').notNull(),
  patientName: text('patient_name').notNull(),
  optometrist: text('optometrist').notNull(),
  items: jsonb('items').notNull(), // Storing items array as JSONB
  totalAmount: integer('total_amount').notNull(),
  amountInWords: text('amount_in_words').notNull(),
  location: text('location').notNull(),
  date: text('date').notNull(),
  receiver: text('receiver').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
