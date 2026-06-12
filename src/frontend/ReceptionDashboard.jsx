import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import SidePane from '../components/reception/SidePane';
import TopBar from '../components/reception/TopBar';
import DashboardCards from '../components/reception/DashboardCards';
import AppointmentPanel from '../components/reception/AppointmentPanel';
import BillingPanel from '../components/reception/BillingPanel';
import PatientRegistration from '../components/reception/PatientRegistration';
import PatientSearch from '../components/reception/PatientSearch';

const ReceptionDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SidePane
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className={`
          transition-all duration-300
          pt-16
          ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}
          pl-0
        `}>
        <div className="p-4 lg:p-6 mt-14">
          <Routes>
            <Route path="/" element={<DashboardCards />} />
            <Route path="/dashboard" element={<DashboardCards />} />
          </Routes>
        </div>
        <div className="p-4 lg:p-6">
          <Routes>
            <Route path="/PatientRegistration" element={<PatientRegistration />} />
            <Route path="/PatientSearch" element={<PatientSearch />} />
            <Route path="/AppointmentPanel" element={<AppointmentPanel />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default ReceptionDashboard