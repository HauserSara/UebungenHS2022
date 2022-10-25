import React from 'react';
import Timer from './Timer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function App() {
    return (
    <>
        <AppBar position="sticky" color="primary">
            <Toolbar>
                <Typography variant="h6">Counter</Typography>
            </Toolbar>
        </AppBar>
        <Timer />
    </>);
}

export default App;
