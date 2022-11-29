import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

function AddSongCard() {
    const { store } = useContext(GlobalStoreContext);

    function handleAddNewSong() {
        store.addNewSong();
    }

    return (
        <Box sx={{width: 100}} onClick={handleAddNewSong}>
            <IconButton>
                <AddIcon />
            </IconButton>
        </Box>
    );
}

export default AddSongCard;