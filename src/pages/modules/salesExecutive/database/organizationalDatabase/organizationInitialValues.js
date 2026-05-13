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
          surgeries: Yup.array()
            .of(
              Yup.object().shape({
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
    KWMQ2: [],
    KWMQ3: { answers: false },
    KWMQ4: "",
    KWMQ5: [],
    KWMQ6: false,
    KWMQ7: "",
    KWMQ8: "",
    KWMQ9: "",
    KWMQ10: "",
    KWMQ11: "",
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
    SWQ1: "", 
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
    SWQ10: false, 
    SWQ11: "", 
    SWQ12: "", 
    SWQ13: [], 
    SWQ13_OTHER: "",
    SWQ14: [], 
    SWQ15: "", 
    SWQ16: "", 
    SWQ29: {
      answers: false,
      type: "",
    },
    SWQ30: "", 
    SWQ31: "", 
    SWQ31_OTHER: "",
    SWQ32: "", 
    SWQ33: false, 
    SWQ34: false, 
    SWQ35: false, 
    SWQ36: "", 
    SWQ37: "", 
    SWQ60: "", 
    SWQ61: "", 
    SWQ62: "", 
    SWQ63: "", 
    SWQ64: "", 
    SWQ65: "", 
    concernPersons: [{ name: "", contact: "", designation: "" }],
  },

  wasteWaterManagement: {
    WWWQ1: [], 
    WWWQ2: "", 
    WWWQ3: "", 
    WWWQ4: [], 
    WWWQ5: "", 
    WWWQ6: "", 
    WWWQ7: "", 
    WWWQ8: "", 
    WWWQ9: "", 
    WWWQ10: "", 
    WWWQ11: "", 
    WWWQ12: "", 
    WWWQ13: false, 
    WWWQ14: false, 
    WWWQ15: false, 
    WWWQ16: "", 
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
  anyOtherInformation: "",
};

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
    anyOtherInformation: apiData.anyOtherInformation || "",
  };

  if (!data.kitchenWasteManagement.concernPersons) data.kitchenWasteManagement.concernPersons = initialValues.kitchenWasteManagement.concernPersons;
  if (!data.laundry.concernPersons) data.laundry.concernPersons = initialValues.laundry.concernPersons;
  if (!data.bioMedicalWaste.concernPersons) data.bioMedicalWaste.concernPersons = initialValues.bioMedicalWaste.concernPersons;
  if (!data.solidWaste.concernPersons) data.solidWaste.concernPersons = initialValues.solidWaste.concernPersons;
  if (!data.wasteWaterManagement.concernPersons) data.wasteWaterManagement.concernPersons = initialValues.wasteWaterManagement.concernPersons;

  if (data.solidWaste && typeof data.solidWaste.SWQ29 === "string") {
    data.solidWaste.SWQ29 = {
      answers: data.solidWaste.SWQ29 !== "No",
      type: data.solidWaste.SWQ29 !== "No" ? data.solidWaste.SWQ29 : "",
    };
  }

  if (data.wasteManagement && typeof data.wasteManagement === "string") {
    data.wasteManagement = { types: [data.wasteManagement] };
  } else if (data.wasteManagement && data.wasteManagement.type && !data.wasteManagement.types) {
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
