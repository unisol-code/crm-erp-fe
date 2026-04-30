import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDatabase from "../../../../../../hooks/database/useDatabase";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { Box, Typography, Paper, Chip } from "@mui/material";
import Button from "../../../../../../components/uiComponents/button/Button";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner";
import { useTheme } from "../../../../../../hooks/theme/useTheme";

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