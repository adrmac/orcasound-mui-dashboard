import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Button, Select, Typography, Box } from "@mui/material";


const chartSetting = {
    yAxis: [
        {
            label: 'Reports',
            dataKey: 'detections'
        }
    ],
    height: 300,
    }



export default function ReportsBarChart({dataset, filter, feedList}) {
    const [legend, setLegend ] = React.useState(true)

    const max = Date.now();
    const min = max - filter;
    const startHour = new Date(min).setMinutes(0,0,0);
    const endHour = new Date(max).setMinutes(0,0,0)
    const timeDifferenceHours = (endHour - startHour) / (1000 * 60 * 60);

    const chartData = [];


    for (let i = 0; i < timeDifferenceHours; i++) {
        chartData.push({
            tick: i,
            milliseconds: i * 1000 * 60 * 60,
            label: (new Date(startHour + (i * 1000 * 60 * 60)).toLocaleString()),
            detections: 0,
            whale: 0,
            vessel: 0,
            other: 0,
        })
    }

    const categorySeries = [
        { dataKey: 'whale', label: 'Whale' },
        { dataKey: 'vessel', label: 'Vessel' },
        { dataKey: 'other', label: 'Other' }
    ];

    const hydrophoneSeries = feedList.map(el => (
        { dataKey: el.value.toLowerCase(), label: el.label }
    ))
    hydrophoneSeries.shift(); // remove the "all hydrophones" from legend

    const hydrophoneCounts = feedList.map(el => (
        { [el.value.toLowerCase()]: 0 }
    ))

    chartData.forEach(el => {
        hydrophoneCounts.forEach(hydro => {
            Object.assign(el, hydro)
        })
    })

    const countData = () => {
        for (let i = 0; i < dataset.length; i++) {
            const timestamp = Date.parse(dataset[i].timestamp);
            const tick = Math.ceil((timestamp - min) / (1000 * 60 * 60))
            for (let j = 0; j < chartData.length; j++) {
                if(chartData[j].tick === tick) {
                    chartData[j].detections += 1;
                    chartData[j][dataset[i].category.toLowerCase()] += 1;
                    chartData[j][dataset[i].feed.name.toLowerCase()] += 1;
                }
            }
        }    
    }
    countData()

    const handleLegend = (e) => {
        e.target.name === "category" ?
            setLegend(true) : setLegend(false)
    }

    const buttonHydro = !legend ? {
        color: "white",
    } : {};

    const buttonCat = legend ? {
        color: "white",
    } : {};
    
    return (
        <>
            <Box style={{display: "flex", gap: 16, padding: "24px 0"}}>
                <Button size="small" onClick={handleLegend} name="category" variant="outlined" {...buttonCat}>By category</Button>
                <Button size="small" onClick={handleLegend} name="hydro" variant="outlined" {...buttonHydro}>By Hydrophone</Button>
            </Box>
            <BarChart 
                dataset={chartData}
                xAxis={[{scaleType: 'band', dataKey: 'label', label: 'Hour'}]}
                slotProps={{
                    legend: {
                        position: { horizontal: 'middle', vertical: 'top'},
                        padding: {bottom: 20, top: 5}
                    }
                }}
                series={legend ? categorySeries : hydrophoneSeries}
                {...chartSetting}
            />
        </>
    )}