CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_no" text NOT NULL,
	"received_from" text NOT NULL,
	"patient_name" text NOT NULL,
	"optometrist" text NOT NULL,
	"items" jsonb NOT NULL,
	"total_amount" integer NOT NULL,
	"amount_in_words" text NOT NULL,
	"location" text NOT NULL,
	"date" text NOT NULL,
	"receiver" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_receipt_no_unique" UNIQUE("receipt_no")
);
