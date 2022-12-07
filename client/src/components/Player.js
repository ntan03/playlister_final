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
    const [ youTubePlayer, setYouTubePlayer ] = useState(null);
    const [ playlist, setPlaylist ] = useState(null);
    const [ index, setIndex ] = useState(0);

    useEffect(() => {
        // Handles loading new list for playing
        if (store.playingList) {
            if (playlist) console.log('Current playlist: ', playlist);
            console.log('New playlist: ', store.playingList);
            setPlaylist(store.playingList);
            setIndex(0);
        } else {
            setPlaylist(null);
            setIndex(0);
        }
    }, [store.playingList])

    let songs = [];
    if (playlist) {
        songs = playlist.songs.map((song) => song);
    }

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        if (songs[index]) {
            let song = songs[index].youTubeId;
            setYouTubePlayer(player);
            player.loadVideoById(song);
            player.playVideo();
        }
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        console.log('Next song...')
        if (index === songs.length - 1) setIndex(0);
        else setIndex(index + 1);
    }

    function decSong() {
        console.log('Previous song...')
        if (index === 0) {
            setIndex(songs.length - 1)
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
        if (songs[index]) event.target.playVideo();
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
    let playlistName = '';
    if (playlist) {
        playlistName = <Typography variant='h5' sx={{ margin: 'auto' }}>Playlist Name: {playlist.name}</Typography>
    }

    let song_num = '';
    if (playlist && songs[index]) {
        song_num = <Typography variant='h5' sx={{ margin: 'auto' }}>Song #: {index + 1}</Typography>
    }

    let songTitle = '';
    if (playlist && songs[index]) {
        songTitle = <Typography variant='h5' sx={{ margin: 'auto' }}>Title: {songs[index].title}</Typography>
    }

    let songArtist = '';
    if (playlist && songs[index]) {
        songArtist = <Typography variant='h5' sx={{ margin: 'auto' }}>Artist: {songs[index].artist}</Typography>
    }

    let toolbar = '';
    if (playlist && songs[index]) {
        toolbar = 
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
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
            <Box sx={{ width: '100%', margin: 'auto' }}>
                <YouTube 
                    id="youtube-player"
                    videoId={(songs[index]) ? songs[index].youTubeId : ''}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}/>
            </Box>
            {playlistName}
            {song_num}
            {songTitle}
            {songArtist}
            {toolbar}
        </Box>
    )
}

export default Player;