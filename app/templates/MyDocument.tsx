import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

import path from 'path';

// Register a font that supports bold if needed, using standard fonts for now
Font.register({
  family: 'Roboto Mono',
  fonts: [
    { src: path.join(process.cwd(), 'public/fonts/RobotoMono-Regular.woff') },
    {
      src: path.join(process.cwd(), 'public/fonts/RobotoMono-Bold.woff'),
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Roboto Mono',
    lineHeight: 1.5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 10,
  },
  logoLeft: {
    width: 60,
    height: 40,
    backgroundColor: '#eee', // Placeholder for SJO logo
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRight: {
    width: 60,
    height: 40,
    backgroundColor: '#eee', // Placeholder for Glasses logo
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 8,
    color: '#444',
  },
  titleSection: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  titleMain: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  titleSub: {
    fontSize: 10,
  },
  infoSection: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    width: 120,
  },
  colon: {
    width: 10,
    textAlign: 'center',
  },
  value: {
    flex: 1,
  },
  paymentSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  paymentHeader: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  itemLabel: {
    width: 120,
  },
  itemCurrency: {
    width: 30,
    textAlign: 'right',
  },
  itemAmount: {
    width: 80,
    textAlign: 'right',
  },
  itemSpacer: {
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  terbilangSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  terbilangTitle: {
    marginBottom: 5,
  },
  terbilangBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
    minHeight: 30,
    justifyContent: 'center',
  },
  signatureSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 20,
    marginRight: 20,
  },
  signatureText: {
    marginBottom: 50, // Space for signature
    textAlign: 'center',
  },
  signerName: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 9,
  },
  footerBold: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
});

export interface InvoiceData {
  receiptNo: string;
  receivedFrom: string;
  patientName: string;
  optometrist: string;
  items: Array<{
    label: string;
    details: string;
    amount: number;
  }>;
  totalAmount: number;
  amountInWords: string;
  location: string;
  date: string;
  receiver: string;
}

interface InvoiceProps {
  data: InvoiceData;
}

const formatCurrency = (amount: number) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const MyDocument = ({ data }: InvoiceProps) => {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoLeft}>
            <Text style={{ fontSize: 8 }}>SJO Logo</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>Optik Satria Jaya</Text>
            <Text style={styles.companyAddress}>
              Jalan Cagak Sukamantri RT 06/02, Sukaraya, Karangbahagia - Bekasi
            </Text>
            <Text style={styles.companyAddress}>
              Perum Grand Cikarang City Cluster Sakura Blok H7/17, Cikarang
              Utara - Bekasi
            </Text>
            <Text style={styles.companyAddress}>
              Telp: 0819 0941 9741 | 0853 1112 3440
            </Text>
          </View>
          <View style={styles.logoRight}>
            <Text style={{ fontSize: 8 }}>Glasses</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.titleMain}>Bukti Pembayaran</Text>
          <Text style={styles.titleSub}>No : {data.receiptNo}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Sudah Terima Dari</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.receivedFrom}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Pasien</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.patientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nama optometris</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.optometrist}</Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentSection}>
          <Text style={{ marginBottom: 5 }}>Untuk Pembayaran</Text>
          <Text style={[styles.paymentHeader, { marginLeft: 20 }]}>
            Kacamata
          </Text>

          {data.items.map((item, index) => (
            <View style={styles.itemRow} key={index}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={{ width: 200 }}>{item.details}</Text>
              <Text style={styles.itemSpacer} />
              <Text style={styles.itemCurrency}>Rp</Text>
              <Text style={styles.itemAmount}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.itemLabel}>Total Pembayaran</Text>
            <Text style={styles.itemSpacer} />
            <Text style={styles.itemCurrency}>Rp</Text>
            <Text style={styles.itemAmount}>
              {formatCurrency(data.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Terbilang */}
        <View style={styles.terbilangSection}>
          <Text style={styles.terbilangTitle}>Terbilang</Text>
          <View style={styles.terbilangBox}>
            <Text>{data.amountInWords}</Text>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <Text style={{ marginBottom: 5 }}>
            {data.location}, {data.date}
          </Text>
          <Text style={styles.signatureText}>Yang Menerima</Text>
          <Text style={styles.signerName}>{data.receiver}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBold}>Terima Kasih</Text>
          <Text>Atas kepercayaan Anda menggunakan jasa kami.</Text>
        </View>
      </Page>
    </Document>
  );
};
