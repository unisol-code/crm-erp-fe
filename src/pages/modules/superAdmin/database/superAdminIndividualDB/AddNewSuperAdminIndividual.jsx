import { useEffect, useState } from "react";
import EnviroIndivualform from "./enviroIndiviualform/EnviroIndivualform";
import AddNewIndividualform from "./AddNewIndividualform";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useParams } from "react-router-dom";
import useCompany from "../../../../../hooks/common/useCompany";

const AddNewSuperAdminIndividual = () => {
  const [loading, setLoading] = useState(true);
  const { isEnviroSolution } = useCompany();
  const { id } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoaderSpinner />
        <BreadCrumb
          linkText={[
            { text: "Database" },
            { text: "Individual Database", href: "/database" },
            ...(id
              ? [
                {
                  text: "View Individual",
                  href: `/database/view-newindividual/${id}`,
                },
                { text: "Edit Individual" },
              ]
              : [{ text: "Add New Individual" }]),
          ]}
        />
      </div>
    );
  }

  return isEnviroSolution ? <EnviroIndivualform /> : <AddNewIndividualform />;
};

export default AddNewSuperAdminIndividual;
