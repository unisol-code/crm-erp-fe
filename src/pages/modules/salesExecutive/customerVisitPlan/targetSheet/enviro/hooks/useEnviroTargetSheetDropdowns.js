import { useEffect, useMemo } from "react";

import useDropdown from "../../../../../../../hooks/dropdown/useDropdown";
import useEnviroIndividualDrop from "../../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroIndividualDrop";
import {
  mapCityOptions,
  mapIndividualOptions,
  mapOrganizationOptions,
  mapProductOptions,
  mapProductTypeOptions,
  mapStringOptions,
  buildYearOptions,
  toArray,
} from "../components/EnviroFormUI";

/**
 * =========================================================
 *  ENVIRO SOLUTION — TARGET SHEET DROPDOWNS
 * ---------------------------------------------------------
 *  Single place that wires every dropdown API used by the
 *  EnviroSolution target sheet forms, so the product / project /
 *  service forms all behave identically:
 *
 *    Section (segment)      -> fetchSegment()
 *                              enviroindiviualdropdown(section)
 *    Profile Type           -> enviroindiviualdropdown(section)
 *    Organization           -> fetchEnviroOrganizationName(section)
 *    Individual             -> fetchEnviroIndDropdown(section, profileType)
 *                              fetchOrganizationWiseIndividuals({ organization, city })
 *    Product / Product Type -> fetchProductsNames() / fetchProductTypes()
 *    City                   -> fetchCityNames()
 * =========================================================
 */
const useEnviroTargetSheetDropdowns = ({
  organization = "",
  city = "",
  segment = "",
  profileType = "",
} = {}) => {
  const {
    loading: dropdownLoading,
    fetchSegment,
    segment: segmentList,
    enviroindiviualdropdown,
    enviroprofile,
    fetchProductsNames,
    productList,
    fetchProductTypes,
    productTypes,
    fetchCityNames,
    cityNames,
    fetchOrganizationWiseIndividuals,
    organizationWiseIndividuals,
    fetchProductDetails,
    productDetails,
    resetProductDetails,
  } = useDropdown();

  const {
    fetchEnviroOrganizationName,
    fetchEnviroIndDropdown,
    enviroOrganizationName,
    enviroIndDropdown,
    loading: enviroDropLoading,
  } = useEnviroIndividualDrop();

  const loading = dropdownLoading || enviroDropLoading;

  /* ---------------------------------------------------------
     INITIAL API CALLS
  --------------------------------------------------------- */
  useEffect(() => {
    fetchSegment();
    enviroindiviualdropdown();
    fetchProductsNames();
    fetchProductTypes();
    fetchCityNames();
    fetchEnviroOrganizationName();
    fetchEnviroIndDropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------
     SECTION (SEGMENT) CHANGES
     - profile types are section specific
     - organizations are section specific
  --------------------------------------------------------- */
  useEffect(() => {
    if (segment) {
      enviroindiviualdropdown(segment);
      fetchEnviroOrganizationName(segment);
    } else {
      enviroindiviualdropdown();
      fetchEnviroOrganizationName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  /* ---------------------------------------------------------
     PROFILE TYPE CHANGES -> refresh the individual dropdown
  --------------------------------------------------------- */
  useEffect(() => {
    fetchEnviroIndDropdown(segment, profileType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment, profileType]);

  /* ---------------------------------------------------------
     ORGANIZATION CHANGES -> fetch the individuals of that
     organization (used as the individual list fallback and to
     resolve the organization city).
  --------------------------------------------------------- */
  useEffect(() => {
    if (!organization) return;
    fetchOrganizationWiseIndividuals({ organization, city: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  /* ---------------------------------------------------------
     OPTION LISTS
  --------------------------------------------------------- */
  const segmentOptions = useMemo(
    () => mapStringOptions(segmentList),
    [segmentList]
  );

  const profileTypeOptions = useMemo(
    () => mapStringOptions(enviroprofile),
    [enviroprofile]
  );

  const organizationOptions = useMemo(
    () => mapOrganizationOptions(enviroOrganizationName),
    [enviroOrganizationName]
  );

  /**
   * Individuals come from the EnviroSolution individual dropdown.
   * The organization-wise individuals are merged in as well, so an
   * individual that is linked to the selected organization is always
   * selectable even when the enviro dropdown is filtered by a
   * section / profile type that does not contain it.
   */
  const individualOptions = useMemo(() => {
    const enviroOptions = mapIndividualOptions(enviroIndDropdown);
    const orgOptions = mapIndividualOptions(organizationWiseIndividuals);

    const merged = [...enviroOptions];
    orgOptions.forEach((option) => {
      const exists = merged.some(
        (existing) =>
          existing.value === option.value ||
          (option.uniqueCode &&
            existing.uniqueCode === option.uniqueCode)
      );
      if (!exists) merged.push(option);
    });

    return merged;
  }, [enviroIndDropdown, organizationWiseIndividuals]);

  const productOptions = useMemo(
    () => mapProductOptions(productList),
    [productList]
  );

  const productTypeOptions = useMemo(
    () => mapProductTypeOptions(productTypes),
    [productTypes]
  );

  const cityOptions = useMemo(() => mapCityOptions(cityNames), [cityNames]);

  const yearOptions = useMemo(() => buildYearOptions(), []);

  return {
    loading,
    segmentOptions,
    profileTypeOptions,
    organizationOptions,
    individualOptions,
    productOptions,
    productTypeOptions,
    cityOptions,
    yearOptions,
    /* raw payloads, useful when a form needs a field that is not
       part of the shared option mappers */
    raw: {
      segment: toArray(segmentList),
      enviroprofile: toArray(enviroprofile),
      enviroOrganizationName: toArray(enviroOrganizationName),
      enviroIndDropdown: toArray(enviroIndDropdown),
      organizationWiseIndividuals: toArray(organizationWiseIndividuals),
      productList: toArray(productList),
      productTypes: toArray(productTypes),
      cityNames: toArray(cityNames),
    },
    fetchProductDetails,
    productDetails,
    resetProductDetails,
  };
};

export default useEnviroTargetSheetDropdowns;
