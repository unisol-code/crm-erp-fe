import React, { useEffect, useState } from "react";
import { TiEye } from "react-icons/ti";
import { HiTrash } from "react-icons/hi";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination.jsx";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useLeadManagement from "../../../../../hooks/leadmanagement/useLeadManagement.js";
import { useNavigate } from "react-router-dom";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

const badgeColors = {
  HOT: "bg-red-100 text-red-600",
  WARM: "bg-yellow-100 text-yellow-600",
  COLD: "bg-blue-100 text-blue-600",
};

const LeadList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { theme } = useTheme();
  let navigate = useNavigate();
  const { fetchLeadManagement, leadManagement, deleteLead, loading } =
    useLeadManagement();

  useEffect(() => {
    fetchLeadManagement(page, limit);
  }, []);

  console.log("get lead data:", leadManagement);
  const allLeads = leadManagement?.leads || [];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const onPageChange = (data) => {
    setPage(data);
    fetchLeadManagement(data, limit);
  };
  const onItemsPerPageChange = (data) => {
    setLimit(data);
    fetchLeadManagement(page, data);
  };

  const getBadgeColor = (category) =>
    badgeColors[category?.toUpperCase()] || "bg-gray-100 text-gray-600";

  const handleDelete = (lead) => {
    let id = lead._id;
    deleteLead(id);
  };


  return (
    <div className=" w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Lead Management", },
          { text: "View Lead" },
        ]}
      />
      <div className="p-4 bg-white rounded-2xl">
        {/* Header Section */}
        <div className="flex justify-between gap-4 flex-wrap items-center ">
          <h1 className="text-2xl font-bold text-gray-800">View Lead List</h1>
        </div>
        <hr
          className="h-1 border-0 mb-3 mt-3"
          style={{ backgroundColor: theme.secondaryColor }}
        />
        {/* Table */}
        <div className="shadow overflow-x-auto rounded-t-2xl ">
          <table className="min-w-full text-sm text-left text-black table-auto">
            <thead
              className="sticky top-0 z-10 uppercase bg-gray-100 border-b border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr className="text-center">
                <th className="p-4 ">Sr. No.</th>
                <th className="p-4 ">Organization Name</th>
                <th className="p-4 ">Last Meeting</th>
                <th className="p-4 ">Next Meeting</th>
                <th className="p-4 ">Status</th>
                <th className="p-4 ">Sales Expected</th>
                <th className="p-4 ">Action</th>
              </tr>
            </thead>
            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="bg-white w-full py-4 flex justify-center items-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : (allLeads?.length > 0 ? (
                allLeads?.map((lead, index) => (
                  <tr key={lead._id} className="text-center">
                    <td className="px-4 py-2 ">{index + 1}</td>
                    <td className="px-4 py-2  whitespace-pre-wrap">
                      {lead.organizationName}
                    </td>

                    <td className="px-4 py-2">
                      {formatDate(lead.lastMeetingDate)}
                      <br />
                      {lead.lastMeetingTime}
                    </td>

                    <td className="px-4 py-2 ">
                      {formatDate(lead.nextMeetingDate)} <br />
                      {lead.nextMeetingTime}
                    </td>
                    <td className="px-4 py-2 ">{lead.status}</td>
                    <td className="px-4 py-2 ">{lead.salesExpected}</td>
                    <td className="px-4 py-2 ">
                      <td className="px-4 py-4 flex items-center justify-center gap-2">
                        <div className="flex justify-center pl-3">
                          <button
                            onClick={() => navigate(`/preview-lead/${lead._id}`)}
                            className=" hover:bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            <TiEye size={18} color={theme.primaryColor} />
                          </button>
                        </div>
                        <div className="flex justify-center pl-3">
                          <button
                            onClick={() => handleDelete(lead)}
                            className=" hover:bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            <HiTrash size={18} color={theme.primaryColor} />
                          </button>
                        </div>
                      </td>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="bg-white w-full py-4 flex justify-center items-center text-lg font-semibold">No Data Found.</div>
                  </td>
                </tr>
              )
              )}

              {/* {allLeads?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          <Pagination
            currentPage={leadManagement?.page}
            totalPages={leadManagement?.totalPages}
            totalItems={leadManagement?.total}
            itemsPerPage={leadManagement?.limit}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadList;
