// components/sections/ExecutiveSection.jsx

import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, 
  ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Legend
} from "recharts";
import { ChartCard, KpiCard, AchievementBadge } from '../analytics';
import { 
  Badge, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  Button,
} from '../common';
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { COLORS } from '../../data/analyticsData';

function MiniStat({ label, value, icon, tone }) {
  return (
    <div className="rounded-xl border border-[#E8C9B8] p-3 bg-[#FFF8F5]">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[#C6693C]">{icon}</span>}
        <p className="text-[10px] font-semibold text-[#8B5A3C] uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className={`text-lg font-bold mt-0.5 ${tone === "success" ? "text-green-600" : "text-[#5A2D1A]"}`}>
        {value}
      </p>
    </div>
  );
}

export function ExecutiveSection({ executives, filters, salesPersonData, loading = false }) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // ✅ Process sales person data from API
  const salesPersons = useMemo(() => {
    if (salesPersonData?.data && Array.isArray(salesPersonData.data)) {
      return salesPersonData.data.map((item) => ({
        name: item.salesPersonName || 'N/A',
        company: item.companyName || 'N/A',
        totalVisits: item.totalVisits || 0,
        successVisits: item.successVisits || 0,
        totalHospitals: item.totalHospitals || 0,
        totalIndividuals: item.totalIndividuals || 0,
        successPercentage: parseFloat(item.successPercentage) || 0,
        // Calculate derived metrics
        completionRate: item.totalVisits > 0 
          ? Math.round((item.successVisits / item.totalVisits) * 100) 
          : 0,
        productivityScore: item.totalIndividuals > 0 
          ? Math.round((item.successVisits / item.totalIndividuals) * 100) 
          : 0,
      }));
    }
    return executives || [];
  }, [salesPersonData, executives]);

  // ✅ Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = salesPersons.length;
    const totalVisits = salesPersons.reduce((sum, p) => sum + p.totalVisits, 0);
    const totalSuccess = salesPersons.reduce((sum, p) => sum + p.successVisits, 0);
    const avgSuccessRate = totalVisits > 0 ? Math.round((totalSuccess / totalVisits) * 100) : 0;
    const activePersons = salesPersons.filter(p => p.totalVisits > 0).length;
    
    return {
      total,
      totalVisits,
      totalSuccess,
      avgSuccessRate,
      activePersons,
    };
  }, [salesPersons]);

  // ✅ Leaderboard - top performers by success rate
  const leaderboard = useMemo(() => {
    return [...salesPersons]
      .sort((a, b) => b.successPercentage - a.successPercentage)
      .slice(0, 10);
  }, [salesPersons]);

  // ✅ Get top performer
  const topPerformer = useMemo(() => {
    if (salesPersons.length === 0) return null;
    return [...salesPersons].sort((a, b) => b.successPercentage - a.successPercentage)[0];
  }, [salesPersons]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoaderSpinner />
          <p className="mt-4 text-[#8B5A3C] font-medium">Loading executive data...</p>
        </div>
      </div>
    );
  }

  // ✅ If no data available
  if (salesPersons.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">
          Sales Executive Performance
        </h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No executive data available
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29]">
            Sales Executive Performance
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {summaryStats.total} executives · {summaryStats.activePersons} active · {summaryStats.totalVisits} total visits
            {filters.state && <span className="ml-2 font-medium text-[#C6693C]">| {filters.state}</span>}
            {filters.district && <span className="ml-2 font-medium text-[#C6693C]">| {filters.district}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className={`rounded-lg ${viewMode === 'grid' ? 'bg-[#C6693C] text-white' : 'border-[#E8C9B8]'}`}
          >
            <LucideIcons.Grid size={14} /> Grid
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            className={`rounded-lg ${viewMode === 'table' ? 'bg-[#C6693C] text-white' : 'border-[#E8C9B8]'}`}
          >
            <LucideIcons.List size={14} /> Table
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard 
          title="Total Executives" 
          value={summaryStats.total} 
          trend={0} 
          accent="info" 
          icon={LucideIcons.Users} 
        />
        <KpiCard 
          title="Active Executives" 
          value={summaryStats.activePersons} 
          trend={0} 
          accent="success" 
          icon={LucideIcons.Activity} 
        />
        <KpiCard 
          title="Total Visits" 
          value={summaryStats.totalVisits} 
          trend={0} 
          accent="target" 
          icon={LucideIcons.Phone} 
        />
        <KpiCard 
          title="Success Visits" 
          value={summaryStats.totalSuccess} 
          trend={0} 
          accent="success" 
          icon={LucideIcons.CheckCircle2} 
        />
        <KpiCard 
          title="Avg Success Rate" 
          value={`${summaryStats.avgSuccessRate}%`} 
          trend={0} 
          accent="product" 
          icon={LucideIcons.Target} 
        />
      </div>

      {/* Top Performer Highlight */}
      {topPerformer && (
        <div className="bg-gradient-to-r from-[#C6693C]/10 to-[#C6693C]/5 rounded-2xl p-4 border border-[#C6693C]/20 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[#C6693C] grid place-items-center text-white text-xl font-bold">
                {topPerformer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-[#8B5A3C] font-medium">🏆 Top Performer</p>
                <p className="text-xl font-bold text-[#5A2D1A]">{topPerformer.name}</p>
                <p className="text-sm text-[#C6693C]">{topPerformer.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#C6693C]">{topPerformer.successPercentage}%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#5A2D1A]">{topPerformer.totalVisits}</p>
                <p className="text-xs text-gray-500">Total Visits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{topPerformer.successVisits}</p>
                <p className="text-xs text-gray-500">Success Visits</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salesPersons.map((person, index) => {
            const isTopPerformer = person.name === topPerformer?.name;
            return (
              <div 
                key={index}
                className={`bg-white rounded-2xl border ${isTopPerformer ? 'border-[#C6693C] shadow-md shadow-[#C6693C]/10' : 'border-[#E8C9B8]'} p-4 hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => setSelectedPerson(selectedPerson === index ? null : index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${isTopPerformer ? 'bg-[#C6693C]' : 'bg-[#FFF5F0]'} grid place-items-center ${isTopPerformer ? 'text-white' : 'text-[#C6693C]'} font-semibold`}>
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[#5A2D1A]">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.company}</p>
                    </div>
                  </div>
                  {isTopPerformer && (
                    <Badge className="bg-[#C6693C]/10 text-[#C6693C] border-[#C6693C]/20 rounded-full">
                      🏆 Top
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#5A2D1A]">{person.totalVisits}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Visits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-600">{person.successVisits}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Success</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#C6693C]">{person.successPercentage}%</p>
                    <p className="text-[9px] text-gray-500 uppercase">Rate</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPerson === index && (
                  <div className="mt-3 pt-3 border-t border-[#E8C9B8]">
                    <div className="grid grid-cols-2 gap-2">
                      <MiniStat 
                        label="Hospitals" 
                        value={person.totalHospitals} 
                        icon={<LucideIcons.Building2 size={14} />}
                      />
                      <MiniStat 
                        label="Individuals" 
                        value={person.totalIndividuals} 
                        icon={<LucideIcons.Users size={14} />}
                      />
                      <MiniStat 
                        label="Completion Rate" 
                        value={`${person.completionRate}%`} 
                        icon={<LucideIcons.TrendingUp size={14} />}
                        tone="success"
                      />
                      <MiniStat 
                        label="Productivity" 
                        value={`${person.productivityScore}%`} 
                        icon={<LucideIcons.Sparkles size={14} />}
                        tone="info"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <ChartCard title="Executive Directory" subtitle="Complete performance overview">
          <div className="overflow-x-auto -mx-2">
            <Table>
              <TableHeader className="bg-[#FFF5F0]">
                <TableRow>
                  <TableHead className="text-base font-semibold">#</TableHead>
                  <TableHead className="text-base font-semibold">Executive</TableHead>
                  <TableHead className="text-base font-semibold">Company</TableHead>
                  <TableHead className="text-base font-semibold text-right">Visits</TableHead>
                  <TableHead className="text-base font-semibold text-right">Success</TableHead>
                  <TableHead className="text-base font-semibold text-right">Hospitals</TableHead>
                  <TableHead className="text-base font-semibold text-right">Individuals</TableHead>
                  <TableHead className="text-base font-semibold text-right">Success Rate</TableHead>
                  <TableHead className="text-base font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesPersons.map((person, index) => {
                  const isActive = person.totalVisits > 0;
                  const isTopPerformer = person.name === topPerformer?.name;
                  
                  return (
                    <TableRow 
                      key={index} 
                      className={`hover:bg-gray-50 transition-all ${isTopPerformer ? 'bg-[#FFF5F0]' : ''}`}
                    >
                      <td className="p-4 text-[17px] font-normal text-[#252C58]">
                        {index + 1}
                        {isTopPerformer && <span className="ml-1 text-[#C6693C]">🏆</span>}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[#C6693C]">
                        {person.name}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {person.company}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        {person.totalVisits}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right text-green-600">
                        {person.successVisits}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        {person.totalHospitals}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        {person.totalIndividuals}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        <AchievementBadge value={person.successPercentage} />
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="text-xs text-gray-500 text-center mt-3">
            Showing {salesPersons.length} executives
          </div>
        </ChartCard>
      )}
    </div>
  );
}