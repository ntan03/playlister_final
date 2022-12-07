import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

function Comments() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [ comment, setComment ] = useState('');

    function handleChange(event) {
        // console.log(event.target.value);
        setComment(event.target.value);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.commentOnList(store.playingList, comment);
            setComment('');
        }
    }

    let listComments = '';
    if (store.playingList && store.playingList.published) {
        listComments = 
            <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'auto', bgcolor: '#e3e3e3', height: '84%' }}>
                {
                    store.playingList.comments.map((comment, index) => (
                        <ListItem 
                            key={'comment-card-' + index}
                            sx={{ display: 'flex', flexDirection: 'column', width: '90%', borderRadius:"10px", p: "10px", bgcolor: 'background.paper', alignItems: 'start', margin: 1 }}>
                            <Box>
                                <Typography variant='subtitle1' >
                                    {comment.username}
                                </Typography>
                            </Box>

                            <Box sx={{width: '95%'}}>
                                <Typography variant='h5' sx={{wordWrap: 'break-word'}}>
                                    {comment.comment}
                                </Typography>
                            </Box>
                        </ListItem>

                    ))
                }    
            </List>       
    }

    let textBox = '';
    if (store.playingList && store.playingList.published) {
        textBox = (auth.user) ?
            <TextField
                id="outlined-textarea"
                placeholder="Comment here"
                maxRows={1}
                rows={1}
                multiline
                fullWidth
                value={comment}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
            />
            :
            <TextField
                id="outlined-textarea"
                placeholder="Comment disabled"
                maxRows={1}
                rows={1}
                multiline
                fullWidth
                disabled
                value={comment}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
            />
    }
    
    return (
        <Box sx={{ height: '100%' }}>
            {listComments}
            {textBox}
        </Box>
    )
}

export default Comments;