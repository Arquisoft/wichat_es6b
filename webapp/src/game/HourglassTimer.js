import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import './HourglassTimer.css';  


const CircularTimer = ({ timeLeft, totalTime }) => {
  const progress = ((timeLeft / totalTime - 2)) * 100;

  const getColor = () => {
    if (timeLeft > 10) return "green";
    if (timeLeft > 5) return "gold";
    return "red";
  };

  return (
    <Box className="circular-timer-container">
      <CircularProgress
        variant="determinate"
        value={progress}
        size={80}
        thickness={6}
        sx={{
          color: getColor(),
          transition: "color 0.3s ease-in-out",
        }}
      />
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
        <Typography variant="h6" fontWeight="bold">
          {timeLeft}s
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularTimer;
