import React, { useEffect, useState } from "react";
import useEnviroLeadManage from "../../../../../hooks/leadmanagement/useEnviroLeadManage";
import { FaEye, FaPen } from "react-icons/fa";
import Path from "../../../../../assets/images/Path.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@mui/material";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination";
import ViewEnviroLead from "../../../../../components/Dialogs/ViewEnviroLead";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { style } from "@mui/system";
import { HiTrash } from "react-icons/hi";
import { TiEye } from "react-icons/ti";

const EnviroViewLead = () => {
  const {
    fetchLeadByIdForEnviro,
    leadsForEnviroById,
    fetchLeadsForEnviro,
    leadsForEnviro,
  } = useEnviroLeadManage();
  console.log("leadforencire", leadsForEnviro);

  const [isEnviroViewDialogOpen, setIsEnviroViewDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const { theme } = useTheme();
  // old pagination------------------------
  // const [dataList,setDataList] = useState(leadsForEnviro.slice(0,5))
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // useEffect(()=>{
  //   setDataList(leadsForEnviro.slice(page*(pageNumber-1),page*pageNumber))
  // },[page,pageNumber])
  // --------------------------------------

  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  const handleViewLead = (leadId) => {
    setSelectedLeadId(leadId);
    setIsEnviroViewDialogOpen(true);
  };

  useEffect(() => {
    if (selectedLeadId) {
      fetchLeadByIdForEnviro(selectedLeadId); // Fetch data only when a lead ID is selected
    }
  }, [selectedLeadId]);

  //console.log("EnviroById: ", leadsForEnviroById(id));
  useEffect(() => {
    fetchLeadsForEnviro(page, limit);
  }, [page, limit]);

  console.log("Leads details: ", leadsForEnviro);

  return (
    <div className="p-4 w-full min-h-screen">
      <BreadCrumb
        linkText={[{ text: "Lead Management" }, { text: "View Lead" }]}
      />
      <div className="p-3 bg-white rounded-2xl">
        <div className="flex justify-between gap-4 flex-wrap items-center ">
          <h1 className="text-2xl font-bold text-black">View Lead List</h1>
        </div>
        <hr
          className="h-1 border-0 mb-3 mt-3"
          style={{ backgroundColor: theme.secondaryColor }}
        />
        <div className="shadow overflow-x-auto rounded-t-2xl ">
          <table className="min-w-full text-sm text-left text-black table-auto">
            <thead
              className="sticky top-0 z-10 uppercase bg-gray-100 border-b border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr className="text-center">
                <th className="p-4 ">Sr. No.</th>
                <th className="p-4 ">Name</th>
                <th className="p-4 ">Product Name</th>
                <th className="p-4 ">Customer Type</th>
                <th className="p-4 ">Lead Generated Through</th>
                <th className="p-4 ">Status</th>
                <th className="p-4 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {leadsForEnviro?.data?.map((lead, index) => (
                <tr key={lead._id} className="text-center">
                  <td className="px-4 py-2 ">{index + 1}</td>
                  <td className="px-4 py-2  whitespace-pre-wrap">
                    {`${lead.firstName} ${lead.lastName}` || "-"}
                  </td>

                  <td className="px-4 py-2">{lead.productName || "-"}</td>

                  <td className="px-4 py-2 ">{lead.customerType || "-"}</td>
                  <td className="px-4 py-2 ">
                    {lead.leadGeneratedThrough || "-"}
                  </td>
                  <td className="px-4 py-2 ">{lead.status || "-"}</td>
                  <td className="px-4 py-2 ">
                    <td className="px-4 py-4 flex items-center justify-center gap-2">
                      <div className="flex justify-center pl-3">
                        <button
                          onClick={() => handleViewLead(lead._id)}
                          className=" hover:bg-blue-100  rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          <TiEye size={18} color={theme.primaryColor} />
                        </button>
                      </div>
                      <div className="flex justify-center pl-3">
                        <button
                          // onClick={() => handleDelete(lead)}
                          className=" hover:bg-blue-100  rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          <HiTrash size={18} color={theme.primaryColor} />
                        </button>
                      </div>
                    </td>
                  </td>
                </tr>
              ))}

              {leadsForEnviro?.data?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isEnviroViewDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
                onClick={() => setIsEnviroViewDialogOpen(false)}
              >
                &times;
              </button>
              <ViewEnviroLead
                leadId={selectedLeadId}
                onClose={() => setIsEnviroViewDialogOpen(false)}
              />
            </div>
          </div>
        )}
        <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          <Pagination
            currentPage={leadsForEnviro?.pagination?.currentPage}
            totalItems={leadsForEnviro?.pagination?.totalCount}
            totalPages={leadsForEnviro?.pagination?.totalPages}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EnviroViewLead;
