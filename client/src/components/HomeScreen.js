import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SortIcon from '@mui/icons-material/Sort';

import AppBanner from './AppBanner';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [ tabIndex, setTabIndex ] = useState(0);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    // function handleCreateNewList() {
    //     store.createNewList();
    // }

    const handleTabChange = (event, newTab) => {
        setTabIndex(newTab);
    }

    let window = "";
    if (tabIndex === 0) {
        window = <p>Player</p>
    } else if (tabIndex === 1) {
        window = <p>Comments</p>
    }
    
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{width: '100%', bgcolor: 'background.paper', mb:"20px" }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
                
            }
            </List>;
    }
    return (
        <div className="screens">
            <AppBanner />
            <div id="homescreen">
                <Box sx={{ gridColumn: '1/3' }}>
                    <AppBar position="static" sx={{ bgcolor: '#cdcdcd' }}>
                        <Toolbar sx={{ display: 'grid', gridTemplateColumns: '10% 55% 22% 8% 5%'}}>
                            <Box sx={{ gridColumn: '1/2' }}>
                                <IconButton>
                                    <HomeIcon sx={{gridArea: 'home'}}></HomeIcon>
                                </IconButton>
                                <IconButton>
                                    <PersonIcon sx={{gridArea: 'lists'}}></PersonIcon>
                                </IconButton>
                                <IconButton>
                                    <GroupsIcon sx={{gridArea: 'users'}}></GroupsIcon>
                                </IconButton>
                            </Box>
                            <Box sx={{ gridColumn: '2/3' }}>
                                <TextField fullWidth label="Search..." variant="outlined" sx={{gridArea: 'search'}}/>
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
                </Box>
                <div id="playlister-list-selector">
                    <Box sx={{bgcolor:"background.paper"}} id="list-selector-list">
                        {
                            listCard
                        }
                        <MUIDeleteModal />
                    </Box>
                </div>
                <div id="player-window">
                    <Box sx={{bgcolor:"background.paper"}} id="player-window">
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="Player" />
                            <Tab label="Comments" />
                        </Tabs>
                    </Box>
                    <Box>
                        {window}
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen;