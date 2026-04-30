import { useParams, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/uiComponents/button/Button";
import useLeadManagement from "../../../../../hooks/leadmanagement/useLeadManagement.js";
import { useEffect } from "react";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
const PreviewLead = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const { leadById, fetchLeadById, loading } = useLeadManagement();
  const { theme } = useTheme();

  useEffect(() => {
    fetchLeadById(Id);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}|${month}|${year}`;
  };

  const leadData = {
    firstName: leadById?.firstName,
    lastName: leadById?.lastName,
    address: leadById?.address,
    city: leadById?.city,
    area: leadById?.area,
    pincode: leadById?.pincode,
    productPromoted: leadById?.productPromoted,
    callObjective: leadById?.callObjective,
    nextCallObjective: leadById?.nextCallObjective,
    targetedDepartment: leadById?.targetedDepartment,
    discussionPoint: leadById?.discussionPoint,
    lastMeetingDate: formatDate(leadById?.lastMeetingDate),
    lastMeetingTime: leadById?.lastMeetingTime,
    nextFollowUp: leadById?.nextFollowUp,
    nextMeetingDate: formatDate(leadById?.nextMeetingDate),
    nextMeetingTime: leadById?.nextMeetingTime,
    requiredSupport: leadById?.requiredSupport,
    comments: leadById?.comments,
    salesExpected: leadById?.salesExpected,
    status: leadById?.status,
    leadOwner: leadById?.leadOwner,
    // category: leadById?.category,
    leadGeneratedThrough: leadById?.leadGeneratedThrough,
    organizationName: leadById?.organizationName,
    totalCalls: leadById?.totalCalls,
    salestatus: leadById?.salestatus,
  };

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumbs */}
      <BreadCrumb
        linkText={[
          { text: "Lead Management" },
          { text: "Lead List", href: "/lead/view-lead" },
          { text: "View Lead" },
        ]}
      />
      <div className="w-full shadow-md rounded-xl">
        <div className="mt-3 bg-white rounded-lg shadow-md w-4xl">
          <div>
            <h2
              className="p-6 mb-3 flex items-center justify-center font-semibold text-xl text-black rounded-t-lg"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              View Lead
            </h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <LoaderSpinner />
            </div>
          ) : (
            <div className="p-6 pt-0">
              <div className="grid grid-cols-3 gap-5">
                <p>
                  <strong>First Name:</strong> <br />
                  <span>{leadData.firstName}</span>
                </p>
                <p>
                  <strong>Last Name:</strong> <br />
                  <span>{leadData.lastName}</span>
                </p>
                <p>
                  <strong>Organization Name:</strong>
                  <br />
                  <span>{leadData.organizationName}</span>
                </p>
                {/* <p>
                  <strong>Sale status:</strong>
                  <br />
                  <span>{leadData.salestatus}</span>
                </p> */}
                {/* <p>
                  <strong>Sale status:</strong>
                  <br />
                  <span className="flex gap-2 flex-wrap">
                    {String(leadData.salestatus || "")
                      .split(/(?=[A-Z])|(?=\s)|(?=,)/) // split safely
                      .map((s, i) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-1 text-sm bg-blue-200 text-blue-800 rounded"
                        >
                          {s}
                        </span>
                      ))}
                  </span>
                </p> */}
                <p>
                  <strong>Sale status:</strong>
                  <br />
                  <span>{String(leadData.salestatus || "").replaceAll("", "").trim()}</span>
                </p>

                <p>
                  <strong>Address:</strong> <br />
                  <span>{leadData.address}</span>
                </p>
                <p>
                  <strong>City:</strong> <br />
                  <span>{leadData.city}</span>
                </p>
                <p>
                  <strong>Pincode:</strong> <br />
                  <span>{leadData.pincode}</span>
                </p>
                <p>
                  <strong>Product Promoted:</strong> <br />
                  <span>{leadData.productPromoted}</span>
                </p>
                <p>
                  <strong>Call Objective:</strong> <br />
                  <span>{leadData.callObjective}</span>
                </p>
                <p>
                  <strong>Next Call Objective:</strong> <br />
                  <span>{leadData.nextCallObjective}</span>
                </p>
                <p>
                  <strong>Targeted Department:</strong> <br />
                  <span>{leadData.targetedDepartment}</span>
                </p>
                <p>
                  <strong>Discussion Point:</strong> <br />
                  <span>{leadData.discussionPoint}</span>
                </p>
                <p>
                  <strong>Last Meeting Date:</strong> <br />
                  <span>{leadData.lastMeetingDate}</span>
                </p>
                <p>
                  <strong>Last Meeting Time:</strong> <br />
                  <span>{leadData.lastMeetingTime}</span>
                </p>
                <p>
                  <strong>Next Meeting Date:</strong> <br />
                  <span>{leadData.nextMeetingDate}</span>
                </p>
                <p>
                  <strong>Next Meeting Time:</strong> <br />
                  <span>{leadData.nextMeetingTime}</span>
                </p>
                <p>
                  <strong>Next Follow Up:</strong> <br />
                  <span>{leadData.nextFollowUp}</span>
                </p>
                <p>
                  <strong>Required Support:</strong> <br />
                  <span>{leadData.requiredSupport}</span>
                </p>
                <p>
                  <strong>Comments:</strong> <br />
                  <span>{leadData.comments}</span>
                </p>
                <p>
                  <strong>Sales Expected:</strong> <br />
                  <span>{leadData.salesExpected}</span>
                </p>
                <p>
                  <strong>Status:</strong> <br />
                  <span>{leadData.status}</span>
                </p>
                <p>
                  <strong>Lead Owner:</strong> <br />
                  <span>{leadData.leadOwner}</span>
                </p>
                {/* <p>
                <strong>Category:</strong> <br />
                <span>{leadData.category}</span>
              </p> */}
                {/* <p>
                  <strong>Total Calls:</strong> <br />
                  <span>{leadData.totalCalls}</span>
                </p> */}
              </div>

              <div className="mt-6">
                <p>
                  <strong>Lead Generated Through:</strong>
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(leadData.leadGeneratedThrough) ? (
                    leadData.leadGeneratedThrough.map((item, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-200 rounded"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-200 rounded">
                      {leadData.leadGeneratedThrough}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  onClick={() => navigate(`/lead/createlead/${leadById._id}`)}
                  text="Edit"
                  icon={<FaEdit size={16} />}
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewLead;
