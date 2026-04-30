import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import TerritorySnapshotChart from "../charts/TerritorySnapshotChart";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import Select from "react-select";

const TerritorySnapshot = () => {
  const { theme } = useTheme();
  const { fetchCityNames, cityNames, fetchSpeciality, speciality } =
    useDropdown();
  const [options, setOptions] = useState([]);


  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  useEffect(() => {
    fetchCityNames();
    fetchSpeciality();
  }, []);


  const cityOptions = useMemo(() => {
    if (!cityNames) return [];
    return cityNames.map((city) => ({ value: city, label: city }));
  }, [cityNames]);

  const specialityOptions = useMemo(() => {
    if (!speciality || !Array.isArray(speciality)) return [];

    return speciality.map((item) => ({
      label: item,
      value: item,
    }));
  }, [speciality]);


  const selectOptions = (options || []).map((opt) =>
    typeof opt === "string"
      ? { label: opt, value: opt }
      : { label: opt.label, value: opt.value }
  );

  const selectedOption =
    selectOptions.find((opt) => opt.value === value) || null;


  return (
    <Card
      elevation={3}
      sx={{
        width: {
          xs: "100%",
          sm: "80%",
          md: "60%",
          lg: "60%",
        },
        mx: "auto",
        borderRadius: 5,
      }}
    >
      <CardHeader
        sx={{
          display: "flex",
          gap: 2,
          background: theme.secondaryColor,
        }}
        title={
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Territory Snapshot
          </Typography>
        }
        action={
          <Box display="flex" gap={1} flexWrap="wrap"
            sx={{
              flexDirection: {
                xs: "column",  // Mobile → stack vertically
                sm: "row",     // Tablet → side by side
              },
              alignItems: {
                xs: "stretch", // full width on mobile
                sm: "center",
              },
            }}>
            <Select
              options={cityOptions}
              value={selectedCity}
              onChange={(selected) => setSelectedCity(selected)}
              placeholder="Select City"
              isClearable
              styles={{
                container: (base) => ({ ...base, minWidth: 120 }),
              }}
            />
            <Select
              options={specialityOptions}
              value={selectedSpeciality}
              onChange={setSelectedSpeciality}
              placeholder="Select Speciality"
              isClearable
              styles={{
                container: (base) => ({ ...base, minWidth: 160 }),
              }}
            />

          </Box>
        }
      />
      <CardContent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          px: 2,
          height: { xs: 300, sm: 350, md: 400 },
        }}
      >
        <TerritorySnapshotChart
          city={selectedCity?.value}
          speciality={selectedSpeciality?.value}
        />
      </CardContent>
    </Card>
  );
};

export default TerritorySnapshot;
