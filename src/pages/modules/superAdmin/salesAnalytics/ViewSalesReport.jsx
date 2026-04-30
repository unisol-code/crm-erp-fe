import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/uiComponents/button/Button";
import { FaEdit } from "react-icons/fa";

const ViewSalesReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const { theme } = useTheme();

  const Field = ({ label, value }) => (
    <div className="flex flex-col">
      <p
        className="mb-1 text-sm font-semibold"
        style={{ color: theme.primaryColor }}
      >
        {label}
      </p>
      <p
        className="px-4 py-2 text-base font-medium border-2 rounded-md"
        style={{ borderColor: theme.primaryColor }}
      >
        {value}
      </p>
    </div>
  );

  useEffect(() => {
    const stateReport = location.state?.report;
    const localReport = localStorage.getItem("selectedReport");

    if (stateReport) {
      setReport(stateReport);
    } else if (localReport) {
      setReport(JSON.parse(localReport));
    }

    return () => {
      localStorage.removeItem("selectedReport");
    };
  }, [location.state]);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-blue-100">
        <p className="mb-4 text-white">No report data found. Please go back.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-blue-700 bg-white rounded hover:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Sales" },
          { text: "Sales Analytics", href: "/sales-analytics" },
          { text: "View Sales Analytics" },
        ]}
      />
      <div
        className="w-full px-4 py-4 rounded-t-2xl"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <h2 className="text-lg font-semibold tracking-wide text-left text-gray-700">
          View Sales Report
        </h2>
      </div>

      <div className="px-6 py-6 space-y-8 bg-white rounded-b-2xl">
        {/* General Info */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Field label="Date" value={report.date || "N/A"} />
          <Field label="Product Name" value={report.product} />
          <Field
            label="Employee First Name"
            value={report.employeeFirstName || report.employee?.split(" ")[0]}
          />
          <Field
            label="Employee Last Name"
            value={report.employeeLastName || report.employee?.split(" ")[1]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Field
            label="Organization Name"
            value={report.organization || "N/A"}
          />
          <Field label="Email" value={report.email || "N/A"} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Field label="Region" value={report.region || "N/A"} />
          <Field label="State" value={report.state || "N/A"} />
          <Field label="District" value={report.district || "N/A"} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Field label="Bill Amount" value={`₹${report.billAmount || "N/A"}`} />
          <Field label="Paid Amount" value={`₹${report.paidAmount || "N/A"}`} />
          <Field
            label="Uncleared Amount"
            value={`₹${report.unclearedAmount || "N/A"}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Field label="Contact" value={report.contact || "N/A"} />
          <Field
            label="No Of Product Sold"
            value={report.productsSold || "N/A"}
          />
          <Field label="Bill Status" value={report.status || "N/A"} />
        </div>

        {/* Edit Button */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={() =>
              navigate("/sales-analytics/add-report", { state: { report } })
            }
            text="Edit"
            icon={<FaEdit size={16} />}
            variant={1}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewSalesReport;
