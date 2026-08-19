// components/sections/ExecutiveSection.jsx

import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, 
  ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Legend
} from "recharts";
import { ChartCard, KpiCard, AchievementBadge, EmptyState } from '../analytics';
import { 
  Badge, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  Button,
  Input,
} from '../common';
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { COLORS } from '../../data/analyticsData';
import Pagination from "../../../../../../components/uiComponents/pagination/Pagination.jsx";

function MiniStat({ label, value, icon, tone }) {
  return (
    <div className="rounded-xl border border-[var(--theme-border)] p-3 bg-[var(--theme-card-bg)]">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--theme-primary)]">{icon}</span>}
        <p className="text-[10px] font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className={`text-lg font-bold mt-0.5 ${tone === "success" ? "text-green-600" : "text-[var(--theme-text-primary)]"}`}>
        {value || 0}
      </p>
    </div>
  );
}

function TargetCard({ target }) {
  const achievementPercentage = target?.achievementPercentage || 0;
  const achievementColor = achievementPercentage >= 100 ? "text-green-600" :
                          achievementPercentage >= 75 ? "text-yellow-600" :
                          "text-red-600";

  return (
    <div className="bg-white rounded-lg border border-[var(--theme-border)] p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-[var(--theme-text-primary)] truncate flex-1 mr-2">
          {target?.doctorName || 'N/A'}
        </p>
        <Badge className={`rounded-full ${achievementColor} bg-opacity-10 whitespace-nowrap`}>
          {achievementPercentage}%
        </Badge>
      </div>
      <p className="text-xs text-gray-500 truncate">{target?.organization || 'N/A'}</p>
      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap mt-1">
        <span>📦 {target?.productName || 'N/A'}</span>
        <span>🎯 {target?.monthlyTarget || 0}</span>
        <span>✅ {target?.monthlyAchievement || 0}</span>
      </div>
      <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(achievementPercentage, 100)}%`,
            backgroundColor: achievementPercentage >= 100 ? "#22c55e" :
                           achievementPercentage >= 75 ? "#eab308" :
                           "#ef4444"
          }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        {target?.month || 'N/A'} {target?.year || ''}
      </p>
    </div>
  );
}

export function ExecutiveSection({ 
  executives, 
  filters, 
  salesPersonData, 
  salesPersonTargetData,
  loading = false,
  tableLoading = false,
  onTargetPageChange,
  onTargetItemsPerPageChange,
}) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTarget, setSelectedTarget] = useState(null);

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

  console.log("sales persons", salesPersons);

  // ✅ Process sales person target data
  const targetList = useMemo(() => {
    if (salesPersonTargetData?.data && Array.isArray(salesPersonTargetData.data)) {
      return salesPersonTargetData.data;
    }
    return [];
  }, [salesPersonTargetData]);

  // ✅ Target pagination info
  const targetPagination = useMemo(() => {
    if (salesPersonTargetData) {
      return {
        currentPage: salesPersonTargetData.currentPage || 1,
        pageSize: salesPersonTargetData.pageSize || 10,
        totalPages: salesPersonTargetData.totalPages || 1,
        totalRecords: salesPersonTargetData.totalRecords || 0,
      };
    }
    return {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalRecords: 0,
    };
  }, [salesPersonTargetData]);

  // ✅ Filter targets by search term
  const filteredTargets = useMemo(() => {
    if (!searchTerm) return targetList;
    const term = searchTerm.toLowerCase();
    return targetList.filter(item =>
      item.salesPersonName?.toLowerCase().includes(term) ||
      item.doctorName?.toLowerCase().includes(term) ||
      item.organization?.toLowerCase().includes(term) ||
      item.productName?.toLowerCase().includes(term)
    );
  }, [targetList, searchTerm]);

  // ✅ Target summary statistics - with safe fallbacks
  const targetStats = useMemo(() => {
    const totalRecords = filteredTargets?.length || 0;
    const totalTarget = filteredTargets?.reduce((sum, item) => sum + (item?.monthlyTarget || 0), 0) || 0;
    const totalAchieved = filteredTargets?.reduce((sum, item) => sum + (item?.monthlyAchievement || 0), 0) || 0;
    const avgAchievement = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;
    const highPerformers = filteredTargets?.filter(item => (item?.achievementPercentage || 0) >= 100).length || 0;

    return {
      totalRecords,
      totalTarget,
      totalAchieved,
      avgAchievement,
      highPerformers,
    };
  }, [filteredTargets]);

  // ✅ Achievement distribution for chart - with safe fallbacks
  const achievementDistribution = useMemo(() => {
    const buckets = {
      "Excellent (≥100%)": 0,
      "Good (75-99%)": 0,
      "Average (50-74%)": 0,
      "Needs Attention (<50%)": 0,
    };

    if (filteredTargets && filteredTargets.length > 0) {
      filteredTargets.forEach(item => {
        const pct = item?.achievementPercentage || 0;
        if (pct >= 100) buckets["Excellent (≥100%)"]++;
        else if (pct >= 75) buckets["Good (75-99%)"]++;
        else if (pct >= 50) buckets["Average (50-74%)"]++;
        else buckets["Needs Attention (<50%)"]++;
      });
    }

    const colors = ["#22c55e", "#eab308", "#f97316", "#ef4444"];
    return Object.entries(buckets).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }));
  }, [filteredTargets]);

  // ✅ Calculate summary statistics - with safe fallbacks
  const summaryStats = useMemo(() => {
    const total = salesPersons?.length || 0;
    const totalVisits = salesPersons?.reduce((sum, p) => sum + (p?.totalVisits || 0), 0) || 0;
    const totalSuccess = salesPersons?.reduce((sum, p) => sum + (p?.successVisits || 0), 0) || 0;
    const avgSuccessRate = totalVisits > 0 ? Math.round((totalSuccess / totalVisits) * 100) : 0;
    const activePersons = salesPersons?.filter(p => (p?.totalVisits || 0) > 0).length || 0;
    
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
    if (!salesPersons || salesPersons.length === 0) return [];
    return [...salesPersons]
      .sort((a, b) => (b?.successPercentage || 0) - (a?.successPercentage || 0))
      .slice(0, 10);
  }, [salesPersons]);

  // ✅ Get top performer
  const topPerformer = useMemo(() => {
    if (!salesPersons || salesPersons.length === 0) return null;
    return [...salesPersons].sort((a, b) => (b?.successPercentage || 0) - (a?.successPercentage || 0))[0];
  }, [salesPersons]);

  // ✅ Target pagination handlers
  const handleTargetPageChange = (page) => {
    if (onTargetPageChange) {
      onTargetPageChange(page);
    }
  };

  const handleTargetItemsPerPageChange = (pageSize) => {
    if (onTargetItemsPerPageChange) {
      onTargetItemsPerPageChange(pageSize);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoaderSpinner />
          <p className="mt-4 text-[var(--theme-text-secondary)] font-medium">Loading executive data...</p>
        </div>
      </div>
    );
  }

  // ✅ If no data available
  if ((!salesPersons || salesPersons.length === 0) && (!targetList || targetList.length === 0)) {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--theme-accent)] mb-2">
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
          <h2 className="text-xl md:text-2xl font-bold text-[var(--theme-accent)]">
            Sales Executive Performance
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {summaryStats.total || 0} executives · {summaryStats.activePersons || 0} active · {summaryStats.totalVisits || 0} total visits
            {filters?.state && <span className="ml-2 font-medium text-[var(--theme-primary)]">| {filters.state}</span>}
            {filters?.district && <span className="ml-2 font-medium text-[var(--theme-primary)]">| {filters.district}</span>}
            {filters?.month && <span className="ml-2 font-medium text-[var(--theme-primary)]">| {filters.month}</span>}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--theme-border)] mb-6 overflow-x-auto bg-white/60 backdrop-blur-sm rounded-t-xl px-2 py-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`
            flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
            rounded-lg
            ${activeTab === "overview"
              ? 'bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/20'
              : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]'
            }
          `}
        >
          <LucideIcons.LayoutDashboard size={18} />
          Overview
          {activeTab === "overview" && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
              Active
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("targets")}
          className={`
            flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
            rounded-lg
            ${activeTab === "targets"
              ? 'bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/20'
              : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]'
            }
          `}
        >
          <LucideIcons.Target size={18} />
          Targets
          {activeTab === "targets" && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* View Mode Toggle */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button 
              size="sm" 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className={`rounded-lg ${viewMode === 'grid' ? 'bg-[var(--theme-primary)] text-white' : 'border-[var(--theme-border)]'}`}
            >
              <LucideIcons.Grid size={14} /> Grid
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
              className={`rounded-lg ${viewMode === 'table' ? 'bg-[var(--theme-primary)] text-white' : 'border-[var(--theme-border)]'}`}
            >
              <LucideIcons.List size={14} /> Table
            </Button>
          </div>

          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <KpiCard 
              title="Total Executives" 
              value={summaryStats.total || 0} 
              trend={0} 
              accent="info" 
              icon={LucideIcons.Users} 
            />
            <KpiCard 
              title="Active Executives" 
              value={summaryStats.activePersons || 0} 
              trend={0} 
              accent="success" 
              icon={LucideIcons.Activity} 
            />
            <KpiCard 
              title="Total Visits" 
              value={summaryStats.totalVisits || 0} 
              trend={0} 
              accent="target" 
              icon={LucideIcons.Phone} 
            />
            <KpiCard 
              title="Success Visits" 
              value={summaryStats.totalSuccess || 0} 
              trend={0} 
              accent="success" 
              icon={LucideIcons.CheckCircle2} 
            />
            <KpiCard 
              title="Avg Success Rate" 
              value={`${summaryStats.avgSuccessRate || 0}%`} 
              trend={0} 
              accent="product" 
              icon={LucideIcons.Target} 
            />
          </div>

          {/* Top Performer Highlight */}
          {topPerformer && (
            <div className="bg-gradient-to-r from-[var(--theme-primary)]/10 to-[var(--theme-primary)]/5 rounded-2xl p-4 border border-[var(--theme-primary)]/20 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-[var(--theme-primary)] grid place-items-center text-white text-xl font-bold">
                    {topPerformer.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--theme-text-secondary)] font-medium">🏆 Top Performer</p>
                    <p className="text-xl font-bold text-[var(--theme-text-primary)]">{topPerformer.name || 'N/A'}</p>
                    <p className="text-sm text-[var(--theme-primary)]">{topPerformer.company || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--theme-primary)]">{topPerformer.successPercentage || 0}%</p>
                    <p className="text-xs text-gray-500">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--theme-text-primary)]">{topPerformer.totalVisits || 0}</p>
                    <p className="text-xs text-gray-500">Total Visits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{topPerformer.successVisits || 0}</p>
                    <p className="text-xs text-gray-500">Success Visits</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salesPersons.length > 0 ? (
                salesPersons.map((person, index) => {
                  const isTopPerformer = person?.name === topPerformer?.name;
                  return (
                    <div 
                      key={index}
                      className={`bg-white rounded-2xl border ${isTopPerformer ? 'border-[var(--theme-primary)] shadow-md shadow-[var(--theme-primary)]/10' : 'border-[var(--theme-border)]'} p-4 hover:shadow-lg transition-shadow cursor-pointer`}
                      onClick={() => setSelectedPerson(selectedPerson === index ? null : index)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${isTopPerformer ? 'bg-[var(--theme-primary)]' : 'bg-[var(--theme-bg-light)]'} grid place-items-center ${isTopPerformer ? 'text-white' : 'text-[var(--theme-primary)]'} font-semibold`}>
                            {person?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--theme-text-primary)]">{person?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{person?.company || 'N/A'}</p>
                          </div>
                        </div>
                        {isTopPerformer && (
                          <Badge className="bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border-[var(--theme-primary)]/20 rounded-full">
                            🏆 Top
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="text-center">
                          <p className="text-sm font-bold text-[var(--theme-text-primary)]">{person?.totalVisits || 0}</p>
                          <p className="text-[9px] text-gray-500 uppercase">Visits</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-green-600">{person?.successVisits || 0}</p>
                          <p className="text-[9px] text-gray-500 uppercase">Success</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-[var(--theme-primary)]">{person?.successPercentage || 0}%</p>
                          <p className="text-[9px] text-gray-500 uppercase">Rate</p>
                        </div>
                      </div>

                      {selectedPerson === index && (
                        <div className="mt-3 pt-3 border-t border-[var(--theme-border)]">
                          <div className="grid grid-cols-2 gap-2">
                            <MiniStat 
                              label="Hospitals" 
                              value={person?.totalHospitals || 0} 
                              icon={<LucideIcons.Building2 size={14} />}
                            />
                            <MiniStat 
                              label="Individuals" 
                              value={person?.totalIndividuals || 0} 
                              icon={<LucideIcons.Users size={14} />}
                            />
                            <MiniStat 
                              label="Completion Rate" 
                              value={`${person?.completionRate || 0}%`} 
                              icon={<LucideIcons.TrendingUp size={14} />}
                              tone="success"
                            />
                            <MiniStat 
                              label="Productivity" 
                              value={`${person?.productivityScore || 0}%`} 
                              icon={<LucideIcons.Sparkles size={14} />}
                              tone="info"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No executives found
                </div>
              )}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <ChartCard title="Executive Directory" subtitle="Complete performance overview">
              <div className="overflow-x-auto -mx-2">
                <Table>
                  <TableHeader className="bg-[var(--theme-bg-light)]">
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
                    {salesPersons.length > 0 ? (
                      salesPersons.map((person, index) => {
                        const isActive = (person?.totalVisits || 0) > 0;
                        const isTopPerformer = person?.name === topPerformer?.name;
                        
                        return (
                          <TableRow 
                            key={index} 
                            className={`hover:bg-gray-50 transition-all ${isTopPerformer ? 'bg-[var(--theme-bg-light)]' : ''}`}
                          >
                            <td className="p-4 text-[17px] font-normal text-[#252C58]">
                              {index + 1}
                              {isTopPerformer && <span className="ml-1 text-[var(--theme-primary)]">🏆</span>}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)]">
                              {person?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {person?.company || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                              {person?.totalVisits || 0}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right text-green-600">
                              {person?.successVisits || 0}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                              {person?.totalHospitals || 0}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                              {person?.totalIndividuals || 0}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                              <AchievementBadge value={person?.successPercentage || 0} />
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"}`}>
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-sm text-gray-500">
                          No executives found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="text-xs text-gray-500 text-center mt-3">
                Showing {salesPersons.length || 0} executives
              </div>
            </ChartCard>
          )}
        </div>
      )}

      {/* Targets Tab */}
      {activeTab === "targets" && (
        <div>
          {/* Target KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KpiCard
              title="Total Records"
              value={targetStats.totalRecords || 0}
              trend={0}
              accent="info"
              icon={LucideIcons.FileText}
            />
            <KpiCard
              title="Total Target"
              value={targetStats.totalTarget || 0}
              trend={0}
              accent="target"
              icon={LucideIcons.Target}
            />
            <KpiCard
              title="Total Achieved"
              value={targetStats.totalAchieved || 0}
              trend={0}
              accent="success"
              icon={LucideIcons.CheckCircle2}
            />
            <KpiCard
              title="Avg Achievement"
              value={`${targetStats.avgAchievement || 0}%`}
              trend={0}
              accent="product"
              icon={LucideIcons.TrendingUp}
            />
          </div>

          {/* Target Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <ChartCard title="Performance Distribution" subtitle="Achievement buckets" className="lg:col-span-1">
              {achievementDistribution.filter(d => d.value > 0).length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={achievementDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: 'var(--theme-bg-sidebar)', strokeWidth: 1 }}
                    >
                      {achievementDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--theme-bg-sidebar)", background: "#ffffff" }}
                      formatter={(value, name) => [`${value || 0} records`, name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Target Overview" subtitle="Quick summary" className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-[var(--theme-primary)]/10 to-[var(--theme-primary)]/5 rounded-xl p-3 text-center border border-[var(--theme-primary)]/20">
                  <p className="text-2xl font-bold text-[var(--theme-primary)]">{targetStats.totalRecords || 0}</p>
                  <p className="text-xs text-gray-500 truncate">Records</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 text-center border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{targetStats.totalTarget || 0}</p>
                  <p className="text-xs text-gray-500 truncate">Target</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 text-center border border-green-200">
                  <p className="text-2xl font-bold text-green-600">{targetStats.totalAchieved || 0}</p>
                  <p className="text-xs text-gray-500 truncate">Achieved</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 text-center border border-purple-200">
                  <p className="text-2xl font-bold text-purple-600">{targetStats.avgAchievement || 0}%</p>
                  <p className="text-xs text-gray-500 truncate">Avg Achievement</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Search */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="relative w-64">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by executive, doctor, organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl border-[var(--theme-border)] focus:ring-[var(--theme-primary)]"
              />
            </div>
            <p className="text-sm text-gray-500">
              {filteredTargets?.length || 0} records found
            </p>
          </div>

          {/* Target Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredTargets && filteredTargets.length > 0 ? (
              filteredTargets.map((target, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[var(--theme-border)] p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTarget(selectedTarget === index ? null : index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[var(--theme-text-primary)] truncate max-w-[60%]">
                      {target?.salesPersonName || 'N/A'}
                    </h4>
                    <Badge className={`rounded-full whitespace-nowrap ${
                      (target?.achievementPercentage || 0) >= 100 ? 'bg-green-500/15 text-green-500' : 
                      (target?.achievementPercentage || 0) >= 75 ? 'bg-yellow-500/15 text-yellow-600' : 
                      'bg-red-500/15 text-red-500'
                    }`}>
                      {target?.achievementPercentage || 0}%
                    </Badge>
                  </div>

                  <p className="text-sm text-[var(--theme-primary)] truncate">{target?.doctorName || 'N/A'}</p>
                  <p className="text-xs text-gray-500 truncate">{target?.organization || 'N/A'}</p>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm mt-3">
                    <div className="bg-[var(--theme-card-bg)] rounded-lg p-2">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Product</p>
                      <p className="font-semibold text-[var(--theme-text-primary)] text-xs truncate">{target?.productName || 'N/A'}</p>
                    </div>
                    <div className="bg-[var(--theme-card-bg)] rounded-lg p-2">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Target</p>
                      <p className="font-semibold text-[var(--theme-text-primary)]">{target?.monthlyTarget || 0}</p>
                    </div>
                    <div className="bg-[var(--theme-card-bg)] rounded-lg p-2">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Achieved</p>
                      <p className="font-semibold text-green-600">{target?.monthlyAchievement || 0}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(target?.achievementPercentage || 0, 100)}%`,
                        backgroundColor: (target?.achievementPercentage || 0) >= 100 ? "#22c55e" :
                                       (target?.achievementPercentage || 0) >= 75 ? "#eab308" :
                                       "#ef4444"
                      }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1 text-center">
                    {target?.month || 'N/A'} {target?.year || ''}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No records match your search.
              </div>
            )}
          </div>

          {/* Target Table */}
          <ChartCard title="Target Directory" subtitle="Detailed target view">
            <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--theme-bg-light)]">
                    <TableHead className="text-base font-semibold">#</TableHead>
                    <TableHead className="text-base font-semibold">Executive</TableHead>
                    <TableHead className="text-base font-semibold">Doctor</TableHead>
                    <TableHead className="text-base font-semibold">Organization</TableHead>
                    <TableHead className="text-base font-semibold">Product</TableHead>
                    <TableHead className="text-base font-semibold text-right">Target</TableHead>
                    <TableHead className="text-base font-semibold text-right">Achieved</TableHead>
                    <TableHead className="text-base font-semibold text-right">Achievement %</TableHead>
                    <TableHead className="text-base font-semibold">Month/Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="p-8 text-center">
                        <div className="flex justify-center items-center w-full">
                          <LoaderSpinner />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredTargets && filteredTargets.length > 0 ? (
                    filteredTargets.map((target, index) => {
                      const pct = target?.achievementPercentage || 0;
                      return (
                        <TableRow key={index} className="hover:bg-gray-50 transition-all">
                          <td className="p-4 text-[17px] font-normal text-[#252C58]">
                            {(targetPagination.currentPage - 1) * targetPagination.pageSize + index + 1}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)] max-w-[120px] truncate">
                            {target?.salesPersonName || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap max-w-[120px] truncate">
                            {target?.doctorName || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap max-w-[120px] truncate">
                            {target?.organization || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap max-w-[120px] truncate">
                            {target?.productName || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                            {target?.monthlyTarget || 0}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right text-green-600">
                            {target?.monthlyAchievement || 0}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                            <AchievementBadge value={pct} />
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                            {target?.month || 'N/A'} {target?.year || ''}
                          </td>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-sm text-gray-500">
                        No records match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Target Pagination */}
                <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
              {(targetPagination?.totalRecords || 0) > 0 && (
                <Pagination
                  currentPage={targetPagination.currentPage || 1}
                  totalItems={targetPagination.totalRecords || 0}
                  itemsPerPage={targetPagination.pageSize || 10}
                  totalPages={targetPagination.totalPages || 1}
                  onPageChange={handleTargetPageChange}
                  onItemsPerPageChange={handleTargetItemsPerPageChange}
                />
              )}
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}