import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0, backgroundColor: "#212121", py: 2, textAlign: "center" }}>
      <Typography variant="body1" color="white">
        Employee Directory &copy; {new Date().getFullYear()} | All Rights Reserved
      </Typography>
    </Box>
  );
};

export default Footer;
