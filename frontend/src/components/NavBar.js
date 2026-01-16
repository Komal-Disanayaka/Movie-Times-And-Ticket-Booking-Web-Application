import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import './NavBar.css';

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mainLinks = (
    <>
      <Button className="nav-btn" component={Link} to="/">
        Home
      </Button>
      <Button 
        className="nav-btn nav-btn-highlighted" 
        component={Link} 
        to="/movies"
      >
        Buy Tickets
      </Button>
      <Button className="nav-btn" component={Link} to="/movies">
        Movies
      </Button>
      <Button className="nav-btn" component={Link} to="/movies">
        Cinemas
      </Button>
      <Button className="nav-btn" component={Link} to="/contact">
        Contact Us
      </Button>
    </>
  );

  const authLinks = (
    <>
      {!user && (
        <>
          <Button className="nav-btn" component={Link} to="/login">
            Login
          </Button>
          <Button className="nav-btn" component={Link} to="/register">
            Register
          </Button>
        </>
      )}
      {user && user.role === 'user' && (
        <>
          <Button className="nav-btn" component={Link} to="/profile">
            Profile
          </Button>
          <Button className="nav-btn" component={Link} to="/booking-history">
            History
          </Button>
          <Button className="nav-btn" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
      {user && user.role === 'admin' && (
        <>
          <Button className="nav-btn" component={Link} to="/admin">
            Admin
          </Button>
          <Button className="nav-btn" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
    </>
  );

  const drawer = (
    <Box className="mobile-drawer" onClick={handleDrawerToggle}>
      <List>
        <ListItem>
          <Button fullWidth className="nav-btn" component={Link} to="/">
            Home
          </Button>
        </ListItem>
        <ListItem>
          <Button fullWidth className="nav-btn nav-btn-highlighted" component={Link} to="/movies">
            Buy Tickets
          </Button>
        </ListItem>
        <ListItem>
          <Button fullWidth className="nav-btn" component={Link} to="/movies">
            Movies
          </Button>
        </ListItem>
        <ListItem>
          <Button fullWidth className="nav-btn" component={Link} to="/movies">
            Cinemas
          </Button>
        </ListItem>
        <ListItem>
          <Button fullWidth className="nav-btn" component={Link} to="/support">
            Contact Us
          </Button>
        </ListItem>
        {!user && (
          <>
            <ListItem>
              <Button fullWidth className="nav-btn" component={Link} to="/login">
                Login
              </Button>
            </ListItem>
            <ListItem>
              <Button fullWidth className="nav-btn" component={Link} to="/register">
                Register
              </Button>
            </ListItem>
          </>
        )}
        {user && user.role === 'user' && (
          <>
            <ListItem>
              <Button fullWidth className="nav-btn" component={Link} to="/profile">
                Profile
              </Button>
            </ListItem>
            <ListItem>
              <Button fullWidth className="nav-btn" component={Link} to="/booking-history">
                Booking History
              </Button>
            </ListItem>
            <ListItem>
              <Button fullWidth className="nav-btn" onClick={handleLogout}>
                Logout
              </Button>
            </ListItem>
          </>
        )}
        {user && user.role === 'admin' && (
          <>
            <ListItem>
              <Button fullWidth className="nav-btn" component={Link} to="/admin">
                Admin Panel
              </Button>
            </ListItem>
            <ListItem>
              <Button fullWidth className="nav-btn" onClick={handleLogout}>
                Logout
              </Button>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" className="navbar">
        <Toolbar className="navbar-toolbar">
          <Typography variant="h5" className="navbar-logo" component={Link} to="/">
            MOVIE NEST
          </Typography>
          
          <Box className="navbar-desktop">
            <Box className="navbar-links-main">
              {mainLinks}
            </Box>
            <Box className="navbar-links-auth">
              {authLinks}
            </Box>
          </Box>

          <IconButton
            className="navbar-mobile-icon"
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        className="navbar-drawer"
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default NavBar;
