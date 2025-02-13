import React from "react";
import { Outlet, data, useOutletContext } from "react-router-dom";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Select, Box, Stack, Typography, Card, CardContent, CardActions, Button, CardActionArea } from "@mui/material";
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
        label: "Group reports within 15 min",
        value: 15
    },
    {
        label: "Group reports within 30 min",
        value: 30
    },
    {
        label: "Group reports within 60 min",
        value: 60
    },
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


const createCandidates = (dataset, interval) => {
    const candidates = [];
    dataset.forEach((el) => {
        if (!candidates.length) {
            const firstArray = [];
            firstArray.push(el);
            candidates.push(firstArray);
        }
        else {
            const hydrophone = el.feed.name;
            const findLastMatchingArray = () => {
                for (let i = candidates.length - 1; i >= 0; i--) {
                    if(candidates[i][0].feed.name === hydrophone) {
                        return candidates[i];
                    }
                }
            };
            const lastMatchingArray = findLastMatchingArray();
            const lastTimestamp = lastMatchingArray && lastMatchingArray[lastMatchingArray.length - 1].timestamp;
            if (lastTimestamp && (Math.abs(Date.parse(lastTimestamp) - Date.parse(el.timestamp)) / (1000 * 60)) <= interval) {
                lastMatchingArray.push(el);
            } else {
                const newArray = [];
                newArray.push(el);
                candidates.push(newArray);
            }
        }
    });
    return candidates;
}



export default function Candidates() {
    const [dataset] = useOutletContext();
    const [filters, setFilters] = React.useState(
        {
          timeRange: threeDays,
          timeIncrement: 15,
          hydrophone: "All hydrophones",
          category: "All categories"
        }
      );
    
      const handleChange = (event) => {
        const { name, value } = event.target;
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
      
    const candidates = createCandidates(filteredData, filters.timeIncrement);

    const countCategories = (el, cat) => {
        return el.filter(d => d.category.toLowerCase() === cat).length;
    }
    const counts = candidates.map(can => ({
        whale: countCategories(can, "whale"),
        vessel: countCategories(can, "vessel"),
        other: countCategories(can, "other"),
        hydrophone: can[0].feed.name,
        descriptions: can.map(el => el.description).filter(el => el !== null).join(" • ")
    }))


    return (
        <Stack>
            <ReportsBarChart dataset={filteredData} filter={filters.timeRange} feedList={feedList}/>
            <Box style={{display: "flex", margin: "24px 0", gap: "1rem", flexWrap: "wrap"}}>
                <ChartSelect name={'timeRange'} value={filters.timeRange} list={timeRangeSelect} onChange={handleChange} />
                <ChartSelect name={'hydrophone'} value={filters.hydrophone} list={feedList} onChange={handleChange}/>
                <ChartSelect name={'category'} value={filters.category} list={categorySelect} onChange={handleChange}/>
                <ChartSelect name={'timeIncrement'} value={filters.timeIncrement} list={timeIncrementSelect} onChange={handleChange}/>
            </Box>
            <Stack spacing={3}>
            {candidates.map((el, index) => (
            <Card index={el[0].timestamp}>
                <CardActionArea>
                <CardContent>
                   <Typography variant="h6" component="div" >
                    {new Date(el[el.length - 1].timestamp).toLocaleString()} 
                    </Typography>
                    <Typography variant="body1">
                    {counts[index].hydrophone}{" • "}                
                    {!Math.round((Date.parse(el[0].timestamp) - Date.parse(el[el.length - 1].timestamp)) / (1000 * 60)) ? "30 seconds" :
                        Math.round((Date.parse(el[0].timestamp) - Date.parse(el[el.length - 1].timestamp)) / (1000 * 60)) >= 1 ? 
                        Math.round((Date.parse(el[0].timestamp) - Date.parse(el[el.length - 1].timestamp)) / (1000 * 60)) + " minutes" : 
                        Math.round((Date.parse(el[0].timestamp) - Date.parse(el[el.length - 1].timestamp)) / (1000 * 60 * 60)) + " seconds"} 
                <br />
                {["whale","vessel","other"].map(item => 
                    counts[index][item] ? counts[index][item] + "  " + item : null
                ).filter(el => el !== null).join(" • ")}
                {counts[index].descriptions ? (<div>{"Descriptions: " + counts[index].descriptions}</div>) : (<br />)}
                </Typography>
                </CardContent>
                </CardActionArea>
            </Card>
            ))}
            </Stack>
        </Stack>
    )
}
