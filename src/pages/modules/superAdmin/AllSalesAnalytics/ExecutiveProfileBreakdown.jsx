import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as LucideIcons from "lucide-react";
import useAllSalesAnalytics from '../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics';
import LoaderSpinner from '../../../../components/uiComponents/loader/LoaderSpinner.jsx';
import BreadCrumb from '../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx';

const ExecutiveProfileBreakdown = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { specificSalesPersonData, fetchSpecificSalesPersonData, loading } = useAllSalesAnalytics();
  const [activeTab, setActiveTab] = useState('individuals');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (id) {
      fetchSpecificSalesPersonData(id);
    }
  }, [id, fetchSpecificSalesPersonData]);

  const data = specificSalesPersonData?.data;
  const salesPerson = data?.salesPerson;
  const individuals = data?.individuals || [];
  const organizations = data?.organizations || [];
  const monthlyPlanning = data?.monthlyPlanning || {};
  const hospitalWiseTarget = data?.hospitalWiseTarget || {};

  const breadcrumbLinks = [
    { text: 'Sales Analytics', href: '/sales-analyticsAll' },
    { text: salesPerson?.fullName || 'Executive Profile' },
  ];

  const filteredIndividuals = individuals.filter(ind =>
    ind.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ind.typeOfDoctorProfile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ind.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrganizations = organizations.filter(org =>
    org.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.typeOfHospital?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const planningMonths = Object.keys(monthlyPlanning);
  const targetYears = Object.keys(hospitalWiseTarget);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoaderSpinner />
          <p className="mt-4 text-gray-600 font-medium text-lg">Loading executive profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumbs */}
      <BreadCrumb linkText={breadcrumbLinks} />

      {/* Executive Name Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/sales-analyticsAll')}
              className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <LucideIcons.ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-indigo-600 grid place-items-center text-white text-xl font-bold">
                {salesPerson?.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">{salesPerson?.fullName || 'N/A'}</h1>
                <p className="text-sm text-gray-500">Sales Executive</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
              <p className="text-2xl font-bold text-indigo-700">{individuals.length}</p>
              <p className="text-xs text-indigo-600">Individuals</p>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
              <p className="text-2xl font-bold text-green-700">{organizations.length}</p>
              <p className="text-xs text-green-600">Organizations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('individuals')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
              activeTab === 'individuals'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LucideIcons.Users size={16} />
            <span>Individuals</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'individuals' ? 'bg-white/20' : 'bg-gray-200'}`}>
              {individuals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
              activeTab === 'organizations'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LucideIcons.Building size={16} />
            <span>Organizations</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'organizations' ? 'bg-white/20' : 'bg-gray-200'}`}>
              {organizations.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
              activeTab === 'planning'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LucideIcons.Calendar size={16} />
            <span>Monthly Planning</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'planning' ? 'bg-white/20' : 'bg-gray-200'}`}>
              {planningMonths.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('targets')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-w-[140px] ${
              activeTab === 'targets'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LucideIcons.Target size={16} />
            <span>Hospital Targets</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'targets' ? 'bg-white/20' : 'bg-gray-200'}`}>
              {targetYears.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white"
        />
      </div>

      {/* Individuals Tab */}
      {activeTab === 'individuals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIndividuals.length > 0 ? (
            filteredIndividuals.map((ind, index) => (
              <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 grid place-items-center text-indigo-700 font-bold text-lg">
                    {ind.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black truncate">{ind.fullName || 'N/A'}</p>
                    <span className="text-xs font-semibold text-indigo-600">{ind.typeOfDoctorProfile || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <LucideIcons.Briefcase size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">DESIGNATION</p>
                      <p className="text-sm text-black font-semibold truncate">{ind.designation || 'N/A'}</p>
                    </div>
                  </div>
                  {ind.department && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Building2 size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">DEPARTMENT</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.department}</p>
                      </div>
                    </div>
                  )}
                  {ind.speciality && (
                    <div className="flex items-start gap-2">
                      <LucideIcons.Stethoscope size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">SPECIALITY</p>
                        <p className="text-sm text-black font-semibold truncate">{ind.speciality}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Users size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No individuals found</p>
            </div>
          )}
        </div>
      )}

      {/* Organizations Tab */}
      {activeTab === 'organizations' && (
        <div className="space-y-4">
          {filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org, index) => (
              <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-green-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-green-100 grid place-items-center text-green-700 font-bold text-xl flex-shrink-0">
                    {org.hospitalName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black text-lg leading-tight">{org.hospitalName || 'N/A'}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {org.typeOfHospital || 'N/A'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        org.typeOfOrgOrHospital === 'Govt' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {org.typeOfOrgOrHospital || 'N/A'}
                      </span>
                      {org.ifGovt && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                          {org.ifGovt}
                        </span>
                      )}
                    </div>
                    {org.hospitalData && (org.hospitalData.totalBeds > 0 || org.hospitalData.totalICUBeds > 0 || org.hospitalData.totalOT > 0) && (
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        {org.hospitalData.totalBeds > 0 && (
                          <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                            <LucideIcons.Bed size={16} className="text-amber-600" />
                            <div>
                              <p className="text-sm font-bold text-black">{org.hospitalData.totalBeds}</p>
                              <p className="text-xs text-gray-500">Beds</p>
                            </div>
                          </div>
                        )}
                        {org.hospitalData.totalICUBeds > 0 && (
                          <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                            <LucideIcons.HeartPulse size={16} className="text-red-600" />
                            <div>
                              <p className="text-sm font-bold text-black">{org.hospitalData.totalICUBeds}</p>
                              <p className="text-xs text-gray-500">ICU</p>
                            </div>
                          </div>
                        )}
                        {org.hospitalData.totalOT > 0 && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                            <LucideIcons.Activity size={16} className="text-blue-600" />
                            <div>
                              <p className="text-sm font-bold text-black">{org.hospitalData.totalOT}</p>
                              <p className="text-xs text-gray-500">OTs</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {org.hospitalData?.specialities && org.hospitalData.specialities.length > 0 && org.hospitalData.specialities[0].name && (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Specialities & Surgeries</p>
                        {org.hospitalData.specialities.map((spec, specIdx) => (
                          spec.name && (
                            <div key={specIdx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-sm font-bold text-black mb-2">{spec.name}</p>
                              {spec.surgeries && spec.surgeries.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {spec.surgeries.filter(s => s.surgeryType).map((surgery, surgIdx) => (
                                    <div key={surgIdx} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                                      <LucideIcons.Scissors size={12} className="text-indigo-600" />
                                      <span className="text-xs font-medium text-gray-700">{surgery.surgeryType}:</span>
                                      <span className="text-xs font-bold text-indigo-600">{surgery.numberOfSurgeries}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Building size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No organizations found</p>
            </div>
          )}
        </div>
      )}

      {/* Monthly Planning Tab */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {planningMonths.length > 0 ? (
            planningMonths.map((month) => (
              <div key={month} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100">
                  <h3 className="font-bold text-indigo-700 flex items-center gap-2">
                    <LucideIcons.Calendar size={18} />
                    {month}
                    <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded-full">
                      {monthlyPlanning[month].length} plans
                    </span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {monthlyPlanning[month].map((plan, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <LucideIcons.CalendarCheck size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-black">
                            {new Date(plan.createPlanningForDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="flex items-center gap-2">
                            <LucideIcons.User size={14} className="text-gray-400" />
                            <span className="text-sm text-black font-medium truncate">{plan.nameOfDoctor || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LucideIcons.Building size={14} className="text-gray-400" />
                            <span className="text-sm text-black truncate">{plan.selectOrganization || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LucideIcons.Package size={14} className="text-gray-400" />
                            <span className="text-sm text-black truncate">
                              {Array.isArray(plan.productToBePromoted) ? plan.productToBePromoted.join(', ') : plan.productToBePromoted || 'N/A'}
                            </span>
                          </div>
                        </div>
                        {plan.wantToBuy && (
                          <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                            plan.wantToBuy.status === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            Want to Buy: {plan.wantToBuy.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Calendar size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No monthly planning data</p>
            </div>
          )}
        </div>
      )}

      {/* Hospital Wise Target Tab */}
      {activeTab === 'targets' && (
        <div className="space-y-6">
          {targetYears.length > 0 ? (
            targetYears.map((year) => (
              <div key={year} className="space-y-4">
                <h3 className="font-bold text-black text-lg flex items-center gap-2">
                  <LucideIcons.Target size={20} className="text-indigo-600" />
                  Year {year}
                </h3>
                {Object.entries(hospitalWiseTarget[year]).map(([hospitalName, hospitalData]) => (
                  <div key={hospitalName} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                    <div className="bg-green-50 px-5 py-3 border-b border-green-100">
                      <div className="flex items-center gap-2">
                        <LucideIcons.Building size={18} className="text-green-600" />
                        <h4 className="font-bold text-black">{hospitalData.organization || hospitalName}</h4>
                        {hospitalData.city && (
                          <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full text-green-700">
                            {hospitalData.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {hospitalData.products && hospitalData.products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {hospitalData.products.map((product, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="font-semibold text-black text-sm">{product.name || 'N/A'}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">Qty: <span className="font-bold text-black">{product.enteredQuantity}</span></span>
                                <span className="text-xs font-bold text-green-600">₹{product.price?.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No products data</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
              <LucideIcons.Target size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-black font-semibold">No hospital targets data</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutiveProfileBreakdown;
