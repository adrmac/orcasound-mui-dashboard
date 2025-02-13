
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ChartSelect({onChange, name, value, list=[], size="small"}) {

  return (
    <Box sx={{ flex: 1, minWidth: "200px" }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={onChange}
          name={name}
          size={size}
        >
          {list.map(el => <MenuItem key={el.label} value={el.value}>{el.label}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}