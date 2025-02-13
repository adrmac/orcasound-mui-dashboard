import './App.css';
import React, { useState, useEffect } from "react";
import { request, gql } from "graphql-request";
import { useQuery } from "react-query";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Stack, Button, Container, Typography, Box, Toolbar, IconButton } from '@mui/material';
import FixedBottomNavigation from './components/FixedBottomNavigation';
import BasicSelect from './components/BasicSelect';
import ReportList from './ReportList';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import ControlledDatePicker from './components/ControlledDatePicker';
import SearchBarOne from './components/SearchBarOne';
import InputAdornments from './InputAdornments';
import { useOutletContext } from 'react-router-dom';
import AppBarOrca from './components/AppBarOrca';

// react-query
const endpoint = "https://live.orcasound.net/graphiql/";

const ORCA_QUERY = gql`
{
  detections( limit:250 ) {
    results {
			id
      timestamp
      category
      description
      listenerCount
      feed {
        name
      }
     candidate {
       id
     }
    }
  }
}
`;

// dayjs plugin for date pickers
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const boxStyle = {
  display: "flex", 
  width: "100%", 
  gap: "1rem", 
  flexWrap: "wrap"}

function App() {
  const [dataset] = useOutletContext();

  const [filters, setFilters] = React.useState(
    {
      feed: '',
      category: '',
      startDate: dayjs('2025-01-07'),
      endDate: dayjs(),
    }
  );

  const [searchQuery, setSearchQuery] = React.useState('');

  const initState = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: dayjs(dataset[dataset.length - 1].timestamp) 
    }))
  }

  useEffect(() => {
    dataset.length ?? initState();
  }, [])
/*
  const fetchData = () => request(endpoint, ORCA_QUERY);
  const { data, isLoading, error } = useQuery(["detections"], fetchData);

  if (isLoading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;

  const results = data?.detections?.results ?? [];
*/

  const filteredData = dataset.filter((el) => {
    return (
      (filters.feed === '' || filters.feed === "All" || el.feed.name === filters.feed) && 
      (filters.category === '' || filters.category === "All" || el.category === filters.category) && 
      dayjs(el.timestamp).isSameOrAfter(filters.startDate, "day") && 
      dayjs(el.timestamp).isSameOrBefore(filters.endDate, "day") &&
      (searchQuery === '' || (el.description && el.description.toLowerCase().includes(searchQuery)) ||
      el.category.toLowerCase().includes(searchQuery) || el.feed.name.toLowerCase().includes(searchQuery))
      );
  });

/* EXAMPLE OF TOTALLY UNSUSTAINABLE METHOD FOR MULTIFILTERS
const filterFunc = data => {
    if((!feed || feed === "All") && (!category || category === "All") ) {
      return data;
    } else if (!feed || feed === "All") {
      return data.filter(el => el.category === category);
    } else if (!category || category === "All") {
      return data.filter(el => el.feed.name === feed);
    } else {
      return detections.filter(el => el.feed.name === feed && el.category === category);
    }
  }
*/
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log('fired handleChange and captured ' + name + " " + value)
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleDatePicker = (name, value) => {
    console.log(" name: " + name + " value: " + dayjs(value) + " " + (typeof dayjs(value)) + " " + Date(value))
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }))
  }

  const feedList = [...new Set(dataset.map(el => el.feed.name))];
  feedList.unshift("All");

  const categoryList = [...new Set(dataset.map(el => el.category))];
  categoryList.unshift("All");

  return (
    <div className="App" style={{textAlign: 'left'}}>
      <AppBarOrca />
      {  (<Box>
      <Stack spacing={3} style={{padding: "30px 20px"}}>
        <Box style={boxStyle}>
          <SearchBarOne setSearchQuery={setSearchQuery} />
        </Box>
        <Box style={boxStyle}>
          <BasicSelect onChange={handleChange} name="feed" list={feedList} value={filters.feed} />
          <BasicSelect onChange={handleChange} name="category" list={categoryList} value={filters.category} />
          <ControlledDatePicker label="Start date" valueProp={filters.startDate} name="startDate" onDataChange={handleDatePicker}/>
          <ControlledDatePicker label="End date" valueProp={filters.endDate} name="endDate" onDataChange={handleDatePicker}/>
        </Box>
      </Stack>
      <ReportList data={filteredData}/>
      </Box>)}
      <FixedBottomNavigation />
    </div>
  );
}

export default App;
