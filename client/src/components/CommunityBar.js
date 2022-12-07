import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import SortIcon from '@mui/icons-material/Sort';

function CommunityBar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [ text, setText ] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleListMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-list-menu';
    const homeMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: -50,
                horizontal: 10,
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('create') }}>
                {'Creation Date (Old-New)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('edit') }}>
                {'Last Edit Date (New-Old)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('name') }}>
                {'Name (A-Z)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('publish') }}>
                {'Publish Date (Newest)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('listens') }}>
                {'Listens (High - Low)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('likes') }}>
                {'Likes (High - Low)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('dislikes') }}>
                {'Dislikes (High - Low)'}
            </MenuItem>
        </Menu>
    )

    const otherMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: -50,
                horizontal: 10,
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('name') }}>
                {'Name (A-Z)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('publish') }}>
                {'Publish Date (Newest)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('listens') }}>
                {'Listens (High - Low)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('likes') }}>
                {'Likes (High - Low)'}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); store.setSort('dislikes') }}>
                {'Dislikes (High - Low)'}
            </MenuItem>
        </Menu>
    )

    let menu = "";
    if (store.page === 0) menu = homeMenu;
    else menu = otherMenu;

    useEffect(() => {
        setText('');
    }, [store.page])

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            console.log(`Searching for '${text}' on page ${store.page}`)
            if (text.length > 0) {
                switch (store.page) {
                    case 0:
                        store.searchLoggedInUser(text);
                        break;
                    case 1:
                        store.searchAllPublishedLists(text);
                        break;
                    case 2:
                        console.log('Search user lists')
                        store.searchUserLists(text);
                        break;
                    default:
                        break;
                }
            } else {
                store.noSearch();
            }
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
        // console.log(text);
    }

    function handleHomePress() {
        store.loadIdNamePairs(0)
        setText('')
    }

    function handleAllPress() {
        store.loadIdNamePairs(1)
        setText('')
    }

    function handleUserPress() {
        store.loadIdNamePairs(2)
        setText('')
    }

    return (
        <Box sx={{ gridRow: '2/3', gridColumn: '1/3' }}>
            <AppBar position="static" sx={{ bgcolor: '#cdcdcd' }}>
                <Toolbar sx={{ display: 'grid', gridTemplateColumns: '10% 55% 25% 5% 5%'}}>
                    <Box sx={{ gridColumn: '1/2' }}>
                        <IconButton onClick={handleHomePress} disabled={auth.guest}>
                            <HomeIcon></HomeIcon>
                        </IconButton>
                        <IconButton onClick={handleAllPress}>
                            <PersonIcon></PersonIcon>
                        </IconButton>
                        <IconButton onClick={handleUserPress}>
                            <GroupsIcon></GroupsIcon>
                        </IconButton>
                    </Box>
                    <Box sx={{ gridColumn: '2/3' }}>
                        <TextField 
                            fullWidth 
                            label="Search..." 
                            value={text}
                            onChange={handleUpdateText}
                            onKeyPress={handleKeyPress}
                            variant="outlined"/>
                    </Box>
                    <Box sx={{ gridColumn: '4/5' }}>
                        <h2 className="sort-tag">Sort by</h2>
                    </Box>
                    <Box sx={{ gridColumn: '5/6' }}>
                        <IconButton onClick={handleListMenuOpen}>
                            <SortIcon sx={{gridColumn: '5/6' }}></SortIcon>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {menu}
        </Box>
    )
}

export default CommunityBar;