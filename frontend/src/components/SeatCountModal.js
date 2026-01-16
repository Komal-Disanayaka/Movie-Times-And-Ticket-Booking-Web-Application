import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Box, 
  Typography, 
  Button, 
  Stack 
} from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

function SeatCountModal({ open, onClose, onSelectSeats }) {
  const [selectedCount, setSelectedCount] = useState(2);

  const handleConfirm = () => {
    onSelectSeats(selectedCount);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          How Many Seats?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          py: 2 
        }}>
          <Box sx={{ mb: 3 }}>
            <TwoWheelerIcon sx={{ fontSize: 80, color: 'primary.main' }} />
          </Box>
          
          <Stack 
            direction="row" 
            spacing={1} 
            flexWrap="wrap"
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                variant={selectedCount === num ? 'contained' : 'outlined'}
                onClick={() => setSelectedCount(num)}
                sx={{ 
                  minWidth: 50,
                  height: 50,
                  m: 0.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  bgcolor: selectedCount === num ? 'success.main' : 'transparent',
                  '&:hover': {
                    bgcolor: selectedCount === num ? 'success.dark' : 'action.hover'
                  }
                }}
              >
                {num}
              </Button>
            ))}
          </Stack>

          <Button 
            variant="contained" 
            size="large"
            fullWidth
            onClick={handleConfirm}
            sx={{ 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Select Seats
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default SeatCountModal;
