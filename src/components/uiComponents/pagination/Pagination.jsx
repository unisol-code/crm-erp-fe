import { useState, useEffect } from "react"; // Import useEffect
import { useTheme } from "../../../hooks/theme/useTheme";

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    showRowPerPage = false,
}) => {
    const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage ?? 10);
    const itemsPerPageOptions = [1, 2, 5, 10, 20, 50, 100]
    console.log("currentPage prop received by Pagination:", currentPage);

    useEffect(() => {
        if (itemsPerPage !== undefined && itemsPerPage !== itemsPerPageState) {
            setItemsPerPageState(itemsPerPage);
        }
    }, [itemsPerPage, itemsPerPageState]);

    const { theme } = useTheme();

    const handlePrevClick = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        console.log(e)
        const value = parseInt(e.target.value, 10);
        setItemsPerPageState(value);
        if (onItemsPerPageChange) {
            onItemsPerPageChange(value);

        }
        onPageChange(1);
    };

    const handlePageClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                endPage = 4;
            }

            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            if (startPage > 2) {
                pages.push("...");
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };
    if (!currentPage || !totalPages) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-4 flex-wrap px-4 py-2 w-full bottom-sticky bg-white border-t-4" style={{ borderColor: theme.highlightColor }}>
            <div className="flex gap-2 items-center">
                <div>Rows per page</div>
                <select
                    value={itemsPerPageState}
                    onChange={handleItemsPerPageChange}
                    className="border px-6 py-2 outline-none"
                >
                    {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

            </div>

            <p>
                Showing {(currentPage - 1) * itemsPerPageState + 1} to{" "}
                {Math.min(currentPage * itemsPerPageState, totalItems)} of{" "}
                {totalItems} Entries
            </p>
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onMouseEnter={(e) => {
                        if (currentPage !== 1) {
                            e.currentTarget.style.backgroundColor = theme.highlightColor;
                            e.currentTarget.style.color = "black";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (currentPage !== 1) {
                            e.currentTarget.style.backgroundColor = theme.primaryColor;
                            e.currentTarget.style.color = "white";
                        }
                    }}
                    className={`text-base px-4 py-2 rounded-md border ${currentPage === 1 ? "cursor-not-allowed opacity-70" : ""}`}
                    style={{
                        backgroundColor: theme.primaryColor,
                        borderColor: theme.primaryColor,
                        color: "white",
                    }}
                    onClick={handlePrevClick}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-2 mx-4">
                    {renderPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            className="w-[30px] h-[30px] flex items-center justify-center rounded-sm text-sm font-medium"
                            style={{
                                backgroundColor: page === currentPage ? theme.primaryColor : "white",
                                color:
                                    page === "..."
                                        ? "#9CA3AF"
                                        : page === currentPage
                                            ? "white"
                                            : theme.primaryColor,
                                cursor: page === "..." ? "not-allowed" : "pointer",
                                opacity: page === "..." ? 0.6 : 1,
                            }}
                            onClick={() => typeof page === "number" && handlePageClick(page)}
                            disabled={page === "..."}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onMouseEnter={(e) => {
                        if (currentPage !== totalPages) {
                            e.currentTarget.style.backgroundColor = theme.highlightColor;
                            e.currentTarget.style.color = "black";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (currentPage !== totalPages) {
                            e.currentTarget.style.backgroundColor = theme.primaryColor;
                            e.currentTarget.style.color = "white";
                        }
                    }}
                    className={`text-base px-4 py-2 rounded-md border ${currentPage === totalPages || totalPages === 0 ? "cursor-not-allowed opacity-70" : ""}`}
                    style={{
                        backgroundColor: theme.primaryColor,
                        borderColor: theme.primaryColor,
                        color: "white",
                    }}
                    onClick={handleNextClick}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;