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

    let status = ''
    if (store.page === 0) {
        if (auth.loggedIn && store.currentList){
            status = 
                <div id="list-selector-heading">
                    <Fab sx={{transform:"translate(-20%, 0%)"}}
                        aria-label="add"
                        id="add-list-button"
                        disabled={true}
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                    Your Playlists
                </div>
        } else if (auth.loggedIn && !store.currentList) {
            status = 
                <div id="list-selector-heading">
                    <Fab sx={{transform:"translate(-20%, 0%)"}}
                        aria-label="add"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                    Your Playlists
                </div>
        }
    } else if (store.page === 1) {
        status = 
            <div id="list-selector-heading">
                All Published Playlists
            </div>
    } else if (store.page === 2) {
        status = 
            <div id="list-selector-heading">
                User Playlists
            </div>
    }

    return (
        <div id="playlister-statusbar">
            {status}
        </div>
    );
}

export default Statusbar;