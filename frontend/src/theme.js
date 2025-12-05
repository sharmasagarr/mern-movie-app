import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2"
    },
    secondary: {
      main: "#f50057"
    },
    background: {
      default: "#121212",
      paper: "#1f1f1f"
    }
  }
});

export default theme;
