import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

function AddSongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { playingList } = props;

    function handleAddNewSong(event) {
        event.stopPropagation();
        store.addNewSong();
    }

    let bgcolor = '#6e9ff4';
    if (playingList) bgcolor = '#cdcdcd'

    return (
        // <Box sx={{width: 100}} onClick={handleAddNewSong}>
        //     <IconButton>
        //         <AddIcon />
        //     </IconButton>
        // </Box>
        <IconButton
            sx={{ fontSize: '18pt', margin: '10px', padding: '20px', borderRadius: '25px', bgcolor: bgcolor, textAlign: 'center'}}
            onClick={handleAddNewSong}
            >
            <AddIcon />
        </IconButton>
    );
}

export default AddSongCard;