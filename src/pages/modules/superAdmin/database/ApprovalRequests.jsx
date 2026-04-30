import {
  Box,
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
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TableHeader } from "../../../../components/uiComponents/DatabaseSharedComponents";
import useDatabase from "../../../../hooks/database/useDatabase";
import Pagination from "../../../../components/uiComponents/pagination/Pagination";

const ApprovalRequests = () => {
  const { fetchAllRequest, editRequests, individualData } = useDatabase();
  const { theme } = useTheme();
  const navigate = useNavigate();

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
    fetchAllRequest(page, limit);
  }, [page, limit]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <TableHeader title="Employees request" theme={theme} />
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.secondaryColor,
                "& th": {
                  textAlign: "center",
                  verticalAlign: "middle",
                  fontSize: "1rem",
                  fontWeight: 600,
                },
              }}
            >
              <TableCell sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}>
                Sr.No
              </TableCell>
              <TableCell sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}>
                Employee Name
              </TableCell>
              <TableCell sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}>
                Department
              </TableCell>
              <TableCell sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}>
                Individual Pending Requests
              </TableCell>
              <TableCell sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}>
                Orgnizational Pending Requests
              </TableCell>
              <TableCell sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {editRequests?.groups?.length > 0 ? (
              editRequests.groups.map((item, index) => (
                <TableRow
                  key={item?.user?._id}
                  sx={{
                    "& td": {
                      textAlign: "center",
                      verticalAlign: "middle",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.user?.fullName}</TableCell>
                  <TableCell>
                    {[
                      ...new Set(item?.requests?.map((r) => r.targetModel)),
                    ].join(", ")}
                  </TableCell>
                  <TableCell>{item.individualCount}</TableCell>
                  <TableCell>{item.organizationCount}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        navigate(
                          `/database/approvalrequest/viewrequests/${item?.user?._id}`
                        )
                      }
                    >
                      <Eye style={{ color: theme.primaryColor }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography fontWeight={600} color="text.secondary">
                    No Data Found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          currentPage={editRequests?.pagination?.currentPage}
          totalItems={editRequests?.pagination?.totalGroups}
          totalPages={editRequests?.pagination?.totalPages}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </TableContainer>
    </Box>
  );
};

export default ApprovalRequests;
