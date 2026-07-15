import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Calendar,
  Building2,
  User,
  Pill,
  Target,
  Plus,
  Trash2,
  Sparkles,
  LayoutGrid,
  CheckCircle2,
  CalendarDays,
  Stethoscope,
  Package,
  Save,
  RefreshCw,
  TrendingUp,
  Edit2,
  Search,
  AlertCircle,
} from "lucide-react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import Button from "../../../../../components/uiComponents/button/Button";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

// Helper function to convert UTC date to local datetime-local input value
const convertUTCToLocalDateTime = (utcDateStr) => {
  if (!utcDateStr) return "";
  const date = new Date(utcDateStr);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to format date and time in readable format (using UTC to avoid timezone shifts)
const formatDateTimeLocal = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });
  return `${datePart}, ${timePart}`;
};

// Helper function to format time only
const formatTimeOnlyLocal = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });
};

// Helper function to get current datetime in UTC for min attribute
const getCurrentUTCDateTime = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to convert local datetime string to UTC ISO string
const convertToUTCISO = (localDateTimeStr) => {
  if (!localDateTimeStr) return null;
  // Parse the local datetime string (YYYY-MM-DDTHH:mm)
  const [datePart, timePart] = localDateTimeStr.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  
  // Create UTC date
  const utcDate = new Date(Date.UTC(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  ));
  
  return utcDate.toISOString();
};

// Helper function for planning time conflict validation
const validatePlanningTimeConflict = (
  selectedDateTimeLocal,
  existingEntries,
  currentOrganization,
  editingEntryId = null
) => {
  if (!selectedDateTimeLocal || !existingEntries?.length) return null;

  // Parse the selected local datetime
  const [selectedDatePart, selectedTimePart] = selectedDateTimeLocal.split('T');
  const [selectedYear, selectedMonth, selectedDay] = selectedDatePart.split('-');
  const [selectedHours, selectedMinutes] = selectedTimePart.split(':');
  
  const selectedTimestamp = Date.UTC(
    parseInt(selectedYear),
    parseInt(selectedMonth) - 1,
    parseInt(selectedDay),
    parseInt(selectedHours),
    parseInt(selectedMinutes)
  );

  // Find entries on the same date
  const sameDateEntries = existingEntries.filter(entry => {
    if (editingEntryId && entry._id === editingEntryId) return false;
    const entryDate = new Date(entry.date);
    const entryYear = entryDate.getUTCFullYear();
    const entryMonth = entryDate.getUTCMonth();
    const entryDay = entryDate.getUTCDate();
    
    return entryYear === parseInt(selectedYear) &&
           entryMonth === parseInt(selectedMonth) - 1 &&
           entryDay === parseInt(selectedDay);
  });

  if (sameDateEntries.length === 0) return null;

  // Check for exact same time
  const exactMatch = sameDateEntries.find(entry => {
    const entryDate = new Date(entry.date);
    const entryTimestamp = entryDate.getTime();
    return Math.abs(entryTimestamp - selectedTimestamp) < 60000; // Within 1 minute
  });

  if (exactMatch) {
    return {
      type: "exact_match",
      message: `A planning entry already exists at ${formatTimeOnlyLocal(exactMatch.date)}. Please choose a different time.`
    };
  }

  // Sort entries by time
  const sortedEntries = [...sameDateEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Check time gap requirements with adjacent entries
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    const entryTimestamp = new Date(entry.date).getTime();
    const timeDiffMinutes = Math.abs(selectedTimestamp - entryTimestamp) / (1000 * 60);
    
    const isSameOrganization = entry.organizationName === currentOrganization;
    const requiredGap = isSameOrganization ? 20 : 40;
    
    if (timeDiffMinutes < requiredGap) {
      return {
        type: "gap_violation",
        message: `Minimum ${requiredGap} minute gap required ${isSameOrganization ? 'for same organization' : 'between different organizations'}. 
                  There is already a planned visit at ${formatTimeOnlyLocal(entry.date)} for ${entry.organizationName}.`,
        conflictEntry: {
          time: formatTimeOnlyLocal(entry.date),
          organization: entry.organizationName,
          gap: requiredGap
        }
      };
    }
  }

  return null;
};

// Helper function to get existing plans for display
const getExistingPlansForDate = (selectedDateTimeLocal, existingEntries) => {
  if (!selectedDateTimeLocal || !existingEntries?.length) return [];

  const [selectedDatePart] = selectedDateTimeLocal.split('T');
  const [selectedYear, selectedMonth, selectedDay] = selectedDatePart.split('-');

  const sameDateEntries = existingEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const entryYear = entryDate.getUTCFullYear();
    const entryMonth = entryDate.getUTCMonth();
    const entryDay = entryDate.getUTCDate();
    
    return entryYear === parseInt(selectedYear) &&
           entryMonth === parseInt(selectedMonth) - 1 &&
           entryDay === parseInt(selectedDay);
  });

  // Sort by time
  const sortedEntries = sameDateEntries.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedEntries.map(entry => ({
    formattedTime: formatTimeOnlyLocal(entry.date),
    organization: entry.organizationName,
    timestamp: new Date(entry.date).getTime()
  }));
};

const CreateMonthlyPlanning = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const {
    createMonthlyPlanning,
    loading: submitLoading,
    fetchOneMonthPlanningList,
    oneMonthPlanningList,
    deleteMonthlyPlanning,
    updateMonthlyPlanning,
    loading,
    fetchMonthlyPlanningDetailsById,
    resetOneMonthPlanningList,
    resetMonthlyPlanningDetails,
  } = useMonthlyPlanning();

  const {
    fetchOrganizationNames,
    organizationList,
    fetchProductsNames,
    productList,
    fetchDoctorList,
    doctorList,
    loading: dropdownLoading,
  } = useDropdown();

  const [planningEntries, setPlanningEntries] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [existingPlans, setExistingPlans] = useState([]);
  const [currentSelectedDate, setCurrentSelectedDate] = useState("");

  useEffect(() => {
    fetchProductsNames();
    fetchOrganizationNames();
    fetchDoctorList();
  }, []);

  // Validation schema with dynamic date validation
  const getValidationSchema = () => {
    return Yup.object({
      createPlanningForDate: Yup.string()
        .required("Date and time is required")
        // .test("past-date", "Past date and time is not allowed", function(value) {
        //   if (!value) return true;
        //   const [datePart, timePart] = value.split('T');
        //   const [year, month, day] = datePart.split('-');
        //   const [hours, minutes] = timePart.split(':');
          
        //   const selectedUTC = Date.UTC(
        //     parseInt(year),
        //     parseInt(month) - 1,
        //     parseInt(day),
        //     parseInt(hours),
        //     parseInt(minutes)
        //   );
        //   const nowUTC = Date.now();
        //   return selectedUTC >= nowUTC;
        // })
        .test("planning-conflict", "Planning conflict", function(value) {
          if (!value || !oneMonthPlanningList?.data) return true;
          
          const conflict = validatePlanningTimeConflict(
            value,
            oneMonthPlanningList.data,
            this.parent?.selectOrganization,
            editingEntryId
          );
          
          if (conflict) {
            return this.createError({ message: conflict.message });
          }
          return true;
        }),
      selectOrganization: Yup.string().required("Organization is required"),
      customOrganization: Yup.string().when("selectOrganization", {
        is: "Other",
        then: (schema) => schema.required("Custom organization is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      nameOfDoctor: Yup.string().required("Individual name is required"),
      customDoctor: Yup.string().when("nameOfDoctor", {
        is: "Other",
        then: (schema) => schema.required("Custom individual name is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      productToBePromoted: Yup.array()
        .min(1, "At least one product is required")
        .required("Product is required"),
      callObjective: Yup.string().required("Call objective is required"),
    });
  };

  const formik = useFormik({
    initialValues: {
      createPlanningForDate: "",
      selectOrganization: "",
      customOrganization: "",
      nameOfDoctor: "",
      customDoctor: "",
      productToBePromoted: [],
      callObjective: "",
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      // Validate time conflict before submission
      if (values.createPlanningForDate && oneMonthPlanningList?.data) {
        const conflict = validatePlanningTimeConflict(
          values.createPlanningForDate,
          oneMonthPlanningList.data,
          values.selectOrganization,
          editingEntryId
        );
        
        if (conflict) {
          formik.setFieldError("createPlanningForDate", conflict.message);
          setSubmitting(false);
          return;
        }
      }

      const entryToSave = { ...values };
      if (
        entryToSave.selectOrganization === "Other" &&
        entryToSave.customOrganization
      ) {
        entryToSave.selectOrganization = entryToSave.customOrganization;
      }
      if (entryToSave.nameOfDoctor === "Other" && entryToSave.customDoctor) {
        entryToSave.nameOfDoctor = entryToSave.customDoctor;
      }

      // Convert local datetime to UTC ISO string for API
      const utcDateTime = convertToUTCISO(entryToSave.createPlanningForDate);

      if (editingEntryId) {
        const payload = {
          createPlanningForDate: utcDateTime,
          selectOrganization: entryToSave.selectOrganization,
          nameOfDoctor: entryToSave.nameOfDoctor,
          productToBePromoted: entryToSave.productToBePromoted,
          callObjective: entryToSave.callObjective,
        };

        const res = await updateMonthlyPlanning(editingEntryId, payload);
        if (res) {
          await fetchOneMonthPlanningList(
            "",
            "",
            "",
            "",
            "",
            "",
            utcDateTime,
          );
          setEditingEntryId(null);
          // Reset all form fields except the date
          resetForm({
            values: {
              createPlanningForDate: values.createPlanningForDate,
              selectOrganization: "",
              customOrganization: "",
              nameOfDoctor: "",
              customDoctor: "",
              productToBePromoted: [],
              callObjective: "",
            }
          });
          // Clear any validation errors
          formik.setErrors({});
          formik.setTouched({});
        }
      } else {
        const payload = {
          createPlanningForDate: utcDateTime,
          selectOrganization: entryToSave.selectOrganization,
          nameOfDoctor: entryToSave.nameOfDoctor,
          productToBePromoted: entryToSave.productToBePromoted,
          callObjective: entryToSave.callObjective,
        };

        const res = await createMonthlyPlanning(payload);
        if (res) {
          await fetchOneMonthPlanningList(
            "",
            "",
            "",
            "",
            "",
            "",
            utcDateTime,
          );
          // Reset all form fields except the date
          resetForm({
            values: {
              createPlanningForDate: values.createPlanningForDate,
              selectOrganization: "",
              customOrganization: "",
              nameOfDoctor: "",
              customDoctor: "",
              productToBePromoted: [],
              callObjective: "",
            }
          });
          // Clear any validation errors
          formik.setErrors({});
          formik.setTouched({});
        }
      }
      setSubmitting(false);
    },
  });

  // Watch for date changes and trigger API call
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formik.values.createPlanningForDate && !editingEntryId) {
        setCurrentSelectedDate(formik.values.createPlanningForDate);
        const utcDateTime = convertToUTCISO(formik.values.createPlanningForDate);
        fetchOneMonthPlanningList(
          "",
          "",
          "",
          "",
          "",
          "",
          utcDateTime
        );
        setSearchTriggered(true);
        setShowTable(true);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [formik.values.createPlanningForDate, editingEntryId]);

  // Update existing plans when data changes
  useEffect(() => {
    if (formik.values.createPlanningForDate && oneMonthPlanningList?.data) {
      const plans = getExistingPlansForDate(
        formik.values.createPlanningForDate,
        oneMonthPlanningList.data
      );
      setExistingPlans(plans);
    }
  }, [formik.values.createPlanningForDate, oneMonthPlanningList?.data]);

  // Revalidate when organization or planning list changes
  useEffect(() => {
    if (formik.values.createPlanningForDate && formik.values.selectOrganization) {
      formik.validateField("createPlanningForDate");
    }
  }, [oneMonthPlanningList?.data, formik.values.selectOrganization, editingEntryId]);

  const handleSearch = () => {
    if (formik.values.createPlanningForDate && !editingEntryId) {
      setSearchTriggered(true);
      setShowTable(true);
      setEditingEntryId(null);
      const utcDateTime = convertToUTCISO(formik.values.createPlanningForDate);
      fetchOneMonthPlanningList(
        "",
        "",
        "",
        "",
        "",
        "",
        utcDateTime,
      );
    }
  };

  useEffect(() => {
    if (oneMonthPlanningList && oneMonthPlanningList.data && searchTriggered) {
      const formattedData = oneMonthPlanningList.data.map((item) => ({
        createPlanningForDate: item.date,
        selectOrganization: item.organizationName,
        nameOfDoctor: item.personName,
        productToBePromoted: item.productToBePromoted,
        callObjective: item.callObjective,
        _id: item._id,
      }));
      setPlanningEntries(formattedData);
    }
  }, [oneMonthPlanningList, searchTriggered]);

  const handleClear = () => {
    formik.resetForm();
    setEditingEntryId(null);
    setExistingPlans([]);
    setCurrentSelectedDate("");
    // Clear all form values
    formik.setValues({
      createPlanningForDate: "",
      selectOrganization: "",
      customOrganization: "",
      nameOfDoctor: "",
      customDoctor: "",
      productToBePromoted: [],
      callObjective: "",
    });
    formik.setErrors({});
    formik.setTouched({});
  };

  const handleRemoveEntry = async (index) => {
    const entryToDelete = planningEntries[index];
    if (entryToDelete._id) {
      const res = await deleteMonthlyPlanning(entryToDelete._id);
      if (res) {
        const utcDateTime = convertToUTCISO(formik.values.createPlanningForDate);
        await fetchOneMonthPlanningList(
          "",
          "",
          "",
          "",
          "",
          "",
          utcDateTime,
        );
      }
    }
  };

  const handleFinishPlanning = () => {
    setPlanningEntries([]);
    setShowTable(false);
    setSearchTriggered(false);
    setEditingEntryId(null);
    setExistingPlans([]);
    setCurrentSelectedDate("");
    formik.resetForm();
    resetOneMonthPlanningList();
    resetMonthlyPlanningDetails();
    navigate("/sales-executive/monthly-planning");
  };

  const formatOptions = (
    list,
    isStringList = false,
    labelKey = "name",
    valueKey = "name",
  ) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      if (isStringList || typeof item === "string") {
        return { label: item, value: item };
      }
      return {
        label: item[labelKey] || item.fullName || item.hospitalName,
        value: item[valueKey] || item.fullName || item.hospitalName,
      };
    });
  };

  const organizationOptions = [
    ...(organizationList?.data?.map((item) => ({
      label: item.uniqueCode
        ? `${item.hospitalName} (${item.uniqueCode})`
        : item.hospitalName,
      value: item.hospitalName,
    })) || []),
    { label: "Other", value: "Other" },
  ];
  const doctorOptions = [
    ...formatOptions(doctorList),
    { label: "Other", value: "Other" },
  ];
  const productOptions = formatOptions(productList);
  const callObjectiveOptions = formatOptions(
    [
      "Attending Doctor",
      "OPD Call",
      "Product Demo",
      "Clinical Study",
      "Clinical Paper",
      "Other",
    ],
    true,
  );

  const handleEditEntry = async (index) => {
    const entryToEdit = planningEntries[index];
    setEditingEntryId(entryToEdit._id);

    if (fetchMonthlyPlanningDetailsById) {
      await fetchMonthlyPlanningDetailsById(entryToEdit._id);
    }

    const orgExists = organizationOptions.some(
      (opt) => opt.value === entryToEdit.selectOrganization,
    );
    const docExists = formatOptions(doctorList).some(
      (opt) => opt.value === entryToEdit.nameOfDoctor,
    );

    // Convert UTC to local datetime-local format
    const localDateTime = convertUTCToLocalDateTime(entryToEdit.createPlanningForDate);

    formik.setValues({
      createPlanningForDate: localDateTime,
      selectOrganization: orgExists ? entryToEdit.selectOrganization : "Other",
      customOrganization: orgExists ? "" : entryToEdit.selectOrganization,
      nameOfDoctor: docExists ? entryToEdit.nameOfDoctor : "Other",
      customDoctor: docExists ? "" : entryToEdit.nameOfDoctor,
      productToBePromoted: Array.isArray(entryToEdit.productToBePromoted) 
        ? entryToEdit.productToBePromoted 
        : [entryToEdit.productToBePromoted],
      callObjective: entryToEdit.callObjective || "",
    });
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#355DC4" : "#E5E7EB",
      borderRadius: "12px",
      padding: "4px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(53,93,196,0.1)" : "none",
      "&:hover": {
        borderColor: "#355DC4",
      },
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#355DC4" : isFocused ? "#F3F4F6" : "white",
      color: isSelected ? "white" : "#374151",
      "&:active": {
        backgroundColor: "#355DC4",
      },
    }),
  };

  const getStatusColor = (index) => {
    const colors = [
      "bg-gradient-to-r from-emerald-400 to-teal-400",
      "bg-gradient-to-r from-blue-400 to-indigo-400",
      "bg-gradient-to-r from-purple-400 to-pink-400",
      "bg-gradient-to-r from-orange-400 to-red-400",
    ];
    return colors[index % colors.length];
  };

  // Format existing plans for display
  const getExistingPlansDisplay = () => {
    if (!existingPlans.length) return null;
    
    return (
      <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 mb-1">
              Existing plans for this date:
            </p>
            <div className="space-y-1">
              {existingPlans.map((plan, idx) => (
                <div key={idx} className="text-xs text-amber-700">
                  • {plan.formattedTime} - {plan.organization}
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-700 mt-2">
              💡 Tip: Maintain at least 20 min gap for same organization, 40 min for different organizations
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen relative">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          {
            text: "Monthly Planning",
            href: "/sales-executive/monthly-planning",
          },
          { text: "Create Monthly Planning" },
        ]}
      />

      <div
        className="relative mb-4 mt-4 overflow-hidden rounded-2xl p-4"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
              <CalendarDays className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                Monthly Planner
              </h3>
              <p className="text-sm mt-1 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Plan your promotional activities and track progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
            <TrendingUp
              className="h-4 w-4"
              style={{ color: theme.primaryColor }}
            />
            <span className="text-sm font-medium text-white">
              {planningEntries.length} Plans Ready
            </span>
          </div>
        </div>
      </div>

      <div className="group mb-4 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div
              className="rounded-lg p-1.5"
              style={{ backgroundColor: theme.primaryColor + "33" }}
            >
              {editingEntryId ? (
                <Edit2
                  className="h-4 w-4"
                  style={{ color: theme.primaryColor }}
                />
              ) : (
                <Plus
                  className="h-4 w-4"
                  style={{ color: theme.primaryColor }}
                />
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              {editingEntryId
                ? "Edit Planning Entry"
                : "Add New Planning Entry"}
            </h2>
            {editingEntryId && (
              <span className="text-xs text-orange-500 ml-2 font-medium">
                Editing mode
              </span>
            )}
            <span className="text-xs text-slate-400 ml-2">
              Fill the details below
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Calendar
                  className="h-3.5 w-3.5"
                  style={{ color: theme.primaryColor }}
                />
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="createPlanningForDate"
                // min={getCurrentUTCDateTime()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.createPlanningForDate}
                className={`w-full rounded-xl border p-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                  formik.touched.createPlanningForDate && formik.errors.createPlanningForDate
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-200"
                }`}
                style={{
                  borderColor: formik.values.createPlanningForDate && !formik.errors.createPlanningForDate
                    ? theme.primaryColor
                    : undefined,
                }}
                disabled={!!editingEntryId}
              />
              {formik.touched.createPlanningForDate &&
                formik.errors.createPlanningForDate && (
                  <div className="mt-1 flex items-start gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{formik.errors.createPlanningForDate}</span>
                  </div>
                )}
              {editingEntryId && (
                <p className="mt-1 text-xs text-amber-500">
                  Date cannot be changed while editing
                </p>
              )}
              {getExistingPlansDisplay()}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Building2
                  className="h-3.5 w-3.5"
                  style={{ color: theme.primaryColor }}
                />
                Organization
              </label>
              <Select
                key={`org-select-${formik.values.selectOrganization}`}
                isLoading={dropdownLoading}
                options={organizationOptions}
                value={organizationOptions.find(
                  (opt) => opt.value === formik.values.selectOrganization,
                )}
                onChange={(selected) => {
                  formik.setFieldValue("selectOrganization", selected?.value || "");
                  formik.setFieldValue("customOrganization", "");
                  // Revalidate date when organization changes
                  if (formik.values.createPlanningForDate) {
                    setTimeout(() => {
                      formik.validateField("createPlanningForDate");
                    }, 100);
                  }
                }}
                onBlur={() =>
                  formik.setFieldTouched("selectOrganization", true)
                }
                isClearable
                placeholder="Select Organization"
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
              {formik.values.selectOrganization === "Other" && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="customOrganization"
                    placeholder="Enter custom organization name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customOrganization}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 mb-1"
                    style={{
                      borderColor: formik.values.customOrganization
                        ? theme.primaryColor
                        : undefined,
                    }}
                  />
                  <p className="text-[11px] text-orange-500 font-medium">
                    Note: Please add this organization into database
                  </p>
                </div>
              )}
              {formik.touched.selectOrganization &&
                formik.errors.selectOrganization && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.selectOrganization}
                  </p>
                )}
              {formik.touched.customOrganization &&
                formik.errors.customOrganization && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.customOrganization}
                  </p>
                )}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Stethoscope
                  className="h-3.5 w-3.5"
                  style={{ color: theme.primaryColor }}
                />
                Individual Name
              </label>
              <Select
                key={`doctor-select-${formik.values.nameOfDoctor}`}
                isLoading={dropdownLoading}
                options={doctorOptions}
                value={doctorOptions.find(
                  (opt) => opt.value === formik.values.nameOfDoctor,
                )}
                onChange={(selected) => {
                  formik.setFieldValue("nameOfDoctor", selected?.value || "");
                  formik.setFieldValue("customDoctor", "");
                }}
                onBlur={() => formik.setFieldTouched("nameOfDoctor", true)}
                isClearable
                placeholder="Select Individual"
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
              {formik.values.nameOfDoctor === "Other" && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="customDoctor"
                    placeholder="Enter custom individual name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customDoctor}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 mb-1"
                    style={{
                      borderColor: formik.values.customDoctor
                        ? theme.primaryColor
                        : undefined,
                    }}
                  />
                  <p className="text-[11px] text-orange-500 font-medium">
                    Note: Please add this individual into database
                  </p>
                </div>
              )}
              {formik.touched.nameOfDoctor && formik.errors.nameOfDoctor && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.nameOfDoctor}
                </p>
              )}
              {formik.touched.customDoctor && formik.errors.customDoctor && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.customDoctor}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Package
                  className="h-3.5 w-3.5"
                  style={{ color: theme.primaryColor }}
                />
                Product (Multiselect)
              </label>
              <Select
                key={`product-select-${formik.values.productToBePromoted?.length}`}
                isLoading={dropdownLoading}
                options={productOptions}
                value={productOptions.filter(opt => 
                  formik.values.productToBePromoted?.includes(opt.value)
                )}
                onChange={(selected) =>
                  formik.setFieldValue(
                    "productToBePromoted",
                    selected ? selected.map(opt => opt.value) : []
                  )
                }
                onBlur={() =>
                  formik.setFieldTouched("productToBePromoted", true)
                }
                isMulti
                isClearable
                placeholder="Select Products"
                styles={{
                  ...customSelectStyles,
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: theme.primaryColor + "20",
                    borderRadius: "8px",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: theme.primaryColor,
                    fontWeight: 500,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: theme.primaryColor,
                    "&:hover": {
                      backgroundColor: theme.primaryColor,
                      color: "white",
                      borderRadius: "4px",
                    },
                  }),
                }}
                classNamePrefix="react-select"
              />
              {formik.touched.productToBePromoted &&
                formik.errors.productToBePromoted && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.productToBePromoted}
                  </p>
                )}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Target
                  className="h-3.5 w-3.5"
                  style={{ color: theme.primaryColor }}
                />
                Call Objective
              </label>
              <Select
                key={`objective-select-${formik.values.callObjective}`}
                options={callObjectiveOptions}
                value={callObjectiveOptions.find(
                  (opt) => opt.value === formik.values.callObjective,
                )}
                onChange={(selected) =>
                  formik.setFieldValue("callObjective", selected?.value || "")
                }
                onBlur={() => formik.setFieldTouched("callObjective", true)}
                isClearable
                placeholder="Select Objective"
                styles={customSelectStyles}
                classNamePrefix="react-select"
                formatOptionLabel={({ label }) => (
                  <div className="flex items-center gap-2">
                    <span>{label}</span>
                  </div>
                )}
              />
              {formik.touched.callObjective && formik.errors.callObjective && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.callObjective}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
            <Button
              text="Clear"
              variant={3}
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={handleClear}
            />
            <Button
              text="Search"
              variant={1}
              icon={<Search className="h-4 w-4" />}
              onClick={handleSearch}
              disabled={
                !formik.values.createPlanningForDate || !!editingEntryId
              }
            />
            <Button
              text={editingEntryId ? "Edit in Plan" : "Add to Plan"}
              variant={1}
              icon={
                editingEntryId ? (
                  <Edit2 className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )
              }
              onClick={formik.handleSubmit}
              loading={submitLoading}
              disabled={!!formik.errors.createPlanningForDate}
            />
          </div>
        </div>
      </div>

      {showTable && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <LayoutGrid className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Monthly Planning Overview
                </h2>
              </div>
              {planningEntries.length > 0 && (
                <div
                  className="flex items-center gap-1 rounded-full px-3 py-1"
                  style={{ backgroundColor: theme.primaryColor + "20" }}
                >
                  <CheckCircle2
                    className="h-3.5 w-3.5"
                    style={{ color: theme.primaryColor }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: theme.primaryColor }}
                  >
                    {planningEntries.length} entries
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            {planningEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm text-slate-400">
                  No planning entries found for this date
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Fill the form above and click "Add to Plan" to create entries
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Organization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Individual Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Call Objective
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(loading || submitLoading) && (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <LoaderSpinner />
                      </td>
                    </tr>
                  )}
                  {!loading && !submitLoading && planningEntries.map((entry, index) => (
                    <tr
                      key={entry._id || index}
                      className={`transition-all duration-200 hover:bg-slate-50/50 group ${editingEntryId === entry._id ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${getStatusColor(index)}`}
                          />
                          {formatDateTimeLocal(entry.createPlanningForDate)}
                        </div>
                       </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {entry.selectOrganization}
                        </div>
                       </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {entry.nameOfDoctor}
                        </div>
                       </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(entry.productToBePromoted) 
                            ? entry.productToBePromoted 
                            : [entry.productToBePromoted]
                          ).map((product, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                            >
                              <Pill className="h-2.5 w-2.5" />
                              {product}
                            </span>
                          ))}
                        </div>
                       </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          <Target className="h-3 w-3" />
                          {entry.callObjective}
                        </span>
                       </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => handleEditEntry(index)}
                            className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-500"
                            title="Edit entry"
                            disabled={!!editingEntryId}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveEntry(index)}
                            className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                            title="Remove entry"
                            disabled={!!editingEntryId}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-5 rounded-b-2xl">
            <div className="flex justify-center">
              <Button
                text="Finish Planning"
                variant={1}
                icon={<Save className="h-4 w-4" />}
                onClick={handleFinishPlanning}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMonthlyPlanning;