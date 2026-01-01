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
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  logoLeft: {
    width: 60,
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  logoRight: {
    width: 60,
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 10,
    marginLeft: 50,
  },
  headerCenterImage: {
    width: 200 /* 715 235 */,
    height: 47,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
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
    marginLeft: 20,
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
  transactionNo: string;
  receivedFrom: string;
  patientName: string;
  optometrist: string;
  frameType: string;
  framePrice: number;
  lensType: string;
  lensPrice: number;
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
            {/* <Text style={{ fontSize: 8 }}>SJO Logo</Text> */}
            {/* React-pdf requires absolute paths or buffers for images in Node.js environment */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={path.join(process.cwd(), 'public/derajat.png')}
              style={{ width: 60, height: 60 }}
            />
          </View>
          <View style={styles.headerCenter}>
            <Image
              src={path.join(process.cwd(), 'public/company.jpg')}
              style={styles.headerCenterImage}
            />
            {/* <Text style={styles.companyName}>Optik Perwira Jaya</Text> */}
            <Text style={styles.companyAddress}>
              Jl. Kp. Selangnangka Rt001/030, Wanasari, Cibitung
            </Text>
            <Text style={styles.companyAddress}>
              Cabang Perum Mutiara Muktiwari blok A3K/9
            </Text>
            <Text style={styles.companyAddress}>
              Hp: 081289222460 | 0813-3078-2309
            </Text>
          </View>
          {/* <View style={styles.logoRight}>
            <Text style={{ fontSize: 8 }}>Glasses</Text>
          </View> */}
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.titleMain}>Bukti Pembayaran</Text>
          <Text style={styles.titleSub}>No : {data.transactionNo}</Text>
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
          <View>
            <Text style={[styles.paymentHeader, { marginLeft: 20 }]}>
              Kacamata
            </Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Jenis Frame</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.itemLabel}>{data.frameType}</Text>
              {/* <Text style={{ width: 200 }}>{data.framePrice}</Text> */}
              <Text style={styles.itemSpacer} />
              <Text style={styles.itemCurrency}>Rp</Text>
              <Text style={styles.itemAmount}>
                {formatCurrency(data.framePrice)}
              </Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Jenis Lensa</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={{ width: 200 }}>{data.lensType}</Text>
              <Text style={styles.itemSpacer} />
              <Text style={styles.itemCurrency}>Rp</Text>
              <Text style={styles.itemAmount}>
                {formatCurrency(data.lensPrice)}
              </Text>
            </View>
          </View>
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
            {data.location ?? 'Bekasi'},{' '}
            {/* format date in dd mm yyyy format */}
            {data.date ??
              new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
          </Text>
          <Text style={styles.signatureText}>Yang Menerima</Text>
          <Text style={styles.signerName}>
            {data.receiver ?? 'Kholidin, A.Md.RO'}
          </Text>
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
