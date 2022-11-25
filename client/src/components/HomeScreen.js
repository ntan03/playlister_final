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
        <div>
            <AppBanner />
            <div id="homescreen">
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