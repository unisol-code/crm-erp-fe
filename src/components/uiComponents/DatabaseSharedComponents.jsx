import React from "react";
import { Box, Typography, Badge } from "@mui/material";
import { AddIcon } from "../../assets/CommonAssets";
import ReactSelect from "react-select";

export function TableHeader({
  title,
  theme,
  showExport,
  onAddClick,
  addButtonText,
  selectProps,
  onExportClick
}) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 2,
        borderBottom: `5px solid ${theme.primaryColor}`,
      }}
    >
      <Typography
        sx={{ fontWeight: 600, fontSize: "24px", color: theme.primaryColor }}
      >
        {title}
      </Typography>

      {/* Optional ReactSelect */}
      {selectProps && (
        <ReactSelect
          {...selectProps}
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: "44px",
              borderRadius: "0.5rem",
              borderColor: state.isFocused ? theme.primaryColor : "#D1D5DB",
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0 8px",
              fontSize: "0.95rem",
            }),
            placeholder: (base) => ({ ...base, color: "#9CA3AF" }),
            ...selectProps.styles, // allow overriding styles
          }}
        />
      )}

      <Box sx={{ display: "flex", gap: "24px" }}>
        {showExport && <ExportButton theme={theme} onClick={onExportClick} />}
        {addButtonText && onAddClick && (
          <AddButton theme={theme} onClick={onAddClick} text={addButtonText} />
        )}
      </Box>
    </Box>
  );
}

export function ExportButton({ theme, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        height: "40px",
        padding: "8px 16px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        backgroundColor: theme.primaryColor,
        "&:hover": {
          backgroundColor: theme.primaryColorHover || theme.primaryColor,
        },
      }}
    >
      <Typography sx={{ fontWeight: 500, fontSize: "16px", color: "#fff" }}>
        Export
      </Typography>
    </Box>
  );
}

export function AddButton({ theme, onClick, text }) {
  return (
    <Box
      sx={{
        height: "40px",
        padding: "8px 16px",
        background: theme.primaryColor,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: theme.primaryColorHover || theme.primaryColor,
        },
      }}
      onClick={onClick}
    >
      <AddIcon color="white" />
      <Typography sx={{ fontWeight: 500, fontSize: "17.96px", color: "white" }}>
        {text}
      </Typography>
    </Box>
  );
}

export function ViewRequestButton({ theme, onClick, text, badgeCount = 0 }) {
  return (
    <Badge
      badgeContent={badgeCount}
      color="warning"
      overlap="rectangular"
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "0.75rem",
          height: "20px",
          minWidth: "20px",
          borderRadius: "50%",
          border: "1px solid white",
        },
      }}
    >
      <Box
        sx={{
          height: "40px",
          padding: "8px 16px",
          background: theme.primaryColor,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: theme.primaryColorHover || theme.primaryColor,
          },
        }}
        onClick={onClick}
      >
        <Typography sx={{ fontWeight: 500, fontSize: "17.96px", color: "white" }}>
          {text}
        </Typography>
      </Box>
    </Badge>
  );
}
