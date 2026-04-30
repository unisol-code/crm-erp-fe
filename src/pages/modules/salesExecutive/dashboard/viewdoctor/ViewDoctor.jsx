import React, { useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
  Grid,
  Chip,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { DownArrowIcon } from "../../../../../assets/CommonAssets";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import StarIcon from "@mui/icons-material/Star";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import useDashboard from "../../../../../hooks/salesExecutiveHook/dashboard/useDashboard";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

function ViewDoctor() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { fetchPriorDoctorsById, priorDoctorsById, loading } = useDashboard();
  const { id } = useParams();
  const chartRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchPriorDoctorsById(id);
    }
  }, [id]);

  const calculatePercentage = (achieved, target) => {
    if (!target || target === 0) return 0;
    return Math.round((achieved / target) * 100);
  };

  const visitPercentage = calculatePercentage(
    priorDoctorsById?.visitAchievement || 0,
    priorDoctorsById?.visitTarget || 100
  );

  const handleExport = async () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Doctor Details", 14, 20);

      // Add doctor information
      doc.setFontSize(12);
      doc.text(`Name: ${priorDoctorsById?.doctorName || "N/A"}`, 14, 30);
      doc.text(`Speciality: ${priorDoctorsById?.speciality || "N/A"}`, 14, 36);
      doc.text(`Category: ${priorDoctorsById?.category || "N/A"}`, 14, 42);
      doc.text(`Phone: ${priorDoctorsById?.phoneNumber || "N/A"}`, 14, 48);
      doc.text(`Email: ${priorDoctorsById?.email || "N/A"}`, 14, 54);

      // Add hospital affiliations
      doc.text("Hospital Affiliations:", 14, 66);

      if (priorDoctorsById?.hospitals?.length > 0) {
        const hospitalData = priorDoctorsById.hospitals.map((hospital) => [
          hospital,
        ]);

        autoTable(doc, {
          startY: 70,
          head: [["Hospital Name"]],
          body: hospitalData,
          theme: "grid",
          headStyles: {
            fillColor: [
              parseInt(theme.primaryColor.slice(1, 3), 16),
              parseInt(theme.primaryColor.slice(3, 5), 16),
              parseInt(theme.primaryColor.slice(5, 7), 16),
            ],
            textColor: [255, 255, 255],
          },
        });
      } else {
        doc.text("No hospital affiliations", 14, 70);
      }

      // Add visit performance
      const performanceY = doc.lastAutoTable?.finalY
        ? doc.lastAutoTable.finalY + 10
        : 80;
      doc.text("Visit Performance:", 14, performanceY);
      doc.text(
        `Target: ${priorDoctorsById?.visitTarget || 0}`,
        14,
        performanceY + 6
      );
      doc.text(
        `Achieved: ${priorDoctorsById?.visitAchievement || 0}`,
        14,
        performanceY + 12
      );
      doc.text(`Completion: ${visitPercentage}%`, 14, performanceY + 18);

      // Convert chart to image and add to PDF
      if (chartRef.current) {
        try {
          const chartImage = await toPng(chartRef.current);
          const imageY = performanceY + 24;
          doc.addImage(chartImage, "PNG", 14, imageY, 180, 60);
        } catch (imageError) {
          console.error("Error converting chart to image:", imageError);
        }
      }

      doc.save(`${priorDoctorsById?.doctorName || "doctor"}_details.pdf`);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <LoaderSpinner />
      </Box>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Dashboard", href: "/sales-executive/dashboard" },
          {
            text: "High Priority Doctors List",
            href: "/sales-executive/viewhighprioritydoctor",
          },
          { text: "View Doctor" },
        ]}
      />
      <Card
        elevation={3}
        sx={{
          width: "100%",
          borderRadius: 5,
          py: 0,
          px: 3,
          mb: 4,
        }}
      >
        <CardHeader
          sx={{
            borderBottom: "4px solid",
            borderColor: theme.secondaryColor,
            py: 2,
            px: 0,
          }}
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() =>
                  navigate("/sales-executive/viewhighprioritydoctor")
                }
                sx={{
                  mr: 1,
                  color: theme.primaryColor,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Avatar
                sx={{ bgcolor: theme.primaryColor, width: 50, height: 50 }}
              >
                {priorDoctorsById?.doctorName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {priorDoctorsById?.doctorName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {priorDoctorsById?.speciality}
                </Typography>
              </Box>
            </Box>
          }
          action={
            <Box
              sx={{
                width: "114.20px",
                background: theme.primaryColor,
                borderRadius: "8.98px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                padding: "6px",
                boxSizing: "border-box",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.secondaryColor,
                },
              }}
              onClick={handleExport}
            >
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontSize: "16.96px",
                }}
              >
                Export
              </Typography>
              <DownArrowIcon color="#FFFFFF" />
            </Box>
          }
        />

        <CardContent sx={{ px: 0 }}>
          <Grid container spacing={4}>
            {/* Doctor Basic Info */}
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: theme.primaryColor }}
                >
                  Doctor Information
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Chip
                    label={`Category ${priorDoctorsById?.category || "N/A"}`}
                    size="small"
                    sx={{
                      backgroundColor:
                        priorDoctorsById?.category === "A"
                          ? "#4caf50"
                          : "#ff9800",
                      color: "white",
                    }}
                    icon={<StarIcon fontSize="small" />}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {priorDoctorsById?.phoneNumber || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {priorDoctorsById?.email || "N/A"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column - Hospital and Performance */}
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                {/* Hospital Affiliations */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, color: theme.primaryColor }}
                    >
                      Hospital Affiliations
                    </Typography>

                    {priorDoctorsById?.hospitals?.length > 0 ? (
                      <List>
                        {priorDoctorsById.hospitals.map((hospital, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemIcon>
                                <LocalHospitalIcon color="primary" />
                              </ListItemIcon>
                              {/* <ListItemText primary={hospital} /> */}
                              <ListItemText
                                primary={hospital.hospitalName}
                                secondary={`Days: ${(hospital.days || []).join(
                                  ", "
                                )} | Timings: ${hospital?.timings?.startTime || ""
                                  } - ${hospital?.timings?.endTime || ""}`}
                              />
                            </ListItem>
                            {index < priorDoctorsById.hospitals.length - 1 && (
                              <Divider />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No hospital affiliations found.
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Visit Performance */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, color: theme.primaryColor }}
                    >
                      Visit Performance
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <EventAvailableIcon
                              sx={{ mr: 1, color: theme.primaryColor }}
                            />
                            <Typography variant="subtitle2">
                              Visit Targets
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">Target:</Typography>
                            <Typography variant="body2">
                              {priorDoctorsById?.visitTarget || 0}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">Achieved:</Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {priorDoctorsById?.visitAchievement || 0}
                            </Typography>
                          </Box>

                          {/* <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                            >
                              Completion: {visitPercentage}%
                            </Typography>
                            <Box
                              sx={{
                                height: 8,
                                backgroundColor: "#e0e0e0",
                                borderRadius: 4,
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  height: "100%",
                                  width: `${visitPercentage}%`,
                                  backgroundColor:
                                    visitPercentage >= 80
                                      ? "#4caf50"
                                      : visitPercentage >= 50
                                      ? "#ff9800"
                                      : "#f44336",
                                }}
                              />
                            </Box>
                          </Box> */}
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewDoctor;
