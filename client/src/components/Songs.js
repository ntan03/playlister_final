import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import AddSongCard from './AddSongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'

function Songs() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    
    let list = '';
    if (store.currentList) {
        console.log(store.currentList.songs)
        let temp = [...store.currentList.songs]
        temp.push('Add List')
        list =
            <List sx={{overflow: 'scroll', bgcolor: '#d6d6d6' }}>
                {
                    temp.map((song, index) => (
                        (index < temp.length - 1) ?
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        /> 
                        :
                        <AddSongCard 
                            key={'playlist-song-' + (index)}
                            index={index}
                        />
                    ))
                }
                { modalJSX }
            </List>            
    }

    return (list)
}

export default Songs;