import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, AppBar, Toolbar, Typography, InputBase, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

function App() {
    const [hello, setHello] = useState('');
    
    useEffect(() => {
        axios.get('/api/hello')
            .then(response => setHello(response.data))
            .catch(error => console.log(error));
    }, []);
    
    const drawerWidth = 240;

    return (
        <Box sx={{ display: 'flex' }}>
            {/* 상단 메뉴바 */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <MenuIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        My Application
                    </Typography>
                    <Box sx={{ position: 'relative', borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginLeft: 0, width: 'auto' }}>
                        <Box sx={{ padding: '0 16px', height: '100%', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SearchIcon />
                        </Box>
                        <InputBase
                            placeholder="Search…"
                            sx={{ color: 'inherit', paddingLeft: `calc(1em + 32px)`, width: '100%' }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 좌측 사이드바 */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* 메인 콘텐츠 */}
            <Box component="main" sx={{ flexGrow: 1, padding: 3, marginLeft: `${drawerWidth}px`, marginTop: '64px' }}>
                <Typography paragraph>
                    백엔드에서 가져온 데이터입니다: {hello}
                </Typography>
                <Button variant="contained">버튼입니다</Button>
            </Box>
        </Box>
    );
}

export default App;
