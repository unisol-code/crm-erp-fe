import * as Yup from "yup";
export const validationSchema = Yup.object().shape({
  Basic: Yup.object().shape({
    segment: Yup.string().required("Segment is required"),
    hospitalName: Yup.string().required("Hospital Name is required"),
    typeOfHospital: Yup.string().required("Type of Hospital is required"),
    typeOfOrgOrHospital: Yup.string().required(
      "Organization/Hospital type is required"
    ),

    ifGovt: Yup.string().when("typeOfOrgOrHospital", {
      is: (val) => val === "Govt",
      then: (schema) => schema.required("Government field is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    address: Yup.string().required("Address is required"),
    district: Yup.string().required("District is required"),
    state: Yup.string().required("State is required"),
    region: Yup.string().required("Region is required"),
    city: Yup.string().required("City is required"),
    emailAddress: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  }),

  hospitalData: Yup.object().shape({
    totalBeds: Yup.number()
      .typeError("Total Beds must be a number"),
    // .required("Total Beds is required")
    // .min(1, "At least 1 bed is required"),
    totalICUBeds: Yup.number()
      .typeError("Total ICU Beds must be a number")
      .required("Total ICU Beds is required")
      .min(0, "Cannot be negative"),
    totalOT: Yup.number()
      .typeError("Total OT must be a number")
      .required("Total OT is required")
      .min(0, "Cannot be negative"),

    specialities: Yup.array()
      .of(
        Yup.object().shape({
          // name: Yup.string().required("Speciality name is required"),
          surgeries: Yup.array()
            .of(
              Yup.object().shape({
                // surgeryType: Yup.string().required("Surgery type is required"),
                numberOfSurgeries: Yup.number()
                  .typeError("Number of surgeries must be a number")
                  .required("Number of surgeries is required")
                  .min(0, "Cannot be negative"),
              })
            )
            .min(1, "At least one surgery entry is required"),
          totalSurgeriesCalenderYear: Yup.number()
            .typeError("Total surgeries must be a number")
            .required("Total surgeries in calendar year is required")
            .min(0, "Cannot be negative"),
        })
      )
      .min(1, "At least one speciality is required"),
  }),
  salesPersonName: Yup.string().required("Sales Person Name is required"),
  solidWaste: Yup.object().shape({
    SWQ8: Yup.object().shape({
      wet: Yup.number().typeError("Must be a number").max(100, "Percentage cannot exceed 100").min(0, "Percentage cannot be negative"),
      dry: Yup.number().typeError("Must be a number").max(100, "Percentage cannot exceed 100").min(0, "Percentage cannot be negative"),
      hazardous: Yup.number().typeError("Must be a number").max(100, "Percentage cannot exceed 100").min(0, "Percentage cannot be negative"),
      cd: Yup.number().typeError("Must be a number").max(100, "Percentage cannot exceed 100").min(0, "Percentage cannot be negative"),
      sanitary: Yup.number().typeError("Must be a number").max(100, "Percentage cannot exceed 100").min(0, "Percentage cannot be negative"),
    }),
    SWQ16: Yup.number().typeError("Must be a number").max(100, "Percentage cannot exceed 100").min(0, "Percentage cannot be negative"),
  }),
});

export const initialValues = {
  Basic: {
    segment: "",
    hospitalName: "",
    typeOfHospital: "",
    typeOfOrgOrHospital: "",
    ifGovt: "",
    address: "",
    district: "",
    state: "",
    region: "",
    city: "",
    emailAddress: "",
  },
  hospitalData: {
    totalBeds: 0,
    totalICUBeds: 0,
    totalOT: 0,
    specialities: [
      {
        name: "",
        surgeries: [{ surgeryType: "", numberOfSurgeries: 0 }],
        totalSurgeriesCalenderYear: 0,
      },
    ],
  },
  kitchenWasteManagement: {
    KWMQ1: [],
    // KWMQ1_OTHER: "",
    KWMQ2: [],
    // KWMQ2_OTHER: "",
    KWMQ3: { answers: false },
    KWMQ4: "",
    KWMQ5: [],
    // KWMQ5_OTHER: "",
    KWMQ6: false,
    KWMQ7: "",
    KWMQ8: "",
    KWMQ9: "",
    // KWMQ9_OTHER: "",
    KWMQ10: "",
    KWMQ11: "",
    // KWMQ11_OTHER: "",
    concernPersons: [{ name: "", contact: "", designation: "" }],
  },

  laundry: {
    LQ1: "",
    LQ2: "",
    LQ3: "",
    LQ4: false,
    LQ5: "",
    LQ6: "",
    LQ7: "",
    LQ8: "",
    LQ9: "",
    LQ10A: "",
    LQ10B: "",
    LQ11: "",
    LQ12: "",
    LQ13: "",
    LQ14: "",
    LQ15: "",
    LQ16: "",
    LQ17: "",
    LQ18: "",
    LQ19: "",
    concernPersons: [{ name: "", contact: "", designation: "" }],
  },

  bioMedicalWaste: {
    BMWQ1A: "",
    BMWQ1B: "",
    BMWQ2: "",
    BMWQ3: "",
    BMWQ4: [],
    BMWQ5: "",
    BMWQ6: {
      answers: false,
      briefAnswer: "",
    },
    BMWQ7: "",
    BMWQ8: "",
    BMWQ9: "",
    BMWQ10: "",
    BMWQ11: "",
    BMWQ12: "",
    BMWQ13: "",
    BMWQ14: "",
    BMWQ15: "",
    BMWQ16: "",
    BMWQ17: "",
    BMWQ18: "",
    BMWQ19: "",
    BMWQ20: "",
    concernPersons: [{ name: "", contact: "", designation: "" }],
  },

  solidWaste: {
    SWQ1: "", // Estimated total waste generated per day (TPD)
    SWQ8: {
      wet: "",
      dry: "",
      hazardous: "",
      cd: "",
      sanitary: "",
    },
    SWQ9: {
      answers: false,
      frequency: "",
    },
    SWQ10: false, // Is source segregation mandated
    SWQ11: "", // Collection method
    SWQ12: "", // Collection frequency
    SWQ13: [], // Types of collection vehicles used
    SWQ13_OTHER: "",
    SWQ14: [], // Waste processing facilities available
    SWQ15: "", // Capacity of processing facilities (TPD)
    SWQ16: "", // % of total waste processed
    SWQ29: {
      answers: false,
      type: "",
    },
    SWQ30: "", // Handling of dry waste
    SWQ31: "", // Final disposal method
    SWQ31_OTHER: "",
    SWQ32: "", // Is the landfill/dumpsite compliant
    SWQ33: false, // Measures for leachate management
    SWQ34: false, // Gas collection or flaring system
    SWQ35: false, // Dumpsite remediation or biomining initiated
    SWQ36: "", // Total number of sanitation workers
    SWQ37: "", // Mode of employment
    SWQ60: "", // Key operational challenges
    SWQ61: "", // Key infrastructure gaps
    SWQ62: "", // Financial constraints
    SWQ63: "", // Regulatory/compliance issues
    SWQ64: "", // Behavioral/change management challenges
    SWQ65: "", // Priority areas for improvement
    concernPersons: [{ name: "", contact: "", designation: "" }],
  },

  wasteWaterManagement: {
    WWWQ1: [], // Source of Wastewater
    WWWQ2: "", // Major Industrial Sources
    WWWQ3: "", // Average Daily Influent Volume
    WWWQ4: [], // Treatment Type
    WWWQ5: "", // Treatment Technologies Used
    WWWQ6: "", // Sludge Treatment Method
    WWWQ7: "", // Treated Water Utilization
    WWWQ8: "", // Disposal Location
    WWWQ9: "", // O&M Managed By
    WWWQ10: "", // Name of O&M Agency
    WWWQ11: "", // Key Challenges
    WWWQ12: "", // Level of Automation
    WWWQ13: false, // Planned Capacity Expansion
    WWWQ14: false, // Planned Technology Upgrades
    WWWQ15: false, // Interest in Advanced Solutions
    WWWQ16: "", // Additional CRM Requirements
    concernPersons: [{ name: "", contact: "", designation: "" }],
  },

  wasteManagement: {
    types: [],
  },

  physiotherapy: {
    primaryObjective: "",
    intendedFor: [],
    setupContext: "",
    expectedPatientLoad: "",
    serviceType: "",
    plannedLocation: "",
    totalArea: "",
    areaDivision: "",
    patientMovementFlow: "",
    barrierFreeAccessibility: false,
    infrastructurePlanned: false,
    ventilationLighting: false,
    suitableFlooring: "",
    privacyRequirements: false,
    essentialEquipment: "",
    advancedTechnologies: "",
    treatmentStations: "",
    equipmentPreference: "",
    powerRequirements: "",
    physiotherapistCount: "",
  },
  salesPersonName: "",
  anyOtherInformation: "",
};

// Transform API response data to form format
export const transformApiDataToForm = (apiData) => {
  const data = {
    Basic: apiData.Basic ? { ...apiData.Basic } : { ...initialValues.Basic },
    hospitalData: apiData.hospitalData ? { ...apiData.hospitalData } : { ...initialValues.hospitalData },
    laundry: apiData.Laundry ? { ...apiData.Laundry } : { ...initialValues.laundry },
    kitchenWasteManagement: apiData.kitchenWasteManagement ? { ...apiData.kitchenWasteManagement } : { ...initialValues.kitchenWasteManagement },
    bioMedicalWaste: apiData.bioMedicalWaste ? { ...apiData.bioMedicalWaste } : { ...initialValues.bioMedicalWaste },
    solidWaste: apiData.solidWaste ? { ...apiData.solidWaste } : { ...initialValues.solidWaste },
    wasteWaterManagement: apiData.wasteWaterManagement ? { ...apiData.wasteWaterManagement } : { ...initialValues.wasteWaterManagement },
    wasteManagement: apiData.wasteManagement ? { ...apiData.wasteManagement } : { ...initialValues.wasteManagement },
    physiotherapy: apiData.physiotherapy ? { ...apiData.physiotherapy } : { ...initialValues.physiotherapy },
    salesPersonName: apiData.salesPersonName || "",
    anyOtherInformation: apiData.anyOtherInformation || "",
  };

  // Ensure concernPersons exists
  if (!data.kitchenWasteManagement.concernPersons) data.kitchenWasteManagement.concernPersons = initialValues.kitchenWasteManagement.concernPersons;
  if (!data.laundry.concernPersons) data.laundry.concernPersons = initialValues.laundry.concernPersons;
  if (!data.bioMedicalWaste.concernPersons) data.bioMedicalWaste.concernPersons = initialValues.bioMedicalWaste.concernPersons;
  if (!data.solidWaste.concernPersons) data.solidWaste.concernPersons = initialValues.solidWaste.concernPersons;
  if (!data.wasteWaterManagement.concernPersons) data.wasteWaterManagement.concernPersons = initialValues.wasteWaterManagement.concernPersons;

  // Transform SWQ29 from string to object for UI
  if (data.solidWaste && typeof data.solidWaste.SWQ29 === "string") {
    data.solidWaste.SWQ29 = {
      answers: data.solidWaste.SWQ29 !== "No",
      type: data.solidWaste.SWQ29 !== "No" ? data.solidWaste.SWQ29 : "",
    };
  }

  // Transform wasteManagement to object for UI if it's in legacy format
  if (data.wasteManagement && typeof data.wasteManagement === "string") {
    data.wasteManagement = { types: [data.wasteManagement] };
  } else if (data.wasteManagement && data.wasteManagement.type && !data.wasteManagement.types) {
    // Handle another possible legacy format
    data.wasteManagement = { types: [data.wasteManagement.type] };
  }
  
  if (!data.wasteManagement) {
    data.wasteManagement = { types: [] };
  } else if (!data.wasteManagement.types) {
    data.wasteManagement.types = [];
  }

  return data;
};

export const transformFormDataToApi = (values) => {
  const payload = {
    Basic: values.Basic,
    hospitalData: values.hospitalData,
    Laundry: values.laundry,
    kitchenWasteManagement: values.kitchenWasteManagement,
    wasteManagement: {
      types: values.wasteManagement?.types || []
    },
    physiotherapy: values.physiotherapy,
    salesPersonName: values.salesPersonName,
    anyOtherInformation: values.anyOtherInformation,
  };

  const selectedTypes = values.wasteManagement?.types || [];

  if (selectedTypes.includes("biomedical")) {
    payload.bioMedicalWaste = values.bioMedicalWaste;
  }
  if (selectedTypes.includes("solid")) {
    payload.solidWaste = {
      ...values.solidWaste,
    };
  }
  if (selectedTypes.includes("water")) {
    payload.wasteWaterManagement = values.wasteWaterManagement;
  }

  return payload;
};
