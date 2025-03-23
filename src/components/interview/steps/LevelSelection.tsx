import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Slider, FormControl } from '@mui/material';

export const LevelSelection = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  const [showCustomLevel, setShowCustomLevel] = React.useState(false);

  const handleLevelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setShowCustomLevel(value === 'custom');
    setFormData({ ...formData, level: value === 'same' ? 'same' : formData.level });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Experience Level
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We'll match you with someone close to your experience level for the best learning experience
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup value={showCustomLevel ? 'custom' : 'same'} onChange={handleLevelTypeChange}>
          <FormControlLabel 
            value="same" 
            control={<Radio />} 
            label="Match with someone at my level"
          />
          <FormControlLabel 
            value="custom" 
            control={<Radio />} 
            label="Choose a specific level"
          />
        </RadioGroup>
      </FormControl>

      {showCustomLevel && (
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>Select Level (1-7)</Typography>
          <Slider
            value={typeof formData.level === 'number' ? formData.level : 1}
            onChange={(_, value) => setFormData({ ...formData, level: value })}
            min={1}
            max={7}
            marks
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      )}
    </Box>
  );
}; 