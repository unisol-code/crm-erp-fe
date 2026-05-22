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
} from "lucide-react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import Button from "../../../../../components/uiComponents/button/Button";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

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
    monthlyPlanningDetails,
    resetOneMonthPlanningList,
    resetMonthlyPlanningDetails
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
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);

  useEffect(() => {
    fetchProductsNames();
    fetchOrganizationNames();
    fetchDoctorList();
  }, []);

  const validationSchema = Yup.object({
    createPlanningForDate: Yup.date()
      .min(new Date(), "Past date and time is not allowed")
      .nullable()
      .required("Date is required"),
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
    productToBePromoted: Yup.string().required("Product is required"),
    callObjective: Yup.string().required("Call objective is required"),
  });

  const formik = useFormik({
    initialValues: {
      createPlanningForDate: "",
      selectOrganization: "",
      customOrganization: "",
      nameOfDoctor: "",
      customDoctor: "",
      productToBePromoted: "",
      callObjective: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const entryToSave = { ...values };
      if (entryToSave.selectOrganization === "Other" && entryToSave.customOrganization) {
        entryToSave.selectOrganization = entryToSave.customOrganization;
      }
      if (entryToSave.nameOfDoctor === "Other" && entryToSave.customDoctor) {
        entryToSave.nameOfDoctor = entryToSave.customDoctor;
      }

      if (editingEntryId) {
        const payload = {
          id: editingEntryId,
          createPlanningForDate: entryToSave.createPlanningForDate,
          selectOrganization: entryToSave.selectOrganization,
          nameOfDoctor: entryToSave.nameOfDoctor,
          productToBePromoted: entryToSave.productToBePromoted,
          callObjective: entryToSave.callObjective,
        };

        const res = await updateMonthlyPlanning(payload);
        if (res) {
          await fetchOneMonthPlanningList("", "", "", "", "", "", formik.values.createPlanningForDate);
          setEditingEntryId(null);
          resetForm();
        }
      } else {
        const payload = {
          createPlanningForDate: entryToSave.createPlanningForDate,
          selectOrganization: entryToSave.selectOrganization,
          nameOfDoctor: entryToSave.nameOfDoctor,
          productToBePromoted: entryToSave.productToBePromoted,
          callObjective: entryToSave.callObjective,
        };

        const res = await createMonthlyPlanning(payload);
        if (res) {
          await fetchOneMonthPlanningList("", "", "", "", "", "", formik.values.createPlanningForDate);
          resetForm();
        }
      }
    },
  });

  const handleSearch = () => {
    if (formik.values.createPlanningForDate) {
      setSearchTriggered(true);
      setShowTable(true);
      setEditingEntryId(null);
      formik.resetForm();
      fetchOneMonthPlanningList("", "", "", "", "", "", formik.values.createPlanningForDate);
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
  };

  const handleRemoveEntry = async (index) => {
    const entryToDelete = planningEntries[index];
    if (entryToDelete._id) {
      const confirmed = window.confirm("Are you sure you want to delete this planning entry?");
      if (confirmed) {
        await deleteMonthlyPlanning(entryToDelete._id);
        await fetchOneMonthPlanningList("", "", "", "", "", "", formik.values.createPlanningForDate);
      }
    }
  };

  const handleFinishPlanning = () => {
    setPlanningEntries([]);
    setShowTable(false);
    setSearchTriggered(false);
    setEditingEntryId(null);
    formik.resetForm();
    resetOneMonthPlanningList();
    resetMonthlyPlanningDetails();
    navigate("/sales-executive/monthly-planning");
  };

  const formatOptions = (list, isStringList = false, labelKey = "name", valueKey = "name") => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      if (isStringList || typeof item === "string") {
        return { label: item, value: item };
      }
      return {
        label: item[labelKey] || item.fullName,
        value: item[valueKey] || item.fullName,
      };
    });
  };

  const organizationOptions = [...formatOptions(organizationList?.data, true), { label: "Other", value: "Other" }];
  const doctorOptions = [...formatOptions(doctorList), { label: "Other", value: "Other" }];
  const productOptions = formatOptions(productList);
  const callObjectiveOptions = formatOptions(["Attending Doctor", "OPD Call", "Product Demo", "Clinical Study", "Clinical Paper", "Other"], true);

  const handleEditEntry = async (index) => {
    const entryToEdit = planningEntries[index];
    setEditingEntryId(entryToEdit._id);

    if (fetchMonthlyPlanningDetailsById) {
      await fetchMonthlyPlanningDetailsById(entryToEdit._id);
    }

    const orgExists = formatOptions(organizationList?.data, true).some(opt => opt.value === entryToEdit.selectOrganization);
    const docExists = formatOptions(doctorList).some(opt => opt.value === entryToEdit.nameOfDoctor);

    let formattedDate = entryToEdit.createPlanningForDate;
    if (formattedDate && !formattedDate.includes('T')) {
      formattedDate = formattedDate.replace(' ', 'T');
    }

    formik.setValues({
      createPlanningForDate: formattedDate || "",
      selectOrganization: orgExists ? entryToEdit.selectOrganization : "Other",
      customOrganization: orgExists ? "" : entryToEdit.selectOrganization,
      nameOfDoctor: docExists ? entryToEdit.nameOfDoctor : "Other",
      customDoctor: docExists ? "" : entryToEdit.nameOfDoctor,
      productToBePromoted: entryToEdit.productToBePromoted || "",
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

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="w-full min-h-screen relative">
      {(loading || submitLoading) && <LoaderSpinner />}
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

      <div className="relative mb-4 mt-4 overflow-hidden rounded-2xl p-4"
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
            <TrendingUp className="h-4 w-4" style={{ color: theme.primaryColor }} />
            <span className="text-sm font-medium text-white">
              {planningEntries.length} Plans Ready
            </span>
          </div>
        </div>
      </div>

      <div className="group mb-4 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-1.5" style={{ backgroundColor: theme.primaryColor + '33' }}>
              {editingEntryId ? (
                <Edit2 className="h-4 w-4" style={{ color: theme.primaryColor }} />
              ) : (
                <Plus className="h-4 w-4" style={{ color: theme.primaryColor }} />
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              {editingEntryId ? "Edit Planning Entry" : "Add New Planning Entry"}
            </h2>
            {editingEntryId && (
              <span className="text-xs text-orange-500 ml-2 font-medium">Editing mode</span>
            )}
            <span className="text-xs text-slate-400 ml-2">Fill the details below</span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Calendar className="h-3.5 w-3.5" style={{ color: theme.primaryColor }} />
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="createPlanningForDate"
                min={getCurrentDateTime()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.createPlanningForDate}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                style={{ borderColor: formik.values.createPlanningForDate ? theme.primaryColor : undefined }}
                disabled={!!editingEntryId}
              />
              {formik.touched.createPlanningForDate &&
                formik.errors.createPlanningForDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.createPlanningForDate}
                  </p>
                )}
              {editingEntryId && (
                <p className="mt-1 text-xs text-amber-500">Date cannot be changed while editing</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Building2 className="h-3.5 w-3.5" style={{ color: theme.primaryColor }} />
                Organization
              </label>
              <Select
                isLoading={dropdownLoading}
                options={organizationOptions}
                value={organizationOptions.find(
                  (opt) => opt.value === formik.values.selectOrganization
                )}
                onChange={(selected) =>
                  formik.setFieldValue("selectOrganization", selected?.value || "")
                }
                onBlur={() => formik.setFieldTouched("selectOrganization", true)}
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
                    style={{ borderColor: formik.values.customOrganization ? theme.primaryColor : undefined }}
                  />
                  <p className="text-[11px] text-orange-500 font-medium">Note: Please add this organization into database</p>
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
                <Stethoscope className="h-3.5 w-3.5" style={{ color: theme.primaryColor }} />
                Individual Name
              </label>
              <Select
                isLoading={dropdownLoading}
                options={doctorOptions}
                value={doctorOptions.find(
                  (opt) => opt.value === formik.values.nameOfDoctor
                )}
                onChange={(selected) =>
                  formik.setFieldValue("nameOfDoctor", selected?.value || "")
                }
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
                    style={{ borderColor: formik.values.customDoctor ? theme.primaryColor : undefined }}
                  />
                  <p className="text-[11px] text-orange-500 font-medium">Note: Please add this individual into database</p>
                </div>
              )}
              {formik.touched.nameOfDoctor && formik.errors.nameOfDoctor && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.nameOfDoctor}
                </p>
              )}
              {formik.touched.customDoctor &&
                formik.errors.customDoctor && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.customDoctor}
                  </p>
                )}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Package className="h-3.5 w-3.5" style={{ color: theme.primaryColor }} />
                Product
              </label>
              <Select
                isLoading={dropdownLoading}
                options={productOptions}
                value={productOptions.find(
                  (opt) => opt.value === formik.values.productToBePromoted
                )}
                onChange={(selected) =>
                  formik.setFieldValue("productToBePromoted", selected?.value || "")
                }
                onBlur={() => formik.setFieldTouched("productToBePromoted", true)}
                isClearable
                placeholder="Select Product"
                styles={customSelectStyles}
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
                <Target className="h-3.5 w-3.5" style={{ color: theme.primaryColor }} />
                Call Objective
              </label>
              <Select
                options={callObjectiveOptions}
                value={callObjectiveOptions.find(
                  (opt) => opt.value === formik.values.callObjective
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
              disabled={!formik.values.createPlanningForDate || !!editingEntryId}
            />
            <Button
              text={editingEntryId ? "Edit in Plan" : "Add to Plan"}
              variant={1}
              icon={editingEntryId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              onClick={formik.handleSubmit}
              loading={submitLoading}
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
                <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ backgroundColor: theme.primaryColor + '20' }}>
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: theme.primaryColor }} />
                  <span className="text-xs font-medium" style={{ color: theme.primaryColor }}>
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
                <p className="text-sm text-slate-400">No planning entries found for this date</p>
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
                  {planningEntries.map((entry, index) => (
                    <tr
                      key={entry._id || index}
                      className={`transition-all duration-200 hover:bg-slate-50/50 group ${editingEntryId === entry._id ? 'bg-blue-50' : ''}`}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(index)}`} />
                          {new Date(entry.createPlanningForDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
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
                        <div className="flex items-center gap-2">
                          <Pill className="h-3.5 w-3.5 text-slate-400" />
                          {entry.productToBePromoted}
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