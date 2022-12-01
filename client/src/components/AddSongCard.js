import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

function AddSongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    function handleAddNewSong() {
        store.addNewSong();
    }

    return (
        // <Box sx={{width: 100}} onClick={handleAddNewSong}>
        //     <IconButton>
        //         <AddIcon />
        //     </IconButton>
        // </Box>
        <IconButton
            sx={{ fontSize: '18pt', margin: '10px', padding: '20px', borderRadius: '25px', bgcolor: '#6e9ff4', textAlign: 'center'}}
            onClick={handleAddNewSong}
            >
            <AddIcon />
        </IconButton>
    );
}

export default AddSongCard;