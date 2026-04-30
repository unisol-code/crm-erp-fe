import EnviroCreateLead from "./createLead/EnviroCreateLead";
import CreateLead from "./createLead/CreateLead";
import EnviroTrackLead from "./trackLead/EnviroTrackLead";
import TrackLead from "./trackLead/TrackLead";
import EnviroViewLead from "./viewLead/EnviroViewLead";
import ViewLead from "./viewLead/ViewLead";
import React, { Suspense, useEffect, useState } from "react";
import useCompany from "../../../../hooks/common/useCompany";

const Loading = () => <div>Loading...</div>;

const EnviroCompanyLead = ({ page }) => {
  const { isEnviroSolution } = useCompany();
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    let component;
    switch (page) {
      case "createLead":
      case "editLead":
        component = isEnviroSolution ? EnviroCreateLead : CreateLead;
        break;
      case "trackLead":
        component = isEnviroSolution ? EnviroTrackLead : TrackLead;
        break;
      case "viewLead":
      case "viewLeadById":
        component = isEnviroSolution ? EnviroViewLead : ViewLead;
        break;
      default:
        console.error("Invalid page specified");
        return;
    }

    setComponent(() => component);
  }, [page]);


  return (
    <Suspense fallback={<Loading />}>
      {Component ? <Component /> : <Loading />}
    </Suspense>
  );
};

export default EnviroCompanyLead;