import React, { useEffect, useMemo, useState } from "react";
import ReactSelect from "react-select";
import { getIn } from "formik";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import { useTheme } from "../../../../../../hooks/theme/useTheme";

/* ------------------------------------------------------------------ *
 * Company theme helpers (colors come from useTheme() -> Themes.js)
 * ------------------------------------------------------------------ */
// hex + alpha suffix - same convention used across the app (theme.primaryColor + "20")
// NOTE: some theme tokens are already 8-digit hex (e.g. EnviroSolution highlightColor
// "#cae3caff"), so any existing alpha channel is stripped before the new one is applied.
const withAlpha = (hex, alpha = "33") => {
  if (typeof hex !== "string") return hex;
  if (!/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex)) return hex;
  const a = /^[0-9a-fA-F]{1,2}$/.test(alpha) ? alpha.padStart(2, "0") : "33";
  return `${hex.slice(0, 7)}${a}`;
};

// soft theme tint used for input / select borders (falls back to primaryColor,
// then to a neutral gray when no theme is available yet)
const tintBorder = (theme, alpha = "AA", fallback = "#d1d5db") =>
  withAlpha(theme?.highlightColor || theme?.primaryColor, alpha) || fallback;

// semantic (theme independent) tokens
const ERROR_COLOR = "#ef4444";   // invalid field border / message
const MUTED_COLOR = "#9ca3af";   // neutral / disabled border
const DISABLED_BG = "#f3f4f6";   // disabled field background

// border + background for text inputs / textareas
const fieldBorderColor = (theme, invalid, disabled) =>
  invalid ? ERROR_COLOR : disabled ? MUTED_COLOR : tintBorder(theme);
const fieldBackgroundColor = (disabled) => (disabled ? DISABLED_BG : "#ffffff");

// react-select styling driven by the active company theme
const makeSelectStyles = (theme, hasError = false) => {
  const primary = theme?.primaryColor || "#4FA8E5";
  const secondary = theme?.secondaryColor || "#89CFF0";
  return {
    control: (base, state) => ({
      ...base,
      minHeight: "50px",
      borderRadius: "0.75rem",
      borderColor: hasError
        ? ERROR_COLOR
        : state.isDisabled
          ? MUTED_COLOR
          : state.isFocused
            ? primary
            : tintBorder(theme, "AA"),
      backgroundColor: state.isDisabled ? DISABLED_BG : base.backgroundColor,
      boxShadow: hasError
        ? `0 0 0 1px ${ERROR_COLOR}`
        : state.isFocused
          ? `0 0 0 1px ${primary}`
          : "0 1px 2px rgba(0,0,0,0.05)",
      "&:hover": {
        borderColor: state.isDisabled ? MUTED_COLOR : hasError ? ERROR_COLOR : primary,
      },
    }),
    placeholder: (base) => ({ ...base, color: MUTED_COLOR }),
    dropdownIndicator: (base) => ({ ...base, color: theme?.accentColor || primary }),
    indicatorSeparator: (base) => ({ ...base, backgroundColor: withAlpha(primary, "66") }),
    menu: (base) => ({ ...base, borderRadius: "0.5rem", marginTop: "4px", zIndex: 1000 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? primary
        : state.isFocused
          ? withAlpha(secondary, "99")
          : base.backgroundColor,
      color: state.isSelected ? "#ffffff" : base.color,
      cursor: "pointer",
    }),
    multiValue: (base) => ({ ...base, backgroundColor: withAlpha(secondary, "AA") }),
    multiValueLabel: (base) => ({ ...base, color: theme?.accentColor || primary }),
    multiValueRemove: (base) => ({
      ...base,
      color: primary,
      ":hover": { backgroundColor: primary, color: "#ffffff" },
    }),
  };
};

// scoped vf-* classes so inputs / drops / buttons also follow the company theme
const themeCss = (theme) => {
  const primary = theme?.primaryColor || "#4FA8E5";
  const secondary = theme?.secondaryColor || "#89CFF0";
  const accent = theme?.accentColor || primary;
  return `
.vf-input, .vf-area { transition: border-color .15s ease, box-shadow .15s ease; }
.vf-input:focus, .vf-area:focus { border-color: ${primary} !important; box-shadow: 0 0 0 3px ${withAlpha(primary, "33")}; }
.vf-input:hover:not(:disabled):not(:focus), .vf-area:hover:not(:disabled):not(:focus) { border-color: ${withAlpha(primary, "80")}; }
.vf-input.is-error:focus, .vf-area.is-error:focus { border-color: ${ERROR_COLOR} !important; box-shadow: 0 0 0 3px ${withAlpha(ERROR_COLOR, "55")}; }
.vf-input:disabled, .vf-area:disabled { cursor: not-allowed; }
.vf-drop { transition: background-color .15s ease, border-color .15s ease; }
.vf-drop:not(.is-disabled):hover { background-color: ${withAlpha(secondary, "55")} !important; border-color: ${primary} !important; }
.vf-drop.is-disabled { cursor: not-allowed; }
.vf-btn { transition: filter .15s ease; }
.vf-btn:hover:not(:disabled) { filter: brightness(0.92); }
.vf-link { color: ${theme?.accentColor || primary}; }
`;
};

const Section = ({ index, title, subtitle, children }) => {
  const { theme } = useTheme();
  return (
    <div
      className="border rounded-2xl shadow-sm bg-white overflow-visible"
      style={{ borderColor: withAlpha(theme?.primaryColor, "40") }}
    >
      <div
        className="px-5 py-4 border-b"
        style={{
          background: `linear-gradient(to right, ${withAlpha(theme?.primaryColor, "26")}, ${withAlpha(theme?.secondaryColor, "66")})`,
          borderColor: withAlpha(theme?.primaryColor, "33"),
        }}
      >
        <h2
          className="text-base md:text-lg font-semibold"
          style={{ color: theme?.accentColor || theme?.primaryColor }}
        >
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold mr-2"
            style={{ backgroundColor: theme?.primaryColor }}
          >
            {index}
          </span>
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-600 mt-1 ml-9">{subtitle}</p>}
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

const TField = ({ label, name, formik, type = "text", placeholder, disabled, required }) => {
  const { theme } = useTheme();
  const v = getIn(formik.values, name) ?? "";
  const e = getIn(formik.errors, name);
  const t = getIn(formik.touched, name);
  const disp = type === "date" && v instanceof Date ? v.toISOString().split("T")[0] : v;
  const invalid = !!(e && t);
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
      <input type={type} name={name} value={disp ?? ""} placeholder={placeholder} disabled={disabled}
        onWheel={(ev) => type === "number" && ev.target.blur()}
        onChange={(ev) => {
          if (type === "number") formik.setFieldValue(name, ev.target.value === "" ? "" : Number(ev.target.value));
          else if (type === "date") formik.setFieldValue(name, ev.target.value || "");
          else formik.handleChange(ev);
        }}
        onBlur={formik.handleBlur}
        className={`vf-input no-spinner w-full px-3 py-3 border rounded-xl text-sm focus:outline-none ${invalid ? "is-error" : ""} ${disabled ? "text-gray-500" : ""}`}
        style={{
          borderColor: fieldBorderColor(theme, invalid, disabled),
          backgroundColor: fieldBackgroundColor(disabled),
        }} />
      {e && t && <div className="text-red-500 text-xs mt-1">{e}</div>}
    </div>
  );
};

const TArea = ({ label, name, formik, placeholder, disabled }) => {
  const { theme } = useTheme();
  const v = getIn(formik.values, name) ?? "";
  const e = getIn(formik.errors, name);
  const t = getIn(formik.touched, name);
  const invalid = !!(e && t);
  return (
    <div className="w-full md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea name={name} rows={3} value={v} disabled={disabled} placeholder={placeholder}
        onChange={formik.handleChange} onBlur={formik.handleBlur}
        className={`vf-area w-full px-3 py-3 border rounded-xl text-sm focus:outline-none ${invalid ? "is-error" : ""} ${disabled ? "text-gray-500" : ""}`}
        style={{
          borderColor: fieldBorderColor(theme, invalid, disabled),
          backgroundColor: fieldBackgroundColor(disabled),
        }} />
      {e && t && <div className="text-red-500 text-xs mt-1">{e}</div>}
    </div>
  );
};

const SField = ({ label, name, formik, options = [], placeholder, isMulti = false, isDisabled = false, required }) => {
  const { theme } = useTheme();
  const raw = getIn(formik.values, name);
  const e = getIn(formik.errors, name);
  const t = getIn(formik.touched, name);
  const invalid = !!(e && t);
  const list = (Array.isArray(options) ? options : []).map((o) => (typeof o === "string" ? { label: o, value: o } : o));
  const val = isMulti ? list.filter((o) => (Array.isArray(raw) ? raw.includes(o.value) : false)) : list.find((o) => o.value === raw) || null;
  // theme aware react-select styles (rebuild only when theme / error state changes)
  const themedStyles = useMemo(() => makeSelectStyles(theme, invalid), [theme, invalid]);
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
      <ReactSelect options={list} value={val} isMulti={isMulti} isClearable isDisabled={isDisabled}
        styles={themedStyles} placeholder={placeholder || `Select ${label || ""}`}
        classNamePrefix="react-select"
        onChange={(sel) => {
          if (isMulti) formik.setFieldValue(name, sel ? sel.map((s) => s.value) : []);
          else formik.setFieldValue(name, sel?.value || "");
        }}
        onBlur={() => formik.setFieldTouched(name, true)} />
      {e && t && typeof e === "string" && <div className="text-red-500 text-xs mt-1">{e}</div>}
    </div>
  );
};

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx";
const fName = (f) => { if (!f) return ""; if (typeof f === "string") return f.split("/").pop(); return f.name || "Selected file"; };

const FField = ({ label, name, formik, disabled, hint, required }) => {
  const { theme } = useTheme();
  const v = getIn(formik.values, name);
  const e = getIn(formik.errors, name);
  const t = getIn(formik.touched, name);
  const id = `vf-${name.replace(/[^a-zA-Z0-9]/g, "-")}`;
  const url = typeof v === "string" && v ? v : null;
  const invalid = !!(e && t);
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
      <label htmlFor={id}
        className={`vf-drop flex items-center justify-between gap-3 w-full px-3 py-3 border border-dashed rounded-xl text-sm ${disabled ? "is-disabled text-gray-400 cursor-not-allowed" : "cursor-pointer"}`}
        style={{
          borderColor: invalid ? ERROR_COLOR : disabled ? MUTED_COLOR : withAlpha(theme?.primaryColor, "AA"),
          backgroundColor: disabled ? DISABLED_BG : withAlpha(theme?.backgroundColor, "CC"),
        }}>
        <span className="truncate">{v ? <span className="font-medium text-gray-800">📎 {fName(v)}</span> : <span className="text-gray-500">📤 Click to upload {label || "file"}</span>}</span>
        <span
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: disabled ? MUTED_COLOR : theme?.primaryColor,
            color: disabled ? "#6b7280" : "#ffffff",
          }}
        >{v ? "Change" : "Browse"}</span>
      </label>
      <input id={id} type="file" accept={ACCEPT} disabled={disabled} className="hidden"
        onChange={(ev) => { formik.setFieldValue(name, ev.target.files?.[0] || null); formik.setFieldTouched(name, true); }} />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {v && !disabled && (
        <div className="flex items-center gap-3 mt-1.5">
          {url && <a href={url} target="_blank" rel="noreferrer" className="vf-link text-xs underline">View file</a>}
          <button type="button" onClick={() => formik.setFieldValue(name, null)} className="text-xs text-red-500 underline">Remove</button>
        </div>
      )}
      {e && t && typeof e === "string" && <div className="text-red-500 text-xs mt-1">{e}</div>}
    </div>
  );
};

const MFiles = ({ label, name, formik, disabled, hint }) => {
  const { theme } = useTheme();
  const files = getIn(formik.values, name) || [];
  const e = getIn(formik.errors, name);
  const t = getIn(formik.touched, name);
  const id = `vm-${name.replace(/[^a-zA-Z0-9]/g, "-")}`;
  return (
    <div className="w-full md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <label htmlFor={id}
        className={`vf-drop flex items-center justify-between gap-3 w-full px-3 py-3 border border-dashed rounded-xl text-sm ${disabled ? "is-disabled cursor-not-allowed text-gray-400" : "cursor-pointer"}`}
        style={{
          borderColor: disabled ? MUTED_COLOR : withAlpha(theme?.primaryColor, "AA"),
          backgroundColor: disabled ? DISABLED_BG : withAlpha(theme?.backgroundColor, "CC"),
        }}>
        <span className="text-gray-500">📤 Upload multiple files {files.length > 0 && `(${files.length} selected)`}</span>
        <span
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: disabled ? MUTED_COLOR : theme?.primaryColor,
            color: disabled ? "#6b7280" : "#ffffff",
          }}
        >Browse</span>
      </label>
      <input id={id} type="file" multiple accept={ACCEPT} disabled={disabled} className="hidden"
        onChange={(ev) => { formik.setFieldValue(name, [...(files || []), ...Array.from(ev.target.files || [])]); formik.setFieldTouched(name, true); }} />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between border rounded-lg px-3 py-2 text-xs"
              style={{
                backgroundColor: withAlpha(theme?.backgroundColor, "80"),
                borderColor: withAlpha(theme?.primaryColor, "40"),
              }}
            >
              <span className="truncate font-medium">📎 {fName(f)}</span>
              {!disabled && <button type="button" className="text-red-500 underline ml-3 shrink-0" onClick={() => { const n = [...files]; n.splice(i, 1); formik.setFieldValue(name, n); }}>Remove</button>}
            </li>
          ))}
        </ul>
      )}
      {e && t && typeof e === "string" && <div className="text-red-500 text-xs mt-1">{e}</div>}
    </div>
  );
};
const DRow = ({ label, name, formik }) => {
  const { theme } = useTheme();
  const v = getIn(formik.values, name);
  return (
    <div
      className="flex items-center justify-between border rounded-xl px-4 py-3 text-sm"
      style={{
        backgroundColor: withAlpha(theme?.backgroundColor, "80"),
        borderColor: withAlpha(theme?.primaryColor, "40"),
      }}
    >
      <span className="font-medium text-gray-700">{label}</span>
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={v
          ? { backgroundColor: withAlpha(theme?.primaryColor, "33"), color: theme?.accentColor || theme?.primaryColor }
          : { backgroundColor: "#e5e7eb", color: "#6b7280" }}
      >
        {v ? `✔ ${fName(v)}` : "Not uploaded"}
      </span>
    </div>
  );
};

const VTYPE = ["Supplier", "Distributor"];
const YESNO = ["Yes", "No"];
const ORGTYPE = ["Proprietorship", "Partnership", "Private Limited", "Public Limited", "LLP", "Trust / Society / NGO", "Government", "Other"];
const BCAT = ["Pharmaceuticals", "Medical Devices", "Surgical Consumables", "Lab Reagents & Diagnostics", "Hospital Equipment", "Other"];
const CNTRY = ["India", "USA", "UK", "UAE", "Singapore", "Other"];
const SUPTYPE = ["Manufacturer", "Authorized Supplier", "Wholesaler", "Retailer", "Importer", "Stockist", "Other"];
const SUPCAT = ["Preferred", "Approved", "Conditional", "Trial", "Blacklisted"];
const DISTYPE = ["Exclusive", "Non-Exclusive", "Regional", "National", "Super Stockist", "Other"];
const DISCAT = ["Platinum", "Gold", "Silver", "General", "Trial"];
const PCAT = ["Drugs / Medicines", "Surgical Items", "Medical Devices", "Lab / Diagnostics", "Consumables", "Equipment", "Services", "Other"];
const PRODS = ["Tablets / Capsules", "Injections", "Sutures", "Gloves", "Syringes", "IV Fluids", "Implants", "Diagnostic Kits", "Lab Reagents", "OT Equipment", "Hospital Furniture", "IT Services"];
const OPREG = ["Pan India", "Zonal", "State Level", "District Level", "City / Local"];
const PRTYPE = ["Fixed", "Variable", "Contractual", "MRP Based", "Discounted", "Tender / L1 Based"];
const PAYT = ["Advance", "COD", "7 Days Credit", "15 Days Credit", "30 Days Credit", "45 Days Credit", "60 Days Credit", "90 Days Credit"];
const AGTYPE = ["MoU", "Rate Contract", "Annual Contract", "One-time Purchase", "Service Agreement", "Distributorship Agreement", "Other"];
const LICTYPE = ["Drug License", "FSSAI License", "Trade License", "Import License", "Manufacturing License", "Other"];

export const vendorInitialValues = {
  segment: "", typeOfDoctorProfile: "", vendorType: "",
  vendorUniqueId: "", companyName: "",  contactNumber: "",
  emailAddress: "", website: "", organizationType: "",
  businessCategory: "", companyRegistrationNumber: "",
   region: "", state: "", district: "", city: "", pincode: "", completeAddress: "",
  gstNumber: "", panNumber: "", gstCertificate: null, panDocument: null,
  supplierType: "", supplierCategory: "", operatingRegion: "",
  supplierProductCategory: [],
  certificationAvailable: "", certificationDetails: "", certificationDocument: null,
  supplierPricingType: "", productCostPrice: "", pricingContract: null, supplierPaymentTerms: "",
  distributorType: "", distributorCategory: "", distributorProductCategory: [],
  distributionTerritory: "", licenseAvailable: "", licenseType: "",
  licenseNumber: "", licenseIssueDate: "", licenseExpiryDate: "", licenseDocument: null,
  complianceDetails: "", complianceDocuments: null,productPrice: "",
  distributorPricingType: "", distributorPaymentTerms: "",
  mouAvailable: "", agreementType: "", agreementNumber: "",
  agreementStartDate: "", agreementEndDate: "", agreementValidity: "", agreementDocument: null,
  otherDocuments: [],
};

// Vendor form is only rendered when Segment = "Vendor Management" and
// Type of Individual Profile = "Supplier" | "Distributor", so the vendor type is
// always driven by the selected profile (the dropdown below stays locked).
export const VENDOR_PROFILE_TYPES = ["Supplier", "Distributor"];
export const isVendorProfileType = (value) =>
  VENDOR_PROFILE_TYPES.some(
    (t) => t.toLowerCase() === (value || "").toString().trim().toLowerCase()
  );
// returns the canonical "Supplier" / "Distributor" label (or "" when not a vendor profile)
export const normalizeVendorProfileType = (value) =>
  VENDOR_PROFILE_TYPES.find(
    (t) => t.toLowerCase() === (value || "").toString().trim().toLowerCase()
  ) || "";

const Vendor = ({ formik, isReadOnly = false, selectedSector, selectedDoctor }) => {
  const [stCode, setStCode] = useState("");
  const { theme } = useTheme();
  const { fetchAllRegion, region, fetchAllStateName, allStateName, fetchDistrictList, districtList, fetchAllCities, cities } = useDropdown();
  const dis = !!isReadOnly;
  // company themed scoped styles (rebuild only when the active theme changes)
  const themedCss = useMemo(() => themeCss(theme), [theme]);
  // comes from "Type of Individual Profile" (Supplier / Distributor)
  const profileVendorType = normalizeVendorProfileType(selectedDoctor?.value);
  const vType = profileVendorType || getIn(formik.values, "vendorType") || "";
  const isSup = vType === "Supplier";
  const isDis = vType === "Distributor";
  useEffect(() => { fetchAllRegion(); fetchAllStateName(); }, []);
  // keep formik in sync with the selected profile so validation / payload always match
  useEffect(() => {
    if (!profileVendorType) return;
    if (getIn(formik.values, "vendorType") !== profileVendorType) {
      formik.setFieldValue("vendorType", profileVendorType);
    }
    if (getIn(formik.values, "typeOfDoctorProfile") !== profileVendorType) {
      formik.setFieldValue("typeOfDoctorProfile", profileVendorType);
    }
  }, [profileVendorType, formik.values?.vendorType, formik.values?.typeOfDoctorProfile]);
  useEffect(() => {
    const s = getIn(formik.values, "agreementStartDate");
    const e2 = getIn(formik.values, "agreementEndDate");
    if (s && e2) {
      const a = new Date(s); const b = new Date(e2);
      if (!isNaN(a) && !isNaN(b) && b >= a) {
        const m = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
        const lbl = `${m} Month${m > 1 ? "s" : ""}`;
        if (getIn(formik.values, "agreementValidity") !== lbl) formik.setFieldValue("agreementValidity", lbl);
      }
    }
  }, [formik.values?.agreementStartDate, formik.values?.agreementEndDate]);
  const genId = () => formik.setFieldValue("vendorUniqueId", `VEN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  return (
    <div>
      <style>{themedCss}</style>
      <h1
        className="text-2xl font-bold mb-6 pb-4 border-b"
        style={{
          color: theme?.accentColor || theme?.primaryColor,
          borderColor: withAlpha(theme?.primaryColor, "66"),
        }}
      >
        {selectedDoctor?.label ? ` ${selectedDoctor.label.toUpperCase()} INFORMATION` : "VENDOR INFORMATION"}
        {vType && (
          <span
            className="ml-3 align-middle text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: withAlpha(theme?.primaryColor, "33"), color: theme?.accentColor || theme?.primaryColor }}
          >
            {vType}
          </span>
        )}
      </h1>
      {/* <div
        className="border rounded-2xl p-5 mb-6"
        style={{
          borderColor: withAlpha(theme?.primaryColor, "55"),
          backgroundColor: withAlpha(theme?.backgroundColor, "CC"),
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <SField label="Vendor Type" name="vendorType" formik={formik} options={VTYPE} placeholder="Select Supplier / Distributor" isDisabled={dis || !!profileVendorType} required />
          <p className="text-xs text-gray-500 leading-relaxed">
            Vendor Type <b>Type of Individual Profile</b> (Supplier / Distributor) se auto set hota hai. Supplier par Supplier fields, Distributor par Distributor fields dikhenge, Agreement dono ke liye common hai.
            {selectedSector?.value ? <> Segment: <b>{selectedSector.value}</b></> : null}
          </p>
        </div>
      </div> */}
      <div className="space-y-6">
        <Section index="1" title="Basic Vendor Details">
          {/* <div className="flex gap-2 items-end">
            <div className="flex-1"><TField label="Vendor Unique ID" name="vendorUniqueId" formik={formik} placeholder="e.g. VEN-2026-1024" disabled={dis} required /></div>
            {!dis && (
              <button
                type="button"
                onClick={genId}
                className="vf-btn shrink-0 px-3 py-3 text-xs font-semibold text-white rounded-xl"
                style={{ backgroundColor: theme?.accentColor || theme?.primaryColor }}
              >
                Auto Generate
              </button>
            )}
          </div> */}
          <TField label="Company Name" name="companyName" formik={formik} placeholder="Enter Company Name" disabled={dis} required />
          {/* <TField label="Contact Person Name" name="contactPersonName" formik={formik} placeholder="Enter Contact Person Name" disabled={dis} required /> */}
          <TField label="Contact Number" name="contactNumber" formik={formik} type="number" placeholder="Enter Contact Number" disabled={dis} required />
          {/* <TField label="Alternate Contact Number" name="alternateContactNumber" formik={formik} type="number" placeholder="Enter Alternate Number" disabled={dis} /> */}
          <TField label="Email Address" name="emailAddress" formik={formik} type="email" placeholder="Enter Email Address" disabled={dis} required />
          <TField label="Website" name="website" formik={formik} placeholder="https://example.com" disabled={dis} />
          <SField label="Organization Type" name="organizationType" formik={formik} options={ORGTYPE} isDisabled={dis} required />
          <SField label="Business Category" name="businessCategory" formik={formik} options={BCAT} isDisabled={dis} required />
          <TField label="Company Registration Number" name="companyRegistrationNumber" formik={formik} placeholder="Enter CIN / Registration No." disabled={dis} />
        </Section>
        <Section index="2" title="Address Details">
          {/* <SField label="Country" name="country" formik={formik} options={CNTRY} isDisabled={dis} /> */}
          <SField label="Region" name="region" formik={formik} isDisabled={dis}
            options={(Array.isArray(region) ? region : []).map((r) => ({ label: r.name || r, value: r.name || r }))} />
          <SField label="State" name="state" formik={formik} isDisabled={dis || !formik.values.region}
            options={(Array.isArray(allStateName) ? allStateName : []).map((s) => ({ label: s.name || s.stateName, value: s.name || s.stateName }))} />
          <SField label="District" name="district" formik={formik} isDisabled={dis || !formik.values.state}
            options={(Array.isArray(districtList) ? districtList : []).map((d) => ({ label: d, value: d }))} />
          <SField label="City" name="city" formik={formik} isDisabled={dis || !formik.values.district}
            options={(Array.isArray(cities) ? cities : []).map((c) => ({ label: c, value: c }))} />
          <TField label="Pincode" name="pincode" formik={formik} type="number" placeholder="Enter Pincode" disabled={dis} />
          <TArea label="Complete Address" name="completeAddress" formik={formik} placeholder="House No, Street, Area..." disabled={dis} />
          <Cascade formik={formik} fetchAllStateName={fetchAllStateName} fetchDistrictList={fetchDistrictList} fetchAllCities={fetchAllCities} stCode={stCode} setStCode={setStCode} allStateName={allStateName} />
        </Section>
        <Section index="3" title="Tax & Registration Details" subtitle="GST / PAN with document upload">
          <TField label="GST Number" name="gstNumber" formik={formik} placeholder="e.g. 27ABCDE1234F1Z5" disabled={dis} />
          <TField label="PAN Number" name="panNumber" formik={formik} placeholder="e.g. ABCDE1234F" disabled={dis} />
          <FField label="GST Certificate" name="gstCertificate" formik={formik} disabled={dis} hint="PDF / JPG / PNG" />
          <FField label="PAN Document" name="panDocument" formik={formik} disabled={dis} hint="PDF / JPG / PNG" />
        </Section>
        {!vType && (
          <div
            className="border border-dashed rounded-2xl p-6 text-center text-sm text-gray-600"
            style={{
              borderColor: withAlpha(theme?.primaryColor, "88"),
              backgroundColor: withAlpha(theme?.backgroundColor, "AA"),
            }}
          >
            Is form ke liye <b>Vendor Type</b> (Supplier / Distributor) select karein &#8212; uske hisaab se Supplier / Distributor fields dikhte hain.
          </div>
        )}
        {isSup && (
          <Section index="4" title="Supplier Details" subtitle="Sirf Vendor Type = Supplier par visible">
            <SField label="Supplier Type" name="supplierType" formik={formik} options={SUPTYPE} isDisabled={dis} required />
            <SField label="Supplier Category" name="supplierCategory" formik={formik} options={SUPCAT} isDisabled={dis} />
            <SField label="Operating Region" name="operatingRegion" formik={formik} options={OPREG} isDisabled={dis} />
            <SField label="Product Category" name="supplierProductCategory" formik={formik} options={PCAT} isMulti isDisabled={dis} />
            {/* <SField label="Products" name="supplierProducts" formik={formik} options={PRODS} isMulti isDisabled={dis} /> */}
            <SField label="Certification Available" name="certificationAvailable" formik={formik} options={YESNO} isDisabled={dis} />
            {getIn(formik.values, "certificationAvailable") === "Yes" && (
              <>
                <TField label="Certification Details" name="certificationDetails" formik={formik} placeholder="e.g. ISO 9001, GMP" disabled={dis} />
                <FField label="Certification Document" name="certificationDocument" formik={formik} disabled={dis} />
              </>
            )}
            <SField label="Pricing Type" name="supplierPricingType" formik={formik} options={PRTYPE} isDisabled={dis} />
            <TField label="Product Cost / Price" name="productCostPrice" formik={formik} type="number" placeholder="Enter Cost / Price" disabled={dis} />
            <FField label="Pricing Contract" name="pricingContract" formik={formik} disabled={dis} hint="Rate contract / quotation PDF" />
            <SField label="Payment Terms" name="supplierPaymentTerms" formik={formik} options={PAYT} isDisabled={dis} />
          </Section>
        )}
        {isDis && (
          <Section index="4" title="Distributor Details" subtitle="Sirf Vendor Type = Distributor par visible">
            <SField label="Distributor Type" name="distributorType" formik={formik} options={DISTYPE} isDisabled={dis} required />
            <SField label="Distributor Category" name="distributorCategory" formik={formik} options={DISCAT} isDisabled={dis} />
            <SField label="Product Category" name="distributorProductCategory" formik={formik} options={PCAT} isMulti isDisabled={dis} />
            {/* <SField label="Products" name="distributorProducts" formik={formik} options={PRODS} isMulti isDisabled={dis} /> */}
            <TField label="Distribution Territory" name="distributionTerritory" formik={formik} placeholder="e.g. Maharashtra - West" disabled={dis} />
            {/* <TField label="Product-wise Territory" name="productWiseTerritory" formik={formik} placeholder="e.g. Product A - Pune" disabled={dis} /> */}
            <SField label="License Available" name="licenseAvailable" formik={formik} options={YESNO} isDisabled={dis} />
            {getIn(formik.values, "licenseAvailable") === "Yes" && (
              <>
                <SField label="License Type" name="licenseType" formik={formik} options={LICTYPE} isDisabled={dis} />
                <TField label="License Number" name="licenseNumber" formik={formik} placeholder="Enter License Number" disabled={dis} />
                <TField label="License Issue Date" name="licenseIssueDate" formik={formik} type="date" disabled={dis} />
                <TField label="License Expiry Date" name="licenseExpiryDate" formik={formik} type="date" disabled={dis} />
                <FField label="License Document" name="licenseDocument" formik={formik} disabled={dis} />
              </>
            )}
            <TField label="Compliance Details" name="complianceDetails" formik={formik} placeholder="Enter Compliance Details" disabled={dis} />
            <FField label="Compliance Documents" name="complianceDocuments" formik={formik} disabled={dis} />
            {/* <TField label="Territory Start Date" name="territoryStartDate" formik={formik} type="date" disabled={dis} /> */}
            {/* <TField label="Territory End Date" name="territoryEndDate" formik={formik} type="date" disabled={dis} /> */}
            <TField label="Product Price" name="productPrice" formik={formik} type="number" placeholder="Enter Product Price" disabled={dis} />
            <SField label="Pricing Type" name="distributorPricingType" formik={formik} options={PRTYPE} isDisabled={dis} />
            <SField label="Payment Terms" name="distributorPaymentTerms" formik={formik} options={PAYT} isDisabled={dis} />
          </Section>
        )}
        <Section index="5" title="Agreement / MoU Details" subtitle="Supplier aur Distributor dono ke liye common">
          <SField label="MoU / Agreement Available" name="mouAvailable" formik={formik} options={YESNO} isDisabled={dis} />
          {getIn(formik.values, "mouAvailable") === "Yes" && (
            <>
              <SField label="Agreement Type" name="agreementType" formik={formik} options={AGTYPE} isDisabled={dis} />
              <TField label="Agreement Number" name="agreementNumber" formik={formik} placeholder="Enter Agreement Number" disabled={dis} />
              <TField label="Agreement Start Date" name="agreementStartDate" formik={formik} type="date" disabled={dis} />
              <TField label="Agreement End Date" name="agreementEndDate" formik={formik} type="date" disabled={dis} />
              <TField label="Agreement Validity" name="agreementValidity" formik={formik} placeholder="Auto (e.g. 12 Months)" disabled />
              <FField label="Agreement Document" name="agreementDocument" formik={formik} disabled={dis} hint="Signed MoU / Agreement PDF" />
            </>
          )}
        </Section>
        <Section index="6" title="Compliance & Documents" subtitle="Uploaded documents summary + extra files">
          <DRow label="GST Certificate" name="gstCertificate" formik={formik} />
          <DRow label="PAN Document" name="panDocument" formik={formik} />
          {isSup && <><DRow label="Certification Document" name="certificationDocument" formik={formik} /><DRow label="Pricing Contract Document" name="pricingContract" formik={formik} /></>}

          {isDis && <><DRow label="License Document" name="licenseDocument" formik={formik} /><DRow label="Compliance Documents" name="complianceDocuments" formik={formik} /></>}
          <DRow label="MoU / Agreement Document" name="agreementDocument" formik={formik} />
          <MFiles label="Other Documents" name="otherDocuments" formik={formik} disabled={dis} hint="Multiple supporting files" />
        </Section>
      </div>
    </div>
  );
};

const Cascade = ({ formik, fetchAllStateName, fetchDistrictList, fetchAllCities, stCode, setStCode, allStateName }) => {
  const rg = formik.values?.region;
  const st = formik.values?.state;
  const dt = formik.values?.district;
  const prev = React.useRef({ rg: "", st: "", dt: "" });
  useEffect(() => { if (rg && rg !== prev.current.rg) { prev.current.rg = rg; fetchAllStateName(rg); } }, [rg]);
  useEffect(() => {
    if (st && st !== prev.current.st) {
      prev.current.st = st;
      const m = (allStateName || []).find((x) => (x.name || x.stateName) === st);
      if (m) setStCode(m.code || m.stateCode || "");
      fetchDistrictList(st);
    }
  }, [st]);
  useEffect(() => { if (dt && dt !== prev.current.dt) { prev.current.dt = dt; fetchAllCities(stCode, dt); } }, [dt]);
  return null;
};

export default Vendor;
