import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ViewIcon } from "../../../../../assets/CommonAssets";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDashboard from "../../../../../hooks/salesExecutiveHook/dashboard/useDashboard";

function ViewHighPriorityDoct() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { fetchPriorDoctors, loading, priorDoctors } = useDashboard();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
  };
  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  useEffect(() => {
    fetchPriorDoctors(page, limit);
  }, [page, limit]);

  const handleView = (id) => {
    console.log("id", id);
    navigate(`/sales-executive/viewdoctor/${id}`);
  };

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Dashboard", href: "/sales-executive/dashboard" },
          { text: "High Priority Doctors List" },
        ]}
      />
      <Card
        elevation={3}
        sx={{
          width: "100%",
          borderRadius: 5,
          py: 2,
          px: 3,
        }}
      >
        <CardHeader
          sx={{
            borderBottom: "4px solid",
            borderColor: theme.secondaryColor,
            py: 1,
            px: 0,
          }}
          title={
            <Typography color="black" fontWeight={600} fontSize={"24px"}>
              High Priority Doctors List
            </Typography>
          }
        />
        <CardContent sx={{ px: 0 }}>
          <TableContainer
            sx={{
              borderRadius: 5,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: theme.secondaryColor }}>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "center",
                      paddingX: 0,
                    }}
                  >
                    Sr.No
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Doctor Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Category
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Hospital
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    {/* {"TotalNoOfPatientAdmission \n PerDay"} */}
                    Visit Target
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    {/* {"TotalNoOfPatientExamin \n PerDay"} */}
                    Visit Achievement
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    View
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
                  priorDoctors?.data?.map((data, index) => (
                    <TableRow hover key={data?._id}>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          textAlign: "center",
                          paddingX: 0,
                        }}
                      >
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        {data.doctorName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        {data.category}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        {data.hospital}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        {data.visitTarget}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        {data.visitAchievement}
                      </TableCell>

                      <TableCell sx={{ py: 0, textAlign: "center" }}>
                        <IconButton onClick={() => handleView(data._id)}>
                          <ViewIcon color={theme.primaryColor} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingY: 2,
            }}
          >
            <Pagination
              currentPage={priorDoctors?.page}
              totalItems={priorDoctors?.total}
              totalPages={priorDoctors?.totalPages}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewHighPriorityDoct;
