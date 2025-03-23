import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import GroupIcon from '@mui/icons-material/Group';

const topics = [
  { name: 'DSA', icon: <CodeIcon fontSize="large" />, description: 'Data Structures & Algorithms' },
  { name: 'Frontend', icon: <CodeIcon fontSize="large" />, description: 'Web Development & UI' },
  { name: 'Backend', icon: <StorageIcon fontSize="large" />, description: 'Server-side & APIs' },
  { name: 'System Design', icon: <ArchitectureIcon fontSize="large" />, description: 'Architecture & Scalability' },
  { name: 'HR', icon: <GroupIcon fontSize="large" />, description: 'Behavioral & Cultural Fit' },
];

export const TopicSelection = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        What would you like to practice today?
      </Typography>
      <Grid container spacing={2}>
        {topics.map((topic) => (
          <Grid item xs={12} sm={6} md={4} key={topic.name}>
            <Card 
              onClick={() => setFormData({ ...formData, topic: topic.name })}
              sx={{
                cursor: 'pointer',
                transform: formData.topic === topic.name ? 'scale(1.05)' : 'none',
                border: formData.topic === topic.name ? '2px solid primary.main' : 'none',
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {topic.icon}
                <Typography variant="h6">{topic.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {topic.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 