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
import Statusbar from './Statusbar';
import Player from './Player';

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
        window = <Player/>
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
        <Box sx={{ display: 'grid', gridTemplateRows: '9% 7.5% 73.5% 10%', gridTemplateColumns: '55% 45%', height: '110%' }}>
            <Box sx={{ gridRow: '1/2', gridColumn: '1/3' }}>
                <AppBanner />
            </Box>
            <Box sx={{ gridRow: '2/3', gridColumn: '1/3' }}>
                <AppBar position="static" sx={{ bgcolor: '#cdcdcd' }}>
                    <Toolbar sx={{ display: 'grid', gridTemplateColumns: '10% 55% 22% 8% 5%'}}>
                        <Box sx={{ gridColumn: '1/2' }}>
                            <IconButton>
                                <HomeIcon></HomeIcon>
                            </IconButton>
                            <IconButton>
                                <PersonIcon></PersonIcon>
                            </IconButton>
                            <IconButton>
                                <GroupsIcon></GroupsIcon>
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

            <Box sx={{ bgcolor:"background.paper", gridRow: '3/4', gridColumn: '1/2' }} id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </Box>

            <Box sx={{ gridRow: '3/4', gridColumn: '2/3' }}>
                <Box sx={{bgcolor:"background.paper"}} id="player-window">
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Player" />
                        <Tab label="Comments" />
                    </Tabs>
                </Box>
                <Box>
                    {window}
                </Box>
            </Box>

            <Box sx={{ gridRow: '4/5', gridColumn: '1/3' }}>
                <Statusbar />
            </Box>
        </Box>
    )
}

export default HomeScreen;