import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEnviroLeadManage from "../../hooks/leadmanagement/useEnviroLeadManage";

const ViewEnviroLead = ({ onClose }) => {
  const navigate = useNavigate();
  const { leadId } = useParams(); // Extract leadId from the route parameters
  const [leadDetails, setLeadDetails] = useState(null);
  const { fetchLeadByIdForEnviro, leadsForEnviroById } = useEnviroLeadManage();

  useEffect(() => {
    if (leadId) {
      fetchLeadByIdForEnviro(leadId);
    }
  }, [leadId, fetchLeadByIdForEnviro]);

  useEffect(() => {
    if (leadsForEnviroById) {
      setLeadDetails(leadsForEnviroById);
    }
  }, [leadsForEnviroById]);

  if (!leadDetails) {
    return <div>Loading lead details...</div>;
  }

  const handleEdit = (id) => {
    navigate(`/lead/edit-lead/${id}`);
  };

  return (
    <div
      className="fixed h-full w-screen inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      style={{
        zIndex: 9999, // Ensure a very high z-index
        position: "fixed", // Fixed ensures it stays above all scrollable/sticky contexts
      }}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl m-4 max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          zIndex: 10000, // Higher z-index for modal content
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            View Enviro Lead Details
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form className="grid grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Personal Information
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={leadDetails.firstName || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={leadDetails.lastName || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={leadDetails.email || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Contact
              </label>
              <input
                type="text"
                value={leadDetails.contact || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                value={leadDetails.panNo || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Lead Owner
              </label>
              <input
                type="text"
                value={leadDetails.leadOwner || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            {/* Location Information */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Location Details
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Village Name
              </label>
              <input
                type="text"
                value={leadDetails.villageName || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                District
              </label>
              <input
                type="text"
                value={leadDetails.district || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                State
              </label>
              <input
                type="text"
                value={leadDetails.state || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Pin Code
              </label>
              <input
                type="text"
                value={leadDetails.pinCode || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-gray-600 mb-2">
                Address
              </label>
              <input
                type="text"
                value={leadDetails.address || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            {/* Property & Business Details */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Property & Business Details
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Total Land Owned
              </label>
              <input
                type="text"
                value={leadDetails.totalLandOwned || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={leadDetails.productName || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={leadDetails.bankName || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            {/* Crop Information */}
            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Crop Name
              </label>
              <input
                type="text"
                value={leadDetails.cropName || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Crop Type
              </label>
              <input
                type="text"
                value={leadDetails.cropType || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Customer Type
              </label>
              <input
                type="text"
                value={leadDetails.customerType || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            {/* Additional Details */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Additional Details
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Existing Loan
              </label>
              <input
                type="text"
                value={leadDetails.existingLoan || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Payment Mode
              </label>
              <input
                type="text"
                value={leadDetails.paymentMode || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Purpose For Buying
              </label>
              <input
                type="text"
                value={leadDetails.purposeForBuying || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Last Meeting
              </label>
              <input
                type="text"
                value={leadDetails.lastMeeting || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Next Meeting
              </label>
              <input
                type="text"
                value={leadDetails.nextMeeting?.[0] || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Tentative Buying Date
              </label>
              <input
                type="text"
                value={leadDetails.tentativeBuyingDate || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Spraying Duration
              </label>
              <input
                type="text"
                value={leadDetails.sprayingDuration || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Spraying Type
              </label>
              <input
                type="text"
                value={leadDetails.sprayingType || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Status
              </label>
              <input
                type="text"
                value={leadDetails.status?.[0] || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
          <div className="flex justify-end gap-2">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded transition-colors"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded transition-colors"
              onClick={() => handleEdit(leadDetails._id)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEnviroLead;
