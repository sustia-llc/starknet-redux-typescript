import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = (darkMode: boolean) =>
createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    h6: {
      fontSize: '.7rem',
      '@media (min-width:600px)': {
        fontSize: '.7rem',
      },
    },
  },
});

export default theme;
