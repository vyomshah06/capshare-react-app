import React, {useState, useEffect} from 'react';
import {
    AppBar, 
    Toolbar,
    Typography, 
    Button, 
    IconButton, 
    Link,     
    MenuItem, 
    Popover,     
    Drawer, 
    Divider,     
    makeStyles
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles(theme => ({    
    title: {
        flexGrow: 1,
    },
    headerlinks: {
        fontSize: '1rem',
        '&:hover': {
        	opacity: '0.7',
        }
    },    
    menuItemHover: {
        '&:hover': {
            backgroundColor: '#282c34',
            color: 'white',
        }
    },
    drawerHeader: {
    display: 'flex',
    alignItems: 'center',    
    justifyContent: 'flex-end',
  },
}))

export default function Header () {

    const classes = useStyles();
    let user = JSON.parse(localStorage.getItem('user'));
    const username = user.username;

    const [mobileView, setMobileView] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {        
        const setResponsiveness = () => {
          return window.innerWidth < 768
            ? setMobileView(true)
            : setMobileView(false)
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const logout = () => {
        localStorage.removeItem('user');
        window.location.href='/';
      }

    const displayDesktop = () => {
        return (
            <Toolbar >                
                <Typography variant="h2" color="inherit" className={classes.title}>
                    CapShare
                </Typography>                    
                <Button href='/home' className={classes.headerlinks} color="inherit">Home</Button>
                <Button href='/post/captions' className={classes.headerlinks} color="inherit">Post Captions</Button>
                <div>
                  <IconButton                  	
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"                                     
                  >
                    <AccountCircle style={{fontSize: '2rem'}} />
                  </IconButton>                  
                  <Popover 
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      keepMounted                    
                      open={open}
                      onClose={handleClose}
                      PaperProps={{                        
                        style: {
                        	width: '200px',	                        					    
                        },                        
                      }}
                      style={{marginTop: '40px'}}                                          
                  >                              	
                    <div style={{margin: '10px'}}>
                        <Typography>
                            Signed in as
                        </Typography>
                        <Typography style={{fontWeight: 'bold'}}>
                            {username}
                        </Typography>
                        <hr />                    
                    </div>  
                    <div style={{marginBottom: '10px'}}> 
                        <Link href='/view/captions' color='inherit' style={{textDecoration: 'none'}}>                       
                            <MenuItem onClick={handleClose} 
                            className={classes.menuItemHover}>View Captions</MenuItem>
                        </Link>
                        <Link href='#' color='inherit' style={{textDecoration: 'none'}}>
                            <MenuItem onClick={logout} 
                            className={classes.menuItemHover}>Logout</MenuItem>
                        </Link>
                    </div>
                  </Popover>
                </div> 
            </Toolbar>
        );        
    };

    const displayMobile = () => {
        const handleDrawerOpen = () => {
            setDrawerOpen(true);
        }
        const handleDrawerClose = () => {
            setDrawerOpen(false);
        }

        return(
            <Toolbar>
                <IconButton
                    aria-label="Menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"                    
                    color="inherit"     
                    onClick={handleDrawerOpen}                                
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                anchor='left'
                transitionDuration={500}
                open={drawerOpen}
                onClose={handleDrawerClose}
                >
                    <div className={classes.drawerHeader}>
                      <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                      </IconButton>
                    </div>
                    <div style={{margin: '10px'}}>
                        <Typography>
                            Signed in as
                        </Typography>
                        <Typography style={{fontWeight: 'bold'}}>
                            {username}
                        </Typography>
                    </div>
                    <Divider />
                    <Link href='/home' color='inherit' style={{textDecoration: 'none'}}>
                        <MenuItem>Home</MenuItem>
                    </Link>
                    <Divider />
                    <Link href='/post/captions' color='inherit' style={{textDecoration: 'none'}}>
                        <MenuItem>Post Captions</MenuItem>
                    </Link>
                    <Divider />
                    <Link href='/view/captions' color='inherit' style={{textDecoration: 'none'}}>
                        <MenuItem>View Captions</MenuItem>
                    </Link>
                    <Divider />
                    <Link href='#' color='inherit' style={{textDecoration: 'none'}}>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Link>
                </Drawer>

                <div>
                    <Typography variant="h6" component="h1" color="inherit">
                        CapShare
                    </Typography>
                </div>
            </Toolbar>
        );
    };

    return(
        <div>
            <AppBar position="static" style={{backgroundColor: '#282c34'}}>
                {mobileView ? displayMobile() : displayDesktop()}            
            </AppBar>
        </div>
    );
}