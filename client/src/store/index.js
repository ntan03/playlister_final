import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    PUBLISH_LIST: "PUBLISH_LIST",
    LIKE_DISLIKE_LIST: "LIKE_DISLIKE_LIST",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_PLAYING_LIST: "SET_PLAYING_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CHANGE_PAGE: "CHANGE_PAGE",
    SHOW_ERROR: "SHOW_ERROR"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    ERROR : "ERROR"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        playingList: null,
        currentSongIndex : -1,
        currentSong : null,
        playingSong: null,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        message: '',
        page: 0
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    playingList: payload.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }  
            case GlobalStoreActionType.LIKE_DISLIKE_LIST:
            case GlobalStoreActionType.PUBLISH_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    playingList: payload.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    message: '',
                    page: store.page
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            case GlobalStoreActionType.SET_PLAYING_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: store.page
                });
            }
            case GlobalStoreActionType.CHANGE_PAGE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    playingSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: '',
                    page: payload
                });
            }
            case GlobalStoreActionType.SHOW_ERROR: {
                return setStore({
                    currentModal : CurrentModal.ERROR,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    playingSong: store.playingSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    message: payload,
                    page: store.page
                });
            }
            default:
                return store;
        }
    }

    store.tryAcessingOtherAccountPlaylist = function(){
        let id = "635f203d2e072037af2e6284";
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        history.push("/playlist/635f203d2e072037af2e6284");
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.uniqueNameGenerate = function (name, pairsArray) {
        let names = pairsArray.map((pair) => pair.name);
        names.push(name);

        let hash = new Map();
        for (let i = 0; i < names.length; i++) {
            if (!hash.has(names[i])) hash.set(names[i], 1)
            else {
                let count = hash.get(names[i]);
                hash.set(names[i], hash.get(names[i]) + 1);
                let newName = names[i] + count.toString();
                while (hash.has(newName)) {
                    count = hash.get(names[i]);
                    hash.set(names[i], hash.get(names[i]) + 1);
                    newName = names[i] + count.toString();
                }
                names[i] += count.toString();
                if (!hash.has(names[i])) hash.set(names[i], 1)
            }
        }

        return names[names.length - 1];
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                console.log('Changed playlist name to ', newName);
                async function updateList(playlist) {
                    try {
                        response = await api.updatePlaylistById(playlist._id, playlist);
                        if (response.data.success) {
                            let updatedPlaylist = response.data.playlist;
                            console.log('Updated Playlist: ', updatedPlaylist);
                            async function getListPairs(playlist) {
                                response = await api.getPlaylistPairs();
                                if (response.data.success) {
                                    let pairsArray = response.data.idNamePairs;
                                    storeReducer({
                                        type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                        payload: {
                                            idNamePairs: pairsArray,
                                            playingList: (playlist._id === store.playingList._id) ? playlist : store.playingList
                                        }
                                    });
                                    // store.setCurrentList(id);
                                }
                            }
                            getListPairs(updatedPlaylist);
                        }
                    } catch (err) {
                        console.log(err)
                        storeReducer({
                            type: GlobalStoreActionType.SHOW_ERROR,
                            payload: err.response.data.description
                        })
                    }
                }
                updateList(playlist);
            }
        }

        asyncChangeListName(id);
    }

    store.publishList = function (id) {
        // GET THE LIST
        async function asyncPublishList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.published = true;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let originalPairs = store.idNamePairs;
                                let ids = originalPairs.map((pair) => pair._id);

                                let pairsArray = response.data.idNamePairs;
                                pairsArray = pairsArray.filter((pair) => ids.includes(pair._id));
                                storeReducer({
                                    type: GlobalStoreActionType.PUBLISH_LIST,
                                    payload: {
                                        idNamePairs: pairsArray
                                    }
                                });
                                // store.setCurrentList(id);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublishList(id);
    }

    store.duplicateList = function (id) {
        async function asyncDuplicateList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                async function getListPairs(playlist) {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        let uniqueName = store.uniqueNameGenerate(playlist.name, pairsArray);
                        console.log('Unique name generated: ', uniqueName);
                        async function createDuplicateList(playlist, uniqueName) {
                            response = await api.createPlaylist(uniqueName, playlist.songs, auth.user.email);
                            console.log("duplicateList response: " + response);
                            if (response.status === 201) {
                                tps.clearAllTransactions();
                                let newList = response.data.playlist;
                                async function getListPairs(playlist) {
                                    response = await api.getPlaylistPairs();
                                    if (response.data.success) {
                                        let originalPairs = store.idNamePairs;
                                        let ids = originalPairs.map((pair) => pair._id);
        
                                        let pairsArray = response.data.idNamePairs;
                                        pairsArray = pairsArray.filter((pair) => ids.includes(pair._id) || pair._id == playlist._id);
        
                                        storeReducer({
                                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                                            payload: {
                                                idNamePairs: (store.page === 0) ? pairsArray : store.idNamePairs,
                                                currentList: store.currentList
                                            }
                                        });
                                    }
                                }
                                getListPairs(newList);
                            } else {
                                console.log("API FAILED TO CREATE A NEW LIST");
                            }
                        }
                        createDuplicateList(playlist, uniqueName);
                    }
                }
                getListPairs(playlist);
            }
        }
        asyncDuplicateList(id);
    }

    store.updateLikes = function (id, val) {
        async function asyncUpdateLikes(id, val) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                // Check if user is already in likes or dislikes
                console.log(`Checking if username is already in likes/dislikes: ${auth.user.userName}`)
                let inLikes = playlist.likes.includes(auth.user.userName);
                let inDislikes = playlist.dislikes.includes(auth.user.userName);

                // Indicates that user pressed the like button
                if (val > 0) {
                    // Check if user already liked/disliked the list
                    if (inLikes) {
                        // Remove like
                        playlist.likes = playlist.likes.filter((username) => username !== auth.user.userName);
                    } else if (inDislikes) {
                        // Remove dislike and add to like
                        playlist.dislikes = playlist.dislikes.filter((username) => username !== auth.user.userName);
                        playlist.likes.push(auth.user.userName);
                    } else {
                        // Just push into likes
                        playlist.likes.push(auth.user.userName);
                    }
                } else {
                    if (inDislikes) {
                        // Remove dislike
                        playlist.dislikes = playlist.dislikes.filter((username) => username !== auth.user.userName);
                    } else if (inLikes) {
                        // Remove like and add to dislike
                        playlist.likes = playlist.likes.filter((username) => username !== auth.user.userName);
                        playlist.dislikes.push(auth.user.userName);
                    } else {
                        // Just push into dislikes
                        playlist.dislikes.push(auth.user.userName);
                    }
                }
                
                async function updateList(playlist) {
                    console.log(`Updating playlist (likes): ${playlist}`)
                    console.log(playlist)
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let originalPairs = store.idNamePairs;
                                let ids = originalPairs.map((pair) => pair._id);

                                let pairsArray = response.data.idNamePairs;
                                console.log('Updated likes/dislike:');
                                pairsArray = pairsArray.filter((pair) => ids.includes(pair._id))
                                console.log('Pairs received: ', pairsArray)
                                storeReducer({
                                    type: GlobalStoreActionType.LIKE_DISLIKE_LIST,
                                    payload: {
                                        idNamePairs: pairsArray
                                    }
                                });
                                // store.setCurrentList(id);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }

        }
        asyncUpdateLikes(id, val);
    }

    store.searchLoggedInUser = function (name) {
        async function asyncSearchLoggedInUser (name) {
            let response = await api.searchCurrentUser(name, auth.user.userName);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log('Searched for lists belonging to logged in user:');
                console.log(pairsArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playingList: store.playingList
                    }
                });
            }
        }

        asyncSearchLoggedInUser(name);
    }

    store.searchAllPublishedLists = function (name) {
        async function asyncSearchAllPublishedLists (name) {
            let response = await api.searchPublishedLists(name);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log('Searched through all published lists:');
                console.log(pairsArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playingList: store.playingList
                    }
                });
            }
        }

        asyncSearchAllPublishedLists(name);
    }

    store.searchUserLists = function (user) {
        async function asyncSearchUserLists (user) {
            let response = await api.searchUserPublished(user);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log('Searched through all user-published lists:');
                console.log(pairsArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playingList: store.playingList
                    }
                });
            }
        }

        asyncSearchUserLists(user);
    }
    

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        async function asyncCreateNewList() {
            let response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                let uniqueName = store.uniqueNameGenerate("Untitled", pairsArray);

                console.log('Unique name generated: ', uniqueName);
                response = await api.createPlaylist(uniqueName, [], auth.user.email);
                console.log("createNewList response: " + response);
                if (response.status === 201) {
                    tps.clearAllTransactions();
                    let newList = response.data.playlist;
                    async function getListPairs(playlist) {
                        response = await api.getPlaylistPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            storeReducer({
                                type: GlobalStoreActionType.CREATE_NEW_LIST,
                                payload: {
                                    idNamePairs: pairsArray,
                                    currentList: newList
                                }
                            });
                            // store.setCurrentList(id);
                        }
                    }
                    getListPairs(newList);
                } else {
                    console.log("API FAILED TO CREATE A NEW LIST");
                }
            }
        } 
        asyncCreateNewList();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function (page) {
        console.log('Loading pairs for page ', page);
        async function asyncLoadIdNamePairs() {
            // Gets all playlists belonging to current user
            let response;
            if (page === 0) {
                response = await api.getPlaylistPairs();
            } else if (page === 1 || page === 2) {
                response = await api.getPublishedPlaylists();
            }
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playingList: store.playingList
                    }
                });
            } else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        console.log('Delete list')
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);

            // store.loadIdNamePairs(store.page);
            async function getListPairs(id) {
                response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: {
                            idNamePairs: pairsArray,
                            playingList: (id === store.playingList._id) ? null : store.playingList
                        }
                    });
                }
            }
            getListPairs(id);
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
        
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        auth.errorMessage = null;
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ERROR;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log('Setting playlist: ', playlist);

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
    }

    store.setPlayingList = function (id) {
        console.log('Setting playing list to ', id);
        async function asyncSetPlayingList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log('Setting playing list: ', playlist);

                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYING_LIST,
                    payload: playlist
                })
            }
        }

        asyncSetPlayingList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log('Setting playlist: ', playlist);

                storeReducer({
                    type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
    }

    store.setPage = function (page) {
        console.log(`Switching page to ${page}`)
        storeReducer({
            type: GlobalStoreActionType.CHANGE_PAGE,
            payload: page
        })
    }

    store.noSearch = function () {
        console.log('User did not provide a search query, emptying id name pairs...');
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: {
                idNamePairs: [],
                playingList: store.playingList
            }
        })
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey){
            if(event.key === 'z'){
                store.undo();
            } 
            if(event.key === 'y'){
                store.redo();
            }
        }
    }
  
    document.onkeydown = (event) => KeyPress(event);

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };