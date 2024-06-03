import React, { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Logo from "../assets/logo.png"

// Define a type for the props including children
interface LayoutProps {
    children?: ReactNode;
}

const drawerWidth = 240;

const Layout: React.FC<LayoutProps> = () => {
    return (
        <Box sx={{ display: 'flex' }} >
            <AppBar position="fixed" className='bg-white' >
                <Toolbar className='flex justify-end'>
                    <AccountCircleRoundedIcon fontSize='large' className='flex text-green-950 ' />
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
                className='sm:flex hidden'
            >
                <Toolbar>
                    <Box component="img" className='w-24 m-5' alt="Your logo." src={Logo} />
                </Toolbar>



                <Box sx={{ overflow: 'auto' }} >
                    <List>
                        <ListItemButton component={Link} to="/" className='m-2  focus:text-white focus:bg-green-800 hover:text-green-800 rounded-md gap-2'>
                            <HomeRoundedIcon /><ListItemText primary="Home" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/create" className='m-2  focus:text-white focus:bg-green-800 hover:text-green-800 rounded-md gap-2'>
                            <AddRoundedIcon /><ListItemText primary="Create Account" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/accounts" className='m-2  focus:text-white focus:bg-green-800 hover:text-green-800 rounded-md gap-2'>
                            <VisibilityRoundedIcon /><ListItemText primary="View Accounts" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/transfer" className='m-2  focus:text-white focus:bg-green-800 hover:text-green-800 rounded-md gap-2'>
                            <SwapHorizRoundedIcon /><ListItemText primary="Transfer" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                className=' p-4 flex-grow '
            >
                <Toolbar />
                <Outlet /> {/* This is where the nested routes will render */}
            </Box>
        </Box>
    );
};

export default Layout;