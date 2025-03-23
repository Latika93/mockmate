import React from 'react';
import { Box, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

export const DateTimeSelection = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Choose Your Interview Time
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a date and time that works best for you
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Interview Date & Time"
          value={formData.dateTime || null}
          onChange={(newValue) => setFormData({ ...formData, dateTime: newValue })}
          sx={{ width: '100%' }}
          minDate={new Date()}
        />
      </LocalizationProvider>
    </Box>
  );
}; 