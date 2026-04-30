import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import IndividualDatabase from "./individualDatabase/IndividualDatabase";
import OrganizationalDatabase from "./organizationalDatabase/OrganizationalDatabase";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useIndividuals from "../../../../hooks/salesExecutiveHook/Individual/useIndividual";
import {
  CustomerMetIcon,
  CustomersIcon,
  CustomerYetToMetIcon,
  ViewIcon,
} from "../../../../../src/assets/CommonAssets";
import { useRecoilState } from "recoil";
import { getEmployeeActiveStateAtom } from "../../../../state/salesExecutiveState/Individuals/IndividualsState";
import useCompany from "../../../../hooks/common/useCompany";
function SalesExecutiveDatabase() {
  const [activeTab, setActiveTab] = useRecoilState(getEmployeeActiveStateAtom);
  const { theme } = useTheme();
  const {
    fetchGetIndividualDashboard,
    getIndividualDashboard,
  } = useIndividuals();
  const { isEnviroSolution } = useCompany();

  useEffect(() => {
    if (!isEnviroSolution) {
      fetchGetIndividualDashboard();
    }
  }, [isEnviroSolution]);
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
                : "Organizational Database",
          },
        ]}
      />
      {!isEnviroSolution && (
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
      )}

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
              gap: "4px",
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
          </Box>

          {activeTab === "Individual" ? (
            <IndividualDatabase />
          ) : (
            <OrganizationalDatabase />
          )}
        </Box>
      </Box>
    </div>
  );
}
function IndividualDataCard({ data }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 4,
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          width: 48,
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

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {data?.title}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
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

export default SalesExecutiveDatabase;
