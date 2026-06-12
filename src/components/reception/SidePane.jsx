// components/SidePane.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MdDashboard,
    MdEventNote,
    MdPayment,
    MdLocalHospital,
    MdPersonAdd,
    MdSearch,
    MdLogout,
    MdClose
} from 'react-icons/md';

const SidePane = ({ sidebarOpen, setSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);

    // Check if screen is mobile
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, [setIsMobileMenuOpen]);

    // Close mobile menu when route changes
    useEffect(() => {
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    }, [location.pathname, isMobile, setIsMobileMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navItems = [
        {
            id: 1,
            path: '/dashboard',
            name: 'Dashboard',
            icon: <MdDashboard className="w-5 h-5" />,
            component: 'DashboardCards',
            permission: 'view_dashboard'
        },
        {
            id: 2,
            path: '/AppointmentPanel',
            name: 'Appointments',
            icon: <MdEventNote className="w-5 h-5" />,
            component: 'AppointmentPanel',
            permission: 'manage_appointments'
        },
        {
            id: 3,
            path: '/billing',
            name: 'Billing & Payments',
            icon: <MdPayment className="w-5 h-5" />,
            component: 'BillingPanel',
            permission: 'manage_billing'
        },
        {
            id: 4,
            path: '/doctor-availability',
            name: 'Doctor Availability',
            icon: <MdLocalHospital className="w-5 h-5" />,
            component: 'DoctorAvailability',
            permission: 'view_doctor_schedule'
        },
        {
            id: 5,
            path: '/PatientRegistration',
            name: 'Patient Registration',
            icon: <MdPersonAdd className="w-5 h-5" />,
            component: 'PatientRegistration',
            permission: 'register_patients'
        },
        {
            id: 6,
            path: '/PatientSearch',
            name: 'Patient Search',
            icon: <MdSearch className="w-5 h-5" />,
            component: 'PatientSearch',
            permission: 'patient_search'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay - Fixed z-index and styling */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={closeMobileMenu}
                    style={{ backdropFilter: 'blur(2px)' }}
                />
            )}

            {/* Side Pane - Beautiful UI preserved */}
            <aside
                className={`
          fixed top-0 left-0 h-full 
          bg-gradient-to-b from-amber-50 to-amber-100 
          shadow-2xl z-50
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          w-64
        `}
            >
                {/* Close button for mobile */}
                {isMobileMenuOpen && (
                    <button
                        onClick={closeMobileMenu}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-amber-200 hover:bg-amber-300 transition-colors lg:hidden z-50"
                        aria-label="Close menu"
                    >
                        <MdClose className="w-5 h-5 text-gray-700" />
                    </button>
                )}

                {/* Logo Section - Beautiful UI */}
                <div className="p-6 border-b border-amber-200 bg-white bg-opacity-50">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-xl font-bold">H</span>
                        </div>
                        {(sidebarOpen || !isMobile) && (
                            <h1 className="text-xl font-bold text-gray-800">
                                Health<span className="text-amber-600">Care</span>
                            </h1>
                        )}
                    </div>
                    {(sidebarOpen || !isMobile) && (
                        <p className="text-xs text-gray-500 text-center mt-2">Reception Management System</p>
                    )}
                </div>

                {/* Hospital Info Section - Beautiful UI */}
                <div className="px-4 py-3 border-b border-amber-200 bg-amber-50">
                    {(sidebarOpen || !isMobile) ? (
                        <>
                            <div className="text-xs text-gray-600">
                                <p className="font-semibold">City Hospital & Research Center</p>
                                <p className="text-gray-500">Reception Desk</p>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                <p>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        </div>
                    )}
                </div>

                {/* Navigation - Beautiful UI with animations */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.path}
                                    onClick={closeMobileMenu}
                                    className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${location.pathname === item.path
                                            ? 'bg-amber-500 text-white shadow-md transform scale-105'
                                            : 'text-gray-700 hover:bg-amber-200 hover:translate-x-1'
                                        }
                    ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
                  `}
                                    title={!sidebarOpen && !isMobile ? item.name : ''}
                                >
                                    <span className={`${location.pathname === item.path ? 'text-white' : 'text-amber-600'} flex-shrink-0`}>
                                        {item.icon}
                                    </span>
                                    {(sidebarOpen || !isMobile) && (
                                        <span className="font-medium flex-1">{item.name}</span>
                                    )}
                                    {location.pathname === item.path && (sidebarOpen || !isMobile) && (
                                        <span className="ml-auto w-1 h-8 bg-white rounded-full"></span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Quick Stats - Beautiful UI with cards */}
                <div className="p-4 border-t border-amber-200 bg-amber-50">
                    {(sidebarOpen || !isMobile) ? (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white rounded-lg p-2 text-center hover:shadow-md transition-shadow">
                                <p className="text-gray-500">Today's Patients</p>
                                <p className="text-lg font-bold text-amber-600" id="todayPatients">24</p>
                            </div>
                            <div className="bg-white rounded-lg p-2 text-center hover:shadow-md transition-shadow">
                                <p className="text-gray-500">Pending Bills</p>
                                <p className="text-lg font-bold text-amber-600" id="pendingBills">8</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                        </div>
                    )}
                </div>

                {/* User Profile & Logout - Beautiful UI */}
                <div className="p-4 border-t border-amber-200 bg-white bg-opacity-50">
                    {(sidebarOpen || !isMobile) ? (
                        <>
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                    <span className="text-white font-bold">SR</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">Sarah Johnson</p>
                                    <p className="text-xs text-gray-500 truncate">Senior Receptionist</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                                <MdLogout className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Logout"
                        >
                            <MdLogout className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default SidePane;