import React, { useState } from "react";
import { Box, Divider, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import { NotificationIcon } from "../../../assets/CommonAssets";
import { Avatar } from "antd";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "../../../hooks/auth/useSignIn";
import profileimg from "../../../assets/images/profileimg.jpg";
import { useSetRecoilState } from "recoil";
import { userAuthState } from "../../../state/authenticatedState/authenticatedState";

const SuperAdminHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState(userAuthState);
  const { resetSuperAdmin, sAdminResponse, resetEmployee } = useSignIn();

  // Open profile menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close profile menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout handler (focus-safe)
  const handleLogout = () => {
    handleClose();
    setTimeout(() => {
      sessionStorage.clear();
      localStorage.clear();
      setUserInfo({ isAuthenticated: false });
      resetSuperAdmin();
      resetEmployee();
      navigate("/");
    }, 200);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "64px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "16px",
        paddingX: "48px",
        boxSizing: "border-box",
        boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {/* Notification */}
      <IconButton aria-label="notifications">
        <NotificationIcon />
      </IconButton>

      <Divider orientation="vertical" flexItem />

      {/* Profile Trigger (FOCUSABLE) */}
      <IconButton
        onClick={handleProfileClick}
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Avatar
          src={sAdminResponse?.user?.profileImage || profileimg}
          alt={sAdminResponse?.user?.name}
        >
          {sAdminResponse?.user?.name?.[0]}
        </Avatar>

        <Box sx={{ textAlign: "left" }}>
          <Typography fontWeight={600} fontSize="14px" color="black" >
            {sAdminResponse?.user?.name || "Super Admin"}
          </Typography>
          <Typography fontSize="12px" color="black">
            Super Admin
          </Typography>
        </Box>
      </IconButton>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
        disableAutoFocusItem
        MenuListProps={{ autoFocus: false }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          <IoLogOut style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SuperAdminHeader;
