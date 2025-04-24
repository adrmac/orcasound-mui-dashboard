import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import MuktaTTF from './Mukta/Mukta-Regular.ttf'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter, RouterProvider, Routes, Route, createBrowserRouter } from "react-router-dom";
import DetectionLayout from "./pages/DetectionLayout";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import RawData from './pages/RawData';
import DashLayout from './layouts/DashLayout';
import Detection from './pages/Detection';
import Reports from './pages/Reports';
import Candidates from './pages/Candidates';


const client = new QueryClient();
export const theme = createTheme({
  typography: {
    fontFamily: [
      "Mukta",
      "serif"
    ].join(',')
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: 'Mukta';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('Mukta'), local('Mukta-Regular'), url(${MuktaTTF}) format('ttf');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
      `
    }
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  // palette: {
  //   mode: "dark",
  //   primary: {
  //     main: '#080D26',
  //   }
  // },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
})

const router = createBrowserRouter([
  {
    Component: Home,
    children: [
      {
        path: '/',
        Component: DashLayout,
        children: [
          {
            path: '',
            Component: Candidates,
          },
          {
            path: ':itemId',
            Component: DetectionLayout
          },
          {
            path: 'rawdata',
            Component: RawData,
          },
          {
            path: 'search',
            Component: App,
          },
          {
            path: 'reports',
            Component: Reports,
          }
        ]
      },
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme} defaultMode="dark">
          <RouterProvider router={router} />            
          </ThemeProvider>
        </QueryClientProvider>
      </LocalizationProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
