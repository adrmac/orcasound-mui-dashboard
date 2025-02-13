import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export default function FixedBottomNavigation() {

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
        >
          <BottomNavigationAction label="Hydrophones" icon={<MicOutlinedIcon />} />
          <BottomNavigationAction label="Map" icon={<FmdGoodOutlinedIcon />} />
          <BottomNavigationAction label="Explore" icon={<SearchOutlinedIcon />} />
          <BottomNavigationAction label="Community" icon={<PublicOutlinedIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}