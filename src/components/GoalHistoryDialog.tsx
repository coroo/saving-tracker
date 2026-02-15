import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Icon } from '@iconify/react';
import type { Goal } from '../types/goal';
import type { SavingTransaction } from '../types/goal';
import { formatCurrency } from '../utils/currency';
import { formatTransactionDate } from '../utils/date';

interface GoalHistoryDialogProps {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
}

export function GoalHistoryDialog({ open, goal, onClose }: GoalHistoryDialogProps) {
  const transactions = (goal?.transactions ?? []).slice().reverse();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Riwayat Tabungan</DialogTitle>
      <DialogContent>
        {goal && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {goal.icon?.includes(':') ? (
                <Icon icon={goal.icon} width={24} height={24} />
              ) : (
                <Typography component="span" variant="h6">
                  {goal.icon || '🎯'}
                </Typography>
              )}
              <Typography variant="subtitle1" fontWeight={600}>
                {goal.title}
              </Typography>
            </Box>

            {transactions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                Belum ada riwayat. Gunakan &quot;Tambah Tabungan&quot; atau &quot;Kurangi&quot; untuk mencatat.
              </Typography>
            ) : (
              <List disablePadding>
                {transactions.map((tx: SavingTransaction) => (
                  <ListItem
                    key={tx.id}
                    disableGutters
                    sx={{
                      py: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: tx.type === 'debit' ? 'success.main' : 'error.main',
                        color: 'white',
                        mr: 1.5,
                        flexShrink: 0,
                      }}
                    >
                      {tx.type === 'debit' ? (
                        <AddCircleOutlineIcon fontSize="small" />
                      ) : (
                        <RemoveCircleOutlineIcon fontSize="small" />
                      )}
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {tx.type === 'debit' ? 'Tambah' : 'Kurangi'}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={tx.type === 'debit' ? 'success.main' : 'error.main'}
                          >
                            {tx.type === 'debit' ? '+' : '-'}
                            {formatCurrency(tx.amount, goal.currency)}
                          </Typography>
                        </Box>
                      }
                      secondary={formatTransactionDate(tx.date)}
                      secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
