import * as Yup from "yup";

// helpers
const formatArrayToString = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").replace(/^"|"$/g, ""))
      .filter(Boolean)
      .join(", ");
  }
  return String(value ?? "");
};

const toYMD = (dateLike) => {
  if (!dateLike) return "";
  try {
    const d = new Date(dateLike);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

//Ensure an array of at least 3 strings for professionalAspirations
const normalizeAspirations = (src) => {
  let arr = [];
  if (Array.isArray(src)) arr = src.map((s) => String(s ?? ""));
  else if (typeof src === "string") arr = src.split(",").map((s) => s.trim());
  while (arr.length < 3) arr.push("");
  return arr.slice(0, 3);
};

//validation schema
export const validationSchema = Yup.object().shape({
  // Common (always required)
  department: Yup.string().required("Department is required"),
  designation: Yup.string().required("Designation is required"),
  salutation: Yup.string().required("Salutation is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date().required("Date of Birth is required"),
  anniversary: Yup.date().required("Anniversary is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  profileOfCustomer: Yup.string().required(
    "Profile of the Customers is required"
  ),
  typeOfProfile: Yup.string().required("Type of Profile is required"),

  medicalSchool: Yup.string().required("Medical School is required"),
  graduationYear: Yup.number()
    .typeError("Graduation Year must be a number")
    .required("Graduation Year is required"),
  continuingEducationAndTraining: Yup.string().required(
    "Continuing Education and Training is required"
  ),
  professionalAssociationsMemberships: Yup.string().required(
    "Professional Associations Memberships is required"
  ),
  postGraduationYear: Yup.number()
    .typeError("Post Graduation Year must be a number")
    .required("Post Graduation Year is required"),
  landmark: Yup.string().required("Landmark is required"),
  officeAddress: Yup.string().required("Office Address is required"),
  employeeStatus: Yup.string().required("Employee Status is required"),
  profile: Yup.string().required("Profile is required"),

  instagramURL: Yup.string()
    .url("Invalid URL")
    .required("Instagram URL is required"),
  facebookURL: Yup.string()
    .url("Invalid URL")
    .required("Facebook URL is required"),
  linkedInURL: Yup.string().url("Invalid URL"),
  websiteURL: Yup.string()
    .url("Invalid URL")
    .required("Website URL is required"),

  emailAddress1: Yup.string()
    .email("Invalid email")
    .required("Email Address 1 is required"),
  emailAddress2: Yup.string()
    .email("Invalid email")
    .required("Email Address 2 is required"),
  phoneNumber1: Yup.string().required("Phone Number 1 is required"),
  phoneNumber2: Yup.string().required("Phone Number 2 is required"),

  // for Salutation is Dr
  qualificationSpeciality: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Qualification Speciality is required"),
    otherwise: (s) => s.notRequired(),
  }),
  additionalQualification: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Qualification is required"),
    otherwise: (s) => s.notRequired(),
  }),
  speciality: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Speciality is required"),
    otherwise: (s) => s.notRequired(),
  }),
  surgeryTime: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("SurgeryTime is required"),
    otherwise: (s) => s.notRequired(),
  }),
  surgeryDay: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Surgery Day is required"),
    otherwise: (s) => s.notRequired(),
  }),
  OPDTime: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("OPD Time is required"),
    otherwise: (s) => s.notRequired(),
  }),
  OPDDay: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("OPD Day is required"),
    otherwise: (s) => s.notRequired(),
  }),
  typeofSpeciality: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Type of Speciality is required"),
    otherwise: (s) => s.notRequired(),
  }),
  affiliatedHospitalsOrganizations: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Affiliated Hospitals/Organisations is required"),
    otherwise: (s) => s.notRequired(),
  }),
  roboticSurgery: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Robotic Surgery is required"),
    otherwise: (s) => s.notRequired(),
  }),
  labSurgery: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Lab Surgery is required"),
    otherwise: (s) => s.notRequired(),
  }),
  openSurgery: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Open Surgery is required"),
    otherwise: (s) => s.notRequired(),
  }),
  typeofSurgeriesPerformed: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Type of Surgeries Performed is required"),
    otherwise: (s) => s.notRequired(),
  }),
  noofPatientsInAYear: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Number of Patients in a Year is required"),
    otherwise: (s) => s.notRequired(),
  }),
  productToBePromoted: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Product to be Promoted is required"),
    otherwise: (s) => s.notRequired(),
  }),
  publishedAnyClinicalStudies: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Published Any Clinical Studies is required"),
    otherwise: (s) => s.notRequired(),
  }),
  associatedOrganizations: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Associated Organization is required"),
    otherwise: (s) => s.notRequired(),
  }),
  interestedInFutureWebinarsorEducationalMaterials: Yup.string().when(
    "salutation",
    {
      is: (v) => v === "Dr",
      then: (s) =>
        s.required("Interested in Future Webinars/Education is required"),
      otherwise: (s) => s.notRequired(),
    }
  ),
  category: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Category is required"),
    otherwise: (s) => s.notRequired(),
  }),
  visitForEachCategory: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Visit for Each Category is required"),
    otherwise: (s) => s.notRequired(),
  }),
  professionalAspirations: Yup.array()
    .of(Yup.string().required("This field is required"))
    .min(3, "Provide all three aspirations")
    .when("salutation", {
      is: (v) => v === "Dr",
      then: (s) => s.required("Professional Aspirations are required"),
      otherwise: (s) => s.notRequired(),
    }),
  hobbies: Yup.string().when("salutation", {
    is: (v) => v === "Dr",
    then: (s) => s.required("Hobbies is required"),
    otherwise: (s) => s.notRequired(),
  }),

  //  for Salutation is not Dr
  ifProfileOthers: Yup.string().when("salutation", {
    is: (v) => v !== "Dr",
    then: (s) => s.required("If Profile Others is required"),
    otherwise: (s) => s.notRequired(),
  }),
  noOfPatientsInYear: Yup.string().when("salutation", {
    is: (v) => v !== "Dr",
    then: (s) => s.required("Number of Patients in a Year is required"),
    otherwise: (s) => s.notRequired(),
  }),
  interestedInWebinars: Yup.string().when("salutation", {
    is: (v) => v !== "Dr",
    then: (s) => s.required("Interested in Webinars is required"),
    otherwise: (s) => s.notRequired(),
  }),
  publishedStudies: Yup.string().when("salutation", {
    is: (v) => v !== "Dr",
    then: (s) => s.required("Published Studies is required"),
    otherwise: (s) => s.notRequired(),
  }),
  targetOfVisitForYear: Yup.string().when("salutation", {
    is: (v) => v !== "Dr",
    then: (s) => s.required("Target of Visit for Year is required"),
    otherwise: (s) => s.notRequired(),
  }),
  achievementOfVisitsForYear: Yup.string().when("salutation", {
    is: (v) => v !== "Dr",
    then: (s) => s.required("Achievement of Visits for Year is required"),
    otherwise: (s) => s.notRequired(),
  }),
});

// initial values
export const initialValues = {
  department: "",
  designation: "",
  salutation: "",
  gender: "",
  dob: "",
  anniversary: "",
  firstName: "",
  lastName: "",
  profileOfCustomer: "",
  typeOfProfile: "",

  medicalSchool: "",
  graduationYear: "",
  continuingEducationAndTraining: "",
  professionalAssociationsMemberships: "",
  postGraduationYear: "",
  landmark: "",
  officeAddress: "",
  employeeStatus: "",
  qualificationSpeciality: "",
  additionalQualification: "",
  profile: "",
  speciality: "",

  instagramURL: "",
  facebookURL: "",
  linkedInURL: "",
  websiteURL: "",
  emailAddress1: "",
  emailAddress2: "",
  phoneNumber1: "",
  phoneNumber2: "",

  surgeryTime: "",
  surgeryDay: "",
  OPDTime: "",
  OPDDay: "",
  typeofSpeciality: "",
  affiliatedHospitalsOrganizations: "",

  preferredContactSlots: [{ day: "", time: "" }],

  roboticSurgery: "",
  labSurgery: "",
  openSurgery: "",
  typeofSurgeriesPerformed: "",
  noofPatientsInAYear: "",
  productToBePromoted: "",
  publishedAnyClinicalStudies: "",
  associatedOrganizations: "",
  interestedInFutureWebinarsorEducationalMaterials: "",
  category: "",
  visitForEachCategory: "",

  professionalAspirations: ["", "", ""],
  hobbies: "",

  // Non-Dr
  ifProfileOthers: "",
  noOfPatientsInYear: "",
  interestedInWebinars: "",
  publishedStudies: "",
  targetOfVisitForYear: "",
  achievementOfVisitsForYear: "",

  anyOtherInformation: "",
};

export const transformApiDataToForm = (apiData) => {
  if (!apiData) return initialValues;

  return {
    department: apiData?.department || "",
    designation: apiData?.designation || "",
    salutation: (apiData?.salutation || "").replace(".", ""),
    gender: apiData?.gender || "",
    dob: toYMD(apiData?.dob),
    anniversary: toYMD(apiData?.anniversary),
    firstName: apiData?.firstName || "",
    lastName: apiData?.lastName || "",

    profileOfCustomer: apiData?.profileOfCustomer || "",
    typeOfProfile: apiData?.typeOfProfile || "",

    medicalSchool: apiData?.medicalSchool || "",
    graduationYear: apiData?.graduationYear ?? "",
    continuingEducationAndTraining: apiData?.continuingEducation || "",
    professionalAssociationsMemberships:
      apiData?.professionalAssociations || "",
    postGraduationYear: apiData?.postGraduationYear ?? "",
    landmark: apiData?.landmark || "",
    officeAddress: apiData?.officeAddress || "",
    employeeStatus: apiData?.employmentStatus || "",
    qualificationSpeciality: apiData?.qualificationSpeciality || "",

    additionalQualification: Array.isArray(apiData?.additionalQualification)
      ? apiData.additionalQualification.filter(Boolean).join(", ")
      : apiData?.additionalQualification || "",
    profile: apiData?.profile || "",
    speciality: apiData?.speciality || "",

    instagramURL: apiData?.instagramUrl || "",
    facebookURL: apiData?.facebookUrl || "",
    linkedInURL: apiData?.linkedInUrl || "",
    websiteURL: apiData?.websiteUrl || "",
    emailAddress1: apiData?.emailAddress1 || "",
    emailAddress2: apiData?.emailAddress2 || "",
    phoneNumber1: apiData?.phoneNumber1 || "",
    phoneNumber2: apiData?.phoneNumber2 || "",

    surgeryTime: apiData?.surgeryTime || "",
    surgeryDay: apiData?.surgeryDays || "",
    OPDTime: apiData?.opdTime || "",
    OPDDay: apiData?.opdDays || "",
    typeofSpeciality: apiData?.typeOfSpeciality || "",
    affiliatedHospitalsOrganizations: formatArrayToString(
      apiData?.affiliatedOrganizations || ""
    ),

    roboticSurgery: apiData?.roboticSurgery || "",
    labSurgery: apiData?.lapSurgery || "",
    openSurgery: apiData?.openSurgery || "",
    typeofSurgeriesPerformed: formatArrayToString(
      apiData?.typeOfSurgeriesPerformed || ""
    ),

    // Dr vs Non-Dr counts (both mapped for compatibility)
    noofPatientsInAYear: apiData?.numberOfPatientsPerYear || "",
    noOfPatientsInYear: apiData?.numberOfPatientsPerYear || "",

    productToBePromoted: apiData?.productsToBePromoted || "",
    publishedAnyClinicalStudies: apiData?.publishedClinicalStudies || "",

    // if array, you can join; here we join to keep a single input
    associatedOrganizations: Array.isArray(apiData?.associatedOrganizations)
      ? apiData.associatedOrganizations.filter(Boolean).join(", ")
      : apiData?.associatedOrganizations || "",

    interestedInFutureWebinarsorEducationalMaterials:
      apiData?.interestedInWebinars || "",
    category: apiData?.category || "",
    visitForEachCategory: apiData?.visitForEachCategory || "",

    professionalAspirations: [
      apiData?.professionalAspirations1 || "",
      apiData?.professionalAspirations2 || "",
      apiData?.professionalAspirations3 || "",
    ],

    hobbies: formatArrayToString(apiData?.hobbies || ""),

    // Non-Dr fields
    ifProfileOthers: apiData?.ifProfileOthers || "",
    interestedInWebinars: apiData?.interestedInWebinars || "",
    publishedStudies: apiData?.publishedClinicalStudies || "",
    targetOfVisitForYear: apiData?.targetVisitsForYear || "",
    achievementOfVisitsForYear: apiData?.achievementsOfVisitsForYear || "",

    anyOtherInformation: apiData?.anyOtherInformation || "",
  };
};

export { formatArrayToString };
