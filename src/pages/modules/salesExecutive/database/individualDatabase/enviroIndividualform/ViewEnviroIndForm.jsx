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
    FiUsers,
    FiBriefcase,
    FiDatabase,
    FiEdit2,
    FiChevronLeft,
    FiTag,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiHeart,
    FiGlobe,
    FiMap,
    FiHash
} from 'react-icons/fi';

const ViewEnviroIndForm = () => {
    const {
        error,
        fetchEnviroIndividualDetails,
        enviroIndividualDetails,
        loading,
        resetEnviroIndividualDetails,
    } = useEnviroIndividualDB();
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const location = useLocation();
    // ✅ Profile used for branching. The API's own `typeOfProfile` wins over the
    //    router hint, because the API is what actually describes THIS record
    //    (and newer Waste Management rows come back as e.g. "Government",
    //    which would otherwise drop into the wrong branch).
    const routerProfileType = location.state?.typeOfProfile;
    const resolvedTypeOfProfile =
        enviroIndividualDetails?.typeOfProfile || routerProfileType || 'Farmer';
    const typeOfProfile = resolvedTypeOfProfile;

    // Government rows are stored as "Government Officer" (Agriculture) or
    // "Government" (Waste Management) - render both through the same branch.
    const isGovernmentType =
        typeOfProfile === 'Government Officer' || typeOfProfile === 'Government';
    const isFarmerProfile = typeOfProfile === 'Farmer';
    const isFpoProfile = typeOfProfile === 'FPO';
    // Waste Management rows that aren't a Farmer / Government Officer / FPO
    // get their own generic layout built from the fields the API returns.
    const isWasteProfile =
        !isFarmerProfile && !isGovernmentType && !isFpoProfile &&
        enviroIndividualDetails?.segment === 'Waste Management';

    // ✅ Loads the individual the route points at. The same API is used for every
    //    profile type (Farmer / Government Officer / FPO) - the response carries
    //    its own `typeOfProfile`, which is what decides how the page renders.
    useEffect(() => {
        if (!id) return;

        // Drop the previously opened individual first, so the page can never
        // show data that belongs to the row the user clicked before this one.
        resetEnviroIndividualDetails();
        fetchEnviroIndividualDetails(id);
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not set';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return dateStr;
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

    const toList = (value) => {
        if (Array.isArray(value)) {
            return value.filter(
                (item) => item !== null && item !== undefined && item !== '',
            );
        }
        if (value === null || value === undefined || value === '') return [];
        if (typeof value === 'string') {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
        return [value];
    };

    const InfoCard = ({ title, icon: Icon, children }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div
                className="px-6 py-4 border-b border-gray-100 flex items-center gap-3"
                style={{ backgroundColor: theme.secondaryColor + '15' }}
            >
                <Icon className="text-lg" style={{ color: theme.primaryColor }} />
                <h3 className="font-semibold text-gray-800">{title}</h3>
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
                    <div className="inline-block">{value}</div>
                ) : (
                    <p
                        className={`font-medium break-words ${
                            highlight ? 'text-blue-600 font-semibold' : 'text-gray-900'
                        }`}
                    >
                        {value || 'Not provided'}
                    </p>
                )}
            </div>
        </div>
    );

    const ChipList = ({ items, tone = 'blue' }) => {
        const tones = {
            blue: 'bg-blue-50 text-blue-700 border-blue-100',
            green: 'bg-green-50 text-green-700 border-green-100',
            yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
            purple: 'bg-purple-50 text-purple-700 border-purple-100',
            gray: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        const list = toList(items);
        if (!list.length) return <p className="text-sm text-gray-400">Not provided</p>;
        return (
            <div className="flex flex-wrap gap-2">
                {list.map((item, i) => (
                    <span
                        key={i}
                        className={`px-2 py-1 rounded text-xs border ${tones[tone]}`}
                    >
                        {typeof item === 'object' && item !== null
                            ? item.name || item.value || item.label || JSON.stringify(item)
                            : String(item)}
                    </span>
                ))}
            </div>
        );
    };

    const StatusBadge = ({ status }) => {
        const getStatusConfig = (status) => {
            if (!status)
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <FiTag className="mr-2" />,
                };

            const statusText = Array.isArray(status) ? status[0] : status;

            switch (statusText?.toLowerCase()) {
                case 'pending':
                    return {
                        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        icon: <FiClock className="mr-2" />,
                    };
                case 'approved':
                    return {
                        color: 'bg-green-100 text-green-800 border-green-200',
                        icon: <FiCheckCircle className="mr-2" />,
                    };
                case 'rejected':
                    return {
                        color: 'bg-red-100 text-red-800 border-red-200',
                        icon: <FiXCircle className="mr-2" />,
                    };
                case 'completed':
                    return {
                        color: 'bg-blue-100 text-blue-800 border-blue-200',
                        icon: <FiCheckCircle className="mr-2" />,
                    };
                default:
                    return {
                        color: 'bg-purple-100 text-purple-800 border-purple-200',
                        icon: <FiTag className="mr-2" />,
                    };
            }
        };

        const statusText = Array.isArray(status)
            ? status.join(', ')
            : status;

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
                    <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 mt-4">Loading individual details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="text-red-800 font-semibold mb-2">
                    Error loading details
                </h3>
                <p className="text-red-600">{error}</p>
                <Button
                    variant={3}
                    text="Go Back"
                    icon={<FiChevronLeft />}
                    onClick={() => navigate(-1)}
                    className="mt-4"
                />
            </div>
        );
    }

    if (!enviroIndividualDetails) {
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
                            onClick={() => navigate('/sales-executive/database')}
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
        typeOfProfile: profileType,
        segment,
        leadOwner,
        salesPersonName,
        status,
        // Common / Waste Management fields
        uniqueId,
        region,
        organizationName,
        addedBy,
        addedById,
        // Farmer fields
        panNo,
        customerType,
        address,
        cityTownVillage,
        taluka,
        district,
        state,
        pinCode,
        totalLandOwned,
        cropName,
        cropType,
        sprayingType,
        cropDuration,
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
        contactPersonDesignation,
        createdAt,
        updatedAt,
        _id,
    } = enviroIndividualDetails;

    const displayName =
        fpoName ||
        [firstName, lastName].filter(Boolean).join(' ').trim() ||
        organizationName ||
        uniqueId ||
        'Unknown Individual';

    return (
        <div className="min-h-screen">
            <BreadCrumb
                linkText={[
                    { text: 'Database' },
                    { text: 'Individual Database', href: '/sales-executive/database' },
                    { text: displayName },
                ]}
            />

            {/* Header with Profile Summary */}
            <div className="mb-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Gradient Header */}
                    <div
                        className="h-20 relative"
                        style={{
                            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white">
                                <FiUser
                                    className="text-4xl"
                                    style={{ color: theme.primaryColor }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {displayName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    {(officialEmailId || email) && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FiMail className="text-sm" />
                                            <span className="text-sm">
                                                {officialEmailId || email}
                                            </span>
                                        </div>
                                    )}
                                    {(officialContactNumber || contact) && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FiPhone className="text-sm" />
                                            <span className="text-sm">
                                                {officialContactNumber || contact}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {typeOfProfile && (
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                            <FiUser className="inline mr-1" />{' '}
                                            {typeOfProfile}
                                        </span>
                                    )}
                                    {segment && (
                                        <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                                            <FiTag className="inline mr-1" /> {segment}
                                        </span>
                                    )}
                                    {uniqueId && (
                                        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                                            <FiHash className="inline mr-1" /> {uniqueId}
                                        </span>
                                    )}
                                    {isFarmerProfile && customerType && (
                                        <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">
                                            <FiUsers className="inline mr-1" /> {customerType}
                                        </span>
                                    )}
                                    {status ? <StatusBadge status={status} /> : null}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {isFarmerProfile ? (
                                    <>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">
                                                Lead Owner
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {leadOwner || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">
                                                Sales Person
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {salesPersonName || 'Not assigned'}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">
                                                Added By
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {addedBy || 'System'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">
                                                Sales Person
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {salesPersonName || 'Not assigned'}
                                            </p>
                                        </div>
                                    </>
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
                    {isFarmerProfile ? (
                        <>
                            {/* Farmer Specific Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="Personal Details" icon={FiUser}>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="First Name"
                                            value={firstName}
                                            icon={FiUser}
                                        />
                                        <InfoRow
                                            label="Last Name"
                                            value={lastName}
                                            icon={FiUser}
                                        />
                                        <InfoRow
                                            label="PAN Number"
                                            value={panNo}
                                            icon={FiFileText}
                                            highlight
                                        />
                                        <InfoRow
                                            label="Customer Type"
                                            value={customerType}
                                            icon={FiUsers}
                                        />
                                    </div>
                                </InfoCard>

                                <InfoCard title="Contact Information" icon={FiPhone}>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="Phone Number"
                                            value={contact}
                                            icon={FiPhone}
                                            highlight
                                        />
                                        <InfoRow
                                            label="Email Address"
                                            value={email}
                                            icon={FiMail}
                                        />
                                        <div className="pt-2">
                                            <p className="text-sm text-gray-500 mb-2">
                                                Quick Actions
                                            </p>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                    Call
                                                </button>
                                                <button className="px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                                                    Email
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>

                            <InfoCard title="Address & Location" icon={FiMapPin}>
                                <div className="space-y-4">
                                    <InfoRow
                                        label="Complete Address"
                                        value={address}
                                        icon={FiMapPin}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow
                                            label="Village/Town"
                                            value={cityTownVillage}
                                            icon={FiHome}
                                        />
                                        <InfoRow label="Taluka" value={taluka} />
                                        <InfoRow label="District" value={district} />
                                        <InfoRow label="State" value={state} />
                                        <InfoRow label="PIN Code" value={pinCode} />
                                    </div>
                                    <InfoRow
                                        label="Total Land Owned"
                                        value={totalLandOwned}
                                        highlight
                                    />
                                </div>
                            </InfoCard>

                            <InfoCard title="Farming Details" icon={FiGrid}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow
                                        label="Primary Crop"
                                        value={cropName}
                                        icon={FiActivity}
                                        highlight
                                    />
                                    <InfoRow label="Crop Type" value={cropType} />
                                    <InfoRow label="Spraying Type" value={sprayingType} />
                                    <InfoRow
                                        label="Spraying Duration"
                                        value={cropDuration}
                                    />
                                </div>
                            </InfoCard>
                        </>
                    ) : isGovernmentType ? (
                        <>
                            {/* Government Officer Specific Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="Officer Profile" icon={FiUser}>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="First Name"
                                            value={firstName}
                                            icon={FiUser}
                                        />
                                        <InfoRow
                                            label="Last Name"
                                            value={lastName}
                                            icon={FiUser}
                                        />
                                        <InfoRow
                                            label="Designation"
                                            value={designation}
                                            icon={FiBriefcase}
                                            highlight
                                        />
                                        <InfoRow
                                            label="Experience"
                                            value={yearsOfExperience}
                                            icon={FiClock}
                                        />
                                    </div>
                                </InfoCard>

                                <InfoCard title="Contact & Personal" icon={FiPhone}>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="Phone"
                                            value={contact}
                                            icon={FiPhone}
                                            highlight
                                        />
                                        <InfoRow label="Email" value={email} icon={FiMail} />
                                        <InfoRow
                                            label="Birthday"
                                            value={formatDate(birthday)}
                                            icon={FiHeart}
                                        />
                                        <InfoRow
                                            label="Anniversary"
                                            value={formatDate(anniversary)}
                                            icon={FiCalendar}
                                        />
                                    </div>
                                </InfoCard>
                            </div>

                            <InfoCard title="Department & Jurisdiction" icon={FiMapPin}>
                                <div className="space-y-4">
                                    <InfoRow
                                        label="Office Name"
                                        value={officeName}
                                        icon={FiHome}
                                        highlight
                                    />
                                    <InfoRow
                                        label="Jurisdiction Area"
                                        value={districtBlockRegion}
                                        icon={FiMap}
                                    />
                                    <InfoRow
                                        label="Effective Language"
                                        value={effectiveLanguage}
                                        icon={FiGlobe}
                                    />
                                </div>
                            </InfoCard>

                            <InfoCard title="Professional Details" icon={FiActivity}>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Frequently Requested Services
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {frequentlyRequestedServices?.map((s, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow
                                            label="Scheme Understanding"
                                            value={schemeUnderstanding}
                                        />
                                        <InfoRow
                                            label="Digital Data Maintenance"
                                            value={dataMaintainedDigitally}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Data Management Tools
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {dataManagementTools?.map((t, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-100"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow
                                            label="Hobbies"
                                            value={hobbies}
                                            icon={FiActivity}
                                        />
                                        <InfoRow
                                            label="Key Goals"
                                            value={goals}
                                            icon={FiTarget}
                                            highlight
                                        />
                                    </div>
                                </div>
                            </InfoCard>
                        </>
                    ) : isFpoProfile ? (
                        <>
                            {/* FPO Identity */}
                            <InfoCard title="FPO Identity" icon={FiFileText}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow
                                        label="Registration No"
                                        value={registrationNumber}
                                        icon={FiHash}
                                        highlight
                                    />
                                    <InfoRow label="Registration Act" value={registrationAct} />
                                    <InfoRow
                                        label="Year of Establishment"
                                        value={yearOfEstablishment}
                                        icon={FiCalendar}
                                    />
                                    <InfoRow
                                        label="Website/URL"
                                        value={websiteAppUrl}
                                        icon={FiGlobe}
                                    />
                                </div>
                            </InfoCard>

                            {/* Official Contact */}
                            <InfoCard title="Official Contact" icon={FiMapPin}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRow
                                        label="Office Address"
                                        value={officeAddress}
                                        icon={FiMapPin}
                                    />
                                    <InfoRow
                                        label="Official Phone"
                                        value={officialContactNumber}
                                        icon={FiPhone}
                                        highlight
                                    />
                                    <InfoRow
                                        label="Official Email"
                                        value={officialEmailId}
                                        icon={FiMail}
                                    />
                                    <InfoRow
                                        label="Contact Person"
                                        value={contactPersonName}
                                        icon={FiUser}
                                    />
                                </div>
                            </InfoCard>

                            {/* Governance & Staff */}
                            <InfoCard title="Governance & Staff" icon={FiUsers}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Board Members
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {numberOfBoardMembers}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Staff Members
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {numberOfStaffMembers}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Active Members
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {totalActiveMembers}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Member Categories
                                        </p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {memberCategories?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Member Profile & Engagement */}
                            <InfoCard title="Member Profile & Engagement" icon={FiActivity}>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2 font-medium">
                                            Member Categories
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {memberCategories?.map((c, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                >
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2 font-medium">
                                            Communication Channels
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {primaryCommunicationChannels?.map((ch, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-100"
                                                >
                                                    {ch}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Business Operations */}
                            <InfoCard title="Business Operations" icon={FiGrid}>
                                <div className="space-y-4">
                                    <InfoRow
                                        label="Operational Area"
                                        value={operationalArea}
                                        icon={FiMap}
                                        highlight
                                    />
                                    <InfoRow
                                        label="Major Crops Handled"
                                        value={majorCropsHandled}
                                        icon={FiActivity}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-xs text-green-600 mb-1">
                                                Annual Turnover
                                            </p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {annualTurnover || 'Not provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                                Revenue Sources
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {majorRevenueSources?.map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs border border-yellow-100"
                                                    >
                                                        {s}
                                                    </span>
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
                                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                                Key Buyer Types
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {keyBuyerTypes?.map((b, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs border border-purple-100"
                                                    >
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </InfoCard>
                                <InfoCard title="Planning & Challenges" icon={FiClock}>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="Top Challenges"
                                            value={topChallenges}
                                            icon={FiXCircle}
                                        />
                                        <InfoRow
                                            label="Top Priorities"
                                            value={topPriorities}
                                            icon={FiCheckCircle}
                                            highlight
                                        />
                                    </div>
                                </InfoCard>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Waste Management / Generic individual content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard title="Individual Details" icon={FiUser}>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="First Name"
                                            value={firstName}
                                            icon={FiUser}
                                        />
                                        <InfoRow
                                            label="Last Name"
                                            value={lastName}
                                            icon={FiUser}
                                        />
                                        <InfoRow
                                            label="Unique ID"
                                            value={uniqueId}
                                            icon={FiHash}
                                            highlight
                                        />
                                        <InfoRow
                                            label="Profile Type"
                                            value={typeOfProfile}
                                            icon={FiUsers}
                                        />
                                    </div>
                                </InfoCard>

                                <InfoCard title="Contact Information" icon={FiPhone}>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="Phone Number"
                                            value={contact}
                                            icon={FiPhone}
                                            highlight
                                        />
                                        <InfoRow label="Email" value={email} icon={FiMail} />
                                        <InfoRow
                                            label="Associated Organization"
                                            value={organizationName}
                                            icon={FiBriefcase}
                                        />
                                    </div>
                                </InfoCard>
                            </div>

                            <InfoCard title="Address & Location" icon={FiMapPin}>
                                <div className="space-y-4">
                                    <InfoRow
                                        label="Complete Address"
                                        value={address}
                                        icon={FiMapPin}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow label="Region" value={region} icon={FiGlobe} />
                                        <InfoRow
                                            label="Village/Town"
                                            value={cityTownVillage}
                                            icon={FiHome}
                                        />
                                        <InfoRow label="Taluka" value={taluka} icon={FiMap} />
                                        <InfoRow label="District" value={district} icon={FiMap} />
                                        <InfoRow label="State" value={state} icon={FiMap} />
                                        <InfoRow label="PIN Code" value={pinCode} />
                                    </div>
                                </div>
                            </InfoCard>

                            <InfoCard
                                title={
                                    isWasteProfile
                                        ? 'Waste Management Details'
                                        : 'Segment & Lead Information'
                                }
                                icon={FiActivity}
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow
                                            label="Segment"
                                            value={segment}
                                            icon={FiTag}
                                            highlight
                                        />
                                        <InfoRow label="Lead Owner" value={leadOwner} icon={FiUser} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2 font-medium">
                                            Lead Generated Through
                                        </p>
                                        <ChipList items={leadGeneratedThrough} tone="blue" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow
                                            label="Last Meeting"
                                            value={formatDate(lastMeeting)}
                                            icon={FiClock}
                                        />
                                        <InfoRow
                                            label="Next Meeting"
                                            value={formatDate(toList(nextMeeting)[0])}
                                            icon={FiCalendar}
                                        />
                                    </div>
                                </div>
                            </InfoCard>
                        </>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {isFarmerProfile ? (
                        <>
                            {/* Financial Information */}
                            <InfoCard title="Financial Information" icon={FiDollarSign}>
                                <div className="space-y-2">
                                    <InfoRow label="Bank Name" value={bankName} icon={FiCreditCard} />
                                    <InfoRow
                                        label="Existing Loan"
                                        value={formatCurrency(existingLoan)}
                                        icon={FiDollarSign}
                                    />
                                    <InfoRow
                                        label="Payment Mode"
                                        value={paymentMode}
                                        icon={FiCreditCard}
                                    />
                                </div>
                            </InfoCard>

                            {/* Purchase Details */}
                            <InfoCard title="Purchase Details" icon={FiPackage}>
                                <div className="space-y-2">
                                    <InfoRow
                                        label="Product Name"
                                        value={productName}
                                        icon={FiBox}
                                        highlight
                                    />
                                    <InfoRow
                                        label="Purpose for Buying"
                                        value={purposeForBuying}
                                        icon={FiTarget}
                                    />
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FiCalendar className="text-yellow-600" />
                                            <span className="text-sm font-medium text-yellow-800">
                                                Tentative Date
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatDate(tentativeBuyingDate)}
                                        </p>
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Lead Information */}
                            <InfoCard title="Lead Information" icon={FiTarget}>
                                <div className="space-y-2">
                                    <InfoRow
                                        label="Lead Generated Through"
                                        value={
                                            Array.isArray(leadGeneratedThrough)
                                                ? leadGeneratedThrough.join(', ')
                                                : leadGeneratedThrough
                                        }
                                        icon={FiTarget}
                                    />
                                    <InfoRow
                                        label="Last Meeting"
                                        value={formatDate(lastMeeting)}
                                        icon={FiCalendar}
                                    />
                                    <InfoRow
                                        label="Next Meeting"
                                        value={
                                            nextMeeting?.[0]
                                                ? formatDate(nextMeeting[0])
                                                : 'Not scheduled'
                                        }
                                        icon={FiCalendar}
                                    />
                                </div>
                            </InfoCard>
                        </>
                    ) : isFpoProfile ? (
                        <InfoCard title="Banking Details" icon={FiCreditCard}>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-600 mb-1">Account Info</p>
                                <p className="text-sm font-semibold text-gray-900 whitespace-pre-wrap">
                                    {bankAccountDetails}
                                </p>
                            </div>
                        </InfoCard>
                    ) : isGovernmentType ? (
                        <InfoCard title="Profile Preferences" icon={FiTarget}>
                            <div className="space-y-4">
                                <InfoRow label="Hobbies" value={hobbies} icon={FiActivity} />
                                <InfoRow
                                    label="Key Goals"
                                    value={goals}
                                    icon={FiTarget}
                                    highlight
                                />
                            </div>
                        </InfoCard>
                    ) : (
                        <>
                            <InfoCard title="Lead Information" icon={FiActivity}>
                                <div className="space-y-4">
                                    <InfoRow
                                        label="Unique ID"
                                        value={uniqueId}
                                        icon={FiHash}
                                        highlight
                                    />
                                    <InfoRow label="Segment" value={segment} icon={FiGrid} />
                                    <InfoRow label="Added By" value={addedBy} icon={FiUser} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Lead Source" icon={FiTarget}>
                                <ChipList items={leadGeneratedThrough} tone="green" />
                            </InfoCard>

                            <InfoCard title="Record Information" icon={FiClock}>
                                <div className="space-y-4">
                                    <InfoRow
                                        label="Created On"
                                        value={formatDate(createdAt)}
                                        icon={FiCalendar}
                                    />
                                    <InfoRow
                                        label="Last Updated"
                                        value={formatDate(updatedAt)}
                                        icon={FiClock}
                                    />
                                    <InfoRow
                                        label="Added By"
                                        value={addedBy || 'System'}
                                        icon={FiUser}
                                    />
                                    <InfoRow
                                        label="Sales Person"
                                        value={salesPersonName || 'Not assigned'}
                                        icon={FiBriefcase}
                                    />
                                </div>
                            </InfoCard>
                        </>
                    )}

                    {/* Back + Edit buttons */}
                    <div className="flex justify-center bg-white rounded-xl gap-4 pt-4 mt-4 border-t">
                        <Button
                            variant={3}
                            type="button"
                            text="Go Back"
                            icon={<FiChevronLeft />}
                            onClick={() => navigate(-1)}
                            className="px-6 py-2"
                        />
                        {/* {_id && (
                            <Button
                                variant={1}
                                type="button"
                                text="Edit Details"
                                icon={<FiEdit2 />}
                                onClick={() =>
                                    navigate(`/sales-executive/database/edit-enviro-individual/${_id}`)
                                }
                                className="px-6 py-2"
                                style={{ backgroundColor: theme.primaryColor }}
                            />
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEnviroIndForm;
