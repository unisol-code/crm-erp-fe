import React, { useEffect, useMemo, useState } from "react";
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
  Avatar,
  Chip,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDashboard from "../../../../../hooks/salesExecutiveHook/dashboard/useDashboard";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import Select from "react-select";

const getCategoryColor = (category) => {
  const map = {
    A: { bg: "#4caf50", text: "#fff" },
    B: { bg: "#2196f3", text: "#fff" },
    C: { bg: "#ff9800", text: "#fff" },
    D: { bg: "#f44336", text: "#fff" },
  };
  return map[category] || { bg: "#9e9e9e", text: "#fff" };
};

const TopCustomerTable = () => {
  const { theme } = useTheme();
  const { fetchTopCustomers, topCustomers, loading } = useDashboard();
  const { fetchSpeciality, speciality, fetchCityNames, cityNames } =
    useDropdown();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  console.log("topCustomers", topCustomers);

  useEffect(() => {
    fetchCityNames();
    fetchSpeciality();
  }, []);

  useEffect(() => {
    fetchTopCustomers(selectedCity?.value, selectedSpeciality?.value);
  }, [selectedCity?.value, selectedSpeciality?.value]);

  const cityOptions = useMemo(() => {
    if (!cityNames) return [];
    return cityNames.map((city) => ({ value: city, label: city }));
  }, [cityNames]);

  const specialityOptions = useMemo(() => {
    if (!speciality) return [];
    return speciality.map((spec) => ({ value: spec, label: spec }));
  }, [speciality]);

  console.log("Hospital Name:", topCustomers);

  return (
    <Card
      elevation={3}
      sx={{
        width: {
          xs: "100%",
          sm: "90%",
          md: "70%",
          lg: "60%",
          xl: "60%",
        },
        mx: "auto",
        borderRadius: 5,
      }}
    >
      <CardHeader
        sx={{ backgroundColor: theme.secondaryColor }}
        title={
          <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                fontSize: { xs: "1rem", sm: "1.1rem" },
                              }}
                            >
                              Top Customer
                            </Typography>
        }
        action={
            <Box display="flex" gap={1} flexWrap="wrap"
              sx={{
                flexDirection: {
                  xs: "column",  // Mobile → stack vertically
                  sm: "row",     // Tablet → side by side
                },
                alignItems: {
                  xs: "stretch", // full width on mobile
                  sm: "center",
                },
              }}>
              <Select
                options={cityOptions}
                value={selectedCity}
                placeholder="Select City"
                onChange={setSelectedCity}
                isClearable
                styles={{
                  container: (base) => ({ ...base, minWidth: 120 }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
              <Select
                options={specialityOptions}
                placeholder="Select Speciality"
                isClearable
                value={selectedSpeciality}
                onChange={setSelectedSpeciality}
                styles={{
                  container: (base) => ({ ...base, minWidth: 160 }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </Box>
        }
      />

      <CardContent>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: { xs: 300, sm: 400 },
            overflowY: "auto",
            scrollbarWidth: "thin",
            pb: 8,
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    paddingX: 0,
                  }}
                >
                  Sr No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    paddingX: 0,
                  }}
                >
                  Hospital Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    paddingX: 0,
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    paddingX: 1,
                    lineHeight: 1,
                  }}
                >
                  Total Visits
                  <br />
                  Achieved
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Box py={2}>
                      <CircularProgress size={24} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : topCustomers?.topHospitals?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" py={2}>
                      No customer data available.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                topCustomers?.topHospitals?.map((customer, index) => {
                  console.log("Hospital Name:", customer.hospital);
                  const { bg, text } = getCategoryColor(customer.category);
                  return (
                    <TableRow key={index} hover>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "none", paddingY: 1.6 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: bg,
                            fontSize: 14,
                            color: text,
                            margin: "0 auto",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </TableCell>

                      {/* <TableCell sx={{ borderBottom: "none" }} align="center">
                        <Typography
                          key={index}
                          fontWeight={600}
                          fontSize="14px"
                          whiteSpace="nowrap"
                        >
                          {customer.hospitalName[0] || "-"}
                        </Typography>
                      </TableCell> */}
                      <TableCell sx={{ borderBottom: "none" }} align="center">
                        <Typography
                          key={index}
                          fontWeight={600}
                          fontSize="14px"
                          whiteSpace="nowrap"
                        >
                          {Array.isArray(customer?.hospital)
                            ? customer.hospital[0]
                            : customer?.hospital ?? "-"}
                        </Typography>
                      </TableCell>

                      <TableCell align="center" sx={{ borderBottom: "none" }}>
                        <Chip
                          label={customer.category}
                          size="small"
                          sx={{
                            bgcolor: bg,
                            color: text,
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "none" }}>
                        <Typography variant="body2">
                          {customer.totalVisitsAchieved}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TopCustomerTable;
