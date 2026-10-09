import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as LucideIcons from "lucide-react";
import useAllSalesAnalytics from '../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics';
import useAllSalesEnviroAnalytics from '../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesEnviroAnalytics';
import useCompany from '../../../../hooks/common/useCompany';
import LoaderSpinner from '../../../../components/uiComponents/loader/LoaderSpinner.jsx';
import BreadCrumb from '../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx';
import Pagination from '../../../../components/uiComponents/pagination/Pagination.jsx';

// ✅ Enviro Solution sends the monthly planning as a LIST
//      [ { month, year, plannings: [...] } ]
//    while the healthcare API sends a MAP keyed by month
//      { "September": [...] }
//    The list is turned into the same map so the rest of the page can stay
//    unchanged; the year is kept in the key ("September 2026").
const monthlyListToMap = (groups) => {
  const map = {};
  (Array.isArray(groups) ? groups : []).forEach((group) => {
    const key =
      `${group?.month || ""} ${group?.year || ""}`.trim() || "Unknown month";
    map[key] = Array.isArray(group?.plannings) ? group.plannings : [];
  });
  return map;
};

// ✅ Same list for the healthcare monthlyPlanning map, but every value is
//    forced to an array so `.length` / `.map` can never throw.
const toMonthMap = (value) => {
  if (Array.isArray(value)) return monthlyListToMap(value);
  if (!value || typeof value !== "object") return {};
  const map = {};
  Object.entries(value).forEach(([key, val]) => {
    map[key] = Array.isArray(val) ? val : [];
  });
  return map;
};

// Fields that identify one person / organization row. Used to tell a real row
// apart from a counts object like { Farmer: 5, FPO: 2 }.
const ROW_KEYS = [
  "_id",
  "id",
  "fullName",
  "name",
  "organizationName",
  "hospitalName",
  "department",
  "segment",
  "typeOfProfile",
  "uniqueId",
  "hospitalData",
];

// ✅ `individuals` / `organizations` have come back from the two detail APIs as
//    an array of rows, a map keyed by type, a wrapper object ({ data: [...] })
//    or even a single row. The tables only know how to read an array, and
//    calling `.filter` on anything else crashes the whole page - so normalize
//    every shape here instead of assuming the happy path.
const toRows = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const values = Object.values(value);
  if (values.length === 0) return [];

  // A map of arrays, e.g. { Farmer: [...], "Government Officer": [...] }
  if (values.every((item) => Array.isArray(item))) return values.flat();

  // A wrapper, e.g. { data: [...] } / { individuals: [...] }
  const nested =
    value.data || value.individuals || value.organizations || value.rows || value.list;
  if (Array.isArray(nested)) return nested;

  // A single row - show it rather than dropping it on the floor.
  return ROW_KEYS.some((key) => key in value) ? [value] : [];
};

// ✅ Same idea for the year -> hospitals target map: an array, a map, or junk
//    all become a plain object whose values are plain objects, so
//    `Object.entries(hospitalWiseTarget[year])` is always safe.
const toYearMap = (value) => {
  const source = Array.isArray(value)
    ? Object.fromEntries(value.map((entry, index) => [String(entry?.year ?? index), entry]))
    : value && typeof value === "object"
      ? value
      : {};

  const map = {};
  Object.entries(source).forEach(([key, val]) => {
    if (val && typeof val === "object" && !Array.isArray(val)) map[key] = val;
  });
  return map;
};

// ✅ The search touches fields that are missing or numeric on some rows, so
//    stringify before matching - `undefined` / `5` must not throw.
const includesTerm = (value, term) =>
  String(value ?? "").toLowerCase().includes(term);

// ✅ The enviro detail API pages its lists SERVER-side and wraps each one as
//    { totalRecords, totalPages, currentPage, limit, data: [...] }.
//    Anything else (a plain array / junk) carries no paging info -> null, so
//    the pagination bar is simply not rendered for it.
const toPaginationMeta = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const totalPages = Number(value.totalPages);
  const currentPage = Number(value.currentPage);
  const totalRecords = Number(value.totalRecords);
  const limit = Number(value.limit);
  if (!Number.isFinite(totalPages) || totalPages <= 0) return null;

  return {
    totalPages,
    currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    totalRecords: Number.isFinite(totalRecords) && totalRecords >= 0 ? totalRecords : undefined,
    limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
  };
};

const ExecutiveProfileBreakdown = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Where the back button has to return to. It is sent along by the page the
  //    user came from (e.g. the Enviro Employees breakdown).
  const backTo = location.state?.backTo || null;
  const backLabel = backTo?.label || 'Back to Sales Analytics';

  // ✅ Leaving the profile.
  //    With real history we go back ONE step, which returns exactly where the
  //    user came from. Without history (direct link) we use `backTo` instead.
  const handleBack = () => {
    if (location.key && location.key !== 'default') {
      navigate(-1);
      return;
    }
    navigate(backTo?.pathname || '/sales-analyticsAll');
  };

  // ✅ Opens the full "View Individual" page for one individual card.
  //    The route (/database/view-enviro-individual-details/:id) reads the id
  //    from the URL; the router state carries the name / profile type and the
  //    exact page "Back" has to return to (this executive profile).
  //    A stable `_id` is required before navigating anywhere.
  const handleViewIndividualDetails = (person) => {
    const identifier = person?._id || person?.id;
    if (!identifier) return;

    navigate(`/database/view-enviro-individual-details/${identifier}`, {
      state: {
        name: person?.fullName || '',
        typeOfProfile: person?.typeOfProfile || person?.typeOfDoctorProfile || '',
        // "Back" on the view page returns to this exact profile
        backTo: {
          pathname: location.pathname,
          label: 'Back to Executive Profile',
        },
      },
    });
  };

  // ✅ Opens the organization's view page for one organization card.
  //    The route (/database/edit-enviro-organization/:id) renders the enviro
  //    organization form, which understands every enviro organization shape
  //    (FPO, PRIVATE, GOVERNMENT, ...). A stable `_id` is required before
  //    navigating anywhere.
  const handleViewOrganizationDetails = (org) => {
    const identifier = org?._id || org?.id;
    if (!identifier) return;

    navigate(`/database/edit-enviro-organization/${identifier}`);
  };

  // ✅ Opens the full monthly planning details page for one planning row.
  //    The route
  //    (/admin/sales-executive/monthly-planning/view-month-wise/
  //    view-day-wise-planning/view-monthly-planning-details/:id)
  //    reads the planning id from the URL, so a stable `_id` is required
  //    before navigating anywhere.
  const handleViewPlanningDetails = (plan) => {
    const identifier = plan?._id || plan?.id;
    if (!identifier) return;

    navigate(
      `/admin/sales-executive/monthly-planning/view-month-wise/view-day-wise-planning/view-monthly-planning-details/${identifier}`
    );
  };

  const { specificSalesPersonData, fetchSpecificSalesPersonData, loading } = useAllSalesAnalytics();

  // ✅ Enviro Solution uses its own API for this page
  const {
    enviroSpecificSalesPersonData,
    enviroSpecificSalesPersonLoading,
    enviroSpecificSalesPersonError,
    fetchSpecificEnviroSalesPersonData,
    resetEnviroSpecificSalesPersonData,
  } = useAllSalesEnviroAnalytics();
  const { isEnviroSolution } = useCompany();

  const [activeTab, setActiveTab] = useState('individuals');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Individuals + organizations are paged on the SERVER with ONE shared
  //    ?page=&limit= pair (both lists arrive in the same response). The
  //    healthcare API has no paging params, so its tab simply never renders
  //    the pagination bar (see individualsMeta / organizationsMeta below).
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // ✅ true while a background page/limit refresh runs - no full page loader,
  //    the current rows just dim until the new ones arrive.
  const [isPaging, setIsPaging] = useState(false);
  const initialLoadRef = useRef(true);

  // ✅ A different executive starts at page 1 again. This runs DURING RENDER
  //    (the documented React pattern for adjusting state when props change),
  //    so the fetch effect below never fires once with the previous
  //    executive's page number.
  const [prevProfileId, setPrevProfileId] = useState(id);
  if (prevProfileId !== id) {
    setPrevProfileId(id);
    setPage(1);
    setLimit(10);
    initialLoadRef.current = true;
  }

  // ✅ Monthly planning months are collapsed by default, so a long list of
  //    months stays scannable. Each month opens independently (multiple can
  //    be open at once).
  const [expandedMonths, setExpandedMonths] = useState([]);

  const isMonthExpanded = (month) => expandedMonths.includes(month);

  const toggleMonth = (month) => {
    setExpandedMonths((prev) =>
      prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month]
    );
  };

  const expandAllMonths = () => setExpandedMonths(planningMonths);
  const collapseAllMonths = () => setExpandedMonths([]);

  // ✅ Pick the API matching the solution. `isEnviroSolution` is read from
  //    sessionStorage, so it can resolve AFTER the first render - that is why
  //    it is part of the dependency list.
  //    Enviro also pages both lists on the SERVER, so page/limit changes
  //    re-run the request:
  //      - first load (or another executive): clear old rows + full loader
  //      - page / rows-per-change: SILENT refresh, the current rows stay on
  //        screen (dimmed) until the new ones arrive - no flash of spinner.
  useEffect(() => {
    if (!id) return;

    if (isEnviroSolution) {
      const isFirstLoad = initialLoadRef.current;
      initialLoadRef.current = false;

      if (isFirstLoad) {
        resetEnviroSpecificSalesPersonData();
        fetchSpecificEnviroSalesPersonData(id, { page, limit });
        return;
      }

      setIsPaging(true);
      fetchSpecificEnviroSalesPersonData(id, { page, limit }, true).finally(() =>
        setIsPaging(false)
      );
      return;
    }

    fetchSpecificSalesPersonData(id);
  }, [
    id,
    isEnviroSolution,
    page,
    limit,
    fetchSpecificSalesPersonData,
    fetchSpecificEnviroSalesPersonData,
    resetEnviroSpecificSalesPersonData,
  ]);

  const data = isEnviroSolution
    ? enviroSpecificSalesPersonData?.data
    : specificSalesPersonData?.data;

  const isLoading = isEnviroSolution
    ? enviroSpecificSalesPersonLoading
    : loading;

  const salesPerson = data?.salesPerson;
  const salesPersonName =
    data?.salesPersonName || salesPerson?.fullName || '';
  // ✅ Normalized: the detail API has sent these as arrays, maps or wrapper
  //    objects, and `.filter` on a non-array crashed the whole page.
  const individuals = toRows(data?.individuals);
  const organizations = toRows(data?.organizations);

  // ✅ Server paging metadata (enviro sends it per list, healthcare does not).
  //    The same ?page=&limit= cut both lists, so ONE shared page state drives
  //    the pagination bar of whichever tab is open.
  const individualsMeta = toPaginationMeta(data?.individuals);
  const organizationsMeta = toPaginationMeta(data?.organizations);
  const individualsTotal = individualsMeta?.totalRecords ?? individuals.length;
  const organizationsTotal = organizationsMeta?.totalRecords ?? organizations.length;
  const monthlyPlanning = isEnviroSolution
    ? monthlyListToMap(data?.monthlyPlannings)
    : toMonthMap(data?.monthlyPlanning);
  const hospitalWiseTarget = toYearMap(data?.hospitalWiseTarget);

  // ✅ Enviro has no hospital target data, so its tab is only shown when there
  //    is something to display (healthcare keeps showing it as before).
  const showTargetsTab = !isEnviroSolution || Object.keys(hospitalWiseTarget).length > 0;

  // ✅ The middle crumb follows the page the user came from
  const breadcrumbLinks = [
    { text: 'Sales Analytics', href: '/sales-analyticsAll' },
    ...(backTo?.pathname
      ? [{ text: backLabel.replace(/^Back to /, ''), href: backTo.pathname }]
      : []),
    { text: salesPerson?.fullName || salesPersonName || 'Executive Profile' },
  ];

  const filteredIndividuals = individuals.filter((ind) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    // ⚠ Every field is stringified first: `undefined` and numbers must not
    //    throw `.toLowerCase()` the way a raw optional chain can.
    return [
      ind?.fullName,
      ind?.typeOfDoctorProfile,
      ind?.department,
      // ✅ Enviro individual fields
      ind?.segment,
      ind?.uniqueId,
      ind?.organizationName,
      ind?.villageName,
      ind?.city,
      ind?.district,
      ind?.state,
    ].some((field) => includesTerm(field, term));
  });

  const filteredOrganizations = organizations.filter((org) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return [
      org?.hospitalName,
      org?.typeOfHospital,
      // ✅ Enviro organization fields
      org?.organizationName,
      org?.sectionName,
      org?.OrganizationType,
      org?.uniqueId,
      org?.cityTownVillage,
      org?.district,
      org?.state,
    ].some((field) => includesTerm(field, term));
  });

  const planningMonths = Object.keys(monthlyPlanning);
  const targetYears = Object.keys(hospitalWiseTarget);

  // ✅ Pagination bar callbacks. `Pagination` calls onItemsPerPageChange and
  //    then onPageChange(1) itself when the rows-per-page select changes.
  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    setPage(nextPage);
  };

  const handleItemsPerPageChange = (nextLimit) => {
    setLimit(nextLimit);
    // The component already resets to page 1 right after this call; make sure
    // the reset also happens when it does not (defensive).
    setPage((current) => (current === 1 ? current : 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoaderSpinner />
          <p className="mt-4 text-gray-600 font-medium text-lg">Loading executive profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumbs */}
      <BreadCrumb linkText={breadcrumbLinks} />

      {/* ✅ Shown when the enviro API call failed (e.g. the id could not be
          resolved), so the page never looks "empty" by accident */}
      {isEnviroSolution && enviroSpecificSalesPersonError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          <LucideIcons.AlertCircle size={18} />
          {enviroSpecificSalesPersonError}
        </div>
      )}

      {/* Executive Name Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              aria-label={backLabel}
              title={backLabel}
              className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <LucideIcons.ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-indigo-600 grid place-items-center text-white text-xl font-bold">
                {salesPerson?.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">{salesPerson?.fullName || 'N/A'}</h1>
                <p className="text-sm text-gray-500">Sales Executive</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
              <p className="text-2xl font-bold text-indigo-700">{individualsTotal}</p>
              <p className="text-xs text-indigo-600">Individuals</p>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
              <p className="text-2xl font-bold text-green-700">{organizationsTotal}</p>
              <p className="text-xs text-green-600">Organizations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('individuals')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
              activeTab === 'individuals'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LucideIcons.Users size={16} />
            <span>Individuals</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'individuals' ? 'bg-white/20' : 'bg-gray-200'}`}>
              {individualsTotal}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
              activeTab === 'organizations'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LucideIcons.Building size={16} />
            <span>Organizations</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'organizations' ? 'bg-white/20' : 'bg-gray-200'}`}>
              {organizationsTotal}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
              activeTab === 'planning'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LucideIcons.Calendar size={16} />
            <span>Monthly Planning</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'planning' ? 'bg-white/20' : 'bg-gray-200'}`}>
              {planningMonths.length}
            </span>
          </button>
          {/* ✅ Enviro never gets hospital target data, so the tab is only
              shown when there is something to display */}
          {showTargetsTab && (
            <button
              onClick={() => setActiveTab('targets')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
                activeTab === 'targets'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LucideIcons.Target size={16} />
              <span>{isEnviroSolution ? 'Targets' : 'Hospital Targets'}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'targets' ? 'bg-white/20' : 'bg-gray-200'}`}>
                {targetYears.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white"
        />
      </div>

      {/* Individuals Tab */}
      {activeTab === 'individuals' && (
        <>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${isPaging ? 'opacity-60 pointer-events-none' : ''}`}>
          {filteredIndividuals.length > 0 ? (
            filteredIndividuals.map((ind, index) => (
              <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 grid place-items-center text-indigo-700 font-bold text-lg">
                    {ind.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black truncate">{ind.fullName || 'N/A'}</p>
                    <span className="text-xs font-semibold text-indigo-600">{ind.typeOfDoctorProfile || 'N/A'}</span>
                  </div>
                  {/* ✅ Open the full view page for this individual */}
                  {(ind._id || ind.id) && (
                    <button
                      type="button"
                      onClick={() => handleViewIndividualDetails(ind)}
                      title="View individual details"
                      aria-label={`View details of ${ind.fullName || 'individual'}`}
                      className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 p-2 text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white flex-shrink-0"
                    >
                      <LucideIcons.Eye size={16} />
                    </button>
                  )}
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  {/* ✅ Only when the API sent a designation (enviro does not send one) */}
                  {ind.designation && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Briefcase size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">DESIGNATION</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.designation}</p>
                      </div>
                    </div>
                  )}
                  {ind.department && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Building2 size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">DEPARTMENT</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.department}</p>
                      </div>
                    </div>
                  )}
                  {ind.speciality && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Stethoscope size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">SPECIALITY</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.speciality}</p>
                      </div>
                    </div>
                  )}
                  {/* ✅ Enviro individual fields (healthcare does not send these) */}
                  {ind.segment && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Layers size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">SEGMENT</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.segment}</p>
                      </div>
                    </div>
                  )}
                  {ind.uniqueId && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Fingerprint size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">UNIQUE ID</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.uniqueId}</p>
                      </div>
                    </div>
                  )}
                  {ind.organizationName && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Building size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">ORGANIZATION</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.organizationName}</p>
                      </div>
                    </div>
                  )}
                  {(ind.villageName || ind.city || ind.district || ind.state || ind.region) && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.MapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">LOCATION</p>
                        <p className="text-sm text-black font-semibold truncate">
                          {[ind.villageName || ind.city, ind.district, ind.state, ind.region]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Users size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No individuals found</p>
            </div>
          )}
          </div>
          {/* ✅ Server-side paging for the individuals list (enviro only -
              healthcare sends no paging metadata, so nothing renders) */}
          {individualsMeta && individualsMeta.totalRecords > 0 && (
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <Pagination
                currentPage={Math.min(page, individualsMeta.totalPages)}
                totalPages={individualsMeta.totalPages}
                totalItems={individualsMeta.totalRecords}
                itemsPerPage={individualsMeta.limit ?? limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                showRowPerPage
              />
            </div>
          )}
        </>
      )}

      {/* Organizations Tab */}
      {activeTab === 'organizations' && (
        <>
        <div className={`space-y-4 transition-opacity ${isPaging ? 'opacity-60 pointer-events-none' : ''}`}>
          {filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org, index) => (
              <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-green-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-green-100 grid place-items-center text-green-700 font-bold text-xl flex-shrink-0">
                    {org.hospitalName?.charAt(0) || org.organizationName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black text-lg leading-tight">{org.hospitalName || org.organizationName || 'N/A'}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {org.typeOfHospital || org.sectionName || 'N/A'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        org.typeOfOrgOrHospital === 'Govt' || org.OrganizationType === 'GOVERNMENT'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {org.typeOfOrgOrHospital || org.OrganizationType || 'N/A'}
                      </span>
                      {(org.ifGovt || org.uniqueId) && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                          {org.ifGovt || org.uniqueId}
                        </span>
                      )}
                    </div>
                    {/* ✅ Enviro organizations carry a location instead of
                        beds / ICU / OT counts (healthcare has hospitalData) */}
                    {(org.cityTownVillage || org.district || org.state || org.region) && (
                      <div className="flex items-start gap-2 mt-3">
                        <LucideIcons.MapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 font-medium">LOCATION</p>
                          <p className="text-sm text-black font-semibold truncate">
                            {[org.cityTownVillage, org.district, org.state, org.region]
                              .filter(Boolean)
                              .join(' • ')}
                          </p>
                        </div>
                      </div>
                    )}
                    {org.hospitalData && (org.hospitalData.totalBeds > 0 || org.hospitalData.totalICUBeds > 0 || org.hospitalData.totalOT > 0) && (
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        {org.hospitalData.totalBeds > 0 && (
                          <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                            <LucideIcons.Bed size={16} className="text-amber-600" />
                            <div>
                              <p className="text-sm font-bold text-black">{org.hospitalData.totalBeds}</p>
                              <p className="text-xs text-gray-500">Beds</p>
                            </div>
                          </div>
                        )}
                        {org.hospitalData.totalICUBeds > 0 && (
                          <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                            <LucideIcons.HeartPulse size={16} className="text-red-600" />
                            <div>
                              <p className="text-sm font-bold text-black">{org.hospitalData.totalICUBeds}</p>
                              <p className="text-xs text-gray-500">ICU</p>
                            </div>
                          </div>
                        )}
                        {org.hospitalData.totalOT > 0 && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                            <LucideIcons.Activity size={16} className="text-blue-600" />
                            <div>
                              <p className="text-sm font-bold text-black">{org.hospitalData.totalOT}</p>
                              <p className="text-xs text-gray-500">OTs</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {org.hospitalData?.specialities && org.hospitalData.specialities.length > 0 && org.hospitalData.specialities[0].name && (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Specialities & Surgeries</p>
                        {org.hospitalData.specialities.map((spec, specIdx) => (
                          spec.name && (
                            <div key={specIdx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-sm font-bold text-black mb-2">{spec.name}</p>
                              {Array.isArray(spec.surgeries) &&
                                spec.surgeries.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {spec.surgeries.filter(s => s?.surgeryType).map((surgery, surgIdx) => (
                                    <div key={surgIdx} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                                      <LucideIcons.Scissors size={12} className="text-indigo-600" />
                                      <span className="text-xs font-medium text-gray-700">{surgery?.surgeryType}:</span>
                                      <span className="text-xs font-bold text-indigo-600">{surgery?.numberOfSurgeries}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                  {/* ✅ Open the full view page for this organization */}
                  {(org._id || org.id) && (
                    <button
                      type="button"
                      onClick={() => handleViewOrganizationDetails(org)}
                      title="View organization details"
                      aria-label={`View details of ${org.hospitalName || org.organizationName || 'organization'}`}
                      className="inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 p-2 text-green-700 transition-colors hover:bg-green-600 hover:text-white flex-shrink-0"
                    >
                      <LucideIcons.Eye size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Building size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No organizations found</p>
            </div>
          )}
        </div>
        {/* ✅ Server-side paging for the organizations list (enviro only -
            healthcare sends no paging metadata, so nothing renders) */}
        {organizationsMeta && organizationsMeta.totalRecords > 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <Pagination
              currentPage={Math.min(page, organizationsMeta.totalPages)}
              totalPages={organizationsMeta.totalPages}
              totalItems={organizationsMeta.totalRecords}
              itemsPerPage={organizationsMeta.limit ?? limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showRowPerPage
            />
          </div>
        )}
        </>
      )}

      {/* Monthly Planning Tab */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {planningMonths.length > 0 ? (
            <>
              {/* ✅ Expand / collapse every month at once */}
              <div className="flex justify-end">
                {expandedMonths.length === planningMonths.length ? (
                  <button
                    type="button"
                    onClick={collapseAllMonths}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <LucideIcons.EyeOff size={16} />
                    Collapse all
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={expandAllMonths}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <LucideIcons.Eye size={16} />
                    Expand all
                  </button>
                )}
              </div>
              {planningMonths.map((month) => {
                const isExpanded = isMonthExpanded(month);
                return (
                  <div key={month} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                    {/* ✅ Clicking the header toggles this month's rows */}
                    <button
                      type="button"
                      onClick={() => toggleMonth(month)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between gap-3 px-5 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors text-left border-b border-indigo-100"
                    >
                      <span className="font-bold text-indigo-700 flex items-center gap-2">
                        <LucideIcons.Calendar size={18} />
                        {month}
                        <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded-full">
                          {monthlyPlanning[month].length} plans
                        </span>
                      </span>
                      <LucideIcons.ChevronDown
                        size={18}
                        className={`text-indigo-600 transition-transform duration-200 flex-shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="divide-y divide-gray-100">
                        {monthlyPlanning[month].map((plan, index) => (
  <div
    key={plan._id || plan.id || index}
    className="group border-b border-gray-100 last:border-b-0 px-4 py-3.5 transition-colors hover:bg-indigo-50/40"
  >
    <div className="flex items-center gap-4">

      {/* Date & Time */}
      <div className="w-[150px] flex-shrink-0">
        <div className="flex items-center gap-2">
          <LucideIcons.CalendarDays
            size={15}
            className="text-indigo-500 flex-shrink-0"
          />

          <div>
            <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              {new Date(plan.createPlanningForDate).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              {new Date(plan.createPlanningForDate).toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <LucideIcons.User
            size={14}
            className="text-gray-400 flex-shrink-0"
          />

          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium text-gray-800"
              title={plan.nameOfDoctor || "N/A"}
            >
              {plan.nameOfDoctor || "N/A"}
            </p>

            <p className="text-[11px] text-gray-400">
              Doctor
            </p>
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <LucideIcons.Building2
            size={14}
            className="text-gray-400 flex-shrink-0"
          />

          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium text-gray-800"
              title={plan.selectOrganization || "N/A"}
            >
              {plan.selectOrganization || "N/A"}
            </p>

            <p className="text-[11px] text-gray-400">
              Organization
            </p>
          </div>
        </div>
      </div>

      {/* Product */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <LucideIcons.Package
            size={14}
            className="text-gray-400 flex-shrink-0"
          />

          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium text-gray-800"
              title={
                Array.isArray(plan.productToBePromoted)
                  ? plan.productToBePromoted.join(", ")
                  : plan.productToBePromoted || "N/A"
              }
            >
              {Array.isArray(plan.productToBePromoted)
                ? plan.productToBePromoted.join(", ")
                : plan.productToBePromoted || "N/A"}
            </p>

            <p className="text-[11px] text-gray-400">
              Product
            </p>
          </div>
        </div>
      </div>

      {/* Want To Buy */}
      <div className="w-[105px] flex-shrink-0">
        {plan.wantToBuy ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              plan.wantToBuy.status === "yes"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                plan.wantToBuy.status === "yes"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />

            {plan.wantToBuy.status === "yes"
              ? "Want to Buy"
              : "Not Interested"}
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            —
          </span>
        )}
      </div>

      {/* View */}
      <div className="w-[42px] flex-shrink-0 flex justify-end">
        {(plan._id || plan.id) && (
          <button
            type="button"
            onClick={() => handleViewPlanningDetails(plan)}
            title="View planning details"
            aria-label={`View planning details of ${
              plan.nameOfDoctor || "plan"
            }`}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
          >
            <LucideIcons.Eye size={15} />
          </button>
        )}
      </div>

    </div>
  </div>
))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Calendar size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No monthly planning data</p>
            </div>
          )}
        </div>
      )}

      {/* Hospital Wise Target Tab */}
      {activeTab === 'targets' && (
        <div className="space-y-6">
          {targetYears.length > 0 ? (
            targetYears.map((year) => (
              <div key={year} className="space-y-4">
                <h3 className="font-bold text-black text-lg flex items-center gap-2">
                  <LucideIcons.Target size={20} className="text-indigo-600" />
                  Year {year}
                </h3>
                {Object.entries(hospitalWiseTarget[year] || {}).map(([hospitalName, hospitalData]) => (
                  <div key={hospitalName} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                    <div className="bg-green-50 px-5 py-3 border-b border-green-100">
                      <div className="flex items-center gap-2">
                        <LucideIcons.Building size={18} className="text-green-600" />
                        <h4 className="font-bold text-black">{hospitalData.organization || hospitalName}</h4>
                        {hospitalData.city && (
                          <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full text-green-700">
                            {hospitalData.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {hospitalData.products && hospitalData.products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {hospitalData.products.map((product, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="font-semibold text-black text-sm">{product.name || 'N/A'}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">Qty: <span className="font-bold text-black">{product.enteredQuantity}</span></span>
                                <span className="text-xs font-bold text-green-600">₹{product.price?.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No products data</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Target size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No hospital targets data</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutiveProfileBreakdown;
