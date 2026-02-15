import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { APP_NAME } from '../constants/app';

export function PrivacyPolicy() {
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
        Kebijakan Privasi
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
      </Typography>

      <Typography variant="body1" paragraph>
        Aplikasi {APP_NAME} (&quot;Aplikasi&quot;) menghormati privasi Anda. Dokumen ini menjelaskan bagaimana data Anda ditangani.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        1. Data yang Kami Kumpulkan
      </Typography>
      <Typography variant="body1" paragraph>
        Aplikasi ini berjalan sepenuhnya di perangkat Anda. Semua data yang Anda buat (tujuan menabung, jumlah, riwayat transaksi, preferensi tema) disimpan hanya di penyimpanan lokal (localStorage) browser Anda. Kami tidak mengirim data tersebut ke server manapun.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        2. Penggunaan Data
      </Typography>
      <Typography variant="body1" paragraph>
        Data di perangkat Anda hanya digunakan untuk menampilkan dan mengelola tujuan menabung Anda di dalam Aplikasi. Tidak ada analitik pihak ketiga, iklan, atau pembagian data dengan pihak lain.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        3. Penyimpanan dan Keamanan
      </Typography>
      <Typography variant="body1" paragraph>
        Data tetap di perangkat Anda. Menghapus data browser atau meng-uninstall Aplikasi akan menghapus semua data yang tersimpan. Kami tidak menyimpan salinan data di server.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        4. Perubahan
      </Typography>
      <Typography variant="body1" paragraph>
        Kebijakan privasi ini dapat diperbarui. Versi terbaru akan selalu tersedia di dalam Aplikasi. Penggunaan Aplikasi setelah perubahan dianggap sebagai penerimaan kebijakan yang diperbarui.
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        5. Hubungi Kami
      </Typography>
      <Typography variant="body1" paragraph>
        Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui informasi kontak yang tersedia di Aplikasi atau situs penyedia.
      </Typography>
    </Box>
  );
}
