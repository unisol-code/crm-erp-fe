import { Box, Typography } from "@mui/material";
import VisitTargetTable from "./containers/VisitTargetTable";
import TerritorySnapshot from "./containers/TerritorySnapshot";
import TopSpecialtyTable from "./containers/TopSpecialtyTable";
import TopCustomerTable from "./containers/TopCustomerTable";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";

function Dashboard() {
  const { theme } = useTheme();

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: theme?.backgroundColor }}
    >
      <Box
        sx={{
          width: "100%",
          padding: "2px",
          "@media (max-width:600px)": { // ✅ plain media query instead of breakpoints
            padding: "8px",
          },
        }}
      >
        <BreadCrumb linkText={[{ text: "Dashboard" }]} />
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: theme?.primaryText || "black",
            fontSize: "1.2rem",
            "@media (max-width:600px)": {
              fontSize: "1rem",
            },
          }}
        >
          Sales Executive
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "2px",
          boxSizing: "border-box",
          "@media (max-width:600px)": {
            gap: "16px",
            padding: "8px",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "20px",
            "@media (max-width:600px)": {
              gap: "12px",
            },
          }}
        >
          <VisitTargetTable />
          <TerritorySnapshot />
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "24px",
            "@media (max-width:600px)": {
              gap: "12px",
            },
          }}
        >
          <TopSpecialtyTable />
          <TopCustomerTable />
        </Box>
      </Box>
    </div>
  );
}

export default Dashboard;
