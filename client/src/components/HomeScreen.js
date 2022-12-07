import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIListErrorModal from './MUIListErrorModal'

import List from '@mui/material/List';
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';

import AppBanner from './AppBanner';
import CommunityBar from './CommunityBar';
import Statusbar from './Statusbar';
import Player from './Player';
import Comments from './Comments'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [ tabIndex, setTabIndex ] = useState(0);

    useEffect(() => {
        if (auth.user) {
            store.loadIdNamePairs(store.page)
        } else if (store.page === 0) {
            // Continued as guest, so no home screen
            store.loadIdNamePairs(1);
        } else store.loadIdNamePairs(store.page)
    }, []);

    // function handleCreateNewList() {
    //     store.createNewList();
    // }

    const handleTabChange = (event, newTab) => {
        setTabIndex(newTab);
    }

    let window = "";
    if (tabIndex === 0) {
        window =
            <div>
                <Player/>
            </div>
    } else if (tabIndex === 1) {
        window = 
            <div className='hidden-window'>
                <Player/>
            </div>
    }

    let comments = "";
    if (tabIndex === 0) {
        comments = 
            <Box className='hidden-window'>
                <Comments/>
            </Box>
    } else {
        comments = <Comments/>
    }
    
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ bgcolor: 'background.paper', mb:"20px" }}>
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
            <MUIListErrorModal />
            <Box sx={{ gridRow: '1/2', gridColumn: '1/3' }}>
                <AppBanner />
            </Box>
            <CommunityBar />

            <Box sx={{ bgcolor:"background.paper", gridRow: '3/4', gridColumn: '1/2', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                {listCard}
                <MUIDeleteModal />
            </Box>

            <Box sx={{ gridRow: '3/4', gridColumn: '2/3' }}>
                <Box sx={{bgcolor:"background.paper"}} id="player-window">
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Player" />
                        <Tab label="Comments" />
                    </Tabs>
                </Box>
                
                {window}
                {comments}
            </Box>

            <Box sx={{ gridRow: '4/5', gridColumn: '1/3' }}>
                <Statusbar />
            </Box>
        </Box>
    )
}

export default HomeScreen;