import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { APP_NAME } from '../constants/app';

export function Profile() {
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
        Profil
      </Typography>

      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
        }}
      >
        <PersonOutlineIcon
          sx={{
            fontSize: 80,
            color: 'action.disabled',
            mb: 2,
          }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Coming soon
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fitur profil akan segera hadir.
        </Typography>
      </Box>
    </Box>
  );
}
