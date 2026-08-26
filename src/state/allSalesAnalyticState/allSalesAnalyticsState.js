// state/allSalesAnalyticsState/allSalesAnalyticsState.js

import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

// Overview Data State
export const overviewDataStateAtom = atom(createPersistedAtom("overviewDataState", null));

// Loading State
export const analyticsLoadingStateAtom = atom(createPersistedAtom("analyticsLoadingState", false));

// Filter State - To store current applied filters
export const analyticsFiltersStateAtom = atom(createPersistedAtom("analyticsFiltersState", {
  region: "",
  state: "",
  district: "",
  city: "",
  segment: "",
  speciality: "",
  typeOfDoctorProfile: "",
  salesPerson: "",
  month: "",
  year: "",
}));

// Error State
export const analyticsErrorStateAtom = atom(createPersistedAtom("analyticsErrorState", null));

// Overview Data for different sections
export const overviewKPIsStateAtom = atom(createPersistedAtom("overviewKPIsState", null));

export const overviewChartsStateAtom = atom(createPersistedAtom("overviewChartsState", null));

export const specialityDataStateAtom = atom(createPersistedAtom("specialityDataState", null));

export const targetDataStateAtom = atom(createPersistedAtom("targetDataState", null));

export const overviewTablesStateAtom = atom(createPersistedAtom("overviewTablesState", null));

// Overview Summary Stats
export const overviewSummaryStateAtom = atom(createPersistedAtom("overviewSummaryState", null));

// Hospital Data
export const hospitalDataStateAtom = atom(createPersistedAtom("hospitalDataState", null));

// Doctor Data
export const doctorDataStateAtom = atom(createPersistedAtom("doctorDataState", null));

// Organization Data
export const organizationDataStateAtom = atom(createPersistedAtom("organizationDataState", null));

// Executive Data
export const executiveDataStateAtom = atom(createPersistedAtom("executiveDataState", null));

// Selected Tab State
export const selectedTabStateAtom = atom(createPersistedAtom("selectedTabState", "overview"));

export const doctorListStateAtom = atom(createPersistedAtom("doctorListState", null));
// state/allSalesAnalyticsState/allSalesAnalyticsState.js

// ✅ Sales Person Data State
export const salesPersonDataStateAtom = atom(createPersistedAtom("salesPersonDataState", null));

export const organizationDashboardDataStateAtom = atom(createPersistedAtom("organizationDashboardDataState", null));

export const organizationProductDataStateAtom = atom(createPersistedAtom("organizationProductDataState", null));

export const organizationListDataStateAtom = atom(createPersistedAtom("organizationListDataState", null));

export const salesPersonTargetDataStateAtom = atom(createPersistedAtom("salesPersonTargetDataState", null));

export const allIndividualDataStateAtom = atom(createPersistedAtom("allIndividualDataState", null));

export const specificIndividualDataStateAtom = atom(createPersistedAtom("specificIndividualDataState", null));

export const allOrganizationsDataStateAtom = atom(createPersistedAtom("allOrganizationsDataState", null));

export const specificOrganizationDataStateAtom = atom(createPersistedAtom("specificOrganizationDataState", null));