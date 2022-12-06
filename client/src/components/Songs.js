import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import AddSongCard from './AddSongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'

function Songs(props) {
    const { store } = useContext(GlobalStoreContext);
    const { published } = props;
    store.history = useHistory();

    console.log('PLAYLIST STATUS: ', published);

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
        if (!published) temp.push('Add List')
        list =
            <List sx={{overflow: 'auto', maxHeight: 300, bgcolor: '#cdcdcd' }}>
                {
                    temp.map((song, index) => (
                        (song !== 'Add List') ?
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                            published={published}
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