import React from "react";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import DataObjectIcon from '@mui/icons-material/DataObject';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, PageContainer } from '@toolpad/core';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from "react-router-dom";
import App from '../App';
import { request, gql } from "graphql-request";
import { useQuery } from "react-query";
import '../orcasound.svg'
import SearchIcon from "@mui/icons-material/Search";


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




export default function Home() {    

  const [session, setSession] = React.useState({
    user: {
      name: 'Bharat Kashyap',
      email: 'bharatkashyap@outlook.com',
      image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);  
        
      const fetchData = () => request(endpoint, ORCA_QUERY);
      const { data, isLoading, error } = useQuery(["detections"], fetchData);
    
      if (isLoading) return "Loading...";
      if (error) return <pre>{error.message}</pre>;

     const results = data?.detections?.results ?? []
     const dedupe = results.filter((obj, index, arr) => 
        arr.findIndex(el => el.timestamp === obj.timestamp && el.description === obj.description) === index
     )
     const dataset = dedupe.map(el => ({
        ...el,
        timestampObj: new Date(el.timestamp)
      }));

    return (
        // preview-start
        <ReactRouterAppProvider
          navigation={NAVIGATION}
          theme={demoTheme}
          session={session}
          authentication={authentication}    
          branding={{
            logo: <div style={{height: "100%", display: "flex"}}><img src="https://live.orcasound.net/_next/static/media/wordmark-white.690b678a.svg" style={{width: "150px"}}alt="Orcasound logo" /></div>,
            homeUrl: '/',
            title: ''
          }}
        >
                <Outlet context={[dataset]}/>
        </ReactRouterAppProvider>
        // preview-end
      );
}

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Candidates',
    icon: <BarChartIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
  {
    segment: 'rawdata',
    title: 'JSON',
    icon: <DataObjectIcon />,
  },
  {
    segment: 'search',
    title: 'Search',
    icon: <SearchIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Section',
  },
  {
    segment: '#',
    title: 'Dropdown',
    icon: <BarChartIcon />,
    children: [
      {
        segment: '#',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: '#',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: '#',
    title: 'Tab',
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});






