import useCompany from "../../../../../../../hooks/common/useCompany";

/**
 * Guard hook for the EnviroSolution-only target sheet screens.
 *
 * It simply re-exports the shared company detection with the extra
 * `isCompanyLoaded` flag, so the Enviro screens can wait for the
 * sessionStorage read before deciding to show "Access Restricted".
 */
const useEnviroOnly = () => {
  const { companyName, isEnviroSolution, isCompanyLoaded } = useCompany();

  return { companyName, isEnviroSolution, isCompanyLoaded };
};

export default useEnviroOnly;
