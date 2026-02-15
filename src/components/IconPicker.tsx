import { useState } from 'react';
import { Box, IconButton, Tabs, Tab, Typography } from '@mui/material';
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
  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = ICON_CATEGORIES[categoryIndex];

  const isIconifyId = (v: string) => typeof v === 'string' && v.includes(':');

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
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
      <Box
        role="tabpanel"
        id={`icon-tabpanel-${categoryIndex}`}
        aria-labelledby={`icon-tab-${categoryIndex}`}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
          gap: 0.5,
          maxHeight: 220,
          overflowY: 'auto',
          p: 0.5,
          bgcolor: 'action.hover',
          borderRadius: 2,
        }}
      >
        {category.icons.map((iconId) => (
          <IconButton
            key={iconId}
            onClick={() => onChange(iconId)}
            size="small"
            sx={{
              border: value === iconId ? 2 : 1,
              borderColor: value === iconId ? 'primary.main' : 'divider',
              borderRadius: 2,
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
