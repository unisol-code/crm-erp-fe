import React, { useState } from "react";
import {
  kitchenTypeAtom,
  laundryTypeAtom,
  legalEntityAtom,
  specialityAtom,
  surgeryTypeAtom,
  targetOrganizationNames,
  productListStateAtom,
  productDetailsStateAtom,
  doctorListAtom,
  cityNamesAtom,
  productTypesAtom,
  organizationTypeAtom,
  callStatusObjectivesAtom,
  genderAtom,
  salutationAtom,
  typeofProfileAtom,
  customersProfileAtom,
  categoryAtom,
  professionalAssociationsAtom,
  organizationTypeByCityAtom,
  organizationCityAtom,
  organizationNameByCityTypeAtom,
  specialityByOrgCityTypeAtom,
  getAllStateNameAtom,
  segmentAtom,
  profileAtom,
  hospitalTypeAtom,
  designationAtom,
  regionAtom,
  specialityIndividualAtom,
  categoryIndividualAtom,
  ProfileIndividualAtom,
  HobbiesIndividualAtom,
  hospitalAssociatedWithAtom,
  employeeAtom,
  productsToPromoteAtom,
  orgnizationNamesAtom,
  designationForNonClinicalAtom,
  departmentForNonClinicalAtom,
  enviroindiviualdropdownAtom,
  allCitiesAtom,
  KWMQ1Atom,
  KWMQ2Atom,
  KWMQ5Atom,
  KWMQ9Atom,
  KWMQ11Atom,
  IQ2Atom,
  IQ4Atom,
  BMW4Atom,
  districtListAtom,
} from "../../state/dropdown/dropdownState";
import useFetch from "../useFetch";
import { useRecoilState } from "recoil";
import conf from "../../config/index";

const useDropdown = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [legalEntity, setLegalEntity] = useRecoilState(legalEntityAtom);
  const [speciality, setSpeciality] = useRecoilState(specialityAtom);
  const [region, setRegion] = useRecoilState(regionAtom);
  const [organizationList, setOrganizationList] = useRecoilState(
    targetOrganizationNames
  );
  const [surgeryType, setSurgeryType] = useRecoilState(surgeryTypeAtom);
  const [kitchenType, setKitchenType] = useRecoilState(kitchenTypeAtom);
  const [laundryType, setLaundryType] = useRecoilState(laundryTypeAtom);
  const [productList, setProductList] = useRecoilState(productListStateAtom);
  const [productDetails, setProductDetails] = useRecoilState(
    productDetailsStateAtom
  );
  const [cityNames, setCityNames] = useRecoilState(cityNamesAtom);
  const [doctorList, setDoctorList] = useRecoilState(doctorListAtom);
  const [productTypes, setProductTypes] = useState(productTypesAtom);
  const [organizationTypes, setOrganizationTypes] =
    useState(organizationTypeAtom);
  const [hospitalTypes, setHospitalTypes] = useState(hospitalTypeAtom);
  const [callobjectivestatus, setCallObjectiveStatus] = useState(
    callStatusObjectivesAtom
  );
  const [gender, setGender] = useRecoilState(genderAtom);
  const [salutation, setSalutation] = useRecoilState(salutationAtom);
  const [professionalAssociations, setprofessionalAssociations] =
    useRecoilState(professionalAssociationsAtom);
  const [category, setCategory] = useRecoilState(categoryAtom);
  const [typeOfProfile, setTypesOfProfile] = useRecoilState(typeofProfileAtom);
  const [customerProfile, setCustomerProfile] =
    useRecoilState(customersProfileAtom);
  const [organizationTypeByCity, setOrganizationTypeByCity] = useRecoilState(
    organizationTypeByCityAtom
  );
  const [organizationCity, setOrganizationCity] =
    useRecoilState(organizationCityAtom);
  const [orgNameByTypeCity, setOrgNameByTypeCity] = useRecoilState(
    organizationNameByCityTypeAtom
  );
  const [specialityByOrgCityType, setSpecialityByOrgCityType] = useRecoilState(
    specialityByOrgCityTypeAtom
  );
  const [segment, setSegment] = useRecoilState(segmentAtom);
  const [profile, setProfile] = useRecoilState(profileAtom);
  const [enviroprofile, setEnviroProfile] = useRecoilState(enviroindiviualdropdownAtom);
  const [designation, setDesignation] = useRecoilState(designationAtom);
  const [getspeciality, setGetSpeciality] = useRecoilState(
    specialityIndividualAtom
  );
  const [categorys, setCategorys] = useRecoilState(categoryIndividualAtom);
  const [profiles, setProfiles] = useRecoilState(ProfileIndividualAtom);
  const [hobbies, setHobbies] = useRecoilState(HobbiesIndividualAtom);
  const [hospitalsAssociatedWith, setHospitalAssociatedWith] = useRecoilState(
    hospitalAssociatedWithAtom
  );
  const [designationForNonClinical, setDesignationFOrNonClinical] =
    useRecoilState(designationForNonClinicalAtom);
  const [departmentForNonClinical, setDepartmentFOrNonClinical] =
    useRecoilState(departmentForNonClinicalAtom);
  const [employees, setEmployees] = useRecoilState(employeeAtom);

  const [productsToPromote, setProductsToPromote] = useRecoilState(
    productsToPromoteAtom
  );
  const [orgnizationNames, setOrgnizationNames] =
    useRecoilState(orgnizationNamesAtom);

  // organizational dropdown 
  const [KWM1, setKWM1] = useRecoilState(KWMQ1Atom);
  const [KWM2, setKWM2] = useRecoilState(KWMQ2Atom);
  const [KWM5, setKWM5] = useRecoilState(KWMQ5Atom);
  const [KWM9, setKWM9] = useRecoilState(KWMQ9Atom);
  const [KWM11, setKWM11] = useRecoilState(KWMQ11Atom);
  const [IQ2, setIQ2] = useRecoilState(IQ2Atom);
  const [IQ4, setIQ4] = useRecoilState(IQ4Atom)
  const [BMW4, setBMW4] = useRecoilState(BMW4Atom);

  const [allStateName, setAllStateName] = useRecoilState(getAllStateNameAtom);
  const [districtList, setDistrictList] = useRecoilState(districtListAtom);

  const [cities, setCities] = useRecoilState(allCitiesAtom);

  
  
  const fetchLegalEntity = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getIfGoverment`,
      });
      if (res) {
        setLegalEntity(res?.data);
      }
    } catch (err) {
      console.error("Error fetching legal entity:", err);
    } finally {
      setLoading(false);
    }
  };



  const fetchSpeciality = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getallSpeciality`,
      });
      if (res) {
        setSpeciality(res?.data);
      }
    } catch (err) {
      console.error("Error fetching speciality:", err);
      // toast.error(err?.response?.data?.message || "An error occurred while fetching speciality.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationNames = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/organizationsdropdown`,
      });
      if (res) {
        setOrganizationList(res);
      }
    } catch (err) {
      console.error("Error while fetching Organization List:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurgeryType = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getallSurgeryType`,
      });
      if (res) {
        setSurgeryType(res?.data);
      }
    } catch (err) {
      console.error("Error fetching surgery type:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKitchenType = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getallKitchenType`,
      });
      if (res) {
        setKitchenType(res?.data);
      }
    } catch (err) {
      console.error("Error fetching kitchen type:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLaundryType = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getallLaundryType`,
      });
      if (res) {
        setLaundryType(res?.data);
      }
    } catch (err) {
      console.error("Error fetching laundry type:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsNames = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}product/getAllProductNames`,
      });
      if (res) {
        console.log(res);
        setProductList(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}product/getProductById/${id}`,
      });
      if (res) {
        console.log(res);
        setProductDetails(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching product price:", err);
      // toast.error("Failed to fetch product price");
    } finally {
      setLoading(false);
    }
  };

  const fetchCityNames = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/city-dropdown`,
      });
      if (res) {
        setCityNames(res?.data || []);
      }
    } catch (err) {
      console.error("Error while fetching city names:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetProductDetails = () => {
    setProductDetails({});
  };

  const fetchDoctorList = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/getAllDoctorsDropdown`,
      });
      if (res) {
        console.log(res);
        setDoctorList(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching doctor list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-productTypes`,
      });
      if (res) {
        console.log(res);
        setProductTypes(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching product types:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getTypeOfHospital`,
      });
      if (res) {
        console.log(res);
        setHospitalTypes(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching hospita types:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchOrganizationTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getTypeOfOrgOrHospital`,
      });
      if (res) {
        console.log(res);
        setOrganizationTypes(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching organization types:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchSegment = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-segment`,
      });
      if (res) {
        console.log(res);
        setSegment(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching hospita types:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchCallObjectiveStatuses = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-callobjectivestatus`,
      });
      if (res) {
        console.log(res);
        setCallObjectiveStatus(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching call objective statuses:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchGender = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-gender`,
      });
      if (res) {
        console.log(res);
        setGender(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching Salutation list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalutation = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-salutation`,
      });
      if (res) {
        console.log(res);
        setSalutation(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching Salutation list:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchTypeOfProfile = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-profile-type`,
      });
      if (res) {
        console.log(res);
        setTypesOfProfile(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching Salutation list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersProfile = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-profile
`,
      });
      if (res) {
        console.log(res);
        setCustomerProfile(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching Salutation list:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchProfessionalAssociations = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-professional-assoc`,
      });
      if (res) {
        console.log(res);
        setprofessionalAssociations(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching Salutation list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-category`,
      });
      if (res) {
        console.log(res);
        setCategory(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching Salutation list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationTypesByCity = async (city) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-organizationTypes?city=${city}`,
      });
      if (res) {
        console.log(res);
        setOrganizationTypeByCity(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching organization types by city:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchOrganizationCity = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getAllOrganizationcities`,
      });
      if (res) {
        setOrganizationCity(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching org city names:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchOrganizationNameByCityType = async (city, organizationType) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getOrganizationNames?organizationType=${organizationType}&city=${city}`,
      });
      if (res) {
        setOrgNameByTypeCity(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching Organization List:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchSpecialityByOrgCityType = async (
    fromOrganization,
    organizationName,
    typeOfOrganization,
    city
  ) => {
    console.log(fromOrganization, organizationName, typeOfOrganization, city);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getallSpeciality?fromOrganization=${fromOrganization}&organizationName=${organizationName}&typeOfOrganization=${typeOfOrganization}&city=${city}`,
      });
      if (res) {
        setSpecialityByOrgCityType(res?.data);
      }
    } catch (err) {
      console.error("Error while fetching speciality list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStateName = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getAllStates`,
      });
      if (res) {
        setAllStateName(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching All State list:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistrictList = async (stateCode) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/districts/${stateCode}`,
      });
      if (res) {
        setDistrictList(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCities = async (stateCode, districtName) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/cities/${stateCode}/${districtName}`,
      });

      if (res) {
        setCities(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const segmentState = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-segment`,
      });
      if (res) {
        setSegment(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Segment DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const profileState = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getProfileTypeOnlyForHealthcare`,
      });
      if (res) {
        setProfile(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Segment DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const enviroindiviualdropdown = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/individual-type-dropdown`,
      });
      if (res) {
        setEnviroProfile(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Segment DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const getWasteMagement = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}/dropdown/getWasteMagement`,
      })
      if (res) {
        setWasteMagement(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Segment DropDown:", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchDesignation = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getallDesignation`,
      });
      if (res) {
        console.log("Designations fetched:", res.data);
        setDesignation(res?.data || res);

      }
    } catch (error) {
      console.error("Error while fetching Segment DropDown:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRegion = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getAllRegion`,
      });
      if (res) {
        setRegion(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching All Region DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialityIndividual = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-speciality`,
      });
      if (res) {
        setGetSpeciality(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching speciality DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorys = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-category`,
      });
      if (res) {
        setCategorys(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Categorys DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-profile-type`,
      });
      if (res) {
        setProfiles(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Profiles DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHobbies = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-hobbies`,
      });
      if (res) {
        setHobbies(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Hobbies DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalAssociatedWith = async (organizationType, city) => {
    console.log("organizationType", organizationType, "city", city);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        organizationType: organizationType,
        city: city,
      });
      if (!organizationType) {
        params.delete("organizationType");
      }
      if (!city) {
        params.delete("city");
      }
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getOrganizationNames?${params}`,
      });
      if (res) {
        setHospitalAssociatedWith(res?.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching Hospital Associated With DropDown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getAllEmployees`,
      });
      if (res) {
        setEmployees(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching emploees DropDown:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsToPromote = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/get-products-to-promote`,
      });
      if (res) {
        setProductsToPromote(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Products To Promote DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgnizationNames = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/getOrganizationNames`,
      });
      if (res) {
        setOrgnizationNames(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Orgnizations names DropDown:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignationForNonClinical = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getDesignationIfNonClinic`,
      });
      if (res) {
        setDesignationFOrNonClinical(res?.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching designation for non-clinical dropDown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchDepartmentForNonClinical = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/getDepartmentIfNonClinic`,
      });
      if (res) {
        setDepartmentFOrNonClinical(res?.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching department for non-clinical dropDown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchkitchenqueone = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/multiple-selector-kwmq1`,
      });
      if (res?.success) {
        setKWM1(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q1 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchkitchenquetwo = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/multiple-selector-kwmq2`,
      });
      if (res?.success) {
        setKWM2(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q2 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchkitchenquefive = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/multiple-selector-kwmq5`,
      });
      if (res?.success) {
        setKWM5(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q1 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchkitchenquenine = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/multiple-selector-kwmq9`,
      });
      if (res?.success) {
        setKWM9(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q1 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchkitchenqueeleven = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/multiple-selector-kwmq11`,
      });
      if (res?.success) {
        setKWM11(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q1 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchlaundrytwo = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/dropdown-lq2`,
      });
      if (res?.success) {
        setIQ2(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q1 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchlaundryfour = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/dropdown-lq4`,
      });
      if (res?.success) {
        setIQ4(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q1 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchbiomedicalfour = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}drop-down/multiple-selector-bmwq4`,
      });
      if (res?.success) {
        setBMW4(res.data);
      }
    } catch (error) {
      console.error(
        "Error while fetching kitchen Q1 dropdown:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchLegalEntity,
    legalEntity,
    fetchSpeciality,
    speciality,
    loading,
    organizationList,
    fetchOrganizationNames,
    fetchSurgeryType,
    surgeryType,
    fetchKitchenType,
    kitchenType,
    fetchLaundryType,
    laundryType,
    fetchProductsNames,
    productList,
    fetchProductDetails,
    productDetails,
    resetProductDetails,
    doctorList,
    fetchDoctorList,
    fetchCityNames,
    cityNames,
    fetchProductTypes,
    productTypes,
    organizationTypes,
    fetchOrganizationTypes,
    fetchCallObjectiveStatuses,
    callobjectivestatus,
    fetchGender,
    gender,
    salutation,
    fetchSalutation,
    customerProfile,
    fetchCustomersProfile,
    fetchTypeOfProfile,
    typeOfProfile,
    fetchCategory,
    fetchProfessionalAssociations,
    category,
    professionalAssociations,
    organizationTypeByCity,
    fetchOrganizationTypesByCity,
    fetchOrganizationCity,
    organizationCity,
    fetchOrganizationNameByCityType,
    orgNameByTypeCity,
    fetchSpecialityByOrgCityType,
    specialityByOrgCityType,
    fetchAllStateName,
    allStateName,
    segmentState,
    segment,
    profileState,
    enviroindiviualdropdown,
    getWasteMagement,
    profile,
    fetchHospitalTypes,
    hospitalTypes,
    fetchDesignation,
    designation,
    fetchAllRegion,
    region,
    fetchSpecialityIndividual,
    getspeciality,
    fetchCategorys,
    enviroprofile,
    categorys,
    fetchProfiles,
    profiles,
    fetchHobbies,
    hobbies,
    fetchHospitalAssociatedWith,
    hospitalsAssociatedWith,
    fetchAllEmployees,
    employees,
    productsToPromote,
    fetchOrgnizationNames,
    orgnizationNames,
    fetchProductsToPromote,
    fetchDesignationForNonClinical,
    designationForNonClinical,
    fetchDepartmentForNonClinical,
    departmentForNonClinical,
    fetchSegment,
    fetchDistrictList,
    districtList,
    cities,
    fetchAllCities,
    fetchkitchenqueone,
    KWM1,
    fetchkitchenquetwo,
    KWM2,
    fetchkitchenquefive,
    KWM5,
    fetchkitchenquenine,
    KWM9,
    fetchkitchenqueeleven,
    KWM11,
    fetchlaundrytwo,
    IQ2,
    fetchlaundryfour,
    IQ4,
    fetchbiomedicalfour,
    BMW4,

  };
};

export default useDropdown;
