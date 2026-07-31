import React, { useEffect, useState } from 'react';
import { useNavigate, useParams,useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../../../hooks/theme/useTheme';
import useMonthlyPlanning from '../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning';
import BreadCrumb from '../../../../../components/uiComponents/breadcrumb/BreadCrumb';
import Pagination from '../../../../../components/uiComponents/pagination/Pagination';
import { TiEye } from 'react-icons/ti';
import { FiFilter, FiCalendar, FiPhone, FiPackage, FiBox } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import Button from '../../../../../components/uiComponents/button/Button';
import LoaderSpinner from '../../../../../components/uiComponents/loader/LoaderSpinner';

const ViewMonthWisePlanning = () => {
    const { loading, fetchMonthWisePlanning, monthWisePlanning,fetchMonthlySummary, monthlySummary, resetMonthlyPlanningDetails } = useMonthlyPlanning();
     const [selectedCard, setSelectedCard] = useState();
        const { id } = useParams();
    const { month, year } = useParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onPageChange = (data) => {
        setPage(data);
    };

    const onItemsPerPageChange = (data) => {
        setLimit(data);
    };

    useEffect(() => {
        fetchMonthWisePlanning(page, limit, month, year);
    }, [page, limit]);

        const handleCardClick = (type) => {
    setSelectedCard(type);

    fetchMonthlySummary(id, month, year, type);
     setIsModalOpen(true);
};

    // Format date and time
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        const datePart = d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        return datePart;
    };

    // Get products list with quantities as formatted string
    const getProductsList = (products) => {
        if (!products || products.length === 0) return "-";
        return products.map(p => `${p.product} (${p.quantity})`).join(", ");
    };

    // Get total quantity from products array
    const getTotalQuantity = (products) => {
        if (!products || products.length === 0) return 0;
        const total = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
        return total;
    };

    // Get unique products count
    const getUniqueProductsCount = (products) => {
        if (!products || products.length === 0) return 0;
        return new Set(products.map(p => p.product)).size;
    };

    // Stats cards data
    const stats = [
    {
        id: "hospital",
        label: "Total Hospital Coverage",
        value: monthWisePlanning?.totalHospitals || 0,
        icon: HiOutlineDocumentText,
        color: "blue",
         clickable: true,
    },
    {
        id: "doctor",
        label: "Total Doctor Coverage",
        value:
            monthWisePlanning?.totalDoctors|| 0,
        icon: FiPhone,
        color: "green",
         clickable: true,
    },
    {
        id: "product",
        label: "Total Products Coverage",
        value:
            monthWisePlanning?.totalProducts || 0,
        icon: FiPackage,
        color: "purple",
         clickable: true,
    },
    {
        id: "quantity",
        label: "Total Quantity",
        value:
            monthWisePlanning?.totalQuantity|| 0,
        icon: FiBox,
        color: "orange",
         clickable: false,
    },
];


    const getStatStyles = (color) => {
        const styles = {
            blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
            green: { bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
            purple: { bg: "bg-purple-50", text: "text-purple-600", iconBg: "bg-purple-100" },
            orange: { bg: "bg-orange-50", text: "text-orange-600", iconBg: "bg-orange-100" },
        };
        return styles[color] || styles.blue;
    };

    return (
        <div className="w-full min-h-screen" style={{ backgroundColor: theme.backgroundColor }}>
            {/* Breadcrumbs */}
            <BreadCrumb
                linkText={[
                    { text: "Customer Visit Plan" },
                    {
                        text: "Monthly Planning",
                        href: "/sales-executive/monthly-planning",
                    },
                    { text: `View ${month} ${year} Planning` },
                ]}
            />
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2 bg-white p-4 rounded-2xl">
                    <h1 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                        {month && year ? `${month} ${year}` : "Monthly"} Planning Overview
                    </h1>

                    <Button
                        onClick={() => navigate("/sales-executive/monthly-planning/create-monthly-plan")}
                        variant={1}
                        text="+ Create Monthly Plan"
                        className="shadow-md hover:shadow-lg transition-all"
                    />
                </div>

                   {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        const style = getStatStyles(stat.color);
                        return (
                            // <div
                            //     key={idx}
                            //     className={`${style.bg} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200`}
                            // >
                            <div
    key={idx}
 onClick={() => stat.clickable && handleCardClick(stat.id)}
 className={`
    ${style.bg}
    rounded-xl
    p-4
    shadow-sm
    transition-all
    ${
        stat.clickable
            ? "cursor-pointer hover:shadow-lg hover:scale-105"
            : "cursor-not-allowed opacity-60"
    }
    ${
        selectedCard === stat.id && stat.clickable
            ? "ring-2 ring-blue-500"
            : ""
    }
`}
>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                        <p className={`text-2xl font-bold mt-1 ${style.text}`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`${style.iconBg} p-3 rounded-full`}>
                                        <Icon className={`w-6 h-6 ${style.text}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
{isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-hidden">

            {/* Header */}
            <div
                className="flex justify-between items-center px-6 py-4 border-b"
                style={{ backgroundColor: theme.secondaryColor }}
            >
                <h2
                    className="text-xl font-semibold"
                    style={{ color: theme.primaryColor }}
                >
                    {selectedCard?.charAt(0).toUpperCase() +
                        selectedCard?.slice(1)}{" "}
                    Details
                </h2>

                <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-2xl font-bold hover:text-red-500"
                >
                    ×
                </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">

                {loading ? (
                    <LoaderSpinner />
                ) : monthlySummary?.[selectedCard]?.length > 0 ? (
                    monthlySummary[selectedCard].map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center p-3 mb-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {item.name}
                                </h3>
                            </div>

                            <div
                                className="px-3 py-1 rounded-full text-white font-semibold"
                                style={{ backgroundColor: theme.primaryColor }}
                            >
                                {item.totalCalls} Calls
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        No Data Available
                    </div>
                )}
            </div>
        </div>
    </div>
)}
            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr style={{ backgroundColor: theme.secondaryColor }} className="border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#374151" }}>
                                    Sr.No.
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#374151" }}>
                                    Date & Time
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#374151" }}>
                                    No. of Calls
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#374151" }}>
                                    Products & Quantity
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#374151" }}>
                                    Total Quantity
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: "#374151" }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center">
                                            <LoaderSpinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : monthWisePlanning?.data && monthWisePlanning.data.length > 0 ? (
                                monthWisePlanning.data.map((entry, index) => {
                                    const productsList = getProductsList(entry.products);
                                    const totalQuantity = getTotalQuantity(entry.products);

                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-all duration-150 group"
                                        >
                                            <td className="px-6 py-4 align-top">
                                                <span className="font-medium" style={{ color: theme.primaryColor }}>
                                                    {(page - 1) * limit + index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-start gap-2">
                                                    <FiCalendar className="text-gray-400 text-sm mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">
                                                        {formatDateTime(entry.date)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-2">
                                                    <FiPhone className="text-green-500 text-sm flex-shrink-0" />
                                                    <span className="text-gray-700 font-medium">
                                                        {entry.noOfCalls || "-"} {entry.noOfCalls === 1 ? "call" : "calls"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-wrap gap-2 max-w-md">
                                                    {entry.products && entry.products.length > 0 ? (
                                                        entry.products.map((product, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs"
                                                                style={{ backgroundColor: `${theme.primaryColor}10`, color: theme.primaryColor }}
                                                            >
                                                                <FiPackage size={12} />
                                                                {product.product}
                                                                <span className="font-semibold">({product.quantity})</span>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-2">
                                                    <FiBox className="text-purple-500 text-sm flex-shrink-0" />
                                                    <span className="text-gray-700 font-semibold">
                                                        {totalQuantity} {totalQuantity === 1 ? "unit" : "units"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top text-center">
                                                <button
                                                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110 inline-flex items-center justify-center"
                                                    style={{ backgroundColor: `${theme.primaryColor}15` }}
                                                    onClick={() => {
                                                        resetMonthlyPlanningDetails();
                                                        navigate(
                                                            `/sales-executive/monthly-planning/view-month-wise/view-day-wise-planning/${monthWisePlanning?.salesId}/${entry.date}`,
                                                        );
                                                    }}
                                                >
                                                    <TiEye
                                                        size={18}
                                                        style={{ color: theme.primaryColor }}
                                                        className="hover:opacity-80"
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <HiOutlineDocumentText className="w-12 h-12 text-gray-300" />
                                            <p className="text-gray-500">No monthly planning data available</p>
                                            <Button
                                                onClick={() => navigate("/sales-executive/monthly-planning/create-monthly-plan")}
                                                variant={1}
                                                text="Create Your First Plan"
                                                className="mt-2"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && monthWisePlanning?.data?.length > 0 && (
                    <Pagination
                        currentPage={monthWisePlanning?.currentPage}
                        totalItems={monthWisePlanning?.totalPlans}
                        itemsPerPage={limit}
                        totalPages={monthWisePlanning?.totalPages}
                        onPageChange={onPageChange}
                        onItemsPerPageChange={onItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default ViewMonthWisePlanning;