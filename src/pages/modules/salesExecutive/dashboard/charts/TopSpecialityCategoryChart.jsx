import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

function TopSpecialityCategoryChart({ data, showLegend = false }) {
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    value,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={data[index]?.color || "#000"} // ✅ use entry.color
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={8}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  return (
    <ResponsiveContainer height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="title"
          cx="50%"
          cy="50%"
          innerRadius={10}
          outerRadius={15}
          label={renderCustomLabel}
          labelLine={false}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default TopSpecialityCategoryChart;
