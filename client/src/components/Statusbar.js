import { useContext } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'


/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/



function Statusbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    function clickHandler() {
        store.tryAcessingOtherAccountPlaylist();
    }

    function handleCreateNewList() {
        store.createNewList();
    }

    if (auth.loggedIn && store.currentList){
        return (
            <div id="playlister-statusbar">
                <div id="list-selector-heading">
                    <Fab sx={{transform:"translate(-20%, 0%)"}}
                        color="primary" 
                        aria-label="add"
                        id="add-list-button"
                        disabled={true}
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                    Your Playlists
                </div>
            </div>
        );
    } else if (auth.loggedIn && !store.currentList) {
        return (
            <div id="playlister-statusbar">
                <div id="list-selector-heading">
                    <Fab sx={{transform:"translate(-20%, 0%)"}}
                        color="primary" 
                        aria-label="add"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                    Your Playlists
                </div>
            </div>
        );
    }
    return null;
}

export default Statusbar;