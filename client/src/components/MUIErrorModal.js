import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AuthContext from '../auth'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    border: '2px solid #000',
    boxShadow: 24
};


export default function MUIErrorModal() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)

    function handleCloseButton() {
        store.hideModals();
        console.log("CLOSE BUTTON CLICKED");
    }

    return (
        <Modal open={auth.errorMessage !== null}>
            <Box sx={style}>
                <Alert severity="error">
                    <AlertTitle>Account Error</AlertTitle>
                    {auth.errorMessage}
                    <div id="close-button">
                        <Button variant="text" onClick={handleCloseButton}>Close</Button>
                    </div>
                </Alert>
            </Box> 
        </Modal>
    );
}