import {
  Box,
  Divider,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { NotificationIcon } from "../../../assets/CommonAssets";
import { Avatar } from "antd";
import profileimg from "../../../assets/images/profileimg.jpg";
import { useSignIn } from "../../../hooks/auth/useSignIn";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function SalesExecutiveHeader() {
  const { employeeLoginData } = useSignIn();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
    handleClose(); // ✅ important for accessibility
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "64px",
        background: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
        alignItems: "center",
        gap: "16px",
        paddingRight: "48px",
        paddingY: "16px",
        boxSizing: "border-box",
      }}
    >
      <IconButton aria-label="notifications">
        <NotificationIcon />
      </IconButton>

      <Divider
        orientation="vertical"
        variant="middle"
        sx={{ borderColor: "black" }}
      />
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
          src={employeeLoginData?.photo || profileimg}
          alt={employeeLoginData?.name}
        >
          {employeeLoginData?.name?.[0]}
        </Avatar>

        <Box sx={{ textAlign: "left" }}>
          <Typography fontWeight={600} fontSize="14px" color="black">
            {employeeLoginData?.name || "Sales Executive"}
          </Typography>
          <Typography fontSize="12px" color="black">
            Sales Executive
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
}

export default SalesExecutiveHeader;
