import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const style = {
    display: 'grid',
    gridTemplateRows: '25% 25% 50%',
    margin: 'auto',
    marginTop: '20px',
    width: 200,
    height: 250,
    borderRadius: '5px',
    bgcolor: 'background.paper',
    alignItems: 'start'
};

export default function SplashScreen() {
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
                <Link to='/login/' style={{ gridRow: '1/2'}}>
                    <Button variant="outlined" sx={{ width: 100, height: 50 }}>
                        Login
                    </Button>
                </Link>
                <Link to='/register/' style={{ gridRow: '2/3' }}>
                    <Button variant="outlined" sx={{ width: 100, height: 50 }}>
                        Create Account
                    </Button>
                </Link>
                <Box sx={{ gridRow: '3/4' }}>
                    <Button sx={{ width: 200 }}>
                        Continue as Guest
                    </Button>
                </Box>
            </Box>

            <div id="developer">
                Nelson Tan
            </div>
        </div>
    )
}