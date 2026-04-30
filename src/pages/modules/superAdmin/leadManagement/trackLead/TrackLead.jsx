import React, { useEffect, useState } from "react";
import { TiEye } from "react-icons/ti";
import ViewLeadById from "../../../../../components/Dialogs/ViewLeadById";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import { useNavigate } from "react-router-dom";
import useLeadManagement from "../../../../../hooks/leadmanagement/useLeadManagement";
import { useTheme } from "../../../../../hooks/theme/useTheme";

const columns = [
  "Lead Name",
  "Organization Name",
  "Last Meeting",
  "Next Meeting",
  "Action",
  "Lead Owner",
];

const TrackLead = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLeadViewDialogOpen, setIsLeadViewDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const { fetchLeadManagement, leadManagement, loading, fetchLeadById } =
    useLeadManagement();

  useEffect(() => {
    fetchLeadManagement(page, limit);
  }, [page, limit]);

  useEffect(() => {
    if (selectedLeadId) fetchLeadById(selectedLeadId);
  }, [selectedLeadId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [y, m, d] = dateString.split("T")[0].split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[{ text: "Lead Management" }, { text: "Manage Lead" }]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Manage Lead List
        </h1>

        <hr
          className="h-1 border-0 mb-3"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* Table */}
        <div className="shadow overflow-x-auto rounded-t-2xl">
          <table className="min-w-full text-sm text-black table-auto">
            <thead
              className="sticky top-0 z-10 uppercase border-b"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr className="text-center">
                {columns.map((col) => (
                  <th key={col} className="p-4 font-bold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="py-4 flex justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : leadManagement?.leads?.length > 0 ? (
                leadManagement.leads.map((row, index) => (
                  <tr
                    key={row._id}
                    className="text-center border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 text-center">
                      {`${row.firstName ?? ""} ${row.lastName ?? ""}`}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {row.organizationName}
                    </td>

                    <td className="px-4 py-2">
                      {row.lastMeetingDate
                        ? `${formatDate(row.lastMeetingDate)} ${row.lastMeetingTime ?? ""}`
                        : "N/A"}
                    </td>

                    <td className="px-4 py-2">
                      {row.nextMeetingDate
                        ? `${formatDate(row.nextMeetingDate)} ${row.nextMeetingTime ?? ""}`
                        : "N/A"}
                    </td>

                    <td className="px-4 py-2">
                      <button
                        onClick={() => navigate(`/preview-lead/${row._id}`)}
                        className="hover:bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      >
                        <TiEye size={18} color={theme.primaryColor} />
                      </button>
                    </td>

                    <td className="px-4 py-2 text-center">
                      {row.leadOwner || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="py-6 text-center text-lg font-semibold">
                      No Data Found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          <Pagination
            currentPage={leadManagement?.page}
            totalPages={leadManagement?.totalPages}
            totalItems={leadManagement?.total}
            itemsPerPage={limit}
            onPageChange={setPage}
            onItemsPerPageChange={setLimit}
          />
        </div>
      </div>

      {/* View Lead Dialog */}
      {isLeadViewDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <button
              className="absolute top-4 right-4 text-xl hover:text-black"
              onClick={() => setIsLeadViewDialogOpen(false)}
            >
              &times;
            </button>
            <ViewLeadById
              leadId={selectedLeadId}
              onClose={() => setIsLeadViewDialogOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackLead;
