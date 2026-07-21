import { Box, Typography } from "@mui/material";
import VisitTargetTable from "./containers/VisitTargetTable";
import TerritorySnapshot from "./containers/TerritorySnapshot";
import TopSpecialtyTable from "./containers/TopSpecialtyTable";
import TopCustomerTable from "./containers/TopCustomerTable";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useDashboard from "../../../../hooks/salesExecutiveHook/dashboard/useDashboard";
import { useEffect } from "react";

function Dashboard() {
  const { theme } = useTheme();
  const {  fetchTodaySpecial, todaySpecial,loading} = useDashboard();
  useEffect (() => {
    fetchTodaySpecial();
  },[])
  console.log("todaySpecial", todaySpecial);
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
      
{(todaySpecial?.todayEvents?.length > 0 ||
  todaySpecial?.upcomingEvents?.length > 0) && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

    {/* Today Special */}
    <div
      className="rounded-2xl p-5 text-white shadow-lg border"
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`,
        borderColor: theme.highlightColor,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90">Today's Special</p>
          <h3 className="text-xl font-bold">🎉 Celebrations Today</h3>
        </div>

        <div
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          {todaySpecial?.todayCount || 0}
        </div>
      </div>

      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        {todaySpecial?.todayEvents?.map((person, index) => (
          <div
            key={index}
            className="rounded-xl p-3 flex items-center gap-3 border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{
                backgroundColor: '#ffffff',
                color: theme.accentColor,
              }}
            >
              {person?.fullName?.charAt(0) || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {person?.fullName}
              </p>

              <p className="text-sm opacity-90">
                {person?.eventType || 'Birthday'}
              </p>

              <p className="text-xs opacity-80 truncate">
                {person?.companyName}
              </p>
            </div>

            <span className="text-2xl shrink-0">
              {person?.eventType === 'Birthday' ? '🎂' : '🎉'}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Upcoming Special */}
    <div
      className="rounded-2xl p-5 shadow-lg border"
      style={{
        backgroundColor: '#ffffff',
        borderColor: theme.highlightColor,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Upcoming</p>
          <h3
            className="text-xl font-bold"
            style={{ color: theme.accentColor }}
          >
            📅 Next Celebrations
          </h3>
        </div>

        <div
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: theme.secondaryColor,
            color: theme.accentColor,
          }}
        >
          {todaySpecial?.upcomingCount || 0}
        </div>
      </div>

      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        {todaySpecial?.upcomingEvents?.map((person, index) => {
          const today = new Date();
          const currentYear = today.getFullYear();

          // API date: 2002-07-23 → use current year
          const upcomingDate = new Date(
            `${currentYear}-${person.eventDate.slice(5)}`
          );

          const diffTime = upcomingDate - today;
          const daysLeft = Math.max(
            0,
            Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          );

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: theme.highlightColor,
                backgroundColor: theme.backgroundColor,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0"
                  style={{
                    backgroundColor: theme.secondaryColor,
                    color: theme.accentColor,
                  }}
                >
                  {person?.fullName?.charAt(0) || 'U'}
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {person?.fullName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {person?.eventType}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    {person?.companyName}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.accentColor }}
                >
                  {new Date(
                    `${currentYear}-${person.eventDate.slice(5)}`
                  ).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>

                <p className="text-xs text-gray-500">
                  {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
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
