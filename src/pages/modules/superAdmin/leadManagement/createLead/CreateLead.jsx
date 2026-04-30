import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../../components/uiComponents/button/Button";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useLeadManagement from "../../../../../hooks/leadmanagement/useLeadManagement";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const salesStatuses = [
  {
    label: "Hot - Within 30 Days",
    value: "hot",
    color: "bg-red-100 text-red-500",
  },
  {
    label: "Warm - Within 60 Days",
    value: "warm",
    color: "bg-orange-100 text-orange-500",
  },
  {
    label: "Cold - Within 90 Days",
    value: "cold",
    color: "bg-blue-100 text-blue-500",
  },
  {
    label: "Coverage List - Within 180 days",
    value: "coverage list",
    color: "bg-indigo-100 text-indigo-500",
  },
];

const leadSources = ["Email", "Calling", "Meeting"];

const CreateLead = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { createLead, updateLead, fetchLeadById, leadById } =
    useLeadManagement();

  const {
    productsToPromote,
    fetchOrgnizationNames,
    orgnizationNames,
    fetchProductsToPromote,
    callobjectivestatus,
    fetchCallObjectiveStatuses,
    // fetchProductsNames,
    // productList,
  } = useDropdown();

  useEffect(() => {
    fetchOrgnizationNames();
    fetchProductsToPromote();
    fetchCallObjectiveStatuses();
    // fetchProductsNames();
  }, []);

  useEffect(() => {
    if (id) {
      fetchLeadById(id);
    }
  }, [id]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const getInitialValues = () => {
    if (id && leadById) {
      return {
        firstName: leadById.firstName || "",
        lastName: leadById.lastName || "",
        organizationName: leadById.organizationName || "",
        city: leadById.city || "",
        address: leadById.address || "",
        pincode: leadById.pincode || "",
        productPromoted: leadById.productPromoted || "",
        callObjective: leadById.callObjective || "",
        nextCallObjective: leadById.nextCallObjective || "",
        lastMeetingDate: formatDateForInput(leadById.lastMeetingDate) || "",
        nextMeetingDate: formatDateForInput(leadById.nextMeetingDate) || "",
        lastMeetingTime: leadById.lastMeetingTime || "",
        nextMeetingTime: leadById.nextMeetingTime || "",
        targetedDepartment: leadById.targetedDepartment || "",
        discussionPoint: leadById.discussionPoint || "",
        nextFollowUp: leadById.nextFollowUp || "",
        requiredSupport: leadById.requiredSupport || "",
        comments: leadById.comments || "",
        salesExpected: leadById.salesExpected || "",
        // category: leadById.category || "",
        leadOwner: leadById.leadOwner || "",
        status: leadById.status || "",
        // totalCalls: leadById.totalCalls || "",

        // salesStatus: Array.isArray(leadById.salestatus)
        //   ? leadById.salestatus.map((s) => s.toLowerCase())
        //   : [],
        salesStatus: Array.isArray(leadById.salestatus)
          ? leadById.salestatus.map((s) => s.trim().toLowerCase())
          : [],

        leadGeneratedThrough: Array.isArray(leadById.leadGeneratedThrough)
          ? leadById.leadGeneratedThrough
          : leadById.leadGeneratedThrough
            ? [leadById.leadGeneratedThrough]
            : [],
      };
    }

    return {
      firstName: "",
      lastName: "",
      organizationName: "",
      city: "",
      address: "",
      pincode: "",
      productPromoted: "",
      callObjective: "",
      nextCallObjective: "",
      lastMeetingDate: "",
      nextMeetingDate: "",
      lastMeetingTime: "",
      nextMeetingTime: "",
      targetedDepartment: "",
      discussionPoint: "",
      nextFollowUp: "",
      requiredSupport: "",
      comments: "",
      salesExpected: "",
      // category: "",
      leadOwner: "",
      status: "",
      // totalCalls: "",
      salesStatus: [],
      leadGeneratedThrough: [],
      // productToBePromoted: "", // NEW
    };
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(),
    validationSchema: Yup.object().shape({
      firstName: Yup.string()
        .matches(/^[a-zA-Z]+$/, "Only Alphabets Allowed")
        .required("First Name Required"),
      lastName: Yup.string()
        .matches(/^[a-zA-Z]+$/, "Only Alphabets Allowed")
        .required("Last Name Required"),
      organizationName: Yup.string().required("Organization Name Required"),
      city: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Only Alphabets Allowed")
        .required("City Name Required"),
      address: Yup.string().required("Address Required"),
      pincode: Yup.string()
        .matches(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, "Invalid Pincode Format")
        .required("Pincode Is Required"),
      productPromoted: Yup.string().required("Product Promoted Is Required"),
      callObjective: Yup.string().required("Call Objective Is Required"),
      nextCallObjective: Yup.string().required(
        "Next Call Objective Is Required"
      ),
      lastMeetingDate: Yup.date().required("Last Meeting Date Is Required"),
      nextMeetingDate: Yup.date().required("Next Meeting Date Is Required"),
      lastMeetingTime: Yup.string().required("Last Meeting Time Is Required"),
      nextMeetingTime: Yup.string().required("Next Meeting Time Is Required"),
      targetedDepartment: Yup.string().required(
        "Targeted Department Is Required"
      ),
      discussionPoint: Yup.string().required("Discussion Point Is Required"),
      nextFollowUp: Yup.string().required("Next Follow Up Is Required"),
      requiredSupport: Yup.string().required("Required Support Is Required"),
      comments: Yup.string().required("Comments Are Required"),
      salesExpected: Yup.string().required("Sales Expected Is Required"),
      // category: Yup.string().required("Category Is Required"),
      leadOwner: Yup.string().required("Lead Owner Is Required"),
      status: Yup.string().required("Status Is Required"),
      // totalCalls: Yup.string().required("Total Calls Is Required"),
    }),
    // onSubmit: (values) => {
    //   if (id) {
    //     updateLead(id, values);
    //   } else {
    //     createLead(values);
    //   }
    //   navigate("/lead/view-lead");
    // },
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        salestatus: values.salesStatus.map((val) => val.toLowerCase()), // 👈 correct key
      };
      delete formattedValues.salesStatus;

      if (id) {
        updateLead(id, formattedValues);
      } else {
        createLead(formattedValues);
      }

      navigate("/lead/view-lead");
    },
  });

  const placeholders = {
    firstName: "Enter first name",
    lastName: "Enter last name",
    organizationName: "Select organization name",
    city: "Enter city",
    address: "Enter address",
    pincode: "Enter pincode",
    productPromoted: "Select product promoted",
    callObjective: "Select call objective",
    nextCallObjective: "Select next call objective",
    lastMeetingDate: "Select last meeting date",
    nextMeetingDate: "Select next meeting date",
    lastMeetingTime: "Enter last meeting time",
    nextMeetingTime: "Enter next meeting time",
    targetedDepartment: "Enter targeted department",
    discussionPoint: "Enter discussion point",
    nextFollowUp: "Enter next follow up",
    requiredSupport: "Enter required support",
    comments: "Enter comments",
    salesExpected: "Enter sales expected",
    // category: "Enter category",
    leadOwner: "Enter lead owner",
    status: "Select status",
    // totalCalls: "Enter total calls",
    // productToBePromoted: "Select product to be promoted", // NEW
  };

  const fieldTypes = {
    firstName: "text",
    lastName: "text",
    organizationName: "select",
    city: "text",
    address: "text",
    pincode: "text",
    productPromoted: "select",
    callObjective: "select",
    nextCallObjective: "select",
    lastMeetingDate: "date",
    nextMeetingDate: "date",
    lastMeetingTime: "time",
    nextMeetingTime: "time",
    targetedDepartment: "text",
    discussionPoint: "text",
    nextFollowUp: "text",
    requiredSupport: "text",
    comments: "textarea",
    salesExpected: "text",
    // category: "text",
    leadOwner: "text",
    status: "select",
    // totalCalls: "text",
    // productToBePromoted: "select", // NEW
  };

  // const categoryOptions = [
  //   { value: "hot", label: "Hot" },
  //   { value: "warm", label: "Warm" },
  //   { value: "cold", label: "Cold" },
  //   { value: "coverage", label: "Coverage" },
  // ];

  const renderField = (name) => {
    const fieldType = fieldTypes[name];
    const placeholder = placeholders[name];
    const value = formik.values[name];

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    if (name === "lastMeetingTime" || name === "nextMeetingTime") {
      const selectedDate =
        name === "lastMeetingTime"
          ? formik.values.lastMeetingDate
          : formik.values.nextMeetingDate;

      const today = dayjs().format("YYYY-MM-DD");

      const now = dayjs();

      // Decide restrictions
      let minTime = null;
      let maxTime = null;

      if (selectedDate === today) {
        if (name === "nextMeetingTime") {
          // minTime = now.startOf("minute");
          minTime = now.add(5, "minute").startOf("minute");
        } else if (name === "lastMeetingTime") {
          maxTime = now.startOf("minute");
        }
      }

      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label={placeholder}
            value={value ? dayjs(value, "HH:mm") : null}
            onChange={(newValue) => {
              formik.setFieldValue(
                name,
                newValue ? newValue.format("HH:mm") : ""
              );
            }}
            minTime={minTime}
            maxTime={maxTime}
            slotProps={{
              textField: {
                className: "border px-3 py-2 rounded text-gray-600",
                variant: "outlined",
                size: "small",
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>
      );
    }

    if (fieldType === "textarea") {
      return (
        <textarea
          name={name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={value}
          placeholder={placeholder}
          className="border px-3 py-2 rounded resize-none font-mono"
          rows="3"
        />
      );
    }

    if (fieldType === "select") {
      return (
        <select
          name={name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={value}
          className="border px-3 py-2 rounded font-medium text-gray-500"
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {name === "organizationName" &&
            orgnizationNames.map((option) => (
              <option key={option.hospitalName} value={option.hospitalName}>
                {option.hospitalName}
              </option>
            ))}
          {name === "productPromoted" &&
            productsToPromote.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          {name === "callObjective" &&
            Array.isArray(callobjectivestatus) &&
            callobjectivestatus.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          {name === "nextCallObjective" &&
            Array.isArray(callobjectivestatus) &&
            callobjectivestatus.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          {name === "status" && (
            <>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </>
          )}
          {/* {name === "productToBePromoted" &&
            productList.map((product) => (
              <option key={product.name} value={product.name}>
                {product.name}
              </option>
            ))} */}
        </select>
      );
    }

    // ✅ Apply min={today} only for meeting date fields
    return (
      <input
        type={fieldType}
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={value}
        placeholder={placeholder}
        min={name === "nextMeetingDate" ? today : undefined}
        max={name === "lastMeetingDate" ? today : undefined}
        className="border px-3 py-2 rounded font-medium text-gray-500"
      />
    );
  };
  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Lead Management" },
          { text: id ? "Edit Lead" : "Create Lead" },
        ]}
      />

      <div className="rounded-xl shadow-md w-full">
        <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100 rounded-xl shadow-md w-full mx-auto">
          <div className="relative text-center mb-6 pb-16">
            <h2
              className="p-[44px] absolute inset-0 flex items-center justify-center font-bold text-xl text-black rounded-t-lg"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              {id ? "Edit Lead" : "Create Lead"}
            </h2>
          </div>

          <div className="px-8 pt-15 p-3 bg-white">
            <form
              onSubmit={formik.handleSubmit}
              className="p-3 pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4"
            >
              {Object.keys(formik.initialValues)
                .filter((key) => !Array.isArray(formik.initialValues[key]))
                .map((name) => (
                  <div key={name} className="flex flex-col">
                    <label
                      htmlFor={name}
                      className="mb-2 font-semibold text-lg text-black"
                    >
                      {name
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    {renderField(name)}
                    {formik.touched[name] && formik.errors[name] && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors[name]}
                      </div>
                    )}
                  </div>
                ))}

              <div className=" mt-4">
                <label className="block font-medium mb-2">Sales Status</label>
                <div className="flex gap-4 flex-wrap">
                  {salesStatuses.map((status) => (
                    <label
                      key={status.value}
                      className={cn(
                        "px-3 py-1 border border-gray-300 rounded-md flex items-center gap-2 text-sm cursor-pointer",
                        status.color
                      )}
                    >
                      <input
                        type="checkbox"
                        name="salesStatus"
                        value={status.value}
                        checked={formik.values.salesStatus.includes(
                          status.value
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const value = status.value;
                          const updated = checked
                            ? [...formik.values.salesStatus, value]
                            : formik.values.salesStatus.filter(
                              (val) => val !== value
                            );
                          formik.setFieldValue("salesStatus", updated);
                        }}
                        className="accent-current"
                      />
                      {status.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className=" mt-1">
                <label className="block font-medium mb-2">
                  Lead Generated Through
                </label>
                <div className="flex flex-wrap w-40 gap-6">
                  {leadSources.map((source) => (
                    <label
                      key={source}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        name="leadGeneratedThrough"
                        value={source}
                        checked={formik.values.leadGeneratedThrough.includes(
                          source
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const updated = checked
                            ? [...formik.values.leadGeneratedThrough, source]
                            : formik.values.leadGeneratedThrough.filter(
                              (val) => val !== source
                            );
                          formik.setFieldValue("leadGeneratedThrough", updated);
                        }}
                        className="accent-current"
                      />
                      {source}
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2 flex justify-center gap-4 mt-6">
                <Button variant={3} type="button" text="Cancel" />
                <Button type="submit" text={id ? "Update" : "Submit"} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLead;
