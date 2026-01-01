export function numberToWords(number: number): string {
  if (number === 0) return 'Nol Rupiah';

  const units = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  function convertGroup(n: number): string {
    if (n === 0) return ''; // Handle zero for intermediate groups

    if (n < 12) {
      return units[n];
    } else if (n < 20) {
      return units[n - 10] + ' Belas';
    } else if (n < 100) {
      const puluh = units[Math.floor(n / 10)];
      const satuan = units[n % 10];
      return (puluh === '' ? '' : puluh + ' Puluh ') + satuan;
    } else if (n < 200) {
      return 'Seratus ' + convertGroup(n - 100);
    } else if (n < 1000) {
      const ratus = units[Math.floor(n / 100)];
      const sisa = convertGroup(n % 100);
      return (ratus === '' ? '' : ratus + ' Ratus ') + sisa;
    } else if (n < 2000) {
      return 'Seribu ' + convertGroup(n - 1000);
    } else if (n < 1000000) {
      const ribu = convertGroup(Math.floor(n / 1000));
      const sisa = convertGroup(n % 1000);
      return (ribu === '' ? '' : ribu + ' Ribu ') + sisa;
    } else if (n < 1000000000) {
      const juta = convertGroup(Math.floor(n / 1000000));
      const sisa = convertGroup(n % 1000000);
      return (juta === '' ? '' : juta + ' Juta ') + sisa;
    } else if (n < 1000000000000) {
      const milyar = convertGroup(Math.floor(n / 1000000000));
      const sisa = convertGroup(n % 1000000000);
      return (milyar === '' ? '' : milyar + ' Milyar ') + sisa;
    }
    return '';
  }

  // Clean up extra spaces
  return convertGroup(number).replace(/\s+/g, ' ').trim() + ' Rupiah';
}
