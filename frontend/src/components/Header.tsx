import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import type { Pantry } from '../types';
import { fetchPantries } from '../requests';
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [pantries, setPantries] = useState<Pantry[]>([])
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenPantrySelector = () => {
        console.log("OPEN PANTRY");
        setOpenDialog(true);
    };

    useEffect(() => {
        const fn = async () => {
            const pantriesReq = await fetchPantries()
            setPantries(pantriesReq)
        }
        fn()
    }, [])

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Smart Pantry
                        </Typography>

                        {pantries.length !== 0 && (
                            <>
                                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenu}
                                        sx={{ display: { xs: 'block', md: 'none' } }}
                                    >
                                        <MenuItem key="pantries" onClick={handleOpenPantrySelector}>
                                            <Typography sx={{ textAlign: 'center' }}>Change Pantry</Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>

                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="a"
                                    href="#app-bar-with-responsive-menu"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'flex', md: 'none' },
                                        flexGrow: 1,
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Smart Pantry
                                </Typography>
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                    <Button
                                        key="pantries"
                                        onClick={handleOpenPantrySelector}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        Change Pantry
                                    </Button>
                                </Box>
                            </>
                        )}

                    </Toolbar>
                </Container>
            </AppBar>

            <Dialog
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Select Pantry</DialogTitle>
                <DialogContent>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {pantries.map((pantry) => (
                            <ListItem key={pantry.id} >
                                <Button disabled={localStorage.getItem('pantryId') === pantry.id.toString()} onClick={() => {
                                    if (localStorage.getItem('pantryId') === pantry.id.toString()) return
                                    localStorage.setItem('pantryId', pantry.id)
                                    window.location.href = `/pantry/${pantry.id}`
                                }}>
                                    <ListItemText primary={pantry.name} secondary={localStorage.getItem('pantryId') === pantry.id.toString() ? "Selected" : ""} />

                                </Button>

                            </ListItem>))}

                        <ListItem key={-1} >
                            <Button variant="contained" onClick={() => {
                                localStorage.removeItem('pantryId')
                                window.location.href = `/`
                            }}>
                                <ListItemText primary="Create New Pantry" />

                            </Button>

                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Header;