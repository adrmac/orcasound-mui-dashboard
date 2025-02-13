
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({onChange, name, value, list=[], size="large"}) {

  return (
    <Box sx={{ flex: 1, minWidth: "200px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select {name}</InputLabel>
        <Select
          placeholder={"Select " + name}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={"Select " + name}
          onChange={onChange}
          name={name}
          size={size}
        >
          {list.map(el => <MenuItem key={el} value={el}>{el}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}