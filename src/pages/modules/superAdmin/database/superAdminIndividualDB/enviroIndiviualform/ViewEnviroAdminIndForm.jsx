import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../../../../../hooks/theme/useTheme';
import useEnviroAdminIndDB from '../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB';
import LoaderSpinner from '../../../../../../components/uiComponents/loader/LoaderSpinner';
import BreadCrumb from '../../../../../../components/uiComponents/breadcrumb/BreadCrumb';
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
    FiUsers,
    FiBriefcase,
    FiDatabase,
    FiEdit2,
    FiEye,
    FiChevronLeft,
    FiChevronRight,
    FiTag,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiHeart,
    FiMap,
    FiGlobe,
    FiHash
} from 'react-icons/fi';

const ViewEnviroAdminIndForm = () => {
    const {
        fetchEnviroAdminIndividualDetails,
        enviroAdminIndividualDetails,
        fetchEnviroGovtOfficerDetails,
        enviroGovtOfficerDetails,
        resetEnviroFPODetails,
        fetchEnviroFPODetails,
        enviroFPODetails,
        resetEnviroGovtOfficerDetails,
        loading,
        resetEnviroAdminIndividualDetails
    } = useEnviroAdminIndDB();
    const { id } = useParams();
    const location = useLocation();
    const typeOfProfileFromState = location.state?.typeOfProfile;
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if (id) {
            if (typeOfProfileFromState === "Farmer") {
                fetchEnviroAdminIndividualDetails(id);
                resetEnviroFPODetails();
                resetEnviroGovtOfficerDetails();
            } else if (typeOfProfileFromState === "Government Officer") {
                fetchEnviroGovtOfficerDetails(id);
                resetEnviroFPODetails();
                resetEnviroAdminIndividualDetails();
            } else if (typeOfProfileFromState === "FPO") {
                fetchEnviroFPODetails(id);
                resetEnviroGovtOfficerDetails();
                resetEnviroAdminIndividualDetails();
            } else {
                resetEnviroFPODetails();
                resetEnviroGovtOfficerDetails();
            }
        }
    }, [id, typeOfProfileFromState]);

    console.log(enviroAdminIndividualDetails, "enviroAdminIndividualDetails");
    console.log(enviroFPODetails, "enviroFPODetails");
    console.log(enviroGovtOfficerDetails, "enviroGovtOfficerDetails");

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        try {
            return `₹${parseInt(amount).toLocaleString('en-IN')}`;
        } catch {
            return `₹${amount}`;
        }
    };

    const InfoCard = ({ title, icon: Icon, children, className = '', action }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
            <div
                className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
                style={{ backgroundColor: theme.secondaryColor + '15' }}
            >
                <div className="flex items-center gap-3">
                    <Icon className="text-lg" style={{ color: theme.primaryColor }} />
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="text-sm font-medium px-3 py-1 rounded-lg transition-colors"
                        style={{ backgroundColor: theme.primaryColor, color: 'white' }}
                    >
                        {action.label}
                    </button>
                )}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );

    const InfoRow = ({ label, value, icon: Icon, highlight, badge }) => (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            {Icon && <Icon className="mt-1 text-gray-400 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                {badge ? (
                    <div className="inline-block">
                        {value}
                    </div>
                ) : (
                    <p
                        className={`font-medium break-words ${highlight
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-900'
                            }`}
                    >
                        {value || 'Not provided'}
                    </p>
                )}
            </div>
        </div>
    );

    const StatusBadge = ({ status }) => {
        const getStatusConfig = (status) => {
            if (!status) return {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: <FiTag className="mr-2" />
            };

            const statusText = Array.isArray(status) ? status[0] : status;

            switch (statusText?.toLowerCase()) {
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
                case 'completed':
                    return {
                        color: 'bg-blue-100 text-blue-800 border-blue-200',
                        icon: <FiCheckCircle className="mr-2" />
                    };
                default:
                    return {
                        color: 'bg-purple-100 text-purple-800 border-purple-200',
                        icon: <FiTag className="mr-2" />
                    };
            }
        };

        const statusText = Array.isArray(status) ? status.join(', ') : status;

        return (
            <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium border inline-flex items-center ${getStatusConfig(status).color}`}
            >
                {getStatusConfig(status).icon}
                {statusText || 'Not set'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <LoaderSpinner />
                    <p className="text-gray-600 mt-4">Loading individual details...</p>
                </div>
            </div>
        );
    }
    const details = enviroAdminIndividualDetails || enviroGovtOfficerDetails || enviroFPODetails;

    if (!details) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FiXCircle className="text-yellow-600 text-2xl" />
                        <h3 className="text-yellow-800 font-semibold text-lg">
                            No data found
                        </h3>
                    </div>
                    <p className="text-yellow-600 mb-6">
                        The requested individual details could not be found.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant={3}
                            text="Go Back"
                            icon={<FiChevronLeft />}
                            onClick={() => navigate(-1)}
                            className="px-4 py-2"
                        />
                        <Button
                            variant={1}
                            text="Browse Database"
                            icon={<FiDatabase />}
                            onClick={() => navigate('/database')}
                            className="px-4 py-2"
                            style={{ backgroundColor: theme.primaryColor }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const {
        firstName,
        lastName,
        contact,
        email,
        typeOfProfile,
        segment,
        leadOwner,
        salesPersonName,
        status,
        // Farmer fields
        panNo,
        customerType,
        address,
        villageName,
        taluka,
        district,
        state,
        pinCode,
        totalLandOwned,
        cropName,
        cropType,
        sprayingType,
        sprayingDuration,
        existingLoan,
        bankName,
        paymentMode,
        productName,
        purposeForBuying,
        tentativeBuyingDate,
        leadGeneratedThrough,
        lastMeeting,
        nextMeeting,
        // Government Officer fields
        officeName,
        designation,
        districtBlockRegion,
        yearsOfExperience,
        frequentlyRequestedServices,
        schemeUnderstanding,
        dataMaintainedDigitally,
        dataManagementTools,
        effectiveLanguage,
        goals,
        anniversary,
        hobbies,
        birthday,
        // FPO fields
        fpoName,
        registrationNumber,
        registrationAct,
        yearOfEstablishment,
        operationalArea,
        officeAddress,
        officialContactNumber,
        officialEmailId,
        websiteAppUrl,
        numberOfBoardMembers,
        numberOfStaffMembers,
        totalActiveMembers,
        memberCategories,
        primaryCommunicationChannels,
        majorCropsHandled,
        annualTurnover,
        majorRevenueSources,
        keyBuyerTypes,
        topChallenges,
        topPriorities,
        bankAccountDetails,
        contactPersonName,
        contactPersonDesignation,
        createdAt,
        updatedAt,
        _id
    } = details;

    return (
        <div className="min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: 'Database' },
                    { text: 'Individual Database', href: '/database' },
                    { text: fpoName || `${firstName} ${lastName}` },
                ]}
            />

            {/* Header with Profile Summary */}
            <div className="mb-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Gradient Header */}
                    <div
                        className="h-20 relative"
                        style={{
                            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`
                        }}
                    >
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white">
                                <FiUser className="text-4xl" style={{ color: theme.primaryColor }} />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {fpoName || `${firstName} ${lastName}`}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiMail className="text-sm" />
                                        <span className="text-sm">{officialEmailId || email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiPhone className="text-sm" />
                                        <span className="text-sm">{officialContactNumber || contact}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                        <FiUser className="inline mr-1" /> {typeOfProfile}
                                    </span>
                                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                                        <FiTag className="inline mr-1" /> {segment}
                                    </span>
                                    {typeOfProfile === "Farmer" && customerType && (
                                        <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">
                                            <FiUsers className="inline mr-1" /> {customerType}
                                        </span>
                                    )}
                                    <StatusBadge status={status} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {typeOfProfile === "Farmer" ? (
                                    <>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">Lead Owner</p>
                                            <p className="font-semibold text-gray-800">{leadOwner || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">Sales Person</p>
                                            <p className="font-semibold text-gray-800">
                                                {salesPersonName || 'Not assigned'}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">Added By</p>
                                        <p className="font-semibold text-gray-800">{details?.addedBy || 'System'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-4">
                    {typeOfProfile === "Farmer" ? (
                        <>
                            {/* Farmer Specific Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="Personal Details" icon={FiUser}>
                                    <div className="space-y-4">
                                        <InfoRow label="First Name" value={firstName} icon={FiUser} />
                                        <InfoRow label="Last Name" value={lastName} icon={FiUser} />
                                        <InfoRow label="PAN Number" value={panNo} icon={FiFileText} highlight />
                                        <InfoRow label="Customer Type" value={customerType} icon={FiUsers} />
                                    </div>
                                </InfoCard>

                                <InfoCard title="Contact Information" icon={FiPhone}>
                                    <div className="space-y-4">
                                        <InfoRow label="Phone Number" value={contact} icon={FiPhone} highlight />
                                        <InfoRow label="Email Address" value={email} icon={FiMail} />
                                        <div className="pt-2">
                                            <p className="text-sm text-gray-500 mb-2">Quick Actions</p>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Call</button>
                                                <button className="px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">Email</button>
                                            </div>
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>

                            <InfoCard title="Address & Location" icon={FiMapPin}>
                                <div className="space-y-4">
                                    <InfoRow label="Complete Address" value={address} icon={FiMapPin} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow label="Village/Town" value={villageName} icon={FiHome} />
                                        <InfoRow label="Taluka" value={taluka} />
                                        <InfoRow label="District" value={district} />
                                        <InfoRow label="State" value={state} />
                                        <InfoRow label="PIN Code" value={pinCode} />
                                    </div>
                                    <InfoRow label="Total Land Owned" value={totalLandOwned} highlight />
                                </div>
                            </InfoCard>

                            <InfoCard title="Farming Details" icon={FiGrid}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow label="Primary Crop" value={cropName} icon={FiActivity} highlight />
                                    <InfoRow label="Crop Type" value={cropType} />
                                    <InfoRow label="Spraying Type" value={sprayingType} />
                                    <InfoRow label="Spraying Duration" value={sprayingDuration} />
                                </div>
                            </InfoCard>
                        </>
                    ) : typeOfProfile === "Government Officer" ? (
                        <>
                            {/* Government Officer Specific Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="Officer Profile" icon={FiUser}>
                                    <div className="space-y-4">
                                        <InfoRow label="First Name" value={firstName} icon={FiUser} />
                                        <InfoRow label="Last Name" value={lastName} icon={FiUser} />
                                        <InfoRow label="Designation" value={designation} icon={FiBriefcase} highlight />
                                        <InfoRow label="Experience" value={yearsOfExperience} icon={FiClock} />
                                    </div>
                                </InfoCard>

                                <InfoCard title="Contact & Personal" icon={FiPhone}>
                                    <div className="space-y-4">
                                        <InfoRow label="Phone" value={contact} icon={FiPhone} highlight />
                                        <InfoRow label="Email" value={email} icon={FiMail} />
                                        <InfoRow label="Birthday" value={formatDate(birthday)} icon={FiCalendar} />
                                        <InfoRow label="Anniversary" value={formatDate(anniversary)} icon={FiHeart} />
                                    </div>
                                </InfoCard>
                            </div>

                            <InfoCard title="Department & Jurisdiction" icon={FiMapPin}>
                                <div className="space-y-4">
                                    <InfoRow label="Office Name" value={officeName} icon={FiHome} highlight />
                                    <InfoRow label="Jurisdiction Area" value={districtBlockRegion} icon={FiMap} />
                                    <InfoRow label="Effective Language" value={effectiveLanguage} icon={FiGlobe} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Professional Details" icon={FiActivity}>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Frequently Requested Services</p>
                                        <div className="flex flex-wrap gap-2">
                                            {frequentlyRequestedServices?.map((s, i) => (
                                                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow label="Scheme Understanding" value={schemeUnderstanding} />
                                        <InfoRow label="Digital Data Maintenance" value={dataMaintainedDigitally} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Data Management Tools</p>
                                        <div className="flex flex-wrap gap-2">
                                            {dataManagementTools?.map((t, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-100">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <InfoRow label="Key Goals" value={goals} icon={FiTarget} />
                                </div>
                            </InfoCard>
                        </>
                    ) : (
                        <>
                            {/* FPO Specific Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="FPO Identity" icon={FiFileText}>
                                    <div className="space-y-4">
                                        <InfoRow label="Registration No" value={registrationNumber} icon={FiHash} highlight />
                                        <InfoRow label="Registration Act" value={registrationAct} />
                                        <InfoRow label="Year of Establishment" value={yearOfEstablishment} icon={FiCalendar} />
                                        <InfoRow label="Website/URL" value={websiteAppUrl} icon={FiGlobe} />
                                    </div>
                                </InfoCard>

                                <InfoCard title="Official Contact" icon={FiMapPin}>
                                    <div className="space-y-4">
                                        <InfoRow label="Office Address" value={officeAddress} icon={FiMapPin} />
                                        <InfoRow label="Official Phone" value={officialContactNumber} icon={FiPhone} highlight />
                                        <InfoRow label="Official Email" value={officialEmailId} icon={FiMail} />
                                    </div>
                                </InfoCard>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="Governance & Staff" icon={FiUsers}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Board Members</p>
                                            <p className="text-lg font-bold text-gray-800">{numberOfBoardMembers}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Staff Members</p>
                                            <p className="text-lg font-bold text-gray-800">{numberOfStaffMembers}</p>
                                        </div>
                                    </div>
                                </InfoCard>

                                <InfoCard title="Contact Person" icon={FiUser}>
                                    <div className="space-y-4">
                                        <InfoRow label="Name" value={contactPersonName} icon={FiUser} highlight />
                                        <InfoRow label="Designation" value={contactPersonDesignation} icon={FiBriefcase} />
                                    </div>
                                </InfoCard>
                            </div>

                            <InfoCard title="Member Profile & Engagement" icon={FiActivity}>
                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FiUsers className="text-blue-600 text-xl" />
                                            <span className="font-semibold text-blue-900">Total Active Members</span>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-700">{totalActiveMembers}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 font-medium">Member Categories</p>
                                            <div className="flex flex-wrap gap-2">
                                                {memberCategories?.map((c, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 font-medium">Communication Channels</p>
                                            <div className="flex flex-wrap gap-2">
                                                {primaryCommunicationChannels?.map((ch, i) => (
                                                    <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-100">{ch}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>

                            <InfoCard title="Business Operations" icon={FiGrid}>
                                <div className="space-y-6">
                                    <InfoRow label="Operational Area" value={operationalArea} icon={FiMap} highlight />
                                    <InfoRow label="Major Crops Handled" value={majorCropsHandled} icon={FiActivity} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                            <p className="text-xs text-green-600 mb-1">Annual Turnover</p>
                                            <p className="text-xl font-bold text-gray-900">{annualTurnover}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 font-medium">Revenue Sources</p>
                                            <div className="flex flex-wrap gap-2">
                                                {majorRevenueSources?.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs border border-yellow-100">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="Market & Innovation" icon={FiTarget}>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 font-medium">Key Buyer Types</p>
                                            <div className="flex flex-wrap gap-2">
                                                {keyBuyerTypes?.map((b, i) => (
                                                    <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs border border-purple-100">{b}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </InfoCard>
                                <InfoCard title="Planning & Challenges" icon={FiClock}>
                                    <div className="space-y-4">
                                        <InfoRow label="Top Challenges" value={topChallenges} icon={FiXCircle} />
                                        <InfoRow label="Top Priorities" value={topPriorities} icon={FiCheckCircle} highlight />
                                    </div>
                                </InfoCard>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-4">
                    {typeOfProfile === "Farmer" ? (
                        <>
                            <InfoCard title="Financial Summary" icon={FiDollarSign}>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Existing Loan</span>
                                            <span className="text-lg font-bold text-gray-900">{formatCurrency(existingLoan)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Bank</span>
                                            <span className="font-medium text-gray-800">{bankName}</span>
                                        </div>
                                    </div>
                                    <InfoRow label="Payment Preference" value={paymentMode} icon={FiCreditCard} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Purchase Intent" icon={FiPackage}>
                                <div className="space-y-4">
                                    <InfoRow label="Product Interest" value={productName} icon={FiBox} highlight />
                                    <InfoRow label="Purchase Purpose" value={purposeForBuying} icon={FiTarget} />
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FiCalendar className="text-yellow-600" />
                                            <span className="text-sm font-medium text-yellow-800">Tentative Date</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">{formatDate(tentativeBuyingDate)}</p>
                                    </div>
                                </div>
                            </InfoCard>
                        </>
                    ) : typeOfProfile === "FPO" ? (
                        <InfoCard title="Banking Details" icon={FiCreditCard}>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-600 mb-1">Account Info</p>
                                <p className="text-sm font-semibold text-gray-900 whitespace-pre-wrap">{bankAccountDetails}</p>
                            </div>
                        </InfoCard>
                    ) : (
                        <InfoCard title="Profile Preferences" icon={FiTarget}>
                            <div className="space-y-4">
                                <InfoRow label="Hobbies" value={hobbies} icon={FiActivity} />
                                <InfoRow label="Goals" value={goals} icon={FiTarget} highlight />
                            </div>
                        </InfoCard>
                    )}

                    {/* Engagement Section (Farmer Only) */}
                    {typeOfProfile === "Farmer" && (
                        <InfoCard title="Engagement Status" icon={FiClock}>
                            <div className="space-y-4">
                                <InfoRow
                                    label="Status History"
                                    value={
                                        <div className="flex flex-wrap gap-1">
                                            {Array.isArray(status) ? status.map((s, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{s}</span>
                                            )) : <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{status}</span>}
                                        </div>
                                    }
                                    badge
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                                        <p className="text-xs text-blue-600 mb-1">Last Meeting</p>
                                        <p className="text-sm font-bold text-gray-900">{formatDate(lastMeeting)}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg text-center">
                                        <p className="text-xs text-green-600 mb-1">Next Meeting</p>
                                        <p className="text-sm font-bold text-gray-900">{formatDate(nextMeeting?.[0])}</p>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4 bg-white p-4 rounded-xl shadow-md gap-4">
                <Button
                    variant={3}
                    text="Go Back"
                    icon={<FiChevronLeft />}
                    onClick={() => navigate(-1)}
                    className="px-6 py-2"
                />
                <Button
                    variant={1}
                    text="Edit Details"
                    icon={<FiEdit2 />}
                    onClick={() => navigate(`/database/edit-enviro-individual/${_id}`)}
                    className="px-6 py-2"
                    style={{ backgroundColor: theme.primaryColor }}
                />
            </div>
        </div>
    );
};

export default ViewEnviroAdminIndForm;