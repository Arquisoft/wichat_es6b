import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const CircularTimer = ({ timeLeft, totalTime }) => {
  const progress = (timeLeft / totalTime) * 100;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={80}
        thickness={6}
        sx={{
          color: timeLeft <= 3 ? "red" : "gold",
          transition: "color 0.3s ease-in-out",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {timeLeft}s
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularTimer;
