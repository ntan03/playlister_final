import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import Songs from './Songs';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [ text, setText ] = useState("");
    const [ expanded, setExpanded ] = useState(false);
    const [ like, setLike ] = useState(false);
    const [ dislike, setDislike ] = useState(false);
    const { idNamePair, selected } = props;

    // console.log(idNamePair);

    useEffect(() => {
        if (store.currentList && store.currentList._id === idNamePair._id) setExpanded(true);
        else setExpanded(false);

        if (idNamePair.likes.includes(auth.user.userName)) setLike(true);
        else setLike(false);

        if (idNamePair.dislikes.includes(auth.user.userName)) setDislike(true);
        else setDislike(false);
    }, [store.currentList])

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        event.preventDefault();
        event.stopPropagation();
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            if (expanded) store.closeCurrentList();
            else store.setCurrentList(id);
        }
    }

    function handleClick(event) {
        if (event.detail == 2) {
            handleToggleEdit(event);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        if (!idNamePair.published) {
            let newActive = !editActive;
            if (newActive) {
                store.setIsListNameEditActive(idNamePair._id);
            }
            setEditActive(newActive);
        }
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            console.log('text: ', text);
            if (text.length !== 0) store.changeListName(id, text);
            toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleUndo(event) {
        event.preventDefault();
        event.stopPropagation();
        store.undo();
    }

    function handleRedo(event) {
        event.preventDefault();
        event.stopPropagation();
        store.redo();
    }

    function handlePublish(event) {
        event.preventDefault();
        event.stopPropagation();
        store.publishList(idNamePair._id);
    }

    function handleDuplicate(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(`Duplicate list ${idNamePair._id}`);
        store.duplicateList(idNamePair._id);
    }
    
    function handleLike(event) {
        event.preventDefault();
        event.stopPropagation();
        if (dislike) setDislike(!dislike);
        setLike(!like);
        store.updateLikes(idNamePair._id, 1);
    }

    function handleDislike(event) {
        event.preventDefault();
        event.stopPropagation();
        if (like) setLike(!like);
        setDislike(!dislike);
        store.updateLikes(idNamePair._id, -1);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let likeButton = <ThumbUpIcon style={{fontSize:'24pt'}} />;
    if (like) likeButton = <ThumbUpIcon style={{fontSize:'24pt', color: '#35bcfc'}} />

    let dislikeButton = <ThumbDownIcon style={{fontSize:'24pt'}} />
    if (dislike) dislikeButton = <ThumbDownIcon style={{fontSize:'24pt', color: '#35bcfc'}} />

    let arrowIcon = <KeyboardDoubleArrowDownIcon style={{fontSize:'24pt'}}/>;
    if (expanded) {
        arrowIcon = <KeyboardDoubleArrowUpIcon style={{fontSize:'24pt'}}/>
    }

    let undoButton = '' 
    if (!idNamePair.published) {
        undoButton = <Button variant="text" onClick={(event) => {handleUndo(event);}}>Undo</Button>;
    }

    let redoButton = ''
    if (!idNamePair.published) {
        redoButton = <Button variant="text" onClick={(event) => {handleRedo(event);}}>Redo</Button>;
    }

    let deleteList = '';
    if (store.page === 0) {
        deleteList = <Button variant="text" onClick={(event) => { handleDeleteList(event, idNamePair._id); }}>
            Delete
        </Button>;
    }

    let publish = '';
    if (!idNamePair.published) {
        publish = <Button variant="text" onClick={(event) => { handlePublish(event); }}>
            Publish
        </Button>;
    }

    let publishDate = '';
    if (idNamePair.published) {
        publishDate = 
            <div className="list-details">
                Publish Date: {(new Date(idNamePair.publishDate)).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})}
            </div>
    }

    let playlistName = idNamePair.name;
    if (editActive) {
        playlistName = 
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 24}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    
    return (
        <Box sx={{ p: 1, flexGrow: 1}}>
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{borderRadius:"25px", p: "5px", bgcolor: '#cdcdcd', display: 'grid', gridTemplateRows: '33% 33% 33%', gridTemplateColumns: '55% 45%' }}
                style={{transform:"translate(1%,0%)", width: '98%', height: '100%'}}
                onClick={handleClick}
            >
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, gridRow: '1/3', gridColumn: '1/2', alignSelf: 'start' }}>
                    <div className="list-name">
                        {playlistName}
                    </div>
                    <div className="list-details">
                        By: { idNamePair.listOwner }
                    </div>
                    {publishDate}
                </Box>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', gridRow: '1/2', gridColumn: '2/3'}}>
                    <Box sx={{ p: 1 }}>
                        <IconButton aria-label='like' onClick={(event) => {handleLike(event)}}>
                            { likeButton }
                        </IconButton>
                        {idNamePair.likes.length}
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <IconButton aria-label='dislike' onClick={(event) => {handleDislike(event)}}>
                            { dislikeButton }
                        </IconButton>
                        {idNamePair.dislikes.length}
                    </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', gridRow: '2/3', gridColumn: '2/3' }}>
                    <div className="list-details">
                        Listens: 
                    </div>
                    <Box sx={{}}>
                        <IconButton aria-label='expand' onClick={(event) => {
                                    handleLoadList(event, idNamePair._id);
                                }}>
                            {arrowIcon}
                        </IconButton>
                    </Box>
                </Box>
                <Collapse sx={{gridColumn: '1/3'}} in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{  gridColumn: '1/3', width: '100%', textAlign: 'center' }}>
                        <Songs published={idNamePair.published}/>
                        <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box>
                                {undoButton}
                                {redoButton}
                            </Box>
                            <Box>
                                {deleteList}
                                {publish}
                                <Button variant="text" onClick={(event) => {handleDuplicate(event)} }>Duplicate</Button>
                            </Box>
                        </Box>
                    </Box>
                </Collapse>
            </ListItem>
        </Box>
    )
}

export default ListCard;