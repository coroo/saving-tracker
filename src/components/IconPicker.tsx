import { useState } from 'react';
import {
  Box,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ICON_CATEGORIES } from '../data/iconCategories';

/** URL Iconify SVG (tanpa pakai @iconify/react agar hindari duplicate React / invalid hook). */
function getIconifySvgUrl(iconId: string, size = 24): string {
  const [prefix, name] = iconId.split(':');
  if (!prefix || !name) return '';
  return `https://api.iconify.design/${prefix}/${name}.svg?width=${size}&height=${size}`;
}

interface IconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label = 'Icon' }: IconPickerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = ICON_CATEGORIES[categoryIndex];

  const isIconifyId = (v: string) => typeof v === 'string' && v.includes(':');

  const categorySelector = isMobile ? (
    <FormControl fullWidth size="medium" sx={{ mb: 1.5 }}>
      <InputLabel id="icon-category-label">Kategori</InputLabel>
      <Select
        labelId="icon-category-label"
        value={categoryIndex}
        label="Kategori"
        onChange={(e) => setCategoryIndex(Number(e.target.value))}
      >
        {ICON_CATEGORIES.map((cat, i) => (
          <MenuItem key={cat.id} value={i}>
            {cat.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Tabs
      value={categoryIndex}
      onChange={(_, v) => setCategoryIndex(v)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{
        minHeight: 40,
        mb: 1,
        '& .MuiTab-root': { minHeight: 40, py: 0.5, fontSize: '0.8rem' },
      }}
    >
      {ICON_CATEGORIES.map((cat, i) => (
        <Tab key={cat.id} label={cat.label} id={`icon-tab-${i}`} aria-controls={`icon-tabpanel-${i}`} />
      ))}
    </Tabs>
  );

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      {categorySelector}
      <Box
        role="tabpanel"
        id={`icon-tabpanel-${categoryIndex}`}
        aria-labelledby={isMobile ? undefined : `icon-tab-${categoryIndex}`}
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? 'repeat(auto-fill, minmax(52px, 1fr))'
            : 'repeat(auto-fill, minmax(44px, 1fr))',
          gap: isMobile ? 0.75 : 0.5,
          maxHeight: 220,
          overflowY: 'auto',
          p: isMobile ? 1 : 0.5,
          bgcolor: 'action.hover',
          borderRadius: 2,
        }}
      >
        {category.icons.map((iconId) => (
          <IconButton
            key={iconId}
            onClick={() => onChange(iconId)}
            size={isMobile ? 'medium' : 'small'}
            sx={{
              border: value === iconId ? 2 : 1,
              borderColor: value === iconId ? 'primary.main' : 'divider',
              borderRadius: 2,
              minWidth: isMobile ? 48 : undefined,
              minHeight: isMobile ? 48 : undefined,
              '&:hover': {
                bgcolor: 'action.selected',
              },
            }}
            aria-pressed={value === iconId}
            aria-label={`Pilih icon ${iconId}`}
          >
            <img
              src={getIconifySvgUrl(iconId)}
              alt=""
              width={24}
              height={24}
              loading="lazy"
              style={{ display: 'block' }}
            />
          </IconButton>
        ))}
      </Box>
      {value && isIconifyId(value) && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Terpilih: {value}
        </Typography>
      )}
    </Box>
  );
}
