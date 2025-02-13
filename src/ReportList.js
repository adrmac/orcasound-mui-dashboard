import React, { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DetectionLayout from "./pages/DetectionLayout";

const tagRegex = ['s[0-9]+', 'srkw', 'call', 'j pod', 'j-pod']

const ListItemButtonState = ({feed, category, timestamp, timestampObj, description, id}) => {
    const [tags, setTags] = React.useState([]);
    const [playing, setPlaying] = React.useState(false);

    const addTags = () => {
        let tags = description.match(new RegExp(tagRegex.join('|'),'gi'));

        setTags((prevTags) => (tags))
      }

    const handlePlayerClick = (e) => {
        console.log(e.target.alt + " " + playing)
        setPlaying((prevState) => (!prevState))
    }

    const navigate = useNavigate();
    const handleItemClick = (e) => {
        navigate(`/${e.target.id}`)
    }
      
    useEffect(() => {
        if (description && description.length) {
            addTags();
        } 
      }, [])
    

    return (
        <ListItemButton className='list-item-button'>
        <ListItemAvatar>
            { playing ?
                <PauseCircleIcon onClick={handlePlayerClick} style={{ fontSize: 40, opacity: .9 }} alt="Pause"/> : 
                <PlayCircleIcon onClick={handlePlayerClick} style={{ fontSize: 40, opacity: .9 }} alt="Play" /> 
            }
        </ListItemAvatar>
        <Link to={'/' + id} style={{color: "inherit", textDecoration: "inherit", width: "100%", display: "flex", justifyContent: "space-between"}}>
        <ListItemText className='list-item-text' secondary={description ? feed.name + ' • ' + description : feed.name} primary={category + ' • ' + timestampObj.toLocaleDateString() + " " + timestampObj.toLocaleTimeString()} />
        {tags ? tags.map(tag => <Chip label={tag} key={tag} variant="filled"/>) : ""}
        </Link>
      </ListItemButton>
)
}


export default function ReportList({data}) {
    return (
        <List>
        {data.map(({ feed, category, timestampObj, description, id, timestamp }, index) => (
            <ListItemButtonState timestamp={timestamp} id={id} key={index + feed.name} feed={feed} category={category} timestampObj={timestampObj} description={description} />
        ))}
      </List>
    )
}