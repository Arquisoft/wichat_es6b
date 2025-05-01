import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import './HourglassTimer.css';  
import PropTypes from "prop-types"


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

// timeLeft y totalTime deben ser un número y son obligatorios
CircularTimer.propTypes = {
  timeLeft: PropTypes.number.isRequired,  
  totalTime: PropTypes.number.isRequired, 
};

export default CircularTimer;
