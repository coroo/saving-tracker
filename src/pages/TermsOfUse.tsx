import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { APP_NAME } from '../constants/app';

export function TermsOfUse() {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', p: 2, pb: 4 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Kembali
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <img src="/assets/lexa_saving_nobg.png" alt="" width={24} height={24} style={{ display: 'block' }} />
        <Typography variant="body2" color="text.secondary">
          {APP_NAME}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Ketentuan Penggunaan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
      </Typography>

      <Typography variant="body1" paragraph>
        Selamat datang di {APP_NAME}. Dengan menggunakan Aplikasi ini, Anda menyetujui ketentuan penggunaan berikut.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        1. Penerimaan Ketentuan
      </Typography>
      <Typography variant="body1" paragraph>
        Dengan mengakses atau menggunakan Aplikasi, Anda setuju untuk terikat oleh Ketentuan Penggunaan ini. Jika Anda tidak setuju, jangan gunakan Aplikasi.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        2. Deskripsi Layanan
      </Typography>
      <Typography variant="body1" paragraph>
        {APP_NAME} adalah aplikasi untuk melacak tujuan menabung pribadi. Aplikasi berjalan di perangkat Anda dan menyimpan data secara lokal. Layanan disediakan &quot;sebagaimana adanya&quot; untuk keperluan informasi dan pengelolaan pribadi.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        3. Penggunaan yang Wajar
      </Typography>
      <Typography variant="body1" paragraph>
        Anda setuju untuk menggunakan Aplikasi hanya untuk tujuan yang sah dan sesuai dengan ketentuan ini. Anda tidak boleh menyalahgunakan Aplikasi untuk aktivitas ilegal, menipu, atau yang melanggar hak pihak ketiga.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        4. Data dan Tanggung Jawab
      </Typography>
      <Typography variant="body1" paragraph>
        Data yang Anda masukkan disimpan di perangkat Anda. Anda bertanggung jawab atas kerahasiaan perangkat dan akun browser Anda. Kami tidak bertanggung jawab atas kehilangan data akibat penghapusan data browser, kerusakan perangkat, atau tindakan pihak ketiga.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        5. Tidak Ada Nasihat Keuangan
      </Typography>
      <Typography variant="body1" paragraph>
        Aplikasi ini hanya alat pelacakan. Konten dan fitur tidak dimaksudkan sebagai nasihat keuangan, investasi, atau hukum. Konsultasikan dengan profesional yang qualified untuk keputusan keuangan Anda.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        6. Perubahan Layanan dan Ketentuan
      </Typography>
      <Typography variant="body1" paragraph>
        Kami dapat mengubah atau menghentikan bagian Aplikasi atau ketentuan ini kapan saja. Perubahan akan diberitahukan melalui Aplikasi. Terus menggunakan Aplikasi setelah perubahan berarti Anda menerima ketentuan yang diperbarui.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        7. Batasan Tanggung Jawab
      </Typography>
      <Typography variant="body1" paragraph>
        Dalam batas hukum yang berlaku, Aplikasi dan penyedianya tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Aplikasi.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        8. Hukum yang Berlaku
      </Typography>
      <Typography variant="body1" paragraph>
        Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Sengketa akan diselesaikan di pengadilan yang berwenang di Indonesia.
      </Typography>
    </Box>
  );
}
