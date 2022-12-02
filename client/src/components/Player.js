import React, { useContext, useEffect, useState } from 'react'
// import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import YouTube from 'react-youtube';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';

function Player() {
    // const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [ playlistName, setPlaylistName ] = useState('');
    const [ index, setIndex ] = useState();
    const [ title, setTitle ] = useState('');
    const [ artist, setArtist ] = useState('');

    useEffect(() => {
        if (store.currentList && !store.currentSong) {
            setPlaylistName(store.currentList.name);
            setIndex(0);
        } else if (!store.currentList) {
            setPlaylistName('');
            setIndex(0);
            setTitle('');
            setArtist('');
        }
    }, [store.currentList])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
            <Box sx={{ width: '100%', margin: 'auto' }}>
                <YouTube id="youtube-player">
                </YouTube>
            </Box>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Playlist Name: {playlistName}</Typography>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Song #: {index}</Typography>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Title: {title}</Typography>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Artist: {artist}</Typography>
            <Box sx={{ bgcolor: '#cdcdcd', display: 'flex', flexDirection: 'row', justifyContent: 'center', borderRadius:"25px", p: 1 }}>
                    <IconButton>
                        <FastRewindIcon></FastRewindIcon>
                    </IconButton>
                    <IconButton>
                        <PauseIcon></PauseIcon>
                    </IconButton>
                    <IconButton>
                        <PlayArrowIcon></PlayArrowIcon>
                    </IconButton>
                    <IconButton>
                        <FastForwardIcon></FastForwardIcon>
                    </IconButton>
            </Box>
        </Box>
    )
}

export default Player;