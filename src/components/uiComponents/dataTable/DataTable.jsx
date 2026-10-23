import React from "react";
import { TiEye } from "react-icons/ti";
import { useTheme } from "../../../hooks/theme/useTheme.js";
import LoaderSpinner from "../loader/LoaderSpinner.jsx";
import Pagination from "../pagination/Pagination.jsx";
import ScrollableX from "../../uiComponents/scrollableTable/ScrollableX.jsx";

/**
 * Reusable data table.
 *
 * @param {Array<{ key:string, header:string, align?:'left'|'center'|'right', render?:(row,index)=>React.ReactNode, value?:(row)=>any }>} columns
 * @param {Array<object>} rows
 */
const DataTable = ({
  title,
  columns,
  rows = [],
  loading = false,
  emptyMessage = "No data available.",
  showSrNo = true,
  srNoStartIndex = 0,
  headerRight = null,
  onRowView,
  viewKey = "_id",
  showAction = false,
  actionLabel = "View details",
  pagination = null,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const { theme } = useTheme();

  const cellContent = (column, row, index) => {
    if (typeof column.render === "function") return column.render(row, index);
    if (typeof column.value === "function") return column.value(row, index);
    return row?.[column.key] ?? "-";
  };

  // Static Tailwind classes (dynamic template strings are not detected by Tailwind)
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const colSpan =
    columns.length + (showSrNo ? 1 : 0) + (showAction || onRowView ? 1 : 0);

  return (
    <div className="w-full">
      {(title || headerRight) && (
        <>
        <div className="flex justify-between gap-4 flex-wrap items-center mb-4">
          {title && (
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          )}
          {headerRight}
        </div>
        
      <hr
        className="h-1 border-0 mb-3"
        style={{ backgroundColor: theme.secondaryColor }}
      />

        </>
      )}

      <ScrollableX className="shadow rounded-t-2xl">
        <table className="min-w-full text-sm text-left text-gray-700 table-auto">
          <thead
            className="sticky top-0 z-10 uppercase bg-gray-100 border-b border-gray-300"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <tr>
              {showSrNo && (
                <th className="p-4 text-base font-semibold text-left">
                  Sr. No.
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`p-4 text-base font-semibold ${alignClass[column.align] || "text-center"}`}
                >
                  {column.header}
                </th>
              ))}
              {(showAction || onRowView) && (
                <th className="p-4 text-base font-semibold text-left">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="p-8 text-center">
                  <div className="flex justify-center items-center w-full">
                    <LoaderSpinner />
                  </div>
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row, index) => (
                <tr
                  key={row?.[viewKey] ?? row?.employeeId ?? index}
                  className="text-left hover:bg-gray-50 transition-all"
                >
                  {showSrNo && (
                    <td className="p-4 text-[17px] font-normal text-[#252C58]">
                      {srNoStartIndex + index + 1}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-[15px] whitespace-nowrap ${alignClass[column.align] || "text-left"}`}
                    >
                      {cellContent(column, row, index)}
                    </td>
                  ))}
                  {(showAction || onRowView) && (
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      <button
                        onClick={() =>
                          onRowView?.(row?.[viewKey] ?? row, row)
                        }
                        className="text-black hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center"
                        aria-label={actionLabel}
                      >
                        <TiEye size={18} color={theme.primaryColor} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={colSpan}
                  className="p-4 text-center text-[17px] text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollableX>

      {pagination && (
        <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          <Pagination
            currentPage={pagination.currentPage}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      )}
    </div>
    
  );
};

export default DataTable;