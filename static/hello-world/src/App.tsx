import { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { events, invoke } from "@forge/bridge";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0052CC",
    },
  },
});

const result = await invoke("getProjectInfo");
console.log(result);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1">
          Jira Project Assistant
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
