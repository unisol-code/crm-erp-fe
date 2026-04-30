import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";

import TopSpecialityCategoryChart from "../charts/TopSpecialityCategoryChart";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDashboard from "../../../../../hooks/salesExecutiveHook/dashboard/useDashboard";

const Categories = [
  { title: "Category A", color: "#063FFD" },
  { title: "Category B", color: "#FF0000" },
  { title: "Category C", color: "#59FF00" },
  { title: "Category D", color: "#FFE20A" },
];

const CATEGORY_COLORS = {
  A: "#063FFD",
  B: "#FF0000",
  C: "#59FF00",
  D: "#FFE20A",
};

const formatCategories = (categoryObj = {}) => {
  const mapping = {
    A: "Category A",
    B: "Category B",
    C: "Category C",
    D: "Category D",
  };

  return Object.entries(categoryObj).map(([key, value]) => ({
    title: mapping[key] || key,
    value,
    color: CATEGORY_COLORS[key] || "#999999", // fallback color
  }));
};

const TopSpecialtyTable = () => {
  const { theme } = useTheme();
  const { fetchTopSpecialities, topSpecialities, loading } = useDashboard();

  useEffect(() => {
    fetchTopSpecialities();
  }, []);

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "95%", md: "90%", lg: "100%" },
        mx: "auto",
        borderRadius: 5,
        overflowX: { xs: "auto", sm: "hidden" }, // enable scroll for mobile
      }}
    >
      <CardHeader
        sx={{
          backgroundColor: theme.secondaryColor,
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
        title={
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Top Speciality
          </Typography>
        }
      />
      <CardContent sx={{ paddingBottom: 0, px: { xs: 1, sm: 2 } }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            overflowX: "auto",
            width: "100%",
            scrollbarWidth: "thin",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              paddingBottom: 2,
              minWidth: { xs: 600, sm: 700, md: 800 }, // prevent squishing
            }}
          >
            <TableHead>
              <TableRow>
                {[
                  "Sr No",
                  "Specialty",
                  "Total Doctors",
                  "Total Visits",
                  "Sales Target",
                  "Sales Achievement",
                  "Total Categories",
                ].map((head, idx) => (
                  <TableCell
                    key={idx}
                    align={idx > 1 ? "center" : "left"}
                    sx={{
                      paddingX: 1.5,
                      paddingY: 0,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      fontSize: { xs: "0.7rem", sm: "0.85rem" },
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box py={2}>
                      <CircularProgress size={24} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : topSpecialities?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box py={2}>
                      <Typography variant="body2" color="text.secondary">
                        No data available.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                topSpecialities.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        paddingY: 0,
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {item.srNo || index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        paddingX: 1.5,
                        paddingY: 0,
                        borderBottom: "none",
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        fontSize={{ xs: "0.7rem", sm: "0.85rem" }}
                      >
                        {item.speciality}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        paddingX: 1.5,
                        paddingY: 0,
                        borderBottom: "none",
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {item.totalDoctors}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        paddingX: 1.5,
                        paddingY: 0,
                        borderBottom: "none",
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {item.totalVisits}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        paddingX: 1.5,
                        paddingY: 0,
                        borderBottom: "none",
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {item.target || "N/A"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        paddingX: 1.5,
                        paddingY: 0,
                        borderBottom: "none",
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {item.totalAchievements}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: 0,
                        height: 60,
                        borderBottom: "none",
                        paddingX: 0,
                        paddingY: 0,
                      }}
                    >
                      <TopSpecialityCategoryChart
                        data={formatCategories(item.totalCategories)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <hr />
        <Box
          pt={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: "12px", sm: "24px" },
            flexWrap: { xs: "wrap", sm: "nowrap" }, // wrap on small screens
          }}
        >
          {Categories.map((category, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "8px",
                  background: category.color,
                }}
              />
              <Typography
                sx={{
                  color: "#444A6D",
                  fontWeight: 400,
                  fontSize: { xs: "10px", sm: "12px" },
                }}
              >
                {category.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopSpecialtyTable;
