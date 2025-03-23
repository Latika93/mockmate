import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TopicSelection } from "./steps/TopicSelection";
import { PartnerSelection } from "./steps/PartnerSelection";
import { LevelSelection } from "./steps/LevelSelection";
import { DateTimeSelection } from "./steps/DateTimeSelection";

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  "Select Topic",
  "Choose Partner",
  "Select Level",
  "Schedule Time",
];

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "70%",
    maxWidth: "800px",
    padding: theme.spacing(3),
  },
}));

const topics = ["DSA", "Frontend", "Backend", "System Design", "HR"];
const partnerTypes = ["Peer", "Expert", { value: "AI", disabled: true }];

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  open,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    topic: "",
    partnerType: "",
    level: "same",
    dateTime: "",
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData);
    onClose();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <TopicSelection formData={formData} setFormData={setFormData} />;
      case 1:
        return (
          <PartnerSelection formData={formData} setFormData={setFormData} />
        );
      case 2:
        return <LevelSelection formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <DateTimeSelection formData={formData} setFormData={setFormData} />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" align="center" fontWeight="bold">
          Schedule Your Mock Interview
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, minHeight: "250px" }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
          >
            {activeStep === steps.length - 1 ? "Schedule Interview" : "Next"}
          </Button>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};
