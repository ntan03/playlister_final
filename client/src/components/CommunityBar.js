import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import SortIcon from '@mui/icons-material/Sort';

function CommunityBar() {
    const { store } = useContext(GlobalStoreContext);
    const [ text, setText ] = useState('');

    useEffect(() => {
        setText('');
    }, [store.page])

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            console.log('Searching for: ', text)
            switch (store.page) {
                case 0:
                    store.searchLoggedInUser(text);
                    break;
                case 1:
                    store.searchAllPublishedLists(text);
                    break;
                case 2:
                    store.searchUserLists(text);
                    break;
                default:
                    break;
            }
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
        // console.log(text);
    }

    return (
        <AppBar position="static" sx={{ bgcolor: '#cdcdcd' }}>
            <Toolbar sx={{ display: 'grid', gridTemplateColumns: '10% 55% 25% 5% 5%'}}>
                <Box sx={{ gridColumn: '1/2' }}>
                    <IconButton onClick={() => {store.setPage(0)}}>
                        <HomeIcon></HomeIcon>
                    </IconButton>
                    <IconButton onClick={() => {store.setPage(1)}}>
                        <PersonIcon></PersonIcon>
                    </IconButton>
                    <IconButton onClick={() => {store.setPage(2)}}>
                        <GroupsIcon></GroupsIcon>
                    </IconButton>
                </Box>
                <Box sx={{ gridColumn: '2/3' }}>
                    <TextField 
                        fullWidth 
                        label="Search..." 
                        value={text}
                        onChange={handleUpdateText}
                        onKeyPress={handleKeyPress}
                        variant="outlined"/>
                </Box>
                <Box sx={{ gridColumn: '4/5' }}>
                    <h2 className="sort-tag">Sort by</h2>
                </Box>
                <Box sx={{ gridColumn: '5/6' }}>
                    <IconButton>
                        <SortIcon sx={{gridColumn: '5/6' }}></SortIcon>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default CommunityBar;