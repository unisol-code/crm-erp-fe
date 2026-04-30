import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeLayout from "./components/layouts/HomeLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ResetPassword from "./pages/auth/resetPassword/resetPassword";
import LoginTabs from "./pages/auth/Login/LoginTabs";
import VerifyOtp from "./pages/auth/verifyOtp/verifyOtp";
import ConfirmPassword from "./pages/auth/confirmPassword/confirmPassword";
// import DatabaseCustomerDetails from "./components/Dialogs/DatabaseCustomerDetails";

import SuperAdminLayout from "./components/layouts/SuperAdminLayout";
import HomeDashboard from "./pages/modules/superAdmin/home/homeDashboard/HomeDashboard";
import Dashboard from "./pages/modules/superAdmin/dashboard/Dashboard";

import {
  PreviewLead,
} from "./pages/modules/superAdmin/leadManagement/createLead/index";
import EnviroCompanyLead from "./pages/modules/superAdmin/leadManagement/EnviroCompanyLead";

import CompanySalesReport from "./pages/modules/superAdmin/home/companySalesAnalitics/CompanySalesRepor";
import {
  SalesReport,
  ViewSalesReport,
  AddSalesReport,
} from "./pages/modules/superAdmin/salesAnalytics/index";

import SalesExecutiveLayout from "./components/layouts/SalesExecutiveLayout";
import SalesExecutiveDashboard from "./pages/modules/salesExecutive/dashboard/Dashboard";

import {
  ViewDoctor,
  ViewHighPriorityDoct,
} from "./pages/modules/salesExecutive/dashboard/viewdoctor/index";

import {
  MonthlyPlanning,
  ViewMonthlyPlanning,
  CreateMonthlyPlanning,
  PreviewMonthlyPlanning,
  ViewMonthlyPlanningDetails,
} from "./pages/modules/salesExecutive/customerVisitPlan/montlyPlanning/index";

import {
  TargetSheet,
  TargetSheetForm,
  PreviewTargetSheet,
  EditTargetSheet,
} from "./pages/modules/salesExecutive/customerVisitPlan/targetSheet/index";
import TerritorySnapshot from "./pages/modules/salesExecutive/customerVisitPlan/territorySnapshot/TerritorySnapshot";

import {
  AddNewOrganization,
  EditOrganization,
  PreviewOrganization,
} from "./pages/modules/salesExecutive/database/organizationalDatabase/index";

import {
  AddNewIndividual,
  EditIndividual,
  PreviewNewIndividual,
} from "./pages/modules/salesExecutive/database/individualDatabase/index";

import {
  ESalesReport,
  EViewReport,
} from "./pages/modules/salesExecutive/salesReport/index";

import SalesExecutiveDatabase from "./pages/modules/salesExecutive/database/SalesExecutiveDatabase";

import AddNewCustomers from "./pages/modules/superAdmin/database/addNewcutomers/AddNewCustomers";
import SuperAdminDatabase from "./pages/modules/superAdmin/database/SuperAdminDatabase";
import AddNewSuperAdminIndividual from "./pages/modules/superAdmin/database/superAdminIndividualDB/AddNewSuperAdminIndividual";
import SuperAdminPreviewNewIndividual from "./pages/modules/superAdmin/database/superAdminIndividualDB/SuperAdminPreviewNewIndividual";
import EditSuperAdminIndividual from "./pages/modules/superAdmin/database/superAdminIndividualDB/EditSuperAdminIndividual";
import AddNewSuperAdminOrganization from "./pages/modules/superAdmin/database/superAdminOrganizationDB/AddNewSuperAdminOrganization";
import SuperAdminPreviewOrganization from "./pages/modules/superAdmin/database/superAdminOrganizationDB/SuperAdminPreviewOrganization";
import EditSuperAdminOrganization from "./pages/modules/superAdmin/database/superAdminOrganizationDB/EditSuperAdminOrganization";
import DoctorProfile from "./pages/modules/superAdmin/database/superAdminIndividualDB/superAdminIndividualTabs/doctorprofile/DoctorProfile";
import ViewRequests from "./pages/modules/superAdmin/database/ViewRequests";
import IndRequestActions from "./pages/modules/superAdmin/database/superAdminIndividualDB/IndRequestActions";
import OrgRequestActions from "./pages/modules/superAdmin/database/superAdminOrganizationDB/OrgRequestActions";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import SalesExecutiveProtectedRoute from "./routes/SalesExecutiveProtectedRoute";
import ViewEnviroIndForm from "./pages/modules/salesExecutive/database/individualDatabase/enviroIndividualform/ViewEnviroIndForm";
import EnviroIndRequestAction from "./pages/modules/superAdmin/database/superAdminIndividualDB/enviroIndiviualform/EnviroIndRequestAction";
import ViewEnviroAdminIndForm from "./pages/modules/superAdmin/database/superAdminIndividualDB/enviroIndiviualform/ViewEnviroAdminIndForm";
import EnviroAdminOrgAddEditDB from "./pages/modules/superAdmin/database/superAdminOrganizationDB/enviroAdminOrgDB/EnviroAdminOrgAddEditDB";
import EnviroEmpOrgAddEditDB from "./pages/modules/salesExecutive/database/organizationalDatabase/enviroEmpOrgDB/EnviroEmpOrgAddEditDB";
import EnviroOrgRequestActions from "./pages/modules/superAdmin/database/superAdminOrganizationDB/enviroAdminOrgDB/EnviroOrgRequestActions";

function App() {
  const [activeTab, setActiveTab] = useState("/crm-dashboard");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginTabs />} />
        {/* -----Password Reset Page----- */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* -----Verify OTP Page----- */}
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* -----Password confirm Page----- */}
        <Route path="/confirm-password" element={<ConfirmPassword />} />

        {/* <Route element={<ProtectedRoute />}> */}
        <Route element={<AdminProtectedRoute />}>
          <Route
            path="/crm-dashboard"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <Dashboard />
              </SuperAdminLayout>
            }
          />

          {/* Home Dashboard for All Companies */}
          <Route
            path="/crm-home-dashboard"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <HomeDashboard />
              </HomeLayout>
            }
          />

          <Route
            path="/home-sales-analytics"
            element={
              <HomeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <CompanySalesReport />
              </HomeLayout>
            }
          />

          {/* End of Home Dashboard */}

          {/* Lead Management */}
          <Route
            path="/lead/createlead"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <CreateLead /> */}
                <EnviroCompanyLead page="createLead" />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/lead/createlead/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <CreateLead /> */}
                <EnviroCompanyLead page="createLead" />
              </SuperAdminLayout>
            }
          />
          {/* /view button route */}
          <Route
            path="/preview-lead/:Id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <CreateLead /> */}
                <PreviewLead />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/lead/edit-lead/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <CreateLead /> */}
                <EnviroCompanyLead page="editLead" />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/lead/lead-tracking"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <TrackLead /> */}
                <EnviroCompanyLead page="trackLead" />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/lead/lead-tracking/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <TrackLead /> */}
                <EnviroCompanyLead page="viewLeadById" />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/lead/view-lead"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <ViewLead /> */}
                <EnviroCompanyLead page="viewLead" />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <SuperAdminDatabase />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/database/addnew-organization"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewSuperAdminOrganization />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/add-enviro-organization"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EnviroAdminOrgAddEditDB />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/edit-enviro-organization/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EnviroAdminOrgAddEditDB />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/add-newindividual"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewSuperAdminIndividual />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/database/view-newindividual/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <SuperAdminPreviewNewIndividual />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/view-enviro-individual-details/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewEnviroAdminIndForm />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/edit-individual/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EditSuperAdminIndividual />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/database/edit-enviro-individual/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewSuperAdminIndividual />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/database/add-neworganization"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewSuperAdminOrganization />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/view-organization/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <SuperAdminPreviewOrganization />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/edit-organization/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EditSuperAdminOrganization />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/database/approvalrequest/viewrequests/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewRequests />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/approvalrequest/viewrequests/indrequestactions/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <IndRequestActions />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/approvalrequest/viewrequests/enviro-ind-request-actions/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EnviroIndRequestAction />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/approvalrequest/viewrequests/orgrequestactions/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <OrgRequestActions />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/approvalrequest/viewrequests/enviro-org-request-actions/:id"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EnviroOrgRequestActions />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/sales-analytics"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <SalesReport />
              </SuperAdminLayout>
            }
          />
          <Route
            path="/sales-analytics/add-report"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddSalesReport />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/sales-analytics/view-sales-report"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewSalesReport />
              </SuperAdminLayout>
            }
          />
        </Route>

        {/* <Route
          path="/organization-details/:id"
          element={<DatabaseCustomerDetails />}
        /> */}

        <Route element={<SalesExecutiveProtectedRoute />}>
          <Route
            path="/sales-executive/dashboard"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <SalesExecutiveDashboard />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/viewdoctor/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewDoctor />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/viewhighprioritydoctor"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewHighPriorityDoct />
              </SalesExecutiveLayout>
            }
          />

          {/*  sales executive database*/}
          <Route
            path="/sales-executive/database"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {/* <OrganizationDatabase /> */}
                <SalesExecutiveDatabase />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/database/individual"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewIndividual />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/database/edit-individual/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewIndividual />
              </SalesExecutiveLayout>
            }
          />

          {/* customer visit  plan */}
          <Route
            path="/sales-executive/monthly-planning"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <MonthlyPlanning />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/monthly-planning/view-monthly-planning/:month/:year"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewMonthlyPlanning />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/monthly-planning/view-monthly-planning/:month/:year/view-monthly-planning-details/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewMonthlyPlanningDetails />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/monthly-planning/create-monthly-plan"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <CreateMonthlyPlanning />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/monthly-planning/create-monthly-plan/view-createmonthlyplanning"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <PreviewMonthlyPlanning />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/territory-snapshot"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <TerritorySnapshot />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/sales-report"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ESalesReport />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/sales-report/view-report/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EViewReport />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/target-sheet"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <TargetSheet />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/target-sheet/target-sheet-form"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <TargetSheetForm />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/target-sheet/view-target-sheet/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <PreviewTargetSheet />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/target-sheet/edit-target-sheet/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EditTargetSheet />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/database/addnew-organization"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewOrganization />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/database/add-enviro-organization"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EnviroEmpOrgAddEditDB mode="add" />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/database/view-enviro-organization/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EnviroEmpOrgAddEditDB mode="view" />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/database/edit-enviro-organization/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EnviroEmpOrgAddEditDB mode="edit" />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/database/edit-organization/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <EditOrganization />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/database/view-organization/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <PreviewOrganization />
              </SalesExecutiveLayout>
            }
          />

          <Route
            path="/sales-executive/database/view-individual/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <PreviewNewIndividual />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/sales-executive/database/view-enviro-individual/:id"
            element={
              <SalesExecutiveLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <ViewEnviroIndForm />
              </SalesExecutiveLayout>
            }
          />
          <Route
            path="/database/addnewcutomers"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <AddNewCustomers />
              </SuperAdminLayout>
            }
          />

          <Route
            path="/database/doctorprofile"
            element={
              <SuperAdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                <DoctorProfile />
              </SuperAdminLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;