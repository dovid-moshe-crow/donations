/* eslint-disable */

import React from "react";
import { LoadingOverlay, Box } from "@mantine/core";

const LoadingScreen = () => {
  return (
    <Box pos="relative">
      <LoadingOverlay visible={true} overlayBlur={2} />
    </Box>
  );
};

export default LoadingScreen;
