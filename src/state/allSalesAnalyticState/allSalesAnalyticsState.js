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

// ✅ Sales Person Specific Data State
export const specificSalesPersonDataStateAtom = atom(createPersistedAtom("specificSalesPersonDataState", null));

// Enviro Analytics State
export const enviroAnalyticsFiltersStateAtom = atom(createPersistedAtom("enviroAnalyticsFiltersState", {
  state: "",
  region: "",
  cityTownVillage: "",
  district: "",
  salesPersonName: "",
  segment: "",
  typeOfProfile: "",
  page: 1,
  limit: 10,
}));

export const enviroAnalyticsErrorStateAtom = atom(createPersistedAtom("enviroAnalyticsErrorState", null));

export const enviroAnalyticsDataStateAtom = atom(createPersistedAtom("enviroAnalyticsDataState", null));

export const enviroAnalyticsKPIsStateAtom = atom(createPersistedAtom("enviroAnalyticsKPIsState", []));

// Enviro Individuals Analytics State
export const enviroIndividualsFiltersStateAtom = atom(createPersistedAtom("enviroIndividualsFiltersState", {
  state: "",
  region: "",
  cityTownVillage: "",
  district: "",
  salesPersonName: "",
  segment: "",
  typeOfProfile: "",
  page: 1,
  limit: 10,
}));

export const enviroIndividualsErrorStateAtom = atom(createPersistedAtom("enviroIndividualsErrorState", null));

export const enviroIndividualsDataStateAtom = atom(createPersistedAtom("enviroIndividualsDataState", null));

export const enviroIndividualsKPIsStateAtom = atom(createPersistedAtom("enviroIndividualsKPIsState", []));

export const enviroIndividualsLoadingStateAtom = atom(createPersistedAtom("enviroIndividualsLoadingState", false));

// Enviro Organizations Analytics State
export const enviroOrganizationsFiltersStateAtom = atom(createPersistedAtom("enviroOrganizationsFiltersState", {
  state: "",
  region: "",
  cityTownVillage: "",
  district: "",
  salesPersonName: "",
  segment: "",
  typeOfProfile: "",
  page: 1,
  limit: 10,
}));

export const enviroOrganizationsErrorStateAtom = atom(createPersistedAtom("enviroOrganizationsErrorState", null));

export const enviroOrganizationsDataStateAtom = atom(createPersistedAtom("enviroOrganizationsDataState", null));

export const enviroOrganizationsLoadingStateAtom = atom(createPersistedAtom("enviroOrganizationsLoadingState", false));

// Enviro Employees Analytics State
export const enviroEmployeesFiltersStateAtom = atom(createPersistedAtom("enviroEmployeesFiltersState", {
  state: "",
  region: "",
  cityTownVillage: "",
  district: "",
  salesPersonName: "",
  segment: "",
  typeOfProfile: "",
  page: 1,
  limit: 10,
}));

export const enviroEmployeesErrorStateAtom = atom(createPersistedAtom("enviroEmployeesErrorState", null));

export const enviroEmployeesDataStateAtom = atom(createPersistedAtom("enviroEmployeesDataState", null));

export const enviroEmployeesLoadingStateAtom = atom(createPersistedAtom("enviroEmployeesLoadingState", false));

// Enviro Specific Organization Data State
export const enviroSpecificOrganizationFiltersStateAtom = atom(createPersistedAtom("enviroSpecificOrganizationFiltersState", {
  year: "",
}));

export const enviroSpecificOrganizationErrorStateAtom = atom(createPersistedAtom("enviroSpecificOrganizationErrorState", null));

export const enviroSpecificOrganizationDataStateAtom = atom(createPersistedAtom("enviroSpecificOrganizationDataState", null));

export const enviroSpecificOrganizationLoadingStateAtom = atom(createPersistedAtom("enviroSpecificOrganizationLoadingState", false));

// Enviro Specific Individual Data State
// (single individual detail view: GET dashboard/getEnviroSpecificIndividualData/:id?year=..)
export const enviroSpecificIndividualFiltersStateAtom = atom(createPersistedAtom("enviroSpecificIndividualFiltersState", {
  year: "",
}));

export const enviroSpecificIndividualErrorStateAtom = atom(createPersistedAtom("enviroSpecificIndividualErrorState", null));

export const enviroSpecificIndividualDataStateAtom = atom(createPersistedAtom("enviroSpecificIndividualDataState", null));

export const enviroSpecificIndividualLoadingStateAtom = atom(createPersistedAtom("enviroSpecificIndividualLoadingState", false));

// Enviro Specific Sales Person Data State
// (single sales person detail view: GET dashboard/getEnviroSpecificSalesPersonData/:id?year=..)
export const enviroSpecificSalesPersonFiltersStateAtom = atom(createPersistedAtom("enviroSpecificSalesPersonFiltersState", {
  year: "",
}));

export const enviroSpecificSalesPersonErrorStateAtom = atom(createPersistedAtom("enviroSpecificSalesPersonErrorState", null));

export const enviroSpecificSalesPersonDataStateAtom = atom(createPersistedAtom("enviroSpecificSalesPersonDataState", null));

export const enviroSpecificSalesPersonLoadingStateAtom = atom(createPersistedAtom("enviroSpecificSalesPersonLoadingState", false));