import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    const [editActive, setEditActive] = useState(false);
    const [ expanded, setExpanded ] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    useEffect(() => {
        if (store.currentList && store.currentList._id == idNamePair._id) setExpanded(true);
        else setExpanded(false);
    }, [store.currentList])

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
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
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
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
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let arrowIcon = <KeyboardDoubleArrowDownIcon style={{fontSize:'24pt'}}/>;
    if (expanded) {
        arrowIcon = <KeyboardDoubleArrowUpIcon style={{fontSize:'24pt'}}/>
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
                        By: Nelson Tan
                    </div>
                    <div className="list-details">
                        Publish Date: 
                    </div>
                </Box>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', gridRow: '1/2', gridColumn: '2/3'}}>
                    <Box sx={{ p: 1 }}>
                        <IconButton aria-label='like'>
                            <ThumbUpIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <IconButton aria-label='dislike'>
                            <ThumbDownIcon style={{fontSize:'24pt'}} />
                        </IconButton>
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
                        <Songs />
                        <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box>
                                <Button variant="text">Undo</Button>
                                <Button variant="text">Redo</Button>
                            </Box>
                            <Box>
                                <Button variant="outlined">Duplicate</Button>
                            </Box>
                        </Box>
                    </Box>
                </Collapse>
            </ListItem>
        </Box>
    )
}

export default ListCard;