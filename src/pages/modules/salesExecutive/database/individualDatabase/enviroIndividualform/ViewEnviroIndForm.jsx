import React, { useEffect } from 'react';
import useEnviroIndividualDB from '../../../../../../hooks/salesExecutiveHook/salesExecutiveDB/enviroIndividualDB/useEnviroIndividualDB';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BreadCrumb from '../../../../../../components/uiComponents/breadcrumb/BreadCrumb';
import { useTheme } from '../../../../../../hooks/theme/useTheme';
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
    FiHash,
    FiClock,
    FiGlobe,
    FiMap,
    FiUsers,
    FiXCircle,
    FiCheckCircle,
    FiBriefcase,
    FiHeart
} from 'react-icons/fi';

const ViewEnviroIndForm = () => {
    const { error, fetchEnviroIndividualDetails, enviroIndividualDetails, loading } = useEnviroIndividualDB();
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const location = useLocation();
    const typeOfProfile = location.state?.typeOfProfile || 'Farmer';

    useEffect(() => {
        if (id)
            fetchEnviroIndividualDetails(id);
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not set';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const InfoCard = ({ title, icon: Icon, children }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3" style={{ backgroundColor: theme.secondaryColor + '15' }}>
                <Icon className="text-lg" style={{ color: theme.primaryColor }} />
                <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const InfoRow = ({ label, value, icon: Icon }) => (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            {Icon && <Icon className="mt-1 text-gray-400 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="font-medium text-gray-900 break-words">{value || 'Not provided'}</p>
            </div>
        </div>
    );

    const StatusBadge = ({ status }) => {
        const getStatusColor = (status) => {
            const statusStr = typeof status === 'string' ? status : status?.[0];
            switch (statusStr?.toLowerCase()) {
                case 'pending':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                case 'approved':
                    return 'bg-green-100 text-green-800 border-green-200';
                case 'rejected':
                    return 'bg-red-100 text-red-800 border-red-200';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        };

        const displayStatus = typeof status === 'string' ? status : status?.[0] || 'N/A';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                {displayStatus}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading individual details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="text-red-800 font-semibold mb-2">Error loading details</h3>
                <p className="text-red-600">{error}</p>
                <Button
                    variant={3}
                    text="Go Back"
                    onClick={() => navigate(-1)}
                    className="mt-4"
                />
            </div>
        );
    }

    if (!enviroIndividualDetails) {
        return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h3 className="text-yellow-800 font-semibold mb-2">No data found</h3>
                <p className="text-yellow-600">The requested individual details could not be found.</p>
                <Button
                    variant={3}
                    text="Go Back"
                    onClick={() => navigate(-1)}
                    className="mt-4"
                />
            </div>
        );
    }

    const {
        firstName,
        lastName,
        contact,
        email,
        address,
        villageName,
        taluka,
        district,
        state,
        pinCode,
        panNo,
        bankName,
        existingLoan,
        cropName,
        cropType,
        productName,
        purposeForBuying,
        tentativeBuyingDate,
        segment,
        typeOfProfile: profileType,
        leadOwner,
        salesPersonName,
        status,
        leadGeneratedThrough,
        lastMeeting,
        nextMeeting,
        totalLandOwned,
        sprayingType,
        sprayingDuration,
        paymentMode,
        // Government Officer fields
        birthday,
        anniversary,
        hobbies,
        goals,
        officeName,
        designation,
        districtBlockRegion,
        yearsOfExperience,
        frequentlyRequestedServices,
        schemeUnderstanding,
        dataMaintainedDigitally,
        dataManagementTools,
        effectiveLanguage,
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
        contactPersonDesignation
    } = enviroIndividualDetails;

    const displayName = typeOfProfile === 'FPO' ? fpoName || 'FPO' : `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown';

    return (
        <div className="min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: "Database" },
                    { text: "Individual Database", href: "/sales-executive/database" },
                    { text: displayName },
                ]}
            />

            {/* Header */}
            <div className="relative mb-4">
                <div className="rounded-2xl px-8 py-6 shadow-lg" style={{ backgroundColor: theme.primaryColor }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <FiUser className="text-3xl" style={{ color: theme.primaryColor }} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {displayName}
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                        {typeOfProfile || 'Farmer'}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                        {segment || 'Agriculture'}
                                    </span>
                                    <StatusBadge status={status} />
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            {typeOfProfile === 'Farmer' ? (
                                <>
                                    <p className="text-white/90 mb-1">Lead Owner</p>
                                    <p className="text-white font-semibold text-lg">{leadOwner}</p>
                                    <p className="text-white/90 mt-2 mb-1">Sales Person</p>
                                    <p className="text-white font-semibold text-lg">{salesPersonName}</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-white/90 mb-1">Added By</p>
                                    <p className="text-white font-semibold text-lg">{salesPersonName}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4">
                    {typeOfProfile === 'Farmer' ? (
                        <>
                            {/* Personal Information */}
                            <InfoCard title="Personal Information" icon={FiUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow label="First Name" value={firstName} icon={FiUser} />
                                    <InfoRow label="Last Name" value={lastName} icon={FiUser} />
                                    <InfoRow label="Contact Number" value={contact} icon={FiPhone} />
                                    <InfoRow label="Email Address" value={email} icon={FiMail} />
                                    <InfoRow label="PAN Number" value={panNo} icon={FiFileText} />
                                </div>
                            </InfoCard>

                            {/* Address Information */}
                            <InfoCard title="Address Details" icon={FiMapPin}>
                                <div className="space-y-2">
                                    <InfoRow label="Full Address" value={address} icon={FiMapPin} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow label="Village" value={villageName} icon={FiHome} />
                                        <InfoRow label="Taluka" value={taluka} icon={FiHome} />
                                        <InfoRow label="District" value={district} icon={FiHome} />
                                        <InfoRow label="State" value={state} icon={FiHome} />
                                        <InfoRow label="PIN Code" value={pinCode} icon={FiHome} />
                                    </div>
                                    <InfoRow label="Total Land Owned" value={totalLandOwned} icon={FiHome} />
                                </div>
                            </InfoCard>

                            {/* Agriculture Details */}
                            <InfoCard title="Agriculture Details" icon={FiGrid}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow label="Crop Name" value={cropName} icon={FiActivity} />
                                    <InfoRow label="Crop Type" value={cropType} icon={FiActivity} />
                                    <InfoRow label="Spraying Type" value={sprayingType} icon={FiTarget} />
                                    <InfoRow label="Spraying Duration" value={sprayingDuration} icon={FiTarget} />
                                </div>
                            </InfoCard>
                        </>
                    ) : typeOfProfile === 'Government Officer' ? (
                        <>
                            {/* Officer Profile */}
                            <InfoCard title="Officer Profile" icon={FiUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow label="First Name" value={firstName} icon={FiUser} />
                                    <InfoRow label="Last Name" value={lastName} icon={FiUser} />
                                    <InfoRow label="Designation" value={designation} icon={FiBriefcase} />
                                    <InfoRow label="Experience" value={yearsOfExperience} icon={FiClock} />
                                </div>
                            </InfoCard>

                            {/* Contact & Personal */}
                            <InfoCard title="Contact & Personal" icon={FiPhone}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow label="Phone" value={contact} icon={FiPhone} />
                                    <InfoRow label="Email" value={email} icon={FiMail} />
                                    <InfoRow label="Birthday" value={formatDate(birthday)} icon={FiHeart} />
                                    <InfoRow label="Anniversary" value={formatDate(anniversary)} icon={FiCalendar} />
                                </div>
                            </InfoCard>

                            {/* Department & Jurisdiction */}
                            <InfoCard title="Department & Jurisdiction" icon={FiMapPin}>
                                <div className="space-y-2">
                                    <InfoRow label="Office Name" value={officeName} icon={FiHome} />
                                    <InfoRow label="Jurisdiction Area" value={districtBlockRegion} icon={FiMap} />
                                    <InfoRow label="Effective Language" value={effectiveLanguage} icon={FiGlobe} />
                                </div>
                            </InfoCard>

                            {/* Professional Details */}
                            <InfoCard title="Professional Details" icon={FiActivity}>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2 font-medium">Frequently Requested Services</p>
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
                                        <p className="text-sm text-gray-500 mb-2 font-medium">Data Management Tools</p>
                                        <div className="flex flex-wrap gap-2">
                                            {dataManagementTools?.map((t, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-100">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow label="Hobbies" value={hobbies} icon={FiActivity} />
                                        <InfoRow label="Key Goals" value={goals} icon={FiTarget} />
                                    </div>
                                </div>
                            </InfoCard>
                        </>
                    ) : (
                        <>
                            {/* FPO Identity */}
                            <InfoCard title="FPO Identity" icon={FiFileText}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow label="Registration No" value={registrationNumber} icon={FiHash} />
                                    <InfoRow label="Registration Act" value={registrationAct} />
                                    <InfoRow label="Year of Establishment" value={yearOfEstablishment} icon={FiCalendar} />
                                    <InfoRow label="Website/URL" value={websiteAppUrl} icon={FiGlobe} />
                                </div>
                            </InfoCard>

                            {/* Official Contact */}
                            <InfoCard title="Official Contact" icon={FiMapPin}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow label="Office Address" value={officeAddress} icon={FiMapPin} />
                                    <InfoRow label="Official Phone" value={officialContactNumber} icon={FiPhone} />
                                    <InfoRow label="Official Email" value={officialEmailId} icon={FiMail} />
                                    <InfoRow label="Contact Person" value={contactPersonName} icon={FiUser} />
                                </div>
                            </InfoCard>

                            {/* Governance & Staff */}
                            <InfoCard title="Governance & Staff" icon={FiUsers}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Board Members</p>
                                        <p className="text-lg font-bold text-gray-800">{numberOfBoardMembers}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Staff Members</p>
                                        <p className="text-lg font-bold text-gray-800">{numberOfStaffMembers}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Active Members</p>
                                        <p className="text-lg font-bold text-gray-800">{totalActiveMembers}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Member Categories</p>
                                        <p className="text-sm font-bold text-gray-800">{memberCategories?.length || 0}</p>
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Member Profile & Engagement */}
                            <InfoCard title="Member Profile & Engagement" icon={FiActivity}>
                                <div className="space-y-4">
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
                            </InfoCard>

                            {/* Business Operations */}
                            <InfoCard title="Business Operations" icon={FiGrid}>
                                <div className="space-y-4">
                                    <InfoRow label="Operational Area" value={operationalArea} icon={FiMap} />
                                    <InfoRow label="Major Crops Handled" value={majorCropsHandled} icon={FiActivity} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-xs text-green-600 mb-1">Annual Turnover</p>
                                            <p className="text-lg font-bold text-gray-900">{annualTurnover || 'Not provided'}</p>
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

                            {/* Market & Innovation */}
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
                                        <InfoRow label="Top Priorities" value={topPriorities} icon={FiCheckCircle} />
                                    </div>
                                </InfoCard>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {typeOfProfile === 'Farmer' ? (
                        <>
                            {/* Financial Information */}
                            <InfoCard title="Financial Information" icon={FiDollarSign}>
                                <div className="space-y-2">
                                    <InfoRow label="Bank Name" value={bankName} icon={FiCreditCard} />
                                    <InfoRow label="Existing Loan" value={`₹${parseInt(existingLoan || 0).toLocaleString()}`} icon={FiDollarSign} />
                                    <InfoRow label="Payment Mode" value={paymentMode} icon={FiCreditCard} />
                                </div>
                            </InfoCard>

                            {/* Purchase Details */}
                            <InfoCard title="Purchase Details" icon={FiPackage}>
                                <div className="space-y-2">
                                    <InfoRow label="Product Name" value={productName} icon={FiBox} />
                                    <InfoRow label="Purpose for Buying" value={purposeForBuying} icon={FiTarget} />
                                    <InfoRow
                                        label="Tentative Buying Date"
                                        value={formatDate(tentativeBuyingDate)}
                                        icon={FiCalendar}
                                    />
                                </div>
                            </InfoCard>

                            {/* Lead Information */}
                            <InfoCard title="Lead Information" icon={FiTarget}>
                                <div className="space-y-2">
                                    <InfoRow
                                        label="Lead Generated Through"
                                        value={Array.isArray(leadGeneratedThrough) ? leadGeneratedThrough.join(', ') : leadGeneratedThrough}
                                        icon={FiTarget}
                                    />
                                    <InfoRow
                                        label="Last Meeting"
                                        value={formatDate(lastMeeting)}
                                        icon={FiCalendar}
                                    />
                                    <InfoRow
                                        label="Next Meeting"
                                        value={nextMeeting?.[0] ? formatDate(nextMeeting[0]) : 'Not scheduled'}
                                        icon={FiCalendar}
                                    />
                                </div>
                            </InfoCard>
                        </>
                    ) : typeOfProfile === 'Government Officer' ? (
                        <>
                            <InfoCard title="Profile Preferences" icon={FiTarget}>
                                <div className="space-y-2">
                                    <InfoRow label="Hobbies" value={hobbies} icon={FiActivity} />
                                    <InfoRow label="Key Goals" value={goals} icon={FiTarget} />
                                </div>
                            </InfoCard>
                        </>
                    ) : (
                        <>
                        </>
                    )}

                    <div className="flex justify-center bg-white rounded-xl gap-4 pt-4 mt-4 border-t">
                        <Button
                            variant={1}
                            type="button"
                            text="Back"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEnviroIndForm;