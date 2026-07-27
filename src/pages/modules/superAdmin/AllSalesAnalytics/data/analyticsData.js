// data/analyticsData.js

export const COLORS = ["#C6693C", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

export const DISTRICTS = [
  { district: "Mumbai", value: 320 },
  { district: "Pune", value: 280 },
  { district: "Nagpur", value: 210 },
  { district: "Thane", value: 180 },
  { district: "Nashik", value: 150 }
];

export const EXECUTIVES = [
  { id: "e1", name: "Priya Sharma", planned: 120, completed: 108, achievement: 90, leads: 45 },
  { id: "e2", name: "Rahul Joshi", planned: 110, completed: 92, achievement: 84, leads: 38 },
  { id: "e3", name: "Sneha Patil", planned: 100, completed: 82, achievement: 82, leads: 32 },
  { id: "e4", name: "Vikram Singh", planned: 95, completed: 68, achievement: 72, leads: 28 },
  { id: "e5", name: "Ananya Reddy", planned: 88, completed: 60, achievement: 68, leads: 22 }
];

export const HOSPITALS = [
  { id: "h1", name: "Kingsway Hospital", city: "Nagpur", state: "Maharashtra", totalBeds: 450, totalICUBeds: 80, totalOT: 12, specialityCount: 18, visits: 156, leads: 42, achievement: 92, district: "Nagpur" },
  { id: "h2", name: "Ruby Hall Clinic", city: "Pune", state: "Maharashtra", totalBeds: 380, totalICUBeds: 65, totalOT: 10, specialityCount: 15, visits: 142, leads: 38, achievement: 88, district: "Pune" },
  { id: "h3", name: "Sahyadri Hospital", city: "Nashik", state: "Maharashtra", totalBeds: 320, totalICUBeds: 55, totalOT: 8, specialityCount: 12, visits: 128, leads: 35, achievement: 85, district: "Nashik" },
  { id: "h4", name: "Wockhardt Hospital", city: "Mumbai", state: "Maharashtra", totalBeds: 500, totalICUBeds: 90, totalOT: 14, specialityCount: 20, visits: 168, leads: 48, achievement: 78, district: "Mumbai" },
  { id: "h5", name: "Orange City Hospital", city: "Nagpur", state: "Maharashtra", totalBeds: 280, totalICUBeds: 45, totalOT: 7, specialityCount: 10, visits: 98, leads: 28, achievement: 72, district: "Nagpur" },
  { id: "h6", name: "Apollo Hospital", city: "Mumbai", state: "Maharashtra", totalBeds: 420, totalICUBeds: 75, totalOT: 11, specialityCount: 17, visits: 145, leads: 40, achievement: 65, district: "Mumbai" },
  { id: "h7", name: "Jaslok Hospital", city: "Mumbai", state: "Maharashtra", totalBeds: 350, totalICUBeds: 60, totalOT: 9, specialityCount: 14, visits: 132, leads: 36, achievement: 70, district: "Mumbai" },
  { id: "h8", name: "Deenanath Mangeshkar", city: "Pune", state: "Maharashtra", totalBeds: 400, totalICUBeds: 70, totalOT: 13, specialityCount: 16, visits: 155, leads: 44, achievement: 89, district: "Pune" }
];

export const PRODUCTS = [
  { name: "Laproscopic Set", category: "OT", value: 180, price: 25000 },
  { name: "Urology Kit", category: "Urology", value: 145, price: 32000 },
  { name: "ICU Monitor", category: "ICU", value: 120, price: 45000 },
  { name: "Surgical Sutures", category: "Consumables", value: 95, price: 15000 },
  { name: "Diagnostic Reagent", category: "Diagnostics", value: 75, price: 28000 },
  { name: "Endoscopy Equipment", category: "OT", value: 65, price: 55000 },
  { name: "Catheter Set", category: "Urology", value: 50, price: 18000 }
];

export const SPECIALITIES = [
  { name: "General Surgery", value: 104 },
  { name: "Urology", value: 78 },
  { name: "Cardiology", value: 62 },
  { name: "Neurology", value: 45 },
  { name: "Orthopedics", value: 38 }
];

export const TARGETS = {
  monthlyTarget: 280000,
  monthlyAchieved: 229000,
  yearlyTarget: 3400000,
  yearlyAchieved: 2100000
};

export const KPIS = [
  { key: "hospitals", title: "Hospitals", value: "128", trend: 14, accent: "info", icon: "Building2" },
  { key: "doctors", title: "Active Doctors", value: "486", trend: 9, accent: "product", icon: "Stethoscope" },
  { key: "visits", title: "Monthly Visits", value: "1,284", trend: 12, accent: "success", icon: "Activity" },
  { key: "achievement", title: "Target Achievement", value: "82%", trend: 8, accent: "target", icon: "Target" }
];

export const FUNNEL = [
  { stage: "Awareness", value: 2400 },
  { stage: "Interest", value: 1200 },
  { stage: "Evaluation", value: 720 },
  { stage: "Decision", value: 380 },
  { stage: "Adoption", value: 180 }
];

export const MONTHLY_TREND = [
  { month: "Jan", visits: 180, leads: 45 },
  { month: "Feb", visits: 200, leads: 52 },
  { month: "Mar", visits: 220, leads: 58 },
  { month: "Apr", visits: 250, leads: 62 },
  { month: "May", visits: 270, leads: 68 },
  { month: "Jun", visits: 300, leads: 75 }
];

export const MONTHLY_ACHIEVEMENT = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 72 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 82 },
  { month: "May", value: 86 },
  { month: "Jun", value: 92 }
];

// Doctor Data
export const D_STATES = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu"];
export const D_CITIES = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"];
export const D_SPECIALITIES = ["General Surgery", "Urology", "Cardiology", "Neurology", "Orthopedics", "ENT", "Ophthalmology", "Dermatology"];
export const D_SEGMENTS = ["Tier 1", "Tier 2", "Tier 3", "Government", "Private"];
export const D_SALES = ["Priya Sharma", "Rahul Joshi", "Sneha Patil", "Vikram Singh", "Ananya Reddy"];
export const D_PRODUCTS = ["Laproscopic Set", "Urology Kit", "ICU Monitor", "Surgical Sutures", "Diagnostic Reagent", "Endoscopy Equipment", "Catheter Set"];

export const DOCTORS = [
  { id: "d1", doctorName: "Dr. Amit Kumar", city: "Mumbai", state: "Maharashtra", speciality: "General Surgery", segment: "Tier 1", salesPerson: "Priya Sharma", productName: "Laproscopic Set", target: 120, achievement: 92, productStatus: "Complete", qualityScore: 95, profile: "Senior Consultant", designation: "HOD", price: 25000 },
  { id: "d2", doctorName: "Dr. Neha Reddy", city: "Pune", state: "Maharashtra", speciality: "Urology", segment: "Tier 2", salesPerson: "Rahul Joshi", productName: "Urology Kit", target: 100, achievement: 85, productStatus: "Complete", qualityScore: 88, profile: "Consultant", designation: "Senior Urologist", price: 32000 },
  { id: "d3", doctorName: "Dr. Sanjay Patel", city: "Nagpur", state: "Maharashtra", speciality: "Cardiology", segment: "Tier 1", salesPerson: "Sneha Patil", productName: "ICU Monitor", target: 90, achievement: 78, productStatus: "Incomplete", qualityScore: 72, profile: "Senior Consultant", designation: "Interventional Cardiologist", price: 45000 },
  { id: "d4", doctorName: "Dr. Meera Shah", city: "Nashik", state: "Maharashtra", speciality: "Neurology", segment: "Tier 3", salesPerson: "Vikram Singh", productName: "Surgical Sutures", target: 75, achievement: 65, productStatus: "Complete", qualityScore: 68, profile: "Associate Consultant", designation: "Neurologist", price: 15000 },
  { id: "d5", doctorName: "Dr. Rajesh Sharma", city: "Mumbai", state: "Maharashtra", speciality: "General Surgery", segment: "Private", salesPerson: "Priya Sharma", productName: "Endoscopy Equipment", target: 110, achievement: 88, productStatus: "Complete", qualityScore: 82, profile: "Senior Consultant", designation: "Minimal Access Surgeon", price: 55000 },
  { id: "d6", doctorName: "Dr. Priya Iyer", city: "Pune", state: "Maharashtra", speciality: "Orthopedics", segment: "Tier 2", salesPerson: "Ananya Reddy", productName: "Diagnostic Reagent", target: 85, achievement: 56, productStatus: "Incomplete", qualityScore: 55, profile: "Consultant", designation: "Orthopedic Surgeon", price: 28000 },
  { id: "d7", doctorName: "Dr. Deepak Kumar", city: "Nagpur", state: "Maharashtra", speciality: "Urology", segment: "Tier 1", salesPerson: "Rahul Joshi", productName: "Catheter Set", target: 95, achievement: 80, productStatus: "Complete", qualityScore: 75, profile: "Senior Consultant", designation: "Uro-oncologist", price: 18000 },
  { id: "d8", doctorName: "Dr. Kavita Singh", city: "Thane", state: "Maharashtra", speciality: "ENT", segment: "Tier 2", salesPerson: "Sneha Patil", productName: "Laproscopic Set", target: 70, achievement: 62, productStatus: "Incomplete", qualityScore: 60, profile: "Consultant", designation: "ENT Specialist", price: 25000 }
];

// Org Data
export const O_DISTRICTS = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"];
export const O_TYPES = ["Government", "Private", "Trust", "Corporate"];

export const ORGS = [
  { id: "o1", organizationName: "Kingsway Hospital", district: "Nagpur", city: "Nagpur", state: "Maharashtra", type: "Private", beds: 450, numberOfSurgeries: 2800, totalSurgeriesCalendarYear: 5600, productTargetMonth: 45000, productTargetQuarter: 135000, productTargetYear: 540000, productAchievement: 92, quantity: 180, price: 25000, hospitalSpeciality: "General Surgery", productStatus: "Complete" },
  { id: "o2", organizationName: "Ruby Hall Clinic", district: "Pune", city: "Pune", state: "Maharashtra", type: "Trust", beds: 380, numberOfSurgeries: 2400, totalSurgeriesCalendarYear: 4800, productTargetMonth: 38000, productTargetQuarter: 114000, productTargetYear: 456000, productAchievement: 88, quantity: 145, price: 32000, hospitalSpeciality: "Cardiology", productStatus: "Complete" },
  { id: "o3", organizationName: "Sahyadri Hospital", district: "Nashik", city: "Nashik", state: "Maharashtra", type: "Private", beds: 320, numberOfSurgeries: 2000, totalSurgeriesCalendarYear: 4000, productTargetMonth: 32000, productTargetQuarter: 96000, productTargetYear: 384000, productAchievement: 85, quantity: 120, price: 45000, hospitalSpeciality: "Neurology", productStatus: "Incomplete" },
  { id: "o4", organizationName: "Wockhardt Hospital", district: "Mumbai", city: "Mumbai", state: "Maharashtra", type: "Corporate", beds: 500, numberOfSurgeries: 3200, totalSurgeriesCalendarYear: 6400, productTargetMonth: 50000, productTargetQuarter: 150000, productTargetYear: 600000, productAchievement: 78, quantity: 95, price: 15000, hospitalSpeciality: "Urology", productStatus: "Complete" },
  { id: "o5", organizationName: "Orange City Hospital", district: "Nagpur", city: "Nagpur", state: "Maharashtra", type: "Private", beds: 280, numberOfSurgeries: 1800, totalSurgeriesCalendarYear: 3600, productTargetMonth: 28000, productTargetQuarter: 84000, productTargetYear: 336000, productAchievement: 72, quantity: 75, price: 28000, hospitalSpeciality: "General Surgery", productStatus: "Incomplete" }
];

export const PENETRATION_FUNNEL = [
  { stage: "Target", value: 500 },
  { stage: "Awareness", value: 400 },
  { stage: "Evaluation", value: 280 },
  { stage: "Adoption", value: 180 },
  { stage: "Loyalty", value: 95 }
];

export const SEGMENTS = ["Tier 1", "Tier 2", "Tier 3", "Government", "Private"];
export const STATES = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Rajasthan", "Delhi"];
export const PRODUCT_CATEGORIES = ["All", "Urology", "OT", "ICU", "Consumables", "Diagnostics"];