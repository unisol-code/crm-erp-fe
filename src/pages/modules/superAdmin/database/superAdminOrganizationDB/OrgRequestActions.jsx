import React, { useEffect } from "react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { Box, Typography } from "@mui/material";
import Button from "../../../../../components/uiComponents/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import useDatabase from "../../../../../hooks/database/useDatabase";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

const Item = ({ label, value }) => {
  let displayValue = value;

  if (Array.isArray(value)) {
    displayValue = value.length > 0 ? value.join(", ") : "N/A";
  } else if (typeof value === "boolean") {
    displayValue = value ? "Yes" : "No";
  } else if (typeof value === "object" && value !== null) {
    if ("answers" in value) {
      displayValue = `${value.answers ? "Yes" : "No"}${value.briefAnswer ? ` - ${value.briefAnswer}` : ""
        }`;
    } else if ("frequency" in value) {
      displayValue = `${value.answers ? "Yes" : "No"}${value.frequency ? ` - ${value.frequency}` : ""
        }`;
    } else if ("type" in value) {
      displayValue = `${value.answers ? "Yes" : "No"}${value.type ? ` - ${value.type}` : ""
        }`;
    } else {
      // For objects like SWQ8 (wet/dry/etc)
      displayValue = Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }
  }

  return (
    <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-gray-800 mt-1 font-medium break-words">
        {displayValue ?? "-"}
      </p>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <h2 className="text-xl font-bold mb-6 text-primary border-b-2 border-primary/10 pb-2 flex items-center gap-2">
    <span className="w-2 h-6 bg-primary rounded-full"></span>
    {title}
  </h2>
);

const ConcernPersonsTable = ({ persons }) => {
  if (!persons || persons.length === 0) return null;
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">
              Contact
            </th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">
              Designation
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {persons.map((p, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-sm text-gray-700">{p.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{p.contact}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {p.designation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OrgRequestActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, employeeEditRequest, editRequestsDetails, requestAction } =
    useDatabase();

  useEffect(() => {
    employeeEditRequest(id);
  }, []);

  const handleBack = () => {
    navigate(`/database/approvalrequest/viewrequests/${editRequestsDetails?.requestedBy?._id}`);
  };

  const handleRequestAction = async (action) => {
    const userId = editRequestsDetails?.requestedBy?._id;
    const data = {
      action: action,
    };
    const isSuccess = await requestAction(id, data, userId);
    if (isSuccess) {
      handleBack();
    }
  };

  const target = editRequestsDetails?.targetDetails;

  return (
    <div className="w-full">
      <BreadCrumb
        linkText={[
          { text: "Database", href: "/database" },
          { text: "Approval Requests ", href: "/database" },
          {
            text: "View Orgnizational Requests",
            onClick: handleBack,
          },
          { text: "View Requests" },
        ]}
      />

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <LoaderSpinner />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">
                {target?.Basic?.hospitalName || "Organization Details"}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {editRequestsDetails?.requestedBy?.fullName?.charAt(0)}
                </span>
                <span className="font-bold text-gray-700">Requested By:</span>
                <span className="text-primary hover:underline cursor-default">
                  {editRequestsDetails?.requestedBy?.fullName}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400 text-sm">{editRequestsDetails?.requestedBy?.email}</span>
              </p>

            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Status</span>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${editRequestsDetails?.status === "Pending"
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : editRequestsDetails?.status === "Approved"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-rose-100 text-rose-700 border border-rose-200"
                    }`}
                >
                  {editRequestsDetails?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Basic Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Item label="Segment" value={target?.Basic?.segment} />
              <Item label="Hospital Name" value={target?.Basic?.hospitalName} />
              <Item label="Type of Hospital" value={target?.Basic?.typeOfHospital} />
              <Item label="Org/Hospital Type" value={target?.Basic?.typeOfOrgOrHospital} />
              <Item label="Govt Type" value={target?.Basic?.ifGovt} />
              <Item label="Email" value={target?.Basic?.emailAddress} />
              <Item label="State" value={target?.Basic?.state} />
              <Item label="District" value={target?.Basic?.district} />
              <Item label="City" value={target?.Basic?.city} />
              <Item label="Region" value={target?.Basic?.region} />
              <Item label="Address" value={target?.Basic?.address} />
              <Item label="Sales Person" value={target?.salesPersonName} />
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                <Item label="Any Other Information" value={target?.anyOtherInformation} />
              </div>
            </div>
          </div>

          {/* Hospital Data */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Hospital Capacity & Specialities" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Item label="Total Beds" value={target?.hospitalData?.totalBeds} />
              <Item label="Total ICU Beds" value={target?.hospitalData?.totalICUBeds} />
              <Item label="Total Operation Theaters" value={target?.hospitalData?.totalOT} />
            </div>

            {target?.hospitalData?.specialities?.length > 0 && (
              <div className="space-y-6">
                {target.hospitalData.specialities.map((spec, index) => (
                  <div key={index} className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-800 text-lg">{spec.name}</h4>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                        Yearly Surgeries: {spec.totalSurgeriesCalenderYear}
                      </div>
                    </div>
                    {spec.surgeries?.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {spec.surgeries.map((surg, sIndex) => (
                          <div key={sIndex} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                            <span className="text-gray-500 text-sm">{surg.surgeryType}</span>
                            <span className="font-black text-gray-900">{surg.numberOfSurgeries}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Waste Management Types */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Waste Management Coverage" />
            <div className="flex flex-wrap gap-2">
              {target?.wasteManagement?.types?.map((type, i) => (
                <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold capitalize border border-indigo-100">
                  {type} Waste
                </span>
              ))}
              {(!target?.wasteManagement?.types || target?.wasteManagement?.types.length === 0) && (
                <p className="text-gray-400 italic">No specific waste management types listed.</p>
              )}
            </div>
          </div>

          {/* Bio-Medical Waste */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Bio-Medical Waste Management" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Item label="Year of Installation" value={target?.bioMedicalWaste?.yearOfInstallationOrOutsideContact} />
              <Item label="BMWQ1A" value={target?.bioMedicalWaste?.BMWQ1A} />
              <Item label="BMWQ1B" value={target?.bioMedicalWaste?.BMWQ1B} />
              <Item label="BMWQ2" value={target?.bioMedicalWaste?.BMWQ2} />
              <Item label="BMWQ3" value={target?.bioMedicalWaste?.BMWQ3} />
              <Item label="BMWQ4" value={target?.bioMedicalWaste?.BMWQ4} />
              <Item label="BMWQ5" value={target?.bioMedicalWaste?.BMWQ5} />
              <Item label="BMWQ6" value={target?.bioMedicalWaste?.BMWQ6} />
              <Item label="BMWQ7" value={target?.bioMedicalWaste?.BMWQ7} />
              <Item label="BMWQ8" value={target?.bioMedicalWaste?.BMWQ8} />
              <Item label="BMWQ9" value={target?.bioMedicalWaste?.BMWQ9} />
              <Item label="BMWQ10" value={target?.bioMedicalWaste?.BMWQ10} />
              <Item label="BMWQ11" value={target?.bioMedicalWaste?.BMWQ11} />
              <Item label="BMWQ12" value={target?.bioMedicalWaste?.BMWQ12} />
              <Item label="BMWQ13" value={target?.bioMedicalWaste?.BMWQ13} />
              <Item label="BMWQ14" value={target?.bioMedicalWaste?.BMWQ14} />
              <Item label="BMWQ15" value={target?.bioMedicalWaste?.BMWQ15} />
              <Item label="BMWQ16" value={target?.bioMedicalWaste?.BMWQ16} />
              <Item label="BMWQ17" value={target?.bioMedicalWaste?.BMWQ17} />
              <Item label="BMWQ18" value={target?.bioMedicalWaste?.BMWQ18} />
              <Item label="BMWQ19" value={target?.bioMedicalWaste?.BMWQ19} />
              <Item label="BMWQ20" value={target?.bioMedicalWaste?.BMWQ20} />
            </div>
            <ConcernPersonsTable persons={target?.bioMedicalWaste?.concernPersons} />
          </div>

          {/* Solid Waste */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Solid Waste Management" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Item label="Waste Per Day (TPD)" value={target?.solidWaste?.SWQ1} />
              <Item label="Waste Composition" value={target?.solidWaste?.SWQ8} />
              <Item label="Source Segregation" value={target?.solidWaste?.SWQ9} />
              <Item label="Mandated Segregation" value={target?.solidWaste?.SWQ10} />
              <Item label="Collection Method" value={target?.solidWaste?.SWQ11} />
              <Item label="Frequency" value={target?.solidWaste?.SWQ12} />
              <Item label="Vehicles" value={target?.solidWaste?.SWQ13} />
              <Item label="Vehicles Other" value={target?.solidWaste?.SWQ13_OTHER} />
              <Item label="Processing Facilities" value={target?.solidWaste?.SWQ14} />
              <Item label="Capacity (TPD)" value={target?.solidWaste?.SWQ15} />
              <Item label="% Processed" value={target?.solidWaste?.SWQ16} />
              <Item label="Home Composting" value={target?.solidWaste?.SWQ29} />
              <Item label="Dry Waste Handling" value={target?.solidWaste?.SWQ30} />
              <Item label="Final Disposal" value={target?.solidWaste?.SWQ31} />
              <Item label="Final Disposal Other" value={target?.solidWaste?.SWQ31_OTHER} />
              <Item label="Landfill Compliant" value={target?.solidWaste?.SWQ32} />
              <Item label="Leachate Management" value={target?.solidWaste?.SWQ33} />
              <Item label="Gas Collection" value={target?.solidWaste?.SWQ34} />
              <Item label="Remediation Initiated" value={target?.solidWaste?.SWQ35} />
              <Item label="Workers Count" value={target?.solidWaste?.SWQ36} />
              <Item label="Employment Mode" value={target?.solidWaste?.SWQ37} />
              <Item label="Operational Challenges" value={target?.solidWaste?.SWQ60} />
              <Item label="Infrastructure Gaps" value={target?.solidWaste?.SWQ61} />
              <Item label="Financial Constraints" value={target?.solidWaste?.SWQ62} />
              <Item label="Regulatory Issues" value={target?.solidWaste?.SWQ63} />
              <Item label="Behavioral Challenges" value={target?.solidWaste?.SWQ64} />
              <Item label="Priority Areas" value={target?.solidWaste?.SWQ65} />
            </div>
            <ConcernPersonsTable persons={target?.solidWaste?.concernPersons} />
          </div>

          {/* Waste Water Management */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Waste Water Management" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Item label="Source" value={target?.wasteWaterManagement?.WWWQ1} />
              <Item label="Industrial Sources" value={target?.wasteWaterManagement?.WWWQ2} />
              <Item label="Influent Volume" value={target?.wasteWaterManagement?.WWWQ3} />
              <Item label="Treatment Type" value={target?.wasteWaterManagement?.WWWQ4} />
              <Item label="Technologies" value={target?.wasteWaterManagement?.WWWQ5} />
              <Item label="Sludge Method" value={target?.wasteWaterManagement?.WWWQ6} />
              <Item label="Water Utilization" value={target?.wasteWaterManagement?.WWWQ7} />
              <Item label="Disposal Location" value={target?.wasteWaterManagement?.WWWQ8} />
              <Item label="O&M Managed By" value={target?.wasteWaterManagement?.WWWQ9} />
              <Item label="O&M Agency" value={target?.wasteWaterManagement?.WWWQ10} />
              <Item label="Key Challenges" value={target?.wasteWaterManagement?.WWWQ11} />
              <Item label="Automation Level" value={target?.wasteWaterManagement?.WWWQ12} />
              <Item label="Expansion Planned" value={target?.wasteWaterManagement?.WWWQ13} />
              <Item label="Upgrades Planned" value={target?.wasteWaterManagement?.WWWQ14} />
              <Item label="Advanced Solutions Interest" value={target?.wasteWaterManagement?.WWWQ15} />
              <Item label="CRM Requirements" value={target?.wasteWaterManagement?.WWWQ16} />
            </div>
            <ConcernPersonsTable persons={target?.wasteWaterManagement?.concernPersons} />
          </div>

          {/* Kitchen Waste Management */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Kitchen Waste Management" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Item label="Meals Provided" value={target?.kitchenWasteManagement?.KWMQ1} />
              <Item label="Cuisine Types" value={target?.kitchenWasteManagement?.KWMQ2} />
              <Item label="In-house Kitchen" value={target?.kitchenWasteManagement?.KWMQ3} />
              <Item label="Kitchen Capacity" value={target?.kitchenWasteManagement?.KWMQ4} />
              <Item label="Waste Types" value={target?.kitchenWasteManagement?.KWMQ5} />
              <Item label="Leftover Handling" value={target?.kitchenWasteManagement?.KWMQ6} />
              <Item label="KWMQ7" value={target?.kitchenWasteManagement?.KWMQ7} />
              <Item label="KWMQ8" value={target?.kitchenWasteManagement?.KWMQ8} />
              <Item label="O&M Mode" value={target?.kitchenWasteManagement?.KWMQ9} />
              <Item label="KWMQ10" value={target?.kitchenWasteManagement?.KWMQ10} />
              <Item label="Disposal Method" value={target?.kitchenWasteManagement?.KWMQ11} />
            </div>
            <ConcernPersonsTable persons={target?.kitchenWasteManagement?.concernPersons} />
          </div>

          {/* Physiotherapy */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Physiotherapy Setup" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Item label="Primary Objective" value={target?.physiotherapy?.primaryObjective} />
              <Item label="Intended For" value={target?.physiotherapy?.intendedFor} />
              <Item label="Setup Context" value={target?.physiotherapy?.setupContext} />
              <Item label="Patient Load" value={target?.physiotherapy?.expectedPatientLoad} />
              <Item label="Service Type" value={target?.physiotherapy?.serviceType} />
              <Item label="Planned Location" value={target?.physiotherapy?.plannedLocation} />
              <Item label="Total Area" value={target?.physiotherapy?.totalArea} />
              <Item label="Area Division" value={target?.physiotherapy?.areaDivision} />
              <Item label="Patient Flow" value={target?.physiotherapy?.patientMovementFlow} />
              <Item label="Accessibility" value={target?.physiotherapy?.barrierFreeAccessibility} />
              <Item label="Infrastructure Planned" value={target?.physiotherapy?.infrastructurePlanned} />
              <Item label="Ventilation/Lighting" value={target?.physiotherapy?.ventilationLighting} />
              <Item label="Suitable Flooring" value={target?.physiotherapy?.suitableFlooring} />
              <Item label="Privacy Requirements" value={target?.physiotherapy?.privacyRequirements} />
              <Item label="Essential Equipment" value={target?.physiotherapy?.essentialEquipment} />
              <Item label="Advanced Technologies" value={target?.physiotherapy?.advancedTechnologies} />
              <Item label="Treatment Stations" value={target?.physiotherapy?.treatmentStations} />
              <Item label="Equipment Preference" value={target?.physiotherapy?.equipmentPreference} />
              <Item label="Power Requirements" value={target?.physiotherapy?.powerRequirements} />
              <Item label="Physiotherapist Count" value={target?.physiotherapy?.physotherapistCount} />
            </div>
          </div>

          {/* Laundry */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <SectionHeader title="Laundry Management" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Item label="LQ1" value={target?.Laundry?.LQ1} />
              <Item label="LQ2" value={target?.Laundry?.LQ2} />
              <Item label="LQ3" value={target?.Laundry?.LQ3} />
              <Item label="LQ4" value={target?.Laundry?.LQ4} />
              <Item label="LQ5" value={target?.Laundry?.LQ5} />
              <Item label="LQ6" value={target?.Laundry?.LQ6} />
              <Item label="LQ7" value={target?.Laundry?.LQ7} />
              <Item label="LQ8" value={target?.Laundry?.LQ8} />
              <Item label="LQ9" value={target?.Laundry?.LQ9} />
              <Item label="LQ10A" value={target?.Laundry?.LQ10A} />
              <Item label="LQ10B" value={target?.Laundry?.LQ10B} />
              <Item label="LQ11" value={target?.Laundry?.LQ11} />
              <Item label="LQ12" value={target?.Laundry?.LQ12} />
              <Item label="LQ13" value={target?.Laundry?.LQ13} />
              <Item label="LQ14" value={target?.Laundry?.LQ14} />
              <Item label="LQ15" value={target?.Laundry?.LQ15} />
              <Item label="LQ16" value={target?.Laundry?.LQ16} />
              <Item label="LQ17" value={target?.Laundry?.LQ17} />
              <Item label="LQ18" value={target?.Laundry?.LQ18} />
              <Item label="LQ19" value={target?.Laundry?.LQ19} />
            </div>
            <ConcernPersonsTable persons={target?.Laundry?.concernPersons} />
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-2xl z-10">
            {editRequestsDetails?.status === "Approved" ? (
              <div className="bg-emerald-50 border border-emerald-200 px-8 py-3 rounded-xl">
                <Typography color="success" fontWeight="black" className="uppercase tracking-widest text-emerald-700">
                  Request Approved Successfully
                </Typography>
              </div>
            ) : editRequestsDetails?.status === "Rejected" ? (
              <div className="bg-rose-50 border border-rose-200 px-8 py-3 rounded-xl">
                <Typography color="error" fontWeight="black" className="uppercase tracking-widest text-rose-700">
                  Request Rejected Successfully
                </Typography>
              </div>
            ) : (
              <>
                <Button
                  variant={3}
                  text="Reject Request"
                  onClick={() => handleRequestAction("reject")}
                  className="!px-8 !py-3 font-bold"
                />
                <Button
                  variant={1}
                  text="Approve Request"
                  onClick={() => handleRequestAction("approve")}
                  className="!px-8 !py-3 font-bold"
                />
              </>
            )}
            <Button
              variant={2}
              text="Go Back"
              onClick={() => handleBack()}
              className="!px-8 !py-3 font-bold"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgRequestActions;
