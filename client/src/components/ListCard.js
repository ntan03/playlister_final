import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
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
    let cardElement =
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', flexGrow: 1, height: '15%'}}>
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{borderRadius:"25px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', p: 1 }}
                style={{transform:"translate(1%,0%)", width: '98%'}}
                button
                // onClick={(event) => {
                //     handleLoadList(event, idNamePair._id)
                // }}
            >
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div className="list-name">
                        {idNamePair.name}
                    </div>
                    <div className="list-details">
                        By: Nelson Tan
                    </div>
                    <div className="list-details">
                    </div>
                </Box>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', flexGrow: 1, margin: '-10px'}}>
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', flexGrow: 1, marginBottom: '-10px' }}>
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
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', flexGrow: 1 }}>
                        <div className="list-details">
                            Listens: 
                        </div>
                        <Box sx={{ p: 1, alignSelf: 'flex-end', marginLeft: '10px', marginBottom: '10px', marginTop: '-20px' }}>
                            <IconButton aria-label='expand'>
                                <KeyboardDoubleArrowDownIcon style={{fontSize:'24pt'}} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </ListItem>
        </Box>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;