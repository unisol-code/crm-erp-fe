import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import useDatabase from "../../../../../../hooks/database/useDatabase";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { Box, Typography, Paper, Chip } from "@mui/material";
import Button from "../../../../../../components/uiComponents/button/Button";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import BiomedicalAndSolidWaste from "../superAdminOrganizationTabs/BiomedicalAndSolidWaste";
import Kitchen from "../superAdminOrganizationTabs/Kitchen";
import Laundry from "../superAdminOrganizationTabs/Laundry";

const Item = ({ label, value }) => (
    <div className="flex flex-col">
        <Typography variant="caption" className="text-gray-500 font-medium uppercase tracking-wider">
            {label}
        </Typography>
        <Typography variant="body1" className="text-gray-800 mt-0.5 font-semibold">
            {value || "-"}
        </Typography>
    </div>
);

const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
            {title}
        </h2>
    </div>
);

/* ---------------------------------------------------------------------------
 * Waste Management request rendering
 *
 * A Waste Management edit request returns its answers on `targetDetails` under
 * `solidWaste` / `wasteWaterManagement` / `bioMedicalWaste` /
 * `kitchenWasteManagement` / `laundry`, and the chosen services under
 * `selectWasteManagement` as human readable labels
 * (e.g. "Solid Waste Management").
 *
 * The enviro form tabs are keyed on short codes ("solid", "water", ...) so the
 * labels are converted back to codes here. Matching accepts EITHER a label or
 * a code (records saved the old way store codes) and unknown values pass
 * through instead of being dropped.
 * ------------------------------------------------------------------------ */
const wasteManagementTypeOptions = [
    { label: "Solid Waste Management", value: "solid" },
    { label: "Waste Water Management", value: "water" },
    { label: "Biomedical Waste Management", value: "biomedical" },
    { label: "Kitchen", value: "kitchen" },
    { label: "Laundry", value: "laundry" },
];

const toWasteManagementCodes = (list) =>
    (Array.isArray(list) ? list : []).map(
        (entry) =>
            wasteManagementTypeOptions.find(
                (opt) => opt.label === entry || opt.value === entry
            )?.value || entry
    );

const readWasteManagementType = (d) =>
    toWasteManagementCodes(
        Array.isArray(d?.selectWasteManagement) && d.selectWasteManagement.length
            ? d.selectWasteManagement
            : d?.wasteManagementType
    );

const wasteTypeLabel = {
    biomedical: "Biomedical Waste",
    solid: "Solid Waste",
    water: "Waste Water",
    kitchen: "Kitchen",
    laundry: "Laundry",
};

// Same tab -> component mapping the enviro add/edit & view screens use
// (EnviroAdminOrgAddEditDB / EnviroEmpOrgAddEditDB), so a request shows
// exactly what the organization view page shows, only read-only.
const tabComponentMap = {
    biomedical: (formik, isReadOnly) => (
        <BiomedicalAndSolidWaste formik={formik} type="biomedical" isReadOnly={isReadOnly} />
    ),
    solid: (formik, isReadOnly) => (
        <BiomedicalAndSolidWaste formik={formik} type="solid" isReadOnly={isReadOnly} />
    ),
    water: (formik, isReadOnly) => (
        <BiomedicalAndSolidWaste formik={formik} type="water" isReadOnly={isReadOnly} />
    ),
    kitchen: (formik, isReadOnly) => <Kitchen formik={formik} isReadOnly={isReadOnly} />,
    laundry: (formik, isReadOnly) => <Laundry formik={formik} isReadOnly={isReadOnly} />,
};

const Tabs = ({ tabs, active, onChange }) => (
    <div className="flex w-full gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map((t) => (
            <button
                key={t.id}
                type="button"
                onClick={() => onChange(t.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-t-lg transition text-center whitespace-nowrap ${
                    active === t.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
                {t.label}
            </button>
        ))}
    </div>
);

// Maps the API's `targetDetails` onto the shape the enviro tabs expect
// (state -> stateName, officialEmailId -> officialEmail, ...) with the same
// field mapping the enviro view screen uses, so every answer lands on the key
// its QuestionField reads.
const buildRequestFormValues = (d = {}) => ({
    sectionName: d.sectionName || "",
    OrganizationType: d.OrganizationType || "",
    organizationName: d.organizationName || "",
    departmentName: d.departmentName || "",
    jurisdictionLevel: d.jurisdictionLevel || "",
    region: d.region || "",
    stateName: d.state || "",
    districtName: d.district || "",
    cityTownVillage: d.cityTownVillage || "",
    pincode: d.pincode || "",
    officeAddress: d.officeAddress || "",
    officialContactNumber: d.officialContactNumber || "",
    officialEmail: d.officialEmailId || "",
    websiteAppUrl: d.websiteAppUrl || "",
    totalOfficers: d.totalOfficers ?? "",
    activeSchemes: d.activeSchemes || "",
    salesId: d.salesId || "",
    salesPersonName: d.salesPersonName || "",
    wasteManagementType: readWasteManagementType(d),
    bioMedicalWaste: d.bioMedicalWaste || {},
    solidWaste: d.solidWaste || {},
    wasteWaterManagement: d.wasteWaterManagement || {},
    kitchenWasteManagement: d.kitchenWasteManagement || {},
    laundry: d.laundry || {},
});

const EnviroOrgRequestActions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const { loading, employeeEditRequest, editRequestsDetails, requestAction } =
        useDatabase();

    useEffect(() => {
        employeeEditRequest(id);
    }, []);

    const backId = editRequestsDetails?.requestedBy?._id
    const handleRequestAction = async (action) => {
        const userId = editRequestsDetails?.requestedBy?._id;
        const data = {
            action: action,
        };
        const isSuccess = await requestAction(id, data, userId);
        if (isSuccess) {
            navigate(`/database/approvalrequest/viewrequests/${backId}`);
        }
    };

    const target = editRequestsDetails?.targetDetails;

    const [activeTab, setActiveTab] = useState("");

    // Read-only formik instance: the waste tabs read every answer through
    // formik.values, so the pending request's `targetDetails` is hydrated here
    // using the same mapping as the organization view screen.
    const formik = useFormik({
        initialValues: buildRequestFormValues(target),
        onSubmit: () => {},
    });

    useEffect(() => {
        if (target) {
            formik.setValues(buildRequestFormValues(target), false);
        }
    }, [target]);

    const selectedWasteTypes = readWasteManagementType(target);
    const isWasteManagementRequest =
        target?.sectionName === "Waste Management" ||
        (Array.isArray(target?.selectWasteManagement) &&
            target.selectWasteManagement.length > 0) ||
        selectedWasteTypes.length > 0;

    return (
        <div className="min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: "Database", href: "/database" },
                    { text: "Approval Requests", href: "/database" },
                    {
                        text: "View Organizational Requests",
                        href: `/database/approvalrequest/viewrequests/${id}`,
                    },
                    { text: "Enviro Request Details" },
                ]}
            />

            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <LoaderSpinner />
                </div>
            ) : (
                <div className="mx-auto py-1">
                    {/* Header Card */}
                    <Paper elevation={0} className="mb-4 p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <Typography variant="h5" className="font-bold text-gray-900">
                                    Update Request from {editRequestsDetails?.requestedBy?.fullName}
                                </Typography>
                                <Typography variant="body2" className="text-gray-500 mt-1">
                                    {editRequestsDetails?.requestedBy?.email} • Created on {new Date(editRequestsDetails?.createdAt).toLocaleDateString()}
                                </Typography>
                            </div>
                            <Chip
                                label={editRequestsDetails?.status}
                                color={editRequestsDetails?.status === "Pending" ? "warning" : "success"}
                                className="font-bold uppercase px-2 py-1 rounded-lg"
                            />
                        </div>
                    </Paper>

                    {/* Main Info Sections */}
                    {isWasteManagementRequest ? (
                        <div className="grid grid-cols-1 gap-4">
                            {/* Organization Profile */}
                            <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                                <SectionHeader title="Organization Profile" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    <Item label="Organization Name" value={target?.organizationName} />
                                    <Item label="Section" value={target?.sectionName} />
                                    <Item label="Organization Type" value={target?.OrganizationType} />
                                    <Item label="Unique ID" value={target?.uniqueId} />
                                    <Item label="Department Name" value={target?.departmentName} />
                                    <Item label="Jurisdiction Level" value={target?.jurisdictionLevel} />
                                    <Item label="Sales Person" value={target?.salesPersonName} />
                                    <Item label="Total Officers" value={target?.totalOfficers} />
                                    <Item label="Total Staff Members" value={target?.numberOfStaffMembers} />
                                    <Item label="Board Members" value={target?.numberOfBoardMembers} />
                                    <Item label="Total Active Members" value={target?.totalActiveMembers} />
                                    <div className="flex flex-col sm:col-span-2">
                                        <Typography variant="caption" className="text-gray-500 font-medium uppercase tracking-wider">
                                            Website / App URL
                                        </Typography>
                                        <a href={target?.websiteAppUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline block truncate mt-0.5">
                                            {target?.websiteAppUrl || "-"}
                                        </a>
                                    </div>
                                </div>
                            </Paper>

                            {/* Location & Contact Information */}
                            <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                                <SectionHeader title="Location & Contact Information" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    <Item label="Region" value={target?.region} />
                                    <Item label="State" value={target?.state} />
                                    <Item label="District" value={target?.district} />
                                    <Item label="City / Town / Village" value={target?.cityTownVillage} />
                                    <Item label="Pincode" value={target?.pincode} />
                                    <Item label="Official Contact Number" value={target?.officialContactNumber} />
                                    <Item label="Official Email" value={target?.officialEmailId} />
                                    <Item label="Office Address" value={target?.officeAddress} />
                                </div>
                            </Paper>

                            {/* Waste Management Details - same tabs as the org view screen, read-only */}
                            <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                                <SectionHeader title="Waste Management Details" />
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(target?.selectWasteManagement || []).map((service, idx) => (
                                        <Chip key={idx} label={service} size="small" className="bg-blue-50 text-blue-700 border-blue-100 font-medium" />
                                    ))}
                                    {!target?.selectWasteManagement?.length && "-"}
                                </div>
                                {selectedWasteTypes.length > 0 ? (
                                    (() => {
                                        const dynamicTabs = selectedWasteTypes.map((t) => ({
                                            id: t,
                                            label: wasteTypeLabel[t] || t,
                                        }));
                                        const tabIds = dynamicTabs.map((t) => t.id);
                                        const safeActive = tabIds.includes(activeTab) ? activeTab : tabIds[0];
                                        return (
                                            <>
                                                <Tabs tabs={dynamicTabs} active={safeActive} onChange={setActiveTab} />
                                                <fieldset disabled className="space-y-4">
                                                    <div key={safeActive}>
                                                        {tabComponentMap[safeActive]?.(formik, true)}
                                                    </div>
                                                </fieldset>
                                            </>
                                        );
                                    })()
                                ) : (
                                    <Typography variant="body2" className="text-gray-500 italic">
                                        No waste management service selected for this organization.
                                    </Typography>
                                )}
                            </Paper>
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 gap-4">

                        {/* Department Profile */}
                        <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                            <SectionHeader title="Department Profile" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                <Item label="Department Name" value={target?.departmentName} />
                                <Item label="Jurisdiction Level" value={target?.jurisdictionLevel} />
                                <Item label="State" value={target?.state} />
                                <Item label="District" value={target?.district} />
                                <div className="flex flex-col">
                                    <Typography variant="caption" className="text-gray-500 font-medium uppercase tracking-wider">Department Website</Typography>
                                    <a href={target?.departmentWebsite} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline block truncate mt-0.5">
                                        {target?.departmentWebsite || "-"}
                                    </a>
                                </div>
                            </div>
                        </Paper>

                        {/* Contact Information */}
                        <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                            <SectionHeader title="Contact Information" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <Item label="Official Email" value={target?.officialEmailId} />
                                <Item label="Official Contact Number" value={target?.officialContactNumber} />
                                <Item label="Office Address" value={target?.officeAddress} />
                            </div>
                        </Paper>

                        {/* Organizational Structure & Engagement */}
                        <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                            <SectionHeader title="Organizational structure & Farmer Engagement" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <Item label="Total Officers" value={target?.totalOfficers} />
                                <Item label="Total Farmers Registered" value={target?.totalFarmersRegistered} />
                                <Item label="Added By" value={target?.addedBy} />
                                <Item label="Target Model ID" value={target?._id} />
                            </div>
                        </Paper>
                    </div>
                    )}

                    {/* Shared for every enviro request profile */}
                    <div className="grid grid-cols-1 gap-4">

                        {/* Schemes and Services */}
                        <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                            <SectionHeader title="Schemes and Services" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <Typography variant="caption" className="text-gray-500 font-medium uppercase tracking-wider mb-2 block">Services Offered</Typography>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {target?.servicesOffered?.map((service, idx) => (
                                            <Chip key={idx} label={service} size="small" variant="outlined" className="bg-blue-50/50 border-blue-100 text-blue-700 font-medium" />
                                        ))}
                                        {!target?.servicesOffered?.length && "-"}
                                    </div>
                                    {target?.servicesOthersText && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <Typography variant="caption" className="text-gray-400 block mb-1">Other Services Info</Typography>
                                            <Typography variant="body2">{target.servicesOthersText}</Typography>
                                        </div>
                                    )}
                                </div>
                                <Item label="Active Schemes" value={target?.activeSchemes} />
                            </div>
                        </Paper>

                        {/* Communication & Channels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                                <SectionHeader title="Grievance Channels" />
                                <div className="flex flex-wrap gap-2">
                                    {target?.grievanceChannels?.map((channel, idx) => (
                                        <Chip key={idx} label={channel} size="small" className="bg-orange-50 text-orange-700 border-orange-100 font-medium" />
                                    ))}
                                    {!target?.grievanceChannels?.length && "-"}
                                </div>
                            </Paper>
                            <Paper elevation={0} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                                <SectionHeader title="Communication Channels" />
                                <div className="flex flex-wrap gap-2">
                                    {target?.communicationChannels?.map((channel, idx) => (
                                        <Chip key={idx} label={channel} size="small" className="bg-green-50 text-green-700 border-green-100 font-medium" />
                                    ))}
                                    {!target?.communicationChannels?.length && "-"}
                                </div>
                            </Paper>
                        </div>
                    </div>

                    {/* Final Action Actions */}
                    <Box className="mt-4 mb-4 flex flex-wrap justify-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        {editRequestsDetails?.status === "Approved" ? (
                            <div className="flex flex-col items-center">
                                <Typography variant="h6" color="success.main" className="font-bold flex items-center gap-2">
                                    Request Approved Successfully
                                </Typography>
                                <div className="mt-4">
                                    <Button variant={2} text="Back to List" onClick={() => navigate(-1)} />
                                </div>
                            </div>
                        ) : editRequestsDetails?.status === "Rejected" ? (
                            <div className="flex flex-col items-center">
                                <Typography variant="h6" color="error.main" className="font-bold">
                                    Request Rejected Successfully
                                </Typography>
                                <div className="mt-4">
                                    <Button variant={2} text="Back to List" onClick={() => navigate(-1)} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4 w-full justify-center">
                                <Button
                                    variant={3}
                                    text="Reject Request"
                                    onClick={() => handleRequestAction("reject")}
                                    className="!px-8 !py-3"
                                />
                                <Button
                                    variant={1}
                                    text="Approve Request"
                                    onClick={() => handleRequestAction("approve")}
                                    className="!px-8 !py-3"
                                />
                                <Button
                                    variant={2}
                                    text="Cancel"
                                    onClick={() => navigate(`/database/approvalrequest/viewrequests/${backId}`)}
                                    className="!px-8 !py-3"
                                />
                            </div>
                        )}
                    </Box>
                </div>
            )}
        </div>
    );
};

export default EnviroOrgRequestActions;