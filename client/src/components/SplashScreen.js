import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const style = {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    marginTop: '20px',
    width: 200,
    height: 250,
    borderRadius: '5px',
    bgcolor: 'background.paper'
};

const buttons = {
    width: 100,
    height: 50,
    marginTop: '20px'
}

const guest = {
    width: 200,
    margin: 'auto',
    marginTop: '-10px'
}

const links = {
    margin: '-50px',
    marginBottom: '-80px'
}

export default function SplashScreen() {
    const login = () => {
        
    }

    return (
        <div id="splash-screen">
            <div id="playlister">
                Playlister 
            </div>
            <div id="welcome-text">
                Welcome to your Playlister!
            </div>
            <div id="description">
                Our playlister is a community where users can create, modify, and publish their playlists so other users can experience different music.
            </div>

            <Box sx={style}> 
                <Link to='/login/' style={links}>
                    <Button variant="outlined" sx={buttons}>
                        Login
                    </Button>
                </Link>
                <Link to='/register/'>
                    <Button variant="outlined" sx={buttons}>
                        Create Account
                    </Button>
                </Link>
                <Button sx={guest}>
                    Continue as Guest
                </Button>
            </Box>

            <div id="developer">
                Nelson Tan
            </div>
        </div>
    )
}