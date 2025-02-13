import React, { useState, useEffect } from "react";
import { Stack, Button, Container, Typography, Box, Toolbar, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ControlledDatePicker({name, label, onDataChange, valueProp}) {

    const onChange = (value) => {
        onDataChange(name, value)
    }

    return (
        <Box sx={{ flex: 1, minWidth: "200px" }}>
            <DatePicker 
                slotProps={{
                    textField: { fullWidth: true }
                }} 
                label={label} onChange={onChange} value={valueProp} />
        </Box>
    )
}