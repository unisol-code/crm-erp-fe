import { useEffect, useState } from "react";
import EnviroIndivualform from "../individualDatabase/enviroIndividualform/EnviroIndivualForm";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import AddNewIndividualform from "./AddIndiviualform";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useParams } from "react-router-dom";
import useCompany from "../../../../../hooks/common/useCompany";

const AddEmployeeIndividual = () => {
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
                  href: `/database/view-individual/${id}`,
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

export default AddEmployeeIndividual;
