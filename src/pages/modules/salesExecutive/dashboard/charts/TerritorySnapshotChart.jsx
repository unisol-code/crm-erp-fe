import React, { useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useDashboard from "../../../../../hooks/salesExecutiveHook/dashboard/useDashboard";
import { CircularProgress, Box, Typography } from "@mui/material";

// const COLORS = [
//   "#6366f1",
//   "#8b5cf6",
//   "#f59e0b",
//   "#ef4444",
//   "#06b6d4",
//   "#10b981",
//   "#ec4899",
// ];
const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#10b981", // green
  "#ec4899", // pink

  "#3b82f6", // blue
  "#22c55e", // emerald
  "#eab308", // yellow
  "#f97316", // orange
  "#0ea5e9", // sky blue
  "#84cc16", // lime
  "#a855f7", // purple
  "#f43f5e", // rose
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <strong>{name}</strong>: {value}
      </div>
    );
  }
  return null;
};

const TerritorySnapshotChart = ({ city, speciality }) => {
  const { fetchTerritorySnapshot, territorySnapshot, loading } = useDashboard();

  console.log("territorySnapshot:", territorySnapshot);

  useEffect(() => {
    fetchTerritorySnapshot(city, speciality);
  }, [city, speciality]);

  const chartData = useMemo(() => {
    if (!territorySnapshot || territorySnapshot.length === 0) return [];

    return territorySnapshot.map((item, index) => {
      // case: city + speciality → show category & percentage
      if (item.category) {
        return {
          name: item.category,
          value: parseFloat(item.percentage),
          color: COLORS[index % COLORS.length],
        };
      }

      // case: speciality → show city & percentage
      if (item.percentage && item.city) {
        return {
          name: item.city,
          value: parseFloat(item.percentage),
          color: COLORS[index % COLORS.length],
        };
      }

      // case: city → show specialty & doctorCount
      if (item.speciality) {
        return {
          name: item.speciality,
          value: item.doctorCount,
          color: COLORS[index % COLORS.length],
        };
      }

      // default case → show city & doctorCount
      return {
        name: item.city,
        value: item.doctorCount,
        color: COLORS[index % COLORS.length],
      };
    });
  }, [territorySnapshot]);

  if (loading) {
    return (
      <Box
        height={300}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && chartData.length === 0) {
    return (
      <Box
        height={300}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1" color="text.secondary">
          No data available.
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
          // label={({ name, value }) => `${name}: ${value}%`}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              style={{ transition: "opacity 0.3s", cursor: "pointer" }}
              onMouseOver={(e) => {
                e.target.style.opacity = 0.8;
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = 1;
              }}
            />
          ))}
        </Pie>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            flexWrap: "wrap",
            display: "flex",
            justifyContent: "center",
            fontSize: "0.85rem",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TerritorySnapshotChart;
