import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../common/apiService";
import { API_LOGOUT } from "../common/apiEndpoints";
import { toast } from "react-toastify";

const Header = ({ userData, setUserData, setDepartmentId }) => {
  const isLoggedIn = !!userData;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await ApiService.delete(API_LOGOUT);
      localStorage.removeItem("userData");
      setUserData(null);
      setDepartmentId(null);
      navigate("/");
      toast.success(response.data.notice);
    } catch (error) {
      toast.error(error.toString());
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const getInitials = (name) => name.split(" ").map((n) => n[0]).join("");
  const fullName = isLoggedIn ? `${userData.first_name} ${userData.last_name}` : "";

  return (
    <>
      {/* Header Bar */}
      <AppBar position="fixed" sx={{ background: "linear-gradient(90deg, #1976D2, #1565C0)", boxShadow: 3 }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ display: { xs: "block", md: "none" } }}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>Employee Directory</Link>
          </Typography>

          {/* Desktop Navigation */}
          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button color="inherit" component={Link} to="/attendance">Home</Button>
              <Button color="inherit" component={Link} to="/pdf-uploader">PDF Sign & Stamp</Button>
              <Button color="inherit" component={Link} to="/team">Team</Button>
              <Button color="inherit" component={Link} to="/chat">Chat</Button>

              {/* User Avatar & Dropdown Menu */}
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

      {/* Mobile Drawer */}
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
