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
    const [ youTubePlayer, setYouTubePlayer ] = useState(null);
    const [ index, setIndex ] = useState(0);
    const [ title, setTitle ] = useState('');
    const [ artist, setArtist ] = useState('');

    useEffect(() => {
        if (store.playingList) {
            setPlaylistName(store.playingList.name);
        } else {
            setPlaylistName('');
        }
    }, [store.playingList])

    let playlist = [];
    if (store.playingList) {
        playlist = store.playingList.songs.map((song) => song.youTubeId);
    }

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        if (playlist[index]) {
            let song = playlist[index];
            setYouTubePlayer(player);
            player.loadVideoById(song);
            player.playVideo();
        }
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        console.log('Next song...')
        if (index === playlist.length - 1) setIndex(0);
        else setIndex(index + 1);
    }

    function decSong() {
        console.log('Previous song...')
        if (index === 0) {
            setIndex(playlist.length - 1)
        } else setIndex(index - 1)
    }

    function pauseVid() {
        if (youTubePlayer) {
            console.log('Pausing player...')
            youTubePlayer.pauseVideo();
        }
    }

    function playVid() {
        if (youTubePlayer) {
            console.log('Starting player...')
            youTubePlayer.playVideo();
        }
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        if (playlist[index]) event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    console.log('Current playlist: ', playlist)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
            <Box sx={{ width: '100%', margin: 'auto' }}>
                <YouTube 
                    id="youtube-player"
                    videoId={playlist[index]}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}/>
            </Box>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Playlist Name: {playlistName}</Typography>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Song #: {index}</Typography>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Title: {title}</Typography>
            <Typography variant='h5' sx={{ margin: 'auto' }}>Artist: {artist}</Typography>
            <Box sx={{ bgcolor: '#cdcdcd', display: 'flex', flexDirection: 'row', justifyContent: 'center', borderRadius:"25px", p: 1 }}>
                    <IconButton onClick={decSong}>
                        <FastRewindIcon></FastRewindIcon>
                    </IconButton>
                    <IconButton onClick={pauseVid}>
                        <PauseIcon></PauseIcon>
                    </IconButton>
                    <IconButton onClick={playVid}>
                        <PlayArrowIcon></PlayArrowIcon>
                    </IconButton>
                    <IconButton onClick={incSong}>
                        <FastForwardIcon></FastForwardIcon>
                    </IconButton>
            </Box>
        </Box>
    )
}

export default Player;