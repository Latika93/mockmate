import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const partners = [
  {
    type: "Peer",
    icon: <PersonIcon fontSize="large" />,
    description: "Practice with fellow learners",
  },
  {
    type: "Expert",
    icon: <WorkIcon fontSize="large" />,
    description: "Get feedback from industry professionals",
  },
  {
    type: "AI",
    icon: <SmartToyIcon fontSize="large" />,
    description: "Coming soon!",
    disabled: true,
  },
];

export const PartnerSelection = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Choose your interview partner
      </Typography>
      <Grid container spacing={3}>
        {partners.map((partner) => (
          <Grid item xs={12} sm={4} key={partner.type}>
            <Card
              onClick={() =>
                !partner.disabled &&
                setFormData({ ...formData, partnerType: partner.type })
              }
              sx={{
                cursor: partner.disabled ? "not-allowed" : "pointer",
                opacity: partner.disabled ? 0.5 : 1,
                transform:
                  formData.partnerType === partner.type
                    ? "scale(1.05)"
                    : "none",
                border:
                  formData.partnerType === partner.type
                    ? "2px solid primary.main"
                    : "none",
                transition: "all 0.2s",
                "&:hover": {
                  transform: partner.disabled ? "none" : "scale(1.05)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                {partner.icon}
                <Typography variant="h6">{partner.type}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {partner.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
