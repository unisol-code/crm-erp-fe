import React, { useEffect } from 'react';
import useDatabase from '../../../../../../hooks/database/useDatabase';
import { useTheme } from '../../../../../../hooks/theme/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../../../../../../components/uiComponents/breadcrumb/BreadCrumb';
import LoaderSpinner from '../../../../../../components/uiComponents/loader/LoaderSpinner';
import Button from '../../../../../../components/uiComponents/button/Button';
import {
    FiUser,
    FiMapPin,
    FiCalendar,
    FiDollarSign,
    FiPhone,
    FiMail,
    FiFileText,
    FiPackage,
    FiGrid,
    FiHome,
    FiCreditCard,
    FiBox,
    FiActivity,
    FiTarget,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiUserCheck,
    FiEdit2,
    FiAlertCircle
} from 'react-icons/fi';
import { format } from 'date-fns';

const EnviroIndRequestAction = () => {
    const { loading, employeeEditRequest, editRequestsDetails, requestAction } = useDatabase();
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        employeeEditRequest(id);
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch {
            return dateString;
        }
    };

    const handleApprove = () => {
        if (window.confirm('Are you sure you want to approve this request?')) {
            requestAction(id, { action: 'approve' });
        }
    };

    const handleReject = () => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            requestAction(id, { action: 'reject' });
        }
    };

    const InfoCard = ({ title, icon: Icon, children, className = '' }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3" style={{ backgroundColor: theme.secondaryColor + '15' }}>
                <Icon className="text-lg" style={{ color: theme.primaryColor }} />
                <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const InfoRow = ({ label, value, icon: Icon, highlight }) => (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            {Icon && <Icon className="mt-1 text-gray-400 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className={`font-medium break-words ${highlight ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                    {value || 'Not provided'}
                </p>
            </div>
        </div>
    );

    const StatusBadge = ({ status }) => {
        const getStatusConfig = (status) => {
            switch (status?.toLowerCase()) {
                case 'pending':
                    return {
                        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        icon: <FiClock className="mr-2" />
                    };
                case 'approved':
                    return {
                        color: 'bg-green-100 text-green-800 border-green-200',
                        icon: <FiCheckCircle className="mr-2" />
                    };
                case 'rejected':
                    return {
                        color: 'bg-red-100 text-red-800 border-red-200',
                        icon: <FiXCircle className="mr-2" />
                    };
                default:
                    return {
                        color: 'bg-gray-100 text-gray-800 border-gray-200',
                        icon: <FiAlertCircle className="mr-2" />
                    };
            }
        };

        const config = getStatusConfig(status);

        return (
            <span className={`px-4 py-2 rounded-full text-sm font-medium border inline-flex items-center ${config.color}`}>
                {config.icon}
                {status || 'N/A'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LoaderSpinner />
                    <p className="text-gray-600 mt-4">Loading request details...</p>
                </div>
            </div>
        );
    }

    if (!editRequestsDetails) {
        return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h3 className="text-yellow-800 font-semibold mb-2">No request found</h3>
                <p className="text-yellow-600">The requested edit request could not be found.</p>
                <Button
                    variant={3}
                    text="Go Back"
                    onClick={() => navigate(-1)}
                    className="mt-4"
                />
            </div>
        );
    }

    const { requestedBy, targetDetails, status, createdAt } = editRequestsDetails;

    return (
        <div className="min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: "Database" },
                    { text: "Approval Requests", href: "/database" },
                    {
                        text: "View Individual Requests",
                        href: `/database/approvalrequest/viewrequests/${requestedBy?._id}`,
                    },
                    { text: "Request Details" },
                ]}
            />

            {/* Header Section */}
            <div className="mb-4">
                <div className="rounded-2xl px-8 py-4 shadow-lg mb-4" style={{ backgroundColor: theme.secondaryColor }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-4">Edit Request Review by {requestedBy?.fullName}</h1>
                            <div className="flex flex-wrap items-center gap-4">
                                <StatusBadge status={status} />
                                <div className="flex items-center gap-2">
                                    <FiCalendar />
                                    <span>Requested on: {formatDate(createdAt)}{" "} {"|"}</span>
                                    <FiUserCheck className="text-white text-xl" />
                                    <div>
                                        <p className="text-sm">{requestedBy?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-3">
                            <FiAlertCircle className="text-yellow-500 text-xl" />
                            <p className="text-gray-700">
                                Review the changes requested by <span className="font-semibold">{requestedBy?.fullName}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant={1}
                                text="Approve Request"
                                icon={<FiCheckCircle />}
                                onClick={handleApprove}
                                className="px-6 py-3"
                                style={{ backgroundColor: '#10B981' }}
                                disabled={status !== 'Pending'}
                            />
                            <Button
                                variant={2}
                                text="Reject Request"
                                icon={<FiXCircle />}
                                onClick={handleReject}
                                className="px-6 py-3"
                                style={{ borderColor: '#EF4444', color: '#EF4444' }}
                                disabled={status !== 'Pending'}
                            />
                            <Button
                                variant={3}
                                text="Back"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3"
                            />
                        </div>
                    </div>
                    {status !== 'Pending' && (
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <p className="text-gray-600 text-center">
                                This request has already been {status?.toLowerCase()}.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Personal Information */}
                <InfoCard title="Personal Information" icon={FiUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRow label="First Name" value={targetDetails?.firstName} icon={FiUser} />
                        <InfoRow label="Last Name" value={targetDetails?.lastName} icon={FiUser} />
                        <InfoRow label="Contact Number" value={targetDetails?.contact} icon={FiPhone} />
                        <InfoRow label="Email Address" value={targetDetails?.email} icon={FiMail} />
                        <InfoRow label="PAN Number" value={targetDetails?.panNo} icon={FiFileText} />
                        <InfoRow label="Profile Type" value={targetDetails?.typeOfProfile} />
                    </div>
                </InfoCard>

                {/* Address Information */}
                <InfoCard title="Address Details" icon={FiMapPin}>
                    <div className="space-y-3">
                        <InfoRow label="Full Address" value={targetDetails?.address} icon={FiMapPin} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow label="Village" value={targetDetails?.villageName} icon={FiHome} />
                            <InfoRow label="Taluka" value={targetDetails?.taluka} />
                            <InfoRow label="District" value={targetDetails?.district} />
                            <InfoRow label="State" value={targetDetails?.state} />
                            <InfoRow label="PIN Code" value={targetDetails?.pinCode} />
                        </div>
                        <InfoRow label="Total Land Owned" value={targetDetails?.totalLandOwned} />
                    </div>
                </InfoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Financial Information */}
                <InfoCard title="Financial Information" icon={FiDollarSign}>
                    <div className="space-y-3">
                        <InfoRow label="Bank Name" value={targetDetails?.bankName} icon={FiCreditCard} />
                        <InfoRow
                            label="Existing Loan"
                            value={`₹${targetDetails?.existingLoan || '0'}`}
                            icon={FiDollarSign}
                            highlight
                        />
                        <InfoRow label="Payment Mode" value={targetDetails?.paymentMode} />
                    </div>
                </InfoCard>

                {/* Agriculture Details */}
                <InfoCard title="Agriculture Details" icon={FiGrid}>
                    <div className="grid grid-cols-1 gap-4">
                        <InfoRow label="Crop Name" value={targetDetails?.cropName} icon={FiActivity} />
                        <InfoRow label="Crop Type" value={targetDetails?.cropType} />
                        <InfoRow label="Spraying Type" value={targetDetails?.sprayingType} />
                        <InfoRow label="Spraying Duration" value={targetDetails?.sprayingDuration} />
                    </div>
                </InfoCard>

                {/* Purchase Details */}
                <InfoCard title="Purchase Details" icon={FiPackage}>
                    <div className="space-y-3">
                        <InfoRow label="Product Name" value={targetDetails?.productName} icon={FiBox} />
                        <InfoRow label="Purpose for Buying" value={targetDetails?.purposeForBuying} icon={FiTarget} />
                        <InfoRow
                            label="Tentative Buying Date"
                            value={formatDate(targetDetails?.tentativeBuyingDate)}
                            icon={FiCalendar}
                            highlight
                        />
                    </div>
                </InfoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Lead Information */}
                <InfoCard title="Lead Information" icon={FiTarget}>
                    <div className="space-y-3">
                        <InfoRow
                            label="Lead Generated Through"
                            value={Array.isArray(targetDetails?.leadGeneratedThrough)
                                ? targetDetails.leadGeneratedThrough.join(', ')
                                : targetDetails?.leadGeneratedThrough}
                            icon={FiTarget}
                        />
                        <InfoRow
                            label="Lead Owner"
                            value={targetDetails?.leadOwner}
                            highlight
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow
                                label="Last Meeting"
                                value={formatDate(targetDetails?.lastMeeting)}
                                icon={FiCalendar}
                            />
                            <InfoRow
                                label="Next Meeting"
                                value={formatDate(targetDetails?.nextMeeting?.[0])}
                                icon={FiCalendar}
                            />
                        </div>
                    </div>
                </InfoCard>

                {/* System Information */}
                <InfoCard title="System Information" icon={FiEdit2}>
                    <div className="space-y-3">
                        <InfoRow
                            label="Segment"
                            value={targetDetails?.segment}
                        />
                        <InfoRow
                            label="Current Status"
                            value={Array.isArray(targetDetails?.status)
                                ? targetDetails.status.join(', ')
                                : targetDetails?.status}
                        />
                    </div>
                </InfoCard>
            </div>
        </div>
    );
};

export default EnviroIndRequestAction;