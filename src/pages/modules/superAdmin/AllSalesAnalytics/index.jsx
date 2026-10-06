import React, { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { FilterBar } from './components/analytics/FilterBar';
import { DashboardSection } from './components/sections/DashboardSection';
import { DoctorSection } from './components/sections/DoctorSection';
import { EnviroIndividualsSection } from './components/sections/EnviroIndividualsSection';
import { EnviroOrganizationsSection } from './components/sections/EnviroOrganizationsSection';
import { ExecutiveSection } from './components/sections/ExecutiveSection';
import { HospitalSection } from './components/sections/HospitalSection';
import { OrganizationSection } from './components/sections/OrganizationSection';
import { TargetSheetSection } from './components/sections/TargetSheetSection';
// import { OrganizationProductSection } from './components/sections/OrganizationProductSection';
import useAllSalesAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics";
import useAllSalesEnviroAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesEnviroAnalytics";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useCompany from "../../../../hooks/common/useCompany";
import LoaderSpinner from "../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { 
  HOSPITALS, 
  DOCTORS, 
  ORGS, 
  EXECUTIVES,
} from './data/analyticsData';

const AllSalesAnalytics = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isEnviroSolution } = useCompany();
  const {
    selectedTab,
    changeTab,
    filters,
    updateFilter,
    fetchOverviewData,
    fetchSalesPerformance,
    fetchOrganizationAnalytics,
    fetchSpecialityAnalytics,
    specialityData,
    fetchTargetAnalytics,
    targetData,
    fetchDoctorAnalytics,
    doctorData,
    organizationData,
    overviewData,
    doctorListData,
    fetchDoctorList, salesPersonData,
  fetchSalesPersonAnalytics,  organizationDashboardData,
  fetchOrganizationDashboardAnalytics,   organizationProductData,
  fetchOrganizationProductAnalytics,  organizationListData,
  fetchOrganizationListAnalytics,  salesPersonTargetData,
  fetchSalesPersonTargetAnalytics,
    resetFilters,
    kpis,
    executiveData,
    loading,
    error,allIndividualData,fetchAllIndividualData,  specificIndividualData,
  fetchSpecificIndividualData, allOrganizationsData,
  fetchAllOrganizationsData, specificOrganizationData,
  fetchSpecificOrganizationData,
  } = useAllSalesAnalytics();

  const {
    fetchEnviroAnalytics,
    enviroData,
    kpis: enviroKpis,
    loading: enviroLoading,
    error: enviroError,
    filters: enviroFilters,
    updateFilter: updateEnviroFilter,
    resetFilters: resetEnviroFilters,
    // ✅ Enviro individuals list (used by the "Individuals" tab)
    enviroIndividualsData,
    enviroIndividualsLoading,
    fetchEnviroIndividualsAnalytics,
    resetEnviroIndividualsFilters,
    // ✅ Enviro organizations list (used by the "Enviro Organizations" tab)
    enviroOrganizationsData,
    enviroOrganizationsLoading,
    fetchEnviroOrganizationsAnalytics,
    resetEnviroOrganizationsFilters,
    // ✅ Enviro organizations graphical analytics (Organization & Turnover Analytics on Overview)
    enviroOrganizationsGrphicalData,
    enviroOrganizationsGrphicalLoading,
    enviroOrganizationsGrphicalError,
    fetchEnviroOrganizationsGrphicalAnalytics,
    // ✅ Individual graphical analytics (Agricultural Analytics & Farmer Profiles on Overview)
    individualGrphicalData,
    individualGrphicalLoading,
    individualGrphicalError,
    fetchIndividualGrphicalAnalytics,
    // ✅ Enviro employees (used by the Executive tab in enviro mode)
    enviroEmployeesData,
    enviroEmployeesLoading,
    fetchEnviroEmployeesAnalytics,
  } = useAllSalesEnviroAnalytics();

  // State for hospital pagination
  const [hospitalPage, setHospitalPage] = useState(1);
  const [hospitalLimit, setHospitalLimit] = useState(10);
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [doctorTableLoading, setDoctorTableLoading] = useState(false);
  const [orgListTableLoading, setOrgListTableLoading] = useState(false);
  const [productTableLoading, setProductTableLoading] = useState(false);
  const [targetTableLoading, setTargetTableLoading] = useState(false);

  // ✅ Doctor pagination state
  const [doctorPage, setDoctorPage] = useState(1);
  const [doctorLimit, setDoctorLimit] = useState(10);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorSalesPerson, setDoctorSalesPerson] = useState("");

  // ✅ Enviro individuals pagination state (Individuals tab, enviro only)
  const [individualsPage, setIndividualsPage] = useState(1);
  const [individualsLimit, setIndividualsLimit] = useState(10);
  const [individualsTableLoading, setIndividualsTableLoading] = useState(false);
  const [individualsSearch, setIndividualsSearch] = useState("");
  const [individualsSalesPerson, setIndividualsSalesPerson] = useState("");

  // ✅ Enviro organizations pagination state (Enviro Organizations tab, enviro only)
  const [enviroOrgsPage, setEnviroOrgsPage] = useState(1);
  const [enviroOrgsLimit, setEnviroOrgsLimit] = useState(10);
  const [enviroOrgsTableLoading, setEnviroOrgsTableLoading] = useState(false);
  const [enviroOrgsSearch, setEnviroOrgsSearch] = useState("");
  const [enviroOrgsSalesPerson, setEnviroOrgsSalesPerson] = useState("");

  const [productPage, setProductPage] = useState(1);
const [productPageSize, setProductPageSize] = useState(10);

const [orgListPage, setOrgListPage] = useState(1);
const [orgListPageSize, setOrgListPageSize] = useState(10);

const [targetPage, setTargetPage] = useState(1);
const [targetPageSize, setTargetPageSize] = useState(10);

  const [enviroEmployeesTableLoading, setEnviroEmployeesTableLoading] = useState(false);

  // ✅ Function to fetch doctor data with current pagination
  const loadDoctorData = useCallback(async (silent = false) => {
    try {
      await fetchDoctorAnalytics({}, silent);
      await fetchDoctorList({
        page: doctorPage,
        limit: doctorLimit,
        doctorName: doctorSearch,
        salesPersonName: doctorSalesPerson,
      }, silent);
    } catch (error) {
      console.error('Error loading doctor data:', error);
    }
  }, [fetchDoctorAnalytics, fetchDoctorList, doctorPage, doctorLimit, doctorSearch, doctorSalesPerson]);

  // ✅ Maps the FilterBar filters + the table search / sales person filter to
  //    the query params the enviro individuals API understands
  //    (?state=..&region=..&cityTownVillage=..&district=..&segment=..
  //     &individualName=..&salesPersonName=..&page=..&limit=..)
  //
  //    `overrides` lets a handler pass the value it is about to set in state
  //    (search term / sales person). Without it the request would be built from
  //    the previous render's state, because setState has not been committed yet
  //    when the fetch is fired inside the same event.
  const buildEnviroIndividualsParams = useCallback((page, limit, overrides = {}) => ({
    region: filters?.region || '',
    state: filters?.state || '',
    district: filters?.district || '',
    cityTownVillage: filters?.city || '',
    segment: filters?.segment || '',
    typeOfProfile: '',
    individualName: overrides.individualName ?? individualsSearch ?? '',
    salesPersonName: overrides.salesPersonName ?? individualsSalesPerson ?? '',
    page,
    limit,
  }), [filters?.region, filters?.state, filters?.district, filters?.city, filters?.segment, individualsSearch, individualsSalesPerson]);

  // ✅ Fetch the enviro individuals list for the Individuals tab
  const loadEnviroIndividuals = useCallback(async (silent = false) => {
    if (!isEnviroSolution) return;
    try {
      await fetchEnviroIndividualsAnalytics(
        buildEnviroIndividualsParams(individualsPage, individualsLimit),
        silent
      );
    } catch (error) {
      console.error('Error loading enviro individuals data:', error);
    }
  }, [isEnviroSolution, fetchEnviroIndividualsAnalytics, buildEnviroIndividualsParams, individualsPage, individualsLimit]);

  // ✅ Same as above, but for the enviro organizations list
  //    (?state=..&region=..&cityTownVillage=..&district=..&sectionName=..
  //     &organizationName=..&salesPersonName=..&page=..&limit=..)
  const buildEnviroOrganizationsParams = useCallback((page, limit, overrides = {}) => ({
    region: filters?.region || '',
    state: filters?.state || '',
    district: filters?.district || '',
    cityTownVillage: filters?.city || '',
    organizationName: overrides.organizationName ?? enviroOrgsSearch ?? '',
    salesPersonName: overrides.salesPersonName ?? enviroOrgsSalesPerson ?? '',
    page,
    limit,
  }), [filters?.region, filters?.state, filters?.district, filters?.city, enviroOrgsSearch, enviroOrgsSalesPerson]);

  // ✅ Fetch the enviro organizations list for the "Enviro Organizations" tab
  const loadEnviroOrganizations = useCallback(async (silent = false) => {
    if (!isEnviroSolution) return;
    try {
      await fetchEnviroOrganizationsAnalytics(
        buildEnviroOrganizationsParams(enviroOrgsPage, enviroOrgsLimit),
        silent
      );
    } catch (error) {
      console.error('Error loading enviro organizations data:', error);
    }
  }, [isEnviroSolution, fetchEnviroOrganizationsAnalytics, buildEnviroOrganizationsParams, enviroOrgsPage, enviroOrgsLimit]);

  // ✅ Fetch the enviro employees list for the Executive tab (enviro mode)
  const loadEnviroEmployees = useCallback(async (silent = false) => {
    if (!isEnviroSolution) return;
    try {
      setEnviroEmployeesTableLoading(true);
      await fetchEnviroEmployeesAnalytics({}, silent);
    } catch (error) {
      console.error('Error loading enviro employees data:', error);
    } finally {
      setEnviroEmployeesTableLoading(false);
    }
  }, [isEnviroSolution, fetchEnviroEmployeesAnalytics]);

   // ✅ Reset filters and pagination when tab changes
   useEffect(() => {
      resetFilters();
      setHospitalPage(1);
      setHospitalLimit(10);
      setHospitalSearch("");
      setDoctorPage(1);
      setDoctorLimit(10);
      setDoctorSearch("");
      setDoctorSalesPerson("");
      setIndividualsPage(1);
      setIndividualsLimit(10);
      setIndividualsSearch("");
      setIndividualsSalesPerson("");
      resetEnviroIndividualsFilters();
      resetEnviroOrganizationsFilters();
      setEnviroOrgsPage(1);
      setEnviroOrgsLimit(10);
      setEnviroOrgsSearch("");
      setEnviroOrgsSalesPerson("");
      setProductPage(1);
      setProductPageSize(10);
      setOrgListPage(1);
      setOrgListPageSize(10);
      setTargetPage(1);
      setTargetPageSize(10);
    }, [selectedTab, resetFilters, resetEnviroIndividualsFilters, resetEnviroOrganizationsFilters]);

// ✅ Fetch data based on active tab only
   useEffect(() => {
      const fetchTabData = async () => {
        try {
          switch (selectedTab) {
            case 'overview':
              await fetchOverviewData();
              await fetchSalesPerformance();
              await fetchOrganizationAnalytics({
                page: hospitalPage,
                limit: hospitalLimit,
              });
              await fetchSpecialityAnalytics();
              break;
           case 'doctors':
             // Doctor analytics are not used for Enviro Solution
             if (isEnviroSolution) {
               await loadEnviroIndividuals(false);
             } else {
               await loadDoctorData(false);
             }
             break;
           case 'individuals':
             await loadEnviroIndividuals(false);
             break;
           case 'enviroOrganizations':
             await loadEnviroOrganizations(false);
             break;
            case 'executives':
              if (isEnviroSolution) {
                await loadEnviroEmployees(false);
              } else {
                await fetchSalesPerformance();
                await fetchSalesPersonAnalytics();
                await fetchSalesPersonTargetAnalytics({
                  page: targetPage,
                  limit: targetPageSize,
                });
              }
              break;
           case 'hospitals':
             await fetchOrganizationAnalytics({
               page: hospitalPage,
               limit: hospitalLimit,
             });
             break;
           case 'organizations':
             await fetchOrganizationAnalytics({
               page: hospitalPage,
               limit: hospitalLimit,
             });
                await fetchOrganizationDashboardAnalytics();
                 await fetchOrganizationProductAnalytics({
     page: productPage,
     pageSize: productPageSize,
   });
     await fetchOrganizationListAnalytics({
     page: orgListPage,
     pageSize: orgListPageSize,
   });
             break;
           case 'targets':
             // Target Sheet is its own tab - fetched only when that tab opens
             await fetchTargetAnalytics();
             break;
           default:
             break;
         }
       } catch (error) {
         console.error('Error loading data:', error);
       }
     };
     fetchTabData();
   }, [selectedTab]); // ✅ Only trigger on tab change

   // ✅ The tab-change effect above is intentionally tab-only, but
   //    isEnviroSolution is read from sessionStorage, so the enviro tabs can
   //    become reachable after mount. These effects load the list as soon as
   //    the enviro flag resolves.
   // ✅ Load the individuals / enviro organizations list as soon as the tab is
   //    opened (and when the enviro flag resolves after the first render).
   //    A ref is used on purpose: the loaders change on every search keystroke,
   //    and re-running here would fire a second request for the same search.
    const loadEnviroIndividualsRef = useRef(loadEnviroIndividuals);
    const loadEnviroOrganizationsRef = useRef(loadEnviroOrganizations);
    const loadEnviroEmployeesRef = useRef(loadEnviroEmployees);

    useEffect(() => {
      loadEnviroIndividualsRef.current = loadEnviroIndividuals;
    }, [loadEnviroIndividuals]);

    useEffect(() => {
      loadEnviroOrganizationsRef.current = loadEnviroOrganizations;
    }, [loadEnviroOrganizations]);

    useEffect(() => {
      loadEnviroEmployeesRef.current = loadEnviroEmployees;
    }, [loadEnviroEmployees]);

    useEffect(() => {
      if (isEnviroSolution && selectedTab === 'individuals') {
        loadEnviroIndividualsRef.current(false);
      }
    }, [isEnviroSolution, selectedTab]);

    useEffect(() => {
      if (isEnviroSolution && selectedTab === 'enviroOrganizations') {
        loadEnviroOrganizationsRef.current(false);
      }
    }, [isEnviroSolution, selectedTab]);

    useEffect(() => {
      if (isEnviroSolution && selectedTab === 'executives') {
        loadEnviroEmployeesRef.current(false);
      }
    }, [isEnviroSolution, selectedTab]);

   // ✅ Fetch enviro analytics when isEnviroSolution becomes true (e.g., after sessionStorage read)
   //    (includes the individual graphical analytics: Enviro Solution companies only)
   useEffect(() => {
     if (isEnviroSolution && selectedTab === 'overview') {
       fetchEnviroAnalytics();
       fetchEnviroOrganizationsGrphicalAnalytics();
       fetchIndividualGrphicalAnalytics();
     }
   }, [isEnviroSolution, selectedTab, fetchEnviroAnalytics, fetchEnviroOrganizationsGrphicalAnalytics, fetchIndividualGrphicalAnalytics]);

   // ✅ For Enviro Solution the "Doctors" tab does not exist - move to "Individuals"
   //    (isEnviroSolution is read from sessionStorage, so it can arrive after mount)
   useEffect(() => {
     if (isEnviroSolution && selectedTab === 'doctors') {
       changeTab('individuals');
     }
   }, [isEnviroSolution, selectedTab, changeTab]);

   // ✅ For Enviro Solution the healthcare "Organizations" tab is hidden - move
   //    to the enviro organizations tab if it was the active one.
   useEffect(() => {
     if (isEnviroSolution && selectedTab === 'organizations') {
       changeTab('enviroOrganizations');
     }
   }, [isEnviroSolution, selectedTab, changeTab]);

  // ✅ Doctor pagination handlers
  const handleDoctorPageChange = async (page) => {
    setDoctorPage(page);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: page,
        limit: doctorLimit,
        doctorName: doctorSearch,
        salesPersonName: doctorSalesPerson,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  const handleDoctorLimitChange = async (limit) => {
    setDoctorLimit(limit);
    setDoctorPage(1);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: 1,
        limit: limit,
        doctorName: doctorSearch,
        salesPersonName: doctorSalesPerson,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  // ✅ Doctor search handler
  const handleDoctorSearch = async (searchTerm) => {
    setDoctorSearch(searchTerm);
    setDoctorPage(1);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: 1,
        limit: doctorLimit,
        doctorName: searchTerm,
        salesPersonName: doctorSalesPerson,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  // ✅ Doctor sales person filter handler
  const handleDoctorSalesPersonFilter = async (salesPersonName) => {
    setDoctorSalesPerson(salesPersonName);
    setDoctorPage(1);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: 1,
        limit: doctorLimit,
        doctorName: doctorSearch,
        salesPersonName: salesPersonName,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  // ✅ Enviro individuals pagination handlers
  const handleIndividualsPageChange = async (page) => {
    setIndividualsPage(page);
    setIndividualsTableLoading(true);
    try {
      await fetchEnviroIndividualsAnalytics(
        buildEnviroIndividualsParams(page, individualsLimit),
        true
      );
    } finally {
      setIndividualsTableLoading(false);
    }
  };

  const handleIndividualsLimitChange = async (limit) => {
    setIndividualsLimit(limit);
    setIndividualsPage(1);
    setIndividualsTableLoading(true);
    try {
      await fetchEnviroIndividualsAnalytics(
        buildEnviroIndividualsParams(1, limit),
        true
      );
    } finally {
      setIndividualsTableLoading(false);
    }
  };

  // ✅ Enviro individuals search handler (debounced by the section)
  //    The new term is passed as an override so the request is fired with the
  //    value the user just typed, not with the previous render's state.
  const handleIndividualsSearch = async (searchTerm) => {
    setIndividualsSearch(searchTerm);
    setIndividualsPage(1);
    setIndividualsTableLoading(true);
    try {
      await fetchEnviroIndividualsAnalytics(
        buildEnviroIndividualsParams(1, individualsLimit, { individualName: searchTerm }),
        true
      );
    } finally {
      setIndividualsTableLoading(false);
    }
  };

  // ✅ Enviro individuals sales person filter handler
  //    Same as above: the selected sales person is passed as an override.
  const handleIndividualsSalesPersonFilter = async (salesPersonName) => {
    setIndividualsSalesPerson(salesPersonName);
    setIndividualsPage(1);
    setIndividualsTableLoading(true);
    try {
      await fetchEnviroIndividualsAnalytics(
        buildEnviroIndividualsParams(1, individualsLimit, { salesPersonName }),
        true
      );
    } finally {
      setIndividualsTableLoading(false);
    }
  };

  // ✅ Enviro organizations pagination handlers
  const handleEnviroOrgsPageChange = async (page) => {
    setEnviroOrgsPage(page);
    setEnviroOrgsTableLoading(true);
    try {
      await fetchEnviroOrganizationsAnalytics(
        buildEnviroOrganizationsParams(page, enviroOrgsLimit),
        true
      );
    } finally {
      setEnviroOrgsTableLoading(false);
    }
  };

  const handleEnviroOrgsLimitChange = async (limit) => {
    setEnviroOrgsLimit(limit);
    setEnviroOrgsPage(1);
    setEnviroOrgsTableLoading(true);
    try {
      await fetchEnviroOrganizationsAnalytics(
        buildEnviroOrganizationsParams(1, limit),
        true
      );
    } finally {
      setEnviroOrgsTableLoading(false);
    }
  };

  // ✅ Search handler (debounced by the section). The new term is passed as an
  //    override so the request is fired with the value the user just typed.
  const handleEnviroOrgsSearch = async (searchTerm) => {
    setEnviroOrgsSearch(searchTerm);
    setEnviroOrgsPage(1);
    setEnviroOrgsTableLoading(true);
    try {
      await fetchEnviroOrganizationsAnalytics(
        buildEnviroOrganizationsParams(1, enviroOrgsLimit, { organizationName: searchTerm }),
        true
      );
    } finally {
      setEnviroOrgsTableLoading(false);
    }
  };

  // ✅ Sales person filter handler (same override trick as above)
  const handleEnviroOrgsSalesPersonFilter = async (salesPersonName) => {
    setEnviroOrgsSalesPerson(salesPersonName);
    setEnviroOrgsPage(1);
    setEnviroOrgsTableLoading(true);
    try {
      await fetchEnviroOrganizationsAnalytics(
        buildEnviroOrganizationsParams(1, enviroOrgsLimit, { salesPersonName }),
        true
      );
    } finally {
      setEnviroOrgsTableLoading(false);
    }
  };

  // ✅ Open the details page of one enviro individual
  //    The row is passed along as navigation state so the details page can show
  //    the name / profile in its header straight away, without waiting for the
  //    API response.
  const handleViewEnviroIndividual = (person) => {
    if (!person?._id) return;
    navigate(`/sales-analyticsAll/enviro-individual-details/${person._id}`, {
      state: {
        name: person.fullname || "",
        typeOfProfile: person.typeOfProfile || "",
        // "Back" on the details page returns to the Individuals tab
        backTo: {
          pathname: "/sales-analyticsAll",
          label: "Back to Individuals",
        },
      },
    });
  };

  // ✅ Open the details page of one enviro organization
  //    The row is passed along as navigation state so the details page can show
  //    the name / unique id in its header straight away, without waiting for
  //    the API response.
  const handleViewEnviroOrganization = (org) => {
    if (!org?._id) return;
    navigate(`/sales-analyticsAll/enviro-organization-details/${org._id}`, {
      state: {
        organizationName: org.organizationName || "",
        uniqueId: org.uniqueId || "",
      },
    });
  };

  // ✅ Handle hospital pagination changes
  const handleHospitalPageChange = async (page) => {
    setHospitalPage(page);
    setTableLoading(true);
    try {
      await fetchOrganizationAnalytics({
        page: page,
        limit: hospitalLimit,
      }, true);
    } finally {
      setTableLoading(false);
    }
  };

  const handleHospitalLimitChange = async (limit) => {
    setHospitalLimit(limit);
    setHospitalPage(1);
    setTableLoading(true);
    try {
      await fetchOrganizationAnalytics({
        page: 1,
        limit: limit,
      }, true);
    } finally {
      setTableLoading(false);
    }
  };

  const handleHospitalSearch = async (searchTerm) => {
    setHospitalSearch(searchTerm);
    setHospitalPage(1);
    setTableLoading(true);
    try {
      await fetchOrganizationAnalytics({
        page: 1,
        limit: hospitalLimit,
        search: searchTerm,
      }, true);
    } finally {
      setTableLoading(false);
    }
  };

const handleProductPageChange = async (page) => {
  setProductPage(page);
  setProductTableLoading(true);
  try {
    await fetchOrganizationProductAnalytics({
      page: page,
      pageSize: productPageSize,
    });
  } finally {
    setProductTableLoading(false);
  }
};

const handleProductPageSizeChange = async (pageSize) => {
  setProductPageSize(pageSize);
  setProductPage(1);
  setProductTableLoading(true);
  try {
    await fetchOrganizationProductAnalytics({
      page: 1,
      pageSize: pageSize,
    });
  } finally {
    setProductTableLoading(false);
  }
};

const handleOrgListPageChange = async (page) => {
  setOrgListPage(page);
  setOrgListTableLoading(true);
  try {
    await fetchOrganizationListAnalytics({
      page: page,
      pageSize: orgListPageSize,
    }, true);
  } finally {
    setOrgListTableLoading(false);
  }
};

const handleOrgListPageSizeChange = async (pageSize) => {
  setOrgListPageSize(pageSize);
  setOrgListPage(1);
  setOrgListTableLoading(true);
  try {
    await fetchOrganizationListAnalytics({
      page: 1,
      pageSize: pageSize,
    }, true);
  } finally {
    setOrgListTableLoading(false);
  }
};

// ✅ Navigate to organization details in HospitalTypeBreakdown
const handleViewOrganizationDetails = (orgId, type) => {
  const hospitalType = type === "Govt" ? "Govt" : "Pvt";
  navigate(`/sales-analyticsAll/hospital-type-breakdown/${hospitalType}/${orgId}`);
};


const handleTargetPageChange = async (page) => {
  setTargetPage(page);
  setTargetTableLoading(true);
  try {
    await fetchSalesPersonTargetAnalytics({
      page: page,
      limit: targetPageSize,
    });
  } finally {
    setTargetTableLoading(false);
  }
};

const handleTargetPageSizeChange = async (pageSize) => {
  setTargetPageSize(pageSize);
  setTargetPage(1);
  setTargetTableLoading(true);
  try {
    await fetchSalesPersonTargetAnalytics({
      page: 1,
      limit: pageSize,
    });
  } finally {
    setTargetTableLoading(false);
  }
};

  const safeFilters = filters || {
    month: "",
    year: "",
    state: "",
    district: "",
    city: "",
    segment: "",
    speciality: "",
    typeOfDoctorProfile: "",
    salesPerson: "",
  };

  const handleFiltersChange = async (tab) => {
    try {
      switch (tab) {
        case 'overview':
          await fetchOverviewData();
          await fetchSalesPerformance();
          await fetchOrganizationAnalytics({
            page: hospitalPage,
            limit: hospitalLimit,
          });
          await fetchSpecialityAnalytics();
          break;
        case 'doctors':
          if (isEnviroSolution) {
            setIndividualsPage(1);
            await fetchEnviroIndividualsAnalytics(
              buildEnviroIndividualsParams(1, individualsLimit),
              false
            );
          } else {
            await loadDoctorData(false);
          }
          break;
        case 'individuals':
          setIndividualsPage(1);
          await fetchEnviroIndividualsAnalytics(
            buildEnviroIndividualsParams(1, individualsLimit),
            false
          );
          break;
        case 'enviroOrganizations':
          setEnviroOrgsPage(1);
          await fetchEnviroOrganizationsAnalytics(
            buildEnviroOrganizationsParams(1, enviroOrgsLimit),
            false
          );
          break;
        case 'executives':
          if (isEnviroSolution) {
            await loadEnviroEmployees(false);
          } else {
            await fetchSalesPerformance();
            await fetchSalesPersonAnalytics();
            await fetchSalesPersonTargetAnalytics({
              page: targetPage,
              limit: targetPageSize,
            });
          }
          break;
        case 'hospitals':
          await fetchOrganizationAnalytics({
            page: hospitalPage,
            limit: hospitalLimit,
          });
          break;
        case 'organizations':
          await fetchOrganizationAnalytics({
            page: hospitalPage,
            limit: hospitalLimit,
          });
          await fetchOrganizationDashboardAnalytics();
          await fetchOrganizationProductAnalytics({
            page: productPage,
            pageSize: productPageSize,
          });
          await fetchOrganizationListAnalytics({
            page: orgListPage,
            pageSize: orgListPageSize,
          });
          break;
        case 'targets':
          // Keep the Target Sheet tab in sync when filters change
          await fetchTargetAnalytics();
          break;
        default:
          break;
      }
      
      // ✅ Fetch enviro analytics after other data for overview tab
      //    (org graphical + individual graphical: Enviro Solution companies only)
      if (isEnviroSolution && tab === 'overview') {
        await fetchEnviroAnalytics();
        await fetchEnviroOrganizationsGrphicalAnalytics();
        await fetchIndividualGrphicalAnalytics();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredData = useMemo(() => {
    const filteredHospitals = HOSPITALS.filter(h => {
      if (safeFilters.state && h.state !== safeFilters.state) return false;
      if (safeFilters.district && h.district !== safeFilters.district) return false;
      if (safeFilters.city && h.city !== safeFilters.city) return false;
      return true;
    });

    const filteredDoctors = DOCTORS.filter(d => {
      if (safeFilters.state && d.state !== safeFilters.state) return false;
      if (safeFilters.city && d.city !== safeFilters.city) return false;
      if (safeFilters.speciality && d.speciality !== safeFilters.speciality) return false;
      if (safeFilters.segment && d.segment !== safeFilters.segment) return false;
      if (safeFilters.salesPerson && d.salesPerson !== safeFilters.salesPerson) return false;
      if (safeFilters.typeOfDoctorProfile && d.profile !== safeFilters.typeOfDoctorProfile) return false;
      return true;
    });

    const filteredOrgs = ORGS.filter(o => {
      if (safeFilters.state && o.state !== safeFilters.state) return false;
      if (safeFilters.district && o.district !== safeFilters.district) return false;
      if (safeFilters.city && o.city !== safeFilters.city) return false;
      return true;
    });

    return {
      hospitals: filteredHospitals,
      doctors: filteredDoctors,
      orgs: filteredOrgs
    };
  }, [safeFilters]);

  const executives = executiveData && executiveData.length > 0 ? executiveData : [];

  const tabs = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: LucideIcons.LayoutDashboard,
      component: <DashboardSection 
        hospitals={filteredData.hospitals} 
        filters={filters} 
        kpis={kpis} 
        executives={executives} 
        organizationData={organizationData}
        specialityData={specialityData} 
        loading={loading}
        tableLoading={tableLoading}
        onPageChange={handleHospitalPageChange}
        onItemsPerPageChange={handleHospitalLimitChange}
        onSearch={handleHospitalSearch}
        overviewData={overviewData}
        allIndividualData={allIndividualData}
        fetchAllIndividualData={fetchAllIndividualData}
        specificIndividualData={specificIndividualData}
        fetchSpecificIndividualData={fetchSpecificIndividualData}
        allOrganizationsData={allOrganizationsData}
        fetchAllOrganizationsData={fetchAllOrganizationsData}
        specificOrganizationData={specificOrganizationData}
        fetchSpecificOrganizationData={fetchSpecificOrganizationData}
        isEnviroSolution={isEnviroSolution}
        enviroData={enviroData}
        enviroKpis={enviroKpis}
        enviroLoading={enviroLoading}
        enviroError={enviroError}
        enviroGraphicalData={enviroOrganizationsGrphicalData}
        enviroGraphicalLoading={enviroOrganizationsGrphicalLoading}
        enviroGraphicalError={enviroOrganizationsGrphicalError}
        individualGrphicalData={individualGrphicalData}
        individualGrphicalLoading={individualGrphicalLoading}
        individualGrphicalError={individualGrphicalError}
      />
    },
    // ✅ Enviro Solution: doctors are not used, individuals replace them
    ...(isEnviroSolution
      ? [
          {
            id: "individuals",
            label: "Individuals",
            icon: LucideIcons.Users,
            component: (
              <EnviroIndividualsSection
                individualsData={enviroIndividualsData}
                loading={enviroIndividualsLoading || individualsTableLoading}
                filters={filters}
                currentPage={individualsPage}
                itemsPerPage={individualsLimit}
                onPageChange={handleIndividualsPageChange}
                onItemsPerPageChange={handleIndividualsLimitChange}
                onSearch={handleIndividualsSearch}
                onSalesPersonFilter={handleIndividualsSalesPersonFilter}
                onViewIndividual={handleViewEnviroIndividual}
              />
            ),
          },
        ]
      : [
          {
            id: "doctors",
            label: "Doctors",
            icon: LucideIcons.Stethoscope,
            component: (
              <DoctorSection
                doctors={filteredData.doctors}
                filters={filters}
                doctorData={doctorData}
                doctorListData={doctorListData}
                loading={loading}
                tableLoading={doctorTableLoading}
                onPageChange={handleDoctorPageChange}
                onItemsPerPageChange={handleDoctorLimitChange}
                onSearch={handleDoctorSearch}
                onSalesPersonFilter={handleDoctorSalesPersonFilter}
              />
            ),
          },
        ]),
    { 
      id: "executives", 
      label: "Sales Executives", 
      icon: LucideIcons.Users,
      component: <ExecutiveSection
  executives={executives}
  salesPersonData={isEnviroSolution ? null : salesPersonData}
  salesPersonTargetData={isEnviroSolution ? null : salesPersonTargetData}
  filters={filters}
  loading={isEnviroSolution ? enviroEmployeesLoading : loading}
  tableLoading={isEnviroSolution ? enviroEmployeesTableLoading : targetTableLoading}
  onTargetPageChange={handleTargetPageChange}
  onTargetItemsPerPageChange={handleTargetPageSizeChange}
  enviroEmployeesData={enviroEmployeesData}
  isEnviroSolution={isEnviroSolution}
/>
    },
    // { 
    //   id: "hospitals", 
    //   label: "Hospitals", 
    //   icon: LucideIcons.Building2,
    //   component: <HospitalSection hospitals={filteredData.hospitals} filters={filters} />
    // },
    // ✅ Enviro Solution: the healthcare "Organizations" tab does not apply,
    //    it is replaced by the enviro organizations list
    ...(isEnviroSolution
      ? [
          {
            id: "enviroOrganizations",
            label: "Enviro Organizations",
            icon: LucideIcons.Building,
            component: (
              <EnviroOrganizationsSection
                organizationsData={enviroOrganizationsData}
                loading={enviroOrganizationsLoading || enviroOrgsTableLoading}
                filters={filters}
                currentPage={enviroOrgsPage}
                itemsPerPage={enviroOrgsLimit}
                onPageChange={handleEnviroOrgsPageChange}
                onItemsPerPageChange={handleEnviroOrgsLimitChange}
                onSearch={handleEnviroOrgsSearch}
                onSalesPersonFilter={handleEnviroOrgsSalesPersonFilter}
                onViewOrganization={handleViewEnviroOrganization}
              />
            ),
          },
        ]
      : [
          {
            id: "organizations",
            label: "Organizations",
            icon: LucideIcons.Building,
            component: <OrganizationSection
  orgs={filteredData.orgs}
  organizationDashboardData={organizationDashboardData}
  organizationProductData={organizationProductData}
  organizationListData={organizationListData}
  filters={filters}
  loading={loading}
  tableLoading={orgListTableLoading}
  productTableLoading={productTableLoading}
  onProductPageChange={handleProductPageChange}
  onProductItemsPerPageChange={handleProductPageSizeChange}
  onOrganizationListPageChange={handleOrgListPageChange}
  onOrganizationListItemsPerPageChange={handleOrgListPageSizeChange}
  onViewOrganization={handleViewOrganizationDetails}
/>
          },
        ]),
    { 
      id: "targets", 
      label: "Target Sheet", 
      icon: LucideIcons.Target,
      component: <TargetSheetSection
        targetData={targetData}
        loading={loading}
      />
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-[var(--theme-border)] max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mb-2">Error Loading Data</h3>
          <p className="text-[var(--theme-text-secondary)] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: theme.primaryColor }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.accentColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.primaryColor}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        '--theme-primary': theme.primaryColor,
        '--theme-secondary': theme.secondaryColor,
        '--theme-bg-sidebar': theme.bgSidebar,
        '--theme-background': theme.backgroundColor,
        '--theme-highlight': theme.highlightColor,
        '--theme-accent': theme.accentColor,
        '--theme-primary-light': theme.secondaryColor,
        '--theme-primary-dark': theme.accentColor,
        '--theme-primary-bg': theme.backgroundColor,
        '--theme-primary-hover': theme.highlightColor,
        '--theme-sidebar-bg': theme.bgSidebar,
        '--theme-text-primary': theme.accentColor,
        '--theme-text-secondary': theme.accentColor,
        '--theme-text-muted': theme.accentColor,
        '--theme-border': theme.highlightColor,
        '--theme-bg-light': theme.backgroundColor,
        '--theme-bg-lighter': theme.backgroundColor,
        '--theme-bg-hover': theme.secondaryColor,
        '--theme-card-bg': '#FFFFFF',
      }}
      className="min-h-screen bg-[var(--theme-bg-lighter)]"
    >
      
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--theme-text-primary)] tracking-tight">
            Employee Analytics
          </h1>
          <p className="text-sm text-[var(--theme-text-secondary)] mt-1 font-medium">
            Comprehensive workforce insights & drill-down reports
          </p>
        </div>

        <div className="mb-4">
          <FilterBar 
            selectedTab={selectedTab}
            loading={loading}
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <div className="flex flex-wrap  justify-between gap-1 border-b border-[var(--theme-border)] mb-3 overflow-x-auto bg-white/60 backdrop-blur-sm rounded-xl px-2 py-1">
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  rounded-lg
                  ${isActive 
                    ? 'bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/20' 
                    : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]'
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
                {isActive && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[var(--theme-border)] shadow-xl shadow-[var(--theme-primary)]/5 p-6 min-h-[500px]">
          {tabs.find(tab => tab.id === selectedTab)?.component}
        </div>
      </div>
   
  );
}

export default AllSalesAnalytics;
