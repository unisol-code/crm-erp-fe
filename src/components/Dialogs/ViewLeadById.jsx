import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLeadManagement from "../../hooks/leadmanagement/useLeadManagement";

const ViewEnviroLead = ({ onClose }) => {
  const navigate = useNavigate();
  const { leadId } = useParams(); // Extract leadId from the route parameters
  const [leadDetails, setLeadDetails] = useState(null);
  const { fetchLeadById, leadById } = useLeadManagement();

  useEffect(() => {
    if (leadId) {
      fetchLeadById(leadId);
    }
  }, [leadId, fetchLeadById]);

  useEffect(() => {
    if (leadById) {
      setLeadDetails(leadById);
    }
  }, [leadById]);

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
        zIndex: 9999,
        position: "fixed",
      }}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl m-4 max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          zIndex: 10000,
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            View Corporate Lead Details
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form className="grid grid-cols-3 gap-6">
            {/* Organization Information */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Organization Information
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Lead Name
              </label>
              <input
                type="text"
                value={leadDetails.customerName || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-gray-600 mb-2">
                Organization Name
              </label>
              {leadDetails.organizationName?.length > 0 ? (
                leadDetails.organizationName.map((name, index) => (
                  <input
                    key={index}
                    type="text"
                    value={name}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-50 mb-2"
                  />
                ))
              ) : (
                <input
                  type="text"
                  value="N/A"
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-50"
                />
              )}
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

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Total Calls
              </label>
              <input
                type="text"
                value={leadDetails.totalCalls || "N/A"}
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
                City
              </label>
              <input
                type="text"
                value={leadDetails.city || "N/A"}
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
                value={leadDetails.pincode || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div className="col-span-3">
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

            {/* Lead Details */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Lead Information
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Lead Generated Through
              </label>
              <input
                type="text"
                value={leadDetails.leadGenratedThrough?.join(", ") || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Product Promoted
              </label>
              <input
                type="text"
                value={leadDetails.productPromoted || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Target Department
              </label>
              <input
                type="text"
                value={leadDetails.targetDepartment || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            {/* Meeting Details */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Meeting Information
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Last Meeting
              </label>
              <input
                type="text"
                value={
                  new Date(leadDetails.lastMeeting).toLocaleDateString() ||
                  "N/A"
                }
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Next Meeting
              </label>
              {leadDetails.nextFollowUp &&
              leadDetails.nextFollowUp.length > 0 ? (
                leadDetails.nextFollowUp.map((followUp, index) => (
                  <div key={followUp._id || index} className="mb-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">
                        Follow Up Date
                      </label>
                      <input
                        type="text"
                        value={
                          new Date(followUp.date).toLocaleDateString() || "N/A"
                        }
                        readOnly
                        className="w-full border border-gray-300 rounded p-2 bg-gray-50"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-gray-600 text-sm mb-1">
                        Follow Up Time
                      </label>
                      <input
                        type="text"
                        value={followUp.time || "N/A"}
                        readOnly
                        className="w-full border border-gray-300 rounded p-2 bg-gray-50"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No follow-up details available.</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Sales Expected
              </label>
              <input
                type="text"
                value={
                  new Date(leadDetails.salesExpected).toLocaleDateString() ||
                  "N/A"
                }
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            {/* Discussion Details */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Discussion Details
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Call Objective
              </label>
              <input
                type="text"
                value={leadDetails.callObjective || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Next Call Objective
              </label>
              {leadDetails.nextCallObjective?.length > 0 ? (
                leadDetails.nextCallObjective.map((objective, index) => (
                  <input
                    key={index}
                    type="text"
                    value={objective}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-50 mb-2"
                  />
                ))
              ) : (
                <input
                  type="text"
                  value="N/A"
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-50"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Status
              </label>
              {leadDetails.status?.length > 0 ? (
                leadDetails.status.map((statusItem, index) => (
                  <input
                    key={index}
                    type="text"
                    value={statusItem}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-50 mb-2"
                  />
                ))
              ) : (
                <input
                  type="text"
                  value="N/A"
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-50"
                />
              )}
            </div>

            <div className="col-span-3">
              <label className="block font-semibold text-gray-600 mb-2">
                Discussion Points
              </label>
              {leadDetails.discussionPoint?.length > 0 ? (
                leadDetails.discussionPoint.map((point, index) => (
                  <input
                    key={index}
                    type="text"
                    value={point}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-50 mb-2"
                  />
                ))
              ) : (
                <input
                  type="text"
                  value="N/A"
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-50"
                />
              )}
            </div>

            <div className="col-span-3">
              <label className="block font-semibold text-gray-600 mb-2">
                Comments
              </label>
              {leadDetails.comments?.length > 0 ? (
                leadDetails.comments.map((comment, index) => (
                  <input
                    key={index}
                    type="text"
                    value={comment}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-50 mb-2"
                  />
                ))
              ) : (
                <input
                  type="text"
                  value="N/A"
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-50"
                />
              )}
            </div>

            <div className="col-span-3">
              <label className="block font-semibold text-gray-600 mb-2">
                Required Support
              </label>
              <input
                type="text"
                value={leadDetails.requiredSupport || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Have You Met Before
              </label>
              <input
                type="text"
                value={leadDetails.haveYouMeetBefore || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Date of Birth (DOB)
              </label>
              <input
                type="text"
                value={leadDetails.dob || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Category
              </label>
              <input
                type="text"
                value={leadDetails.category || "N/A"}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-600 mb-2">
                Department
              </label>
              <input
                type="text"
                value={leadDetails.department || "N/A"}
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
            {/* <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded transition-colors"
              onClick={() => handleEdit(leadDetails._id)}
            >
              Edit
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEnviroLead;
