// FilterBar.jsx

import React, { useEffect, useMemo, useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import Select from "react-select";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { 
  Button, 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem 
} from '../common';

const MONTHS = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" }
];

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 50; i++) {
    const year = currentYear - i;
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: '0.75rem',
    borderColor: state.isFocused ? 'var(--theme-primary)' : (state.hasValue ? 'var(--theme-primary)' : 'var(--theme-border)'),
    borderWidth: '2px',
    backgroundColor: state.hasValue ? 'var(--theme-bg-light)' : 'white',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(198, 105, 60, 0.2)' : 'none',
    '&:hover': {
      borderColor: 'var(--theme-primary)'
    },
    minHeight: '44px',
    cursor: 'pointer'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--theme-text-secondary)',
    fontSize: '13px'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--theme-text-primary)',
    fontWeight: '500'
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.75rem',
    borderColor: 'var(--theme-border)',
    borderWidth: '1px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    zIndex: 9999
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--theme-primary)' : (state.isFocused ? 'var(--theme-bg-hover)' : 'white'),
    color: state.isSelected ? 'white' : 'var(--theme-text-primary)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: state.isSelected ? 'var(--theme-primary-dark)' : 'var(--theme-bg-hover)'
    },
    padding: '10px 16px'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: 'var(--theme-text-secondary)',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease'
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'var(--theme-text-secondary)',
    cursor: 'pointer',
    '&:hover': {
      color: 'var(--theme-primary)'
    }
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '300px',
    padding: '4px 0'
  })
};

const NoOptionsMessage = ({ message = "No options available" }) => (
  <div className="px-4 py-3 text-sm text-[var(--theme-text-secondary)]">
    {message}
  </div>
);

export function FilterBar({ 
  selectedTab = 'overview',
  loading = false,
  filters = {},
  updateFilter,
  resetFilters,
  onFiltersChange,
}) {
  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef(null);

  const { 
    fetchAllStateName, allStateName,
    fetchDistrictList, districtList,
    fetchAllCities, cities,
    fetchSegment, segment,
    profileState, profile,
    fetchTypeOfProfile, typeOfProfile,
    fetchAllEmployees, employees,
    fetchSpecialityIndividual, getspeciality,
    fetchAllRegion, region,
  } = useDropdown();

  const [selectedStateCode, setSelectedStateCode] = useState(null);

  const stateSelectOptions = useMemo(() => {
    if (!filters.region) return [];
    if (!Array.isArray(allStateName) || allStateName.length === 0) return [];
    return allStateName.map(state => ({
      value: state.name || state,
      label: state.name || state,
      stateCode: state.code,
    }));
  }, [allStateName, filters.region]);

  const districtSelectOptions = useMemo(() => {
    if (!filters.state) return [];
    if (!Array.isArray(districtList) || districtList.length === 0) return [];
    return districtList.map(district => ({
      value: district,
      label: district,
    }));
  }, [districtList, filters.state]);

  const citySelectOptions = useMemo(() => {
    if (!filters.district) return [];
    if (!Array.isArray(cities) || cities.length === 0) return [];
    return cities.map(city => ({
      value: city,
      label: city,
    }));
  }, [cities, filters.district]);

  const segmentSelectOptions = useMemo(() => {
    if (!Array.isArray(segment) || segment.length === 0) return [];
    return segment.map(seg => ({
      value: seg,
      label: seg,
    }));
  }, [segment]);

  const specialitySelectOptions = useMemo(() => {
    if (!Array.isArray(getspeciality) || getspeciality.length === 0) return [];
    return getspeciality.map(spec => ({
      value: spec,
      label: spec,
    }));
  }, [getspeciality]);

  const profileSelectOptions = useMemo(() => {
    if (!Array.isArray(profile) || profile.length === 0) return [];
    return profile.map(prof => ({
      value: prof,
      label: prof,
    }));
  }, [profile]);

  const typeOfProfileSelectOptions = useMemo(() => {
    if (!Array.isArray(typeOfProfile) || typeOfProfile.length === 0) return [];
    return typeOfProfile.map(prof => ({
      value: prof,
      label: prof,
    }));
  }, [typeOfProfile]);

  const salesPersonSelectOptions = useMemo(() => {
    if (!Array.isArray(employees) || employees.length === 0) return [];
    return employees.map(emp => ({
      value: emp.salesPersonName,
      label: emp.salesPersonName,
    }));
  }, [employees]);

  const regionSelectOptions = useMemo(() => {
    if (!Array.isArray(region) || region.length === 0) return [];
    return region.map(item => ({
      value: item,
      label: item,
    }));
  }, [region]);

  useEffect(() => {
    fetchSegment();
    fetchTypeOfProfile();
    fetchAllEmployees();
    fetchSpecialityIndividual();
    fetchAllRegion();
  }, []);

  useEffect(() => {
    if (filters.state) {
      fetchDistrictList(filters.state);
    }
  }, [filters.state]);

  useEffect(() => {
    if (filters.state && filters.district) {
      fetchAllCities(selectedStateCode || filters.state, filters.district);
    }
  }, [filters.state, filters.district]);

  useEffect(() => {
    if (filters.segment) {
      profileState(filters.segment);
    }
  }, [filters.segment]);

  const triggerFetch = () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (onFiltersChange) {
        onFiltersChange(selectedTab);
      }
      isFetchingRef.current = false;
      debounceTimerRef.current = null;
    }, 300);
  };

  const handleSelectChange = (key, selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    if (updateFilter) updateFilter(key, value);

    if (key === "region") {
      setSelectedStateCode("");
      if (updateFilter) {
        updateFilter("state", "");
        updateFilter("district", "");
        updateFilter("city", "");
      }
      fetchAllStateName(value || "");
    }
    if (key === "state") {
      const selectedState = stateSelectOptions.find(opt => opt.value === value);
      setSelectedStateCode(selectedState ? (selectedState.stateCode || selectedState.value) : value);
      if (updateFilter) {
        updateFilter("district", "");
        updateFilter("city", "");
      }
    }
    if (key === "district") {
      if (updateFilter) updateFilter("city", "");
    }
    
    triggerFetch();
  };

  const handleApplyFilters = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    isFetchingRef.current = false;
    
    if (onFiltersChange) {
      onFiltersChange(selectedTab);
    }
  };

  const handleResetFilters = () => {
    if (resetFilters) resetFilters();
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    isFetchingRef.current = false;
    
    setTimeout(() => {
      if (onFiltersChange) {
        onFiltersChange(selectedTab);
      }
    }, 100);
  };

  const getSelectedOption = (item) => {
    if (!item.value) return null;
    return item.options.find(opt => opt.value === item.value) || null;
  };

 const filterItems = [
 
    // { 
    //   key: "month", 
    //   label: "Month",
    //   options: MONTHS,
    //   placeholder: "Select month",
    //   value: filters.month,
    //   isMulti: false,
    //   isSearchable: true
    // },
    // { 
    //   key: "year", 
    //   label: "Year",
    //   options: getYearOptions(),
    //   placeholder: "Select year",
    //   value: filters.year,
    //   isMulti: false,
    //   isSearchable: true
    // },
       { 
      key: "region", 
      label: "Region",
      options: regionSelectOptions,
      placeholder: "All regions",
      value: filters.region,
      isMulti: false,
      isSearchable: true
    },
    { 
      key: "state", 
      label: "State",
      options: stateSelectOptions,
      placeholder: "All states",
      value: filters.state,
      isMulti: false,
      isSearchable: true
    },
    { 
      key: "district", 
      label: "District",
      options: districtSelectOptions,
      placeholder: "All districts",
      value: filters.district,
      isMulti: false,
      isSearchable: true
    },
    { 
      key: "city", 
      label: "City",
      options: citySelectOptions,
      placeholder: "All cities",
      value: filters.city,
      isMulti: false,
      isSearchable: true
    },
    { 
      key: "segment", 
      label: "Segment",
      options: segmentSelectOptions,
      placeholder: "All segments",
      value: filters.segment,
      isMulti: false,
      isSearchable: true
    },
    { 
      key: "speciality", 
      label: "Speciality",
      options: specialitySelectOptions,
      placeholder: "All specialities",
      value: filters.speciality,
      isMulti: false,
      isSearchable: true
    },
    // { 
    //   key: "typeOfDoctorProfile", 
    //   label: "Doctor Profile",
    //   options: profileSelectOptions,
    //   placeholder: "All profiles",
    //   value: filters.typeOfDoctorProfile,
    //   isMulti: false,
    //   isSearchable: true
    // },
    // { 
    //   key: "salesPerson", 
    //   label: "Sales Executive",
    //   options: salesPersonSelectOptions,
    //   placeholder: "All executives",
    //   value: filters.salesPerson,
    //   isMulti: false,
    //   isSearchable: true
    // },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[var(--theme-border)] shadow-md">
      <div className="px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 bg-[var(--theme-primary)]/10 px-3 py-1.5 rounded-lg">
            <LucideIcons.Filter size={18} className="text-[var(--theme-primary)]" />
            <h2 className="text-sm font-semibold text-[var(--theme-text-primary)]">Filters</h2>
          </div>
          <span className="ml-auto flex items-center gap-2">
            {/* {loading && (
              <div className="flex items-center gap-2">
                <LoaderSpinner />
              </div>
            )} */}
            <Button variant="ghost" size="sm" onClick={handleResetFilters} className="rounded-lg text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)]">
              <LucideIcons.RotateCcw size={14} /> Reset
            </Button>
            <Button size="sm" onClick={handleApplyFilters} disabled={loading} className="rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)] text-white shadow-sm shadow-[var(--theme-primary)]/20">
              Apply Filters
            </Button>
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filterItems.map((item) => {
            const selectedOption = getSelectedOption(item);
            const hasValue = item.value && item.value !== "";
            
            return (
              <div key={item.key} className="min-w-0">
                <label className="text-[10px] font-semibold text-[var(--theme-text-muted)] uppercase tracking-wider block mb-1.5">
                  {item.label}
                </label>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={customSelectStyles}
                  options={item.options}
                  value={selectedOption}
                  onChange={(option) => handleSelectChange(item.key, option)}
                  placeholder={item.placeholder}
                  isClearable={true}
                  isSearchable={item.isSearchable}
                  isLoading={loading}
                    noOptionsMessage={() => {
                      if (item.key === 'state') return <NoOptionsMessage message="Select region first" />;
                      if (item.key === 'district') return <NoOptionsMessage message="Select state first" />;
                      if (item.key === 'city') return <NoOptionsMessage message="Select district first" />;
                      return <NoOptionsMessage />;
                    }}
                  components={{ NoOptionsMessage }}
                  formatOptionLabel={({ label, value }) => {
                    if (item.key === 'month') {
                      return <span className="font-medium">{label}</span>;
                    }
                    if (item.key === 'year') {
                      return <span className="font-medium">{label}</span>;
                    }
                    return label;
                  }}
                  getOptionLabel={(option) => {
                    if (item.key === 'month') return option.label;
                    if (item.key === 'year') return option.label;
                    return option.label;
                  }}
                />
                {hasValue && (
                  <div className="mt-1">
                    <span className="text-[10px] font-medium text-[var(--theme-primary)] bg-[var(--theme-bg-light)] px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
