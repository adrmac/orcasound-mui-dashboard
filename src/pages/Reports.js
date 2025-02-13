import React from "react";
import { Outlet, data, useOutletContext } from "react-router-dom";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Select, Box, Stack, Typography } from "@mui/material";
import ReportsBarChart from "../components/ReportsBarChart";
import ChartSelect from "../components/ChartSelect";
import ReportList from "../ReportList";

const sevenDays = 7 * 24 * 60 * 60 * 1000; 
const threeDays = 3 * 24 * 60 * 60 * 1000; 
const oneDay = 24 * 60 * 60 * 1000;

const timeRangeSelect = [
    {
        label: "Last 7 days",
        value: sevenDays
    },
    {
        label: "Last 3 days",
        value: threeDays
    },
    {
        label: "Last 24 hours",
        value: oneDay
    }
]

const timeIncrementSelect =[
    {
        label: "Hourly",
        value: 'hours'
    },
    {
        label: "Day/Night",
        value: 'day-night'
    }
]

const categorySelect = [
    {
        label: "All categories",
        value: "All categories"
    },
    {
        label: "Whale",
        value: "whale",
    },
    {
        label: "Vessel",
        value: "vessel",
    },
    {
        label: "Other",
        value: "other"
    }
]


export default function Reports() {
    const [dataset] = useOutletContext();
    const [filters, setFilters] = React.useState(
        {
          timeRange: threeDays,
          timeIncrement: 'hours',
          hydrophone: "All hydrophones",
          category: "All categories"
        }
      );
    
      const handleChange = (event) => {
        const { name, value } = event.target;
        console.log('fired handleChange and captured ' + name + " " + value)
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }))
      }
    
    const feedListSet = [...new Set(dataset.map(el => el.feed.name))];
    const feedList = feedListSet.map(el => ({
        label: el,
        value: el,
    }))
    feedList.unshift({label: "All hydrophones", value: "All hydrophones"})

    const max = Date.now();
    const min = max - filters.timeRange;

    const filteredData = dataset.filter((el) => {
        return (
            (Date.parse(el.timestamp) >= min) &&
            (filters.hydrophone === "All hydrophones" || el.feed.name === filters.hydrophone) &&
            (filters.category === "All categories" || el.category.toLowerCase() === filters.category)
            );
      });
    

    return (
        <Stack>
        <ReportsBarChart dataset={filteredData} filter={filters.timeRange} feedList={feedList}/>
        <Box style={{display: "flex", margin: "24px 0", gap: "1rem", flexWrap: "wrap"}}>
            <ChartSelect name={'timeRange'} value={filters.timeRange} list={timeRangeSelect} onChange={handleChange} />
            <ChartSelect name={'hydrophone'} value={filters.hydrophone} list={feedList} onChange={handleChange}/>
            <ChartSelect name={'category'} value={filters.category} list={categorySelect} onChange={handleChange}/>
        </Box>
        <ReportList data={filteredData} />
        </Stack>
    )
}
