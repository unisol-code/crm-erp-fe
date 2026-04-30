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
      // .min(1, "At least 1 bed is required")
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
});

// Initial values - keep flat structure for form handling
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
  },

  wasteManagement: {
    type: "",
  },

  stp: {
    stpStatus: "",
    yearOfInstallation: "",
    stpCapacity: "",
  },
  etp: {
    etpStatus: "",
    yearOfInstallation: "",
    etpCapacity: "",
  },
  anyOtherInformation: "",
};

// Transform API response data to form format
export const transformApiDataToForm = (apiData) => ({
  Basic: apiData.Basic || initialValues.Basic,
  hospitalData: apiData.hospitalData || initialValues.hospitalData,
  laundry: apiData.Laundry || initialValues.laundry,
  kitchenWasteManagement:
    apiData.kitchenWasteManagement || initialValues.kitchenWasteManagement,
  bioMedicalWaste:
    apiData.bioMedicalWaste || initialValues.bioMedicalWaste,
  solidWaste: apiData.solidWaste || initialValues.solidWaste,
  wasteWaterManagement: apiData.wasteWaterManagement || initialValues.wasteWaterManagement,
  wasteManagement: apiData.wasteManagement || initialValues.wasteManagement,
  stp: apiData.stp || initialValues.stp,
  etp: apiData.etp || initialValues.etp,
  anyOtherInformation: apiData.anyOtherInformation || "",
});

export const transformFormDataToApi = (values) => ({
  Basic: values.Basic,
  hospitalData: values.hospitalData,
  ...values.laundry,
  ...values.kitchenWasteManagement,
  ...values.bioMedicalWaste,
  solidWaste: values.solidWaste,
  wasteWaterManagement: values.wasteWaterManagement,
  wasteManagement: values.wasteManagement,
  stp: values.stp,
  etp: values.etp,
  anyOtherInformation: values.anyOtherInformation,
});
