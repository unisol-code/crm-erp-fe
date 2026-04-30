import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  // Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import useDashboard from "../../../../../hooks/salesExecutiveHook/dashboard/useDashboard";
import Button from "../../../../../components/uiComponents/button/Button";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import Select from "react-select";

export const VisitTarget = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { fetchPriorDoctors, loading, priorDoctors } = useDashboard();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchPriorDoctors(page, limit);
  }, [page, limit]);

  const handleView = (id) => {
    navigate(`/sales-executive/viewdoctor/${id}`);
  };

  return (
    <Card
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: 5,
        overflowX: { xs: "auto", sm: "hidden" },
      }}
    >
      <CardHeader
        sx={{
          backgroundColor: theme.secondaryColor,
          px: { xs: 2, sm: 3 },
        }}
        title={
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            High Priority Doctors List
          </Typography>
        }
        action={
          <Box
            display="flex"
            pt={1}
            sx={{
              mr: {
                xs: 1,
                sm: 2,
                md: 2,
                lg: 4,
                xl: 3,
              },
            }}
          >
            <Button
              text="See All"
              variant={1}
              onClick={() =>
                navigate("/sales-executive/viewhighprioritydoctor")
              }
            />
          </Box>
        }
      />
      <CardContent
        sx={{
          paddingTop: 0,
          px: { xs: 1, sm: 2 },
        }}
      >
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
            size="small"
            stickyHeader
            sx={{
              minWidth: { xs: 500, sm: 600, md: 700 },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  }}
                >
                  Sr No.
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  }}
                >
                  Doctor Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  }}
                >
                  Hospital
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "pre-line",
                    lineHeight: 1,
                    fontSize: { xs: "0.7rem", sm: "0.85rem" },
                  }}
                >
                  {/* {"TotalNoOf \n PatientAdmission \n PerDay"} */}
                  Visit Target
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "pre-line",
                    lineHeight: 1,
                    fontSize: { xs: "0.7rem", sm: "0.85rem" },
                  }}
                >
                  {/* {"TotalNoOf \n PatientExamin \n PerDay"} */}
                  Visit Achievement
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box py={2}>
                      <CircularProgress size={24} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : priorDoctors?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box py={2}>
                      <Typography variant="body2" color="text.secondary">
                        No data available.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                priorDoctors?.data?.map((doctor, index) => (
                  <TableRow hover key={index}>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        py: 2.5,
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Typography
                        fontWeight={600}
                        fontSize={{ xs: "0.7rem", sm: "0.85rem" }}
                        maxWidth={{ xs: "80px", sm: "100px" }}
                      >
                        {doctor.doctorName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Box display="flex">
                        <Typography
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.85rem" },
                            maxWidth: { xs: "80px", sm: "100px" },
                          }}
                        >
                          {doctor.hospital}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Box display="flex" alignItems="center">
                        <Typography
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.85rem" } }}
                        >
                          {doctor.category}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        borderBottom: "none",
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {doctor.visitTarget}
                    </TableCell>
                    <TableCell
                      align="start"
                      sx={{
                        borderBottom: "none",
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                      }}
                    >
                      {doctor.visitAchievement}
                    </TableCell>
                    <TableCell align="start" sx={{ borderBottom: "none" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(doctor._id)}
                      >
                        <Visibility
                          fontSize="small"
                          sx={{ color: theme.primaryColor }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default VisitTarget;
