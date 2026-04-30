import React, { useState, useEffect } from "react";
import { Badge, Box, Typography } from "@mui/material";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import SuperAdminIndividualDatabase from "./superAdminIndividualDB/SuperAdminIndividualDatabase";
import SuperAdminOrganizationDatabase from "./superAdminOrganizationDB/SuperAdminOrganizationDatabase";
import useIndividuals from "../../../../hooks/salesExecutiveHook/Individual/useIndividual";
import {
  CustomerMetIcon,
  CustomersIcon,
  CustomerYetToMetIcon,
} from "../../../../assets/CommonAssets";
import { getActiveStateAtom } from "../../../../state/salesExecutiveState/Individuals/IndividualsState";
import { useRecoilState } from "recoil";
import ApprovalRequests from "./ApprovalRequests";
import useDatabase from "../../../../hooks/database/useDatabase";
import useCompany from "../../../../hooks/common/useCompany";

const SuperAdminDatabase = () => {
  const [activeTab, setActiveTab] = useRecoilState(getActiveStateAtom);
  const { theme } = useTheme();
  const { isEnviroSolution } = useCompany();
  const {
    loading,
    fetchGetIndividualDashboard,
    getIndividualDashboard,
  } = useIndividuals();

  const { fetchAllRequest, editRequests } = useDatabase();

  useEffect(() => {
    // Show approval count in starting (on mount)
    fetchAllRequest(1, 10);
  }, []);

  useEffect(() => {
    // First Company wise then Active tab wise
    if (!isEnviroSolution) {
      if (activeTab === "Individual") {
        fetchGetIndividualDashboard();
      }
      // Add organization dashboard here if available
    } else {
      if (activeTab === "Individual") {
        // Call Enviro individual dashboard if needed
      }
    }
  }, [activeTab, isEnviroSolution]);

  const dashboardCards = [
    {
      title: "Total Customer Plan",
      count: getIndividualDashboard?.TotalCustomersPlan || 0,
      icon: <CustomersIcon />,
      TimeRanges: "For this month",
    },
    {
      title: "Total Customer Met",
      count:
        getIndividualDashboard?.callObjectiveStatusCount?.TotalCustomerMet || 0,
      icon: <CustomerMetIcon />,
    },
    {
      title: "Total Customer Yet To Meet",
      count:
        getIndividualDashboard?.callObjectiveStatusCount
          ?.TotalCustomerYetToMeet || 0,
      icon: <CustomerYetToMetIcon />,
    },
  ];

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Database" },
          {
            text:
              activeTab === "Individual"
                ? "Individual Database"
                : activeTab === "Organizational"
                  ? "Organizational Database"
                  : "Approval Requests",
          },
        ]}
      />
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: "24px",
        }}
      >
        {dashboardCards.map((data, index) => (
          <IndividualDataCard key={index} data={data} />
        ))}
      </Box>

      <Box
        sx={{
          width: "100%",
          padding: "3px",
          boxSizing: "border-box",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Box
              sx={{
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "Individual"
                    ? theme.primaryColor
                    : "transparent",
                color: activeTab === "Individual" ? "white" : "black",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor:
                    activeTab === "Individual"
                      ? theme.secondaryColor
                      : "#e0e0e0",
                },
              }}
              onClick={() => setActiveTab("Individual")}
            >
              Individual Database
            </Box>
            <Box
              sx={{
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "Organizational"
                    ? theme.primaryColor
                    : "transparent",
                color: activeTab === "Organizational" ? "white" : "black",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor:
                    activeTab === "Organizational"
                      ? theme.secondaryColor
                      : "#e0e0e0",
                },
              }}
              onClick={() => setActiveTab("Organizational")}
            >
              Organizational Database
            </Box>
            <Box
              sx={{
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "approvalRequests"
                    ? theme.primaryColor
                    : "transparent",
                color: activeTab === "approvalRequests" ? "white" : "black",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor:
                    activeTab === "approvalRequests"
                      ? theme.secondaryColor
                      : "#e0e0e0",
                },
              }}
              onClick={() => setActiveTab("approvalRequests")}
            >
              <Badge
                badgeContent={editRequests?.totalrequestscount}
                color="warning"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    height: "18px",
                    minWidth: "18px",
                    borderRadius: "50%",
                    top: "-8px",
                    right: "-12px",
                  },
                }}
              >
                Approval Requests
              </Badge>
            </Box>
          </Box>

          {activeTab === "Individual" ? (
            <SuperAdminIndividualDatabase />
          ) : activeTab === "Organizational" ? (
            <SuperAdminOrganizationDatabase />
          ) : (
            <ApprovalRequests />
          )}
        </Box>
      </Box>
    </div>
  );
};
function IndividualDataCard({ data }) {
  return (
    <Box
      sx={{
        p: 1.5, // ⬇ reduced padding
        borderRadius: 3,
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 48,      // ⬇ smaller icon
          height: 48,
          borderRadius: "50%",
          background:
            data?.title === "Total Customer Yet To Meet"
              ? "#FFE1D3"
              : "#D3FFE7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {data.icon}
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {data?.title}
        </Typography>

        <Typography variant="h5" fontWeight={600} lineHeight={1.2}>
          {data?.count}
        </Typography>

        {data?.TimeRanges && (
          <Typography variant="caption" color="success.main">
            {data.TimeRanges}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default SuperAdminDatabase;
