import React, { useState, useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const Header = () => {
  const { currentUser, handleLogout } = useContext(UserContext);
  const isLoggedIn = !!currentUser;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("");
  const fullName = isLoggedIn ? `${currentUser.first_name} ${currentUser.last_name}` : "";

  return (
    <>
      <AppBar position="fixed" sx={{ background: "linear-gradient(90deg, #1976D2, #1565C0)", boxShadow: 3 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ display: { xs: "block", md: "none" } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>Employee Directory</Link>
          </Typography>

          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button color="inherit" component={Link} to="/attendance">Home</Button>
              <Button color="inherit" component={Link} to="/pdf-uploader">PDF Sign & Stamp</Button>
              <Button color="inherit" component={Link} to="/team">Team</Button>
              <Button color="inherit" component={Link} to="/chat">Chat</Button>

              <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                <Avatar sx={{ bgcolor: "#FF5722" }}>{getInitials(fullName)}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigate("/edit-profile"); handleMenuClose(); }}>Edit Profile</MenuItem>
                <MenuItem onClick={() => { navigate("/change-password"); handleMenuClose(); }}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button component={Link} to="/" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Home" />
          </ListItem>
          {isLoggedIn ? (
            <>
              <ListItem button component={Link} to="/pdf-uploader" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="PDF Sign & Stamp" />
              </ListItem>
              <ListItem button component={Link} to="/team" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Team" />
              </ListItem>
              <ListItem button component={Link} to="/chat" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Chat" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button component={Link} to="/signup" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Signup" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
